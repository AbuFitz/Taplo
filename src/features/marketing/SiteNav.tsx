"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, NavigationMenu } from "radix-ui"
import { ArrowUpRight, ChevronDown, Plus, X } from "lucide-react"
import { TaploLogo } from "@/components/taplo/brand"
import { cn } from "@/lib/utils"
import { dashboardDestination } from "@/lib/domains"
import { PRODUCT_GROUPS, INDUSTRY_FILTERS } from "./ia"

const subscribeHost = () => () => {}

const ink = "inline-flex min-h-11 items-center gap-1.5 rounded px-3 text-sm text-white/65 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white data-[state=open]:text-white aria-[current=page]:text-white"
const primary = "inline-flex min-h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-black outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
const INDEX = [{ href: "/product", label: "The platform" }, { href: "/inspiration", label: "Designs" }, { href: "/how-it-works", label: "How it works" }, { href: "/pricing", label: "Pricing" }]

/** Categorised desktop navigation and a compact-screen menu share real destinations. */
export function SiteNav({ cta, ctaHref, loginHref }: { cta: string; ctaHref: string; loginHref: string }) {
  const path = usePathname() ?? "/"
  const host = React.useSyncExternalStore(subscribeHost, () => window.location.hostname, () => "")
  const dashboardHref = dashboardDestination(host, loginHref)
  const [menu, setMenu] = React.useState("")
  const [openOn, setOpenOn] = React.useState<string | null>(null)
  const productTrigger = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const sync = () => {
      if (desktop.matches && openOn !== null) {
        setOpenOn(null)
        requestAnimationFrame(() => productTrigger.current?.focus())
      }
    }
    sync()
    desktop.addEventListener("change", sync)
    return () => desktop.removeEventListener("change", sync)
  }, [openOn])
  const open = openOn === path
  const at = (p: string) => path === p || path.startsWith(p + "/") ? "page" : undefined
  return <header aria-label="Taplo website" onPointerLeave={e => { if (e.pointerType === "mouse") setMenu("") }} className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/95 text-white backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-2 px-5 sm:px-8">
      <Link href="/" aria-label="Taplo home" className="mr-5 rounded outline-none focus-visible:ring-2 focus-visible:ring-white"><TaploLogo tone="light" className="h-7" /></Link>
      <NavigationMenu.Root value={menu} onValueChange={setMenu} aria-label="Primary" className="hidden md:block">
        <NavigationMenu.List className="flex items-center">
          <NavigationMenu.Item><NavigationMenu.Trigger ref={productTrigger} className={ink} aria-current={at("/product")}>Product<ChevronDown aria-hidden="true" className="size-3" /></NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-screen border-b border-white/15 bg-[#080808] text-white">
              <div className="mx-auto grid max-w-[88rem] grid-cols-4 gap-8 px-8 py-7">
                {PRODUCT_GROUPS.map((g,n) => <div key={g.title}><p className="mb-4 text-xs text-white/60"><span className="mr-3 tabular-nums">0{n+1}</span>{g.title}</p><ul className="grid gap-1">{g.links.map(l => <li key={l.href}><NavigationMenu.Link asChild><Link href={l.href} className="group inline-flex min-h-9 items-center gap-3 rounded text-sm text-white/85 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">{l.label}<ArrowUpRight aria-hidden="true" className="size-3 opacity-0 group-hover:opacity-100" /></Link></NavigationMenu.Link></li>)}</ul></div>)}
                <div className="col-span-4 flex justify-between border-t border-white/15 pt-4 text-xs text-white/60"><NavigationMenu.Link asChild><Link href="/product" className="rounded py-2 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Everything Taplo does ↗</Link></NavigationMenu.Link><NavigationMenu.Link asChild><Link href="/how-it-works" className="rounded py-2 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">How setup works ↗</Link></NavigationMenu.Link></div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item><NavigationMenu.Trigger className={ink} aria-current={at("/inspiration")}>Designs<ChevronDown aria-hidden="true" className="size-3" /></NavigationMenu.Trigger>
            <NavigationMenu.Content className="w-screen bg-[#080808] text-white">
              <div className="mx-auto grid max-w-[88rem] grid-cols-[.7fr_1.3fr] gap-12 px-8 py-8">
                <div><p className="font-display text-3xl leading-tight tracking-tight">A starting point<br />for your kind of work.</p><NavigationMenu.Link asChild><Link href="/inspiration" className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm text-white/75 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Explore all designs<ArrowUpRight size={15} aria-hidden="true" /></Link></NavigationMenu.Link></div>
                <ul className="grid grid-cols-2 gap-x-8">{INDUSTRY_FILTERS.map(industry => <li key={industry.id}><NavigationMenu.Link asChild><Link href={`/inspiration?industry=${industry.id}`} className="inline-flex min-h-11 items-center rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">{industry.label}</Link></NavigationMenu.Link></li>)}</ul>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item><NavigationMenu.Link asChild><Link href="/how-it-works" className={ink} aria-current={at("/how-it-works")}>How it works</Link></NavigationMenu.Link></NavigationMenu.Item>
          <NavigationMenu.Item><NavigationMenu.Link asChild><Link href="/pricing" className={ink} aria-current={at("/pricing")}>Pricing</Link></NavigationMenu.Link></NavigationMenu.Item>
        </NavigationMenu.List>
        <div className="fixed inset-x-0 top-16"><NavigationMenu.Viewport className="h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden data-[state=closed]:hidden" /></div>
      </NavigationMenu.Root>
      <div className="ml-auto flex items-center gap-2">
        <Link href={dashboardHref} className={cn(ink,"hidden lg:inline-flex")}>Log in</Link><Link data-brand-action href={ctaHref} className={primary}>{cta}</Link>
        <Dialog.Root open={open} onOpenChange={v => { setOpenOn(v ? path : null); setMenu("") }}>
          <Dialog.Trigger aria-label="Menu" className="group ml-1 flex md:hidden min-h-11 items-center gap-2 rounded px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-white"><span className="hidden lg:inline">Menu</span><Plus aria-hidden="true" className="size-5 transition-transform group-hover:rotate-90 motion-reduce:transition-none" /></Dialog.Trigger>
          <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" /><Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-[#080808] px-5 text-white outline-none sm:px-8">
            <Dialog.Title className="sr-only">Menu</Dialog.Title><Dialog.Description className="sr-only">Explore Taplo, its features, designs and setup.</Dialog.Description>
            <div className="mx-auto flex h-16 w-full max-w-[84rem] shrink-0 items-center justify-between border-b border-white/15"><TaploLogo tone="light" className="h-7" /><Dialog.Close aria-label="Close menu" className="flex min-h-11 items-center gap-3 rounded text-sm outline-none focus-visible:ring-2 focus-visible:ring-white">Close<X aria-hidden="true" className="size-5" /></Dialog.Close></div>
            <div className="mx-auto grid w-full max-w-[84rem] min-h-0 flex-1 content-start overflow-y-auto gap-10 py-8 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-14">
              <nav aria-label="Menu" className="grid content-start">{INDEX.map((l,n)=><Link key={l.href} href={l.href} className="group flex min-h-20 items-baseline gap-5 border-b border-white/15 py-4 outline-none focus-visible:ring-2 focus-visible:ring-white"><span className="text-xs tabular-nums text-white/60">0{n+1}</span><span className="font-display text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-[-.05em] text-white/80 transition-colors group-hover:text-white">{l.label}</span><ArrowUpRight aria-hidden="true" className="ml-auto size-5 text-white/60" /></Link>)}<Link href={dashboardHref} className="mt-5 inline-flex min-h-11 w-fit items-center gap-3 rounded text-sm text-white/60 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Log in<ArrowUpRight aria-hidden="true" className="size-4" /></Link></nav>
              <div><p className="mb-5 text-xs uppercase tracking-widest text-white/60">Explore the features</p><div className="grid grid-cols-2 gap-x-8 gap-y-7">{PRODUCT_GROUPS.map(g=><div key={g.title}><p className="mb-2 text-xs text-white/60">{g.title}</p><ul>{g.links.map(l=><li key={l.href}><Link href={l.href} className="inline-flex min-h-10 rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">{l.label}</Link></li>)}</ul></div>)}</div></div>
            </div>
            <div className="mx-auto flex w-full max-w-[84rem] shrink-0 items-center justify-between gap-5 border-t border-white/15 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"><p className="text-xs text-white/60">Services. Bookings. Stock.</p><Link data-brand-action href={ctaHref} className={primary}>{cta}</Link></div>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  </header>
}
