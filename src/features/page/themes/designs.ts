import type { StyleOverrides } from "../contracts/style";
import type { PageDoc } from "../contracts/page";
import type { Look } from "./looks";
import { applySectionTreatment, type SectionTreatmentId } from "../section-treatments";

/**
 * The design library. A design is a complete art direction on the one engine: colour, type, background, how the profile is
 * arranged, how sections relate to each other (composition), and how each kind of section prefers to be presented (recipe).
 * Nothing here is a stylesheet or a template tied to a trade; any business can wear any design, and every value stays editable.
 */
export type DesignMood = "Light" | "Dark" | "Colourful" | "Editorial" | "Minimal" | "Playful" | "Bold" | "Soft";
export type DesignMotion = "Still" | "Moving background";

export interface DesignRecipe {
  /** Preferred presentation for each kind of section (only where the section offers it). */
  variants?: Partial<Record<string, Record<string, unknown>>>;
  /** Section surface recipes by kind of section. */
  treatments?: Partial<Record<string, SectionTreatmentId>>;
  /** Kinds of section in the order this design composes them; kinds not listed keep their place after these. */
  order?: string[];
}

export interface Design extends Look {
  moods: DesignMood[];
  motion: DesignMotion;
  /** Kinds of business it suits best, by industry id; empty means any. */
  suits: string[];
  /** Three colours that sum the design up on a small card. */
  swatch: [string, string, string];
  recipe: DesignRecipe;
}

const d = (x: Design): Design => x;

