import type { Pool } from "pg";
import type { BetterAuthOptions } from "better-auth";
import { emailOTP } from "better-auth/plugins";

export interface SecurityEmail {
  email: string;
  otp: string;
  type: string;
}
/** No password endpoints, implicit account links, or client-supplied assurance. */
export function authOptions(input: {
  database: Pool;
  baseURL: string;
  secret: string;
  send: (message: SecurityEmail) => Promise<void>;
}): BetterAuthOptions {
  const origin = new URL(input.baseURL).origin;
  return {
    appName: "Taplo",
    baseURL: origin,
    basePath: "/api/auth",
    secret: input.secret,
    database: input.database,
    trustedOrigins: [origin],
    emailAndPassword: { enabled: false },
    account: { accountLinking: { enabled: false } },
    session: {
      expiresIn: 7 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
      cookieCache: { enabled: false },
    },
    advanced: {
      cookiePrefix: "taplo",
      useSecureCookies: new URL(origin).protocol === "https:",
      crossSubDomainCookies: { enabled: false },
    },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 20 },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 600,
        allowedAttempts: 5,
        storeOTP: "hashed",
        resendStrategy: "rotate",
        rateLimit: { window: 30, max: 1 },
        sendVerificationOTP: input.send,
      }),
    ],
  };
}
