import { businessContentSchema, type BusinessContent, type BusinessContentInput } from "@/features/businesses/content";
import { resolveEntitlements, type Entitlements, type SubscriptionStatus } from "@/features/subscriptions/entitlements";
import type { PlanId } from "@/features/subscriptions/plans";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import type { IndustryPreset } from "@/features/themes/contracts/industry";
import { telHref, whatsappHref } from "@/lib/validation";
import type { PageDoc } from "../contracts/page";
import { WIDGET_TYPES, parseSettings, type WidgetType } from "../contracts/widgets";
import type { WidgetAppearance } from "../contracts/style";
import { migratePage } from "../migrate";
import { resolveStyle, widgetStyle, type ResolvedStyle } from "../themes/resolve";
import { getWidget } from "../widgets/registry";
import type { WidgetContext, WidgetStatus } from "../widgets/types";

export type ActionKind = "book" | "call" | "whatsapp" | "email";
export interface PageAction {
  kind: ActionKind;
  label: string;
  href: string;
  event?: "call_click" | "whatsapp_click" | "booking_click";
}

export interface RenderWidget {
  id: string;
  type: WidgetType;
  hidden: boolean;
  settings: Record<string, unknown>;
  appearance: WidgetAppearance;
  status: WidgetStatus;
  style: { vars: Record<string, string>; attrs: Record<string, string> };
}

export interface PageViewModel {
  business: BusinessContent;
  industry: IndustryPreset;
  ent: Entitlements;
  style: ResolvedStyle;
  ctx: WidgetContext;
  /** Every widget in the owner's order (the editor lists all of these). */
  widgets: RenderWidget[];
  /** What visitors see: not hidden and status ready. */
  visible: RenderWidget[];
  actions: PageAction[];
  /** The one dominant action at the top of the page (separate from widget order); null when the page has none. */
  primary: { kind: ActionKind; label: string; href: string; event?: PageAction["event"] } | null;
  /** A widget shown as the main action instead of in the list, so it is not drawn twice. */
  promotedWidgetId: string | null;
  locationLine: string | null;
  showBranding: boolean;
  onlineBooking: boolean;
  /** Plain-language notes for the owner (migration, readability adjustments). */
  notes: string[];
}

export interface BuildOptions {
  plan: PlanId;
  subscriptionStatus?: SubscriptionStatus;
  /** Overrides the theme only for synthetic demo links (?theme=). Never used for real pages. */
  themeOverride?: string;
  now?: Date;
}

/** The booking button says what will happen: a request is never worded as a booking. */
export function bookingLabel(term: string, mode: "instant" | "request" | "contact"): string {
  if (mode !== "request" || /^request/i.test(term)) return term;
  if (term === "Book") return "Request a booking";
  return term.replace(/^Book\b/, "Request");
}

function todayIn(tz: string, now: Date): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

