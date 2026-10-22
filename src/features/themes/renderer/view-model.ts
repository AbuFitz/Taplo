import { businessContentSchema, type BusinessContent, type BusinessContentInput } from "@/features/businesses/content";
import { resolveEntitlements, type Entitlements } from "@/features/subscriptions/entitlements";
import type { PlanId } from "@/features/subscriptions/plans";
import { telHref, whatsappHref } from "@/lib/validation";
import type { BlockConfig, BlockType } from "../contracts/blocks";
import type { LayoutFamily, LayoutPreset, ProfileConfig } from "../contracts/layout";
import type { IndustryPreset } from "../contracts/industry";
import { getIndustryPreset } from "../presets/industries";
import { resolveLayout } from "../presets/layouts";
import { resolveTokens, tokensToCssVars, type ThemeWarning } from "../tokens/resolve";
import type { TokenSet } from "../contracts/tokens";

export type ActionKind = "book" | "call" | "whatsapp" | "email" | "directions" | "website";
export interface ProfileAction {
  kind: ActionKind;
  label: string;
  href: string;
  /** Used by analytics later; clicks are events, not conversions. */
  event?: "call_click" | "whatsapp_click" | "booking_click";
}

export interface RenderedBlock {
  config: BlockConfig;
}

export interface PublicProfileViewModel {
  business: BusinessContent;
  industry: IndustryPreset;
  layout: LayoutPreset;
  family: LayoutFamily;
  tokens: TokenSet;
  cssVars: Record<string, string>;
  blocks: RenderedBlock[];
  /** Blocks that have content but are not part of the active layout (dashboard hint). */
  unplacedContent: BlockType[];
  primaryAction: ProfileAction | null;
  secondaryActions: ProfileAction[];
  mobileAction: ProfileAction | null;
  contactActions: ProfileAction[];
  showBranding: boolean;
  entitlements: Entitlements;
  warnings: ThemeWarning[];
  /** Only true when a plan + ready flag allow real online booking. */
  onlineBooking: boolean;
}

export interface BuildOptions {
  config: Pick<ProfileConfig, "layoutId" | "layoutVersion" | "tokenPresetId" | "overrides"> & {
    sections?: ProfileConfig["sections"];
  };
  plan: PlanId;
  subscriptionStatus?: Parameters<typeof resolveEntitlements>[1];
}

/** Apply plan limits to content. Content itself is never mutated or deleted. */
function applyEntitlements(content: BusinessContent, ent: Entitlements): BusinessContent {
  const services = content.services.filter((s) => !s.archived).sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    ...content,
    services: ent.maxServices === null ? services : services.slice(0, ent.maxServices),
    gallery: ent.gallery ? content.gallery : [],
    staff: ent.teamPages ? content.staff : [],
    testimonials: ent.testimonials ? content.testimonials.filter((t) => t.permissionConfirmed) : [],
    reviewLinks: ent.reviewLinks ? content.reviewLinks : [],
    rating: ent.reviewLinks ? content.rating : undefined,
    contacts: {
      ...content.contacts,
      social: ent.socialLinks ? content.contacts.social : [],
    },
  };
}

function hasContact(c: BusinessContent): boolean {
  const k = c.contacts;
  return Boolean(k.phone || k.whatsapp || k.email || k.website || k.social.length || c.location.directionsUrl);
}

/** "Meaningful content" gate: a block with nothing to say is dropped, leaving no gap. */
export function blockHasContent(type: BlockType, c: BusinessContent, onlineBooking: boolean): boolean {
  switch (type) {
    case "hero":
      return true;
    case "services":
      return c.services.length > 0;
    case "reviews":
      return c.testimonials.length > 0 || c.reviewLinks.length > 0 || Boolean(c.rating);
    case "gallery":
      return c.gallery.length > 0;
    case "team":
      return c.staff.length > 0;
    case "booking":
      // Online flow, or a configured contact alternative; hidden if neither exists.
      return onlineBooking || Boolean(c.contacts.phone || c.contacts.whatsapp || c.contacts.email);
    case "contact":
      return hasContact(c);
    case "about":
      return Boolean(c.about) || c.credentials.length > 0;
    case "faq":
      return c.faqs.length > 0;
    case "caseStudies":
      return c.caseStudies.length > 0;
  }
}

