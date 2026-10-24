import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Shot } from "../Shot"

const BUSINESSES = [
  { name: "Station Road Barbers", kind: "The local barber", line: "Your next haircut, sorted.", detail: "Prices, people and a place in the diary.", slug: "station-road-barbers", shot: "ex-station-road-barbers-phone", image: "/taplo-demo/station-road-barber-work.png", alt: "Illustrative barber at work in a local shop", position: "80% center", colour: "#e8eccc" },
  { name: "Parkside Valeting", kind: "The detailer", line: "Show the care that goes in.", detail: "Good work, clear packages and appointment requests.", slug: "parkside-valeting", shot: "ex-parkside-valeting-phone", image: "/taplo-demo/stillwater-hero.png", alt: "Illustrative blue car being carefully detailed", position: "60% center", colour: "#dce6ed" },
  { name: "Brookfield Motors", kind: "The independent forecourt", line: "The right car. All the details.", detail: "Current stock, useful specifications and viewing requests.", slug: "brookfield-motors", shot: "ex-brookfield-motors-phone", image: "/taplo-demo/brookfield-golf.png", alt: "Illustrative Volkswagen Golf on a small UK forecourt", position: "center", colour: "#e4e6d8" },
] as const

/** Scenes pair original illustrative business photography with captures of the actual shared page renderer. */
export function BusinessStories() {
  return <section aria-labelledby="businesses-h" className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 sm:py-28">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="text-sm font-semibold text-signal">One Taplo. Your kind of business.</p><h2 id="businesses-h" className="font-display font-display-tight mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4.25rem)] leading-[1.03] tracking-[-0.045em]">Feels like you.<br />Works for your customers.</h2></div><Link href="/inspiration" className="inline-flex min-h-11 items-center gap-3 font-semibold underline underline-offset-4">Explore the designs<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
    <ul className="grid gap-x-7 gap-y-12 md:grid-cols-3">
      {BUSINESSES.map(b => <li key={b.slug} className="min-w-0"><Link href={`/inspiration/${b.slug}`} className="group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-signal/50 focus-visible:ring-offset-4">
        <div className="relative isolate aspect-[0.96] overflow-hidden rounded-2xl" style={{ background: b.colour }}>
          <Image src={b.image} alt={b.alt} width={1536} height={1024} sizes="(min-width: 768px) 29vw, 90vw" className="absolute left-0 top-0 h-[70%] w-full object-cover" style={{ objectPosition: b.position }} />
          <p className="absolute bottom-[10%] left-[7%] w-[35%] font-display text-[clamp(1.25rem,2.1vw,2rem)] leading-[1.05] tracking-tight">{b.line}</p>
          <Shot id={b.shot} alt={`${b.name} in the Taplo page designer`} width={270} cropTo={510} frame="phone" fluid className="absolute -bottom-[6%] right-[6%] w-[48%] shadow-[0_20px_30px_-15px_rgb(0_0_0/0.4)] transition-transform duration-300 group-hover:-translate-y-2 motion-reduce:transition-none" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/65">{b.kind}</p><h3 className="mt-2 flex items-center justify-between gap-3 text-xl font-semibold tracking-tight">{b.name}<ArrowUpRight aria-hidden="true" className="size-5 shrink-0" /></h3><p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-foreground/65">{b.detail}</p>
      </Link></li>)}
    </ul><p className="mt-7 text-xs text-foreground/65">Fictional businesses, working example pages. Make any design your own.</p>
  </section>
}
