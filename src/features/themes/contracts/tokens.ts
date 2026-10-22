import { z } from "zod";

/** Approved font set. Anything else falls back to the preset default. */
export const FONT_KEYS = [
  "inter",
  "barlowCondensed",
  "fraunces",
  "sourceSerif",
  "manrope",
  "lexend",
] as const;
export type FontKey = (typeof FONT_KEYS)[number];

export const CONTENT_WIDTHS = ["narrow", "regular", "wide"] as const;
export const SECTION_SPACINGS = ["compact", "regular", "airy"] as const;
export const RADII = ["none", "sm", "md", "lg", "pill"] as const;
export const SHADOWS = ["none", "soft", "crisp"] as const;
export const MOTIONS = ["none", "subtle"] as const;

const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex colour like #1a2b3c");

export const tokenSetSchema = z.object({
  background: hex,
  foreground: hex,
  surface: hex,
  mutedForeground: hex,
  accent: hex,
  accentForeground: hex,
  border: hex,
  headingFont: z.enum(FONT_KEYS),
  bodyFont: z.enum(FONT_KEYS),
  contentWidth: z.enum(CONTENT_WIDTHS),
  sectionSpacing: z.enum(SECTION_SPACINGS),
  radius: z.enum(RADII),
  shadow: z.enum(SHADOWS),
  motion: z.enum(MOTIONS),
});
export type TokenSet = z.infer<typeof tokenSetSchema>;

export interface TokenPreset {
  id: string;
  label: string;
  tokens: TokenSet;
}

/**
 * Owner-adjustable subset. Colours are validated for contrast before they
 * are accepted (see tokens/resolve.ts); fonts come from FONT_KEYS only.
 */
export const tokenOverridesSchema = z
  .object({
    accent: hex,
    accentForeground: hex,
    background: hex,
    foreground: hex,
    headingFont: z.enum(FONT_KEYS),
    bodyFont: z.enum(FONT_KEYS),
    radius: z.enum(RADII),
  })
  .partial()
  .strict();
export type TokenOverrides = z.infer<typeof tokenOverridesSchema>;
