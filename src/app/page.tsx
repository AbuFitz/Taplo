import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { Film } from "@/features/marketing/Film"
import { LivePhone } from "@/features/inspiration/LivePhone"
import { LookSwitcher } from "@/features/marketing/home/LookSwitcher"
import { Reveal } from "@/features/marketing/home/Reveal"
import { taploCodeSvg } from "@/features/qr/taplo-code"
import { featureState } from "@/lib/feature-status"
import { cn } from "@/lib/utils"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

/** What a customer meets, in the order a page is used: one swipeable row, each item a real capture of the page renderer. */
const ROW = [
  { id: "team-swipe", w: 300, title: "Meet the team", body: "Names, faces, a short bio and a button to book with each person.", href: "/product/team", alt: "Team cards in a swipeable row" },
  { id: "cap-vehicles", w: 300, crop: 560, title: "Stock with the facts", body: "Year, mileage, fuel and gearbox first, then the price. Reserved and sold cars say so.", href: "/product/vehicles", alt: "A list of cars with specifications and prices" },
  { id: "prod-swipe", w: 300, title: "Products and links", body: "Sell your own, or recommend one with a link that says it is an affiliate link.", href: "/product/products", alt: "Products in a swipeable row" },
  { id: "gal-lightbox", w: 420, title: "Photos that open large", body: "Arrows, zoom and captions, on a phone or a keyboard.", href: "/product/gallery-reviews", alt: "A photo open in a full-screen viewer" },
  { id: "svc-detail", w: 420, title: "Prices with detail", body: "Price, length and who does it, one tap from the menu.", href: "/product/services", alt: "A service detail with price, duration and the people who provide it" },
  { id: "rev-quote", w: 300, title: "Reviews with a source", body: "Real words, with where they came from.", href: "/product/gallery-reviews", alt: "A customer review with its source" },
] as const

const BUBBLES = [
  { live: featureState("textApp") === "works", text: "Hi Marlowe & Finch, I’d like to ask about your services.", side: "out", cap: "Text us. Opens the customer’s own messages app." },
  { live: featureState("appointmentMessages") === "works", text: "Confirmed: Signature cut with Jonah, Thursday at 10:30.", side: "in", cap: "Appointment messages." },
  { live: featureState("reminders") === "works", text: "Reminder: Signature cut tomorrow at 10:30. Reply to change it.", side: "in", cap: "Reminders." },
] as const

