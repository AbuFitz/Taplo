import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { demoModeEnabled } from "@/lib/env"
import { STEPS } from "@/features/marketing/content"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"

export const metadata: Metadata = { title: "How it works | Taplo", description: "From a business name to a published page in a few minutes." }
export const dynamic = "force-dynamic"

const FAQ = [
  { q: "Do I need a website or a domain?", a: "No. Taplo gives you one page and one link. You can add your own domain on plans that include it." },
  { q: "What happens to my information in the preview?", a: "It stays in your browser. Nothing is sent to a server or made public until accounts and publishing are connected." },
  { q: "Can customers pay me through Taplo?", a: "Not yet. Customers can send an enquiry or a booking request. Product purchases happen on your own shop link." },
  { q: "Can I change my look later?", a: "Any time. Every colour, font and layout choice is a control, and your content never moves when you change style." },
]

export default function HowItWorks() {
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">How it works</p>
        <h1 className="font-display font-display-tight mt-4 text-[clamp(2.75rem,8vw,6rem)] text-balance">Four steps to a page you can share.</h1>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 sm:grid-cols-2">
          {STEPS.map((s) => <li key={s.n} className="bg-background p-8"><span className="font-display text-5xl tabular-nums text-foreground/20">{s.n}</span><h2 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{s.title}</h2><p className="mt-2 leading-relaxed text-foreground/70">{s.body}</p></li>)}
        </ol>
        <h2 className="font-display font-display-tight mt-24 text-[clamp(2rem,5vw,3.5rem)]">Common questions</h2>
        <dl className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
          {FAQ.map((f) => <div key={f.q} className="grid gap-2 py-6 md:grid-cols-[2fr_3fr] md:gap-10"><dt className="font-semibold tracking-[-0.02em]">{f.q}</dt><dd className="leading-relaxed text-foreground/70">{f.a}</dd></div>)}
        </dl>
        <div className="mt-12"><Button asChild size="lg" className="h-13 px-7 text-base"><Link href={demo ? "/onboarding" : "/pricing"}>Create your page</Link></Button></div>
      </main>
      <SiteFooter />
    </div>
  )
}
