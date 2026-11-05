import { readFile } from "node:fs/promises";
import pg from "pg";
if (!process.env.TAPLO_MIGRATION_DATABASE_URL) throw new Error("Set TAPLO_MIGRATION_DATABASE_URL to an isolated database; no fallback to production credentials.");
if (process.env.TAPLO_APPLY_FOUNDATION !== "yes") throw new Error("Review the inventory and migrations, then set TAPLO_APPLY_FOUNDATION=yes.");
const migrations = ["0001_foundation", "0002_onboarding_claim"];
const client = new pg.Client({ connectionString: process.env.TAPLO_MIGRATION_DATABASE_URL });
await client.connect();
try {
 await client.query("SELECT pg_advisory_lock(hashtextextended('taplo:migrations',0))");
 const existing = await client.query("SELECT to_regclass('taplo.schema_migration') AS existing");
 const applied = existing.rows[0].existing ? (await client.query("SELECT version FROM taplo.schema_migration ORDER BY version")).rows.map(row => row.version) : [];
 if (applied.some(version => !migrations.includes(version))) throw new Error("Unknown migration history. Inspect before applying changes.");
 if (applied.some((version, index) => migrations[index] !== version)) throw new Error("Migration history has a gap. Inspect before applying changes.");
 for (const version of migrations) {
  if (applied.includes(version)) continue;
  await client.query(await readFile(new URL(`../db/migrations/${version}.sql`, import.meta.url), "utf8"));
  console.log(`Applied additive migration ${version}. Legacy public tables unchanged.`);
 }
} finally { await client.end(); }
