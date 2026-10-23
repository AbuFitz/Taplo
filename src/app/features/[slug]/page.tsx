import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { demoModeEnabled } from "@/lib/env"
import { FEATURES } from "@/features/marketing/content"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { Shot } from "@/features/marketing/Shot"
import { YoursScene } from "@/features/marketing/YoursScene"
import { ArrowLink } from "@/features/marketing/Scenes"

export const dynamic = "force-dynamic"
export function generateStaticParams() { return FEATURES.map((f) => ({ slug: f.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const f = FEATURES.find((x) => x.slug === slug)
  return f ? { title: `${f.eyebrow} | Taplo`, description: f.lead } : {}
}

function Visual({ slug }: { slug: string }) {
  if (slug === "make-it-yours") return <YoursScene />
  if (slug === "services-and-enquiries")
    return <div className="flex flex-wrap items-start justify-center gap-8"><Shot id="cap-services" alt="A grouped price menu" width={368} /><Shot id="cap-fixed-prices" alt="Fixed price cards for a plumber" width={368} cropTo={640} className="sm:mt-16" /></div>
  if (slug === "products-and-stock")
    return <div className="flex flex-wrap items-start justify-center gap-8"><Shot id="cap-vehicles" alt="Vehicle cards with price and specifications" width={368} cropTo={720} /><Shot id="cap-product" alt="A product card with size and scent" width={368} className="sm:mt-16" /></div>
  return <div className="mx-auto max-w-4xl"><Shot id="desk-barber" alt="A barber's page on a desktop screen" width={900} frame="browser" /></div>
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const f = FEATURES.find((x) => x.slug === slug)
  if (!f) notFound()
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <SiteHeader active="/features" />
      <main>
        <section className="mx-auto w-full max-w-5xl px-5 pb-16 pt-16 text-center sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">{f.eyebrow}</p>
          <h1 className="font-display font-display-tight mt-4 text-[clamp(2.75rem,8vw,6.25rem)] text-balance">{f.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">{f.lead}</p>
          <div className="mt-8"><Button asChild size="lg" className="h-13 px-7 text-base"><Link href={demo ? "/onboarding" : "/pricing"}>Create your page</Link></Button></div>
        </section>
        <section className="mx-auto w-full max-w-7xl px-5 pb-20"><Visual slug={f.slug} /></section>
        <section className="border-t border-foreground/10 bg-[oklch(0.955_0.012_85)] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-5">
            <ul className="grid gap-x-12 gap-y-12 md:grid-cols-2">
              {f.points.map((p, n) => (
                <li key={p.title} className="grid grid-cols-[3.5rem_1fr] gap-4">
                  <span className="font-display text-3xl tabular-nums text-foreground/25">{String(n + 1).padStart(2, "0")}</span>
                  <div><h2 className="text-xl font-semibold tracking-[-0.025em]">{p.title}</h2><p className="mt-2 leading-relaxed text-foreground/70">{p.body}</p></div>
                </li>
              ))}
            </ul>
            <p className="mt-14 max-w-2xl border-l-2 border-signal pl-4 text-sm leading-relaxed text-foreground/70"><strong className="font-semibold text-foreground">Worth knowing. </strong>{f.note}</p>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">{FEATURES.filter((x) => x.slug !== f.slug).map((x) => <ArrowLink key={x.slug} href={`/features/${x.slug}`}>{x.nav}</ArrowLink>)}</div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
