/** Cookie sessions stay server-verified; no authentication tokens are written to browser storage. */
export type AccountResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "not-configured"
        | "failed"
        | "invalid-code"
        | "expired-code"
        | "rate-limited";
    };
export const accountsConfigured = () =>
  process.env.NEXT_PUBLIC_TAPLO_AUTH_PROVIDER === "better-auth";

async function authRequest(
  path: string,
  body: unknown,
): Promise<AccountResult> {
  if (!accountsConfigured()) return { ok: false, reason: "not-configured" };
  try {
    const response = await fetch(`/api/auth/${path}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      const acknowledged =
        path === "email-otp/send-verification-otp"
          ? data.success === true
          : typeof data.user?.id === "string";
      return acknowledged ? { ok: true } : { ok: false, reason: "failed" };
    }
    return {
      ok: false,
      reason:
        response.status === 429
          ? "rate-limited"
          : data.code === "OTP_EXPIRED"
            ? "expired-code"
            : data.code === "INVALID_OTP" || data.code === "TOO_MANY_ATTEMPTS"
              ? "invalid-code"
              : "failed",
    };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
export const requestSignInCode = (email: string) =>
  authRequest("email-otp/send-verification-otp", {
    email: email.trim(),
    type: "sign-in",
  });
export const verifySignInCode = (email: string, otp: string) =>
  authRequest("sign-in/email-otp", { email: email.trim(), otp });
export async function session(): Promise<{ signedIn: boolean }> {
  if (!accountsConfigured()) return { signedIn: false };
  try {
    const response = await fetch("/api/auth/get-session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    const data = response.ok ? await response.json() : null;
    return {
      signedIn: Boolean(
        data?.session?.id && data?.user?.id && data?.user?.emailVerified,
      ),
    };
  } catch {
    return { signedIn: false };
  }
}
