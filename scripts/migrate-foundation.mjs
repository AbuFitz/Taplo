import { readFile } from "node:fs/promises";
import pg from "pg";
if (!process.env.TAPLO_MIGRATION_DATABASE_URL) throw new Error("Set TAPLO_MIGRATION_DATABASE_URL to an isolated database; no fallback to production credentials.");
if (process.env.TAPLO_APPLY_FOUNDATION !== "yes") throw new Error("Review the inventory and migration, then set TAPLO_APPLY_FOUNDATION=yes.");
const client = new pg.Client({ connectionString: process.env.TAPLO_MIGRATION_DATABASE_URL });
await client.connect();
try {
 const existing = await client.query("SELECT to_regclass('taplo.schema_migration') AS existing");
 if (existing.rows[0].existing) throw new Error("Foundation already exists. Inspect migration history before applying changes.");
 await client.query(await readFile(new URL("../db/migrations/0001_foundation.sql", import.meta.url), "utf8"));
 console.log("Applied additive foundation 0001. Legacy public tables unchanged.");
} finally { await client.end(); }
