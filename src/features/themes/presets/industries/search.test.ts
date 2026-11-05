import { describe, expect, it } from "vitest";
import { searchIndustries } from "./index";

describe("business category suggestions", () => {
  it.each([
    ["deatailer", "detailer"],
    ["mobile car deatailer", "detailer"],
    ["hairdresser", "hairdresser"],
    ["Café", "hospitality"],
    ["pottery shop", "maker"],
    ["online store", "maker"],
    ["mobile mechanic", "mechanic"],
    ["barbers", "barber"],
    ["maths tutor", "tutor"],
  ])("suggests an appropriate first match for %s", (query, expected) => {
    expect(searchIndustries(query)[0]?.id).toBe(expected);
  });
  it("keeps distinct car businesses discoverable without making a decision", () => {
    expect(searchIndustries("car").map((p) => p.id)).toEqual(
      expect.arrayContaining(["detailer", "mechanic", "car-dealer", "other"]),
    );
  });
  it("offers the custom route when no meaningful match exists", () => {
    expect(
      searchIndustries("orbital mushroom curator").map((p) => p.id),
    ).toEqual(["other"]);
    expect(searchIndustries("خياط").map((p) => p.id)).toEqual(["other"]);
    expect(searchIndustries("z").map((p) => p.id)).toEqual(["other"]);
    expect(searchIndustries("   ").length).toBeGreaterThan(20);
  });
});
