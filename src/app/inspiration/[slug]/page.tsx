import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { DesignPreview } from "@/features/inspiration/DesignPreview"
import { EXAMPLES, bySlug, describe } from "@/features/inspiration/examples"
import { INDUSTRY_FILTERS } from "@/features/marketing/ia"
import { UseDesign } from "@/features/inspiration/UseDesign"
import { BOOKING_WORDS } from "@/features/inspiration/wording"

export function generateStaticParams() { return EXAMPLES.map((e) => ({ slug: e.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = bySlug((await params).slug)
  return e ? { title: `${describe(e).lookName} — ${describe(e).name} | Taplo designs`, description: e.hook } : {}
}
export const dynamic = "force-dynamic"

export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const e = bySlug((await params).slug)
  if (!e) notFound()
  const f = describe(e)
  const industry = INDUSTRY_FILTERS.find((i) => i.id === e.industry)!
  const others = EXAMPLES.filter((x) => x.slug !== e.slug && x.industry !== e.industry).slice(0, 3)
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto w-full max-w-7xl px-5 pb-8 pt-8 sm:pt-12">
          <nav aria-label="Breadcrumb" className="text-sm text-foreground/60"><Link href="/inspiration" className="underline underline-offset-4">Designs</Link> <span aria-hidden="true" className="px-2">/</span><span>{f.lookName}</span></nav>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-16">
            <div>
              <h1 className="font-display font-display-tight text-[clamp(2.75rem,5.6vw,4.5rem)]">{f.lookName}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-foreground/70">{e.hook}</p>
              <p className="mt-3 text-sm text-foreground/60">Shown with {f.name} · <Link href={`/inspiration?industry=${e.industry}`} className="underline underline-offset-4">{industry.label}</Link></p>
            </div>
            <UseDesign slug={e.slug} lookId={f.lookId} lookName={f.lookName} overrides={f.overrides} />
          </div>
        </section>

        <section aria-label="Try this design" className="mx-auto w-full max-w-7xl px-5 pb-14">
          <DesignPreview scenario={e.scenario} name={f.name} />
        </section>

        <section className="border-y border-foreground/10 bg-[#f4f4f4] py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div>
              <h2 className="font-display text-3xl tracking-[-0.035em]">Make it work for you.</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/65">Keep the design. Bring your own name, photos and prices. Add the sections your customers need and leave out the rest.</p>
              <div className="mt-5 flex gap-2" aria-label="Design colours">{(["background", "surface", "accent", "text"] as const).map((k) => <span key={k} title={k} className="size-8 rounded-full border border-foreground/20" style={{ background: f.colors[k] }} />)}</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">In this example</h2>
              <ul className="mt-4 grid gap-3 border-y border-foreground/15 py-5 sm:grid-cols-3">{e.highlights.map((h) => <li key={h} className="text-base font-medium leading-snug">{h}</li>)}</ul>
              <p className="mt-5 text-sm leading-relaxed text-foreground/65">{BOOKING_WORDS[f.bookingMode]} Demonstration actions stay in your browser.</p>
              <details className="mt-5 border-t border-foreground/15 pt-3"><summary className="min-h-11 cursor-pointer py-2 font-medium">More about this design</summary><ul className="mt-3 grid gap-3 text-sm leading-relaxed text-foreground/65">{e.notes.map((n) => <li key={n}>{n}</li>)}</ul></details>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="font-display font-display-tight text-[clamp(1.75rem,3.5vw,2.75rem)]">Another way to make it yours.</h2><ArrowLink href="/inspiration">All designs</ArrowLink></div>
          <ul className="mt-8 grid gap-10 sm:grid-cols-3">
            {others.map((o) => { const g = describe(o); return (
              <li key={o.slug}><Link href={`/inspiration/${o.slug}`} className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/60">
                <div className="rounded-2xl bg-muted p-5"><Shot id={`ex-${g.assetSlug}-phone` as never} alt={`${g.name}'s page in the ${g.lookName} design`} width={220} cropTo={320} fluid className="mx-auto transition-transform group-hover:-translate-y-1 motion-reduce:transition-none" /></div>
                <h3 className="mt-4 font-display text-2xl">{g.lookName}</h3><p className="mt-1 text-sm leading-relaxed text-foreground/65">{o.hook}</p>
              </Link></li>
            ) })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
