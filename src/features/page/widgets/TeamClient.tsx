"use client"

import * as React from "react"
import { ArrowRight, CalendarCheck, Check } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { nextAvailableDate } from "@/features/booking/availability"
import { useBookingState, useSchedulingConfig } from "@/features/booking/demo-adapter"
import { eligibleStaff, isOnlineBookable, type BookingContext } from "@/features/booking/model"
import { addDays, formatDay, localParts } from "@/features/booking/time"
import { BookingFlow } from "@/features/booking/ui/BookingFlow"
import { Collection } from "./Collection"

export interface TeamMemberData {
  id: string
  name: string
  role?: string
  bio?: string
  /** One or two sentences for the compact card. */
  summary: string
  photo?: { src: string; alt: string; focal?: { x: number; y: number } }
  subjects: string[]
  credentials: string[]
  services: { id: string; name: string; price: string; minutes?: number }[]
  bookable: boolean
}

const first = (name: string) => name.split(/\s+/)[0] ?? name

function Portrait({ m, className, ratio = "4 / 5" }: { m: TeamMemberData; className?: string; ratio?: string }) {
  return (
    <div className={cn("tp-portrait", className)} style={{ aspectRatio: ratio }}>
      {m.photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={m.photo.src} alt={m.photo.alt} loading="lazy" draggable={false} style={m.photo.focal ? { objectPosition: `${m.photo.focal.x}% ${m.photo.focal.y}%` } : undefined} />
        : <span aria-hidden="true" className="tp-portrait-initials">{m.name.split(/\s+/).map((x) => x[0]).slice(0, 2).join("")}</span>}
    </div>
  )
}

/**
 * The team, compact by default. "list" is one row per person; "swipe" and "grid" are portrait cards. Every
 * person opens an expanded profile (biography, what they do, qualifications the business supplied, when they
 * work, and booking with them). Booking from a profile closes the profile and opens the booking journey, so
 * there are never two overlays stacked. No private contact details are ever in this data.
 */
export function TeamMembers({ members, variant, ctx }: { members: TeamMemberData[]; variant: "list" | "swipe" | "grid" | "avatars"; ctx?: BookingContext }) {
  const [profile, setProfile] = React.useState<string | null>(null)
  const [book, setBook] = React.useState<{ staffId: string } | null>(null)
  const member = members.find((m) => m.id === profile) ?? null
  const canBook = (m: TeamMemberData) => Boolean(ctx && m.bookable && ctx.staff.some((s) => s.id === m.id) && m.services.some((s) => ctx.services.find((x) => x.id === s.id && isOnlineBookable(x))))

  const card = (m: TeamMemberData, ratio = "4 / 5") => (
    <article className="tp-team-card" data-testid="team-card">
      <button type="button" className="tp-team-open" onClick={() => setProfile(m.id)} aria-label={`View ${m.name}'s profile`}>
        <Portrait m={m} ratio={ratio} />
        <span className="tp-team-name">{m.name}</span>
        {m.role ? <span className="tp-team-role">{m.role}</span> : null}
        {m.summary ? <span className="tp-team-summary">{m.summary}</span> : null}
      </button>
      {canBook(m) ? <button type="button" className="tp-btn" data-variant="compact" onClick={() => setBook({ staffId: m.id })}><span className="tp-btn-main"><span className="tp-btn-label">Book with {first(m.name)}</span></span><ArrowRight aria-hidden="true" className="size-4" /></button> : null}
    </article>
  )

  const row = (m: TeamMemberData) => (
    <li key={m.id} className="tp-team-row">
      <button type="button" className="tp-team-row-open" onClick={() => setProfile(m.id)} aria-label={`View ${m.name}'s profile`}>
        <Portrait m={m} className="tp-portrait-sm" ratio="1 / 1" />
        <span className="min-w-0 text-left"><span className="tp-team-name block">{m.name}</span>{m.role ? <span className="tp-team-role block">{m.role}</span> : null}{m.summary ? <span className="tp-team-summary block">{m.summary}</span> : null}</span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 opacity-60" />
      </button>
    </li>
  )

  return (
    <>
      {variant === "swipe" ? <Collection label="Team" compact>{members.map((m) => <React.Fragment key={m.id}>{card(m, "1 / 1")}</React.Fragment>)}</Collection>
        : variant === "grid" ? <ul className="tp-team-grid">{members.map((m) => <li key={m.id}>{card(m)}</li>)}</ul>
        : variant === "avatars" ? <ul className="tp-team-avatars">{members.map((m) => <li key={m.id}><button type="button" onClick={() => setProfile(m.id)} aria-label={`View ${m.name}'s profile`}><Portrait m={m} className="tp-portrait-sm" ratio="1 / 1" /><span className="text-sm font-semibold leading-tight">{first(m.name)}</span></button></li>)}</ul>
        : <ul className="tp-rows">{members.map(row)}</ul>}

      <Overlay tone="page" kind="detail" open={profile !== null} onOpenChange={(o) => !o && setProfile(null)} title={member?.name ?? "Profile"} description={member?.role} testId="team-profile">
        {member ? <Profile m={member} ctx={ctx} canBook={canBook(member)} onBook={() => { setProfile(null); setBook({ staffId: member.id }) }} /> : null}
      </Overlay>
      {ctx ? <BookingFlow ctx={ctx} staffId={book?.staffId} open={book !== null} onOpenChange={(o) => !o && setBook(null)} title={book ? `Book with ${first(ctx.staff.find((s) => s.id === book.staffId)?.name ?? "")}` : undefined} key={book?.staffId ?? "none"} /> : null}
    </>
  )
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const DAY_NAMES = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }

