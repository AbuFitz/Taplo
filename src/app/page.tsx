import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { YoursScene } from "@/features/marketing/YoursScene"
import { Film } from "@/features/marketing/Film"
import { EXAMPLES, describe } from "@/features/inspiration/examples"
import { cn } from "@/lib/utils"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

const VISITOR = [
  { verb: "Read the prices", body: "Every service with its price and how long it takes. A tap opens the detail.", href: "/product/services", shot: "svc-detail", alt: "A service detail with price, duration and a booking button", w: 520 },
  { verb: "Meet the people", body: "A card for each person, a fuller profile when opened, and booking with them.", href: "/product/team", shot: "team-profile", alt: "A team profile with services and qualifications", w: 520 },
  { verb: "Pick a time", body: "Choose a service, a person, a day and a time. It says whether the time is confirmed or only requested.", href: "/product/booking", shot: "bk-2-time", alt: "Choosing a day and time in the booking journey", w: 440 },
  { verb: "Send a message", body: "A contact form that says plainly that nothing is reserved, and keeps what was typed.", href: "/product/enquiries", shot: "enq-sent", alt: "The confirmation after sending a message", w: 340 },
] as const

export default function Home() {
  const a = primaryAction()
  const picks = EXAMPLES.filter((e) => ["hollin-physio", "forge-strength", "pims-kitchen", "aldous-motor-co"].includes(e.slug))
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        {/* 1. A page doing its job: one browser, one phone, one share chip. */}
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">For barbers, clinics, cafés, trades and dealers</p>
            <h1 className="font-display font-display-tight mt-5 text-[clamp(2.5rem,5.2vw,4.5rem)] text-balance">The page your customers use before they call.</h1>
            <p className="mt-6 max-w-lg text-xl leading-relaxed text-foreground/70">Prices, people and a way to book or ask, on one page that looks like yours. Share it as a link or a QR code.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={a.href} className="inline-flex min-h-13 items-center rounded-full bg-foreground px-7 text-base font-semibold text-background outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60">{a.label}</Link>
              <Link href="/inspiration" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-foreground/20 px-6 text-base font-semibold outline-none hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/60">See real examples</Link>
            </div>
            <p className="mt-4 text-sm text-foreground/55">{a.demo ? "Preview: no sign-in, and what you make stays in this browser." : "Sign-up opens when accounts are connected."}</p>
          </div>
          <div className="relative lg:col-span-7" aria-label="A physiotherapy clinic's page on a laptop, and a barber's page on a phone">
            <Shot id="ex-hollin-physio-desk" alt="A physiotherapy clinic's Taplo page on a laptop screen" width={700} frame="browser" priority className="w-[88%] max-w-full" />
            <Shot id="ex-marlowe-and-finch-phone" alt="A barber's Taplo page on a phone" width={250} priority cropTo={470} className="absolute -bottom-6 right-0 hidden sm:block" />
          </div>
        </section>

        {/* 1b. The film: asked for, never autoplayed, with its story written out. */}
        <section aria-labelledby="film-h" className="mx-auto w-full max-w-5xl px-5 pb-24">
          <h2 id="film-h" className="font-display font-display-tight mb-6 text-[clamp(1.5rem,3vw,2.25rem)]">Fifteen seconds, start to finish</h2>
          <Film />
        </section>

        {/* 2. What a visitor does: an editorial list, not a card grid. */}
        <section className="border-t border-foreground/10 bg-[oklch(0.955_0.012_85)] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">What your customers do</p>
            <h2 className="font-display font-display-tight mt-4 max-w-3xl text-[clamp(2rem,4.6vw,3.75rem)] text-balance">Four things, in the order they happen.</h2>
            <ol className="mt-16 grid gap-20">
              {VISITOR.map((v, n) => (
                <li key={v.verb} className="grid items-center gap-8 md:grid-cols-12 md:gap-14">
                  <div className={cn("md:col-span-5", n % 2 === 1 && "md:order-last")}>
                    <p className="font-display text-6xl tabular-nums text-foreground/15">{String(n + 1).padStart(2, "0")}</p>
                    <h3 className="font-display font-display-tight mt-2 text-[clamp(1.75rem,3.2vw,2.75rem)]">{v.verb}</h3>
                    <p className="mt-3 max-w-md text-lg leading-relaxed text-foreground/70">{v.body}</p>
                    <div className="mt-6"><ArrowLink href={v.href}>How it works</ArrowLink></div>
                  </div>
                  <div className={cn("md:col-span-7", n % 2 === 1 ? "md:justify-self-start" : "md:justify-self-end")}><Shot id={v.shot} alt={v.alt} width={v.w} frame="none" className="max-w-full" /></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. The wording: the idea nobody else says out loud. */}
        <section className="bg-foreground py-24 text-background sm:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal">Booking, said precisely</p>
              <h2 className="font-display font-display-tight mt-4 text-[clamp(2rem,4.2vw,3.5rem)] text-balance">Confirmed, requested or asked. It always says which.</h2>
              <p className="mt-6 text-lg leading-relaxed text-background/70">Most booking tools call everything a booking. Taplo does not. A request stays a request until you accept it, and an enquiry never pretends to reserve a time.</p>
              <div className="mt-8"><Link href="/product/booking" className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">See the whole journey<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-3xl bg-background/15 lg:col-span-7">
              {[["Confirmed appointment", "Book this time", "Confirm booking", "The time is reserved the moment it is confirmed."], ["Pending request", "Request this time", "Send request", "The business accepts or declines. Nothing is called booked."], ["Enquiry", "Send a message", "Send message", "No time is reserved, and the form says so."]].map(([t, b1, b2, d]) => (
                <div key={t} className="grid gap-3 bg-foreground p-7 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><dt className="text-xl font-semibold tracking-[-0.02em]">{t}</dt><dd className="mt-1 text-background/65">{d}</dd></div>
                  <dd className="flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-background/12 px-3 py-1.5">{b1}</span><span className="rounded-full bg-signal px-3 py-1.5 font-semibold text-foreground">{b2}</span></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 4. Inspiration: staggered, with the reason each one looks the way it does. */}
        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Inspiration</p><h2 className="font-display font-display-tight mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.75rem)] text-balance">Seven businesses. Seven different pages.</h2></div>
            <ArrowLink href="/inspiration">All examples</ArrowLink>
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {picks.map((e, n) => { const f = describe(e); return (
              <li key={e.slug} className={cn(n % 2 === 1 && "sm:mt-20")}>
                <Link href={`/inspiration/${e.slug}`} className="group block outline-none" aria-label={`${f.name}: open the example`}>
                  <Shot id={`ex-${e.slug}-desk` as never} alt={`${f.name}'s page on a laptop`} width={620} frame="browser" className="w-full transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:ring-3 group-focus-visible:ring-ring/60 motion-reduce:transition-none" />
                  <p className="mt-4 text-sm text-foreground/55">{f.industryLabel} · {f.lookName} look</p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.02em]">{f.name}</p>
                  <p className="mt-1 text-foreground/65">{e.hook}</p>
                </Link>
              </li>) })}
          </ul>
        </section>

        {/* 5. Make it yours. */}
        <section className="border-y border-foreground/10 bg-[oklch(0.955_0.012_85)] py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Make it yours</p>
            <h2 className="font-display font-display-tight mt-4 max-w-3xl text-[clamp(2rem,4.6vw,3.75rem)] text-balance">Start from a look. End up with your own.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">Nine starting looks, and every colour, font, header, button and wallpaper is a control. Your words and prices stay put while you try things.</p>
            <div className="mt-14"><YoursScene /></div>
            <div className="mt-10"><ArrowLink href="/product/design">More on looks and design</ArrowLink></div>
          </div>
        </section>

        {/* 6. Plans, briefly. */}
        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Plans</p><h2 className="font-display font-display-tight mt-4 text-[clamp(2rem,4vw,3.25rem)] text-balance">Start free. Pay when you need more.</h2><p className="mt-5 text-foreground/70">One price a month, no commission and no contract. In this preview nothing is charged.</p><div className="mt-8"><ArrowLink href="/pricing">Compare every feature</ArrowLink></div></div>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10 lg:col-span-8">
              {PLAN_IDS.map((id) => (
                <li key={id} className="grid items-baseline gap-x-8 gap-y-1 py-6 sm:grid-cols-[8rem_1fr_auto]">
                  <p className="font-display text-3xl">{PLANS[id].name}</p>
                  <p className="text-foreground/70">{PLANS[id].summary}</p>
                  <p className="font-semibold tabular-nums">{PLANS[id].priceMinorGbp === 0 ? "£0" : `${formatMoney(PLANS[id].priceMinorGbp)} a month`}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. One honest statement of the preview, then the action. */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-8">
          <div className="grid gap-8 rounded-[2rem] bg-foreground px-7 py-12 text-background sm:px-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h2 className="font-display font-display-tight text-[clamp(2rem,4vw,3.25rem)] text-balance">Make your Taplo in a few minutes.</h2>
              <p className="mt-4 max-w-xl text-background/70">Taplo is in preview. Everything above works in your browser. Emails, texts, payments, public links and accounts are not connected yet, and nothing here says otherwise.</p>
            </div>
            <div className="lg:text-right"><Link href={a.href} className="inline-flex min-h-13 items-center rounded-full bg-background px-7 text-base font-semibold text-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50">{a.label}</Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
