import type { Pool } from "pg";
import { transaction } from "./database";
import { authorise, type Membership, type Principal, type Role } from "./policy";
import { hidden } from "./errors";
import { validateInput, validateRecord } from "./contracts";
/** Current membership is rechecked even when polling an earlier accepted operation. */
export async function getOperation(db: Pool, principal: Principal, businessId: string, raw: unknown) {
  const input = validateInput<{ operation_id: string }>("GetOperation", raw);
  return transaction(db, { actorId: principal.id, businessId }, async (c) => {
    const member = (await c.query("SELECT m.* FROM taplo.membership m JOIN taplo.\"user\" u ON u.id=m.user_id WHERE m.business_id=$1 AND m.user_id=$2 AND u.status='active'", [businessId, principal.id])).rows[0];
    const membership: Membership | null = member ? { userId: member.user_id, businessId: member.business_id, role: member.role as Role, status: member.status, locationIds: member.location_ids, resourceIds: member.resource_ids } : null;
    const row = (await c.query("SELECT p.* FROM taplo.provider_operation p WHERE p.id=$1 AND EXISTS (SELECT 1 FROM taplo.membership m JOIN taplo.\"user\" u ON u.id=m.user_id WHERE m.business_id=p.business_id AND m.user_id=current_setting('app.actor_id',true) AND m.status='active' AND u.status='active')", [input.operation_id])).rows[0];
    if (!row) throw hidden();
    authorise(principal, membership, "own_work.read", { businessId, subjectUserId: row.actor_id });
    const date = (value: Date | string) => value instanceof Date ? value.toISOString() : value;
    // Construct a closed projection; internal leases, credentials and opaque provider references never escape.
    return validateRecord("ProviderOperation", { id: row.id, version: Number(row.version), created_at: date(row.created_at), updated_at: date(row.updated_at), business_id: row.business_id, provider: row.provider, operation_kind: row.operation_kind, subject_id: row.subject_id, status: row.status, attempt_count: row.attempt_count, idempotency_ref: row.idempotency_ref, ...(row.next_retry_at ? { next_retry_at: date(row.next_retry_at) } : {}), ...(row.last_error_code ? { last_error_code: row.last_error_code } : {}) });
  });
}
