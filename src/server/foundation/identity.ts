import { createClient } from "@supabase/supabase-js";
import type { Pool } from "pg";
import { CommandError, hidden, unavailable } from "./errors";
import type { Principal } from "./policy";
import { emit, newId } from "./commands";
/** Pin issuer/audience; verify with the maintained provider SDK before reading claims. No email-based account linking. */
export async function verifyPrincipal(
  db: Pool,
  token: string,
  options: { provision?: boolean } = {},
): Promise<Principal> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw unavailable();
  const auth = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous)
    throw new CommandError(
      "VERIFICATION_REQUIRED",
      401,
      "Sign in to continue.",
    );
  let claims: {
    iss?: string;
    sub?: string;
    aud?: string | string[];
    aal?: string;
    amr?: { method: string; timestamp: number }[];
  };
  try {
    claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
  } catch {
    throw hidden();
  }
  const expectedIssuer = `${url.replace(/\/$/, "")}/auth/v1`;
  if (
    claims.iss !== expectedIssuer ||
    claims.sub !== data.user.id ||
    ![claims.aud].flat().includes("authenticated")
  )
    throw hidden();
  const bound = await bindVerifiedIdentity(
    db,
    {
      provider: "supabase",
      subject: data.user.id,
      displayName:
        typeof data.user.user_metadata?.display_name === "string"
          ? data.user.user_metadata.display_name
          : undefined,
    },
    options,
  );
  const mfa = claims.amr
    ?.filter((a) => ["totp"].includes(a.method))
    .map((a) => a.timestamp * 1000)
    .sort((a, b) => b - a)[0];
  return {
    id: bound.id,
    audience: "merchant",
    assurance: claims.aal === "aal2" ? "aal2" : "aal1",
    stepUpAt: mfa,
  };
}

/** Called only after server-side provider/session verification. Never accepts identity claims from a route body. */
export async function bindVerifiedIdentity(
  db: Pool,
  verified: {
    provider: "supabase" | "better-auth";
    subject: string;
    displayName?: string;
  },
  options: { provision?: boolean } = {},
): Promise<Principal> {
  const c = await db.connect();
  try {
    await c.query("BEGIN");
    await c.query("SET LOCAL ROLE taplo_identity");
    await c.query("SELECT set_config('app.provider_subject',$1,true)", [
      verified.subject,
    ]);
    await c.query("SELECT set_config('app.identity_provider',$1,true)", [
      verified.provider,
    ]);
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
      `identity:${verified.provider}:${verified.subject}`,
    ]);
    const found = await c.query(
      'SELECT i.user_id,u.status FROM taplo.auth_identity i JOIN taplo."user" u ON u.id=i.user_id WHERE i.provider=$2 AND i.subject=$1',
      [verified.subject, verified.provider],
    );
    let userId = found.rows[0]?.user_id as string | undefined;
    if (userId && found.rows[0].status !== "active") throw hidden();
    if (!userId) {
      if (!options.provision) throw hidden();
      userId = newId("usr");
      await c.query("SELECT set_config('app.provisioned_user_id',$1,true)", [
        userId,
      ]);
      // Provider metadata is a display preference, never proof of identity, contact ownership or privileges.
      const displayName = verified.displayName?.trim().slice(0, 160) ?? "";
      await c.query(
        "INSERT INTO taplo.\"user\"(id,display_name,status) VALUES($1,$2,'active')",
        [userId, displayName || "Business owner"],
      );
      await c.query(
        "INSERT INTO taplo.auth_identity(provider,subject,user_id) VALUES($3,$1,$2)",
        [verified.subject, userId, verified.provider],
      );
      await c.query(
        "SELECT set_config('app.actor_id',$1,true),set_config('app.business_id','',true)",
        [userId],
      );
      await emit(c, {
        actorId: userId,
        action: "identity_bound.v1",
        subjectId: userId,
        version: 1,
        requestId: newId("req"),
        fields: ["provider_subject_binding", "display_name"],
      });
    }
    await c.query("COMMIT");
    return { id: userId, audience: "merchant", assurance: "aal1" };
  } catch (e) {
    await c.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}
