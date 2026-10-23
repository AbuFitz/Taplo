import Link from "next/link"
import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { Shot } from "@/features/marketing/Shot"
import { INDUSTRY_FILTERS, type IndustryId } from "@/features/marketing/ia"
import { EXAMPLES, describe } from "@/features/inspiration/examples"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Inspiration | Taplo", description: "Seven fictional businesses, each built with the real Taplo page, each looking and working differently." }

export default async function InspirationPage({ searchParams }: { searchParams: Promise<{ industry?: string }> }) {
  const q = (await searchParams).industry
  const active = INDUSTRY_FILTERS.find((i) => i.id === q)?.id as IndustryId | undefined
  const list = EXAMPLES.filter((e) => !active || e.industry === active)
  const [lead, ...rest] = list
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto w-full max-w-7xl px-5 pb-6 pt-14 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">Inspiration</p>
          <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.25rem)] text-balance">Seven businesses. Seven different pages.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">Every example is a fictional business built with the real Taplo page. Look, type, layout and the content shown are all different, and all of it can be changed once it is yours.</p>
          <nav aria-label="Filter by kind of business" className="mt-9 flex flex-wrap gap-2">
            <Chip href="/inspiration" on={!active}>All</Chip>
            {INDUSTRY_FILTERS.map((i) => <Chip key={i.id} href={`/inspiration?industry=${i.id}`} on={active === i.id}>{i.label}</Chip>)}
          </nav>
        </section>

        {lead ? <Lead slug={lead.slug} /> : <p className="mx-auto max-w-7xl px-5 py-20 text-foreground/70">No examples for this kind of business yet. <Link className="underline" href="/inspiration">See them all</Link>.</p>}

        {rest.length ? (
          <section aria-label="More examples" className="mx-auto mt-6 w-full max-w-7xl px-5">
            <ul className="divide-y divide-foreground/10 border-t border-foreground/10">
              {rest.map((e, n) => {
                const f = describe(e)
                const flip = n % 2 === 1
                return (
                  <li key={e.slug} className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-12 md:grid-cols-12 md:gap-12">
                    <Link href={`/inspiration/${e.slug}`} aria-label={`${f.name}: open the example`} className={cn("group md:col-span-7", flip && "md:order-last")}>
                      <Shot id={`ex-${e.slug}-desk` as never} alt={`${f.name}'s page on a desktop screen`} width={760} frame="browser" className="w-full transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none" />
                    </Link>
                    <div className="md:col-span-5">
                      <p className="text-sm font-semibold text-foreground/55">{f.industryLabel}</p>
                      <h2 className="font-display font-display-tight mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)]">{f.name}</h2>
                      <p className="mt-3 text-lg leading-relaxed text-foreground/70">{e.hook}</p>
                      <p className="mt-5 text-sm text-foreground/60"><b className="font-semibold text-foreground">{f.lookName}</b> look · {f.heading.split(" — ")[0]} · {f.header} header</p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">{f.content.slice(0, 6).map((c) => <li key={c} className="rounded-full border border-foreground/12 px-2.5 py-1 text-xs text-foreground/70">{c}</li>)}</ul>
                      <div className="mt-7"><ArrowLink href={`/inspiration/${e.slug}`}>See {f.name}</ArrowLink></div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        <section className="mx-auto mt-16 w-full max-w-7xl px-5">
          <div className="rounded-3xl bg-foreground px-7 py-12 text-background sm:px-12">
            <h2 className="font-display font-display-tight max-w-2xl text-[clamp(1.75rem,4vw,3rem)]">None of these is a template.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-background/70">A café can use the loud look and a gym can use the quiet one. Pick whatever suits you, then change the colours, type, header, buttons and content.</p>
            <div className="mt-7"><Link href="/appearance" className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-background px-5 text-sm font-semibold text-foreground outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50">Try the looks on one business<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Chip({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return <Link href={href} aria-current={on ? "true" : undefined} className={cn("inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60", on ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40")}>{children}</Link>
}

function Lead({ slug }: { slug: string }) {
  const e = EXAMPLES.find((x) => x.slug === slug)!
  const f = describe(e)
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-muted px-5 pb-0 pt-10 sm:px-12 sm:pt-14">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-10 lg:grid-cols-12">
          <div className="pb-10 lg:col-span-5 lg:pb-16">
            <p className="text-sm font-semibold text-foreground/55">{f.industryLabel}</p>
            <h2 className="font-display font-display-tight mt-2 text-[clamp(2rem,4.4vw,3.5rem)]">{f.name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/70">{e.hook}</p>
            <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-2 text-[0.9375rem] text-foreground/75">{e.highlights.map((h) => <li key={h} className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />{h}</li>)}</ul>
            <div className="mt-8"><ArrowLink href={`/inspiration/${e.slug}`}>See {f.name}</ArrowLink></div>
          </div>
          <Link href={`/inspiration/${e.slug}`} aria-label={`${f.name}: open the example`} className="relative lg:col-span-7">
            <Shot id={`ex-${e.slug}-desk` as never} alt={`${f.name}'s page on a desktop screen`} width={820} frame="browser" priority className="w-full rounded-b-none" />
          </Link>
        </div>
      </div>
    </section>
  )
}
