/**
 * Locked package definitions. Prices live here only; Stripe Price IDs are
 * mapped per environment in env config (see .env.example), never hard-coded.
 * No annual discounts, trials, quotas or transaction commissions exist.
 */
export const PLAN_IDS = ["free", "core", "pro", "business"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export interface PlanDefinition {
  id: PlanId;
  name: string;
  /** Monthly price in integer minor units of GBP. */
  priceMinorGbp: number;
  summary: string;
  highlights: string[];
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    priceMinorGbp: 0,
    summary: "A professional profile with call and WhatsApp.",
    highlights: ["1 profile", "3 services", "Call and WhatsApp", "1 theme (matched to your industry)", "Taplo branding"],
  },
  core: {
    id: "core",
    name: "Core",
    priceMinorGbp: 999,
    summary: "Everything to look established and be found.",
    highlights: ["Unlimited services", "Gallery", "Theme options", "Analytics", "Social and review links", "No Taplo branding"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMinorGbp: 1999,
    summary: "Take bookings and payments online.",
    highlights: ["Everything in Core", "Online bookings", "Deposits and payments", "Team pages", "Email confirmations", "Booking links", "Customer management"],
  },
  business: {
    id: "business",
    name: "Business",
    priceMinorGbp: 3999,
    summary: "Run a multi-person, multi-location business.",
    highlights: ["Everything in Pro", "Multiple staff", "Multiple locations", "Advanced analytics", "Custom domains", "Staff scheduling", "Permissions"],
  },
};
