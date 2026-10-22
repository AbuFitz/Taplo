import type { StyleSpec } from "../contracts/style";

/**
 * Visual themes: full bundles of defaults, not palettes. They differ in header
 * treatment, typography, background, button and card construction, decoration and
 * desktop arrangement. No theme is tied to an industry; any business may use any theme.
 * Owners never see ids or values; they see name, description and a live preview.
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  style: StyleSpec;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "studio",
    name: "Studio",
    description: "Warm paper, soft serif type and an arched portrait.",
    style: {
      colors: { background: "#f7f1ea", text: "#2a2019", muted: "#6b5d52", surface: "#ffffff", accent: "#9a4a35", accentText: "#ffffff", border: "#e6dccf" },
      text: { headingFont: "fraunces", bodyFont: "manrope", size: "md", headingCase: "normal", headingWeight: "regular", align: "center" },
      background: { kind: "solid", color: "#f7f1ea" },
      header: { layout: "centered", avatarShape: "arch", avatarSize: "lg", align: "center", actions: "buttons", showLocation: true },
      buttons: { shape: "rounded", fill: "soft", shadow: "soft", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "narrow", density: "comfortable", desktop: "split" },
      decoration: "grain",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark, glassy and electric, with a cover photo behind the name.",
    style: {
      colors: { background: "#0b0d12", text: "#f3f5f8", muted: "#a9b0bf", surface: "#171c28", accent: "#c6ff3d", accentText: "#0b0d12", border: "#2a3142" },
      text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      background: { kind: "gradient", from: "#0b0d12", to: "#161d33", angle: 160, motion: false },
      header: { layout: "poster", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "icons", showLocation: true },
      buttons: { shape: "rounded", fill: "outline", shadow: "none", showIcons: true },
      cards: { surface: "glass", opacity: 70, radius: "md", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
      decoration: "glow",
    },
  },
  {
    id: "workshop",
    name: "Workshop",
    description: "Hard edges, thick outlines and yellow. Built for people who do things.",
    style: {
      colors: { background: "#efede6", text: "#141414", muted: "#4d4a43", surface: "#ffffff", accent: "#ffc400", accentText: "#141414", border: "#141414" },
      text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#efede6" },
      header: { layout: "cover", avatarShape: "square", avatarSize: "md", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "square", fill: "solid", shadow: "hard", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "none", border: "thick", shadow: "hard", padding: "compact" },
      layout: { width: "regular", density: "compact", desktop: "columns" },
      decoration: "stripes",
    },
  },
  {
    id: "candy",
    name: "Candy",
    description: "Soft gradients, bubbly pill buttons and frosted cards.",
    style: {
      colors: { background: "#ffe3f0", text: "#2b2140", muted: "#5b5075", surface: "#ffffff", accent: "#6d28d9", accentText: "#ffffff", border: "#ffffff" },
      text: { headingFont: "lexend", bodyFont: "manrope", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      background: { kind: "gradient", from: "#ffd6e8", to: "#d9d4ff", angle: 160, motion: false },
      header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "center", actions: "buttons", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 72, radius: "xl", border: "none", shadow: "soft", padding: "roomy" },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "dots",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Type-led and quiet: no avatar, thin rules, underlined links.",
    style: {
      colors: { background: "#fbfaf7", text: "#111111", muted: "#55524c", surface: "#fbfaf7", accent: "#111111", accentText: "#ffffff", border: "#111111" },
      text: { headingFont: "sourceSerif", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      background: { kind: "solid", color: "#fbfaf7" },
      header: { layout: "minimal", avatarShape: "none", avatarSize: "sm", align: "left", actions: "icons", showLocation: true },
      buttons: { shape: "square", fill: "outline", shadow: "none", showIcons: false },
      cards: { surface: "transparent", opacity: 0, radius: "none", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
      decoration: "none",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep teal gradient that slowly drifts, with sand-coloured highlights.",
    style: {
      colors: { background: "#06303a", text: "#f0fbfb", muted: "#b9dadd", surface: "#0d4753", accent: "#ffd166", accentText: "#0b2a30", border: "#2f8791" },
      text: { headingFont: "manrope", bodyFont: "manrope", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "gradient", from: "#06303a", to: "#0f7480", angle: 200, motion: true },
      header: { layout: "side", avatarShape: "circle", avatarSize: "md", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "pill", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "glass", opacity: 55, radius: "lg", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "glow",
    },
  },
  {
    id: "classroom",
    name: "Classroom",
    description: "Bright, friendly and clear, with a gentle grid backdrop.",
    style: {
      colors: { background: "#f1f6ff", text: "#14213d", muted: "#43546f", surface: "#ffffff", accent: "#1f5fbf", accentText: "#ffffff", border: "#c9d8f0" },
      text: { headingFont: "lexend", bodyFont: "inter", size: "lg", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#f1f6ff" },
      header: { layout: "cover", avatarShape: "rounded", avatarSize: "lg", align: "center", actions: "buttons", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "md", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "grid",
    },
  },
  {
    id: "garden",
    name: "Garden",
    description: "Sage greens and soft shapes with the portrait beside the name.",
    style: {
      colors: { background: "#eef2e8", text: "#1f2a1f", muted: "#4f5b49", surface: "#fbfcf8", accent: "#356634", accentText: "#ffffff", border: "#d0dac4" },
      text: { headingFont: "fraunces", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      background: { kind: "solid", color: "#eef2e8" },
      header: { layout: "side", avatarShape: "arch", avatarSize: "md", align: "left", actions: "buttons", showLocation: true },
      buttons: { shape: "rounded", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", desktop: "columns" },
      decoration: "none",
    },
  },
];

export const DEFAULT_THEME_ID = "studio";
const byId = new Map(THEMES.map((t) => [t.id, t]));
export const getTheme = (id: string): ThemeDefinition | undefined => byId.get(id);
