import type { PlanId } from "./plans";

/**
 * The single server-side entitlement resolver. API actions, public rendering
 * and dashboard controls must all call this — never compare plan names inline.
 *
 * Boundaries marked ASSUMPTION are proposed defaults awaiting founder
 * confirmation (see docs/product-decisions.md).
 */
export interface Entitlements {
  maxServices: number | null; // null = unlimited
  maxStaffBookable: number;
  maxLocations: number;
  callAndWhatsapp: boolean;
  themeSwitching: boolean;
  gallery: boolean;
  socialLinks: boolean;
  /** ASSUMPTION: basic owner-supplied testimonials are available on every plan. */
  testimonials: boolean;
  reviewLinks: boolean;
  analytics: boolean;
  advancedAnalytics: boolean;
  removeBranding: boolean;
  onlineBooking: boolean;
  /** ASSUMPTION: Pro includes deposits AND full upfront payment. */
  payments: boolean;
  teamPages: boolean;
  emailConfirmations: boolean;
  customerManagement: boolean;
  multiStaff: boolean;
  multiLocation: boolean;
  customDomains: boolean;
  staffScheduling: boolean;
  rolePermissions: boolean;
}

const BASE: Entitlements = {
  maxServices: 3,
  maxStaffBookable: 0,
  maxLocations: 1,
  callAndWhatsapp: true,
  themeSwitching: false,
  gallery: false,
  socialLinks: false,
  testimonials: true,
  reviewLinks: false,
  analytics: false,
  advancedAnalytics: false,
  removeBranding: false,
  onlineBooking: false,
  payments: false,
  teamPages: false,
  emailConfirmations: false,
  customerManagement: false,
  multiStaff: false,
  multiLocation: false,
  customDomains: false,
  staffScheduling: false,
  rolePermissions: false,
};

const CORE: Entitlements = {
  ...BASE,
  maxServices: null,
  themeSwitching: true,
  gallery: true,
  socialLinks: true,
  reviewLinks: true,
  analytics: true,
  removeBranding: true,
};

const PRO: Entitlements = {
  ...CORE,
  maxStaffBookable: 1, // ASSUMPTION: one bookable operator on Pro
  onlineBooking: true,
  payments: true,
  teamPages: true,
  emailConfirmations: true,
  customerManagement: true,
};

const BUSINESS: Entitlements = {
  ...PRO,
  maxStaffBookable: 50,
  maxLocations: 20,
  advancedAnalytics: true,
  multiStaff: true,
  multiLocation: true,
  customDomains: true,
  staffScheduling: true,
  rolePermissions: true,
};

const BY_PLAN: Record<PlanId, Entitlements> = { free: BASE, core: CORE, pro: PRO, business: BUSINESS };

export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "incomplete";

/**
 * Billing state -> effective plan. Only a verified server-side subscription
 * record may be passed here (never a client or redirect claim).
 * ASSUMPTION: past_due keeps access during Stripe's retry window; unpaid,
 * canceled and incomplete revert to Free without deleting content.
 */
export function effectivePlan(plan: PlanId, status: SubscriptionStatus): PlanId {
  if (status === "active" || status === "trialing" || status === "past_due") return plan;
  return "free";
}

export function resolveEntitlements(plan: PlanId, status: SubscriptionStatus = "active"): Entitlements {
  return BY_PLAN[effectivePlan(plan, status)];
}

export const FREE_ENTITLEMENTS = BASE;
