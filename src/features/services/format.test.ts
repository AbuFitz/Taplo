import { describe, expect, it } from "vitest";
import { formatDuration, formatMoney, formatPrice } from "./format";

describe("service formatting", () => {
  it("formats integer minor units", () => {
    expect(formatMoney(14900)).toBe("£149");
    expect(formatMoney(1999)).toBe("£19.99");
  });
  it("labels price modes honestly", () => {
    const c = { currency: "GBP" };
    expect(formatPrice({ ...c, priceMode: "from", priceMinor: 5000 })).toBe("From £50");
    expect(formatPrice({ ...c, priceMode: "quote" })).toBe("Quote on request");
    expect(formatPrice({ ...c, priceMode: "free" })).toBe("Free");
    expect(formatPrice({ ...c, priceMode: "fixed" })).toBe("Price on request");
  });
  it("formats durations", () => {
    expect([formatDuration(30), formatDuration(60), formatDuration(150), formatDuration(undefined)]).toEqual(["30 min", "1 hr", "2 hr 30 min", null]);
  });
});