export function buildPageViewModel(contentInput: BusinessContentInput | BusinessContent, pageRaw: unknown, opts: BuildOptions): PageViewModel {
  const parsed = businessContentSchema.parse(contentInput);
  const industry = getIndustryPreset(parsed.identity.industryKey);
  const ent = resolveEntitlements(opts.plan, opts.subscriptionStatus ?? "active");

  const services = parsed.services.filter((s) => !s.archived).sort((a, b) => a.sortOrder - b.sortOrder);
  const business: BusinessContent = {
    ...parsed,
    services: ent.maxServices === null ? services : services.slice(0, ent.maxServices),
    testimonials: ent.testimonials ? parsed.testimonials.filter((t) => t.permissionConfirmed) : [],
    rating: ent.reviewLinks ? parsed.rating : undefined,
  };

  const onlineBooking = ent.onlineBooking && business.booking.onlineBookingReady && business.services.some((s) => !s.archived && s.bookingMode !== "contact" && Boolean(s.durationMinutes));
  const ctx: WidgetContext = { business, ent, industry, onlineBooking, paymentsConnected: false, today: todayIn(business.location.timezone, opts.now ?? new Date()) };

  const mig = migratePage(pageRaw, parsed.identity.industryKey);
  const page: PageDoc = opts.themeOverride ? { ...mig.page, themeId: opts.themeOverride } : mig.page;
  const style = resolveStyle(page.themeId, page.appearance);
  // Theme choice is a Core+ capability: Free keeps the industry's suggested theme.
  const effectiveStyle = ent.themeSwitching || opts.themeOverride ? style : resolveStyle(industry.suggestedThemeId, {});

  const widgets: RenderWidget[] = [];
  const notes = [...mig.notes, ...effectiveStyle.notices.map((n) => n.message)];
  for (const w of page.widgets) {
    const def = getWidget(w.type);
    if (!def || !(WIDGET_TYPES as readonly string[]).includes(w.type)) continue;
    const { settings, valid } = parseSettings(w.type as WidgetType, w.settings);
    if (!valid) notes.push(`${def.label} had a setting that could not be read, so its defaults are being used.`);
    widgets.push({
      id: w.id,
      type: w.type as WidgetType,
      hidden: w.hidden,
      settings: settings as Record<string, unknown>,
      appearance: w.appearance,
      status: def.status(settings as Record<string, unknown>, ctx),
      style: widgetStyle(effectiveStyle, w.appearance),
    });
  }

  const k = business.contacts;
  const actions: PageAction[] = [];
  if (onlineBooking) actions.push({ kind: "book", label: bookingLabel(industry.terminology.booking, business.booking.mode), href: `/${business.identity.slug}/book`, event: "booking_click" });
  if (k.phone) actions.push({ kind: "call", label: "Call", href: telHref(k.phone), event: "call_click" });
  if (k.whatsapp) actions.push({ kind: "whatsapp", label: "WhatsApp", href: whatsappHref(k.whatsapp, `Hi ${business.identity.name}, I found you on Taplo.`), event: "whatsapp_click" });
  if (k.email) actions.push({ kind: "email", label: "Email", href: `mailto:${k.email}` });

  // ---- main action: chosen on the page, independent of widget order
  const primaryMode = effectiveStyle.spec.header.actions === "primary";
  const bookingWidget = widgets.find((w) => w.type === "booking" && !w.hidden && w.status.state === "ready");
  const available: Record<ActionKind, boolean> = { book: Boolean(bookingWidget) || onlineBooking, call: Boolean(k.phone), whatsapp: Boolean(k.whatsapp), email: Boolean(k.email) };
  const order: ActionKind[] = ["book", "call", "whatsapp", "email"];
  const pref = page.meta.primaryAction;
  const chosen: ActionKind | undefined = pref === "none" ? undefined : pref !== "auto" && available[pref] ? pref : order.find((o) => available[o]);
  let primary: PageViewModel["primary"] = null;
  if (primaryMode && chosen) {
    const found = actions.find((a) => a.kind === chosen);
    if (chosen === "book") primary = { kind: "book", label: (bookingWidget?.settings.label as string | undefined) || bookingLabel(industry.terminology.booking, business.booking.mode), href: found?.href ?? "", event: "booking_click" };
    else if (found) primary = { kind: found.kind, label: found.kind === "call" ? "Call" : found.label, href: found.href, event: found.event };
  }
  const promotedWidgetId = primary?.kind === "book" && bookingWidget ? bookingWidget.id : null;

  const l = business.location;
  const locationLine = l.mode === "online" ? (l.locality ? l.locality : "Online") : l.mode === "service_area" ? (l.locality ? `Covering ${l.locality}` : "Service area") : (l.locality ?? null);

  return {
    business,
    industry,
    ent,
    style: effectiveStyle,
    ctx,
    widgets,
    visible: widgets.filter((w) => !w.hidden && w.status.state === "ready" && w.id !== promotedWidgetId),
    actions,
    primary,
    promotedWidgetId,
    locationLine,
    showBranding: !ent.removeBranding,
    onlineBooking,
    notes: [...new Set(notes)],
  };
}
