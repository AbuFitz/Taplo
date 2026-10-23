import Link from "next/link"
import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { PRODUCT_GROUPS } from "@/features/marketing/ia"
import { pageBySlug } from "@/features/marketing/product"

export const metadata: Metadata = { title: "Product | Taplo", description: "Everything a Taplo page can do, and what is connected today." }
export const dynamic = "force-dynamic"

export default function ProductIndex() {
  const a = primaryAction()
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 py-14 sm:py-20">
        <h1 className="font-display font-display-tight mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.25rem)] text-balance">What goes on a Taplo page.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-foreground/70">Nine things, each shown working. Every page says what you can use today and what still needs a connection.</p>
        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-16">
          {PRODUCT_GROUPS.map((g) => (
            <section key={g.title} aria-labelledby={`g-${g.title}`} className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-foreground/10 pt-8 md:grid-cols-[14rem_1fr]">
              <h2 id={`g-${g.title}`} className="text-lg font-semibold">{g.title}</h2>
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-1">
                {g.links.map((l) => {
                  const p = pageBySlug(l.href.split("/").pop()!)!
                  return (
                    <li key={l.href}>
                      <Link href={l.href} className="group grid grid-cols-[minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 rounded-2xl px-4 py-5 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:ring-3 focus-visible:ring-ring/60 sm:grid-cols-[1fr_auto]">
                        <span className="font-display font-display-tight text-[clamp(1.5rem,3vw,2.25rem)]">{l.label}</span>
                        <ArrowUpRight aria-hidden="true" className="hidden size-6 text-foreground/30 transition-colors group-hover:text-foreground sm:block" />
                        <span className="max-w-2xl text-foreground/65">{p.lead}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-20"><Link href={a.href} className="inline-flex min-h-12 items-center rounded-full bg-foreground px-6 text-base font-semibold text-background hover:opacity-90">{a.label}</Link></div>
      </main>
      <SiteFooter />
    </div>
  )
}