export const DESIGNS: Design[] = [
  d({
    id: "borealis", name: "Borealis", blurb: "Deep night with slow moving colour behind frosted glass. Premium, calm and a little cinematic.",
    moods: ["Dark", "Colourful"], motion: "Moving background", suits: ["personal-trainer", "coach", "web-designer", "designer", "founder", "massage", "event-services"], swatch: ["#07080d", "#7c8cff", "#4b2c9b"],
    overrides: {
      colors: { background: "#07080d", text: "#f4f6ff", muted: "#aab2cf", surface: "#11131f", accent: "#8c9bff", accentText: "#07080d", border: "#272c48" },
      background: { kind: "shader", style: "aurora", colors: ["#121850", "#3a1f80", "#085470", "#4f2299"], base: "#07080d", motion: true, pace: "slow" },
      text: { headingFont: "outfit", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      header: { layout: "centered", avatarShape: "rounded", avatarSize: "lg", align: "center", actions: "primary", showLocation: true, scrim: "strong" },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 52, radius: "xl", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "stack" },
      decoration: "grain", motion: "lively",
    },
    recipe: { variants: { serviceList: { variant: "list" }, hours: { variant: "status" }, location: { variant: "compact" }, reviews: { variant: "cards" }, gallery: { variant: "mosaic" } } },
  }),
  d({
    id: "paper", name: "Paper", blurb: "A printed page: numbered sections, hairlines, warm paper and a confident serif.",
    moods: ["Light", "Editorial", "Minimal"], motion: "Still", suits: ["consultant", "accountant", "solicitor", "financial-adviser", "photographer", "architect", "hospitality", "tutor"], swatch: ["#f6f3ee", "#1a1815", "#b8a98f"],
    overrides: {
      colors: { background: "#f6f3ee", text: "#1a1815", muted: "#6a6358", surface: "#fffdf9", accent: "#1a1815", accentText: "#f6f3ee", border: "#d9d1c3" },
      background: { kind: "solid", color: "#f6f3ee" },
      text: { headingFont: "newsreader", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      header: { layout: "editorial", avatarShape: "logo", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "medium" , surface: "open" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "transparent", opacity: 100, radius: "none", border: "none", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "ledger" },
      decoration: "none", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, priceMenu: { variant: "menu" }, hours: { variant: "list" }, location: { variant: "card" }, text: { variant: "body" }, faq: { variant: "list" } } },
  }),
  d({
    id: "bento", name: "Bento", blurb: "A compact grid of confident tiles: more on screen, easy to scan, bright and friendly.",
    moods: ["Light", "Colourful", "Bold"], motion: "Still", suits: ["tutor", "personal-trainer", "hairdresser", "beauty-therapist", "nails", "coach", "music-teacher"], swatch: ["#eef0f5", "#2f5bff", "#111318"],
    overrides: {
      colors: { background: "#eceef3", text: "#101319", muted: "#566074", surface: "#ffffff", accent: "#2f5bff", accentText: "#ffffff", border: "#dde1ea" },
      background: { kind: "solid", color: "#eceef3" },
      text: { headingFont: "bricolage", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      header: { layout: "side", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "rounded", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "xl", border: "none", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "compact", rhythm: "tight", desktop: "centered", composition: "bento" },
      decoration: "none", motion: "subtle",
    },
    recipe: { order: ["booking", "serviceList", "priceMenu", "featuredService", "gallery", "hours", "location", "credentials", "share", "reviews", "team", "faq"], variants: { serviceList: { variant: "compact" }, hours: { variant: "compact" }, location: { variant: "compact" }, reviews: { variant: "cards" }, gallery: { variant: "mosaic" }, social: { variant: "icons" } } },
  }),
  d({
    id: "sheet", name: "Rise", blurb: "A bold colour field with your name on it, and everything else rising over it on a clean sheet.",
    moods: ["Colourful", "Bold", "Light"], motion: "Still", suits: ["plumber", "electrician", "cleaner", "landscaper", "builder", "handyman", "detailer", "removals"], swatch: ["#0f5d4a", "#f4f7f4", "#d8f26a"],
    overrides: {
      colors: { background: "#f4f7f4", text: "#10211b", muted: "#52645c", surface: "#ffffff", accent: "#0f5d4a", accentText: "#ffffff", border: "#d5e0da" },
      background: { kind: "solid", color: "#f4f7f4" },
      text: { headingFont: "manrope", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      header: { layout: "side", avatarShape: "rounded", avatarSize: "lg", align: "left", actions: "primary", showLocation: true, scrim: "medium" , surface: "open" },
      buttons: { shape: "pill", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "lg", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "sheet-bold" },
      decoration: "none", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, hours: { variant: "status" }, location: { variant: "compact" }, reviews: { variant: "compact" }, enquiry: { variant: "card" }, faq: { variant: "cards" } } },
  }),
  d({
    id: "noir", name: "Noir", blurb: "Black, brass and a full-width photograph. Sharp edges, tall capitals, a little grain.",
    moods: ["Dark", "Bold"], motion: "Still", suits: ["barber", "tattoo", "car-dealer", "mechanic", "detailer", "photographer", "hospitality"], swatch: ["#0c0c0c", "#c8a35a", "#f2efe9"],
    overrides: {
      colors: { background: "#0c0c0c", text: "#f2efe9", muted: "#a49d90", surface: "#151515", accent: "#c8a35a", accentText: "#0c0c0c", border: "#2b2822" },
      background: { kind: "solid", color: "#0c0c0c" },
      text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      header: { layout: "poster", avatarShape: "square", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "strong" , surface: "open" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "none", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "stack" },
      decoration: "grain", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, priceMenu: { variant: "menu" }, hours: { variant: "list" }, gallery: { variant: "masonry" }, team: { variant: "grid" } } },
  }),
  d({
    id: "bloom", name: "Bloom", blurb: "Soft pastel light that drifts behind rounded, friendly cards. Gentle, personal, polished.",
    moods: ["Light", "Soft", "Colourful"], motion: "Moving background", suits: ["nails", "lashes-brows", "beauty-therapist", "makeup", "florist", "hairdresser", "vet", "music-teacher"], swatch: ["#ffe3dc", "#e0516b", "#d9e2ff"],
    overrides: {
      colors: { background: "#fff4ef", text: "#2d1f22", muted: "#7a6468", surface: "#ffffff", accent: "#c2335a", accentText: "#ffffff", border: "#f1d9d6" },
      background: { kind: "shader", style: "swirl", colors: ["#ffd5cc", "#ffe9bf", "#dbe3ff", "#f6d6f0"], base: "#fff4ef", motion: true, pace: "slow" },
      text: { headingFont: "outfit", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "center", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 72, radius: "xl", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "stack" },
      decoration: "none", motion: "lively",
    },
    recipe: { variants: { serviceList: { variant: "cards" }, priceMenu: { variant: "panels" }, hours: { variant: "status" }, location: { variant: "visit" }, gallery: { variant: "mosaic" } } },
  }),
  d({
    id: "terra", name: "Terra", blurb: "Warm clay, sand and a characterful serif. Hand-made, welcoming and grounded.",
    moods: ["Light", "Soft", "Editorial"], motion: "Still", suits: ["hospitality", "maker", "florist", "event-services", "interiors", "vet", "illustrator"], swatch: ["#f2e6d9", "#b4492d", "#3a2418"],
    overrides: {
      colors: { background: "#f2e6d9", text: "#3a2418", muted: "#7b5d4a", surface: "#fbf4ec", accent: "#b4492d", accentText: "#ffffff", border: "#e2d0bd" },
      background: { kind: "solid", color: "#f2e6d9" },
      text: { headingFont: "dmSerif", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "center" },
      header: { layout: "centered", avatarShape: "rounded", avatarSize: "lg", align: "center", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "pill", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "soft", opacity: 100, radius: "xl", border: "none", shadow: "none", padding: "roomy" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "stack" },
      decoration: "grain", motion: "subtle",
    },
    recipe: { variants: { priceMenu: { variant: "panels" }, serviceList: { variant: "cards" }, hours: { variant: "compact" }, location: { variant: "visit" }, text: { variant: "statement" } } },
  }),
  d({
    id: "quartz", name: "Quartz", blurb: "Calm, trustworthy and exact. A soft colour field, crisp type and sections that read at a glance.",
    moods: ["Light", "Minimal"], motion: "Still", suits: ["dentist", "physio", "accountant", "solicitor", "financial-adviser", "estate-agent", "consultant", "vet"], swatch: ["#e8eef5", "#1f4f8f", "#14202e"],
    overrides: {
      colors: { background: "#f3f6fa", text: "#14202e", muted: "#546579", surface: "#ffffff", accent: "#1f4f8f", accentText: "#ffffff", border: "#d8e0ea" },
      background: { kind: "solid", color: "#f3f6fa" },
      text: { headingFont: "instrumentSans", bodyFont: "instrumentSans", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      header: { layout: "side", avatarShape: "logo", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "medium" , surface: "open" },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "md", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "sheet" },
      decoration: "none", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, hours: { variant: "status" }, location: { variant: "card" }, faq: { variant: "list" }, team: { variant: "list" }, credentials: { variant: "chips" } } },
  }),
  d({
    id: "volt", name: "Volt", blurb: "High voltage. Near-black, electric lime, hard edges and a grid you can feel.",
    moods: ["Dark", "Bold", "Colourful"], motion: "Still", suits: ["personal-trainer", "sports-coach", "driving-instructor", "event-services", "web-designer", "mechanic"], swatch: ["#0a0a0a", "#c6ff3d", "#2a2a2a"],
    overrides: {
      colors: { background: "#0a0a0a", text: "#fafafa", muted: "#a3a3a3", surface: "#151515", accent: "#c6ff3d", accentText: "#0a0a0a", border: "#2c2c2c" },
      background: { kind: "solid", color: "#0a0a0a" },
      text: { headingFont: "spaceGrotesk", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      header: { layout: "editorial", avatarShape: "square", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "strong" , surface: "open" },
      buttons: { shape: "square", fill: "solid", shadow: "hard", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "sm", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "compact", rhythm: "tight", desktop: "centered", composition: "bento" },
      decoration: "grid", motion: "lively",
    },
    recipe: { order: ["booking", "featuredService", "serviceList", "priceMenu", "offers", "hours", "location", "gallery", "team", "reviews", "faq"], variants: { serviceList: { variant: "compact" }, hours: { variant: "compact" }, location: { variant: "compact" }, offers: { variant: "cards" } } },
  }),
  d({
    id: "glasshouse", name: "Glasshouse", blurb: "Light, airy and alive. Pale colour moves behind frosted panels, with calm centred type.",
    moods: ["Light", "Soft", "Colourful"], motion: "Moving background", suits: ["coach", "massage", "beauty-therapist", "physio", "tutor", "consultant", "landscaper"], swatch: ["#cfeee3", "#0d7a5f", "#dde8ff"],
    overrides: {
      colors: { background: "#eef6f3", text: "#0f231d", muted: "#4e6a60", surface: "#ffffff", accent: "#0d7a5f", accentText: "#ffffff", border: "#cfe0d9" },
      background: { kind: "shader", style: "aurora", colors: ["#c9ecdf", "#d9e6ff", "#efe0ff", "#fff0d1"], base: "#eef6f3", motion: true, pace: "slow" },
      text: { headingFont: "geist", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "center" },
      header: { layout: "centered", avatarShape: "circle", avatarSize: "lg", align: "center", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 62, radius: "xl", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "stack" },
      decoration: "none", motion: "lively",
    },
    recipe: { variants: { serviceList: { variant: "cards" }, hours: { variant: "status" }, location: { variant: "visit" }, reviews: { variant: "cards" } } },
  }),
  d({
    id: "monochrome", name: "Monochrome", blurb: "Stark black on white with oversized type. Confident, minimal and unmistakably designed.",
    moods: ["Light", "Minimal", "Editorial", "Bold"], motion: "Still", suits: ["designer", "architect", "web-designer", "filmmaker", "illustrator", "interiors", "founder", "photographer"], swatch: ["#ffffff", "#0a0a0a", "#8a8a8a"],
    overrides: {
      colors: { background: "#ffffff", text: "#0a0a0a", muted: "#666666", surface: "#f5f5f5", accent: "#0a0a0a", accentText: "#ffffff", border: "#e1e1e1" },
      background: { kind: "solid", color: "#ffffff" },
      text: { headingFont: "syne", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      header: { layout: "editorial", avatarShape: "logo", avatarSize: "sm", align: "left", actions: "primary", showLocation: true, scrim: "medium" , surface: "open" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "transparent", opacity: 100, radius: "none", border: "none", shadow: "none", padding: "comfortable" },
      layout: { width: "wide", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "ledger" },
      decoration: "none", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, priceMenu: { variant: "menu" }, gallery: { variant: "mosaic" }, hours: { variant: "list" }, text: { variant: "statement" } } },
  }),
  d({
    id: "garage", name: "Garage", blurb: "Workshop black and signal orange. Tough, fast to read, and built to get the phone call.",
    moods: ["Dark", "Bold", "Colourful"], motion: "Still", suits: ["mechanic", "detailer", "car-dealer", "removals", "builder", "locksmith", "handyman"], swatch: ["#17181b", "#ff6a1a", "#34363c"],
    overrides: {
      colors: { background: "#17181b", text: "#f3f3f1", muted: "#a7a9b0", surface: "#202226", accent: "#ff6a1a", accentText: "#101113", border: "#34363c" },
      background: { kind: "solid", color: "#17181b" },
      text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "md", headingCase: "upper", headingWeight: "bold", align: "left" },
      header: { layout: "side", avatarShape: "square", avatarSize: "lg", align: "left", actions: "primary", showLocation: true, scrim: "strong" , surface: "open" },
      buttons: { shape: "square", fill: "solid", shadow: "none", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "sm", border: "thin", shadow: "none", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "sheet-bold" },
      decoration: "stripes", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, hours: { variant: "status" }, location: { variant: "compact" }, enquiry: { variant: "card" }, faq: { variant: "cards" } } },
  }),
  d({
    id: "marine", name: "Marine", blurb: "Deep navy, warm brass and slow rolling smoke. Established, discreet and quietly expensive.",
    moods: ["Dark", "Editorial"], motion: "Moving background", suits: ["solicitor", "financial-adviser", "estate-agent", "accountant", "consultant", "architect", "interiors"], swatch: ["#0d1b2d", "#c9a45c", "#24415f"],
    overrides: {
      colors: { background: "#0d1b2d", text: "#f3efe6", muted: "#a9b5c6", surface: "#14283f", accent: "#c9a45c", accentText: "#0d1b2d", border: "#26415f" },
      background: { kind: "shader", style: "smoke", colors: ["#1b3a5c", "#24506f", "#5a4a2a"], base: "#0d1b2d", motion: true, pace: "slow" },
      text: { headingFont: "fraunces", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "center" },
      header: { layout: "centered", avatarShape: "logo", avatarSize: "md", align: "center", actions: "primary", showLocation: true, scrim: "strong" },
      buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: false },
      cards: { surface: "glass", opacity: 62, radius: "md", border: "thin", shadow: "none", padding: "roomy" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "stack" },
      decoration: "none", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, hours: { variant: "list" }, location: { variant: "card" }, text: { variant: "statement" }, faq: { variant: "list" } } },
  }),
  d({
    id: "candy", name: "Candy", blurb: "Playful and punchy: chunky outlines, hard shadows, bright colour and lots of personality.",
    moods: ["Colourful", "Playful", "Bold", "Light"], motion: "Still", suits: ["tutor", "music-teacher", "vet", "event-services", "language-teacher", "hairdresser", "maker"], swatch: ["#fff2cc", "#ff4f8b", "#2a1b4d"],
    overrides: {
      colors: { background: "#fff3d1", text: "#2a1b4d", muted: "#6b5a8e", surface: "#ffffff", accent: "#ff4f8b", accentText: "#2a1b4d", border: "#2a1b4d" },
      background: { kind: "solid", color: "#fff3d1" },
      text: { headingFont: "bricolage", bodyFont: "outfit", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
      header: { layout: "side", avatarShape: "circle", avatarSize: "lg", align: "left", actions: "primary", showLocation: true, scrim: "medium" },
      buttons: { shape: "pill", fill: "solid", shadow: "hard", showIcons: true },
      cards: { surface: "solid", opacity: 100, radius: "xl", border: "thick", shadow: "hard", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "bento" },
      decoration: "dots", motion: "lively",
    },
    recipe: { order: ["booking", "serviceList", "featuredService", "gallery", "hours", "location", "credentials", "share", "reviews", "team", "faq"], variants: { serviceList: { variant: "cards" }, hours: { variant: "compact" }, location: { variant: "compact" }, reviews: { variant: "cards" } } },
  }),
  d({
    id: "maison", name: "Maison", blurb: "Fashion-house elegance: high-contrast didone type, cream paper and photography given room.",
    moods: ["Light", "Editorial", "Soft"], motion: "Still", suits: ["makeup", "florist", "hairdresser", "photographer", "interiors", "beauty-therapist", "maker"], swatch: ["#efe9df", "#231f1c", "#a38b6d"],
    overrides: {
      colors: { background: "#efe9df", text: "#231f1c", muted: "#6f665b", surface: "#f8f4ec", accent: "#231f1c", accentText: "#efe9df", border: "#d6ccbb" },
      background: { kind: "solid", color: "#efe9df" },
      text: { headingFont: "bodoni", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "center" },
      header: { layout: "poster", avatarShape: "logo", avatarSize: "md", align: "center", actions: "primary", showLocation: true, scrim: "strong" , surface: "open" },
      buttons: { shape: "pill", fill: "outline", shadow: "none", showIcons: false },
      cards: { surface: "soft", opacity: 100, radius: "none", border: "none", shadow: "none", padding: "roomy" },
      layout: { width: "regular", density: "comfortable", rhythm: "editorial", desktop: "centered", composition: "stack" },
      decoration: "grain", motion: "subtle",
    },
    recipe: { variants: { serviceList: { variant: "list" }, priceMenu: { variant: "menu" }, hours: { variant: "list" }, gallery: { variant: "mosaic" }, text: { variant: "statement" } } },
  }),
  d({
    id: "sunrise", name: "Sunrise", blurb: "A warm gradient morning with a friendly rounded serif. Optimistic, human and easy to love.",
    moods: ["Colourful", "Soft", "Light"], motion: "Moving background", suits: ["coach", "tutor", "hospitality", "personal-trainer", "event-services", "massage", "founder"], swatch: ["#ffd9b8", "#d4572b", "#c9b6f5"],
    overrides: {
      colors: { background: "#fff1e4", text: "#34231a", muted: "#7d6252", surface: "#fffaf5", accent: "#bf4620", accentText: "#ffffff", border: "#f0d5c0" },
      background: { kind: "gradient", from: "#ffe3c9", to: "#e5d4fb", angle: 160, motion: true, pace: "slow" },
      text: { headingFont: "youngSerif", bodyFont: "inter", size: "md", headingCase: "normal", headingWeight: "regular", align: "left" },
      header: { layout: "side", avatarShape: "circle", avatarSize: "lg", align: "left", actions: "primary", showLocation: true, scrim: "medium" , surface: "open" },
      buttons: { shape: "pill", fill: "solid", shadow: "soft", showIcons: true },
      cards: { surface: "glass", opacity: 70, radius: "xl", border: "thin", shadow: "soft", padding: "comfortable" },
      layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "sheet" },
      decoration: "none", motion: "lively",
    },
    recipe: { variants: { serviceList: { variant: "cards" }, hours: { variant: "status" }, location: { variant: "visit" }, text: { variant: "note" } } },
  }),
];

