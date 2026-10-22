import type { Metadata } from "next"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"

export const metadata: Metadata = { title: "Pricing — Taplo" }

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-muted-foreground">Simple monthly plans. Billing is not yet enabled in this environment.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLAN_IDS.map((id) => (
          <li key={id} className="flex flex-col rounded-xl border p-5">
            <h2 className="font-semibold">{PLANS[id].name}</h2>
            <p className="mt-1 text-3xl font-semibold">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}{PLANS[id].priceMinorGbp ? <span className="text-sm font-normal text-muted-foreground">/month</span> : null}</p>
            <ul className="mt-4 grid gap-1.5 text-sm">
              {PLANS[id].highlights.map((h) => <li key={h}>✓ {h}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
