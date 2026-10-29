"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CalendarDays, ChevronRight, Home, MoreHorizontal, Package, Palette, Settings, Star, Users, Wrench } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getIndustryPreset } from "@/features/themes/presets/industries"
import { useOwner } from "@/features/booking/ui/owner/useOwner"
import { resolveEntitlements } from "@/features/subscriptions/entitlements"
import { cn } from "@/lib/utils"
import { useDemo } from "../store"

type Item = { href: string; label: string; Icon: typeof Home; badge?: number; note?: string }

/** One navigation for every Studio page: a labelled dock on a phone, a rail on a desk, and a More sheet for the rest. */
export function StudioNav() {
  const path = usePathname()
  const { state } = useDemo()
  const { state: bk } = useOwner()
  const [more, setMore] = React.useState(false)
  const [keyboard, setKeyboard] = React.useState(false)
  const moreButton = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const check = () => setKeyboard(window.innerHeight - vv.height > 140)
    vv.addEventListener("resize", check)
    check()
    return () => vv.removeEventListener("resize", check)
  }, [])

  if (!state) return null
  const terms = getIndustryPreset(state.content.identity.industryKey ?? "other").terminology
  const dealer = state.content.identity.industryKey === "car-dealer"
  const ent = resolveEntitlements(state.plan, "active")
  const now = Date.now()
  const attention =
    bk.bookings.filter((b) => b.status === "pending" && b.endsAt > now).length + bk.enquiries.filter((e) => e.status === "new").length

  const primary: Item[] = [
    { href: "/dashboard", label: "Home", Icon: Home },
    { href: "/dashboard/page", label: "Page", Icon: Palette },
    { href: "/dashboard/services", label: terms.services, Icon: Wrench },
    { href: "/dashboard/bookings", label: "Bookings", Icon: CalendarDays, badge: attention },
  ]
  const secondary: Item[] = [
    { href: "/dashboard/reviews", label: "Reviews", Icon: Star },
    { href: "/dashboard/team", label: "Team", Icon: Users },
    { href: "/dashboard/products", label: dealer ? "Vehicle stock" : "Products", Icon: Package },
    { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3, note: ent.analytics ? undefined : "Not on your plan" },
    { href: "/dashboard/settings", label: "Settings", Icon: Settings },
  ]
  const isActive = (href: string) => (href === "/dashboard" ? path === href : path === href || path.startsWith(href + "/"))
  const secondaryActive = secondary.some((i) => isActive(i.href))

  return (
    <>
      <nav className={cn("studio-dock", keyboard && "studio-dock-hidden")} aria-label="Studio" data-testid="studio-dock">
        {primary.map(({ href, label, Icon, badge }) => (
          <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="studio-dock-item" data-active={isActive(href)}>
            <Icon aria-hidden="true" />
            {badge ? <b aria-label={`${badge} waiting`}>{badge}</b> : null}
            <span>{label}</span>
          </Link>
        ))}
        <button ref={moreButton} type="button" className="studio-dock-item" data-active={secondaryActive} aria-haspopup="dialog" aria-expanded={more} onClick={() => setMore(true)}>
          <MoreHorizontal aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>

      <nav className="studio-rail-nav" aria-label="Studio sections" data-testid="studio-rail">
        {[...primary.slice(0, 3), secondary[2], secondary[1], primary[3], secondary[0], secondary[3]].map(({ href, label, Icon, badge, note }) => (
          <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="studio-rail-item" data-active={isActive(href)}>
            <Icon aria-hidden="true" />
            <span>{label}{note ? <small>{note}</small> : null}</span>
            {badge ? <b aria-label={`${badge} waiting`}>{badge}</b> : null}
          </Link>
        ))}
        <Link href={secondary[4].href} aria-current={isActive(secondary[4].href) ? "page" : undefined} className="studio-rail-item studio-rail-last" data-active={isActive(secondary[4].href)}>
          <Settings aria-hidden="true" />
          <span>Settings</span>
        </Link>
      </nav>

      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent
          side="bottom"
          className="studio-more"
          onCloseAutoFocus={(e) => { e.preventDefault(); moreButton.current?.focus() }}
        >
          <SheetHeader><SheetTitle>More</SheetTitle></SheetHeader>
          <ul className="studio-more-list">
            {secondary.map(({ href, label, Icon, note }) => (
              <li key={href}>
                <Link href={href} onClick={() => setMore(false)} aria-current={isActive(href) ? "page" : undefined}>
                  <Icon aria-hidden="true" />
                  <span>{label}{note ? <small>{note}</small> : null}</span>
                  <ChevronRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  )
}

/** Final-height placeholders for any manage route, so nothing jumps when the draft arrives. */
export function RouteSkeleton() {
  return (
    <div className="studio-route-skel" aria-busy="true" data-testid="route-skeleton">
      <span className="studio-skel" style={{ width: "55%", height: "2.75rem" }} />
      <span className="studio-skel" style={{ width: "35%", height: "1.25rem" }} />
      {[0, 1, 2].map((i) => <span key={i} className="studio-skel" style={{ width: "100%", height: "4rem" }} />)}
    </div>
  )
}