export const DESIGN_IDS = DESIGNS.map((x) => x.id);
const byId = new Map(DESIGNS.map((x) => [x.id, x]));
export const getDesign = (id: string): Design | undefined => byId.get(id);

/** What every design starts from, so choosing a design always gives that design's presentation and never a blend of two. */
const BASE_VARIANTS: Record<string, Record<string, unknown>> = {
  serviceList: { variant: "list" }, priceMenu: { variant: "menu" }, hours: { variant: "list" }, location: { variant: "card" },
  faq: { variant: "list" }, reviews: { variant: "cards" }, gallery: { variant: "mosaic" }, team: { variant: "list" }, text: { variant: "body" },
};

/** Applies a design's recipe to a page's sections. Content is never touched; only how each section is presented and ordered. */
export function applyRecipe(widgets: PageDoc["widgets"], recipe: DesignRecipe): PageDoc["widgets"] {
  const styled = widgets.map((w) => {
    const variant = BASE_VARIANTS[w.type] || recipe.variants?.[w.type] ? { ...BASE_VARIANTS[w.type], ...recipe.variants?.[w.type] } : undefined;
    const treatment = recipe.treatments?.[w.type];
    return { ...w, ...(variant ? { settings: { ...w.settings, ...variant } } : {}), ...(treatment ? { appearance: applySectionTreatment(w.appearance, treatment) } : {}) };
  });
  const order = recipe.order;
  if (!order) return styled;
  const rank = (type: string) => { const i = order.indexOf(type); return i < 0 ? order.length : i; };
  return styled.map((w, i) => ({ w, i })).sort((a, b) => rank(a.w.type) - rank(b.w.type) || a.i - b.i).map(({ w }) => w);
}

