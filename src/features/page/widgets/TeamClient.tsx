"use client"

import * as React from "react"
import { ArrowRight, CalendarCheck, Check } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { cn } from "@/lib/utils"
import { initialsOf } from "@/lib/validation"
import { nextAvailableDate } from "@/features/booking/availability"
import { useBookingState, useSchedulingConfig } from "@/features/booking/demo-adapter"
import { eligibleStaff, isOnlineBookable, type BookingContext } from "@/features/booking/model"
import { formatDay, localParts } from "@/features/booking/time"
import { BookingFlow } from "@/features/booking/ui/BookingFlow"
import { Collection } from "./Collection"
import { ProfileImage } from "../renderer/ProfileImage"

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

function Portrait({ m, className, ratio = "4 / 5", sizes = "(min-width:720px) 20rem, 50vw", decorative = false }: { m: TeamMemberData; className?: string; ratio?: string; sizes?: string; decorative?: boolean }) {
  return (
    <div className={cn("tp-portrait", className)} style={{ aspectRatio: ratio }} aria-hidden={decorative || undefined}>
      {m.photo ? (
        <ProfileImage image={m.photo} sizes={sizes} />
      ) : <span aria-hidden="true" className="tp-portrait-blank"><span className="font-tp-heading text-xl font-semibold">{initialsOf(m.name)}</span></span>}
    </div>
  )
}

/**
 * The team, compact by default. "list" is one row per person; "swipe" and "grid" are portrait cards. Every
 * person opens an expanded profile (biography, what they do, qualifications the business supplied, when they
 * work, and booking with them). Booking from a profile closes the profile and opens the booking journey, so
 * there are never two overlays stacked. No private contact details are ever in this data.
 */
export function TeamMembers({ members, variant: chosen, ctx }: { members: TeamMemberData[]; variant: "list" | "swipe" | "grid" | "avatars"; ctx?: BookingContext }) {
  // Portrait cards need portraits. With none supplied, a wall of identical silhouettes says "unfinished", so people are listed instead.
  const variant = (chosen === "swipe" || chosen === "grid") && !members.some((m) => m.photo) ? "list" : chosen
  const [profile, setProfile] = React.useState<string | null>(null)
  const [book, setBook] = React.useState<{ staffId: string } | null>(null)
  const member = members.find((m) => m.id === profile) ?? null
  const canBook = (m: TeamMemberData) => Boolean(ctx && m.bookable && ctx.staff.some((s) => s.id === m.id) && m.services.some((s) => ctx.services.find((x) => x.id === s.id && isOnlineBookable(x))))

  const card = (m: TeamMemberData, ratio = "4 / 5") => (
    <article className="tp-team-card" data-testid="team-card">
      <button type="button" className="tp-team-open" onClick={() => setProfile(m.id)}>
        <Portrait m={m} ratio={ratio} />
        <span className="tp-team-name">{m.name}</span>
        {m.role ? <span className="tp-team-role">{m.role}</span> : null}
        {m.summary ? <span className="tp-team-summary">{m.summary}</span> : null}
        <span className="sr-only">. View profile</span>
      </button>
      {canBook(m) ? <button type="button" className="tp-btn" data-variant="compact" onClick={() => setBook({ staffId: m.id })}><span className="tp-btn-main"><span className="tp-btn-label">Book with {first(m.name)}</span></span><ArrowRight aria-hidden="true" className="size-4" /></button> : null}
    </article>
  )

  const row = (m: TeamMemberData) => (
    <li key={m.id} className="tp-team-row" data-testid="team-card">
      <button type="button" className="tp-team-row-open" onClick={() => setProfile(m.id)}>
        <Portrait m={m} className="tp-portrait-sm" ratio="1 / 1" sizes="56px" />
        <span className="min-w-0 text-left"><span className="tp-team-name block">{m.name}</span>{m.role ? <span className="tp-team-role block">{m.role}</span> : null}{m.summary ? <span className="tp-team-summary block">{m.summary}</span> : null}<span className="sr-only">. View profile</span></span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 opacity-60" />
      </button>
    </li>
  )

  return (
    <>
      {variant === "swipe" ? <Collection label="Team" compact>{members.map((m) => <React.Fragment key={m.id}>{card(m, "1 / 1")}</React.Fragment>)}</Collection>
        : variant === "grid" ? <ul className="tp-team-grid">{members.map((m) => <li key={m.id}>{card(m)}</li>)}</ul>
        : variant === "avatars" ? <ul className="tp-team-avatars">{members.map((m) => <li key={m.id}><button type="button" onClick={() => setProfile(m.id)}><Portrait m={m} className="tp-portrait-sm" ratio="1 / 1" sizes="64px" decorative /><span className="text-sm font-semibold leading-tight">{first(m.name)}</span><span className="sr-only">{m.name.slice(first(m.name).length)}. View profile</span></button></li>)}</ul>
        : <ul className="tp-rows tp-team-list">{members.map(row)}</ul>}

      <Overlay tone="page" kind="detail" open={profile !== null} onOpenChange={(o) => !o && setProfile(null)} title={member?.name ?? "Profile"} description={member?.role} testId="team-profile" footer={member && canBook(member) ? <button type="button" className="tp-btn tp-profile-book" onClick={() => { setProfile(null); setBook({ staffId: member.id }) }}><CalendarCheck aria-hidden="true" className="size-4"/><span>Book with {first(member.name)}</span><ArrowRight aria-hidden="true" className="size-4"/></button> : undefined}>
        {member ? <Profile m={member} ctx={ctx} canBook={canBook(member)} /> : null}
      </Overlay>
      {ctx ? <BookingFlow ctx={ctx} staffId={book?.staffId} open={book !== null} onOpenChange={(o) => !o && setBook(null)} title={book ? `Book with ${first(ctx.staff.find((s) => s.id === book.staffId)?.name ?? "")}` : undefined} key={book?.staffId ?? "none"} /> : null}
    </>
  )
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const DAY_NAMES = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }

