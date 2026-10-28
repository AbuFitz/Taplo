import { describe, expect, it } from "vitest";
import { PALETTES, originalPalette, palettesFor, lookBackground, applyPalette, logoPalette } from "./palettes";
import { STARTING_LOOKS, applyStartingLook } from "./starting-looks";
import { contrastRatio } from "@/features/themes/tokens/contrast";
import { mix } from "./color";
import { newPage } from "../starter";
import { backgroundSchema } from "../contracts/style";

/** Every colour a gradient can show, including every blend between its tones, must carry the page's text. */
const regions = (base: string, g: [string, string]) => {
  const out = [base, g[0], g[1]];
  for (const [a, b] of [[base, g[0]], [base, g[1]], [g[0], g[1]]] as const) for (let t = 0.2; t < 1; t += 0.2) out.push(mix(a, b, t));
  return out;
};

describe("curated palettes", () => {
  const all = [...PALETTES, ...STARTING_LOOKS.map(originalPalette)];
  for (const p of all) {
    it(`${p.tone} ${p.name} (${p.id}): every region, every role`, () => {
      for (const bg of regions(p.base, p.glow)) {
        expect(contrastRatio(p.text, bg), `text on ${bg}`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.muted, bg), `muted on ${bg}`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(p.accent, bg), `accent on ${bg}`).toBeGreaterThanOrEqual(3);
      }
      expect(contrastRatio(p.text, p.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.muted, p.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.accentText, p.accent), "action label").toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.accent, p.surface), "action on a card").toBeGreaterThanOrEqual(3);
      expect(contrastRatio(p.border, p.surface), "border visible on a card").toBeGreaterThanOrEqual(1.15);
    });
  }
  it("keeps each look's character: solid stays solid, gradients stay moving gradients", () => {
    for (const look of STARTING_LOOKS) for (const p of palettesFor(look)) {
      const bg = lookBackground(look, p);
      expect(backgroundSchema.safeParse(bg).success).toBe(true);
      expect(bg.kind).toBe(look.animated ? "shader" : "solid");
      if (look.animated) expect((bg as { motion?: boolean }).motion).toBe(true);
      if (look.animated && bg.kind === "shader") expect(bg.style).toBe((look.colourway.moving as { style: string }).style);
    }
  });
  it("only offers palettes of the look's tone, and recolours without touching content or type", () => {
    const look = STARTING_LOOKS.find((l) => l.id === "ember")!;
    expect(palettesFor(look).every((p) => p.tone === "dark")).toBe(true);
    const page = applyStartingLook(newPage("barber"), look);
    const next = applyPalette(page, look, PALETTES[1]);
    expect(next.widgets).toEqual(page.widgets);
    expect((next.appearance as { text?: unknown }).text).toEqual((page.appearance as { text?: unknown }).text);
  });
  it("offers a logo palette that reads on its look", () => {
    for (const look of STARTING_LOOKS) {
      const p = logoPalette("#c2410c", look)!;
      expect(contrastRatio(p.text, p.base)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