/** The one way a design is put on a page: register, change design in the dashboard, and "Use this design" all go through here. */
export function applyDesign(page: PageDoc, design: Design, opts: { reorder?: boolean } = {}): PageDoc {
  // A design restyles blocks; it only arranges them while a page is still being set up. An owner's block order is theirs.
  const recipe = opts.reorder ? design.recipe : { ...design.recipe, order: undefined };
  return { ...page, themeId: design.id, appearance: structuredClone(design.overrides) as StyleOverrides, widgets: applyRecipe(page.widgets, recipe) };
}

export interface KeepOptions { colours?: boolean; type?: boolean; background?: boolean }
/**
 * Putting a design on an existing page. Content is never touched; the owner chooses whether their current colours and typeface
 * are kept. Anything the design sets that the owner chose to keep is carried over unchanged.
 */
export function applyDesignKeeping(page: PageDoc, design: Design, keep: KeepOptions = {}): PageDoc {
  const next = applyDesign(page, design);
  const old = page.appearance ?? {};
  const a = next.appearance as StyleOverrides;
  const merged: StyleOverrides = {
    ...a,
    ...(keep.colours && old.colors ? { colors: { ...a.colors, ...old.colors } } : {}),
    ...(keep.type && old.text ? { text: { ...a.text, headingFont: old.text.headingFont ?? a.text?.headingFont, bodyFont: old.text.bodyFont ?? a.text?.bodyFont } as StyleOverrides["text"] } : {}),
    ...(keep.background && old.background ? { background: old.background } : {}),
  };
  return { ...next, appearance: merged };
}

