/** Approved font set. Anything else is rejected by validation. */
export const FONT_KEYS = ["inter", "barlowCondensed", "fraunces", "sourceSerif", "manrope", "lexend", "instrumentSerif", "bricolage", "geist", "spaceGrotesk", "syne", "unbounded", "dmSerif", "newsreader", "outfit", "instrumentSans", "youngSerif", "bodoni"] as const;
export type FontKey = (typeof FONT_KEYS)[number];
