import { describe, expect, it } from "vitest";
import { COLOURWAYS, applyColourway, colourwayOf } from "./colourways";
import { contrastRatio } from "@/features/themes/tokens/contrast";
import { backgroundSchema, colorsSchema } from "../contracts/style";
import { newPage } from "../starter";

describe("approved colourways", () => {
  it("are the eight approved directions", () => {
    expect(COLOURWAYS.map((c) => c.name)).toEqual(["Carbon / white", "Cobalt / ice", "Black / ember", "Plum / pearl", "Blue / violet", "Silver / ink", "White / electric blue", "Rose / warm white"]);
  });
  for (const cw of COLOURWAYS) {
    it(`${cw.name}: valid tokens, readable pairs, still by default`, () => {
      expect(colorsSchema.safeParse(cw.colors).success).toBe(true);
      expect(backgroundSchema.safeParse(cw.background).success).toBe(true);
      if (cw.moving) expect(backgroundSchema.safeParse(cw.moving).success).toBe(true);
      const c = cw.colors as Record<string, string>;
      expect(contrastRatio(c.text!, c.surface!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.text!, c.background!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.muted!, c.surface!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.muted!, c.background!)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.accentText!, c.accent!)).toBeGreaterThanOrEqual(4.5);
      const b = cw.background as { motion?: boolean };
      expect(b.motion ?? false).toBe(false);
      if (cw.kind.startsWith("Solid")) expect(cw.moving).toBeUndefined();
    });
  }
  it("recolours without touching type, arrangement or widgets, and can be recognised", () => {
    const page = newPage("barber");
    const next = applyColourway(page, COLOURWAYS[1]!);
    expect(next.widgets).toEqual(page.widgets);
    expect((next.appearance as any).text).toEqual((page.appearance as any).text);
    expect((next.appearance as any).header).toEqual((page.appearance as any).header);
    expect(colourwayOf(next)?.id).toBe("cobalt");
    expect((applyColourway(page, COLOURWAYS[1]!, { motion: true }).appearance as any).background.motion).toBe(true);
  });
});
