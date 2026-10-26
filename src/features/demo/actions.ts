import type { BusinessContentInput, ProductContent, ServiceContent } from "@/features/businesses/content";
import { normalizeSlug, validateSlug, type SlugProblem } from "@/features/businesses/slug";
import { newPage, starterWidgets } from "@/features/page/starter";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { getFixture } from "@/features/themes/fixtures";
import { DEFAULT_THEME_ID, getTheme } from "@/features/page/themes/catalogue";
import { suggestedLookIds } from "@/features/themes/presets/look-suggestions";
import { initialState, parseContent, type DemoState } from "./store";

/**
 * Choosing an industry sets *defaults*. If the owner has already shaped the page (different
 * widgets or a different theme than the previous industry suggested) those choices are kept.
 */
export function applyIndustry(s: DemoState, industryKey: string, label?: string): DemoState {
  const prev = getIndustryPreset(s.content.identity.industryKey);
  const next = getIndustryPreset(industryKey);
  const untouchedWidgets = JSON.stringify(s.page.widgets.map((w) => [w.type, w.hidden, w.appearance, w.settings])) === JSON.stringify(starterWidgets(prev.id).map((w) => [w.type, w.hidden, w.appearance, w.settings]));
  const previousDefaultLook = getTheme(suggestedLookIds(prev.id)[0]!)?.id ?? DEFAULT_THEME_ID;
  const untouchedTheme = s.page.themeId === previousDefaultLook && Object.keys(s.page.appearance).length === 0;
  const fresh = newPage(next.id);
  return {
    ...s,
    content: {
      ...s.content,
      identity: { ...s.content.identity, industryKey: next.id, industryLabel: label ?? next.label },
      booking: { ...s.content.booking, mode: next.suggestedBookingMode },
    },
    page: {
      ...s.page,
      themeId: untouchedTheme ? fresh.themeId : s.page.themeId,
      widgets: untouchedWidgets ? fresh.widgets : s.page.widgets,
    },
  };
}

export function setName(s: DemoState, name: string): DemoState {
  const slug = s.slugEdited ? s.content.identity.slug : normalizeSlug(name);
  return { ...s, content: { ...s.content, identity: { ...s.content.identity, name, slug } } };
}

export function setSlug(s: DemoState, raw: string): DemoState {
  // Clearing the address hands it back to the business name.
  if (!normalizeSlug(raw)) return setName({ ...s, slugEdited: false }, s.content.identity.name);
  return { ...s, slugEdited: true, content: { ...s.content, identity: { ...s.content.identity, slug: normalizeSlug(raw) } } };
}

export function slugProblems(slug: string): SlugProblem[] {
  return slug ? validateSlug(slug) : ["too_short"];
}

export function hasContactChannel(c: BusinessContentInput): boolean {
  const k = c.contacts;
  return Boolean(k.phone || k.whatsapp || k.email || k.website || k.social?.length);
}

export interface Check {
  id: string;
  label: string;
  done: boolean;
  required: boolean;
  href: string;
}

/** What is required to publish is deliberately short; everything else can come later. */
export function readiness(s: DemoState): Check[] {
  const c = s.content;
  const activeServices = (c.services ?? []).filter((x) => !x.archived);
  return [
    { id: "industry", label: "Say what kind of business it is", done: s.onboarded || Boolean(c.identity.industryLabel), required: true, href: "/dashboard/page" },
    { id: "name", label: "Name and web address", done: Boolean(c.identity.name) && slugProblems(c.identity.slug).length === 0, required: true, href: "/dashboard/page" },
    { id: "contact", label: "At least one way to contact you", done: hasContactChannel(c), required: true, href: "/dashboard/page" },
    { id: "service", label: "Add your first service", done: activeServices.length > 0, required: false, href: "/dashboard/services" },
    { id: "logo", label: "Add a logo or profile picture", done: Boolean(c.identity.logo), required: false, href: "/dashboard/page" },
    { id: "bio", label: "Write a short description", done: Boolean(c.identity.tagline), required: false, href: "/dashboard/page" },
    { id: "review", label: "Add a review link or testimonial", done: (c.reviewLinks ?? []).length + (c.testimonials ?? []).length > 0, required: false, href: "/dashboard/reviews" },
    { id: "published", label: "Publish your page", done: Boolean(s.published), required: false, href: "/dashboard/page" },
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
      page: structuredClone(s.page),
      plan: s.plan,
    },
  };
}

export function unpublish(s: DemoState): DemoState {
  return { ...s, published: null };
}

export function hasUnpublishedChanges(s: DemoState): boolean {
  return Boolean(s.published) && JSON.stringify([s.published!.content, s.published!.page]) !== JSON.stringify([s.content, s.page]);
}

/** Load a synthetic fixture (records + arrangement + theme) as the draft. */
export function loadSample(s: DemoState, key: string): DemoState {
  const f = getFixture(key);
  if (!f) return s;
  return {
    ...initialState(),
    plan: s.plan,
    step: "publish",
    onboarded: true,
    slugEdited: true,
    content: structuredClone(f.content) as BusinessContentInput,
    page: structuredClone(f.page),
  };
}

type ServiceInput = NonNullable<BusinessContentInput["services"]>[number];

/** Draft content holds schema *input* types; forms edit the normalised shape. */
export function normService(x: ServiceInput): ServiceContent {
  return { ...x, currency: x.currency ?? "GBP", delivery: x.delivery ?? [], bookingMode: x.bookingMode ?? "contact", sortOrder: x.sortOrder ?? 0, archived: x.archived ?? false };
}

export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
export const newServiceId = () => newId("svc");

export function blankService(sortOrder: number): ServiceContent {
  return { id: newServiceId(), name: "", priceMode: "quote", currency: "GBP", delivery: [], bookingMode: "contact", sortOrder, archived: false };
}

export function normProduct(x: NonNullable<BusinessContentInput["products"]>[number]): ProductContent {
  return { ...x, currency: x.currency ?? "GBP", mode: x.mode ?? "enquire", archived: x.archived ?? false, facts: x.facts ?? [], kind: x.kind ?? "product", availability: x.availability ?? "available", images: x.images ?? [], affiliate: x.affiliate ?? false };
}
