import type { Metadata } from "next";
import { PricingExperience } from "@/features/marketing/PricingExperience";
import { PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import {
  resolveEntitlements,
  type Entitlements,
} from "@/features/subscriptions/entitlements";
import { demoModeEnabled } from "@/lib/env";
import { SiteFooter, SiteHeader } from "@/features/marketing/Site";

export const metadata: Metadata = {
  title: "Pricing | Taplo",
  description:
    "Plans for every kind of local business, from a free Taplo to a multi-person business.",
};
export const dynamic = "force-dynamic";

type Row = {
  group?: string;
  label: string;
  note?: string;
  value: (e: Entitlements, id: PlanId) => string | boolean;
};
/**
 * The comparison is generated from the entitlement resolver, the same code that decides what each plan can do
 * in the editor and on the public page, so this table cannot drift from the product.
 */
const ROWS: Row[] = [
  {
    group: "Your page",
    label: "Services you can list",
    value: (e) =>
      e.maxServices === null ? "Unlimited" : String(e.maxServices),
  },
  { label: "Call and WhatsApp buttons", value: (e) => e.callAndWhatsapp },
  {
    label: "Colours, fonts and page styling",
    value: () => true,
  },
  {
    label: "Choose any starting look",
    note: "Free uses the look matched to your category.",
    value: (e) => e.themeSwitching,
  },
  { label: "Photo gallery", value: (e) => e.gallery },
  {
    label: "Social and review links",
    value: (e) => e.socialLinks && e.reviewLinks,
  },
  {
    label: "Products, vehicles and affiliate links",
    value: () => true,
  },
  { label: "Contact form", value: () => true },
  { label: "Customer testimonials", value: (e) => e.testimonials },
  {
    group: "Bookings and your team",
    label: "Online bookings and requests",
    value: (e) => e.onlineBooking,
  },
  { label: "Team profiles", value: (e) => e.teamPages },
  { label: "Customer management", value: (e) => e.customerManagement },
  { label: "Staff scheduling", value: (e) => e.staffScheduling },
  { label: "Team permissions", value: (e) => e.rolePermissions },
  {
    label: "Customers choose a person",
    note: "Each person has their own hours. Pro includes three staff calendars.",
    value: (e) =>
      e.maxStaffBookable === null
        ? "Unlimited"
        : e.maxStaffBookable > 0
          ? String(e.maxStaffBookable)
          : false,
  },
  {
    label: "Deposits and payments",
    note: "Requires a payment provider.",
    value: (e) => e.payments,
  },
  {
    label: "Email confirmations",
    note: "Requires an email provider.",
    value: (e) => e.emailConfirmations,
  },
  {
    group: "Growing your business",
    label: "Analytics",
    value: (e) => e.analytics,
  },
  { label: "Advanced analytics", value: (e) => e.advancedAnalytics },
  { label: "No Taplo branding", value: (e) => e.removeBranding },
  { label: "Custom domain", value: (e) => e.customDomains },
  { label: "More than one location", value: (e) => e.multiLocation },
];

export default function PricingPage() {
  const demo = demoModeEnabled();
  const ents = Object.fromEntries(
    PLAN_IDS.map((id) => [id, resolveEntitlements(id, "active")]),
  ) as Record<PlanId, Entitlements>;
  return (
    <div className="pricing-shell">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[88rem] px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] text-balance">
          One page.
          <br />
          Room to grow.
        </h1>
        <p className="pricing-intro">
          Start free. Add more ways to show your work, take bookings and bring
          your team together.
        </p>

        <div className="mt-10">
          <PricingExperience
            demo={demo}
            rows={ROWS.map((r) => ({
              group: r.group,
              label: r.label,
              note: r.note,
              values: Object.fromEntries(
                PLAN_IDS.map((id) => [id, r.value(ents[id], id)]),
              ) as Record<PlanId, string | boolean>,
            }))}
          />
        </div>
        <p className="pricing-footnote">
          Monthly prices in GBP. Choose your plan during setup.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
