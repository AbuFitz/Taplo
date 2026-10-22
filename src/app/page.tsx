import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { devToolsEnabled } from "@/lib/env"
import { formatMoney } from "@/features/services/format"

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
      <p className="text-sm font-semibold text-muted-foreground">Taplo</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Your business, ready for customers in ten minutes.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        A professional profile, services, reviews, bookings and payments for local service businesses. Pick your trade, add a service, publish. No website or design work required.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" disabled aria-describedby="signup-note">Create your page</Button>
        <Button size="lg" variant="outline" asChild><Link href="/pricing">See pricing</Link></Button>
        {devToolsEnabled() ? <Button size="lg" variant="ghost" asChild><Link href="/dev/themes">Theme showcase (dev)</Link></Button> : null}
      </div>
      <p id="signup-note" className="mt-3 text-sm text-muted-foreground">Sign-up opens once authentication is configured for this environment.</p>

      <h2 className="mt-20 text-xl font-semibold">Plans</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLAN_IDS.map((id) => (
          <li key={id} className="rounded-xl border p-5">
            <p className="font-semibold">{PLANS[id].name}</p>
            <p className="mt-1 text-2xl font-semibold">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}<span className="text-sm font-normal text-muted-foreground">{PLANS[id].priceMinorGbp === 0 ? "" : "/month"}</span></p>
            <p className="mt-2 text-sm text-muted-foreground">{PLANS[id].summary}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
