import { z } from "zod";
import { styleOverridesSchema, widgetAppearanceSchema } from "./style";
import { widgetEnvelopeSchema } from "./widgets";

export const PAGE_SCHEMA_VERSION = 2;

/**
 * Everything about how a business page is presented. Business records live
 * elsewhere (BusinessContent); widgets reference them by id.
 * No industry appears here: industry only supplies *starting suggestions*.
 */
export const pageDocSchema = z.object({
  schemaVersion: z.literal(PAGE_SCHEMA_VERSION),
  themeId: z.string().min(1).max(64),
  appearance: styleOverridesSchema.default({}),
  /** Page-level settings that are not appearance: search visibility and share text. */
  meta: z
    .object({
      searchVisible: z.boolean().default(true),
      /** The one dominant action at the top of the page. "auto" picks the best available (booking, call, WhatsApp, email). Independent of widget order. */
      primaryAction: z.enum(["auto", "book", "call", "whatsapp", "email", "none"]).default("auto"),
      /** Where the current look came from, so a change can be explained and traced. Absent on pages that were never given a gallery design. */
      appliedFrom: z.object({ designId: z.string().max(64), arrangement: z.string().max(32).optional(), at: z.string().max(40) }).optional(),
      shareTitle: z.string().trim().max(80).optional(),
      shareDescription: z.string().trim().max(200).optional(),
    })
    .default({ searchVisible: true, primaryAction: "auto" }),
  widgets: z.array(widgetEnvelopeSchema).max(60),
  /** Owner-created, reusable page styles ("My looks"): a starting look plus the owner's changes. */
  savedLooks: z.array(z.object({ id: z.string().min(1).max(64), name: z.string().trim().min(1).max(40), themeId: z.string().min(1).max(64), overrides: styleOverridesSchema })).max(12).default([]),
  /** Owner-created, reusable widget styles. Applying one copies it onto a widget; widgets stay individually editable. */
  savedStyles: z.array(z.object({ id: z.string().min(1).max(64), name: z.string().trim().min(1).max(40), appearance: widgetAppearanceSchema })).max(20).default([]),
});
export type PageDoc = z.infer<typeof pageDocSchema>;