/** A plain-language account of what a design changes, for the confirmation shown before it is applied. */
export function describeChange(design: Design): string[] {
  const o = design.overrides;
  const out: string[] = [];
  out.push(`Colours: ${design.moods[0]?.toLowerCase() ?? "new"} palette with ${o.colors?.accent ? "its own accent" : "an accent"}`);
  out.push(`Typeface: ${o.text?.headingFont ?? "new"} headings`);
  const comp = o.layout?.composition ?? "stack";
  out.push(`Layout: ${({ stack: "sections on cards", bento: "a compact grid", sheet: "a sheet over a colour field", "sheet-bold": "a sheet over a bold colour field", ledger: "open numbered sections" } as Record<string, string>)[comp]}`);
  if (design.motion === "Moving background") out.push("Background: slow, moving colour");
  return out;
}

/** Industries a design also suits beyond the first list, so every kind of business has several designs that belong to it. */
const ALSO_SUITS: Record<string, string[]> = {
  garage: ["barber", "tattoo", "locksmith", "pest-control", "plumber", "electrician"],
  monochrome: ["barber", "tattoo", "designer", "photographer"],
  terra: ["barber", "tattoo", "driving-instructor"],
  quartz: ["plumber", "electrician", "builder", "cleaner", "handyman", "locksmith", "pest-control", "dentist", "driving-instructor", "car-dealer", "coach"],
  marine: ["car-dealer", "plumber", "electrician", "builder", "surf"],
  glasshouse: ["dentist", "cleaner", "vet", "hairdresser", "lashes-brows", "nails", "makeup", "florist"],
  sunrise: ["driving-instructor", "physio", "dentist", "language-teacher", "music-teacher", "florist"],
  bento: ["dentist", "language-teacher", "driving-instructor", "barber", "lashes-brows", "makeup", "web-designer", "founder"],
  volt: ["sports-coach", "barber", "tattoo", "car-dealer", "detailer"],
  bloom: ["event-services", "language-teacher", "massage"],
  candy: ["hospitality", "florist", "founder", "illustrator"],
  paper: ["estate-agent", "language-teacher", "coach", "dentist", "interiors", "illustrator", "maker"],
  sheet: ["pest-control", "locksmith", "mechanic", "event-services", "web-designer"],
  maison: ["estate-agent", "illustrator", "nails", "lashes-brows"],
  noir: ["hairdresser", "massage", "event-services"],
  borealis: ["filmmaker", "music-teacher", "tattoo"],
};
const PRIMARY = new Map(DESIGNS.map((x) => [x.id, new Set(x.suits)]));
for (const x of DESIGNS) x.suits = [...new Set([...x.suits, ...(ALSO_SUITS[x.id] ?? [])])];

