import { describe, expect, it } from "vitest";
import { PAGE_FINISHES, matchingFinish, withFinish } from "./finishes";
import { resolveStyle } from "@/features/page/themes/resolve";
import { styleOverridesSchema } from "@/features/page/contracts/style";
import { contrastRatio } from "@/features/page/themes/color";

describe("page finishes", () => {
  for (const finish of PAGE_FINISHES)
    it(`${finish.name} preserves layout and type with readable lifted surfaces`, () => {
      const original = {
        text: { headingFont: "manrope" as const },
        layout: { width: "wide" as const },
      };
      const updated = withFinish(original, finish.id);
      expect(updated.text).toEqual(original.text);
      expect(updated.layout).toEqual(original.layout);
      expect(updated.cards?.surface).toBe("solid");
      expect(
        contrastRatio(finish.colors.text, finish.colors.surface),
      ).toBeGreaterThan(4.5);
      expect(
        contrastRatio(finish.colors.accentText, finish.colors.accent),
      ).toBeGreaterThan(4.5);
      expect(styleOverridesSchema.safeParse(updated).success).toBe(true);
      const { spec } = resolveStyle("clean", updated);
      expect(matchingFinish(spec)).toBe(finish.id);
    });
  it("round-trips motion speed without changing the palette selection", () => {
    const overrides = withFinish({}, "mono");
    if (overrides.background?.kind !== "gradient")
      throw Error("Expected gradient");
    overrides.background.pace = "expressive";
    const parsed = styleOverridesSchema.parse(
      JSON.parse(JSON.stringify(overrides)),
    );
    expect(parsed.background).toMatchObject({
      pace: "expressive",
      motion: true,
    });
    expect(matchingFinish(resolveStyle("clean", parsed).spec)).toBe("mono");
  });
  it("does not mark a hand-edited gradient as a preset", () => {
    const overrides = withFinish({}, "mono");
    if (overrides.background?.kind !== "gradient")
      throw Error("Expected gradient");
    overrides.background.to = "#ee0099";
    expect(
      matchingFinish(resolveStyle("clean", overrides).spec),
    ).toBeUndefined();
  });
});
