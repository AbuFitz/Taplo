import { describe, expect, it } from "vitest";
import { initialState } from "@/features/demo/store";
import { journeyFor } from "./journeys";
import { blankService } from "@/features/demo/actions";
import { newWidget } from "@/features/page/starter";
describe("owner setup readiness", () => {
  it("does not count example or archived services as the first real offer", () => {
    const s = initialState();
    s.content.services = [
      { ...blankService(0), name: "Example", example: true },
      { ...blankService(1), name: "Old", archived: true },
    ];
    expect(journeyFor("services", s).steps[0]?.done).toBe(false);
    s.content.services.push({ ...blankService(2), name: "Consultation" });
    expect(journeyFor("services", s).steps[0]?.done).toBe(true);
  });
  it("keeps preparation available on Free while distinguishing public team/booking access", () => {
    const s = initialState();
    s.plan = "free";
    expect(journeyFor("team", s).steps[0]?.blocked).toBeUndefined();
    expect(journeyFor("team", s).steps[2]?.blocked).toMatch(/Pro/);
    expect(journeyFor("bookings", s).steps[0]?.blocked).toMatch(/Pro/);
    s.plan = "pro";
    expect(journeyFor("bookings", s).steps[0]?.blocked).toBeUndefined();
  });
  it("requires both real products and a visible shelf; hidden blocks do not complete setup", () => {
    const s = initialState();
    s.content.products = [
      {
        id: "p",
        name: "Cream",
        currency: "GBP",
        mode: "enquire",
        kind: "product",
        availability: "available",
        facts: [],
        images: [],
        affiliate: false,
        archived: false,
      },
    ];
    s.page.widgets = [{ ...newWidget("products"), hidden: true }];
    expect(journeyFor("products", s).steps[2]?.done).toBe(false);
    s.page.widgets[0]!.hidden = false;
    expect(journeyFor("products", s).steps[2]?.done).toBe(true);
  });
  it("recognises real contact widget types and never modifies the page while deriving guidance", () => {
    const s = initialState();
    s.page.widgets = [newWidget("whatsapp")];
    const before = JSON.stringify(s);
    expect(journeyFor("page", s).steps[1]?.done).toBe(true);
    for (const topic of [
      "page",
      "services",
      "products",
      "bookings",
      "team",
      "reviews",
      "analytics",
      "settings",
    ] as const)
      journeyFor(topic, s);
    expect(JSON.stringify(s)).toBe(before);
  });
  it("never treats an upgraded plan as a connected analytics provider", () => {
    const s = initialState();
    s.plan = "business";
    const measurement = journeyFor("analytics", s).steps[1]!;
    expect(measurement.done).toBe(false);
    expect(measurement.blocked).toMatch(/not connected/);
  });
});

it("does not mark an undurationed appointment service as ready for customer slots", () => {
  const s = initialState();
  s.content.services = [
    { ...blankService(0), name: "Consultation", bookingMode: "request" },
  ];
  expect(journeyFor("bookings", s).steps[0]?.done).toBe(false);
  s.content.services[0]!.durationMinutes = 30;
  expect(journeyFor("bookings", s).steps[0]?.done).toBe(true);
});
