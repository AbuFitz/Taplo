import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/auth/[...all]/route";
afterEach(() => vi.unstubAllEnvs());
describe("restricted authentication surface", () => {
  it.each([
    "sign-up/email",
    "sign-in/email",
    "change-password",
    "link-social",
    "email-otp/reset-password",
  ])("does not expose %s", async (path) => {
    const response = await POST(
      new Request(`https://taplo.test/api/auth/${path}`, {
        method: "POST",
        headers: { origin: "https://taplo.test" },
      }),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("rejects cross-origin code requests before touching auth or email", async () => {
    const response = await POST(
      new Request(
        "https://taplo.test/api/auth/email-otp/send-verification-otp",
        { method: "POST", headers: { origin: "https://evil.test" } },
      ),
    );
    expect(response.status).toBe(403);
  });
  it("does not claim a session exists when required configuration is absent", async () => {
    vi.stubEnv("TAPLO_AUTH_ENABLED", "0");
    const response = await GET(
      new Request("https://taplo.test/api/auth/get-session"),
    );
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data).toMatchObject({ code: "TEMPORARILY_UNAVAILABLE" });
    expect(data).not.toHaveProperty("session");
  });
});

it("bounds code-request bodies before invoking the provider", async () => {
  const response = await POST(
    new Request("https://taplo.test/api/auth/email-otp/send-verification-otp", {
      method: "POST",
      headers: {
        origin: "https://taplo.test",
        "content-type": "application/json",
      },
      body: JSON.stringify({ padding: "x".repeat(5000) }),
    }),
  );
  expect(response.status).toBe(413);
});
it("only accepts sign-in code requests on the exposed email endpoint", async () => {
  const response = await POST(
    new Request("https://taplo.test/api/auth/email-otp/send-verification-otp", {
      method: "POST",
      headers: {
        origin: "https://taplo.test",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: "maker@example.test",
        type: "forget-password",
      }),
    }),
  );
  expect(response.status).toBe(400);
});
