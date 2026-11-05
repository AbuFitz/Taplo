import { afterEach, describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";
const { getSession, bind, bearer } = vi.hoisted(() => ({
  getSession: vi.fn(),
  bind: vi.fn(),
  bearer: vi.fn(),
}));
vi.mock("./runtime", () => ({
  authentication: async () => ({ api: { getSession } }),
}));
vi.mock("@/server/foundation/identity", () => ({
  bindVerifiedIdentity: bind,
  verifyPrincipal: bearer,
}));
import { verifyRequestPrincipal } from "./principal";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});
describe("single selected session authority", () => {
  const db = {} as Pool;
  const request = () =>
    new Request("https://taplo.test/v1/onboarding/claim", {
      headers: {
        cookie: "session=signed",
        authorization: "Bearer other-provider",
      },
    });
  it("uses only the verified cookie subject and provisions only when requested", async () => {
    vi.stubEnv("TAPLO_AUTH_PROVIDER", "better-auth");
    getSession.mockResolvedValue({
      user: { id: "provider-subject", emailVerified: true, name: "Owner" },
    });
    bind.mockResolvedValue({
      id: "usr_bound",
      audience: "merchant",
      assurance: "aal1",
    });
    expect(
      await verifyRequestPrincipal(db, request(), { provision: true }),
    ).toMatchObject({ assurance: "aal1" });
    expect(bind).toHaveBeenCalledWith(
      db,
      {
        provider: "better-auth",
        subject: "provider-subject",
        displayName: "Owner",
      },
      { provision: true },
    );
    expect(bearer).not.toHaveBeenCalled();
  });
  it.each([null, { user: { id: "subject", emailVerified: false } }])(
    "does not fall back to a bearer token for a missing/unverified cookie session",
    async (result) => {
      vi.stubEnv("TAPLO_AUTH_PROVIDER", "better-auth");
      getSession.mockResolvedValue(result);
      await expect(verifyRequestPrincipal(db, request())).rejects.toMatchObject(
        { status: 401 },
      );
      expect(bind).not.toHaveBeenCalled();
      expect(bearer).not.toHaveBeenCalled();
    },
  );
  it("rejects an unknown provider instead of silently selecting a different authority", async () => {
    vi.stubEnv("TAPLO_AUTH_PROVIDER", "misspelled-provider");
    await expect(verifyRequestPrincipal(db, request())).rejects.toMatchObject({
      status: 401,
    });
    expect(getSession).not.toHaveBeenCalled();
    expect(bearer).not.toHaveBeenCalled();
  });
});
