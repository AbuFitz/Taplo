import { createHash, randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { CommandError } from "./errors";
export const newId = (prefix: string) =>
  `${prefix}_${randomBytes(16).toString("hex")}`;
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, stable(v)]),
    );
  return value;
}
export interface CommandContext {
  businessId?: string;
  actorId: string;
  command: string;
  key: string;
  requestId: string;
  input: unknown;
}
/** Reserve/check the receipt before side effects. The caller's transaction also owns aggregate, audit and outbox changes. */
export async function idempotent<T>(
  client: PoolClient,
  context: CommandContext,
  work: () => Promise<T>,
  receiptOptions?: {
    replay?: (stored: T) => Promise<T>;
    project?: (value: T) => unknown;
  },
): Promise<{ value: T; replayed: boolean }> {
  if (!/^[A-Za-z0-9._:-]{8,160}$/.test(context.key))
    throw new CommandError("INVALID_INPUT", 400, "Please retry the action.");
  const scope = JSON.stringify([
    context.businessId ?? "",
    context.actorId,
    context.command,
    context.key,
  ]);
  const payloadHash = hash(JSON.stringify(stable(context.input)));
  await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
    scope,
  ]);
  const receipt = await client.query(
    "SELECT payload_hash,response,expires_at FROM taplo.command_receipt WHERE scope=$1",
    [scope],
  );
  if (receipt.rows[0]) {
    if (new Date(receipt.rows[0].expires_at).getTime() <= Date.now())
      throw new CommandError(
        "IDEMPOTENCY_KEY_EXPIRED",
        409,
        "Please start this action again.",
      );
    if (receipt.rows[0].payload_hash !== payloadHash)
      throw new CommandError(
        "IDEMPOTENCY_CONFLICT",
        409,
        "This action has changed. Review the details and try again.",
      );
    const value = receipt.rows[0].response as T;
    return {
      value: receiptOptions?.replay
        ? await receiptOptions.replay(value)
        : value,
      replayed: true,
    };
  }
  const value = await work();
  await client.query(
    "INSERT INTO taplo.command_receipt(scope,business_id,actor_id,command,key,payload_hash,response,request_id,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
    [
      scope,
      context.businessId ?? null,
      context.actorId,
      context.command,
      context.key,
      payloadHash,
      JSON.stringify(
        receiptOptions?.project ? receiptOptions.project(value) : value,
      ),
      context.requestId,
      context.command === "UpsertOnboardingDraft"
        ? (value as { expires_at: string }).expires_at
        : new Date(Date.now() + 90 * 86400000),
    ],
  );
  return { value, replayed: false };
}
export async function emit(
  client: PoolClient,
  input: {
    businessId?: string;
    actorId: string;
    action: string;
    subjectId: string;
    version: number;
    requestId: string;
    fields: string[];
  },
) {
  const id = newId("evt");
  const payload = {
    subject_id: input.subjectId,
    version: input.version,
    request_id: input.requestId,
  };
  await client.query(
    "INSERT INTO taplo.audit_event(id,business_id,actor_id,action,target_id,request_id,changed_field_names) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [
      newId("audit"),
      input.businessId ?? null,
      input.actorId,
      input.action,
      input.subjectId,
      input.requestId,
      JSON.stringify(input.fields),
    ],
  );
  await client.query(
    "INSERT INTO taplo.event_outbox(id,business_id,actor_id,event_type,subject_id,source_version,payload) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [
      id,
      input.businessId ?? null,
      input.actorId,
      input.action,
      input.subjectId,
      input.version,
      JSON.stringify(payload),
    ],
  );
}
