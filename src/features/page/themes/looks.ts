import * as radix from "@radix-ui/colors";
import { EXPANDED_LOOKS } from "./expanded";
import { CURATED_DESIGNS } from "./curated";
import type { StyleOverrides } from "../contracts/style";

/**
 * Curated configurations of the one appearance engine. Each is simply a complete set of owner
 * choices (StyleOverrides) over the same base: nothing here is a separate stylesheet, and any
 * value can be changed afterwards through the same controls.
 */
export interface Look {
  id: string;
  name: string;
  blurb: string;
  overrides: StyleOverrides;
}

const EXISTING_LOOKS: Look[] = [
  {
    id: "forecourt",
    name: "Forecourt",
    blurb:
      "A clear identity, generous photographs and room for the facts. Practical, calm and easy to scan.",
    overrides: {
      colors: {
        background: "#edf2ef",
        text: "#18332f",
        muted: "#50635e",
        surface: "#ffffff",
        accent: "#123d3a",
        accentText: "#ffffff",
        border: "#ccd8d1",
      },
      text: {
        headingFont: "manrope",
        bodyFont: "inter",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#edf2ef" },
      header: {
        layout: "side",
        avatarShape: "logo",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "sm",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
      layout: { width: "wide", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "highstreet",
    name: "High Street",
    blurb:
      "Warm paper, inky blue and a picture of the work. Clear prices with a friendly, practical feel.",
    overrides: {
      colors: {
        background: "#f3eddf",
        text: "#183c55",
        muted: "#50616b",
        surface: "#fffaf0",
        accent: "#183c55",
        accentText: "#fffaf0",
        border: "#cec6b6",
      },
      text: {
        headingFont: "bricolage",
        bodyFont: "inter",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#f3eddf" },
      header: {
        layout: "cover",
        avatarShape: "logo",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "transparent",
        opacity: 100,
        radius: "sm",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
      layout: { width: "wide", density: "comfortable", desktop: "split" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "workbay",
    name: "Workbay",
    blurb:
      "Deep blue-grey, practical yellow and generous service cards. Built to put the work first.",
    overrides: {
      colors: {
        background: "#152a32",
        text: "#f3f5ed",
        muted: "#b5c5c7",
        surface: "#213a43",
        accent: "#f5da64",
        accentText: "#152a32",
        border: "#476069",
      },
      text: {
        headingFont: "spaceGrotesk",
        bodyFont: "inter",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#152a32" },
      header: {
        layout: "cover",
        avatarShape: "logo",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "md",
        border: "thin",
        shadow: "none",
        padding: "roomy",
      },
      layout: { width: "wide", density: "comfortable", desktop: "split" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "counter",
    name: "Counter",
    blurb:
      "A neighbourhood menu, warm paper and generous serif headings. Food and prices come first.",
    overrides: {
      colors: {
        background: "#fff8ea",
        text: "#3b2c25",
        muted: "#6d6256",
        surface: "#fffdf7",
        accent: "#395745",
        accentText: "#ffffff",
        border: "#d9cdb9",
      },
      text: {
        headingFont: "instrumentSerif",
        bodyFont: "manrope",
        size: "md",
        headingCase: "normal",
        headingWeight: "regular",
        align: "left",
      },
      background: {
        kind: "solid",
        color: "#fff8ea",
      },
      header: {
        layout: "cover",
        avatarShape: "logo",
        avatarSize: "md",
        align: "left",
        actions: "none",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "transparent",
        opacity: 100,
        radius: "none",
        border: "none",
        shadow: "none",
        padding: "comfortable",
      },
      layout: {
        width: "wide",
        density: "comfortable",
        desktop: "split",
      },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "fieldwork",
    name: "Fieldwork",
    blurb:
      "A practical identity, a photograph of the work and clear service cards. Built for local jobs.",
    overrides: {
      colors: {
        background: "#eef0e7",
        text: "#203b32",
        muted: "#526458",
        surface: "#ffffff",
        accent: "#315b3e",
        accentText: "#ffffff",
        border: "#cdd6c7",
      },
      text: {
        headingFont: "manrope",
        bodyFont: "manrope",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: {
        kind: "solid",
        color: "#eef0e7",
      },
      header: {
        layout: "feature",
        avatarShape: "logo",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "md",
        border: "thin",
        shadow: "none",
        padding: "roomy",
      },
      layout: {
        width: "wide",
        density: "comfortable",
        desktop: "centered",
      },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "notebook",
    name: "Notebook",
    blurb:
      "A personal introduction, confident blue and readable sessions. Quiet and easy to get to know.",
    overrides: {
      colors: {
        background: "#f7f8fb",
        text: "#1f3554",
        muted: "#56657d",
        surface: "#ffffff",
        accent: "#254d89",
        accentText: "#ffffff",
        border: "#d8deea",
      },
      text: {
        headingFont: "sourceSerif",
        bodyFont: "manrope",
        size: "md",
        headingCase: "normal",
        headingWeight: "regular",
        align: "left",
      },
      background: {
        kind: "solid",
        color: "#f7f8fb",
      },
      header: {
        layout: "side",
        avatarShape: "rounded",
        avatarSize: "lg",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "soft",
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "lg",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
      layout: {
        width: "wide",
        density: "comfortable",
        desktop: "split",
      },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "folio",
    name: "Folio",
    blurb:
      "Editorial. A serif name, a wide photograph and hairline sections. Quiet, assured and made for a good picture.",
    overrides: {
      colors: {
        background: "#e9edf3",
        text: "#101722",
        muted: "#4d586a",
        surface: "#f7f9fc",
        accent: "#7a1f2b",
        accentText: "#ffffff",
        border: "#c3ccd9",
      },
      text: {
        headingFont: "instrumentSerif",
        bodyFont: "inter",
        size: "md",
        headingCase: "normal",
        headingWeight: "regular",
        align: "left",
      },
      background: { kind: "solid", color: "#e9edf3" },
      header: {
        layout: "cover",
        avatarShape: "square",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
        scrim: "medium",
      },
      buttons: {
        shape: "square",
        fill: "solid",
        shadow: "none",
        showIcons: false,
      },
      cards: {
        surface: "transparent",
        opacity: 100,
        radius: "none",
        border: "thin",
        shadow: "none",
        padding: "roomy",
      },
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
      colors: {
        background: "#f4f4f6",
        text: "#101114",
        muted: "#5b5d66",
        surface: "#ffffff",
        accent: "#1f5eff",
        accentText: "#ffffff",
        border: "#e3e3e8",
      },
      text: {
        headingFont: "geist",
        bodyFont: "geist",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#f4f4f6" },
      header: {
        layout: "centered",
        avatarShape: "rounded",
        avatarSize: "md",
        align: "center",
        actions: "primary",
        showLocation: true,
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "lg",
        border: "none",
        shadow: "soft",
        padding: "comfortable",
      },
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
      colors: {
        background: "#0d0e11",
        text: "#f3f3f5",
        muted: "#a6a8b0",
        surface: "#17181d",
        accent: "#c6f432",
        accentText: "#10130a",
        border: "#272830",
      },
      text: {
        headingFont: "geist",
        bodyFont: "geist",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#0d0e11" },
      header: {
        layout: "side",
        avatarShape: "rounded",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
      },
      buttons: {
        shape: "pill",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "soft",
        opacity: 100,
        radius: "xl",
        border: "none",
        shadow: "none",
        padding: "comfortable",
      },
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
      colors: {
        background: "#3a3af5",
        text: "#ffffff",
        muted: "#e0e2ff",
        surface: "#2d2dd8",
        accent: "#ffdd44",
        accentText: "#17163f",
        border: "#5555ff",
      },
      text: {
        headingFont: "bricolage",
        bodyFont: "manrope",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "center",
      },
      background: { kind: "solid", color: "#3a3af5" },
      header: {
        layout: "centered",
        avatarShape: "circle",
        avatarSize: "lg",
        align: "center",
        actions: "primary",
        showLocation: true,
      },
      buttons: {
        shape: "pill",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "soft",
        opacity: 100,
        radius: "xl",
        border: "none",
        shadow: "none",
        padding: "comfortable",
      },
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
      colors: {
        background: "#0b0b0c",
        text: "#ffffff",
        muted: "#bcbcc2",
        surface: "#161617",
        accent: "#ffffff",
        accentText: "#0b0b0c",
        border: "#2b2b2e",
      },
      text: {
        headingFont: "geist",
        bodyFont: "geist",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#0b0b0c" },
      header: {
        layout: "poster",
        avatarShape: "circle",
        avatarSize: "sm",
        align: "left",
        actions: "primary",
        showLocation: true,
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "lg",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
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
      colors: {
        background: "#eef2f0",
        text: "#0c1f1a",
        muted: "#4d5f58",
        surface: "#ffffff",
        accent: "#0f4d3c",
        accentText: "#ffffff",
        border: "#d9e1dd",
      },
      text: {
        headingFont: "spaceGrotesk",
        bodyFont: "geist",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#eef2f0" },
      header: {
        layout: "cover",
        avatarShape: "rounded",
        avatarSize: "md",
        align: "left",
        actions: "primary",
        showLocation: true,
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "lg",
        border: "thin",
        shadow: "soft",
        padding: "comfortable",
      },
      layout: { width: "wide", density: "comfortable", desktop: "columns" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "journal",
    name: "Mono",
    blurb:
      "Crisp white, black type and square corners. Quiet, precise and modern.",
    overrides: {
      colors: {
        background: "#ffffff",
        text: "#0a0a0a",
        muted: "#5c5c66",
        surface: "#ffffff",
        accent: "#0a0a0a",
        accentText: "#ffffff",
        border: "#d9d9de",
      },
      text: {
        headingFont: "spaceGrotesk",
        bodyFont: "inter",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#ffffff" },
      header: {
        layout: "centered",
        avatarShape: "square",
        avatarSize: "sm",
        align: "left",
        actions: "buttons",
        showLocation: true,
        scrim: "medium",
      },
      buttons: {
        shape: "square",
        fill: "solid",
        shadow: "none",
        showIcons: false,
      },
      cards: {
        surface: "transparent",
        opacity: 100,
        radius: "sm",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
      layout: { width: "narrow", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "none",
    },
  },
  {
    id: "clay",
    name: "Terracotta",
    blurb:
      "A deep, warm colour page with soft rounded cards. Friendly and confident.",
    overrides: {
      colors: {
        background: "#b5432a",
        text: "#fff4ea",
        muted: "#ffe3d2",
        surface: "#a23a23",
        accent: "#ffd8b5",
        accentText: "#3a1409",
        border: "#cc5a3d",
      },
      text: {
        headingFont: "bricolage",
        bodyFont: "manrope",
        size: "md",
        headingCase: "normal",
        headingWeight: "bold",
        align: "center",
      },
      background: {
        kind: "gradient",
        from: "#bb4a2f",
        to: "#9c3520",
        angle: 180,
        motion: false,
      },
      header: {
        layout: "centered",
        avatarShape: "rounded",
        avatarSize: "lg",
        align: "center",
        actions: "buttons",
        showLocation: true,
        scrim: "medium",
      },
      buttons: { shape: "pill", fill: "soft", shadow: "soft", showIcons: true },
      cards: {
        surface: "soft",
        opacity: 100,
        radius: "xl",
        border: "none",
        shadow: "soft",
        padding: "comfortable",
      },
      layout: { width: "regular", density: "comfortable", desktop: "centered" },
      decoration: "none",
      motion: "subtle",
    },
  },
  {
    id: "forge",
    name: "Forge",
    blurb:
      "Loud, condensed and high contrast. For gyms, studios and anything with energy.",
    overrides: {
      colors: {
        background: "#111111",
        text: "#f5f5f0",
        muted: "#b5b5ad",
        surface: "#1d1d1b",
        accent: "#ff4d1a",
        accentText: "#111111",
        border: "#3a3a36",
      },
      text: {
        headingFont: "barlowCondensed",
        bodyFont: "inter",
        size: "md",
        headingCase: "upper",
        headingWeight: "bold",
        align: "left",
      },
      background: { kind: "solid", color: "#111111" },
      header: {
        layout: "poster",
        avatarShape: "square",
        avatarSize: "sm",
        align: "left",
        actions: "primary",
        showLocation: false,
      },
      buttons: {
        shape: "square",
        fill: "solid",
        shadow: "hard",
        showIcons: false,
      },
      cards: {
        surface: "solid",
        opacity: 100,
        radius: "none",
        border: "thick",
        shadow: "hard",
        padding: "compact",
      },
      layout: { width: "wide", density: "compact", desktop: "columns" },
      decoration: "stripes",
      motion: "lively",
    },
  },
  {
    id: "orchard",
    name: "Orchard",
    blurb:
      "Fresh greens and soft glass. Friendly and clear for teachers, tutors and coaches.",
    overrides: {
      colors: {
        background: "#e6f1e2",
        text: "#14301f",
        muted: "#456350",
        surface: "#f7fbf4",
        accent: "#1c7a45",
        accentText: "#ffffff",
        border: "#c9dfc4",
      },
      text: {
        headingFont: "lexend",
        bodyFont: "lexend",
        size: "lg",
        headingCase: "normal",
        headingWeight: "bold",
        align: "left",
      },
      background: {
        kind: "gradient",
        from: "#e9f4e4",
        to: "#d3e8cf",
        angle: 160,
        motion: true,
      },
      header: {
        layout: "side",
        avatarShape: "circle",
        avatarSize: "lg",
        align: "left",
        actions: "icons",
        showLocation: true,
      },
      buttons: {
        shape: "rounded",
        fill: "solid",
        shadow: "none",
        showIcons: true,
      },
      cards: {
        surface: "glass",
        opacity: 70,
        radius: "lg",
        border: "thin",
        shadow: "none",
        padding: "comfortable",
      },
      layout: { width: "regular", density: "comfortable", desktop: "split" },
      decoration: "none",
      motion: "subtle",
    },
  },
];

/** New compositions lead discovery; earlier IDs still resolve for existing saved pages. */
export const SPOTLIGHT_LOOK_IDS = ["open", "service", "personal", "ink"] as const;
function composition(id: string, name: string, blurb: string, base: string, overrides: StyleOverrides): Look {
  const original = EXISTING_LOOKS.find(l => l.id === base)!.overrides;
  return { id, name, blurb, overrides: { ...original, ...overrides,
    colors: { ...original.colors, ...overrides.colors }, text: { ...original.text, ...overrides.text },
    header: { ...original.header, ...overrides.header }, buttons: { ...original.buttons, ...overrides.buttons },
    cards: { ...original.cards, ...overrides.cards }, layout: { ...original.layout, ...overrides.layout },
  } };
}
export const LOOKS: Look[] = [
  composition("voltage", "Voltage", "Electric blue. Oversized type. Your work in the spotlight.", "highstreet", {
    colors: { background: "#1645ff", text: "#ffffff", muted: "#e0e7ff", surface: "#0c31c9", accent: "#d5ff40", accentText: "#102000", border: "#6c8cff" },
    background: { kind: "solid", color: "#1645ff" },
    text: { headingFont: "spaceGrotesk", bodyFont: "inter", size: "lg", headingCase: "upper" },
    header: { layout: "poster", avatarShape: "logo", scrim: "strong" },
    buttons: { shape: "square" }, cards: { surface: "transparent", radius: "none", border: "thin", padding: "roomy" },
    layout: { desktop: "split", width: "wide" }, motion: "lively",
  }),
  composition("apex", "Apex", "Carbon black. Acid green. Big photography and precise detail.", "workbay", {
    colors: { background: "#080a0e", text: "#ffffff", muted: "#b9c0cf", surface: "#151922", accent: "#bcff3b", accentText: "#122000", border: "#353d4b" },
    background: { kind: "solid", color: "#080a0e" },
    text: { headingFont: "barlowCondensed", bodyFont: "inter", size: "lg", headingCase: "upper" },
    header: { layout: "poster", scrim: "strong" }, buttons: { shape: "square", shadow: "none" },
    cards: { radius: "sm", padding: "roomy", border: "thin" }, layout: { desktop: "columns", width: "wide" }, motion: "lively",
  }),
  composition("ultraviolet", "Ultraviolet", "An unmistakable violet identity, icy panels and a wide introduction.", "forecourt", {
    colors: { background: "#6227ed", text: "#ffffff", muted: "#e6dcff", surface: "#481db8", accent: "#caffef", accentText: "#08291e", border: "#ac8bff" },
    background: { kind: "solid", color: "#6227ed" }, text: { headingFont: "spaceGrotesk", size: "lg" },
    header: { layout: "feature", avatarShape: "logo" }, buttons: { shape: "rounded" },
    cards: { radius: "md", surface: "solid", padding: "roomy" }, layout: { desktop: "centered", width: "wide" }, motion: "lively",
  }),
  composition("minted", "Minted", "Ice mint, ink-black type and a menu with real presence.", "counter", {
    colors: { background: "#baffeb", text: "#061d24", muted: "#315b60", surface: "#e9fff8", accent: "#183dff", accentText: "#ffffff", border: "#75c5b4" },
    background: { kind: "solid", color: "#baffeb" },
    text: { headingFont: "spaceGrotesk", bodyFont: "inter", headingWeight: "bold", size: "lg" },
    header: { layout: "cover", actions: "none" }, buttons: { shape: "square" },
    cards: { radius: "none", surface: "transparent", border: "thin", padding: "roomy" }, layout: { desktop: "split" }, motion: "lively",
  }),
  composition("blueprint", "Blueprint", "White space with a cobalt punch. A wide photo and clearly framed services.", "fieldwork", {
    colors: { background: "#edf1ff", text: "#0d1738", muted: "#47547a", surface: "#ffffff", accent: "#1645ff", accentText: "#ffffff", border: "#bcc9ef" },
    background: { kind: "solid", color: "#edf1ff" }, text: { headingFont: "spaceGrotesk", size: "lg" },
    header: { layout: "feature" }, cards: { radius: "sm", padding: "roomy" }, buttons: { shape: "square" },
    layout: { desktop: "centered", width: "wide" }, motion: "lively",
  }),
  composition("signal", "Signal", "Cyan, black and a personal introduction. Bold without getting in the way.", "notebook", {
    colors: { background: "#60e4ff", text: "#071b35", muted: "#224c6b", surface: "#c5f5ff", accent: "#071b35", accentText: "#ffffff", border: "#2fa4c5" },
    background: { kind: "solid", color: "#60e4ff" },
    text: { headingFont: "manrope", bodyFont: "inter", headingWeight: "bold", size: "lg" },
    header: { layout: "side", avatarShape: "rounded" }, cards: { radius: "md", padding: "roomy" },
    layout: { desktop: "split", width: "wide" }, motion: "lively",
  }),
  composition("open", "Studio", "Photography first. An open introduction and generous space between sections.", "clean", {
    colors: { background: "#ffffff", text: "#111111", muted: "#616161", surface: "#f5f5f5", accent: "#111111", accentText: "#ffffff", border: "#dedede" },
    background: { kind: "solid", color: "#ffffff" },
    text: { headingFont: "inter", bodyFont: "inter", headingCase: "normal", headingWeight: "bold", size: "md", align: "left" },
    header: { layout: "feature", avatarShape: "logo", align: "left", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" },
    cards: { surface: "transparent", radius: "lg", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "centered", width: "wide", density: "comfortable", rhythm: "editorial" }, motion: "subtle",
  }),
  composition("service", "Service", "A compact profile, clear prices and the next action within reach.", "clean", {
    colors: { background: "#ffffff", text: "#111111", muted: "#616161", surface: "#f5f5f5", accent: "#111111", accentText: "#ffffff", border: "#dedede" },
    background: { kind: "solid", color: "#ffffff" },
    text: { headingFont: "inter", bodyFont: "inter", headingCase: "normal", headingWeight: "bold", size: "md", align: "left" },
    header: { layout: "side", avatarShape: "rounded", avatarSize: "sm", align: "left", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" },
    cards: { surface: "soft", radius: "lg", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "split", width: "wide", density: "compact", rhythm: "tight" }, motion: "subtle",
  }),
  composition("personal", "Personal", "A centred introduction with a clear, focused flow through your page.", "clean", {
    colors: { background: "#ffffff", text: "#111111", muted: "#616161", surface: "#f5f5f5", accent: "#111111", accentText: "#ffffff", border: "#dedede" },
    background: { kind: "solid", color: "#ffffff" },
    text: { headingFont: "inter", bodyFont: "inter", headingCase: "normal", headingWeight: "bold", size: "md", align: "center" },
    header: { layout: "centered", avatarShape: "circle", avatarSize: "md", align: "center", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" },
    cards: { surface: "solid", radius: "lg", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "centered", width: "regular", density: "comfortable", rhythm: "even" }, motion: "subtle",
  }),
  composition("ink", "Midnight", "Neutral black, a quiet profile and softly separated sections.", "night", {
    colors: { background: "#000000", text: "#ffffff", muted: "#ababab", surface: "#161616", accent: "#ffffff", accentText: "#000000", border: "#303030" },
    background: { kind: "solid", color: "#000000" },
    text: { headingFont: "inter", bodyFont: "inter", headingCase: "normal", headingWeight: "bold", size: "md", align: "left" },
    header: { layout: "minimal", avatarShape: "logo", align: "left", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" },
    cards: { surface: "solid", radius: "lg", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "split", width: "wide", density: "comfortable", rhythm: "even" }, motion: "subtle",
  }),
  composition("silver", "Silver", "An open white page with a slowly moving silver background. Follows your logo when you add one.", "clean", {
    colors: { background: "#ffffff", text: "#111111", muted: "#555555", surface: "#ffffff", accent: "#111111", accentText: "#ffffff", border: "#dedede" },
    background: { kind: "gradient", from: "#ffffff", to: "#e0e0e0", angle: 135, motion: true, source: "logo" },
    text: { headingFont: "inter", bodyFont: "inter", headingWeight: "bold", size: "md" },
    header: { layout: "centered", avatarShape: "logo", align: "center", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" }, cards: { surface: "solid", radius: "xl", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "centered", width: "regular", rhythm: "editorial" }, motion: "subtle",
  }),
  composition("smoke", "Smoke", "Ink black with a quiet, moving tonal background. A clear stage for your identity.", "night", {
    colors: { background: "#000000", text: "#ffffff", muted: "#b0b0b0", surface: "#161616", accent: "#ffffff", accentText: "#000000", border: "#303030" },
    background: { kind: "gradient", from: "#000000", to: "#292929", angle: 145, motion: true, source: "logo" },
    text: { headingFont: "inter", bodyFont: "inter", headingWeight: "bold", size: "md" },
    header: { layout: "minimal", avatarShape: "logo", align: "left", actions: "primary" },
    buttons: { shape: "pill", shadow: "none" }, cards: { surface: "soft", radius: "xl", border: "none", shadow: "none", padding: "comfortable" },
    layout: { desktop: "split", width: "wide", rhythm: "editorial" }, motion: "subtle",
  }),
  ...EXISTING_LOOKS,
  ...EXPANDED_LOOKS,
].map((look): Look => {
  const design = CURATED_DESIGNS[look.id];
  if (!design) return look;
  const o = look.overrides, s = design.style;
  return { ...look, blurb: design.blurb, overrides: { ...o, ...s,
    colors: {...o.colors,...s.colors}, text: {...o.text,...s.text}, header: {...o.header,...s.header},
    buttons: {...o.buttons,...s.buttons}, cards: {...o.cards,...s.cards}, layout: {...o.layout,...s.layout}, motion:"subtle",
  }};
});

/** Discovery uses the new direction. Earlier configurations remain resolvable for saved pages. */
export const STARTER_LOOKS = ["open", "service", "personal", "ink", "clay", "showroom"].map(id => LOOKS.find(l => l.id === id)!);
export const CURRENT_LOOKS = ["open","showroom","clay","atelier","founder","service","ink","kiln","lune","orchard","personal","forge"].map(id=>LOOKS.find(l=>l.id===id)!);

/* ---- Radix-derived palettes: coordinated neutral + accent, light and dark ---- */
type Scale = Record<string, string>;
const scale = (name: string): Scale =>
  (radix as unknown as Record<string, Scale>)[name]!;
const step = (name: string, n: number) =>
  scale(name)[`${name.replace(/Dark$/, "")}${n}`]!;

export interface Palette {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: NonNullable<StyleOverrides["colors"]>;
}

function make(
  id: string,
  name: string,
  neutral: string,
  accent: string,
  mode: "light" | "dark",
): Palette {
  const n = mode === "dark" ? `${neutral}Dark` : neutral;
  const a = mode === "dark" ? `${accent}Dark` : accent;
  const accentSolid = step(a, 9);
  // Accent text is chosen by the engine's readability repair if this is not enough; start from the neutral extremes.
  const text = step(n, 12);
  const bg = mode === "dark" ? step(n, 1) : step(n, 2);
  return {
    id,
    name,
    mode,
    colors: {
      background: bg,
      text,
      muted: step(n, 11),
      surface: mode === "dark" ? step(n, 3) : step(n, 1),
      accent: accentSolid,
      accentText: mode === "dark" ? step(n, 1) : step(n, 12),
      border: step(n, 6),
    },
  };
}

export const PALETTES: Palette[] = [
  { id: "white", name: "White", mode: "light", colors: { background: "#ffffff", text: "#111111", muted: "#616161", surface: "#f5f5f5", accent: "#111111", accentText: "#ffffff", border: "#dedede" } },
  { id: "ink", name: "Ink", mode: "dark", colors: { background: "#000000", text: "#ffffff", muted: "#ababab", surface: "#161616", accent: "#ffffff", accentText: "#000000", border: "#303030" } },
  make("sand-amber", "Sand & amber", "sand", "amber", "light"),
  make("olive-jade", "Olive & jade", "olive", "jade", "light"),
  make("slate-indigo", "Slate & indigo", "slate", "indigo", "light"),
  make("mauve-crimson", "Mauve & crimson", "mauve", "crimson", "light"),
  make("sand-amber-dark", "Ember", "sand", "amber", "dark"),
  make("olive-lime-dark", "Moss", "olive", "lime", "dark"),
  make("slate-iris-dark", "Midnight", "slate", "iris", "dark"),
  make("mauve-orange-dark", "Dusk", "mauve", "orange", "dark"),
];
