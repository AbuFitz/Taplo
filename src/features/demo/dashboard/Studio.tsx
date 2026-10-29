"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Copy, Pencil, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { businessAddress } from "@/lib/domains"
import { WHEN_UNAVAILABLE } from "@/lib/capabilities"
import { PagePreview } from "@/features/preview/PagePreview"
import { SharePanel } from "@/features/page/widgets/ShareClient"
import { useOwner } from "@/features/booking/ui/owner/useOwner"
import { useClientNow } from "@/features/booking/clock"
import { cn } from "@/lib/utils"
import { canPublish, hasUnpublishedChanges, publish, readiness, unpublish } from "../actions"
import { useDraft } from "../hooks"
import { UpcomingBookings } from "./UpcomingBookings"
import "./studio.css"

/** Plain wording for the required steps, in the order a first-time owner meets them. */
const REQUIRED_HEADLINE: Record<string, string> = {
  example: "Replace or remove the example items",
  industry: "Say what kind of business it is",
  name: "Check your name and web address",
  contact: "Add a way to contact you",
}

const REQUIRED_CTA: Record<string, string> = {
  example: "Review the examples",
  industry: "Choose your business type",
  name: "Check name and address",
  contact: "Add contact details",
}

/**
 * The studio home. One question at a time, in order: what state is the page in, what is the one thing to do next, does anything
 * need me, and where do I edit, preview and share. Zero counters, finished checklists and plan pitches stay out of the way.
 */
