import { describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { authOptions } from "./options";
describe("passwordless auth policy", () => {
  it("uses one first-party cookie origin without implicit account linking or password signup", () => {
    const options = authOptions({
      database: {} as Pool,
      baseURL: "https://app.mytaplo.com/ignored",
      secret: "test-only-not-live",
      send: async () => {},
    });
    expect(options.trustedOrigins).toEqual(["https://app.mytaplo.com"]);
    expect(options.emailAndPassword?.enabled).toBe(false);
    expect(options.account?.accountLinking?.enabled).toBe(false);
    expect(options.session?.cookieCache?.enabled).toBe(false);
    expect(options.advanced?.crossSubDomainCookies?.enabled).toBe(false);
    expect(options.advanced?.useSecureCookies).toBe(true);
    expect(options.rateLimit).toMatchObject({
      enabled: true,
      storage: "database",
    });
  });
});
