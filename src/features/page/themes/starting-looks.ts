import type { PageDoc } from "../contracts/page";
import { applyDesign, getDesign } from "./designs";
import { COLOURWAYS, applyColourway, colourwayOf, getColourway, type Colourway } from "./colourways";

/**
 * The registration collection: eight complete starting looks. Each pairs one approved colour direction with an existing design, so type,
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
  /** Solid looks stay still; only the two gentle gradient looks move once chosen. */
  animated: boolean;
}

const pair: Record<string, string> = {
  electric: "paper",
  stone: "maison",
  sage: "bloom",
  cloud: "bento",
  clay: "terra",
  silver: "glasshouse",
  carbon: "monochrome",
  cobalt: "quartz",
};

export const STARTING_LOOKS: StartingLook[] = COLOURWAYS.map((cw) => ({ id: cw.id, name: cw.name, kind: cw.kind, design: pair[cw.id]!, colourway: cw, animated: Boolean(cw.moving) }));

export const getStartingLook = (id: string | undefined) => STARTING_LOOKS.find((l) => l.id === id);

/** The look a page is currently wearing, recognised by its colours. */
export const startingLookOf = (page: PageDoc): StartingLook | undefined => {
  const cw = colourwayOf(page);
  return cw ? getStartingLook(cw.id) : undefined;
};

/** The first automatic recommendation: solid, still, and the same for everyone until they choose. */
export const RECOMMENDED_LOOK = "electric";

/** Put a starting look on a page. Content is never touched; arrangement, type and colours come from the look. */
export function applyStartingLook(page: PageDoc, look: StartingLook, opts: { reorder?: boolean } = {}): PageDoc {
  const design = getDesign(look.design);
  const base = design ? applyDesign(page, design, { reorder: opts.reorder }) : page;
  return applyColourway(base, look.colourway, { motion: look.animated });
}

export { getColourway };
