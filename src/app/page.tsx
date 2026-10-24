import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { Film } from "@/features/marketing/Film"
import { BookingStory } from "@/features/marketing/home/BookingStory"
import { LookSwitcher } from "@/features/marketing/home/LookSwitcher"
import { Reveal } from "@/features/marketing/home/Reveal"
import { taploCodeSvg } from "@/features/qr/taplo-code"
import { featureState } from "@/lib/feature-status"
import { BusinessStories } from "@/features/marketing/home/BusinessStories"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

export default function Home() {
  const a = primaryAction()
  const qr = taploCodeSvg("https://taplo.example/common-room-barbers", 320, "A Taplo QR code")
  const messagingPending = featureState("appointmentMessages") !== "works" || featureState("reminders") !== "works"
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="overflow-hidden bg-[#f1eddf] text-[#142d3e]" aria-labelledby="home-title">
          <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:min-h-[46rem] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <h1 id="home-title" className="font-display font-display-tight text-[clamp(2.25rem,11vw,3.5rem)] leading-[0.98] lg:text-[clamp(3.25rem,5.6vw,5.5rem)] tracking-[-0.055em]">Your business.<br />All together.<br /><span className="text-signal">One good page.</span></h1>
              <p className="mt-7 max-w-[27rem] text-lg leading-relaxed sm:text-xl">The work you do. What it costs. How to book. Give customers a page that feels like you, wherever they find you.</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href={a.href} className="inline-flex min-h-13 items-center gap-5 rounded-full bg-signal px-7 font-semibold text-white outline-none transition-colors hover:bg-[#243bd3] focus-visible:ring-3 focus-visible:ring-signal/50">{a.label}<ArrowRight aria-hidden="true" className="size-5" /></Link>
                <Link href="/inspiration" className="inline-flex min-h-12 items-center border-b border-current font-semibold outline-none focus-visible:ring-3 focus-visible:ring-signal/50">Find your look</Link>
              </div>
              <p className="mt-5 text-sm text-[#53616a]">Start free. Bring your photos. Make it yours.</p>
            </div>
            <div className="relative mx-auto w-full max-w-[39rem] pb-9 pr-[20%] pt-2 sm:pb-14" aria-label="Station Road Barbers: a fictional UK business and its real Taplo page">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#d5d4bd]">
                {/* Original illustrative scene; the page alongside is captured from the actual engine. */}
                <Image src="/taplo-demo/station-road-barber-work.png" alt="Illustrative barber at work in a bright local shop" width={1536} height={1024} priority sizes="(min-width: 1024px) 40vw, 80vw" className="aspect-[0.82] w-full object-cover object-[85%_center]" />
                <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-[#102d3c]/95 to-transparent px-6 pb-7 pt-24 text-white sm:block">
                  <p className="text-sm font-medium text-white/75">A familiar face. A proper haircut.</p>
                  <p className="mt-1 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight">Station Road<br />Barbers</p>
                </div>
              </div>
              <Shot id="ex-station-road-barbers-phone" alt="Station Road's real Taplo design, with its haircut booking button and price menu" width={290} priority cropTo={610} frame="phone" fluid className="absolute -bottom-1 right-0 w-[48%] shadow-[0_28px_60px_-20px_rgb(20_45_62/0.4)]" />
            </div>
          </div>
          <div className="border-t border-[#142d3e]/15">
            <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 text-sm sm:px-8"><p className="text-[#53616a]">For the businesses that make our everyday.</p><ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold" aria-label="Businesses on Taplo"><li>Barbers</li><li>Detailers</li><li>Independent shops</li><li>Trades</li><li>Tutors</li><li>And yours.</li></ul></div>
          </div>
        </section>

        <BusinessStories />

        <section aria-labelledby="story-h" className="bg-[#e8eccc] text-[#20372d]">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <p className="text-sm font-semibold">Less back and forth. More getting on with it.</p>
            <h2 id="story-h" className="font-display font-display-tight mt-4 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.03] tracking-[-0.045em]">A price. A time.<br />You’re in the diary.</h2>
            <div className="mt-12"><BookingStory /></div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-[#20372d]/20 pt-7">
              <p className="max-w-xl text-sm leading-relaxed text-[#46594b]">Take bookings straight away, agree appointment requests first, or let customers ask for a quote. Choose what suits your business.</p>
              <ArrowLink href="/product/booking">Explore booking</ArrowLink>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div><p className="text-sm font-semibold text-signal">Everything in its place</p><h2 className="font-display font-display-tight mt-4 text-[clamp(2rem,4vw,3.75rem)] leading-[1.05] tracking-[-0.04em]">A proper home for<br />what you do.</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70">Put the useful things up front. Your services, your stock, your people and your work — with a clear next step for each.</p><div className="mt-7"><ArrowLink href="/product">See what your page can do</ArrowLink></div></div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {[
              ["Services and prices", "A simple price list or a menu with the detail. Fixed prices, starting prices and quotes.", "/product/services"],
              ["Products and vehicles", "Big photos, useful specifications and availability. Enquiries that keep the item attached.", "/product/vehicles"],
              ["People and pictures", "Introduce your team. Show the work you are proud of. Let customers take a closer look.", "/product/gallery-reviews"],
              ["A way to get in touch", "Useful social links, contact details and an enquiry form, right where people need them.", "/product/enquiries"],
            ].map(([title, body, href]) => <li key={href} className="border-t border-foreground/15 py-6"><Link href={href!} className="group block rounded outline-none focus-visible:ring-3 focus-visible:ring-signal/50"><h3 className="flex items-center justify-between gap-4 text-xl font-semibold tracking-tight">{title}<ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" /></h3><p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/65">{body}</p></Link></li>)}
          </ul>
        </section>

        {/* Strong static artwork: the code for the counter. */}
        <section className="bg-signal text-white">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 py-24 sm:py-32 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Found on the counter. Kept in their pocket.</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">One link for your bio, your messages and your next customer. Add a branded QR code to your counter, your van or your window, so people can get straight to your page.</p>
              <div className="mt-8"><Link href="/product/sharing" className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">Sharing and QR codes<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
            </Reveal>
            <div className="mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-4 sm:gap-8 lg:col-span-7 lg:mx-0 lg:ml-auto">
              <Shot id="share-image" alt="The share image: logo, name, a QR code with the Taplo mark, and the link" width={300} frame="none" className="w-full min-w-0" />
              <div className="min-w-0 rounded-[1.5rem] bg-white p-2.5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] sm:-mb-10 sm:rounded-[2rem] sm:p-4 [&>svg]:h-auto [&>svg]:w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: qr }} />
            </div>
          </div>
        </section>

        {/* Interactive: make it yours. */}
        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <Reveal><h2 className="font-display font-display-tight mb-14 max-w-3xl text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Start from a design. End up with your own.</h2></Reveal>
          <LookSwitcher />
        </section>

        <section aria-labelledby="setup-h" className="bg-[#f1eddf]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="text-sm font-semibold text-signal">Make a start</p><h2 id="setup-h" className="font-display font-display-tight mt-4 text-[clamp(2rem,4vw,3.75rem)] leading-[1.03] tracking-[-0.04em]">A few choices.<br />A page of your own.</h2>
              <ol className="mt-8 grid gap-6">{[["Tell us about your business", "Your name, what you do and how people should reach you."], ["Pick a look you like", "See your page take shape. Swap colours, photos and layouts as you go."], ["Add what you offer", "A service, a product or a vehicle. Start with one and build from there."]].map(([title, body], n) => <li key={title} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/25 text-sm font-semibold">{n + 1}</span><div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-foreground/65">{body}</p></div></li>)}</ol>
              <Link href={a.href} className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full bg-signal px-6 font-semibold text-white outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-signal/50">{a.label}<ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
            <div className="min-w-0"><Shot id="setup-3-design" alt="Choosing a starting design with a preview of your own page beside it" width={800} frame="browser" fluid className="w-full" /><p className="mt-4 text-sm text-foreground/60">Your preview changes as you make your choices.</p></div>
          </div>
        </section>

        <section aria-labelledby="film-h" className="bg-[#142d3e] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><h2 id="film-h" className="font-display font-display-tight max-w-xl text-[clamp(2rem,4vw,3.75rem)] leading-[1.03] tracking-[-0.04em]">See the whole picture.</h2><p className="max-w-sm text-white/70">The page, the choices and the small details that bring it together.</p></div><Film className="[&_figcaption]:text-white/70 [&_figcaption_span]:text-white" /></div>
        </section>

        <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8"><p className="max-w-3xl text-sm leading-relaxed text-foreground/60">{messagingPending ? "Booking confirmations and reminders switch on when you connect messaging. " : ""}Explore the frontend now; online payments and message delivery need their services connected. <Link href="/product/messages" className="underline underline-offset-4">See messaging details</Link>.</p></div>

        {/* Plans, briefly. */}
        <section className="mx-auto w-full max-w-7xl px-5 py-24 sm:py-32">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><h2 className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Start free. Upgrade when you need more.</h2><p className="mt-5 text-foreground/70">One price a month, no commission and no contract.</p><div className="mt-6"><ArrowLink href="/pricing">Compare every feature</ArrowLink></div></div>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10 lg:col-span-8">
              {PLAN_IDS.map((id) => (
                <li key={id} className="grid grid-cols-[minmax(0,1fr)] items-baseline gap-x-8 gap-y-1 py-6 sm:grid-cols-[8rem_1fr_auto]">
                  <p className="font-display text-3xl">{PLANS[id].name}</p>
                  <p className="text-foreground/70">{PLANS[id].summary}</p>
                  <p className="font-semibold tabular-nums">{PLANS[id].priceMinorGbp === 0 ? "£0" : `${formatMoney(PLANS[id].priceMinorGbp)} a month`}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-foreground px-7 py-12 text-background sm:px-12">
            <h2 className="font-display font-display-tight max-w-xl text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Give your business a page of its own.</h2>
            <Link href={a.href} className="inline-flex min-h-13 items-center rounded-xl bg-background px-6 text-base font-semibold text-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50">{a.label}</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
