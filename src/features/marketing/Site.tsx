import Link from "next/link"
import { TaploLogo } from "@/components/taplo/brand"
import { Button } from "@/components/ui/button"
import { demoModeEnabled } from "@/lib/env"
import { FEATURES, INDUSTRIES } from "./content"

const NAV = [
  { href: "/features/make-it-yours", label: "Features", match: "/features" },
  { href: "/for/barbers-and-salons", label: "Industries", match: "/for" },
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/appearance", label: "Try the looks", match: "/appearance" },
]

/** Header for every Taplo marketing page. Server component: navigation works without JavaScript. */
export function SiteHeader({ active }: { active?: string }) {
  const demo = demoModeEnabled()
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5">
        <Link href="/" aria-label="Taplo home" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60"><TaploLogo /></Link>
        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active === n.match ? "page" : undefined} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 aria-[current=page]:text-foreground">{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {demo ? <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link href="/dashboard">Dashboard</Link></Button> : null}
          <Button asChild size="sm"><Link href={demo ? "/onboarding" : "/pricing"}>Create your page</Link></Button>
          <details className="group relative md:hidden">
            <summary aria-label="Menu" className="grid size-11 cursor-pointer list-none place-items-center rounded-lg outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
              <span className="grid gap-[5px]" aria-hidden="true"><i className="block h-0.5 w-5 bg-foreground transition-transform group-open:translate-y-[7px] group-open:rotate-45" /><i className="block h-0.5 w-5 bg-foreground transition-opacity group-open:opacity-0" /><i className="block h-0.5 w-5 bg-foreground transition-transform group-open:-translate-y-[7px] group-open:-rotate-45" /></span>
            </summary>
            <nav aria-label="Menu" className="absolute right-0 top-12 z-50 grid w-64 gap-1 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
              {NAV.map((n) => <Link key={n.href} href={n.href} className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium hover:bg-foreground/5">{n.label}</Link>)}
              {demo ? <Link href="/dashboard" className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium hover:bg-foreground/5">Dashboard</Link> : null}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[oklch(0.17_0.01_70)] text-white/80">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <TaploLogo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">One page for everything your business does. Services, products, stock, reviews and a clear way to get in touch.</p>
        </div>
        <FooterColumn title="Features" links={FEATURES.map((f) => ({ href: `/features/${f.slug}`, label: f.nav }))} />
        <FooterColumn title="Industries" links={INDUSTRIES.map((i) => ({ href: `/for/${i.slug}`, label: i.nav }))} />
        <FooterColumn title="Taplo" links={[{ href: "/how-it-works", label: "How it works" }, { href: "/pricing", label: "Pricing" }, { href: "/appearance", label: "Try the looks" }, { href: "/legal/privacy", label: "Privacy" }, { href: "/legal/terms", label: "Terms" }]} />
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-7xl px-5 py-6 text-xs text-white/50">Taplo is in preview. Pages you build here are stored in your browser and are not public. Booking, payments and accounts are not connected yet.</p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{title}</h2>
      <ul className="mt-4 grid gap-1">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/50">{l.label}</Link></li>)}
      </ul>
    </nav>
  )
}
