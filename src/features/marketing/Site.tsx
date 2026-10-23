import Link from "next/link"
import { TaploLogo } from "@/components/taplo/brand"
import { demoModeEnabled } from "@/lib/env"
import { INDUSTRY_FILTERS, PRODUCT_LINKS } from "./ia"
import { SiteNav } from "./SiteNav"

/** Primary action label and destination, shared by the header, hero and footer so they never disagree. */
export function primaryAction() {
  const demo = demoModeEnabled()
  return { label: "Make your Taplo", href: demo ? "/onboarding" : "/pricing", demo }
}

/** Header for every Taplo marketing page. `active` is accepted for older callers; the nav reads the path itself. */
export function SiteHeader(_props: { active?: string } = {}) {
  const a = primaryAction()
  return <SiteNav cta={a.label} ctaHref={a.href} loginHref="/dashboard" />
}

export function SiteFooter() {
  const a = primaryAction()
  return (
    <footer className="mt-24 bg-[oklch(0.17_0.01_70)] text-white/80">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-12 pt-16 lg:grid-cols-[1.3fr_2.2fr]">
        <div>
          <TaploLogo tone="light" className="h-14 -ml-4" />
          <p className="mt-5 max-w-xs text-[1.0625rem] leading-relaxed text-white/70">One page for your business. What you do, what it costs, and a clear way to book or ask.</p>
          <Link href={a.href} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-black outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-white/50">{a.label}</Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <FooterColumn title="Product" links={[...PRODUCT_LINKS.map((l) => ({ href: l.href, label: l.label })), { href: "/product", label: "Everything Taplo does" }]} />
          <FooterColumn title="Inspiration" links={[...INDUSTRY_FILTERS.map((i) => ({ href: `/inspiration?industry=${i.id}`, label: i.label })), { href: "/inspiration", label: "All examples" }]} />
          <FooterColumn title="Taplo" links={[{ href: "/how-it-works", label: "How setup works" }, { href: "/pricing", label: "Pricing" }, { href: "/appearance", label: "Try the looks" }, { href: "/dashboard", label: "Log in" }]} />
          <FooterColumn title="Legal" links={[{ href: "/legal/privacy", label: "Privacy notice" }, { href: "/legal/terms", label: "Terms of service" }]} note="The approved legal text and company details will be published here before launch." />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 text-xs text-white/50">
          <p>{a.demo ? "Taplo is in preview. Pages you make here stay in your browser and are not public." : "Taplo is in preview."}</p>
          <p>Example businesses on this site are fictional.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, note }: { title: string; links: { href: string; label: string }[]; note?: string }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{title}</h2>
      <ul className="mt-4 grid gap-0.5">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/50">{l.label}</Link></li>)}
      </ul>
      {note ? <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-white/45">{note}</p> : null}
    </nav>
  )
}
