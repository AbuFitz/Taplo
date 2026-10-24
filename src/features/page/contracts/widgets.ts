import { z } from "zod";
import { imageSchema } from "@/features/businesses/content";
import { widgetAppearanceSchema } from "./style";

/**
 * Widget instances. `settings` hold only page-level choices (labels, variants, which
 * records to show). Business records (services, staff, products, reviews...) are
 * referenced by id and never copied. `null` id lists mean "all".
 */

const title = z.string().trim().max(80).optional();
const label = z.string().trim().max(60).optional();
const ids = z.array(z.string().max(64)).nullable().default(null);
const linkVariant = z.enum(["button", "card", "compact"]).default("button");

export const WIDGET_TYPES = [
  "call", "sms", "whatsapp", "email", "social", "link", "directions",
  "serviceList", "featuredService", "priceMenu", "booking", "products", "offers", "payment",
  "reviews", "leaveReview", "team", "credentials",
  "text", "image", "gallery", "video", "faq", "document",
  "hours", "location", "serviceArea", "announcement",
  "enquiry", "share",
] as const;
export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WIDGET_CATEGORIES = ["contact", "sales", "trust", "content", "info"] as const;
export type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];

/** One settings schema per type. Every field has a default so a stored widget can never be half-valid. */
export const settingsSchemas = {
  call: z.object({ label, subtitle: label, variant: linkVariant }),
  sms: z.object({ label, subtitle: label, variant: linkVariant }),
  whatsapp: z.object({ label, subtitle: label, variant: linkVariant }),
  email: z.object({ label, subtitle: label, variant: linkVariant }),
  directions: z.object({ label, subtitle: label, variant: linkVariant }),
  link: z.object({ label: z.string().trim().max(60).default(""), url: z.string().max(2048).default(""), subtitle: label, variant: linkVariant }),
  social: z.object({ variant: z.enum(["icons", "list"]).default("icons"), platforms: z.array(z.string()).nullable().default(null) }),
  serviceList: z.object({
    title, serviceIds: ids, group: z.string().max(80).optional(),
    variant: z.enum(["list", "cards", "compact", "spotlight"]).default("list"),
    showPrices: z.boolean().default(true), showDuration: z.boolean().default(true), showDescriptions: z.boolean().default(true),
    limit: z.number().int().min(1).max(50).optional(),
    excludeFeatured: z.boolean().default(false),
  }),
  featuredService: z.object({ serviceId: z.string().max(64).nullable().default(null), headline: label, ctaLabel: label }),
  priceMenu: z.object({ title, serviceIds: ids, showDescriptions: z.boolean().default(false), variant: z.enum(["menu", "panels", "compact"]).default("menu") }),
  booking: z.object({ label, serviceId: z.string().max(64).nullable().default(null), variant: z.enum(["button", "card"]).default("button") }),
  products: z.object({ title, productIds: ids, variant: z.enum(["grid", "list", "swipe", "catalogue"]).default("grid") }),
  offers: z.object({ title, offerIds: ids, variant: z.enum(["list", "cards"]).default("list") }),
  payment: z.object({ label: z.string().trim().max(60).default("Pay a deposit"), serviceId: z.string().max(64).nullable().default(null), kind: z.enum(["deposit", "full", "pay"]).default("deposit") }),
  reviews: z.object({ title, testimonialIds: ids, variant: z.enum(["cards", "quote", "compact", "swipe"]).default("cards"), showRating: z.boolean().default(true) }),
  leaveReview: z.object({ label, platforms: z.array(z.string()).nullable().default(null) }),
  team: z.object({ title, staffIds: ids, variant: z.enum(["list", "swipe", "grid", "avatars"]).default("list") }),
  credentials: z.object({ title, variant: z.enum(["chips", "list"]).default("chips") }),
  text: z.object({ title, body: z.string().max(4000).default(""), variant: z.enum(["body", "statement", "note"]).default("body"), collapsible: z.boolean().default(false), align: z.enum(["left", "center"]).optional() }),
  image: z.object({ image: imageSchema.nullable().default(null), caption: z.string().max(240).optional(), linkUrl: z.string().max(2048).optional(), shape: z.enum(["rounded", "square", "wide"]).default("rounded") }),
  gallery: z.object({ title, itemIds: ids, variant: z.enum(["grid", "carousel", "beforeAfter", "masonry"]).default("grid") }),
  video: z.object({ url: z.string().max(500).default(""), title: z.string().max(120).optional() }),
  faq: z.object({ title, faqIds: ids, variant: z.enum(["list", "cards"]).default("list") }),
  document: z.object({ title: z.string().trim().max(100).default(""), url: z.string().max(2048).default(""), description: z.string().max(240).optional() }),
  hours: z.object({ title, variant: z.enum(["list", "compact", "status"]).default("list") }),
  location: z.object({ title, variant: z.enum(["card", "compact", "visit"]).default("card"), showDirections: z.boolean().default(true) }),
  serviceArea: z.object({ title }),
  enquiry: z.object({ title, intro: z.string().trim().max(240).optional(), buttonLabel: label, variant: z.enum(["button", "inline", "card"]).default("button") }),
  share: z.object({ title, label, variant: z.enum(["button", "card"]).default("button") }),
  announcement: z.object({
    text: z.string().trim().max(240).default(""),
    tone: z.enum(["info", "promo", "warning"]).default("info"),
    linkLabel: label, linkUrl: z.string().max(2048).optional(),
    /** YYYY-MM-DD; the notice stops showing after this date. */
    endsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
} as const satisfies Record<WidgetType, z.ZodType>;

export type SettingsOf<T extends WidgetType> = z.infer<(typeof settingsSchemas)[T]>;

const base = {
  id: z.string().min(1).max(64),
  /** Per-type schema version; migrations run on load. */
  version: z.number().int().positive().default(1),
  hidden: z.boolean().default(false),
  appearance: widgetAppearanceSchema.default({}),
};

/** Envelope validated loosely (type + raw settings), then settings validated per type with defaults. */
export const widgetEnvelopeSchema = z.object({
  ...base,
  type: z.string().min(1).max(40),
  settings: z.record(z.string(), z.unknown()).default({}),
});

export type WidgetInstance<T extends WidgetType = WidgetType> = {
  id: string;
  type: T;
  version: number;
  hidden: boolean;
  appearance: z.infer<typeof widgetAppearanceSchema>;
  settings: SettingsOf<T>;
};
export type AnyWidget = { [T in WidgetType]: WidgetInstance<T> }[WidgetType];

export function parseSettings<T extends WidgetType>(type: T, raw: unknown): { settings: SettingsOf<T>; valid: boolean } {
  const parsed = settingsSchemas[type].safeParse(raw ?? {});
  if (parsed.success) return { settings: parsed.data as SettingsOf<T>, valid: true };
  // Fall back to defaults for the whole block: a corrupt stored value must not break a published page.
  const defaults = settingsSchemas[type].safeParse({});
  return { settings: (defaults.success ? defaults.data : {}) as SettingsOf<T>, valid: false };
}
