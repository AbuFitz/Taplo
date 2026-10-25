import { describe, expect, it } from "vitest";
import { PLANS } from "./plans";
import { effectivePlan, resolveEntitlements } from "./entitlements";

describe("entitlements", () => {
  it("locks package prices", () => {
    expect(Object.values(PLANS).map((p) => p.priceMinorGbp)).toEqual([0, 999, 1999, 3999]);
  });
  it("maps the locked boundaries", () => {
    const f = resolveEntitlements("free");
    expect([f.maxServices, f.gallery, f.analytics, f.removeBranding, f.onlineBooking]).toEqual([3, false, false, false, false]);
    expect(f.callAndWhatsapp).toBe(true);
    const c = resolveEntitlements("core");
    expect([c.maxServices, c.gallery, c.analytics, c.removeBranding, c.onlineBooking, c.payments]).toEqual([null, true, true, true, false, false]);
    const p = resolveEntitlements("pro");
    expect([p.onlineBooking, p.payments, p.teamPages, p.emailConfirmations, p.multiStaff, p.customDomains]).toEqual([true, true, true, true, true, true]);
    expect(p.maxStaffBookable).toBe(3);
    const b = resolveEntitlements("business");
    expect(b.maxStaffBookable).toBeNull();
    expect([b.multiStaff, b.multiLocation, b.customDomains, b.staffScheduling, b.rolePermissions, b.advancedAnalytics]).toEqual([true, true, true, true, true, true]);
  });
  it("downgrades on unpaid/canceled but keeps access while past_due", () => {
    expect(effectivePlan("pro", "past_due")).toBe("pro");
    expect(effectivePlan("pro", "canceled")).toBe("free");
    expect(effectivePlan("business", "incomplete")).toBe("free");
    expect(resolveEntitlements("business", "unpaid").onlineBooking).toBe(false);
  });
});
