import { WHEN_UNAVAILABLE, capabilities } from "@/lib/capabilities";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import {
  resolveEntitlements,
  type Entitlements,
} from "@/features/subscriptions/entitlements";
import { formatMoney } from "@/features/services/format";
import { demoModeEnabled } from "@/lib/env";
import { PlanComparison } from "@/features/marketing/PlanComparison";
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
    note: "Several people, each with their own hours.",
    value: (e) => e.multiStaff,
  },
  {
    label: "Deposits and payments",
    note: "Not connected yet. A payment provider is needed before this can be switched on.",
    value: (e) => e.payments,
  },
  {
    label: "Email confirmations",
    note: "Not connected yet. An email provider is needed.",
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
  const start = (id: PlanId) =>
    demo ? `/onboarding?plan=${id}` : "/how-it-works";
  return (
    <div className="bg-[#f4f4f4] text-[#080808]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[88rem] px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] text-balance">
          A plan for the way you work.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">
          Start free, add more when you need it. One monthly price, no
          commission on bookings and no contract.
        </p>

        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PLAN_IDS.map((id) => (
            <li
              key={id}
              className="flex flex-col rounded-2xl border border-[#080808]/20 bg-white p-4 sm:p-7"
            >
              <h2 className="text-lg font-semibold">{PLANS[id].name}</h2>
              <p className="font-display mt-3 text-[clamp(1.75rem,3.3vw,3rem)] tabular-nums">
                {PLANS[id].priceMinorGbp === 0
                  ? "£0"
                  : formatMoney(PLANS[id].priceMinorGbp)}
                {PLANS[id].priceMinorGbp ? (
                  <span className="mt-1 block text-xs font-normal tracking-normal text-foreground/65 sm:ml-1 sm:mt-0 sm:inline sm:text-sm">
                    /month
                  </span>
                ) : null}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">
                {PLANS[id].summary}
              </p>
              <Button
                asChild
                variant={id === "pro" ? "default" : "outline"}
                className="mt-6 min-h-12 rounded-full px-2 text-xs sm:px-4 sm:text-sm"
              >
                <Link href={start(id)}>
                  {PLANS[id].priceMinorGbp === 0
                    ? "Start free"
                    : `Start with ${PLANS[id].name}`}
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        <h2 className="font-display font-display-tight mt-20 text-[clamp(1.75rem,4vw,3rem)]">
          What each plan includes
        </h2>
        <div className="mt-8">
          <PlanComparison
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
          {capabilities().payments
            ? "Prices are per month, with no commission and no contract."
            : `Prices are per month, with no commission and no contract. ${WHEN_UNAVAILABLE.payments} Choosing a plan changes what you can use. Features marked “not connected yet” switch on when their service is connected.`}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
