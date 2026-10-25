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
    label: "Services you can list",
    value: (e) =>
      e.maxServices === null ? "Unlimited" : String(e.maxServices),
  },
  { label: "Call and WhatsApp buttons", value: (e) => e.callAndWhatsapp },
  {
    label: "Customise colours, fonts, header, buttons and wallpaper",
    note: "Every plan can change these.",
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
    note: "Included on every plan; Free is limited by the services cap only.",
    value: () => true,
  },
  { label: "Contact form", value: () => true },
  { label: "Online bookings and requests", value: (e) => e.onlineBooking },
  { label: "Team profiles", value: (e) => e.teamPages },
  {
    label: "Customers choose a person",
    note: "Each person has their own hours. Pro includes three staff calendars.",
    value: (e) => e.maxStaffBookable === null ? "Unlimited" : e.maxStaffBookable > 0 ? String(e.maxStaffBookable) : false,
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
  { label: "Analytics", value: (e) => e.analytics },
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
    <div className="pricing-shell bg-[#f4f4f4] text-[#080808]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[88rem] px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] text-balance">
          Start with what you need.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">
          Start free. Add design options, appointments or a team when you need
          them.
        </p>

        <div className="mt-10">
          <PricingExperience
            demo={demo}
            rows={ROWS.map((r) => ({
              label: r.label,
              note: r.note,
              values: Object.fromEntries(
                PLAN_IDS.map((id) => [id, r.value(ents[id], id)]),
              ) as Record<PlanId, string | boolean>,
            }))}
          />
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/60">
          Prices are per month. Choose a plan during setup.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
