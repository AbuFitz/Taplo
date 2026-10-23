"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, NavigationMenu } from "radix-ui"
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"
import { TaploLogo } from "@/components/taplo/brand"
import { cn } from "@/lib/utils"
import { INDUSTRY_FILTERS, PRODUCT_GROUPS } from "./ia"

const ink = "rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 data-[state=open]:text-foreground aria-[current=page]:text-foreground"
const primary = "inline-flex min-h-10 items-center rounded-full bg-foreground px-4 text-sm font-semibold text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/60"

/**
 * Compact floating navigation. Product and Inspiration open real menus whose entries are real pages; Pricing and
 * Log in are plain links. On a phone the same structure becomes one full-screen sheet with the primary action visible.
 */
export function SiteNav({ cta, ctaHref, loginHref }: { cta: string; ctaHref: string; loginHref: string }) {
  const path = usePathname() ?? "/"
  // The sheet belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = React.useState<string | null>(null)
  const open = openOn === path
  const setOpen = (v: boolean) => setOpenOn(v ? path : null)
  const at = (p: string) => (path === p || path.startsWith(p + "/") ? "page" : undefined)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 rounded-full border border-foreground/10 bg-background/85 pl-4 pr-2 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl">
        <Link href="/" aria-label="Taplo home" className="mr-1 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60"><TaploLogo className="h-10 -my-1 -ml-3" /></Link>

        <NavigationMenu.Root className="relative hidden md:block" aria-label="Primary">
          <NavigationMenu.List className="flex items-center">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={cn(ink, "group inline-flex items-center gap-1")} aria-current={at("/product")}>Product<ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-data-[state=open]:rotate-180" /></NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-0 top-0 w-[44rem] max-w-[calc(100vw-2rem)] p-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {PRODUCT_GROUPS.map((g) => (
                    <div key={g.title}>
                      <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">{g.title}</p>
                      <ul className="mt-1.5">{g.links.map((l) => (
                        <li key={l.href}><NavigationMenu.Link asChild><Link href={l.href} className="block rounded-xl px-3 py-2 outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60"><span className="block text-sm font-semibold">{l.label}</span><span className="block text-[0.8125rem] leading-snug text-foreground/60">{l.blurb}</span></Link></NavigationMenu.Link></li>
                      ))}</ul>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 text-sm">
                  <NavigationMenu.Link asChild><Link href="/product" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">Everything Taplo does<ArrowRight aria-hidden="true" className="size-4" /></Link></NavigationMenu.Link>
                  <NavigationMenu.Link asChild><Link href="/how-it-works" className="rounded-lg px-3 py-1.5 text-foreground/70 outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">How setup works</Link></NavigationMenu.Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={cn(ink, "group inline-flex items-center gap-1")} aria-current={at("/inspiration")}>Inspiration<ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-data-[state=open]:rotate-180" /></NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-0 top-0 w-[30rem] max-w-[calc(100vw-2rem)] p-5">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">Real examples by kind of business</p>
                <ul className="mt-1.5 grid grid-cols-2 gap-x-4">
                  {INDUSTRY_FILTERS.map((i) => <li key={i.id}><NavigationMenu.Link asChild><Link href={`/inspiration?industry=${i.id}`} className="block rounded-xl px-3 py-2 text-sm font-medium outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">{i.label}</Link></NavigationMenu.Link></li>)}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 text-sm">
                  <NavigationMenu.Link asChild><Link href="/inspiration" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">Browse all examples<ArrowRight aria-hidden="true" className="size-4" /></Link></NavigationMenu.Link>
                  <NavigationMenu.Link asChild><Link href="/appearance" className="rounded-lg px-3 py-1.5 text-foreground/70 outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">Try the looks</Link></NavigationMenu.Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item><NavigationMenu.Link asChild><Link href="/pricing" className={ink} aria-current={at("/pricing")}>Pricing</Link></NavigationMenu.Link></NavigationMenu.Item>
          </NavigationMenu.List>
          <div className="absolute left-0 top-full flex pt-3">
            <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top-left overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] transition-[width,height] duration-200 motion-reduce:transition-none data-[state=closed]:hidden" />
          </div>
        </NavigationMenu.Root>

        <div className="ml-auto flex items-center gap-1">
          <Link href={loginHref} className={cn(ink, "hidden md:inline-flex")}>Log in</Link>
          <Link href={ctaHref} className={primary}>{cta}</Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger aria-label="Menu" className="grid size-11 place-items-center rounded-full outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60 md:hidden"><Menu aria-hidden="true" className="size-5" /></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-x-0 top-0 z-50 flex h-[100dvh] flex-col bg-background px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 outline-none">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <div className="flex h-14 items-center justify-between"><TaploLogo className="h-10 -my-1 -ml-3" /><Dialog.Close aria-label="Close menu" className="grid size-11 place-items-center rounded-full outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60"><X aria-hidden="true" className="size-5" /></Dialog.Close></div>
                <nav aria-label="Menu" className="mt-2 grid flex-1 content-start gap-1 overflow-y-auto overscroll-contain">
                  <MobileSection title="Product" href="/product" all="Everything Taplo does">
                    {PRODUCT_GROUPS.flatMap((g) => g.links).map((l) => <MobileLink key={l.href} href={l.href}>{l.label}</MobileLink>)}
                  </MobileSection>
                  <MobileSection title="Inspiration" href="/inspiration" all="Browse all examples">
                    {INDUSTRY_FILTERS.map((i) => <MobileLink key={i.id} href={`/inspiration?industry=${i.id}`}>{i.label}</MobileLink>)}
                  </MobileSection>
                  <MobileLink href="/pricing" big>Pricing</MobileLink>
                  <MobileLink href={loginHref} big>Log in</MobileLink>
                </nav>
                <Link href={ctaHref} className={cn(primary, "mt-3 min-h-12 shrink-0 justify-center text-base")}>{cta}</Link>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}

function MobileLink({ href, children, big }: { href: string; children: React.ReactNode; big?: boolean }) {
  return <Link href={href} className={cn("flex min-h-12 items-center rounded-xl px-3 outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60", big ? "text-lg font-semibold" : "text-base text-foreground/80")}>{children}</Link>
}

function MobileSection({ title, href, all, children }: { title: string; href: string; all: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-foreground/10">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-3 text-lg font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">{title}<ChevronDown aria-hidden="true" className="size-5 transition-transform group-open:rotate-180" /></summary>
      <div className="grid pb-2">{children}<Link href={href} className="flex min-h-12 items-center gap-1.5 rounded-xl px-3 text-base font-semibold outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/60">{all}<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
    </details>
  )
}
