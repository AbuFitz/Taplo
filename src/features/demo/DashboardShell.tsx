"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, CalendarDays, LayoutDashboard, Menu, Package, Paintbrush, Settings, Star, Users, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { loadSample } from "./actions"
import { useDemo } from "./store"
import { DemoNotice } from "./ui"

const NAV = [
  { href: "/dashboard/page", label: "My page", icon: Paintbrush, primary: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as { href: string; label: string; icon: typeof Paintbrush; primary?: boolean }[]

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname()
  return (
    <nav aria-label="Dashboard" className="grid gap-1">
      {NAV.map(({ href, label, icon: Icon, primary }) => {
        const active = href === "/dashboard" ? path === href : path.startsWith(href)
        return (
          <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm hover:bg-muted", active && "bg-muted font-semibold", primary && !active && "bg-primary/10 font-semibold text-primary hover:bg-primary/15", primary && active && "bg-primary text-primary-foreground")}>
            <Icon className="size-4" aria-hidden="true" /> {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state, update } = useDemo()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  /** The page editor needs the full width: the side menu moves into the top-bar menu there. */
  const focus = usePathname() === "/dashboard/page"

  const empty = ready && (!state || (!state.onboarded && !state.content.identity.name))

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className={cn("hidden w-60 shrink-0 border-r p-4", !focus && "lg:block")}>
        <Link href="/" className="mb-6 block px-3 text-lg font-semibold">Taplo</Link>
        <NavList />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3 lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={focus ? "" : "lg:hidden"} aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader><SheetTitle>Taplo</SheetTitle></SheetHeader>
              <div className="px-2"><NavList onNavigate={() => setOpen(false)} /></div>
            </SheetContent>
          </Sheet>
          <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {state?.content.identity.name ? <>Managing <strong className="text-foreground">{state.content.identity.name}</strong></> : "No business yet"}
          </p>
          <span className="rounded-full border px-2.5 py-1 text-xs font-medium">Plan: {state?.plan ?? "business"} (simulated)</span>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <DemoNotice className="mb-6" />
          {!ready ? <p className="text-sm text-muted-foreground">Loading…</p> : empty ? (
            <div className="max-w-xl">
              <h1 className="text-2xl font-semibold">Let’s set up your page</h1>
              <p className="mt-2 text-muted-foreground">Start the 5-step setup, or load a synthetic sample business to look around with content already in place.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link href="/onboarding">Start setup</Link></Button>
              </div>
              <p className="mb-2 mt-8 text-sm font-medium">Or explore a sample</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_FIXTURE_KEYS.map((k) => (
                  <Button key={k} size="sm" variant="outline" onClick={() => { update((x) => loadSample(x, k), { resetHistory: true }); router.push("/dashboard/page") }}>{getFixture(k)!.label}</Button>
                ))}
              </div>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  )
}
