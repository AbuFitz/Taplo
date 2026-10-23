import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { LivePhone } from "@/features/inspiration/LivePhone"
import { EXAMPLES, bySlug, describe } from "@/features/inspiration/examples"
import { INDUSTRY_FILTERS } from "@/features/marketing/ia"
import { UseDesign } from "@/features/inspiration/UseDesign"
import { BOOKING_WORDS } from "@/features/inspiration/wording"

export function generateStaticParams() { return EXAMPLES.map((e) => ({ slug: e.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = bySlug((await params).slug)
  return e ? { title: `${describe(e).name} | Taplo inspiration`, description: e.hook } : {}
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
        <section className="mx-auto w-full max-w-7xl px-5 pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm text-foreground/55"><Link href="/inspiration" className="hover:text-foreground">Designs</Link> <span aria-hidden="true">/</span> <Link href={`/inspiration?industry=${e.industry}`} className="hover:text-foreground">{industry.label}</Link></nav>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="font-display font-display-tight text-[clamp(2.5rem,6vw,5rem)] text-balance">{f.name}</h1>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-foreground/70">{e.hook} {f.tagline}</p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <UseDesign slug={e.slug} lookId={f.lookId} lookName={f.lookName} />
              <p className="mt-3 text-sm text-foreground/55">Shown with a fictional business. Every part can be changed.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid grid-cols-[minmax(0,1fr)] w-full max-w-7xl gap-10 px-5 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="sr-only">On a desktop</h2>
            <Shot id={`ex-${e.slug}-desk` as never} alt={`${f.name}'s page on a desktop screen`} width={900} frame="browser" priority className="w-full" />
            <p className="mt-3 text-sm text-foreground/55">The same page on a laptop. On a phone it is always one column.</p>
            <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 border-t border-foreground/10 pt-8 sm:grid-cols-3">{e.highlights.map((h) => <li key={h} className="text-[0.9375rem] font-medium leading-snug">{h}</li>)}</ul>
          </div>
          <div className="lg:col-span-5">
            <h2 className="mb-3 text-lg font-semibold">Try it. It is the real page.</h2>
            <LivePhone scenario={e.scenario} title={`${f.name}, live`} />
          </div>
        </section>

        <section className="border-y border-foreground/10 bg-muted py-16">
          <div className="mx-auto grid grid-cols-[minmax(0,1fr)] w-full max-w-7xl gap-12 px-5 md:grid-cols-3">
            <div>
              <h2 className="text-lg font-semibold">What is on the page</h2>
              <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2">{f.content.map((c) => <li key={c} className="text-lg font-medium">{c}</li>)}</ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">What makes it different</h2>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[0.9375rem]">
                <dt className="text-foreground/55">Look</dt><dd className="font-medium">{f.lookName}. {f.lookBlurb}</dd>
                <dt className="text-foreground/55">Headings</dt><dd className="font-medium">{f.heading}</dd>
                <dt className="text-foreground/55">Body text</dt><dd className="font-medium">{f.body}</dd>
                <dt className="text-foreground/55">Header</dt><dd className="font-medium capitalize">{f.header}</dd>
                <dt className="text-foreground/55">Density</dt><dd className="font-medium capitalize">{f.density}</dd>
                <dt className="text-foreground/55">On a laptop</dt><dd className="font-medium capitalize">{f.desktop}</dd>
                <dt className="text-foreground/55">Colours</dt><dd className="flex gap-1.5">{(["background", "surface", "accent", "text"] as const).map((k) => <span key={k} title={k} className="size-6 rounded-full border border-foreground/15" style={{ background: f.colors[k] }} />)}</dd>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-semibold">The thinking</h2>
              <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 text-[0.9375rem] leading-relaxed text-foreground/80">{e.notes.map((n) => <li key={n}>{n}</li>)}<li>{BOOKING_WORDS[f.bookingMode]}</li></ul>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="font-display font-display-tight text-[clamp(1.75rem,3.5vw,2.75rem)]">More to look at</h2><ArrowLink href="/inspiration">All examples</ArrowLink></div>
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-3">
            {others.map((o) => { const g = describe(o); return (
              <li key={o.slug}><Link href={`/inspiration/${o.slug}`} className="group block rounded-2xl border border-foreground/10 p-5 outline-none transition-colors hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/60"><p className="text-sm text-foreground/55">{g.industryLabel}</p><p className="mt-1 text-xl font-semibold tracking-[-0.02em]">{g.name}</p><p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/65">{o.hook}</p></Link></li>
            ) })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
