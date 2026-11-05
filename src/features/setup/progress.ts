import { z } from "zod";
import { PLAN_IDS } from "@/features/subscriptions/plans";

export const ONBOARDING_STEPS = [
  "type",
  "name",
  "look",
  "action",
  "services",
  "plan",
  "finish",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** Shared validation for in-progress form text; never a source of subscription rights. */
export const setupDraftsSchema = z
  .object({
    reviewEdit: z.boolean().optional(),
    goals: z
      .array(
        z.enum([
          "book",
          "contact",
          "services",
          "products",
          "work",
          "call",
          "message",
          "browse",
          "buy",
        ]),
      )
      .optional(),
    connections: z
      .object({
        email: z.string(),
        phone: z.string(),
        whatsapp: z.string(),
        website: z.string(),
        instagram: z.string(),
        socials: z.record(z.string(), z.string()).optional(),
      })
      .optional(),
    planIntent: z.enum(PLAN_IDS).optional(),
    backgroundEdited: z.boolean().optional(),
    colourway: z.string().optional(),
    colourMotion: z.boolean().optional(),
    keptColours: z.record(z.string(), z.string()).optional(),
    palette: z.string().optional(),
    colourUndo: z
      .object({
        page: z.unknown().optional(),
        appearance: z.unknown(),
        colourway: z.string().optional(),
        colourMotion: z.boolean().optional(),
        keptColours: z.record(z.string(), z.string()).optional(),
        palette: z.string().optional(),
      })
      .optional(),
    services: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.string(),
          minutes: z.string(),
          priceMode: z.enum(["fixed", "from", "quote", "free"]).optional(),
        }),
      )
      .optional(),
    record: z
      .object({
        kind: z.enum(["vehicle", "photo", "product"]),
        value: z.unknown(),
      })
      .optional(),
  })
  .optional();
