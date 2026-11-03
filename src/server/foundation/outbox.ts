import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
export class UnknownOutcome extends Error {}
export class PermanentFailure extends Error {}
/** Only a definite rejection before acceptance may be retried automatically. */
export class DefiniteRetryableFailure extends Error {}
export interface OutboxEvent { id: string; event_type: string; subject_id: string; business_id: string | null; source_version: string; payload: Record<string, unknown>; attempt_count: number; lease_token: string }
/** Scoped worker connection only. Never hold a database transaction across a consumer/provider call. */
export async function processOne(db: Pool, consume: (event: OutboxEvent) => Promise<void>, random = Math.random): Promise<"idle" | "succeeded" | "queued" | "failed" | "uncertain"> {
  const client = await db.connect(); let event: OutboxEvent | undefined;
  try {
    await client.query("BEGIN"); await client.query("SET LOCAL ROLE taplo_worker");
    // An abandoned external call has an unknown result. Reconcile it; never blindly resend it.
    await client.query("UPDATE taplo.event_outbox SET status='uncertain',last_error_code='LEASE_EXPIRED' WHERE status='running' AND lease_until<now()");
    const result = await client.query("SELECT * FROM taplo.event_outbox WHERE status='queued' AND next_retry_at<=now() ORDER BY created_at,id FOR UPDATE SKIP LOCKED LIMIT 1");
    if (result.rows[0]) event = (await client.query("UPDATE taplo.event_outbox SET status='running',attempt_count=attempt_count+1,lease_until=now()+interval '30 seconds',lease_token=$2 WHERE id=$1 RETURNING *", [result.rows[0].id, randomUUID()])).rows[0];
    await client.query("COMMIT");
  } catch(e) { await client.query("ROLLBACK").catch(() => {}); throw e; }
  finally { client.release(); }
  if (!event) return "idle";
  let status: "succeeded" | "queued" | "failed" | "uncertain" = "succeeded", code: string | null = null;
  try { await consume(event); }
  catch(e) {
    status = e instanceof PermanentFailure ? "failed" : e instanceof DefiniteRetryableFailure ? (event.attempt_count >= 5 ? "failed" : "queued") : "uncertain";
    code = status === "uncertain" ? "OUTCOME_UNKNOWN" : status === "failed" ? "DISPATCH_FAILED" : "RETRY_SCHEDULED";
  }
  const finish = await db.connect();
  try {
    await finish.query("BEGIN"); await finish.query("SET LOCAL ROLE taplo_worker");
    const delay = Math.min(3600, 2 ** event.attempt_count * 5) + Math.floor(Math.max(0,Math.min(1,random())) * 5);
    const result = await finish.query("UPDATE taplo.event_outbox SET status=$3,last_error_code=$4,next_retry_at=now()+$5*interval '1 second',lease_until=NULL WHERE id=$1 AND lease_token=$2 AND status='running'", [event.id, event.lease_token, status, code, delay]);
    await finish.query("COMMIT");
    return result.rowCount ? status : "uncertain";
  } catch(e) { await finish.query("ROLLBACK").catch(() => {}); throw e; }
  finally { finish.release(); }
}
