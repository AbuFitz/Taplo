import type { StyleOverrides } from "../contracts/style";
import type { PageDoc } from "../contracts/page";
import { applyDesign, getDesign } from "./designs";
import { COLOURWAYS, applyColourway, colourwayOf, getColourway, type Colourway } from "./colourways";

/**
 * The registration collection: twelve complete starting looks. Each pairs one approved colour direction with an existing design, so type,
 * arrangement and how sections sit come from the engine as it already is. A look is a starting point: every value stays editable and
 * legacy saved designs are untouched.
 */
export interface StartingLook {
  id: string;
  name: string;
  kind: Colourway["kind"];
  /** The existing design that supplies typeface, arrangement and composition. */
  design: string;
  colourway: Colourway;
  /** Solid looks stay still; only the flow looks (Paper, Mono flow, Midnight flow and Graphite silk) move once chosen. */
  animated: boolean;
}

export const SIGNATURE_APPEARANCE: StyleOverrides = {
    text: { headingFont: "geist", bodyFont: "geist", size: "md", headingCase: "normal", headingWeight: "bold", align: "left" },
    header: { layout: "lifted", avatarShape: "rounded", avatarSize: "md", align: "left", actions: "primary", showLocation: true, scrim: "medium", surface: "open" },
    buttons: { shape: "rounded", fill: "solid", shadow: "none", showIcons: true },
    cards: { surface: "solid", opacity: 100, radius: "lg", border: "none", shadow: "soft", padding: "comfortable" },
    layout: { width: "regular", density: "comfortable", rhythm: "even", desktop: "centered", composition: "stack" },
    decoration: "none", motion: "subtle",
};

export function signatureWidgets(widgets: PageDoc["widgets"]): PageDoc["widgets"] {
  return widgets.map(w => ({ ...w, settings: { ...w.settings, ...(w.type === "serviceList" ? { variant: "compact" } : w.type === "team" ? { variant: "swipe" } : {}) } }));
}

const pair: Record<string, string> = {
  standard: "bento",
  sand: "terra",
  paper: "paper",
  sage: "bloom",
  cloud: "bento",
  clay: "sheet",
  limestone: "maison",
  ink: "monochrome",
  mono: "noir",
  midnight: "borealis",
  silk: "glasshouse",
  forest: "marine",
  navy: "quartz",
};

export const STARTING_LOOKS: StartingLook[] = COLOURWAYS.map((cw) => ({ id: cw.id, name: cw.name, kind: cw.kind, design: pair[cw.id]!, colourway: cw, animated: Boolean(cw.moving) }));

export const SETUP_LOOKS = STARTING_LOOKS.filter(l => ["standard", "cloud", "ink", "mono", "midnight", "silk"].includes(l.id));

export const getStartingLook = (id: string | undefined) => STARTING_LOOKS.find((l) => l.id === id);

/** The look a page is currently wearing, recognised by its colours. */
export const startingLookOf = (page: PageDoc): StartingLook | undefined => {
  const cw = colourwayOf(page);
  return cw ? getStartingLook(cw.id) : undefined;
};

/** The first automatic recommendation: solid, still, and the same for everyone until they choose. */
export const RECOMMENDED_LOOK = "standard";

/** Put a starting look on a page. Content is never touched; arrangement, type and colours come from the look. */
export function applyStartingLook(page: PageDoc, look: StartingLook, opts: { reorder?: boolean } = {}): PageDoc {
  const design = getDesign(look.design);
  const base = design ? applyDesign(page, design, { reorder: opts.reorder }) : page;
  const dressed = applyColourway(base, look.colourway, { motion: look.animated });
  if (look.id === "standard") return { ...dressed, appearance: {
    ...dressed.appearance,
    ...SIGNATURE_APPEARANCE,
  }, widgets: signatureWidgets(dressed.widgets) };
  // Every look carries the same soft pill buttons, whichever design supplies the type and arrangement.
  return { ...dressed, appearance: { ...dressed.appearance, buttons: { ...(dressed.appearance as { buttons?: object }).buttons, shape: "pill" } } as PageDoc["appearance"] };
}

export { getColourway };
