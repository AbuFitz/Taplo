import type { Pool } from "pg";
import {
  parseWorkspace,
  type WorkspaceSnapshot,
} from "@/features/setup/workspace";
import { validateInput, validateRecord } from "./contracts";
import { transaction } from "./database";
import { emit, idempotent } from "./commands";
import { CommandError, hidden } from "./errors";
import {
  authorise,
  type Membership,
  type Principal,
  type Role,
} from "./policy";

interface SaveWorkspaceInput {
  expected_version: number;
  workspace_snapshot: WorkspaceSnapshot;
}
function projectWorkspace(row: Record<string, unknown>) {
  return validateRecord("BusinessWorkspace", {
    business_id: String(row.business_id),
    version: Number(row.version),
    updated_at:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : String(row.updated_at),
    workspace_snapshot: validateWorkspace(row.snapshot),
  });
}
async function profileMembership(
  c: import("pg").PoolClient,
  principal: Principal,
  businessId: string,
): Promise<Membership | null> {
  const member = (
    await c.query(
      `SELECT m.* FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
      WHERE m.business_id=$1 AND m.user_id=$2 AND u.status='active'`,
      [businessId, principal.id],
    )
  ).rows[0];
  return member
    ? {
        userId: member.user_id,
        businessId: member.business_id,
        role: member.role as Role,
        status: member.status,
        locationIds: member.location_ids,
        resourceIds: member.resource_ids,
      }
    : null;
}

export function validateWorkspace(input: unknown): WorkspaceSnapshot {
  try {
    return parseWorkspace(input);
  } catch {
    throw new CommandError(
      "RULE_NOT_SATISFIED",
      422,
      "We couldn’t save this complete draft. Your changes are still here. Review your details and images before trying again.",
      false,
      [{ path: "/workspace_snapshot", message_key: "validation.workspace" }],
    );
  }
}

/** Read the private claimed document only with current merchant/profile authority. */
export async function readBusinessWorkspace(
  db: Pool,
  principal: Principal,
  businessId: string,
) {
  return transaction(db, { actorId: principal.id, businessId }, async (c) => {
    const membership = await profileMembership(c, principal, businessId);
    authorise(principal, membership, "business.profile.manage", { businessId });
    const row = (
      await c.query(
        "SELECT business_id,version,updated_at,snapshot FROM taplo.business_workspace WHERE business_id=$1",
        [businessId],
      )
    ).rows[0];
    if (!row) throw hidden();
    return projectWorkspace(row);
  });
}

/** Optimistic, authenticated edit of a private authoring document. No publication or operational effects. */
export async function saveBusinessWorkspace(
  db: Pool,
  principal: Principal,
  businessId: string,
  raw: unknown,
  key: string,
  requestId: string,
) {
  const input = validateInput<SaveWorkspaceInput>("SaveBusinessWorkspace", raw);
  input.workspace_snapshot = validateWorkspace(input.workspace_snapshot);
  return transaction(db, { actorId: principal.id, businessId }, async (c) => {
    const membership = await profileMembership(c, principal, businessId);
    const business = (
      await c.query("SELECT status FROM taplo.business WHERE id=$1", [businessId])
    ).rows[0];
    if (!business) throw hidden();
    authorise(principal, membership, "business.profile.manage", {
      businessId,
      allowedState: !["closing", "closed"].includes(business.status),
    });
    const row = (
      await c.query(
        "SELECT * FROM taplo.business_workspace WHERE business_id=$1 FOR UPDATE",
        [businessId],
      )
    ).rows[0];
    if (!row) throw hidden();
    return idempotent(
      c,
      {
        businessId,
        actorId: principal.id,
        command: "SaveBusinessWorkspace",
        key,
        requestId,
        input,
      },
      async () => {
        if (Number(row.version) !== input.expected_version)
          throw new CommandError(
            "VERSION_OR_AVAILABILITY_CONFLICT",
            409,
            "Your workspace changed elsewhere. Review the latest version before saving.",
          );
        const count = await c.query(
          "INSERT INTO taplo.rate_window(scope,window_start,count) VALUES($1,date_trunc('minute',now()),1) ON CONFLICT(scope,window_start) DO UPDATE SET count=taplo.rate_window.count+1 RETURNING count",
          [principal.id],
        );
        if (count.rows[0].count > 30)
          throw new CommandError(
            "RATE_LIMITED",
            429,
            "Please wait a moment before saving again.",
            true,
          );
        const saved = (
          await c.query(
            "UPDATE taplo.business_workspace SET snapshot=$2::jsonb,version=version+1,updated_at=now() WHERE business_id=$1 RETURNING *",
            [businessId, JSON.stringify(input.workspace_snapshot)],
          )
        ).rows[0];
        if (!saved) throw hidden();
        const value = projectWorkspace(saved);
        await emit(c, {
          businessId,
          actorId: principal.id,
          action: "save_business_workspace.v1",
          subjectId: businessId,
          version: value.version,
          requestId,
          fields: ["workspace_snapshot"],
        });
        return value;
      },
      {
        // A receipt only acknowledges a version; do not duplicate private images in every receipt.
        project: ({ business_id, version, updated_at }) => ({
          business_id,
          version,
          updated_at,
        }),
        replay: async (stored) => {
          if (Number(row.version) !== stored.version)
            throw new CommandError(
              "VERSION_OR_AVAILABILITY_CONFLICT",
              409,
              "Your workspace changed elsewhere. Review the latest version before saving.",
            );
          return projectWorkspace(row);
        },
      },
    );
  });
}