export default function Home() {
  const a = primaryAction()
  const qr = taploCodeSvg("https://taplo.example/marlowe-and-finch", 320, "A Taplo QR code")
  const anyPending = BUBBLES.some((b) => !b.live)
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        {/* Hero: three real pages, three identities, at a size where the words can be read. */}
        <section className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-12 sm:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="font-display font-display-tight text-[clamp(2.5rem,4.6vw,4rem)] text-balance">Everything your customers ask, on one page.</h1>
            <p className="mt-6 max-w-lg text-xl leading-relaxed text-foreground/70">Prices, people, products and a way to book or enquire, on a page that looks like yours. Choose a design, add what you offer, share a link.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={a.href} className="inline-flex min-h-12 items-center rounded-xl bg-foreground px-6 text-base font-semibold text-background outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60">{a.label}</Link>
              <Link href="/inspiration" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-foreground/20 px-5 text-base font-semibold outline-none hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/60">See designs<ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
          </div>
          <div className="relative lg:col-span-7" aria-label="Three example pages: a barber, a café and a maths tutor">
            <div className="mx-auto flex max-w-[44rem] items-start justify-center gap-4 sm:gap-5">
              <Shot id="ex-marlowe-and-finch-phone" alt="A barber's page: dark, with a bright Book your chair button" width={250} priority cropTo={500} frame="none" className="w-[34%] sm:w-[250px]" />
              <Shot id="ex-pims-kitchen-phone" alt="A café's page: warm terracotta with a photograph of brunch" width={250} priority cropTo={500} frame="none" className="mt-12 w-[34%] sm:mt-16 sm:w-[250px]" />
              <Shot id="ex-ada-okafor-maths-phone" alt="A maths tutor's page: soft green with a free trial lesson" width={250} priority cropTo={500} frame="none" className="mt-4 hidden w-[250px] sm:block" />
            </div>
          </div>
        </section>

        {/* The short film. Asked for, never autoplayed. */}
        <section aria-labelledby="film-h" className="bg-foreground py-16 text-background sm:py-24">
          <div className="mx-auto w-full max-w-5xl px-5">
            <Reveal><h2 id="film-h" className="font-display font-display-tight mb-8 text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">From a name to a shared page in fifteen seconds.</h2></Reveal>
            <Film className="[&_figcaption]:text-background/60 [&_figcaption_span]:text-background" />
          </div>
        </section>

        {/* Interactive: the real page, running. */}
        <section className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Customers see prices first, then pick a time.</h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/70">This is a working page for an example barber. Open a service, meet the team, choose a time. Yours does the same with your own services.</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2"><ArrowLink href="/product/services">Services and prices</ArrowLink><ArrowLink href="/product/booking">Booking</ArrowLink></div>
            </Reveal>
          </div>
          <div className="lg:col-span-6"><LivePhone scenario="barber" title="Marlowe & Finch, live" /></div>
        </section>

        {/* Swipeable: what a page can hold. */}
        <section aria-labelledby="row-h" className="border-y border-foreground/10 bg-muted py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <Reveal><h2 id="row-h" className="font-display font-display-tight max-w-3xl text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">One page, whatever you sell.</h2></Reveal>
          </div>
          <ul className="mt-14 flex snap-x snap-mandatory scroll-px-5 gap-8 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]" aria-label="What a page can hold" tabIndex={0}>
            {ROW.map((r, n) => (
              <li key={r.id} className={cn("shrink-0 snap-start", n % 2 === 1 && "mt-12")} style={{ width: r.w }}>
                <Link href={r.href} className="group block outline-none">
                  <Shot id={r.id} alt={r.alt} width={r.w} frame="none" cropTo={"crop" in r ? r.crop : undefined} className="transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none" />
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{r.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-foreground/65">{r.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Messages, each one called what it is. */}
        <section className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 py-24 sm:py-32 lg:grid-cols-12">
          <div className="order-last lg:order-first lg:col-span-6">
            <ol className="grid gap-5" aria-label="Examples of messages">
              {BUBBLES.map((b) => (
                <li key={b.cap} className={cn("max-w-md", b.side === "out" ? "justify-self-end" : "justify-self-start")}>
                  <p className={cn("rounded-3xl px-5 py-4 text-[1.0625rem] leading-relaxed", b.side === "out" ? "rounded-br-md bg-signal text-white" : "rounded-bl-md bg-foreground/[0.07]")}>{b.text}</p>
                  <p className={cn("mt-2 text-sm text-foreground/55", b.side === "out" && "text-right")}>{b.cap}</p>
                </li>
              ))}
            </ol>
          </div>
          <Reveal className="lg:col-span-6">
            <h2 className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Customers can text you in one tap.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/70">A Text us button opens their own messages app with a note ready to send. Questions arrive as enquiries and bookings as bookings.{anyPending ? " Confirmations and reminders switch on when you connect messaging." : " Confirmations and reminders go out on their own."}</p>
            <div className="mt-8"><ArrowLink href="/product/messages">Messages and reminders</ArrowLink></div>
          </Reveal>
        </section>

        {/* Strong static artwork: the code for the counter. */}
        <section className="bg-signal text-white">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 py-24 sm:py-32 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">A code for the counter, the van and the window.</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">Download a clean QR code for print or screen, on white or transparent, with your logo or ours in the middle. Or post a designed card with your name, link and code.</p>
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

        {/* Setup. */}
        <section aria-labelledby="setup-h" className="border-y border-foreground/10 bg-muted py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5">
            <Reveal className="max-w-2xl"><h2 id="setup-h" className="font-display font-display-tight text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Live in a few minutes.</h2><p className="mt-6 text-lg leading-relaxed text-foreground/70">Name it, say what you do and how people should reach you, choose a design, add your first service. Your page takes shape beside you as you go.</p></Reveal>
            <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-14">
              {(["setup-2-what", "setup-3-design", "setup-4-first"] as const).map((id, n) => (
                <Reveal key={id} delay={n * 80} className={cn("grid grid-cols-[minmax(0,1fr)] items-center gap-6 md:grid-cols-12", n === 1 && "md:[&>*:first-child]:order-last")}>
                  <div className="md:col-span-4"><p className="font-display text-5xl tabular-nums text-foreground/15">{n + 2}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{["Say what you do", "Choose a design", "Add your first service"][n]}</p><p className="mt-2 text-foreground/65">{["Pick your kind of business and what people should do first.", "Each one shown on a real page. Change any of it later.", "A name and a price. Your page fills in as you type."][n]}</p></div>
                  <div className="md:col-span-8"><Shot id={id} alt={["Choosing what you do and what people should do first", "Choosing a design while your own page takes shape beside it", "Adding a first service while the page fills in beside it"][n]!} width={760} frame="none" className="w-full" /></div>
                </Reveal>
              ))}
            </div>
            <div className="mt-14"><Link href={a.href} className="inline-flex min-h-12 items-center rounded-xl bg-foreground px-6 text-base font-semibold text-background outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60">{a.label}</Link></div>
          </div>
        </section>

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
            <h2 className="font-display font-display-tight max-w-xl text-[clamp(1.875rem,3.6vw,2.75rem)] text-balance">Make your Taplo in a few minutes.</h2>
            <Link href={a.href} className="inline-flex min-h-13 items-center rounded-xl bg-background px-6 text-base font-semibold text-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50">{a.label}</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
