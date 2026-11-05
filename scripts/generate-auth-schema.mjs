import { writeFile } from "node:fs/promises";
import { Pool } from "pg";
import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/server/auth/options.ts";

// Compile only. Never run provider migrations during startup or from the web credential.
const url = process.env.TAPLO_AUTH_MIGRATION_DATABASE_URL;
const output = process.argv[2];
if (!url || !output?.endsWith(".sql")) throw new Error("Set TAPLO_AUTH_MIGRATION_DATABASE_URL and provide a new .sql output path.");
const database = new Pool({ connectionString: url, max: 1, options: "-c search_path=taplo_auth" });
try {
  const schema = await database.query("SELECT current_schema() AS name");
  if (schema.rows[0]?.name !== "taplo_auth") throw new Error("The reviewed taplo_auth namespace must exist first.");
  const options = authOptions({ database, baseURL: "https://auth-schema.taplo.test", secret: "schema-generation-only-never-a-runtime-secret", send: async () => { throw new Error("Schema generation cannot send email"); } });
  const plan = await getMigrations(options);
  if (plan.schemaProblems.length || plan.unsafeChanges.length) throw new Error("Auth schema requires manual review; refusing automatic output.");
  const sql = await plan.compileMigrations();
  await writeFile(output, `-- Generated with better-auth 1.7.17. Review before executing.\nBEGIN;\nSET LOCAL search_path TO taplo_auth;\n${sql}\nCOMMIT;\n`, { flag: "wx", mode: 0o600 });
  console.log("Compiled auth migration for review. No database changes executed.");
} finally { await database.end(); }
