import type { BusinessContentInput, ServiceContent } from "@/features/businesses/content";
import { normalizeSlug, validateSlug, type SlugProblem } from "@/features/businesses/slug";
import { getFixture } from "@/features/themes/fixtures";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { resolveLayout } from "@/features/themes/presets/layouts";
import { initialState, parseContent, type DemoState } from "./store";

export function applyIndustry(s: DemoState, industryKey: string, label?: string): DemoState {
  const preset = getIndustryPreset(industryKey);
  const layout = resolveLayout(preset.defaultLayoutId).layout;
  return {
    ...s,
    content: {
      ...s.content,
      identity: { ...s.content.identity, industryKey: preset.id, industryLabel: label ?? preset.label },
      booking: { ...s.content.booking, mode: preset.suggestedBookingMode },
    },
    // Industry sets defaults only; it never locks a colour or workflow.
    config: { layoutId: layout.id, layoutVersion: layout.version, tokenPresetId: layout.tokenPresetId, overrides: {} },
  };
}

export function setName(s: DemoState, name: string): DemoState {
  const slug = s.slugEdited ? s.content.identity.slug : normalizeSlug(name);
  return { ...s, content: { ...s.content, identity: { ...s.content.identity, name, slug } } };
}

export function setSlug(s: DemoState, raw: string): DemoState {
  return { ...s, slugEdited: true, content: { ...s.content, identity: { ...s.content.identity, slug: normalizeSlug(raw) } } };
}

export function slugProblems(slug: string): SlugProblem[] {
  return slug ? validateSlug(slug) : ["too_short"];
}

export function setLayout(s: DemoState, layoutId: string): DemoState {
  const { layout } = resolveLayout(layoutId);
  return { ...s, config: { layoutId: layout.id, layoutVersion: layout.version, tokenPresetId: layout.tokenPresetId, overrides: {} } };
}

export function hasContactChannel(c: BusinessContentInput): boolean {
  const k = c.contacts;
  return Boolean(k.phone || k.whatsapp || k.email);
}

export interface Check {
  id: string;
  label: string;
  done: boolean;
  required: boolean;
  href: string;
}

/** The "required to publish" list is deliberately short; everything else can come later. */
export function readiness(s: DemoState): Check[] {
  const c = s.content;
  const activeServices = (c.services ?? []).filter((x) => !x.archived);
  return [
    { id: "industry", label: "Choose your type of business", done: s.onboarded || Boolean(c.identity.industryLabel), required: true, href: "/onboarding" },
    { id: "name", label: "Name and web address", done: Boolean(c.identity.name) && slugProblems(c.identity.slug).length === 0, required: true, href: "/dashboard/profile" },
    { id: "contact", label: "At least one way to contact you", done: hasContactChannel(c), required: true, href: "/dashboard/profile" },
    { id: "service", label: "Your first service", done: activeServices.length > 0, required: true, href: "/dashboard/services" },
    { id: "about", label: "Write a short About", done: Boolean(c.about), required: false, href: "/dashboard/profile" },
    { id: "faq", label: "Add a question or two", done: (c.faqs ?? []).length > 0, required: false, href: "/dashboard/profile" },
    { id: "review", label: "Add a review link or testimonial", done: (c.reviewLinks ?? []).length + (c.testimonials ?? []).length > 0, required: false, href: "/dashboard/reviews" },
    { id: "published", label: "Publish", done: Boolean(s.published), required: false, href: "/dashboard" },
  ];
}

export function canPublish(s: DemoState): boolean {
  return readiness(s).filter((c) => c.required).every((c) => c.done) && parseContent(s.content).success;
}

export function publish(s: DemoState): DemoState {
  if (!canPublish(s)) return s;
  // A frozen copy: later draft edits don't change the published page until republished.
  return {
    ...s,
    published: {
      at: new Date().toISOString(),
      version: (s.published?.version ?? 0) + 1,
      content: structuredClone(s.content),
      config: structuredClone(s.config),
      plan: s.plan,
    },
  };
}

export function unpublish(s: DemoState): DemoState {
  return { ...s, published: null };
}

/** Load a synthetic fixture as the draft so every feature has content to show. */
export function loadSample(s: DemoState, key: string): DemoState {
  const f = getFixture(key);
  if (!f) return s;
  const base = initialState();
  const content = structuredClone(f.content) as BusinessContentInput;
  // Online booking is not built yet; never advertise a /book flow that does not exist.
  content.booking = { ...content.booking, onlineBookingReady: false };
  const withIndustry = applyIndustry({ ...base, content }, content.identity.industryKey, content.identity.industryLabel);
  return { ...withIndustry, step: "review", onboarded: true, slugEdited: true, plan: s.plan };
}

type ServiceInput = NonNullable<BusinessContentInput["services"]>[number];

/** Draft content holds schema *input* types; forms edit the normalised shape. */
export function normService(x: ServiceInput): ServiceContent {
  return { ...x, currency: x.currency ?? "GBP", delivery: x.delivery ?? [], bookingMode: x.bookingMode ?? "contact", sortOrder: x.sortOrder ?? 0, archived: x.archived ?? false };
}

export function newServiceId(): string {
  return `svc-${Math.random().toString(36).slice(2, 9)}`;
}

export function blankService(sortOrder: number): ServiceContent {
  return {
    id: newServiceId(),
    name: "",
    priceMode: "quote",
    currency: "GBP",
    delivery: [],
    bookingMode: "contact",
    sortOrder,
    archived: false,
  };
}
