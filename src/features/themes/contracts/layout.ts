import { z } from "zod";
import { blockConfigSchema } from "./blocks";

export const LAYOUT_FAMILIES = [
  "trades",
  "beauty",
  "education",
  "professional",
  "general",
] as const;
export type LayoutFamily = (typeof LAYOUT_FAMILIES)[number];

export const MOBILE_ACTIONS = ["contact", "booking", "contextual"] as const;

export const layoutPresetSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  family: z.enum(LAYOUT_FAMILIES),
  label: z.string(),
  blocks: z.array(blockConfigSchema).min(1),
  tokenPresetId: z.string().min(1),
  mobileAction: z.enum(MOBILE_ACTIONS),
});
export type LayoutPreset = z.infer<typeof layoutPresetSchema>;

/**
 * What the owner may persist about presentation. This is the only
 * theme-related structure stored per profile; it holds references,
 * never code. `sections` lets a future editor reorder/hide blocks.
 */
export const profileConfigSchema = z.object({
  schemaVersion: z.literal(1),
  industryKey: z.string().min(1).max(64),
  layoutId: z.string().min(1).max(64),
  layoutVersion: z.number().int().positive(),
  tokenPresetId: z.string().min(1).max(64),
  overrides: z
    .object({
      accent: z.string().optional(),
      accentForeground: z.string().optional(),
      background: z.string().optional(),
      foreground: z.string().optional(),
      headingFont: z.string().optional(),
      bodyFont: z.string().optional(),
      radius: z.string().optional(),
    })
    .default({}),
  sections: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        hidden: z.boolean().default(false),
      }),
    )
    .optional(),
});
export type ProfileConfig = z.infer<typeof profileConfigSchema>;
