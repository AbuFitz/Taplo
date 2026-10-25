import { contrastRatio } from "./color";
import { clampChroma, converter, formatHex, interpolate, parse } from "culori"

/**
 * Colour roles derived from the handful of colours an owner actually chooses.
 * Everything is computed in OKLCH/OKLab (perceptually even), so a tint or a hover step looks
 * equally strong on a cream page, a black page and a saturated brand colour.
 * The step semantics follow Radix Colors: subtle backgrounds, interactive states, borders,
 * solid fills, text. Owners can pick any hex, so we derive steps instead of using fixed hues.
 */
const toOklch = converter("oklch");

function hex(c: Parameters<typeof formatHex>[0]): string {
  return formatHex(c) ?? "#000000";
}

export const lightness = (color: string): number => toOklch(parse(color) ?? "#000")?.l ?? 0;
export const isDark = (color: string): boolean => lightness(color) < 0.6;

/** Move lightness (and optionally chroma) by an amount, keeping the colour inside the sRGB gamut. */
export function shift(color: string, dl: number, dc = 0): string {
  const o = toOklch(parse(color) ?? "#000");
  if (!o) return color;
  const l = Math.min(1, Math.max(0, (o.l ?? 0) + dl));
  const c = Math.max(0, (o.c ?? 0) + dc);
  return hex(clampChroma({ mode: "oklch", l, c, h: o.h ?? 0 }, "oklch"));
}

/** Blend two colours in OKLab. t=0 gives `a`, t=1 gives `b`. */
export function blend(a: string, b: string, t: number): string {
  return hex(interpolate([a, b], "oklab")(Math.min(1, Math.max(0, t))));
}

export interface PageColours {
  background: string;
  text: string;
  muted: string;
  surface: string;
  accent: string;
  accentText: string;
  border: string;
}

export interface Roles {
  dark: boolean;
  surface2: string;
  line: string;
  lineStrong: string;
  ink3: string;
  accentHover: string;
  accentPress: string;
  accentSoft: string;
  accentLine: string;
  shadowTint: string;
}

export function deriveRoles(c: PageColours, pageBackground: string): Roles {
  const dark = isDark(pageBackground);
  const surfaceDark = isDark(c.surface);
  return {
    dark,
    surface2: shift(c.surface, surfaceDark ? 0.035 : -0.022),
    line: blend(pageBackground, c.text, dark ? 0.16 : 0.1),
    lineStrong: blend(pageBackground, c.text, dark ? 0.3 : 0.22),
    ink3: blend(c.muted, pageBackground, 0.38),
    accentHover: contrastRatio(c.accentText,shift(c.accent, isDark(c.accent) ? 0.045 : -0.045)) >= 4.5 ? shift(c.accent, isDark(c.accent) ? 0.045 : -0.045) : c.accent,
    accentPress: shift(c.accent, isDark(c.accent) ? 0.08 : -0.08),
    accentSoft: blend(c.surface, c.accent, surfaceDark ? 0.2 : 0.13),
    accentLine: blend(c.surface, c.accent, 0.38),
    shadowTint: dark ? "#000000" : blend(c.text, "#000000", 0.55),
  };
}

/** Layered, tinted elevation. Dark pages need stronger shadows and a faint top edge to read as raised. */
export function elevation(r: Roles) {
  const t = (a: number) => `color-mix(in oklab, ${r.shadowTint} ${Math.round(a * 100)}%, transparent)`;
  const k = r.dark ? 2.2 : 1;
  const edge = r.dark ? "inset 0 1px 0 0 rgb(255 255 255 / 0.07)" : "inset 0 1px 0 0 rgb(255 255 255 / 0.75)";
  return {
    edge,
    e1: `0 1px 2px ${t(0.06 * k)}, 0 1px 1px ${t(0.04 * k)}`,
    e2: `0 1px 2px ${t(0.05 * k)}, 0 10px 24px -10px ${t(0.16 * k)}, 0 3px 8px -3px ${t(0.07 * k)}`,
    e3: `0 2px 4px ${t(0.06 * k)}, 0 28px 56px -18px ${t(0.3 * k)}, 0 10px 20px -10px ${t(0.12 * k)}`,
  };
}
