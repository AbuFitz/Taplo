import { describe, expect, it } from "vitest";
import { validateRecord } from "./contracts";
const draft = { id: "offer_draft12345", version: 1, created_at: "2026-11-05T00:00:00Z", updated_at: "2026-11-05T00:00:00Z", business_id: "biz_workshop123", kind: "appointment", title: "Pottery consultation", visibility: "draft", price_mode: "fixed", delivery_modes: [] };
describe("offer lifecycle contract", () => {
 it("admits an incomplete draft without manufactured policy or configuration references", () => {
  expect(validateRecord("Offer", draft)).toEqual(draft);
 });
 it("rejects published or paused offers without complete configuration and delivery modes", () => {
  for (const visibility of ["published", "paused"]) {
   expect(() => validateRecord("Offer", { ...draft, visibility })).toThrow(/Invalid Offer/);
   expect(() => validateRecord("Offer", { ...draft, visibility, policy_version_id: "policy_source123", configuration_ref: "config_service123" })).toThrow(/Invalid Offer/);
   expect(validateRecord("Offer", { ...draft, visibility, policy_version_id: "policy_source123", configuration_ref: "config_service123", delivery_modes: ["onsite"] }).visibility).toBe(visibility);
  }
 });
});
