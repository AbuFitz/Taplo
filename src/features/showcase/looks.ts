import * as radix from "@radix-ui/colors"
import type { StyleOverrides } from "@/features/page/contracts/style"

/**
 * Four configurations of the one appearance engine. Each is simply a complete set of owner
 * choices (StyleOverrides) over the same base: nothing here is a separate stylesheet, and any
 * value can be changed afterwards through the same controls.
 */
export interface Look {
  id: string
  name: string
  blurb: string
  overrides: StyleOverrides
}

export const LOOKS: Look[] = [
  {
    id: "noir",
    name: "Noir",
    blurb: "Low light, brass and a photograph that does the talking.",
    overrides: {
      colors: { background: "#0f0e0d", text: "#f4efe6", muted: "#b9b0a1", surface: "#1a1816", accent: "#d6b36a", accentText: "#17120a", border: "#2c2823" },
      text: { headingFont: "instrumentSerif", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      background: { kind: "solid", color: "#0f0e0d" },
      header: { layout: "poster", avatarShape: "circle", avatarSize: "sm", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
      decoration: "grain",
      motion: "subtle",
    },
  },
  {
    id: "paper",
    name: "Paper",
    blurb: "Warm, quiet and typographic. Ink on cream.",
    overrides: {
      colors: { background: "#f6f2ea", text: "#1b1916", muted: "#675f54", surface: "#fffdf8", accent: "#1b1916", accentText: "#f6f2ea", border: "#e2dacb" },
      text: { headingFont: "fraunces", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      background: { kind: "solid", color: "#f6f2ea" },
      header: { layout: "side", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "md", border: "thin", shadow: "none", padding: "roomy" },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "pop",
    name: "Pop",
    blurb: "Colour, motion and a friendly face. Made to be shared.",
    overrides: {
      colors: { background: "#150a3f", text: "#ffffff", muted: "#e4dcff", surface: "#ffffff", accent: "#ffd84a", accentText: "#1a1233", border: "#ffffff" },
      text: { headingFont: "bricolage", bodyFont: "bricolage", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      background: { kind: "shader", style: "aurora", colors: ["#4f3bd9", "#a02fb8", "#d6336c", "#1a7fb3"], base: "#150a3f" },
      header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "center", actions: "buttons", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 14, radius: "xl", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "lively",
    },
  },
  {
    id: "showroom",
    name: "Showroom",
    blurb: "Crisp, cool and confident. Built for stock and specifications.",
    overrides: {
      colors: { background: "#eef2f0", text: "#0c1f1a", muted: "#4d5f58", surface: "#ffffff", accent: "#0f4d3c", accentText: "#ffffff", border: "#d9e1dd" },
      text: { headingFont: "spaceGrotesk", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#eef2f0" },
      header: { layout: "cover", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "wide", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
]

/* ---- Radix-derived palettes: coordinated neutral + accent, light and dark ---- */
type Scale = Record<string, string>
const scale = (name: string): Scale => (radix as unknown as Record<string, Scale>)[name]!
const step = (name: string, n: number) => scale(name)[`${name.replace(/Dark$/, "")}${n}`]!

export interface Palette {
  id: string
  name: string
  mode: "light" | "dark"
  colors: NonNullable<StyleOverrides["colors"]>
}

function make(id: string, name: string, neutral: string, accent: string, mode: "light" | "dark"): Palette {
  const n = mode === "dark" ? `${neutral}Dark` : neutral
  const a = mode === "dark" ? `${accent}Dark` : accent
  const accentSolid = step(a, 9)
  // Accent text is chosen by the engine's readability repair if this is not enough; start from the neutral extremes.
  const text = step(n, 12)
  const bg = mode === "dark" ? step(n, 1) : step(n, 2)
  return {
    id, name, mode,
    colors: {
      background: bg,
      text,
      muted: step(n, 11),
      surface: mode === "dark" ? step(n, 3) : step(n, 1),
      accent: accentSolid,
      accentText: mode === "dark" ? step(n, 1) : step(n, 12),
      border: step(n, 6),
    },
  }
}

export const PALETTES: Palette[] = [
  make("sand-amber", "Sand & amber", "sand", "amber", "light"),
  make("olive-jade", "Olive & jade", "olive", "jade", "light"),
  make("slate-indigo", "Slate & indigo", "slate", "indigo", "light"),
  make("mauve-crimson", "Mauve & crimson", "mauve", "crimson", "light"),
  make("sand-amber-dark", "Ember", "sand", "amber", "dark"),
  make("olive-lime-dark", "Moss", "olive", "lime", "dark"),
  make("slate-iris-dark", "Midnight", "slate", "iris", "dark"),
  make("mauve-orange-dark", "Dusk", "mauve", "orange", "dark"),
]
