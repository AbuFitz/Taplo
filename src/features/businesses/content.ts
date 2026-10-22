import { z } from "zod";
import { phoneSchema, safeUrl } from "@/lib/validation";

/**
 * The single business data model every layout renders. Nothing here is
 * industry-specific; industries differ only through presets.
 * Money is integer minor units; durations are minutes.
 */

const text = (max: number) => z.string().trim().min(1).max(max);
const optText = (max: number) => z.string().trim().max(max).optional();

/**
 * An image is a stored asset reference. `src` is a relative path or http(s) URL
 * (published storage URL on a connected environment) OR, in demo mode only, a small
 * downscaled data: image (jpeg/png/webp, never svg) produced by the in-browser uploader.
 */
const DATA_IMAGE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
export const imageSrcSchema = z
  .string()
  .min(1)
  .max(700_000)
  .refine((v) => (v.startsWith("data:") ? DATA_IMAGE.test(v) : v.length <= 2048 && (v.startsWith("/") || /^https?:\/\//.test(v))), "Use an uploaded image or a web address starting with https://");

/** Focal point as percentages of the image; drives object-position so crops keep the subject. */
export const focalSchema = z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) });

export const imageSchema = z.object({
  src: imageSrcSchema,
  alt: text(240),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  focal: focalSchema.optional(),
});
export type ImageRef = z.infer<typeof imageSchema>;

export const PRICE_MODES = ["fixed", "from", "quote", "free"] as const;
export const SERVICE_BOOKING_MODES = ["contact", "request", "instant"] as const;
export const DELIVERY_MODES = ["premises", "mobile", "online"] as const;

export const serviceSchema = z.object({
  id: text(64),
  name: text(120),
  description: optText(1200),
  group: optText(80),
  priceMode: z.enum(PRICE_MODES),
  /** Integer minor units (pence). Required for fixed/from. */
  priceMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("GBP"),
  durationMinutes: z.number().int().positive().max(24 * 60).optional(),
  delivery: z.array(z.enum(DELIVERY_MODES)).default([]),
  bookingMode: z.enum(SERVICE_BOOKING_MODES).default("contact"),
  image: imageSchema.optional(),
  sortOrder: z.number().int().default(0),
  /** Archived services are hidden publicly but kept for historical bookings. */
  archived: z.boolean().default(false),
});
export type ServiceContent = z.infer<typeof serviceSchema>;

export const staffSchema = z.object({
  id: text(64),
  slug: text(64),
  name: text(120),
  role: optText(120),
  bio: optText(1200),
  photo: imageSchema.optional(),
  subjects: z.array(text(80)).max(12).default([]),
});
export type StaffContent = z.infer<typeof staffSchema>;

export const testimonialSchema = z.object({
  id: text(64),
  quote: text(800),
  author: text(120),
  /** Where the words came from; always shown to visitors. */
  source: z.enum(["owner_supplied", "google", "facebook", "trustpilot", "taplo"]),
  sourceUrl: safeUrl.optional(),
  /** Owner confirms they have permission to publish it. */
  permissionConfirmed: z.boolean(),
});
export type TestimonialContent = z.infer<typeof testimonialSchema>;

export const reviewLinkSchema = z.object({
  platform: z.enum(["google", "facebook", "trustpilot"]),
  url: safeUrl,
});
export type ReviewLink = z.infer<typeof reviewLinkSchema>;

/** A rating is only ever shown with its provenance. Never derived. */
export const ratingSchema = z.object({
  value: z.number().min(1).max(5),
  count: z.number().int().positive(),
  source: z.enum(["google", "facebook", "trustpilot"]),
  url: safeUrl.optional(),
});

export const galleryItemSchema = z.object({
  id: text(64),
  image: imageSchema,
  caption: optText(240),
  /** When set, this item is the "after" of a before/after pair. */
  beforeImage: imageSchema.optional(),
});

export const faqSchema = z.object({ id: text(64), question: text(240), answer: text(2000) });
export const caseStudySchema = z.object({
  id: text(64),
  title: text(160),
  summary: text(1600),
  outcome: optText(400),
  image: imageSchema.optional(),
});

export const hoursSchema = z.object({
  day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
  /** "09:00" local wall-clock; omit both for closed. */
  opens: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closes: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

export const productSchema = z.object({
  id: text(64),
  name: text(120),
  description: optText(800),
  priceMinor: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("GBP"),
  image: imageSchema.optional(),
  /** "enquire": customer contacts the business. "link": opens the owner's own shop/payment link. No checkout is built. */
  mode: z.enum(["enquire", "link"]).default("enquire"),
  linkUrl: safeUrl.optional(),
  archived: z.boolean().default(false),
});
export type ProductContent = z.infer<typeof productSchema>;

export const offerSchema = z.object({
  id: text(64),
  title: text(120),
  description: optText(600),
  /** Shown as text only; Taplo does not validate or redeem codes. */
  code: optText(40),
  endsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  archived: z.boolean().default(false),
});
export type OfferContent = z.infer<typeof offerSchema>;

export const LOCATION_MODES = ["premises", "service_area", "online"] as const;

export const businessContentSchema = z.object({
  identity: z.object({
    name: text(100),
    slug: z.string().min(3).max(40),
    tagline: optText(160),
    logo: imageSchema.optional(),
    heroImage: imageSchema.optional(),
    industryKey: text(64),
    industryLabel: text(80),
  }),
  location: z.object({
    mode: z.enum(LOCATION_MODES),
    /** e.g. "Watford" or "Hertfordshire & North London". Public. */
    locality: optText(120),
    /** Only rendered when mode is "premises". */
    addressLine: optText(240),
    directionsUrl: safeUrl.optional(),
    timezone: z.string().min(1).default("Europe/London"),
  }),
  contacts: z.object({
    phone: phoneSchema.optional(),
    whatsapp: phoneSchema.optional(),
    email: z.string().trim().email().max(254).optional(),
    website: safeUrl.optional(),
    social: z
      .array(z.object({ platform: z.enum(["instagram", "facebook", "tiktok", "linkedin", "youtube", "x"]), url: safeUrl }))
      .max(8)
      .default([]),
  }),
  about: optText(4000),
  credentials: z.array(text(160)).max(12).default([]),
  hours: z.array(hoursSchema).default([]),
  services: z.array(serviceSchema).default([]),
  staff: z.array(staffSchema).default([]),
  gallery: z.array(galleryItemSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
  reviewLinks: z.array(reviewLinkSchema).default([]),
  rating: ratingSchema.optional(),
  faqs: z.array(faqSchema).default([]),
  caseStudies: z.array(caseStudySchema).default([]),
  products: z.array(productSchema).default([]),
  offers: z.array(offerSchema).default([]),
  booking: z.object({
    mode: z.enum(["contact", "request", "instant"]),
    /** Set only once an operator has real availability configured. */
    onlineBookingReady: z.boolean().default(false),
  }),
});
export type BusinessContent = z.infer<typeof businessContentSchema>;
export type BusinessContentInput = z.input<typeof businessContentSchema>;
