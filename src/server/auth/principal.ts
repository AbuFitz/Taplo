import type { Pool } from "pg";
import { authentication } from "./runtime";
import {
  bindVerifiedIdentity,
  verifyPrincipal,
} from "@/server/foundation/identity";
import { CommandError } from "@/server/foundation/errors";

/** One selected authority. A failed cookie session never falls back to a different provider. */
export async function verifyRequestPrincipal(
  db: Pool,
  request: Request,
  options: { provision?: boolean } = {},
) {
  if (process.env.TAPLO_AUTH_PROVIDER === "better-auth") {
    const auth = await authentication();
    const result = await auth.api.getSession({ headers: request.headers });
    if (!result?.user?.id || result.user.emailVerified !== true)
      throw new CommandError(
        "VERIFICATION_REQUIRED",
        401,
        "Sign in to continue.",
      );
    // Passwordless proves the account, not a strong second factor. Privileged actions remain gated by policy.
    return bindVerifiedIdentity(
      db,
      {
        provider: "better-auth",
        subject: result.user.id,
        displayName: result.user.name,
      },
      options,
    );
  }
  if (
    process.env.TAPLO_AUTH_PROVIDER &&
    process.env.TAPLO_AUTH_PROVIDER !== "supabase"
  )
    throw new CommandError(
      "VERIFICATION_REQUIRED",
      401,
      "Sign in to continue.",
    );
  const bearer = request.headers
    .get("authorization")
    ?.match(/^Bearer (\S+)$/)?.[1];
  if (!bearer)
    throw new CommandError(
      "VERIFICATION_REQUIRED",
      401,
      "Sign in to continue.",
    );
  return verifyPrincipal(db, bearer, options);
}
