import { afterEach, describe, expect, it, vi } from "vitest";
import { requestSignInCode, session, verifySignInCode } from "./account";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("passwordless browser adapter", () => {
  it("requires explicit presentation configuration without sending credentials", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPLO_AUTH_PROVIDER", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect(await requestSignInCode("maker@example.test")).toMatchObject({
      ok: false,
      reason: "not-configured",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("requires a real code-send acknowledgement, not merely a successful status", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPLO_AUTH_PROVIDER", "better-auth");
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}))
      .mockResolvedValueOnce(Response.json({ success: true }));
    vi.stubGlobal("fetch", fetcher);
    expect(await requestSignInCode("maker@example.test")).toMatchObject({
      ok: false,
    });
    expect(await requestSignInCode("maker@example.test")).toMatchObject({
      ok: true,
    });
    expect(fetcher.mock.calls[0][1]).toMatchObject({
      credentials: "same-origin",
    });
  });
  it("reports code expiry and throttling without calling either successful", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPLO_AUTH_PROVIDER", "better-auth");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({ code: "OTP_EXPIRED" }, { status: 400 }),
        )
        .mockResolvedValueOnce(Response.json({}, { status: 429 })),
    );
    expect(
      await verifySignInCode("maker@example.test", "123456"),
    ).toMatchObject({ ok: false, reason: "expired-code" });
    expect(await requestSignInCode("maker@example.test")).toMatchObject({
      ok: false,
      reason: "rate-limited",
    });
  });
  it("requires the server's verified session rather than a sign-in-shaped payload", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPLO_AUTH_PROVIDER", "better-auth");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({
            user: { id: "user", emailVerified: false },
            session: { id: "session" },
          }),
        )
        .mockResolvedValueOnce(
          Response.json({
            user: { id: "user", emailVerified: true },
            session: { id: "session" },
          }),
        ),
    );
    expect(await session()).toEqual({ signedIn: false });
    expect(await session()).toEqual({ signedIn: true });
  });
});
