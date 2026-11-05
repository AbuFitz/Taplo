import type { Pool } from "pg";
import { transaction } from "./database";
import { emit, hash, idempotent, newId } from "./commands";
import { validateInput, validateRecord } from "./contracts";
import { CommandError, hidden } from "./errors";
import type { Principal } from "./policy";

interface ClaimInput { draft_id: string; expected_draft_version: number }
export interface ClaimedBusiness {
  id: string; version: number; created_at: string; updated_at: string;
  display_name: string; handle: string; status: "draft"; capabilities: string[]; timezone: string;
}
function project(row: Record<string, unknown>): ClaimedBusiness {
  const date = (v: unknown) => v instanceof Date ? v.toISOString() : String(v);
  return validateRecord("Business", {
    id: String(row.id), version: Number(row.version), created_at: date(row.created_at), updated_at: date(row.updated_at),
    display_name: String(row.display_name), handle: String(row.handle), status: "draft" as const,
    capabilities: row.capabilities as string[], timezone: String(row.timezone),
  });
}
/** Credential, current principal, aggregate, membership, receipt and events share one transaction. */
export async function claimDraft(db: Pool, principal: Principal, token: string, raw: unknown, key: string, requestId: string) {
  const input = validateInput<ClaimInput>("ClaimOnboardingDraft", raw);
  if (principal.audience !== "merchant") throw hidden();
  if (!/^[a-f0-9]{64}$/.test(token)) throw hidden();
  return transaction(db, { actorId: principal.id, draftHash: hash(token), role: "taplo_onboarding" }, async (c) => {
    const user = await c.query("SELECT status FROM taplo.\"user\" WHERE id=$1", [principal.id]);
    if (user.rows[0]?.status !== "active") throw hidden();
    // Check the bound credential even for an idempotent replay. Expired or foreign cookies cannot recover a claim receipt.
    const found = await c.query("SELECT * FROM taplo.onboarding_draft WHERE id=$1 FOR UPDATE", [input.draft_id]);
    const draft = found.rows[0];
    if (!draft) throw hidden();
    return idempotent(c, { actorId: principal.id, command: "ClaimOnboardingDraft", key, requestId, input }, async () => {
      if (draft.claimed_by) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "This setup has already been claimed. Open your business to continue.");
      if (Number(draft.version) !== input.expected_draft_version) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "Your setup has changed. Reload it before continuing.");
      const name = String(draft.display_name).trim();
      if (!name || name.length > 160) throw new CommandError("RULE_NOT_SATISFIED", 422, "Use a business name of up to 160 characters.");
      const businessId = newId("biz");
      // A private draft gets an available initial handle; choosing a public address is a separate owner action.
      const stem = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48).replace(/-$/, "") || "business";
      const handle = `${stem}-${businessId.slice(-16)}`;
      await c.query("SELECT set_config('app.business_id',$1,true)", [businessId]);
      const business = (await c.query("INSERT INTO taplo.business(id,display_name,handle,capabilities) VALUES($1,$2,$3,$4) RETURNING *", [businessId, name, handle, JSON.stringify(draft.capabilities)])).rows[0];
      await c.query("INSERT INTO taplo.membership(id,business_id,user_id,role,status) VALUES($1,$2,$3,'owner','active')", [newId("mem"), businessId, principal.id]);
      await c.query("UPDATE taplo.onboarding_draft SET claimed_by=$2,claimed_business_id=$3,version=version+1,updated_at=now() WHERE id=$1", [draft.id, principal.id, businessId]);
      const value = project(business);
      await emit(c, { businessId, actorId: principal.id, action: "claim_onboarding_draft.v1", subjectId: businessId, version: value.version, requestId, fields: ["display_name", "handle", "capabilities", "owner_membership"] });
      // Claim receipts are principal-scoped, because the target business did not exist at request time.
      await c.query("SELECT set_config('app.business_id','',true)");
      return value;
    });
  });
}