export function buildActions(c: BusinessContent, onlineBooking: boolean, bookingLabel: string) {
  const k = c.contacts;
  const actions: ProfileAction[] = [];
  if (onlineBooking) {
    actions.push({ kind: "book", label: bookingLabel, href: `/${c.identity.slug}/book`, event: "booking_click" });
  }
  if (k.phone) actions.push({ kind: "call", label: "Call", href: telHref(k.phone), event: "call_click" });
  if (k.whatsapp) {
    actions.push({
      kind: "whatsapp",
      label: "WhatsApp",
      href: whatsappHref(k.whatsapp, `Hi ${c.identity.name}, I found you on Taplo.`),
      event: "whatsapp_click",
    });
  }
  if (k.email) actions.push({ kind: "email", label: "Email", href: `mailto:${k.email}` });
  return actions;
}

export function buildPublicProfileViewModel(
  input: BusinessContentInput | BusinessContent,
  opts: BuildOptions,
): PublicProfileViewModel {
  const parsed = businessContentSchema.parse(input);
  const industry = getIndustryPreset(parsed.identity.industryKey);
  const entitlements = resolveEntitlements(opts.plan, opts.subscriptionStatus ?? "active");
  const content = applyEntitlements(parsed, entitlements);

  const { layout, warnings: layoutWarnings } = resolveLayout(opts.config.layoutId, opts.config.layoutVersion);
  const tokenResolved = resolveTokens(opts.config.tokenPresetId || layout.tokenPresetId, opts.config.overrides);
  const warnings = [...layoutWarnings, ...tokenResolved.warnings];

  // Theme switching is a paid capability; free profiles always use the industry layout's tokens.
  const tokens = entitlements.themeSwitching
    ? tokenResolved.tokens
    : resolveTokens(layout.tokenPresetId, {}).tokens;

  const onlineBooking =
    entitlements.onlineBooking &&
    content.booking.onlineBookingReady &&
    content.services.some((s) => s.bookingMode !== "contact");

  // Honour stored section order/visibility when present, else layout default order.
  let configs = layout.blocks;
  const sections = opts.config.sections;
  if (sections?.length) {
    const hidden = new Set(sections.filter((s) => s.hidden).map((s) => s.id));
    const order = new Map(sections.map((s, i) => [s.id, i]));
    configs = [...layout.blocks]
      .filter((b) => !hidden.has(b.id))
      .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  }

  const blocks = configs
    .filter((b) => blockHasContent(b.type, content, onlineBooking))
    .map((config) => ({ config }));

  const placed = new Set(layout.blocks.map((b) => b.type));
  const unplacedContent = (["services", "reviews", "gallery", "team", "booking", "about", "faq", "caseStudies", "contact"] as BlockType[]).filter(
    (t) => !placed.has(t) && blockHasContent(t, content, onlineBooking),
  );

  const all = buildActions(content, onlineBooking, industry.terminology.booking);
  const primaryAction = all[0] ?? null;
  const secondaryActions = all.slice(1, 3);
  const contactActions = [...all.filter((a) => a.kind !== "book")];
  if (content.location.directionsUrl) {
    contactActions.push({ kind: "directions", label: "Directions", href: content.location.directionsUrl });
  }
  if (content.contacts.website) {
    contactActions.push({ kind: "website", label: "Website", href: content.contacts.website });
  }
  const mobileAction =
    layout.mobileAction === "booking"
      ? (all.find((a) => a.kind === "book") ?? primaryAction)
      : layout.mobileAction === "contact"
        ? (all.find((a) => a.kind === "call") ?? primaryAction)
        : primaryAction;

  return {
    business: content,
    industry,
    layout,
    family: layout.family,
    tokens,
    cssVars: tokensToCssVars(tokens),
    blocks,
    unplacedContent,
    primaryAction,
    secondaryActions,
    mobileAction,
    contactActions,
    showBranding: !entitlements.removeBranding,
    entitlements,
    warnings,
    onlineBooking,
  };
}

/** Which sections a visitor would see under a given layout — drives the switch preview. */
export function visibleBlockTypes(
  input: BusinessContentInput | BusinessContent,
  layoutId: string,
  plan: PlanId,
): BlockType[] {
  const layout = resolveLayout(layoutId).layout;
  const vm = buildPublicProfileViewModel(input, {
    config: { layoutId, layoutVersion: layout.version, tokenPresetId: layout.tokenPresetId, overrides: {} },
    plan,
  });
  return vm.blocks.map((b) => b.config.type);
}
