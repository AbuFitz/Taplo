import { z } from "zod";

/**
 * Block contracts. Every block instance is a serializable reference
 * (type + variant) resolved to a trusted React component at render time.
 * No executable code, HTML or CSS is ever stored.
 */

export const BLOCK_TYPES = [
  "hero",
  "services",
  "reviews",
  "gallery",
  "team",
  "booking",
  "contact",
  "about",
  "faq",
  "caseStudies",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

const id = z.string().min(1).max(64);

export const blockConfigSchema = z.discriminatedUnion("type", [
  z.object({
    id,
    type: z.literal("hero"),
    variant: z.enum(["bold", "editorial", "trust", "refined", "simple"]),
  }),
  z.object({
    id,
    type: z.literal("services"),
    variant: z.enum(["list", "cards", "imageCards", "subjects", "consulting"]),
  }),
  z.object({
    id,
    type: z.literal("reviews"),
    variant: z.enum(["cards", "strip", "quote", "testimonials"]),
  }),
  z.object({
    id,
    type: z.literal("gallery"),
    variant: z.enum(["grid", "editorial", "beforeAfter"]),
  }),
  z.object({
    id,
    type: z.literal("team"),
    variant: z.enum(["cards", "portraits", "tutors"]),
  }),
  z.object({
    id,
    type: z.literal("booking"),
    variant: z.enum(["band", "card"]),
  }),
  z.object({
    id,
    type: z.literal("contact"),
    variant: z.enum(["actions", "details"]),
  }),
  z.object({
    id,
    type: z.literal("about"),
    variant: z.enum(["text", "split", "credentials"]),
  }),
  z.object({
    id,
    type: z.literal("faq"),
    variant: z.enum(["accordion", "columns"]),
  }),
  z.object({
    id,
    type: z.literal("caseStudies"),
    variant: z.enum(["list", "feature"]),
  }),
]);

export type BlockConfig = z.infer<typeof blockConfigSchema>;
export type BlockOf<T extends BlockType> = Extract<BlockConfig, { type: T }>;
