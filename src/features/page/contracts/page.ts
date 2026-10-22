import { z } from "zod";
import { styleOverridesSchema } from "./style";
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
      shareTitle: z.string().trim().max(80).optional(),
      shareDescription: z.string().trim().max(200).optional(),
    })
    .default({ searchVisible: true }),
  widgets: z.array(widgetEnvelopeSchema).max(60),
});
export type PageDoc = z.infer<typeof pageDocSchema>;
