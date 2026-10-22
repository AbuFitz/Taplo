import { z } from "zod";

export const BOOKING_MODES = ["contact", "request", "instant"] as const;
export type BookingMode = (typeof BOOKING_MODES)[number];

export const industryPresetSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  defaultLayoutId: z.string().min(1),
  terminology: z.object({
    services: z.string(),
    team: z.string(),
    booking: z.string(),
    reviews: z.string(),
  }),
  suggestedServices: z
    .array(z.object({ name: z.string(), description: z.string().optional() }))
    .max(12),
  suggestedBookingMode: z.enum(BOOKING_MODES),
  /** Keys of extra onboarding questions; resolved from a shared question bank. */
  onboardingFieldKeys: z.array(z.string()).default([]),
});
export type IndustryPreset = z.infer<typeof industryPresetSchema>;
