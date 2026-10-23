import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { demoModeEnabled } from "@/lib/env"
import { INDUSTRIES } from "@/features/marketing/content"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { Shot } from "@/features/marketing/Shot"
import { ArrowLink } from "@/features/marketing/Scenes"

export const dynamic = "force-dynamic"
export function generateStaticParams() { return INDUSTRIES.map((i) => ({ slug: i.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const i = INDUSTRIES.find((x) => x.slug === slug)
  return i ? { title: `Taplo for ${i.nav.toLowerCase()}`, description: i.lead } : {}
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const i = INDUSTRIES.find((x) => x.slug === slug)
  if (!i) notFound()
  const demo = demoModeEnabled()
  return (
    <div className="bg-background">
      <SiteHeader active="/for" />
      <main>
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:pt-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-ink">{i.eyebrow}</p>
            <h1 className="font-display font-display-tight mt-4 text-[clamp(2.75rem,7vw,5.75rem)] text-balance">{i.title}</h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-foreground/70">{i.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="h-13 px-7 text-base"><Link href={demo ? "/onboarding" : "/pricing"}>Create your page</Link></Button><Button asChild size="lg" variant="outline" className="h-13 px-7 text-base"><Link href="/appearance">See the looks</Link></Button></div>
            <p className="mt-8 text-sm text-foreground/55">Starts with: {i.starts.join(" · ")}. Add or remove any of it.</p>
          </div>
          <div className="flex items-start justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
            {i.shots.slice(0, 2).map((s, n) => <Shot key={s.id + n} id={s.id} alt={s.alt} width={s.id.startsWith("hero") ? 336 : 328} cropTo={n === 0 ? 640 : 560} className={n === 1 ? "mt-14 hidden sm:block" : undefined} priority={n === 0} />)}
          </div>
        </section>
        <section className="border-t border-foreground/10 bg-[oklch(0.955_0.012_85)] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-5">
            <h2 className="font-display font-display-tight max-w-3xl text-[clamp(2rem,5vw,3.75rem)] text-balance">What it does for you</h2>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-foreground/10 md:grid-cols-3">
              {i.uses.map((u) => <li key={u.title} className="bg-background p-8"><h3 className="text-xl font-semibold tracking-[-0.025em]">{u.title}</h3><p className="mt-3 leading-relaxed text-foreground/70">{u.body}</p></li>)}
            </ul>
            <p className="mt-12 max-w-2xl border-l-2 border-signal pl-4 text-sm leading-relaxed text-foreground/70"><strong className="font-semibold text-foreground">Worth knowing. </strong>{i.caution}</p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">{INDUSTRIES.filter((x) => x.slug !== i.slug).map((x) => <ArrowLink key={x.slug} href={`/for/${x.slug}`}>{x.nav}</ArrowLink>)}</div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
