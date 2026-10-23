import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Check, Clock } from "lucide-react"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { ArrowLink } from "@/features/marketing/Scenes"
import { SCENES } from "@/features/marketing/ProductScenes"
import { PRODUCT_PAGES, pageBySlug, resolveStatus } from "@/features/marketing/product"

export function generateStaticParams() { return PRODUCT_PAGES.map((p) => ({ slug: p.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = pageBySlug((await params).slug)
  return p ? { title: `${p.label} | Taplo`, description: p.lead } : {}
}
export const dynamic = "force-dynamic"

export default async function ProductPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const p = pageBySlug((await params).slug)
  if (!p) notFound()
  const Scene = SCENES[p.slug]
  const a = primaryAction()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto w-full max-w-7xl px-5 pb-12 pt-14 sm:pt-20">
          <nav aria-label="Breadcrumb" className="text-sm text-foreground/55"><Link href="/product" className="hover:text-foreground">Product</Link></nav>
          <h1 className="font-display font-display-tight mt-6 max-w-4xl text-[clamp(2rem,4.6vw,3.5rem)] text-balance">{p.title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">{p.lead}</p>
        </section>
        <section className="mx-auto w-full max-w-7xl px-5 pb-20"><Scene /></section>

        <section className="border-y border-foreground/10 bg-muted py-16">
          <div className="mx-auto grid grid-cols-[minmax(0,1fr)] w-full max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_2fr]">
            <div><h2 className="font-display font-display-tight text-[clamp(1.5rem,3vw,2rem)]">What you get</h2><p className="mt-3 text-[0.9375rem] text-foreground/65">A tick works today. A clock switches on when the service it needs is connected.</p></div>
            <ul className="divide-y divide-foreground/10" data-testid="status">
              {resolveStatus(p.status).map((s) => (
                <li key={s.label} className="flex gap-3 py-3.5">
                  {s.state === "works" ? <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" /> : <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-700" />}
                  <div><p className="font-medium"><span className="sr-only">{s.state === "works" ? "Works today: " : "Needs a connection: "}</span>{s.label}</p>{s.note ? <p className="mt-0.5 text-sm text-foreground/60">{s.note}</p> : null}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><h2 className="font-display font-display-tight text-[clamp(1.75rem,3.5vw,2.75rem)]">Works with</h2>
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">{p.related.map((r) => { const x = pageBySlug(r)!; return <li key={r}><ArrowLink href={`/product/${r}`}>{x.label}</ArrowLink></li> })}</ul></div>
            <Link href={a.href} className="inline-flex min-h-12 items-center rounded-xl bg-foreground px-6 text-base font-semibold text-background outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60">{a.label}</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
