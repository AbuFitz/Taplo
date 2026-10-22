import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client, Pool } from "pg";

/** Integration DB harness. Skipped unless TAPLO_TEST_DATABASE_URL points at a throwaway Postgres server. */
export const TEST_DB_URL = process.env.TAPLO_TEST_DATABASE_URL;

const AUTH_STUB = `
  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  end $$;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  -- Same definition Supabase ships.
  create function auth.uid() returns uuid language sql stable as $$
    select coalesce(
      nullif(current_setting('request.jwt.claim.sub', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
  $$;
  grant usage on schema auth to anon, authenticated;
  grant usage on schema public to anon, authenticated;
`;

export async function createCleanDatabase(): Promise<{ pool: Pool; drop: () => Promise<void>; name: string }> {
  const admin = new Client({ connectionString: TEST_DB_URL });
  await admin.connect();
  const name = `taplo_test_${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
  await admin.query(`create database ${name}`);
  const url = new URL(TEST_DB_URL!);
  url.pathname = `/${name}`;
  const pool = new Pool({ connectionString: url.toString(), max: 20 });
  pool.on("error", () => {}); // idle-client errors during teardown are expected
  await pool.query(AUTH_STUB);
  const dir = join(process.cwd(), "supabase/migrations");
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    await pool.query(readFileSync(join(dir, f), "utf8"));
  }
  return {
    pool,
    name,
    drop: async () => {
      await pool.end();
      await admin.query(`drop database ${name}`);
      await admin.end();
    },
  };
}

export type Actor = { sub: string } | "anon";

/** Run SQL as an RLS-enforced role. Each call is its own transaction (rolled back unless commit). */
export async function as<T>(pool: Pool, actor: Actor, fn: (q: Client["query"]) => Promise<T>, commit = true): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query("begin");
    await c.query(`set local role ${actor === "anon" ? "anon" : "authenticated"}`);
    if (actor !== "anon") await c.query("select set_config('request.jwt.claim.sub', $1, true)", [actor.sub]);
    const out = await fn(c.query.bind(c) as Client["query"]);
    await c.query(commit ? "commit" : "rollback");
    return out;
  } catch (e) {
    await c.query("rollback").catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}
