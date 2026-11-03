import type { BusinessContent } from "@/features/businesses/content";
import type { Entitlements } from "@/features/subscriptions/entitlements";
import type { IndustryPreset } from "@/features/themes/contracts/industry";
import type { WidgetCategory, WidgetType } from "../contracts/widgets";

/** What a widget needs in order to render. Built once per page by the view-model. */
export interface WidgetContext {
  business: BusinessContent;
  ent: Entitlements;
  industry: IndustryPreset;
  onlineBooking: boolean;
  /** Visible featured service records, so another list can avoid repeating them. */
  featuredServiceIds?: string[];
  /** A payment provider is connected for this environment. False until Stripe is configured; payment widgets stay hidden until then. */
  paymentsConnected: boolean;
  /** YYYY-MM-DD in the business timezone; used for expiring notices/offers. */
  today: string;
}

export type FieldSource = "services" | "staff" | "gallery" | "faqs" | "testimonials" | "products" | "offers" | "reviewPlatforms" | "socialPlatforms";

export type FieldSpec =
  | { kind: "text"; key: string; label: string; placeholder?: string; max?: number; help?: string }
  | { kind: "textarea"; key: string; label: string; rows?: number; max?: number }
  | { kind: "url"; key: string; label: string; help?: string }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: "switch"; key: string; label: string }
  | { kind: "date"; key: string; label: string; help?: string }
  | { kind: "refs"; key: string; label: string; source: FieldSource; help?: string }
  | { kind: "record"; key: string; label: string; source: "services"; help?: string }
  | { kind: "image"; key: string; label: string };

export type WidgetStatus =
  | { state: "ready" }
  /** Valid widget with nothing to show yet; hidden publicly, explained in the editor. */
  | { state: "empty"; reason: string; fix?: "profile" | "services" | "reviews" | "team" | "products" | "settings" }
  /** The current plan does not include it; content is kept. */
  | { state: "locked"; reason: string };

export type AppearanceKind = "card" | "button" | "thumbnail";

export interface WidgetDefinition {
  type: WidgetType;
  /** Settings schema version. `migrate` upgrades older stored settings. */
  version: number;
  label: string;
  description: string;
  category: WidgetCategory;
  /** lucide icon name, resolved in the editor. */
  icon: string;
  multiple: boolean;
  fields: FieldSpec[];
  appearance: AppearanceKind[];
  status: (settings: Record<string, unknown>, ctx: WidgetContext) => WidgetStatus;
  migrate?: (settings: Record<string, unknown>, fromVersion: number) => Record<string, unknown>;
  /** True when the widget triggers a simulated (not connected) action in demo. */
  simulated?: boolean;
}

export const CATEGORY_LABEL: Record<WidgetCategory, string> = {
  contact: "Contact & links",
  sales: "Services & sales",
  trust: "Trust & people",
  content: "Content",
  info: "Business info",
};
