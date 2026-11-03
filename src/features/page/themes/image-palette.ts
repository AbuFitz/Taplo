import { formatHex, oklch, parse } from "culori"
import { contrastRatio } from "@/features/themes/tokens/contrast"
import type { StyleOverrides } from "../contracts/style"
import { ensureReadable, readableOn } from "./color"

/**
 * Colour suggestions from a picture. Pure and deterministic: given the picture's pixels, find the most prominent
 * vivid colour, then build a coordinated palette around it. Nothing here touches a page: the editor shows the result
 * beside the current colours and applies it only when the owner accepts.
 */
export function dominantAccent(rgba: Uint8ClampedArray): string | null {
  const hues = new Array(24).fill(0) as number[]
  const sums = Array.from({ length: 24 }, () => [0, 0, 0, 0])
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3]! < 200) continue
    const c = oklch({ mode: "rgb", r: rgba[i]! / 255, g: rgba[i + 1]! / 255, b: rgba[i + 2]! / 255 })
    if (!c || c.l < 0.25 || c.l > 0.92 || (c.c ?? 0) < 0.06) continue // near-black, near-white and greys carry no identity
    const b = Math.floor(((c.h ?? 0) / 360) * 24) % 24
    const w = (c.c ?? 0) * (1 - Math.abs(c.l - 0.62))
    hues[b]! += w
    const s = sums[b]!
    s[0]! += rgba[i]! * w; s[1]! += rgba[i + 1]! * w; s[2]! += rgba[i + 2]! * w; s[3]! += w
  }
  let best = -1
  hues.forEach((v, i) => { if (v > 0 && (best < 0 || v > hues[best]!)) best = i })
  if (best < 0 || hues[best]! < 0.4) return null // not enough colour to say anything
  const s = sums[best]!
  return formatHex({ mode: "rgb", r: s[0]! / s[3]! / 255, g: s[1]! / s[3]! / 255, b: s[2]! / s[3]! / 255 }) ?? null
}

type Colours = NonNullable<StyleOverrides["colors"]>
const hexOf = (l: number, c: number, h: number) => formatHex({ mode: "oklch", l, c, h }) ?? "#000000"

/** A coordinated palette around one accent, in the tone (light or dark) the page already has. Every text colour is checked for contrast. */
export function paletteFromAccent(accentHex: string, dark: boolean): Required<Colours> {
  const o = oklch(parse(accentHex)!)!
  const h = o.h ?? 250
  const accent = hexOf(Math.min(dark ? 0.8 : 0.5, Math.max(dark ? 0.7 : 0.4, o.l)), Math.min(0.2, Math.max(0.1, o.c ?? 0.12)), h)
  const background = dark ? hexOf(0.16, 0.015, h) : hexOf(0.975, 0.006, h)
  const surface = dark ? hexOf(0.21, 0.02, h) : "#ffffff"
  const text = ensureReadable(dark ? hexOf(0.97, 0.005, h) : hexOf(0.2, 0.02, h), background).color
  const muted = ensureReadable(dark ? hexOf(0.76, 0.02, h) : hexOf(0.44, 0.02, h), background, 4.5).color
  return { background, text, muted, surface, accent, accentText: readableOn(accent), border: dark ? hexOf(0.31, 0.02, h) : hexOf(0.9, 0.01, h) }
}

export const readsWell = (p: Required<Colours>) => contrastRatio(p.text, p.background) >= 4.5 && contrastRatio(p.accentText, p.accent) >= 4.5 && contrastRatio(p.muted, p.background) >= 4.5
