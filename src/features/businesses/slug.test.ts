import { describe, expect, it } from "vitest";
import { isReservedSlug, isReservedStaffSlug, normalizeSlug, validateSlug } from "./slug";

describe("slugs", () => {
  it("normalises names", () => {
    expect(normalizeSlug("  Olive & Oak Barbers! ")).toBe("olive-and-oak-barbers");
    expect(normalizeSlug("Café  Zoë__Ltd")).toBe("cafe-zoe-ltd");
    expect(normalizeSlug("--a--b--")).toBe("a-b");
  });
  it("reserves platform paths and platform-name variants", () => {
    for (const s of ["dashboard", "api", "book", "review", "pricing", "dev", "login", "taplo", "taplo-support", "official-taplo"]) expect(isReservedSlug(s), s).toBe(true);
    expect(isReservedSlug("taplotech")).toBe(false);
  });
  it("validates shape", () => {
    expect(validateSlug("ab")).toContain("too_short");
    expect(validateSlug("a".repeat(41))).toContain("too_long");
    expect(validateSlug("Bad_Slug")).toContain("invalid_characters");
    expect(validateSlug("12345")).toContain("all_numeric");
    expect(validateSlug("northgate-garage")).toEqual([]);
  });
  it("keeps /book free of staff slug collisions", () => {
    expect(isReservedStaffSlug("book")).toBe(true);
    expect(isReservedStaffSlug("sam")).toBe(false);
  });
});
