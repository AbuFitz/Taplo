import type { Pool } from "pg";
import { transaction } from "./database";
import { emit, hash, idempotent, newId } from "./commands";
import { validateInput, validateRecord } from "./contracts";
import { CommandError, hidden } from "./errors";
export interface DraftInput { draft_id?: string; expected_version: number; display_name: string; category_query?: string; look_id?: string; introduction?: string }
export interface Draft { id: string; version: number; created_at: string; updated_at: string; display_name: string; category_query: string; capabilities: string[]; look_id: string; introduction: string; expires_at: string }
function project(row: Record<string, unknown>): Draft {
  const date = (v: unknown) => v instanceof Date ? v.toISOString() : String(v);
  return validateRecord("OnboardingDraft", { id: String(row.id), version: Number(row.version), created_at: date(row.created_at), updated_at: date(row.updated_at), display_name: String(row.display_name), category_query: String(row.category_query), capabilities: row.capabilities as string[], look_id: String(row.look_id), introduction: String(row.introduction), expires_at: date(row.expires_at) });
}
export async function readDraft(db: Pool, token: string): Promise<Draft | null> {
  const sessionHash = hash(token);
  return transaction(db, { actorId: `anonymous_${sessionHash}`, draftHash: sessionHash }, async (c) => {
    const result = await c.query("SELECT * FROM taplo.onboarding_draft ORDER BY updated_at DESC LIMIT 1");
    return result.rows[0] ? project(result.rows[0]) : null;
  });
}
export async function upsertDraft(db: Pool, token: string, raw: unknown, key: string, requestId: string, expectedHeader?: string | null) {
  const input = validateInput<DraftInput>("UpsertOnboardingDraft", raw);
  if (!input.display_name.trim()) throw new CommandError("RULE_NOT_SATISFIED", 422, "Add your business name.");
  if (input.draft_id && expectedHeader !== `"${input.expected_version}"`) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "Your draft has changed. Reload it before saving.");
  const sessionHash = hash(token), actorId = `anonymous_${sessionHash}`;
  return transaction(db, { actorId, draftHash: sessionHash }, (c) => idempotent(c, { actorId, command: "UpsertOnboardingDraft", key, requestId, input }, async () => {
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`draft-session:${sessionHash}`]);
    const count = await c.query("INSERT INTO taplo.rate_window(scope,window_start,count) VALUES($1,date_trunc('minute',now()),1) ON CONFLICT(scope,window_start) DO UPDATE SET count=taplo.rate_window.count+1 RETURNING count", [actorId]);
    if (count.rows[0].count > 30) throw new CommandError("RATE_LIMITED", 429, "Please wait a moment before saving again.", true);
    let row;
    if (input.draft_id) {
      const found = await c.query("SELECT * FROM taplo.onboarding_draft WHERE id=$1 FOR UPDATE", [input.draft_id]);
      if (!found.rows[0]) throw hidden();
      if (Number(found.rows[0].version) !== input.expected_version) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "Your draft has changed. Reload it before saving.");
      row = (await c.query("UPDATE taplo.onboarding_draft SET version=version+1,updated_at=now(),display_name=$2,category_query=$3,look_id=$4,introduction=$5 WHERE id=$1 RETURNING *", [input.draft_id, input.display_name, input.category_query ?? found.rows[0].category_query, input.look_id ?? found.rows[0].look_id, input.introduction ?? found.rows[0].introduction])).rows[0];
    } else {
      if (input.expected_version !== 0) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "Reload your draft before saving.");
      const existing = await c.query("SELECT id FROM taplo.onboarding_draft FOR UPDATE");
      if (existing.rows.length) throw new CommandError("VERSION_OR_AVAILABILITY_CONFLICT", 409, "A saved draft is available. Reload it to continue.");
      row = (await c.query("INSERT INTO taplo.onboarding_draft(id,session_hash,display_name,category_query,look_id,introduction) VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [newId("draft"), sessionHash, input.display_name, input.category_query ?? "", input.look_id ?? "standard", input.introduction ?? ""])).rows[0];
    }
    const value = project(row);
    await emit(c, { actorId, action: "upsert_onboarding_draft.v1", subjectId: value.id, version: value.version, requestId, fields: ["display_name", "category_query", "look_id", "introduction"] });
    return value;
  }, async value => {
    // A claim revokes anonymous access, including old successful save receipts.
    const visible = await c.query("SELECT id FROM taplo.onboarding_draft WHERE id=$1", [value.id]);
    if (!visible.rows[0]) throw hidden();
  }));
}
