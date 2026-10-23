import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { demoModeEnabled } from "@/lib/env"
import { formatMoney } from "@/features/services/format"
import { STEPS } from "@/features/marketing/content"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { ArrowLink, CapabilitiesScene, HeroScene } from "@/features/marketing/Scenes"
import { YoursScene } from "@/features/marketing/YoursScene"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

export default function Home() {
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="overflow-hidden pt-12 sm:pt-16">
          <div className="mx-auto w-full max-w-5xl px-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">For every kind of local business</p>
            <h1 className="font-display font-display-tight mt-5 text-[clamp(3rem,8.4vw,6.75rem)] text-balance">Everything your business does. One page.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-foreground/70">Services, products, stock, reviews and a clear way to get in touch. Share one link and you are open for business. No website. No design skills.</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {demo ? <Button size="lg" asChild className="h-13 px-7 text-base"><Link href="/onboarding">Create your page</Link></Button> : <Button size="lg" disabled aria-describedby="signup-note" className="h-13 px-7 text-base">Create your page</Button>}
              <Button size="lg" variant="outline" asChild className="h-13 px-7 text-base"><Link href="/appearance">See it change</Link></Button>
            </div>
            <p id="signup-note" className="mt-4 text-sm text-foreground/55">{demo ? "Preview mode: no sign-in, and everything you make stays in this browser." : "Sign-up opens once authentication is configured for this environment."}</p>
          </div>
          <div className="mt-12 sm:mt-14"><HeroScene /></div>
        </section>

        <section className="bg-foreground py-24 text-background sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">What the page can hold</p>
            <h2 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] text-balance">A price list, a shop window and a forecourt.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/70">Services, products and vehicles are records you keep once and show wherever you like. The same page works for a barber, a dealer and a plumber.</p>
            <div className="mt-16 rounded-[2rem] bg-background p-6 text-foreground sm:p-12"><CapabilitiesScene /></div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-background"><ArrowLink href="/features/services-and-enquiries">Services and enquiries</ArrowLink><ArrowLink href="/features/products-and-stock">Products and stock</ArrowLink></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Setup</p>
          <h2 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] text-balance">A good page in the time it takes to make a coffee.</h2>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-background p-7 sm:p-8">
                <span className="font-display text-5xl tabular-nums text-foreground/20">{s.n}</span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em]">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/65">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10"><ArrowLink href="/how-it-works">How setup works</ArrowLink></div>
        </section>

        <section className="border-y border-foreground/10 bg-[oklch(0.955_0.012_85)] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Make it yours</p>
            <h2 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] text-balance">Start from a look. End up with your own.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">One business, four steps, nothing but the editor&apos;s own controls. Colours, type, header, buttons and wallpaper are all yours to change.</p>
            <div className="mt-14"><YoursScene /></div>
            <div className="mt-10"><ArrowLink href="/appearance">Try every control yourself</ArrowLink></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Plans</p>
          <h2 className="font-display font-display-tight mt-4 max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)] text-balance">Start free. Grow when you do.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_IDS.map((id) => (
              <li key={id} className="bg-background p-7">
                <p className="text-sm font-semibold">{PLANS[id].name}</p>
                <p className="font-display mt-3 text-5xl tabular-nums">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}<span className="ml-1 text-sm font-normal tracking-normal text-foreground/55">{PLANS[id].priceMinorGbp === 0 ? "" : "/month"}</span></p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">{PLANS[id].summary}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8"><ArrowLink href="/pricing">Compare plans</ArrowLink></div>
        </section>

        <section className="bg-signal py-24 text-center text-white sm:py-32">
          <div className="mx-auto w-full max-w-4xl px-5">
            <h2 className="font-display font-display-tight text-[clamp(2.75rem,8vw,6.5rem)] text-balance">Your page is waiting.</h2>
            <div className="mt-9">{demo ? <Button size="lg" asChild className="h-13 bg-white px-8 text-base text-foreground hover:bg-white/90"><Link href="/onboarding">Create your page</Link></Button> : null}</div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
