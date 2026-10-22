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

export const DEFAULT_THEME_ID = "paper";
const byId = new Map(THEMES.map((t) => [t.id, t]));
export const getTheme = (id: string): ThemeDefinition | undefined => byId.get(id);