export function Studio() {
  const { state: s, patch, ent } = useDraft()
  const { state: bk } = useOwner()
  const [copy, setCopy] = React.useState<"idle" | "done" | "failed">("idle")
  const [shareOpen, setShareOpen] = React.useState(false)
  const [announce, setAnnounce] = React.useState("")
  const headlineRef = React.useRef<HTMLHeadingElement>(null)
  const opener = React.useRef<HTMLElement | null>(null)
  const now = useClientNow() ?? 0

  const openShare = (el: HTMLElement) => { opener.current = el; setShareOpen(true) }
  const closeShare = (open: boolean) => { setShareOpen(open); if (!open) requestAnimationFrame(() => opener.current?.focus()) }

  if (!s || !ent) return <StudioSkeleton />

  const checks = readiness(s)
  const requiredLeft = checks.filter((c) => c.required && !c.done)
  const ready = canPublish(s)
  const published = Boolean(s.published)
  const changed = hasUnpublishedChanges(s)
  const awaiting = bk.bookings.filter((b) => b.status === "pending" && b.endsAt > now).length
  const upcoming = bk.bookings.filter((b) => b.endsAt > now && (b.status === "confirmed" || b.status === "pending")).length
  const enquiries = bk.enquiries.filter((e) => e.status === "new").length
  const needReply = awaiting + enquiries
  const liveSlug = s.published?.content.identity.slug
  const url = liveSlug ? `${window.location.origin}/demo/p/${liveSlug}` : null
  const cardCopies = published && !changed && needReply === 0
  const unfinished = checks.filter((c) => c.id !== "published" && !c.done)

  const copyLink = async () => {
    if (!url) return
    try { await navigator.clipboard.writeText(url); setCopy("done"); setTimeout(() => setCopy("idle"), 1800) } catch { setCopy("failed") }
  }
  const doPublish = () => {
    patch(publish)
    setAnnounce("Published in this browser.")
    requestAnimationFrame(() => headlineRef.current?.focus())
  }

  // The single next action: first matching row wins, one filled button at most.
  const first = requiredLeft[0]
  const next: { headline: string; body?: string; primary: React.ReactNode; secondary?: React.ReactNode } = !ready
    ? {
        headline: first ? REQUIRED_HEADLINE[first.id] ?? first.label : "Fix the highlighted details",
        body: requiredLeft.length > 1 ? `${requiredLeft.length} things to finish before you can publish.` : "One thing to finish before you can publish.",
        primary: <Button asChild size="lg" className="studio-primary"><Link href={first?.href ?? "/dashboard/page"}>{first ? REQUIRED_CTA[first.id] ?? "Open this step" : "Open my page"}</Link></Button>,
        secondary: !s.onboarded
          ? <Link className="studio-link" href="/onboarding" data-testid="continue-setup">Continue setup</Link>
          : <a className="studio-link" href="#studio-preview">Preview your page</a>,
      }
    : !published
      ? { headline: "Your page is ready to publish", body: "Publishing saves this version in this browser.", primary: <Button size="lg" className="studio-primary" onClick={doPublish}>Publish</Button> }
      : changed
        ? { headline: "You have changes that are not published", primary: <Button size="lg" className="studio-primary" onClick={doPublish}>Publish changes</Button>, secondary: <button type="button" className="studio-link" onClick={() => patch(unpublish)}>Unpublish this page</button> }
        : needReply > 0
          ? { headline: `${needReply} ${needReply === 1 ? "needs" : "need"} a reply`, primary: <Button asChild size="lg" className="studio-primary"><Link href="/dashboard/bookings">Open bookings</Link></Button>, secondary: <button type="button" className="studio-link" onClick={copyLink}>Copy link</button> }
          : { headline: "Your page is published", primary: <Button size="lg" className="studio-primary" onClick={copyLink}>{copy === "done" ? "Copied" : "Copy link"}</Button> }

  // One quiet tip, never while a required step is open.
  const tip = !ready
    ? null
    : !s.content.identity.logo && !(s.content.gallery ?? []).length
      ? { text: "Add photos so people can choose you.", href: "/dashboard/page", cta: "Add photos" }
      : checks.some((c) => c.id === "goal-book" && !c.done)
        ? { text: "Add a service with a time so customers can book.", href: "/dashboard/services", cta: "Add a service" }
        : null

  return (
    <div className={"studio"} data-testid="studio">
      <h1 className="sr-only">{s.content.identity.name}</h1>
      <aside className="studio-rail" aria-label="Status and next step">
        <div className="studio-status" data-testid="studio-status">
          <span className={cn("studio-pill", published && "studio-pill-live")}>{published ? `Published · v${s.published!.version}` : "Draft"}</span>
          <span className="studio-scope">{published ? "Published in this browser only" : "Only visible in this browser"}</span>
          {published && changed ? <span className="studio-scope studio-scope-flag">Unpublished changes</span> : null}
        </div>
        <details className="studio-why">
          <summary>What does this mean?</summary>
          <p>{WHEN_UNAVAILABLE.publicPublishing}</p>
        </details>

        <section className="studio-next" aria-label="Next step" data-testid="studio-next">
          <h2 ref={headlineRef} tabIndex={-1} className="font-display font-display-tight">{next.headline}</h2>
          {next.body ? <p>{next.body}</p> : null}
          {next.primary}
          {next.secondary ? <div className="studio-secondary">{next.secondary}</div> : null}
        </section>
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>

        {needReply > 0 || (upcoming > 0 && awaiting === 0) ? (
          <ul className="studio-attention" aria-label="Waiting for you">
            {awaiting > 0 ? <li><Link href="/dashboard/bookings"><b>{awaiting}</b>{awaiting === 1 ? "booking needs a reply" : "bookings need a reply"}</Link></li> : null}
            {enquiries > 0 ? <li><Link href="/dashboard/bookings"><b>{enquiries}</b>{enquiries === 1 ? "new enquiry" : "new enquiries"}</Link></li> : null}
            {upcoming > 0 && awaiting === 0 ? <li><Link href="/dashboard/bookings"><b>{upcoming}</b>{upcoming === 1 ? "booking coming up" : "bookings coming up"}</Link></li> : null}
          </ul>
        ) : null}
        {upcoming > 0 ? <UpcomingBookings /> : null}

        {url ? (
          <div className="studio-share" data-testid="studio-share">
            <span className="studio-share-label">Share <small>This address works in this browser only</small></span>
            <span className="studio-share-url" data-testid="studio-share-url">{url}</span>
            <div className="studio-share-actions">
              {cardCopies ? null : <Button variant="outline" aria-label="Copy link" onClick={copyLink}>{copy === "done" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}Copy</Button>}
              <Button variant="outline" onClick={(e) => openShare(e.currentTarget)}><QrCode aria-hidden="true" />Show QR</Button>
            </div>
            {copy === "failed" ? <p className="studio-note" role="alert">Could not copy. Select the address and copy it.</p> : null}
          </div>
        ) : null}
        {url ? <SharePanel tone="admin" open={shareOpen} onOpenChange={closeShare} data={{ name: s.content.identity.name, slug: liveSlug!, url: url! }} /> : null}

        {tip ? <p className="studio-tip" data-testid="studio-tip">{tip.text} <Link href={tip.href}>{tip.cta}</Link></p> : null}

        {unfinished.length > 0 ? (
          <details className="studio-steps" data-testid="studio-checklist">
            <summary>See all steps · {unfinished.length} to go</summary>
            <ul className="studio-list">
              {checks.filter((c) => c.id !== "published").sort((a, b) => Number(a.done) - Number(b.done)).map((c) => (
                <li key={c.id} data-done={c.done}><Link href={c.href}><span className={cn("studio-dot", c.done && "studio-dot-done")} aria-hidden="true" />{c.label}{c.done ? <i>done</i> : !c.required ? <i>optional</i> : null}</Link></li>
              ))}
            </ul>
          </details>
        ) : null}

        {!(s.content.services ?? []).some((x) => !x.archived) ? (
          <div className="studio-examples" data-testid="examples-card">
            <p className="studio-note">{s.showExamples === false ? "Your page shows only what you have added." : "Your page shows labelled example items so you can see what it could be. They are never saved as yours and never published."}</p>
            <Button variant="outline" onClick={() => patch((x) => ({ ...x, showExamples: x.showExamples === false }))}>{s.showExamples === false ? "Show examples" : "Hide examples"}</Button>
          </div>
        ) : null}

        {published && !ent.analytics ? <Link className="studio-link studio-plans" href="/pricing">Compare plans</Link> : null}
      </aside>

      <section className="studio-stage" id="studio-preview" aria-label="Your page">
        <Button asChild size="lg" variant="outline" className="studio-edit"><Link href="/dashboard/page"><Pencil aria-hidden="true" />Edit my page</Link></Button>
        <div className="studio-phone"><PagePreview src="/demo/preview" title="Your page" mode="device" chrome url={businessAddress(s.content.identity.slug)} retryAfterMs={15000} /></div>
      </section>

    </div>
  )
}

/** Reserves the final heights so nothing moves when the draft arrives. */
export function StudioSkeleton() {
  return (
    <div className="studio" data-testid="studio-loading" aria-busy="true">
      <div className="studio-dock" aria-hidden="true" />
      <aside className="studio-rail">
        <div className="studio-status"><span className="studio-skel" style={{ width: "14rem", height: "2rem" }} /></div>
        <span className="studio-skel" style={{ width: "10rem", height: "2rem", marginTop: "-6px" }} />
        <div className="studio-next"><span className="studio-skel" style={{ width: "80%", height: "4.5rem" }} /><span className="studio-skel" style={{ width: "100%", height: "3.5rem" }} /></div>
      </aside>
      <section className="studio-stage"><div className="studio-phone" /></section>
    </div>
  )
}
