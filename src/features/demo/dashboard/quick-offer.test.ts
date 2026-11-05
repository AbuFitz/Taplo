import { describe, expect, it } from "vitest";
import { initialState, parseContent } from "../store";
import { applyIndustry, setName } from "../actions";
import { newWidget } from "@/features/page/starter";
import {
  addQuickOffer,
  quickOfferErrors,
  type QuickOffer,
} from "./quick-offer";
import { workspaceModel } from "./workspace-model";

const input: QuickOffer = {
  kind: "service",
  name: "Diagnostic visit",
  priceMode: "fixed",
  price: "45.50",
  minutes: "30",
};
describe("first useful offer", () => {
  it("creates one valid record and a visible block without enabling online booking or publishing", () => {
    const before = setName(
      applyIndustry(initialState(), "maker"),
      "Moss Studio",
    );
    before.page.widgets = [];
    const after = addQuickOffer(before, input, "svc_first");
    expect(after.content.services?.[0]).toMatchObject({
      name: input.name,
      priceMinor: 4550,
      durationMinutes: 30,
      bookingMode: "contact",
    });
    expect(after.page.widgets.map((w) => w.type)).toEqual(["serviceList"]);
    expect(after.published).toBe(before.published);
    expect(after.content.booking.onlineBookingReady).toBe(false);
    expect(parseContent(after.content).success).toBe(true);
    expect(addQuickOffer(after, input, "svc_first")).toBe(after);
  });
  it("preserves owner composition and includes the new item in an explicit block selection", () => {
    const before = setName(
      applyIndustry(initialState(), "maker"),
      "Moss Studio",
    );
    const block = newWidget("products", { productIds: [], variant: "swipe" });
    before.page.widgets = [{ ...block, hidden: true }];
    const after = addQuickOffer(
      before,
      { ...input, kind: "product", priceMode: "free", price: "999" },
      "prod_first",
    );
    expect(after.content.products?.[0]).toMatchObject({
      priceMinor: 0,
      mode: "enquire",
    });
    expect(after.page.widgets).toHaveLength(1);
    expect(after.page.widgets[0]).toMatchObject({
      id: block.id,
      hidden: false,
      settings: { productIds: ["prod_first"], variant: "swipe" },
    });
    expect(parseContent(after.content).success).toBe(true);
  });
  it("never reuses an amount when the owner chooses ask me", () => {
    const after = addQuickOffer(
      initialState(),
      { ...input, priceMode: "quote" },
      "svc_quote",
    );
    expect(after.content.services?.[0]?.priceMinor).toBeUndefined();
  });
  it.each([
    { price: "12.345" },
    { price: "-4" },
    { minutes: "1441" },
    { minutes: "1.5" },
    { name: " " },
  ])("rejects invalid quick setup %j", (patch) => {
    const before = setName(
      applyIndustry(initialState(), "maker"),
      "Moss Studio",
    );
    const bad = { ...input, ...patch };
    expect(Object.keys(quickOfferErrors(bad)).length).toBeGreaterThan(0);
    expect(addQuickOffer(before, bad, "bad")).toBe(before);
  });
});
describe("workspace emphasis", () => {
  it("does not infer a business from a blank setup", () =>
    expect(workspaceModel().primaryWork).toEqual([]));
  it("puts products first for a shop and keeps services distinct from its collection", () => {
    expect(workspaceModel("maker", "Pottery shop")).toMatchObject({
      primaryWork: ["products"],
      mobileWork: "products",
      terms: { services: "Services", products: "Products" },
    });
    expect(workspaceModel("car-dealer", "Car dealer").terms.products).toBe(
      "Vehicle stock",
    );
  });
  it("keeps the calendar for service work and relevant team vocabulary", () => {
    expect(workspaceModel("tutor", "Tutor")).toMatchObject({
      mobileWork: "bookings",
      terms: { team: "Tutors" },
    });
    expect(workspaceModel("barber", "Barber").terms.team).toBe("Barbers");
  });
});
