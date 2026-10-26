"use client"

import * as React from "react"
import Link from "next/link"
import { Boxes, CalendarDays, Check, Copy, Lock, MessageSquare, Palette, Share2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { businessAddress } from "@/lib/domains"
import { WHEN_UNAVAILABLE } from "@/lib/capabilities"
import { PagePreview } from "@/features/preview/PagePreview"
import { useOwner } from "@/features/booking/ui/owner/useOwner"
import { useClientNow } from "@/features/booking/clock"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { resolveEntitlements, type Entitlements } from "@/features/subscriptions/entitlements"
import { cn } from "@/lib/utils"
import { canPublish, hasUnpublishedChanges, publish, readiness, unpublish } from "../actions"
import { useDraft } from "../hooks"
import { UpcomingBookings } from "./UpcomingBookings"
import "./studio.css"

const DOCK = [
  { href: "/dashboard/page", label: "Page and design", Icon: Palette },
  { href: "/dashboard/services", label: "Services and stock", Icon: Boxes },
  { href: "/dashboard/bookings", label: "Calendar and bookings", Icon: CalendarDays },
  { href: "/dashboard/bookings", label: "Messages and enquiries", Icon: MessageSquare, badge: "enquiries" as const },
  { href: "/dashboard/page", label: "Share, QR and wallet", Icon: Share2 },
] as const

/** Things the owner does not have yet, each with the first plan that includes it. Shown only when a plan is what stands between them and it. */
const DISCOVER: { key: keyof Entitlements; title: string; line: string }[] = [
  { key: "onlineBooking", title: "Let customers pick a time", line: "A live diary on your page, with times that disappear as they are taken." },
  { key: "analytics", title: "See who looks at your page", line: "Visits, taps on call and booking, and where people came from." },
  { key: "gallery", title: "Show your work", line: "A photo gallery that opens full screen, right on your page." },
  { key: "removeBranding", title: "Make the page entirely yours", line: "Remove the small Taplo signature at the bottom." },
  { key: "payments", title: "Take deposits", line: "Secure a booking with a payment when the customer books." },
]
const firstPlanWith = (key: keyof Entitlements): PlanId | null => PLAN_IDS.find((p) => Boolean(resolveEntitlements(p, "active")[key])) ?? null

/**
 * The studio: your page is the centre of the screen, everything else floats around it. A dock of the five places you work, a
 * status card, what to do next, what is waiting for you, and (only where a plan is the reason) what else is available.
 */
export function Studio() {
  const { state: s, patch, ent } = useDraft()
  const { state: bk } = useOwner()
  const [copied, setCopied] = React.useState(false)
  const now = useClientNow() ?? 0
  if (!s || !ent) return null
  const checks = readiness(s)
  const requiredLeft = checks.filter((c) => c.required && !c.done)
  const next = checks.filter((c) => !c.done).slice(0, 3)
  const liveSlug = s.published?.content.identity.slug
  const url = liveSlug ? `${window.location.origin}/demo/p/${liveSlug}` : null
  const upcoming = bk.bookings.filter((b) => b.endsAt > now && (b.status === "confirmed" || b.status === "pending")).length
  const awaiting = bk.bookings.filter((b) => b.status === "pending" && b.endsAt > now).length
  const enquiries = bk.enquiries.filter((e) => e.status === "new").length
  const discover = DISCOVER.filter((d) => !ent[d.key]).map((d) => ({ ...d, plan: firstPlanWith(d.key) })).filter((d) => d.plan).slice(0, 2)
  return (
    <div className="studio" data-testid="studio">
      <nav className="studio-dock" aria-label="Studio">
        {DOCK.map(({ href, label, Icon, ...rest }, i) => (
          <Link key={i} href={href} className="studio-dock-item" aria-label={label}>
            <Icon aria-hidden="true" />
            {"badge" in rest && enquiries > 0 ? <b aria-label={`${enquiries} enquiries`}>{enquiries}</b> : null}
            <span className="studio-dock-label">{label}</span>
          </Link>
        ))}
      </nav>

      <section className="studio-stage" aria-label="Your page">
        <div className="studio-glow" aria-hidden="true" />
        <div className="studio-phone"><PagePreview src="/demo/preview" title="Your page" mode="device" chrome url={businessAddress(s.content.identity.slug)} /></div>
        <Button asChild size="lg" variant="outline" className="studio-edit bg-white text-black hover:bg-white/90"><Link href="/dashboard/page">Edit my page</Link></Button>
      </section>

      <aside className="studio-side" aria-label="Status and next steps">
        <div className="studio-card">
          <div className="studio-row">
            <span className={cn("studio-pill", s.published && "studio-pill-live")}>{s.published ? `Published · v${s.published.version}` : "Draft"}</span>
            {hasUnpublishedChanges(s) ? <span className="studio-note">Unpublished changes</span> : null}
          </div>
          <div className="studio-row studio-actions">
            <Button disabled={!canPublish(s)} onClick={() => patch(publish)}>{s.published ? "Publish changes" : "Publish"}</Button>
            {s.published ? <Button variant="outline" onClick={() => patch(unpublish)}>Unpublish</Button> : null}
            {url ? <Button variant="outline" asChild><a href={url} target="_blank" rel="noreferrer">View</a></Button> : null}
            {url ? <Button variant="outline" aria-label="Copy link" onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {} }}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button> : null}
          </div>
          {!canPublish(s) ? <p className="studio-note">To publish: {requiredLeft.map((c) => c.label.toLowerCase()).join(", ")}.</p> : <p className="studio-note">{WHEN_UNAVAILABLE.publicPublishing}</p>}
        </div>

        <div className="studio-card">
          <h2>Waiting for you</h2>
          <dl className="studio-stats">
            <div><dt>Upcoming</dt><dd>{upcoming}</dd></div>
            <div><dt>Need a reply</dt><dd>{awaiting}</dd></div>
            <div><dt>Enquiries</dt><dd>{enquiries}</dd></div>
          </dl>
          <UpcomingBookings />
        </div>

        {next.length ? (
          <div className="studio-card">
            <h2>Next up</h2>
            <ul className="studio-list">{next.map((c) => <li key={c.id}><Link href={c.href}><span className="studio-dot" aria-hidden="true" />{c.label}{!c.required ? <i>optional</i> : null}</Link></li>)}</ul>
          </div>
        ) : null}

        {discover.length ? (
          <div className="studio-card studio-discover">
            <h2><Sparkles aria-hidden="true" /> You could also</h2>
            <ul className="studio-list">{discover.map((d) => (
              <li key={d.key}><Link href="/pricing"><span><strong>{d.title}</strong><small>{d.line}</small></span><em><Lock aria-hidden="true" />{PLANS[d.plan!].name}</em></Link></li>
            ))}</ul>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
