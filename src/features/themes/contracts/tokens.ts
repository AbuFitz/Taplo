/** Approved font set. Anything else is rejected by validation. */
export const FONT_KEYS = ["inter", "barlowCondensed", "fraunces", "sourceSerif", "manrope", "lexend"] as const;
export type FontKey = (typeof FONT_KEYS)[number];
