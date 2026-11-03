import { styleSpecSchema, type StyleSpec } from "../contracts/style";
import { LOOKS } from "./looks";

/**
 * Starting looks: complete configurations of the one appearance engine (see looks.ts), offered
 * as optional starting points. None is required, none is tied to an industry, and every value in
 * them is editable through the same controls an owner uses to build their own.
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  style: StyleSpec;
}

export const THEMES: ThemeDefinition[] = LOOKS.map((l) => ({
  id: l.id,
  name: l.name,
  description: l.blurb,
  // Parsed once: a look that is missing a value fails loudly in tests, never on a visitor's page.
  style: styleSpecSchema.parse(l.overrides),
}));

export const DEFAULT_THEME_ID = "clean";
const byId = new Map(THEMES.map((t) => [t.id, t]));

/** Earlier looks, mapped to the nearest current one so saved pages keep resolving. Owner changes on top are never touched. */
const ALIASES: Record<string, string> = {
  studio: "clean", paper: "clean", editorial: "clean", garden: "clean",
  midnight: "night", noir: "night",
  candy: "colour", pop: "colour", classroom: "colour",
  workshop: "showroom", ocean: "showroom",
};
/** The current id for a stored one (identity for current ids, the alias target for retired ones, undefined if unknown). */
export const canonicalThemeId = (id: string): string | undefined => (byId.has(id) ? id : ALIASES[id]);
export const getTheme = (id: string): ThemeDefinition | undefined => byId.get(canonicalThemeId(id) ?? "");
