import { Pool, type PoolClient } from "pg";
import { unavailable } from "./errors";
let pool: Pool | undefined;
export function database(): Pool {
  if (!process.env.TAPLO_DATABASE_URL) throw unavailable();
  return pool ??= new Pool({ connectionString: process.env.TAPLO_DATABASE_URL, max: 8, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 });
}
export interface Scope { businessId?: string; actorId: string; draftHash?: string; role?: "taplo_app" | "taplo_onboarding" }
/** All contexts are transaction-local, including after errors and pooled-connection reuse. */
export async function transaction<T>(db: Pool, scope: Scope, work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(scope.role === "taplo_onboarding" ? "SET LOCAL ROLE taplo_onboarding" : "SET LOCAL ROLE taplo_app");
    const { rows } = await client.query("SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user");
    if (rows[0]?.rolsuper !== false || rows[0]?.rolbypassrls !== false) throw unavailable();
    await client.query("SELECT set_config('app.business_id',$1,true),set_config('app.actor_id',$2,true),set_config('app.draft_hash',$3,true)", [scope.businessId ?? "", scope.actorId, scope.draftHash ?? ""]);
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (e) { await client.query("ROLLBACK").catch(() => {}); throw e; }
  finally { client.release(); }
}
