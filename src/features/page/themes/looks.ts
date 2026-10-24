import * as radix from "@radix-ui/colors"
import type { StyleOverrides } from "../contracts/style"

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
    id: "forecourt", name: "Forecourt",
    blurb: "A clear identity, generous photographs and room for the facts. Practical, calm and easy to scan.",
    overrides: {
      colors: { background: "#edf2ef", text: "#18332f", muted: "#50635e", surface: "#ffffff", accent: "#123d3a", accentText: "#ffffff", border: "#ccd8d1" },
      text: { headingFont: "manrope", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#edf2ef" },
      header: { layout: "side", avatarShape: "logo", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "soft" },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "sm", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "wide", density: "comfortable", desktop: "centered" },
      decoration: "none", motion: "subtle",
    },
  },
  {
    id: "highstreet", name: "High Street",
    blurb: "Warm paper, inky blue and a picture of the work. Clear prices with a friendly, practical feel.",
    overrides: {
      colors: { background: "#f3eddf", text: "#183c55", muted: "#50616b", surface: "#fffaf0", accent: "#183c55", accentText: "#fffaf0", border: "#cec6b6" },
      text: { headingFont: "bricolage", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#f3eddf" },
      header: { layout: "cover", avatarShape: "logo", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "soft" },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "transparent", opacity: 100, radius: "sm", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "wide", density: "comfortable", desktop: "split" },
      decoration: "none", motion: "subtle",
    },
  },
  {
    id: "workbay", name: "Workbay",
    blurb: "Deep blue-grey, practical yellow and generous service cards. Built to put the work first.",
    overrides: {
      colors: { background: "#152a32", text: "#f3f5ed", muted: "#b5c5c7", surface: "#213a43", accent: "#f5da64", accentText: "#152a32", border: "#476069" },
      text: { headingFont: "spaceGrotesk", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#152a32" },
      header: { layout: "cover", avatarShape: "logo", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "soft" },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "md", border: "thin", shadow: "none", padding: "roomy" },
      layout: { width: "wide", density: "comfortable", desktop: "split" },
      decoration: "none", motion: "subtle",
    },
  },
  {
    id: "folio",
    name: "Folio",
    blurb: "Editorial. A serif name, a wide photograph and hairline sections. Quiet, assured and made for a good picture.",
    overrides: {
      colors: { background: "#e9edf3", text: "#101722", muted: "#4d586a", surface: "#f7f9fc", accent: "#7a1f2b", accentText: "#ffffff", border: "#c3ccd9" },
      text: { headingFont: "instrumentSerif", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      background: { kind: "solid", color: "#e9edf3" },
      header: { layout: "cover", avatarShape: "square", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "transparent", opacity: 100, radius: "none", border: "thin", shadow: "none", padding: "roomy" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "clean",
    name: "Clean",
    blurb: "Light, calm and precise. The dependable default for any business.",
    overrides: {
      colors: { background: "#f4f4f6", text: "#101114", muted: "#5b5d66", surface: "#ffffff", accent: "#1f5eff", accentText: "#ffffff", border: "#e3e3e8" },
      text: { headingFont: "geist", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#f4f4f6" },
      header: { layout: "centered", avatarShape: "rounded", avatarSize: "md", align: "center", actions: "primary", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "none", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "night",
    name: "Night",
    blurb: "Dark graphite with one sharp accent. Confident after hours.",
    overrides: {
      colors: { background: "#0d0e11", text: "#f3f3f5", muted: "#a6a8b0", surface: "#17181d", accent: "#c6f432", accentText: "#10130a", border: "#272830" },
      text: { headingFont: "geist", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#0d0e11" },
      header: { layout: "side", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "primary", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "soft", opacity: 100, radius: "xl", border: "none", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "colour",
    name: "Colour",
    blurb: "A confident full-colour page that is made to be shared.",
    overrides: {
      colors: { background: "#3a3af5", text: "#ffffff", muted: "#e0e2ff", surface: "#2d2dd8", accent: "#ffdd44", accentText: "#17163f", border: "#5555ff" },
      text: { headingFont: "bricolage", bodyFont: "manrope", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      background: { kind: "solid", color: "#3a3af5" },
      header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "center", actions: "primary", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "soft", opacity: 100, radius: "xl", border: "none", shadow: "none", padding: "comfortable" },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "lively",
    },
  },
  {
    id: "photo",
    name: "Photo",
    blurb: "Photography leads. Your best picture behind your name.",
    overrides: {
      colors: { background: "#0b0b0c", text: "#ffffff", muted: "#bcbcc2", surface: "#161617", accent: "#ffffff", accentText: "#0b0b0c", border: "#2b2b2e" },
      text: { headingFont: "geist", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#0b0b0c" },
      header: { layout: "poster", avatarShape: "circle", avatarSize: "sm", align: "left", actions: "primary", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "showroom",
    name: "Showroom",
    blurb: "Crisp and structured. Built for stock and specifications.",
    overrides: {
      colors: { background: "#eef2f0", text: "#0c1f1a", muted: "#4d5f58", surface: "#ffffff", accent: "#0f4d3c", accentText: "#ffffff", border: "#d9e1dd" },
      text: { headingFont: "spaceGrotesk", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#eef2f0" },
      header: { layout: "cover", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "primary", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "wide", density: "comfortable", desktop: "columns" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "journal",
    name: "Mono",
    blurb: "Crisp white, black type and square corners. Quiet, precise and modern.",
    overrides: {
      colors: { background: "#ffffff", text: "#0a0a0a", muted: "#5c5c66", surface: "#ffffff", accent: "#0a0a0a", accentText: "#ffffff", border: "#d9d9de" },
      text: { headingFont: "spaceGrotesk", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#ffffff" },
      header: { layout: "centered", avatarShape: "square", avatarSize: "sm", align: "left", actions: "buttons", showLocation: true, scrim: "medium" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "transparent", opacity: 100, radius: "sm", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "none",
    },
  },
  {
    id: "clay",
    name: "Terracotta",
    blurb: "A deep, warm colour page with soft rounded cards. Friendly and confident.",
    overrides: {
      colors: { background: "#b5432a", text: "#fff4ea", muted: "#ffe3d2", surface: "#a23a23", accent: "#ffd8b5", accentText: "#3a1409", border: "#cc5a3d" },
      text: { headingFont: "bricolage", bodyFont: "manrope", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      background: { kind: "gradient", from: "#bb4a2f", to: "#9c3520", angle: 180, motion: false },
      header: { layout: "centered", avatarShape: "arch", avatarSize: "lg", align: "center", actions: "buttons", showLocation: true, scrim: "medium" },
      buttons: { shape: "pill", fill: "soft", shadow: "soft", showIcons: true },
      cards: { surface: "soft", opacity: 100, radius: "xl", border: "none", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "forge",
    name: "Forge",
    blurb: "Loud, condensed and high contrast. For gyms, studios and anything with energy.",
    overrides: {
      colors: { background: "#111111", text: "#f5f5f0", muted: "#b5b5ad", surface: "#1d1d1b", accent: "#ff4d1a", accentText: "#111111", border: "#3a3a36" },
      text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#111111" },
      header: { layout: "poster", avatarShape: "square", avatarSize: "sm", align: "left", actions: "primary", showLocation: false },
      buttons: { shape: "square", fill: "solid", shadow: "hard", showIcons: false },
      cards: { surface: "solid", opacity: 100, radius: "none", border: "thick", shadow: "hard", padding: "compact" },
      layout: { width: "wide", density: "compact", desktop: "columns" },
      decoration: "stripes",
      motion: "lively",
    },
  },
  {
    id: "orchard",
    name: "Orchard",
    blurb: "Fresh greens and soft glass. Friendly and clear for teachers, tutors and coaches.",
    overrides: {
      colors: { background: "#e6f1e2", text: "#14301f", muted: "#456350", surface: "#f7fbf4", accent: "#1c7a45", accentText: "#ffffff", border: "#c9dfc4" },
      text: { headingFont: "lexend", bodyFont: "lexend", size: "lg", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "gradient", from: "#e9f4e4", to: "#d3e8cf", angle: 160, motion: true },
      header: { layout: "side", avatarShape: "circle", avatarSize: "lg", align: "left", actions: "icons", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "glass", opacity: 70, radius: "lg", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
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