function Profile({ m, ctx, canBook }: { m: TeamMemberData; ctx?: BookingContext; canBook: boolean }) {
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
  return (
    <div className={m.photo ? "grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6" : "grid gap-5"}>
      {/* A large grey silhouette says nothing, so the portrait is shown only when there is one. */}
      {m.photo ? <div className="mx-auto w-44 max-w-full sm:w-full"><Portrait m={m} sizes="176px" /></div> : null}
      <div className="grid min-w-0 gap-4">
        {m.bio ? <p className="leading-relaxed [overflow-wrap:anywhere]">{m.bio}</p> : null}
        {m.subjects.length ? <ul className="flex flex-wrap gap-1.5" aria-label="Specialities">{m.subjects.map((x) => <li key={x} className="tp-chip">{x}</li>)}</ul> : null}
        {m.services.length ? (
          <section aria-labelledby={`svc-${m.id}`}>
            <h3 id={`svc-${m.id}`} className="mb-1.5 text-sm font-semibold text-tp-muted">Services {first(m.name)} provides</h3>
            <ul className="tp-team-detail-services text-sm">{m.services.map((s) => <li key={s.id}><span className="min-w-0 [overflow-wrap:anywhere]"><span className="block font-medium">{s.name}</span>{s.minutes ? <span className="text-tp-muted">{s.minutes} min</span> : null}</span><span className="tp-price">{s.price}</span></li>)}</ul>
          </section>
        ) : null}
        {m.credentials.length ? <section aria-label="Qualifications"><h3 className="mb-1.5 text-sm font-semibold text-tp-muted">Experience and qualifications</h3><ul className="grid gap-1 text-sm">{m.credentials.map((c) => <li key={c} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-tp-accent" />{c}</li>)}</ul></section> : null}
        {days.length ? <p className="text-sm text-tp-muted">Works {days.map((d) => DAY_NAMES[d]).join(", ")}{next ? <> · Next available <strong className="text-tp-fg">{formatDay(next)}</strong></> : null}</p> : null}
      </div>
    </div>
  )
}
