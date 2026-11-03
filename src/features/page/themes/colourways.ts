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
    id: "standard", name: "Signature", kind: "Solid light", tone: "light",
    colors: { background: "#ffffff", text: "#141414", muted: "#62666d", surface: "#ffffff", accent: "#141414", accentText: "#ffffff", border: "#e7e9ed" },
    background: { kind: "solid", color: "#ffffff" },
  },
  {
    id: "sand", name: "Warm sand", kind: "Solid light", tone: "light",
    colors: { background: "#e9dfd3", text: "#382a22", muted: "#635044", surface: "#fffcf7", accent: "#6c412e", accentText: "#ffffff", border: "#cbbbaa" },
    background: { kind: "solid", color: "#e9dfd3" },
  },
  {
    id: "paper", name: "Paper", kind: "Light gradient", tone: "light",
    colors: { background: "#f3f3f0", text: "#1a2421", muted: "#53615c", surface: "#ffffff", accent: "#183f32", accentText: "#ffffff", border: "#ccd4cf" },
    background: { kind: "gradient", from: "#f3f3f0", to: "#d8ddd9", angle: 140, motion: false },
    moving: { kind: "gradient", from: "#f3f3f0", to: "#d8ddd9", angle: 140, motion: true, pace: "slow" },
  },
  {
    id: "sage", name: "Sage mist", kind: "Solid light", tone: "light",
    colors: { background: "#edf1ec", text: "#1f2d24", muted: "#4f5e54", surface: "#ffffff", accent: "#2f5d46", accentText: "#ffffff", border: "#d3dcd2" },
    background: { kind: "solid", color: "#edf1ec" },
  },
  {
    id: "cloud", name: "Soft cloud", kind: "Solid light", tone: "light",
    colors: { background: "#eef2f7", text: "#1b2a3d", muted: "#526074", surface: "#ffffff", accent: "#1f3a5f", accentText: "#ffffff", border: "#d6dde8" },
    background: { kind: "solid", color: "#eef2f7" },
  },
  {
    id: "clay", name: "Terracotta", kind: "Solid light", tone: "light",
    colors: { background: "#f6efe7", text: "#3a2a20", muted: "#6b5646", surface: "#fffaf4", accent: "#a44a24", accentText: "#ffffff", border: "#e6d8c9" },
    background: { kind: "solid", color: "#f6efe7" },
  },
  {
    id: "limestone", name: "Limestone", kind: "Solid light", tone: "light",
    colors: { background: "#f2efe9", text: "#262420", muted: "#5b564e", surface: "#fffdf9", accent: "#2b2a27", accentText: "#ffffff", border: "#ddd8cd" },
    background: { kind: "solid", color: "#f2efe9" },
  },
  {
    id: "ink", name: "Ink", kind: "Solid dark", tone: "dark",
    colors: { background: "#090b0d", text: "#f3f5f6", muted: "#b7c0c6", surface: "#202328", accent: "#eef3f5", accentText: "#101316", border: "#3d444c" },
    background: { kind: "solid", color: "#090b0d" },
  },
  {
    id: "mono", name: "Mono flow", kind: "Dark gradient", tone: "dark",
    colors: { background: "#090b0d", text: "#f3f5f6", muted: "#e8edf1", surface: "#24272c", accent: "#eef3f5", accentText: "#101316", border: "#41474f" },
    background: { kind: "gradient", from: "#08090b", to: "#656970", angle: 135, motion: false },
    moving: { kind: "gradient", from: "#08090b", to: "#656970", angle: 135, motion: true, pace: "steady" },
  },
  {
    id: "midnight", name: "Midnight flow", kind: "Dark gradient", tone: "dark",
    colors: { background: "#080b12", text: "#f1f5fa", muted: "#b8c8d5", surface: "#1b2530", accent: "#c0e4ef", accentText: "#10212b", border: "#3b4c5b" },
    background: { kind: "shader", style: "aurora", base: "#080b12", colors: ["#080b12", "#244555", "#423754", "#101822"], motion: false },
    moving: { kind: "shader", style: "aurora", base: "#080b12", colors: ["#080b12", "#244555", "#423754", "#101822"], motion: true, pace: "steady" },
  },
  {
    id: "silk", name: "Graphite silk", kind: "Dark gradient", tone: "dark",
    colors: { background: "#0b0e0e", text: "#f1f6f4", muted: "#b9c9c3", surface: "#222b29", accent: "#d7ebdf", accentText: "#14251b", border: "#405049" },
    background: { kind: "shader", style: "silk", base: "#0b0e0e", colors: ["#0b0e0e", "#49534f", "#18241e"], motion: false },
    moving: { kind: "shader", style: "silk", base: "#0b0e0e", colors: ["#0b0e0e", "#49534f", "#18241e"], motion: true, pace: "slow" },
  },
  {
    id: "forest", name: "Forest", kind: "Solid dark", tone: "dark",
    colors: { background: "#0f1a14", text: "#eaf3ee", muted: "#a9bdb2", surface: "#1b2b22", accent: "#bfe3cc", accentText: "#0f1a14", border: "#2f4a3b" },
    background: { kind: "solid", color: "#0f1a14" },
  },
  {
    id: "navy", name: "Harbour", kind: "Solid dark", tone: "dark",
    colors: { background: "#101b3b", text: "#edf3ff", muted: "#a9b9d8", surface: "#1c3054", accent: "#a7caff", accentText: "#101216", border: "#2f4876" },
    background: { kind: "solid", color: "#101b3b" },
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
