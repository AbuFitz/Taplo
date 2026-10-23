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
    <footer className="mt-24 overflow-hidden bg-[#0a1020] text-white/80">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-16 lg:grid-cols-[1.2fr_2fr] lg:gap-24">
        <div className="max-w-sm">
          <p className="font-display font-display-tight text-[2.25rem] text-white">One page for your business.</p>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-white/65">Prices, people and a way to book, shared as a link or a QR code.</p>
          <Link href={a.href} className="mt-7 inline-flex min-h-11 items-center rounded-md bg-signal px-5 text-[0.9375rem] font-semibold text-white outline-none hover:bg-[#2b44ff] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020]">{a.label}</Link>
        </div>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
          <FooterColumn title="Product" links={FOOTER_PRODUCT} />
          <FooterColumn title="Explore" links={[{ href: "/inspiration", label: "Designs" }, { href: "/pricing", label: "Pricing" }, { href: "/how-it-works", label: "How setup works" }, { href: "/dashboard", label: "Log in" }]} />
          <FooterColumn title="Legal" links={[{ href: "/legal/privacy", label: "Privacy notice" }, { href: "/legal/terms", label: "Terms of service" }]} />
        </div>
      </div>
      {/* The wordmark at the width of the page, cut by the footer's edge: the footer's one large gesture. */}
      <div aria-hidden="true" className="relative mx-auto aspect-[1000/312] w-[min(100%,84rem)] overflow-hidden px-0">
        <div className="aspect-[1000/390] w-full bg-signal [mask:url(/logo/taplo-wordmark-white.svg)_center_top/100%_100%_no-repeat] [-webkit-mask:url(/logo/taplo-wordmark-white.svg)_center_top/100%_100%_no-repeat]" />
      </div>
      <div className="relative border-t border-white/10 bg-[#0a1020]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-sm text-white/50">
          <p>Businesses shown on this site are examples.</p>
          <p className="flex gap-5"><Link href="/legal/privacy" className="hover:text-white">Privacy</Link><Link href="/legal/terms" className="hover:text-white">Terms</Link></p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[0.9375rem] font-semibold text-white">{title}</h2>
      <ul className="mt-3 grid gap-0.5">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center rounded text-[0.9375rem] text-white/65 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">{l.label}</Link></li>)}
      </ul>
    </nav>
  )
}
