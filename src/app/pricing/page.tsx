import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"
import { demoModeEnabled } from "@/lib/env"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"

export const metadata: Metadata = { title: "Pricing | Taplo", description: "Simple monthly plans for every kind of local business." }
export const dynamic = "force-dynamic"

export default function PricingPage() {
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <SiteHeader active="/pricing" />
      <main className="mx-auto w-full max-w-7xl px-5 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Pricing</p>
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.75rem,8vw,6.25rem)] text-balance">Simple plans. Grow when you do.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">Every plan includes your page, your link and the full editor. Higher plans add more of what a growing business needs.</p>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_IDS.map((id) => (
            <li key={id} className="flex flex-col bg-background p-7">
              <h2 className="text-sm font-semibold">{PLANS[id].name}</h2>
              <p className="font-display mt-3 text-5xl tabular-nums">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}{PLANS[id].priceMinorGbp ? <span className="ml-1 text-sm font-normal tracking-normal text-foreground/55">/month</span> : null}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">{PLANS[id].summary}</p>
              <ul className="mt-6 grid gap-2.5 border-t border-foreground/10 pt-6 text-sm">
                {PLANS[id].highlights.map((h) => <li key={h} className="grid grid-cols-[1.25rem_1fr] gap-1"><span aria-hidden="true" className="text-signal-ink">✓</span>{h}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-foreground/60">Billing is not enabled in this preview, so no plan can be bought yet. Prices shown are the intended launch prices and may change.</p>
        <div className="mt-10"><Button asChild size="lg" className="h-13 px-7 text-base"><Link href={demo ? "/onboarding" : "/how-it-works"}>{demo ? "Create your page" : "How it works"}</Link></Button></div>
      </main>
      <SiteFooter />
    </div>
  )
}
