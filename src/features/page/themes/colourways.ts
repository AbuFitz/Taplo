import type { StyleOverrides } from "../contracts/style";
import type { PageDoc } from "../contracts/page";

/**
 * The curated registration colours: eight approved colour and background directions. A colourway recolours a page; it never touches
 * type, arrangement, widgets or content, so any look can wear any of them. Every one is a still design first. Movement is a separate,
 * deliberate choice and only exists for the treatments that have a background to move.
 */
export type ColourwayKind = "Solid dark" | "Deep colour" | "Dark glow" | "Dark gradient" | "Light gradient" | "Solid light";

type Colours = NonNullable<StyleOverrides["colors"]>;
type Background = NonNullable<StyleOverrides["background"]>;

export interface Colourway {
  id: string;
  name: string;
  kind: ColourwayKind;
  /** Whether the page reads as a dark or a light page. */
  tone: "dark" | "light";
  colors: Colours;
  /** The still background, exactly as approved. */
  background: Background;
  /** The same background with subtle movement on. Absent for solid colourways, which have nothing to move. */
  moving?: Background;
}

const still = (b: Background): Background => b;

export const COLOURWAYS: Colourway[] = [
  {
    id: "electric", name: "White / electric blue", kind: "Solid light", tone: "light",
    colors: { background: "#f8f9fc", text: "#222b3b", muted: "#5b6578", surface: "#ffffff", accent: "#2856d8", accentText: "#ffffff", border: "#dde2ee" },
    background: { kind: "solid", color: "#f8f9fc" },
  },
  {
    id: "stone", name: "Stone / ink", kind: "Solid light", tone: "light",
    colors: { background: "#f2efe9", text: "#262420", muted: "#5b564e", surface: "#fffdf9", accent: "#2b2a27", accentText: "#ffffff", border: "#ddd8cd" },
    background: { kind: "solid", color: "#f2efe9" },
  },
  {
    id: "sage", name: "Sage / pine", kind: "Solid light", tone: "light",
    colors: { background: "#edf1ec", text: "#1f2d24", muted: "#4f5e54", surface: "#ffffff", accent: "#2f5d46", accentText: "#ffffff", border: "#d3dcd2" },
    background: { kind: "solid", color: "#edf1ec" },
  },
  {
    id: "cloud", name: "Cloud / navy", kind: "Solid light", tone: "light",
    colors: { background: "#eef2f7", text: "#1b2a3d", muted: "#526074", surface: "#ffffff", accent: "#1f3a5f", accentText: "#ffffff", border: "#d6dde8" },
    background: { kind: "solid", color: "#eef2f7" },
  },
  {
    id: "clay", name: "Cream / clay", kind: "Solid light", tone: "light",
    colors: { background: "#f6efe7", text: "#3a2a20", muted: "#6b5646", surface: "#fffaf4", accent: "#a44a24", accentText: "#ffffff", border: "#e6d8c9" },
    background: { kind: "solid", color: "#f6efe7" },
  },
  {
    id: "silver", name: "Silver / ink", kind: "Light gradient", tone: "light",
    colors: { background: "#e4e6ea", text: "#343943", muted: "#585e6b", surface: "#ffffff", accent: "#252d3b", accentText: "#ffffff", border: "#c9cdd5" },
    background: { kind: "shader", style: "silk", colors: ["#ffffff", "#d6dae3"], base: "#e4e6ea", anchors: ["15% 0%", "100% 100%"], motion: false },
    moving: { kind: "shader", style: "silk", colors: ["#ffffff", "#d6dae3", "#c8ccd4"], base: "#e4e6ea", anchors: ["15% 0%", "100% 100%"], motion: true, pace: "slow" },
  },
  {
    id: "carbon", name: "Carbon / white", kind: "Solid dark", tone: "dark",
    colors: { background: "#0b0c0e", text: "#f4f5f7", muted: "#a3a7b0", surface: "#202226", accent: "#f4f5f7", accentText: "#101216", border: "#33363c" },
    background: { kind: "solid", color: "#0b0c0e" },
  },
  {
    id: "cobalt", name: "Navy / ice", kind: "Deep colour", tone: "dark",
    colors: { background: "#101b3b", text: "#edf3ff", muted: "#a9b9d8", surface: "#1c3054", accent: "#a7caff", accentText: "#101216", border: "#2f4876" },
    background: { kind: "gradient", from: "#122656", to: "#10172e", angle: 155, motion: false },
    moving: { kind: "shader", style: "warp", colors: ["#1d3f86", "#10172e"], base: "#10172e", anchors: ["12% 0%", "88% 100%"], motion: true, pace: "slow" },
  },
];

export const getColourway = (id: string | undefined) => COLOURWAYS.find((c) => c.id === id);

/**
 * Put a colourway on a page. Only colours and the background change; type, arrangement, widgets, cards and every piece of content are
 * left as they are. `motion` is the owner's explicit choice and defaults to still.
 */
export function applyColourway(page: PageDoc, cw: Colourway, opts: { motion?: boolean } = {}): PageDoc {
  const old = (page.appearance ?? {}) as StyleOverrides;
  const background = opts.motion && cw.moving ? cw.moving : cw.background;
  return { ...page, appearance: { ...old, colors: { ...(old.colors ?? {}), ...cw.colors } as Colours, background: structuredClone(background) } as StyleOverrides };
}

/** Which colourway (if any) this page is currently wearing, by its colour roles. */
export function colourwayOf(page: PageDoc): Colourway | undefined {
  const c = (page.appearance as StyleOverrides | undefined)?.colors;
  if (!c) return undefined;
  return COLOURWAYS.find((cw) => cw.colors.background === c.background && cw.colors.accent === c.accent && cw.colors.surface === c.surface);
}
