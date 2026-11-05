/** Provision a restricted web login after reviewed migrations. Never rotates an existing credential. */
import { randomBytes } from "node:crypto";
import { open, unlink } from "node:fs/promises";
import pg from "pg";
if (!process.env.TAPLO_MIGRATION_DATABASE_URL || process.env.TAPLO_PROVISION_RUNTIME !== "yes") throw new Error("Set a reviewed TAPLO_MIGRATION_DATABASE_URL and TAPLO_PROVISION_RUNTIME=yes.");
const target = process.env.TAPLO_RUNTIME_ENV_FILE;
if (!target || !/(^|\/)\.env\.[a-z0-9.-]+\.local$/.test(target)) throw new Error("Choose a private .env.*.local output file. Existing files are never overwritten.");
const adminUrl = new URL(process.env.TAPLO_MIGRATION_DATABASE_URL);
if (adminUrl.hostname.includes("-pooler.")) throw new Error("Use a direct migration connection.");
const client = new pg.Client({ connectionString: adminUrl.toString() });
let handle, started = false, commitAttempted = false;
try {
 await client.connect();
 await client.query("BEGIN"); started = true;
 await client.query("SELECT pg_advisory_xact_lock(hashtextextended('taplo:runtime-provision',0))");
 const existing = await client.query("SELECT 1 FROM pg_roles WHERE rolname='taplo_runtime'");
 if (existing.rows.length) throw new Error("taplo_runtime already exists. Reuse its existing credential; this command will not rotate it.");
 const migrations = (await client.query("SELECT version FROM taplo.schema_migration ORDER BY version")).rows.map(row => row.version);
 if (!["0001_foundation","0002_onboarding_claim","0003_offer_drafts"].every(version => migrations.includes(version))) throw new Error("Apply and verify the foundation migrations first.");
 handle = await open(target, "wx", 0o600);
 const password = randomBytes(32).toString("base64url");
 // Password is generated from a restricted alphabet; it is never logged or returned to a browser.
 await client.query(`CREATE ROLE taplo_runtime LOGIN PASSWORD '${password}' NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS`);
 await client.query("GRANT taplo_app,taplo_identity,taplo_onboarding TO taplo_runtime WITH INHERIT FALSE, SET TRUE");
 await client.query(`GRANT CONNECT ON DATABASE ${client.escapeIdentifier(adminUrl.pathname.slice(1))} TO taplo_runtime`);
 const runtimeUrl = new URL(adminUrl);
 runtimeUrl.username = "taplo_runtime"; runtimeUrl.password = password;
 runtimeUrl.searchParams.set("sslmode", "verify-full");
 if (runtimeUrl.hostname.endsWith(".neon.tech")) runtimeUrl.hostname = runtimeUrl.hostname.replace(/^([^.]+)\./, "$1-pooler.");
 await handle.writeFile(`TAPLO_DATABASE_URL=${runtimeUrl}\n`);
 await handle.sync();
 commitAttempted = true;
 await client.query("COMMIT"); started = false;
 console.log("Provisioned taplo_runtime (non-owner, no RLS bypass, no worker/admin role). Private connection configuration saved.");
} catch (error) {
 if (started) await client.query("ROLLBACK").catch(() => {});
 // Preserve the credential file if the commit outcome is uncertain; never retry/rotate blindly.
 if (handle && !commitAttempted) {
  await handle.close().catch(() => {});
  handle = undefined;
  await unlink(target).catch(() => {});
 }
 throw error;
} finally { await handle?.close(); await client.end(); }