const NEUTRAL = ["quartz", "paper", "monochrome", "glasshouse"];
/** The designs that belong to a kind of business, best first. Never a design made for something else. */
export function designsFor(industryKey: string, limit = 6): Design[] {
  const fit = DESIGNS.filter((x) => x.suits.includes(industryKey)).sort((a, b) => Number(PRIMARY.get(b.id)!.has(industryKey)) - Number(PRIMARY.get(a.id)!.has(industryKey)));
  const extra = fit.length < 4 ? NEUTRAL.map((id) => byId.get(id)!).filter((x) => x && !fit.includes(x)) : [];
  return [...fit, ...extra].slice(0, limit);
}

export type FinishId = NonNullable<NonNullable<StyleOverrides["layout"]>["finish"]>;
export const FINISHES: { id: FinishId; name: string; line: string }[] = [
  { id: "frosted", name: "Frosted glass", line: "Translucent panels that catch the light" },
  { id: "solid", name: "Elevated solid", line: "Solid cards lifted off the canvas" },
  { id: "flat", name: "Editorial flat", line: "No boxes, just hairlines and type" },
  { id: "grid", name: "Industrial grid", line: "Tight tiles with exposed borders" },
];
/** Puts a material on a page's appearance. Colour, type and the profile arrangement stay exactly as they are. */
export function applyFinish(o: StyleOverrides, finish: FinishId, dark: boolean): StyleOverrides {
  const cards: Partial<NonNullable<StyleOverrides["cards"]>> = {
    frosted: { surface: "glass" as const, opacity: dark ? 8 : 65, radius: "xl" as const, border: "thin" as const, shadow: "soft" as const },
    solid: { surface: "solid" as const, opacity: 100, radius: "lg" as const, border: "none" as const, shadow: "soft" as const },
    flat: { surface: "transparent" as const, opacity: 0, radius: "none" as const, border: "none" as const, shadow: "none" as const },
    grid: { surface: "solid" as const, opacity: 100, radius: "sm" as const, border: "thin" as const, shadow: "none" as const },
  }[finish];
  const composition = { frosted: "stack", solid: "stack", flat: "ledger", grid: "bento" }[finish] as NonNullable<NonNullable<StyleOverrides["layout"]>["composition"]>;
  return { ...o, cards: { ...o.cards, ...cards }, layout: { ...o.layout, finish, composition }, header: { ...o.header, surface: finish === "flat" ? "open" : o.header?.surface } };
}

/** The profile arrangement a page wears, on top of whichever design it has. Unknown names change nothing. */
export function withArrangement(page: PageDoc, arrangement?: string): PageDoc {
  if (!arrangement || !["melt", "split", "bento", "type"].includes(arrangement)) return page;
  const align = arrangement === "bento" ? "center" : "left";
  return { ...page, appearance: { ...page.appearance, header: { ...page.appearance.header, layout: arrangement as NonNullable<StyleOverrides["header"]>["layout"], align } } };
}
