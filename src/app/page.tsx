import Link from "next/link"
import { ArrowRight, CalendarCheck, Images, MessageSquareQuote, ShoppingBag, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { demoModeEnabled } from "@/lib/env"
import { formatMoney } from "@/features/services/format"
import { HeroPhones } from "@/features/showcase/HeroPhones"
import { LookStrip } from "@/features/showcase/LookStrip"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

const FEATURES = [
  { icon: Sparkles, title: "Make it yours", body: "Colours, type, headers, buttons and wallpapers. Start from a look or from nothing, and change any of it." },
  { icon: CalendarCheck, title: "Services and bookings", body: "A clear price list, and a way for customers to ask for a time that works." },
  { icon: ShoppingBag, title: "Products and stock", body: "From a bottle of beard oil to a forecourt of cars, with photos, prices and the facts that matter." },
  { icon: MessageSquareQuote, title: "Reviews you can show", body: "Real words from real customers, always with where they came from." },
  { icon: Images, title: "Photos that do the talking", body: "Crop once and the right part of every picture stays in view on every screen." },
  { icon: Users, title: "Your team", body: "Introduce the people behind the work." },
]

export default function Home() {
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-[1.1875rem] font-semibold tracking-[-0.03em]">Taplo</Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          <Link className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground" href="/appearance">Looks</Link>
          <Link className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground" href="/pricing">Pricing</Link>
          {demo ? <Button asChild size="sm" variant="outline"><Link href="/dashboard">Dashboard</Link></Button> : null}
        </nav>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-28 lg:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 text-xs font-medium text-[oklch(0.42_0.13_38)]"><span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />For local services, shops and showrooms</p>
            <h1 className="font-display mt-5 text-[clamp(3rem,8.4vw,5.75rem)] leading-[0.95] tracking-[-0.02em]">A page that looks like <em className="not-italic text-signal">your</em> business.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Prices, bookings, reviews, products and photos on one beautiful page. Share a link and you are open for business. No website, no design skills.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {demo ? (
                <Button size="lg" asChild><Link href="/onboarding">Create your page <ArrowRight /></Link></Button>
              ) : (
                <Button size="lg" disabled aria-describedby="signup-note">Create your page</Button>
              )}
              <Button size="lg" variant="outline" asChild><Link href="/appearance">See the looks</Link></Button>
            </div>
            {demo ? (
              <p className="mt-4 text-sm text-muted-foreground">Demo mode: no sign-in, and everything you enter stays in this browser.</p>
            ) : (
              <p id="signup-note" className="mt-4 text-sm text-muted-foreground">Sign-up opens once authentication is configured for this environment.</p>
            )}
          </div>
          <HeroPhones />
        </section>

        <section className="border-y border-black/[0.06] bg-white/60 py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="font-display max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02]">One engine. Endless ways to look like you.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">No templates to pick from. Start from a look or from a blank page, then change colours, type, headers, buttons and wallpapers until it feels right. Your words and your prices never move.</p>
            <div className="mt-10"><LookStrip /></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02]">Everything a local business needs, nothing it doesn’t.</h2>
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="grid size-10 place-items-center rounded-xl bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_16px_-10px_rgb(0_0_0/0.3)]"><Icon className="size-5" aria-hidden="true" /></span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-24">
          <h2 className="text-xl font-semibold">Plans</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_IDS.map((id) => (
              <li key={id} className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_32px_-24px_rgb(0_0_0/0.3)]">
                <p className="font-semibold">{PLANS[id].name}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{PLANS[id].priceMinorGbp === 0 ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}<span className="text-sm font-normal text-muted-foreground">{PLANS[id].priceMinorGbp === 0 ? "" : "/month"}</span></p>
                <p className="mt-3 text-sm text-muted-foreground">{PLANS[id].summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-black/[0.06] py-8 text-center text-sm text-muted-foreground">© Taplo. Made for people who run real businesses.</footer>
    </div>
  )
}
