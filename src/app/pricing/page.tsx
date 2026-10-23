import Link from "next/link"
import type { Metadata } from "next"
import { Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { resolveEntitlements, type Entitlements } from "@/features/subscriptions/entitlements"
import { formatMoney } from "@/features/services/format"
import { demoModeEnabled } from "@/lib/env"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"

export const metadata: Metadata = { title: "Pricing | Taplo", description: "Plans for every kind of local business, from a free Taplo to a multi-person business." }
export const dynamic = "force-dynamic"

type Row = { label: string; note?: string; value: (e: Entitlements, id: PlanId) => string | boolean }
/**
 * The comparison is generated from the entitlement resolver, the same code that decides what each plan can do
 * in the editor and on the public page, so this table cannot drift from the product.
 */
const ROWS: Row[] = [
  { label: "Services you can list", value: (e) => (e.maxServices === null ? "Unlimited" : String(e.maxServices)) },
  { label: "Call and WhatsApp buttons", value: (e) => e.callAndWhatsapp },
  { label: "Customise colours, fonts, header, buttons and wallpaper", note: "Every plan can change these.", value: () => true },
  { label: "Choose any starting look", note: "Free uses the look matched to your category.", value: (e) => e.themeSwitching },
  { label: "Photo gallery", value: (e) => e.gallery },
  { label: "Social and review links", value: (e) => e.socialLinks && e.reviewLinks },
  { label: "Products, vehicles and affiliate links", note: "Included on every plan; Free is limited by the services cap only.", value: () => true },
  { label: "Contact form", value: () => true },
  { label: "Online bookings and requests", value: (e) => e.onlineBooking },
  { label: "Team profiles", value: (e) => e.teamPages },
  { label: "Customers choose a person", note: "Several people, each with their own hours.", value: (e) => e.multiStaff },
  { label: "Deposits and payments", note: "Not connected yet. A payment provider is needed before this can be switched on.", value: (e) => e.payments },
  { label: "Email confirmations", note: "Not connected yet. An email provider is needed.", value: (e) => e.emailConfirmations },
  { label: "Analytics", value: (e) => e.analytics },
  { label: "No Taplo branding", value: (e) => e.removeBranding },
  { label: "Custom domain", value: (e) => e.customDomains },
  { label: "More than one location", value: (e) => e.multiLocation },
]

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <><Check aria-hidden="true" className="mx-auto size-5 text-foreground" /><span className="sr-only">Included</span></>
  if (v === false) return <><Minus aria-hidden="true" className="mx-auto size-5 text-foreground/25" /><span className="sr-only">Not included</span></>
  return <span className="font-semibold tabular-nums">{v}</span>
}

export default function PricingPage() {
  const demo = demoModeEnabled()
  const ents = Object.fromEntries(PLAN_IDS.map((id) => [id, resolveEntitlements(id, "active")])) as Record<PlanId, Entitlements>
  const start = (id: PlanId) => (demo ? `/onboarding?plan=${id}` : "/how-it-works")
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Pricing</p>
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] text-balance">Start free. Pay when you need more.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">One price a month for each plan, no commission on your bookings and no contract. Pick a plan and it carries into setup.</p>

        <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-3xl bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_IDS.map((id) => (
            <li key={id} className="flex flex-col bg-background p-7">
              <h2 className="text-sm font-semibold">{PLANS[id].name}</h2>
              <p className="font-display mt-3 text-5xl tabular-nums">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}{PLANS[id].priceMinorGbp ? <span className="ml-1 text-sm font-normal tracking-normal text-foreground/55">/month</span> : null}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">{PLANS[id].summary}</p>
              <Button asChild variant={id === "pro" ? "default" : "outline"} className="mt-6 min-h-11"><Link href={start(id)}>{PLANS[id].priceMinorGbp === 0 ? "Start free" : `Start with ${PLANS[id].name}`}</Link></Button>
            </li>
          ))}
        </ul>

        <h2 className="font-display font-display-tight mt-20 text-[clamp(1.75rem,4vw,3rem)]">What each plan includes</h2>
        <div className="relative mt-8 overflow-x-auto rounded-3xl border border-foreground/10">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm" data-testid="plan-table">
            <caption className="sr-only">Plan comparison</caption>
            <thead><tr className="border-b border-foreground/10"><th scope="col" className="p-4 font-semibold">Feature</th>{PLAN_IDS.map((id) => <th key={id} scope="col" className="w-28 p-4 text-center font-semibold">{PLANS[id].name}</th>)}</tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-foreground/5 last:border-0">
                  <th scope="row" className="p-4 font-medium">{r.label}{r.note ? <span className="mt-0.5 block text-xs font-normal text-foreground/55">{r.note}</span> : null}</th>
                  {PLAN_IDS.map((id) => <td key={id} className="p-4 text-center"><Cell v={r.value(ents[id], id)} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/60">Prices are the intended launch prices. In this preview nothing is charged and no plan can be bought, so the plan you choose only changes what you can try. Features marked “not connected yet” depend on services Taplo has not connected, and are listed so you can see where each plan is heading.</p>
      </main>
      <SiteFooter />
    </div>
  )
}
