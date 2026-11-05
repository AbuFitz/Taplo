import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { Pool } from "pg";
import { authOptions } from "../../src/server/auth/options";
import { TEST_DB_URL, createCleanDatabase } from "./db";

describe.skipIf(!TEST_DB_URL)(
  "maintained email-code auth on isolated PostgreSQL",
  () => {
    let db: Pool,
      drop: () => Promise<void>,
      auth: ReturnType<typeof betterAuth>;
    let latestCode = "",
      cookie = "";
    const email = "maker@example.test";
    const request = (path: string, body?: unknown, authenticated = false) =>
      auth.handler(
        new Request(`https://taplo.test/api/auth/${path}`, {
          method: body ? "POST" : "GET",
          headers: {
            origin: "https://taplo.test",
            "Content-Type": "application/json",
            ...(authenticated ? { cookie } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        }),
      );
    beforeAll(async () => {
      const setup = await createCleanDatabase();
      drop = setup.drop;
      await setup.pool.query("CREATE SCHEMA taplo_auth");
      const connection = new URL(TEST_DB_URL!);
      connection.pathname = `/${setup.name}`;
      db = new Pool({
        connectionString: connection.toString(),
        options: "-c search_path=taplo_auth",
      });
      const options = authOptions({
        database: db,
        baseURL: "https://taplo.test",
        secret: "isolated-test-only-secret-with-over-32-characters",
        send: async ({ otp }) => {
          latestCode = otp;
        },
      });
      // Explicit isolated adapter: avoid waiting 30 seconds between negative test attempts.
      options.rateLimit = { ...options.rateLimit, enabled: false };
      const plan = await getMigrations(options);
      await plan.runMigrations();
      auth = betterAuth(options);
    }, 30000);
    afterAll(async () => {
      await db?.end();
      await drop?.();
    });
    it("delivers a six-digit challenge through the test adapter and stores no plaintext code", async () => {
      const result = await request("email-otp/send-verification-otp", {
        email,
        type: "sign-in",
      });
      expect(result.status).toBe(200);
      expect(latestCode).toMatch(/^\d{6}$/);
      const values = (
        await db.query("SELECT value FROM verification")
      ).rows.map((r) => r.value);
      expect(values.length).toBeGreaterThan(0);
      expect(values.every((value) => value.split(":")[0] !== latestCode)).toBe(true);
    });
    it("rejects an incorrect code without opening a session", async () => {
      const wrong = latestCode === "000000" ? "111111" : "000000";
      const response = await request("sign-in/email-otp", {
        email,
        otp: wrong,
      });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(
        (await db.query("SELECT count(*) FROM session")).rows[0].count,
      ).toBe("0");
    });
    it("creates a verified cookie session and consumes the code once", async () => {
      const response = await request("sign-in/email-otp", {
        email,
        otp: latestCode,
      });
      expect(response.status).toBe(200);
      cookie = response.headers
        .getSetCookie()
        .map((value) => value.split(";")[0])
        .join("; ");
      expect(cookie).toContain("taplo.session_token=");
      const result = await request("get-session", undefined, true);
      expect((await result.json()).user.emailVerified).toBe(true);
      const replay = await request("sign-in/email-otp", {
        email,
        otp: latestCode,
      });
      expect(replay.status).toBeGreaterThanOrEqual(400);
      expect(
        (await db.query("SELECT count(*) FROM session")).rows[0].count,
      ).toBe("1");
    });
    it("revokes the server session on sign out", async () => {
      expect((await request("sign-out", {}, true)).status).toBe(200);
      expect(
        await (await request("get-session", undefined, true)).json(),
      ).toBeNull();
    });
  },
);
