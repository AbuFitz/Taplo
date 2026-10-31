import { describe, expect, it, vi, afterEach } from "vitest";
import { reportSchema, reportPath, reportText, deliverReport } from "./report";
const base = {
  version: 1 as const,
  kind: "bug" as const,
  reason: "Something does not work",
  description: "The service save button does not save the new duration.",
  path: "/dashboard/services",
  createdAt: "2026-10-31T12:00:00.000Z",
};
afterEach(() => vi.unstubAllEnvs());
describe("report privacy and delivery", () => {
  it("drops URL queries and fragments which may carry private tokens", () => {
    expect(
      reportPath("https://mytaplo.com/salon?token=private#email=test"),
    ).toBe("/salon");
  });
  it("uses distinct reasons for platform defects and business page reports", () => {
    expect(reportSchema.safeParse(base).success).toBe(true);
    expect(reportSchema.safeParse({ ...base, kind: "page" }).success).toBe(
      false,
    );
    expect(
      reportSchema.safeParse({
        ...base,
        kind: "page",
        reason: "Scam or impersonation",
      }).success,
    ).toBe(true);
  });
  it("requires a useful explanation and validates optional contact", () => {
    expect(
      reportSchema.safeParse({ ...base, description: "bad" }).success,
    ).toBe(false);
    expect(
      reportSchema.safeParse({ ...base, contact: "not-an-email" }).success,
    ).toBe(false);
    expect(reportSchema.safeParse({ ...base, contact: "" }).success).toBe(true);
  });
  it("exports only deliberate fields; no default diagnostics or hidden business records", () => {
    const parsed = reportSchema.parse({
      ...base,
      bookings: [{ private: "secret" }],
    });
    expect(reportText(parsed)).not.toContain("secret");
    expect(reportText(parsed)).not.toContain("Optional details");
    expect(reportText(parsed)).toContain("/dashboard/services");
  });
  it("does not claim delivery when no provider is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_REPORT_ENDPOINT", "");
    expect(await deliverReport(reportSchema.parse(base))).toEqual({
      state: "unconnected",
    });
  });
  it("refuses a cross-origin reporting destination", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_REPORT_ENDPOINT",
      "https://untrusted.example/report",
    );
    await expect(deliverReport(reportSchema.parse(base))).rejects.toThrow(
      /configured correctly/,
    );
  });
});
