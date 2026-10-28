import type { StyleOverrides } from "../contracts/style";
import type { PageDoc } from "../contracts/page";
import { mix, readableOn } from "./color";
import { paletteFromAccent } from "./image-palette";
import { getStartingLook, type StartingLook } from "./starting-looks";

type Colours = NonNullable<StyleOverrides["colors"]>;
type Background = NonNullable<StyleOverrides["background"]>;

/**
 * Curated palettes for the starting looks. A palette coordinates the whole page: background tones (the base and the glow colours a
 * moving background is built from), widget surfaces, text and muted text, borders and the action colour. A palette never changes a
 * look's typeface, arrangement or effect: a moving-gradient look stays a moving gradient, a solid look stays solid. Each is checked
 * (see palettes.test.ts and the rendered-page spec) in every region of the background.
 */
export interface Palette {
  id: string;
  name: string;
  /** Which looks it suits: a dark palette only goes on dark looks. */
  tone: "dark" | "light";
  base: string;
  /** The glow colours of a moving or glowing background, strongest first. */
  glow: [string, string];
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
}

const ON_LIGHT = "#101216";
export const PALETTES: Palette[] = [
  { id: "teal", name: "Teal", tone: "dark", base: "#0a1416", glow: ["#0f5a58", "#0b2d33"], surface: "#13262a", text: "#e9f7f5", muted: "#aecac7", border: "#2a4a52", accent: "#7fe3d4", accentText: ON_LIGHT },
  { id: "gold", name: "Bronze", tone: "dark", base: "#0f0d09", glow: ["#6b5320", "#2b2210"], surface: "#1c1810", text: "#f7f1e3", muted: "#d6ceb9", border: "#40382a", accent: "#e8c56d", accentText: ON_LIGHT },
  { id: "forest", name: "Forest", tone: "dark", base: "#0a130d", glow: ["#25683d", "#0f2c1b"], surface: "#14231a", text: "#ebf7ee", muted: "#c5ddcc", border: "#2b4a35", accent: "#9fe3b2", accentText: ON_LIGHT },
  { id: "wine", name: "Wine", tone: "dark", base: "#140a0f", glow: ["#7a2447", "#33111f"], surface: "#25141b", text: "#fcf0f4", muted: "#d6aebd", border: "#4c2733", accent: "#f4a9c0", accentText: ON_LIGHT },
  { id: "ink", name: "Ink", tone: "dark", base: "#0d0b1a", glow: ["#4531a0", "#1c1640"], surface: "#181530", text: "#f0edff", muted: "#b8b2e0", border: "#352e6a", accent: "#c7bcff", accentText: ON_LIGHT },
  { id: "sage", name: "Sage", tone: "light", base: "#edf1ec", glow: ["#cfe2d0", "#f8fbf7"], surface: "#ffffff", text: "#1f2d24", muted: "#506557", border: "#cfdbd0", accent: "#2f5d42", accentText: "#ffffff" },
  { id: "sand", name: "Sand", tone: "light", base: "#f3eee4", glow: ["#e6d3ad", "#fbf8f1"], surface: "#fffdf8", text: "#3a2f20", muted: "#665941", border: "#e1d6c2", accent: "#8a5a1f", accentText: "#ffffff" },
  { id: "sky", name: "Slate", tone: "light", base: "#ecf2f9", glow: ["#c9ddf4", "#f6f9fd"], surface: "#ffffff", text: "#1b2a3d", muted: "#495f7a", border: "#d1ddeb", accent: "#1f5fbf", accentText: "#ffffff" },
  { id: "blush", name: "Blush", tone: "light", base: "#f7ecea", glow: ["#ecc9c4", "#fdf7f4"], surface: "#fffaf7", text: "#4a2f33", muted: "#6f5055", border: "#e8d1cd", accent: "#9a3f55", accentText: "#ffffff" },
  { id: "lilac", name: "Mauve", tone: "light", base: "#f0edf7", glow: ["#d8d0ee", "#faf9fe"], surface: "#ffffff", text: "#2a2540", muted: "#5b547b", border: "#dad4ea", accent: "#5b3fc4", accentText: "#ffffff" },
];

/** The look's own colours, expressed as a palette so every look is handled the same way. */
export function originalPalette(look: StartingLook): Palette {
  const c = look.colourway.colors as Required<Colours>;
  const glow = look.colourway.moving?.kind === "shader" ? look.colourway.moving.colors : [c.surface, c.background];
  return { id: "original", name: "Original", tone: look.colourway.tone, base: c.background, glow: [glow[0] ?? c.surface, glow[1] ?? c.background], surface: c.surface, text: c.text, muted: c.muted, border: c.border, accent: c.accent, accentText: c.accentText };
}

/** A palette from the owner's logo colour, offered (never applied by itself) when it reads well on a page of this look's tone. */
export function logoPalette(accent: string, look: StartingLook): Palette | null {
  const p = paletteFromAccent(accent, look.colourway.tone === "dark");
  return {
    id: "logo", name: "From your logo", tone: look.colourway.tone, base: p.background,
    glow: [mix(p.accent, p.background, look.colourway.tone === "dark" ? 0.55 : 0.78), mix(p.accent, p.background, look.colourway.tone === "dark" ? 0.8 : 0.9)],
    surface: p.surface, text: p.text, muted: p.muted, border: p.border, accent: p.accent, accentText: p.accentText || readableOn(p.accent),
  };
}

export const palettesFor = (look: StartingLook): Palette[] => PALETTES.filter((p) => p.tone === look.colourway.tone);
export const getPalette = (id: string | undefined, look: StartingLook): Palette | undefined => (id === "original" || !id ? undefined : palettesFor(look).find((p) => p.id === id));

export function paletteColours(p: Palette): Colours {
  return { background: p.base, text: p.text, muted: p.muted, surface: p.surface, accent: p.accent, accentText: p.accentText, border: p.border };
}

/** The look's own background effect, built from a palette's tones. Solid stays solid; a moving gradient stays a moving gradient of the same kind. */
export function lookBackground(look: StartingLook, p?: Palette): Background {
  const m = look.colourway.moving;
  if (!m) return { kind: "solid", color: p?.base ?? (look.colourway.colors.background as string) };
  if (!p || m.kind !== "shader") return structuredClone(m);
  return { ...m, colors: m.colors.map((_, i) => p.glow[i] ?? p.base) as string[], base: p.base };
}

/** The still version of the same background (reduced motion and previews). */
export function lookStillBackground(look: StartingLook, p?: Palette): Background {
  const b = lookBackground(look, p);
  return b.kind === "shader" || b.kind === "gradient" ? ({ ...b, motion: false } as Background) : b;
}

export function applyPalette(page: PageDoc, look: StartingLook, p?: Palette): PageDoc {
  const old = (page.appearance ?? {}) as StyleOverrides;
  const colors = p ? paletteColours(p) : (look.colourway.colors as Colours);
  return { ...page, appearance: { ...old, colors: { ...(old.colors ?? {}), ...colors } as Colours, background: lookBackground(look, p) } as StyleOverrides };
}

export { getStartingLook };
