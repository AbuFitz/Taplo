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
    id: "carbon", name: "Carbon / white", kind: "Solid dark", tone: "dark",
    colors: { background: "#0b0c0e", text: "#f4f5f7", muted: "#a3a7b0", surface: "#202226", accent: "#f4f5f7", accentText: "#101216", border: "#33363c" },
    background: { kind: "solid", color: "#0b0c0e" },
  },
  {
    id: "cobalt", name: "Cobalt / ice", kind: "Deep colour", tone: "dark",
    colors: { background: "#101b3b", text: "#edf3ff", muted: "#a9b9d8", surface: "#1c3054", accent: "#a7caff", accentText: "#101216", border: "#2f4876" },
    background: still({ kind: "gradient", from: "#122656", to: "#10172e", angle: 155, motion: false }),
    moving: { kind: "shader", style: "warp", colors: ["#1d3f86", "#10172e"], base: "#10172e", anchors: ["12% 0%", "88% 100%"], motion: true, pace: "slow" },
  },
  {
    id: "ember", name: "Black / ember", kind: "Dark glow", tone: "dark",
    colors: { background: "#110e0e", text: "#fff1e9", muted: "#cdb3a6", surface: "#251b1b", accent: "#f2b28b", accentText: "#101216", border: "#3d2d2b" },
    background: { kind: "shader", style: "smoke", colors: ["#7d3824", "#35201b"], base: "#100e10", anchors: ["88% 5%", "88% 5%"], motion: false },
    moving: { kind: "shader", style: "smoke", colors: ["#7d3824", "#35201b", "#100e10"], base: "#100e10", anchors: ["88% 5%", "88% 5%"], motion: true, pace: "slow" },
  },
  {
    id: "plum", name: "Plum / pearl", kind: "Deep colour", tone: "dark",
    colors: { background: "#261d2c", text: "#f8edf5", muted: "#cfb9cc", surface: "#48324b", accent: "#ecdfef", accentText: "#101216", border: "#5d4561" },
    background: { kind: "gradient", from: "#3d2941", to: "#201b28", angle: 145, motion: false },
    moving: { kind: "shader", style: "orbs", colors: ["#4d3452", "#201b28"], base: "#201b28", anchors: ["0% 0%", "100% 100%"], motion: true, pace: "slow" },
  },
  {
    id: "violet", name: "Blue / violet", kind: "Dark gradient", tone: "dark",
    colors: { background: "#12152e", text: "#eff2ff", muted: "#aeb7d8", surface: "#1c2340", accent: "#d0dcff", accentText: "#101216", border: "#303a66" },
    background: { kind: "shader", style: "aurora", colors: ["#254c8c", "#603370"], base: "#12152e", anchors: ["0% 5%", "100% 100%"], motion: false },
    moving: { kind: "shader", style: "aurora", colors: ["#254c8c", "#603370", "#171326"], base: "#12152e", anchors: ["0% 5%", "100% 100%"], motion: true, pace: "slow" },
  },
  {
    id: "silver", name: "Silver / ink", kind: "Light gradient", tone: "light",
    colors: { background: "#e4e6ea", text: "#343943", muted: "#5d6370", surface: "#ffffff", accent: "#252d3b", accentText: "#ffffff", border: "#c9cdd5" },
    background: { kind: "shader", style: "silk", colors: ["#ffffff", "#d6dae3"], base: "#e4e6ea", anchors: ["15% 0%", "100% 100%"], motion: false },
    moving: { kind: "shader", style: "silk", colors: ["#ffffff", "#d6dae3", "#c8ccd4"], base: "#e4e6ea", anchors: ["15% 0%", "100% 100%"], motion: true, pace: "slow" },
  },
  {
    id: "electric", name: "White / electric blue", kind: "Solid light", tone: "light",
    colors: { background: "#f8f9fc", text: "#222b3b", muted: "#5b6578", surface: "#ffffff", accent: "#2856d8", accentText: "#ffffff", border: "#dde2ee" },
    background: { kind: "solid", color: "#f8f9fc" },
  },
  {
    id: "rose", name: "Rose / warm white", kind: "Light gradient", tone: "light",
    colors: { background: "#f4e9e7", text: "#583c40", muted: "#7d6064", surface: "#fffaf6", accent: "#79434e", accentText: "#ffffff", border: "#e6cfcb" },
    background: { kind: "shader", style: "swirl", colors: ["#dbb8b6", "#fcf9f5"], base: "#f0ddda", anchors: ["0% 100%", "100% 0%"], motion: false },
    moving: { kind: "shader", style: "swirl", colors: ["#dbb8b6", "#fcf9f5", "#f0ddda"], base: "#f0ddda", anchors: ["0% 100%", "100% 0%"], motion: true, pace: "slow" },
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
