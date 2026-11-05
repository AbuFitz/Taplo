import type { Pool } from "pg";
import {
  parseWorkspace,
  type WorkspaceSnapshot,
} from "@/features/setup/workspace";
import { validateRecord } from "./contracts";
import { transaction } from "./database";
import { CommandError, hidden } from "./errors";
import {
  authorise,
  type Membership,
  type Principal,
  type Role,
} from "./policy";

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
    const member = (
      await c.query(
        `SELECT m.* FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
      WHERE m.business_id=$1 AND m.user_id=$2 AND u.status='active'`,
        [businessId, principal.id],
      )
    ).rows[0];
    const membership: Membership | null = member
      ? {
          userId: member.user_id,
          businessId: member.business_id,
          role: member.role as Role,
          status: member.status,
          locationIds: member.location_ids,
          resourceIds: member.resource_ids,
        }
      : null;
    authorise(principal, membership, "business.profile.manage", { businessId });
    const row = (
      await c.query(
        "SELECT business_id,version,updated_at,snapshot FROM taplo.business_workspace WHERE business_id=$1",
        [businessId],
      )
    ).rows[0];
    if (!row) throw hidden();
    return validateRecord("BusinessWorkspace", {
      business_id: row.business_id as string,
      version: Number(row.version),
      updated_at: (row.updated_at as Date).toISOString(),
      workspace_snapshot: validateWorkspace(row.snapshot),
    });
  });
}
