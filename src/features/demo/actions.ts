import type { BusinessContentInput, ProductContent, ServiceContent } from "@/features/businesses/content";
import { normalizeSlug, validateSlug, type SlugProblem } from "@/features/businesses/slug";
import { newPage, starterWidgets } from "@/features/page/starter";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { getFixture } from "@/features/themes/fixtures";
import { DEFAULT_THEME_ID, getTheme } from "@/features/page/themes/catalogue";
import { applyRecipe, getDesign } from "@/features/page/themes/designs";
import { suggestedLookIds } from "@/features/themes/presets/look-suggestions";
import { initialState, parseContent, type DemoState } from "./store";

/**
 * Choosing an industry sets *defaults*. If the owner has already shaped the page (different
 * widgets or a different theme than the previous industry suggested) those choices are kept.
 */
export function applyIndustry(s: DemoState, industryKey: string, label?: string): DemoState {
  const prev = getIndustryPreset(s.content.identity.industryKey);
  const next = getIndustryPreset(industryKey);
  // A chosen design presents the starting sections its own way; "untouched" is judged with that presentation applied.
  const design = getDesign(s.page.themeId);
  const starters = (id: string) => (design ? applyRecipe(starterWidgets(id), design.recipe) : starterWidgets(id));
  const untouchedWidgets = JSON.stringify(s.page.widgets.map((w) => [w.type, w.hidden, w.appearance, w.settings])) === JSON.stringify(starters(prev.id).map((w) => [w.type, w.hidden, w.appearance, w.settings]));
  const previousDefaultLook = getTheme(suggestedLookIds(prev.id)[0]!)?.id ?? DEFAULT_THEME_ID;
  // The blank start page carries only the type-led header, which is not an owner choice.
  const onlyStartHeader = s.page.themeId === "paper" && !s.setupDrafts?.backgroundEdited && s.page.appearance.header?.layout === "masthead";
  const untouchedTheme = s.page.themeId === previousDefaultLook && (Object.keys(s.page.appearance).length === 0 || onlyStartHeader);
  const fresh = newPage(next.id);
  return {
    ...s,
    content: {
      ...s.content,
      identity: { ...s.content.identity, industryKey: next.id, industryLabel: label ?? next.label, ...(s.content.identity.alsoKeys ? { alsoKeys: s.content.identity.alsoKeys.filter((k) => k !== next.id) } : {}) },
      booking: { ...s.content.booking, mode: next.suggestedBookingMode },
    },
    page: {
      ...s.page,
      themeId: s.page.themeId, // the look is the owner's; a category suggests content, never taste
      widgets: untouchedWidgets ? (design ? applyRecipe(fresh.widgets, design.recipe) : fresh.widgets) : s.page.widgets,
      meta: { ...s.page.meta, primaryAction: next.suggestedBookingMode === "contact" ? "auto" : "book" },
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
  const goals = s.setupDrafts?.goals ?? [];
  const has = (...ids: string[]) => ids.some((g) => (goals as string[]).includes(g));
  const goalChecks: Check[] = [
    has("book") ? { id: "goal-book", label: "You want bookings: add a service with a duration", done: activeServices.some((x) => Boolean(x.durationMinutes)), required: false, href: "/dashboard/services" } : null,
    has("contact", "call") ? { id: "goal-call", label: "You want to be contacted: add a phone number or email", done: Boolean(c.contacts.phone || c.contacts.email), required: false, href: "/dashboard/page" } : null,
    has("message") ? { id: "goal-message", label: "You want messages: add WhatsApp or email", done: Boolean(c.contacts.whatsapp || c.contacts.email), required: false, href: "/dashboard/page" } : null,
    has("services", "browse") ? { id: "goal-services", label: "You want people to explore your services: add your first service", done: activeServices.length > 0, required: false, href: "/dashboard/services" } : null,
    has("products", "buy") ? { id: "goal-buy", label: "You want people to browse products: add your first product", done: (c.products ?? []).some((x) => !x.archived), required: false, href: "/dashboard/services" } : null,
    has("work") ? { id: "goal-work", label: "You want to show your work: add photos", done: (c.gallery ?? []).length > 0, required: false, href: "/dashboard/page" } : null,
  ].filter((x): x is Check => x !== null);
  const exampleLeft = [...(c.services ?? []), ...(c.products ?? [])].some((x) => (x as { example?: boolean }).example && !x.archived);
  return [
    ...goalChecks,
    ...(exampleLeft ? [{ id: "example", label: "Replace or remove the example items before publishing", done: false, required: true, href: "/dashboard/services" } as Check] : []),
    { id: "industry", label: "Say what kind of business it is", done: s.onboarded || Boolean(c.identity.industryLabel), required: true, href: "/dashboard/page" },
    { id: "name", label: "Name and web address", done: Boolean(c.identity.name) && slugProblems(c.identity.slug).length === 0, required: true, href: "/dashboard/page" },
    { id: "contact", label: "At least one way to contact you", done: hasContactChannel(c), required: true, href: "/dashboard/page?open=details" },
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
    step: "finish",
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
