import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { authOptions } from "./options";
import { unavailable } from "@/server/foundation/errors";

let instance: ReturnType<typeof betterAuth> | undefined;
/** Separate auth credential: never use the tenant runtime or migration-owner connection. No automatic migrations. */
let initializing: Promise<ReturnType<typeof betterAuth>> | undefined;
export function authentication() {
  return (initializing ??= createAuthentication().catch((error) => {
    initializing = undefined;
    throw error;
  }));
}
async function createAuthentication() {
  if (instance) return instance;
  const url = process.env.TAPLO_AUTH_DATABASE_URL;
  const secret = process.env.TAPLO_AUTH_SECRET;
  const baseURL = process.env.TAPLO_AUTH_BASE_URL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.TAPLO_SECURITY_EMAIL_FROM;
  if (
    process.env.TAPLO_AUTH_ENABLED !== "1" ||
    !url ||
    !secret ||
    secret.length < 32 ||
    !baseURL ||
    !apiKey ||
    !from
  )
    throw unavailable();
  const parsed = new URL(baseURL);
  if (
    parsed.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" && parsed.hostname === "localhost")
  )
    throw unavailable();
  const pool = new Pool({
    connectionString: url,
    max: 5,
    connectionTimeoutMillis: 5000,
    options: "-c search_path=taplo_auth",
  });
  try {
    const { rows } =
      await pool.query(`SELECT rolsuper,rolbypassrls,rolcreaterole,rolcreatedb,
      EXISTS(SELECT 1 FROM pg_roles target WHERE target.rolname IN ('taplo_owner','taplo_worker','taplo_app','taplo_identity','taplo_onboarding') AND pg_has_role(current_user,target.oid,'SET')) AS tenant_access
      FROM pg_roles WHERE rolname=current_user`);
    if (!rows[0] || Object.values(rows[0]).some((value) => value !== false))
      throw unavailable();
  } catch (error) {
    await pool.end();
    throw error;
  }
  instance = betterAuth(
    authOptions({
      database: pool,
      secret,
      baseURL,
      send: async ({ email, otp, type }) => {
        if (type !== "sign-in") throw unavailable();
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          signal: AbortSignal.timeout(10000),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [email],
            subject: "Your Taplo sign-in code",
            text: `Your Taplo code is ${otp}.\n\nIt expires in 10 minutes. Use the latest code, and never share it with anyone.\n\nIf you didn’t request this, you can ignore this email.`,
          }),
        });
        if (!response.ok) throw unavailable();
      },
    }),
  );
  return instance;
}
