import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/v1/businesses/[business_id]/workspace/route";
import { CommandError } from "./errors";

const mocks = vi.hoisted(() => ({ db: vi.fn(), principal: vi.fn(), workspace: vi.fn(), save: vi.fn() }));
vi.mock("./database", () => ({ database: mocks.db }));
vi.mock("@/server/auth/principal", () => ({ verifyRequestPrincipal: mocks.principal }));
vi.mock("./workspaces", () => ({ readBusinessWorkspace: mocks.workspace, saveBusinessWorkspace: mocks.save }));
afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });
const context = () => ({ params: Promise.resolve({ business_id: "biz_workspace123" }) });

describe("private workspace HTTP projection", () => {
  it("keeps the endpoint disabled until explicitly configured", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "");
    const response = await GET(new NextRequest("https://taplo.test/v1/businesses/biz_workspace123/workspace"), context());
    expect(response.status).toBe(503); expect(mocks.db).not.toHaveBeenCalled();
  });
  it("rejects foreign browser contexts before looking up private data", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "1");
    const response = await GET(new NextRequest("https://taplo.test/v1/businesses/biz_workspace123/workspace", { headers: { "Sec-Fetch-Site": "cross-site" } }), context());
    expect(response.status).toBe(403); expect(mocks.db).not.toHaveBeenCalled();
  });
  it("never treats a draft cookie as an authenticated merchant", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "1");
    mocks.principal.mockRejectedValue(new CommandError("VERIFICATION_REQUIRED", 401, "Sign in to continue."));
    const response = await GET(new NextRequest("https://taplo.test/v1/businesses/biz_workspace123/workspace", { headers: { Cookie: "__Host-taplo-draft=" + "a".repeat(64) } }), context());
    expect(response.status).toBe(401); expect(mocks.workspace).not.toHaveBeenCalled();
  });
  it("uses the verified principal and actual route business, without cacheable private responses", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "1");
    const principal = { id: "usr_verified123", audience: "merchant", assurance: "aal1" };
    mocks.db.mockReturnValue("isolated-db"); mocks.principal.mockResolvedValue(principal);
    mocks.workspace.mockResolvedValue({ business_id: "biz_workspace123", version: 2, workspace_snapshot: { schema_version: 1 } });
    const response = await GET(new NextRequest("https://taplo.test/v1/businesses/biz_workspace123/workspace"), context());
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store"); expect(response.headers.get("ETag")).toBe('"2"');
    expect(mocks.workspace).toHaveBeenCalledWith("isolated-db", principal, "biz_workspace123");
  });
});

describe("private workspace HTTP writes", () => {
  const request = (headers: Record<string, string> = {}) => new NextRequest(
    "https://taplo.test/v1/businesses/biz_workspace123/workspace",
    { method: "PUT", headers: { Origin: "https://taplo.test", "Content-Type": "application/json", "If-Match": '"1"', "Idempotency-Key": "workspace-save123", ...headers }, body: JSON.stringify({ expected_version: 1, workspace_snapshot: { schema_version: 1 } }) },
  );
  it("rejects foreign origin and stale headers before any mutation", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "1");
    expect((await PUT(request({ Origin: "https://elsewhere.test" }), context())).status).toBe(403);
    expect((await PUT(request({ "If-Match": '"2"' }), context())).status).toBe(409);
    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("sends the bounded body to the verified merchant and returns an uncached version", async () => {
    vi.stubEnv("TAPLO_SERVER_DRAFTS", "1");
    const principal = { id: "usr_verified123", audience: "merchant", assurance: "aal1" };
    mocks.db.mockReturnValue("isolated-db");
    mocks.principal.mockResolvedValue(principal);
    mocks.save.mockResolvedValue({ value: { business_id: "biz_workspace123", version: 2 }, replayed: false });
    const response = await PUT(request(), context());
    expect(response.status).toBe(200);
    expect(response.headers.get("ETag")).toBe('"2"');
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.save).toHaveBeenCalledWith("isolated-db", principal, "biz_workspace123", { expected_version: 1, workspace_snapshot: { schema_version: 1 } }, "workspace-save123", expect.any(String));
  });
});
