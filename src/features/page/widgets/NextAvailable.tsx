"use client"

import * as React from "react"
import { CalendarCheck } from "lucide-react"
import { BookingFlow } from "@/features/booking/ui/BookingFlow"
import { getAvailability } from "@/features/booking/availability"
import { eligibleStaff, isOnlineBookable, type BookingContext } from "@/features/booking/model"
import { useBookingState, useSchedulingConfig } from "@/features/booking/demo-adapter"
import { nowMs } from "@/features/booking/clock"
import { formatClock, localParts } from "@/features/booking/time"

/** Four times spread across the day, so the choice is a real choice and not four neighbouring quarter-hours. */
const spread = <T,>(slots: T[], n: number): T[] => (slots.length <= n ? slots : Array.from({ length: n }, (_, i) => slots[Math.round((i * (slots.length - 1)) / (n - 1))]!))

const dayLabel = (date: string, today: string) => {
  const d = new Date(`${date}T00:00:00Z`)
  const diff = Math.round((d.getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86_400_000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(d)
}

/**
 * The next free times, right on the page: the next three days that have any, four times each. A time opens the booking
 * journey with that exact time already chosen. Everything comes from the live schedule, so a taken time disappears.
 */
export function NextAvailable({ ctx, serviceId, title }: { ctx: BookingContext; serviceId?: string | null; title?: string }) {
  const config = useSchedulingConfig(ctx.slug, ctx.config)
  const { state } = useBookingState(ctx.slug)
  const [now, setNow] = React.useState<number | null>(null)
  const [pick, setPick] = React.useState<{ date: string; startsAt: number } | null>(null)
  const [more, setMore] = React.useState(false)
  React.useEffect(() => setNow(nowMs()), [])
  const service = ctx.services.find((s) => s.id === serviceId && isOnlineBookable(s)) ?? ctx.services.find(isOnlineBookable)
  const tz = config.timezone
  const days = React.useMemo(() => {
    if (!service || now === null) return []
    return getAvailability({ now, config, service: { id: service.id, durationMinutes: service.durationMinutes! }, eligible: eligibleStaff(ctx, service), staffPreference: null, bookings: state.bookings, holds: state.holds, fromDate: localParts(now, tz).date, days: Math.min(config.rules.maxAdvanceDays + 1, 45) })
      .filter((d) => d.slots.length).slice(0, 3)
  }, [service, now, config, ctx, state, tz])
  if (!service) return null
  const today = now === null ? "" : localParts(now, tz).date
  return (
    <section className="tp-next" aria-label="Next available times" data-testid="next-available">
      <header className="tp-next-head"><CalendarCheck aria-hidden="true" /><div><h3>{title || "Next available"}</h3><p>{service.name}{service.durationMinutes ? ` · ${service.durationMinutes} min` : ""}</p></div></header>
      {now === null ? <div className="tp-next-skeleton" aria-hidden="true"><span /><span /><span /></div>
        : days.length === 0 ? <p className="tp-next-none">No times are free in the next few weeks. Open the diary to see everything, or send a message.</p>
        : <ul className="tp-next-days">{days.map((d) => (
          <li key={d.date}><span className="tp-next-day">{dayLabel(d.date, today)}</span>
            <span className="tp-next-times">{spread(d.slots, 4).map((s) => <button key={s.startsAt} type="button" className="tp-next-time" onClick={() => setPick({ date: d.date, startsAt: s.startsAt })}>{formatClock(s.startsAt, tz)}</button>)}</span>
          </li>))}</ul>}
      <button type="button" className="tp-next-more" onClick={() => setMore(true)}>More times</button>
      {pick ? <BookingFlow ctx={ctx} serviceId={service.id} slot={pick} open onOpenChange={(o) => !o && setPick(null)} key={pick.startsAt} title={`Book ${service.name}`} /> : null}
      {more ? <BookingFlow ctx={ctx} serviceId={service.id} open onOpenChange={(o) => !o && setMore(false)} title={`Book ${service.name}`} /> : null}
    </section>
  )
}
