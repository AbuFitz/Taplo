import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const { query, db, transact } = vi.hoisted(() => ({ query: vi.fn(), db: vi.fn(), transact: vi.fn() }));
vi.mock("./database", () => ({ database: db, transaction: transact }));
import { GET } from "../../app/v1/health/database/route";
const request = (secret?: string) => new NextRequest("https://taplo.test/v1/health/database", { headers: secret ? { "x-taplo-health-probe": secret } : {} });
afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });
describe("private database readiness probe", () => {
 it("hides the probe without its exact server-only credential and never opens a connection", async () => {
  vi.stubEnv("TAPLO_HEALTH_PROBE_SECRET", "expected-private-test-secret");
  for (const secret of [undefined, "wrong-secret"]) {
   const r = await GET(request(secret)); expect(r.status).toBe(404); expect(await r.json()).toEqual({ status: "not_found" });
  }
  expect(db).not.toHaveBeenCalled(); expect(transact).not.toHaveBeenCalled();
 });
 it("checks restricted login and real table access but returns no private database metadata", async () => {
  vi.stubEnv("TAPLO_HEALTH_PROBE_SECRET", "expected-private-test-secret");
  query.mockResolvedValue({ rows: [] }).mockResolvedValueOnce({ rows: [{ rolsuper: false, rolbypassrls: false, rolcreaterole: false, rolcreatedb: false }] });
  transact.mockImplementation(async (_db, _scope, callback) => callback({ query }));
  const r = await GET(request("expected-private-test-secret"));
  expect(r.status).toBe(200); expect(await r.json()).toEqual({ status: "ok" }); expect(r.headers.get("Cache-Control")).toBe("no-store");
  expect(query.mock.calls.slice(1).every(([sql]) => /^SELECT id FROM taplo\.[a-z_]+ WHERE false$/.test(sql))).toBe(true);
 });
 it("refuses owner-capable login credentials even when a transaction can switch roles", async () => {
  vi.stubEnv("TAPLO_HEALTH_PROBE_SECRET", "expected-private-test-secret");
  query.mockResolvedValue({ rows: [{ rolsuper: false, rolbypassrls: true, rolcreaterole: true, rolcreatedb: true }] });
  transact.mockImplementation(async (_db, _scope, callback) => callback({ query }));
  const r = await GET(request("expected-private-test-secret")); expect(r.status).toBe(503); expect(query).toHaveBeenCalledTimes(1);
 });
 it("redacts connection errors and does not claim a successful probe", async () => {
  vi.stubEnv("TAPLO_HEALTH_PROBE_SECRET", "expected-private-test-secret");
  db.mockImplementation(() => { throw new Error("private-credential-and-host"); });
  const r = await GET(request("expected-private-test-secret")); expect(r.status).toBe(503); expect(await r.text()).not.toContain("private-credential");
 });
});
