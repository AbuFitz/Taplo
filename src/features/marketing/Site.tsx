import Link from "next/link"
import { TaploLogo } from "@/components/taplo/brand"
import { demoModeEnabled } from "@/lib/env"
import { SiteNav } from "./SiteNav"

/** Primary action label and destination, shared by the header, hero and footer so they never disagree. */
export function primaryAction() {
  const demo = demoModeEnabled()
  return { label: "Make your Taplo", href: demo ? "/onboarding" : "/pricing", demo }
}

/** Header for every Taplo marketing page. `active` is accepted for older callers; the nav reads the path itself. */
export function SiteHeader() {
  const a = primaryAction()
  return <SiteNav cta={a.label} ctaHref={a.href} loginHref="/dashboard" />
}

const FOOTER_PRODUCT = [
  { href: "/product/services", label: "Services and prices" },
  { href: "/product/booking", label: "Booking" },
  { href: "/product/team", label: "Team profiles" },
  { href: "/product/products", label: "Products and stock" },
  { href: "/product/messages", label: "Messages" },
  { href: "/product/sharing", label: "Sharing and QR codes" },
  { href: "/product", label: "Everything a page can do" },
]

export function SiteFooter() {
  const a = primaryAction()
  return (
    <footer className="mt-24 bg-[oklch(0.15_0.012_264)] text-white/80">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-14 pt-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        <div className="max-w-sm">
          <TaploLogo variant="lockup" tone="light" className="-ml-4 h-14" />
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/70">One page for your business: what you do, what it costs, and a clear way to book or ask.</p>
          <Link href={a.href} className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-black outline-none hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-white/50">{a.label}</Link>
        </div>
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-3">
          <FooterColumn title="Product" links={FOOTER_PRODUCT} />
          <FooterColumn title="Explore" links={[{ href: "/inspiration", label: "Designs" }, { href: "/pricing", label: "Pricing" }, { href: "/how-it-works", label: "How setup works" }, { href: "/dashboard", label: "Log in" }]} />
          <FooterColumn title="Legal" links={[{ href: "/legal/privacy", label: "Privacy notice" }, { href: "/legal/terms", label: "Terms of service" }]} />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 text-xs text-white/50">
          <p>Businesses shown on this site are examples.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-3 grid gap-0.5">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center rounded text-sm text-white/65 outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/50">{l.label}</Link></li>)}
      </ul>
    </nav>
  )
}