function Profile({ m, ctx, canBook, onBook }: { m: TeamMemberData; ctx?: BookingContext; canBook: boolean; onBook: () => void }) {
  const config = useSchedulingConfig(ctx?.slug ?? "-", ctx?.config ?? ({ timezone: "Europe/London", rules: {}, staff: [], exceptions: [], blocks: [], serviceOverrides: [] } as never))
  const { state } = useBookingState(ctx?.slug ?? "-")
  const [now] = React.useState(() => Date.now())
  const hours = ctx ? config.staff.find((s) => s.staffId === m.id)?.hours : undefined
  const days = hours ? DAYS.filter((d) => (hours[d] ?? []).length > 0) : []
  const next = React.useMemo(() => {
    if (!ctx || !canBook) return null
    const svc = ctx.services.find((s) => m.services.some((x) => x.id === s.id) && isOnlineBookable(s))
    if (!svc) return null
    return nextAvailableDate({ now, config, service: { id: svc.id, durationMinutes: svc.durationMinutes! }, eligible: eligibleStaff(ctx, svc), staffPreference: m.id, bookings: state.bookings, holds: [], fromDate: localParts(now, config.timezone).date })
  }, [ctx, canBook, m, now, config, state.bookings])
  void addDays
  return (
    <div className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
      <div className="mx-auto w-44 max-w-full sm:w-full"><Portrait m={m} /></div>
      <div className="grid min-w-0 gap-4">
        {m.bio ? <p className="leading-relaxed [overflow-wrap:anywhere]">{m.bio}</p> : null}
        {m.subjects.length ? <ul className="flex flex-wrap gap-1.5" aria-label="Specialities">{m.subjects.map((x) => <li key={x} className="tp-chip">{x}</li>)}</ul> : null}
        {m.services.length ? (
          <section aria-labelledby={`svc-${m.id}`}>
            <h3 id={`svc-${m.id}`} className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-tp-muted">Services {first(m.name)} provides</h3>
            <ul className="grid gap-1 text-sm">{m.services.map((s) => <li key={s.id} className="flex justify-between gap-3"><span>{s.name}{s.minutes ? <span className="text-tp-muted"> · {s.minutes} min</span> : null}</span><span className="font-semibold tabular-nums">{s.price}</span></li>)}</ul>
          </section>
        ) : null}
        {m.credentials.length ? <section aria-label="Qualifications"><h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-tp-muted">Experience and qualifications</h3><ul className="grid gap-1 text-sm">{m.credentials.map((c) => <li key={c} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-tp-accent" />{c}</li>)}</ul></section> : null}
        {days.length ? <p className="text-sm text-tp-muted">Works {days.map((d) => DAY_NAMES[d]).join(", ")}{next ? <> · Next available <strong className="text-tp-fg">{formatDay(next)}</strong></> : null}</p> : null}
        {canBook ? <Button className="min-h-12 justify-self-start bg-tp-accent px-6 text-tp-accent-fg hover:bg-tp-accent/90" onClick={onBook}><CalendarCheck /> Book with {first(m.name)}</Button> : null}
      </div>
    </div>
  )
}
