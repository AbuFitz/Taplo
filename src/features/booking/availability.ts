import { addDays, daysBetween, localParts, localToInstant, minutesOf, weekdayKey } from "./time"
import { HOLDING, type Booking, type Hold, type SchedulingConfig, type TimeWindow, type WeeklyHours } from "./types"

/**
 * The availability engine: pure, deterministic, and the single definition of "which times can be booked".
 * The demo adapter calls it directly. The SQL function `create_booking` re-implements the same checks in
 * the database so the server stays authoritative (see supabase/migrations and tests/integration/booking.test.ts,
 * which asserts that the two agree).
 */

export interface ServiceTiming { id: string; durationMinutes: number }

export interface SlotQuery {
  now: number
  config: SchedulingConfig
  service: ServiceTiming
  /** Staff who can perform the service. [""] for a business with no staff list. */
  eligible: string[]
  /** A specific person the customer chose, or null for "no preference". */
  staffPreference?: string | null
  bookings: Booking[]
  holds: Hold[]
  /** First date (business-local) and how many days. */
  fromDate: string
  days: number
  /** Ignore this booking (rescheduling it). */
  ignoreBookingId?: string
}

export interface Slot { startsAt: number; endsAt: number; staffIds: string[] }
export type DayReason = "closed" | "past" | "too_soon" | "too_far" | "full"
export interface DayAvailability { date: string; slots: Slot[]; reason?: DayReason }

/** A wall-clock window as instants. A start inside a skipped hour moves to the first real time after it. */
export function windowInstants(date: string, w: TimeWindow, tz: string): [number, number] | null {
  const resolve = (time: string, dir: 1 | -1) => {
    const exact = localToInstant(date, time, tz)
    if (exact !== null) return exact
    let m = minutesOf(time)
    for (let i = 0; i < 180; i++) {
      m += dir
      if (m < 0 || m >= 24 * 60) return null
      const t = localToInstant(date, `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`, tz)
      if (t !== null) return t
    }
    return null
  }
  const s = resolve(w.start, 1)
  const e = resolve(w.end, -1)
  return s !== null && e !== null && e > s ? [s, e] : null
}

/** The windows a person works on a date: a date exception wins (their own, then the business-wide one), else the weekly pattern. */
export function windowsFor(config: SchedulingConfig, staffId: string, date: string): TimeWindow[] {
  const own = config.exceptions.find((x) => x.date === date && x.staffId === staffId)
  if (own) return own.windows
  const all = config.exceptions.find((x) => x.date === date && x.staffId === null)
  if (all) return all.windows
  const hours: WeeklyHours = config.staff.find((s) => s.staffId === staffId)?.hours ?? {}
  return hours[weekdayKey(date)] ?? []
}

const overlaps = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1

export function isBlocking(b: Booking, now: number): boolean {
  if (!HOLDING.includes(b.status)) return false
  if (b.status === "pending" && b.expiresAt !== undefined && b.expiresAt <= now) return false
  return true
}

export function getAvailability(q: SlotQuery): DayAvailability[] {
  const { config, service, now } = q
  const tz = config.timezone
  const rules = config.rules
  const ov = config.serviceOverrides.find((o) => o.serviceId === service.id)
  const bufBefore = (ov?.bufferBeforeMinutes ?? rules.bufferBeforeMinutes) * 60000
  const bufAfter = (ov?.bufferAfterMinutes ?? rules.bufferAfterMinutes) * 60000
  const capacity = ov?.capacity ?? 1
  const dur = service.durationMinutes * 60000
  const interval = rules.slotIntervalMinutes * 60000
  const today = localParts(now, tz).date
  const earliest = now + rules.minNoticeMinutes * 60000
  const staff = (q.staffPreference ? q.eligible.filter((s) => s === q.staffPreference) : q.eligible)

  const live = q.bookings.filter((b) => b.id !== q.ignoreBookingId && isBlocking(b, now))
  const holds = q.holds.filter((h) => h.expiresAt > now)

  const out: DayAvailability[] = []
  for (let i = 0; i < q.days; i++) {
    const date = addDays(q.fromDate, i)
    if (daysBetween(today, date) < 0) { out.push({ date, slots: [], reason: "past" }); continue }
    if (daysBetween(today, date) > rules.maxAdvanceDays) { out.push({ date, slots: [], reason: "too_far" }); continue }

    const byStart = new Map<number, Slot>()
    let anyWindow = false
    let sawTooSoon = false
    for (const sid of staff) {
      const wins = windowsFor(config, sid, date).map((w) => windowInstants(date, w, tz)).filter((x): x is [number, number] => x !== null)
      if (wins.length) anyWindow = true
      // Blocked time removes parts of windows.
      const blocks = config.blocks.filter((b) => b.staffId === null || b.staffId === sid)
      for (const [w0, w1] of wins) {
        for (let s = w0; s + dur <= w1; s += interval) {
          if (s < earliest) { sawTooSoon = true; continue }
          const e = s + dur
          if (blocks.some((b) => overlaps(s, e, b.startsAt, b.endsAt))) continue
          const occ0 = s - bufBefore
          const occ1 = e + bufAfter
          const mine = live.filter((b) => b.staffId === sid)
          let free: boolean
          if (capacity > 1) {
            const same = mine.filter((b) => b.serviceId === service.id && b.startsAt === s)
            const others = mine.filter((b) => !(b.serviceId === service.id && b.startsAt === s))
            free = same.length < capacity && !others.some((b) => overlaps(occ0, occ1, b.blockStart, b.blockEnd))
          } else {
            free = !mine.some((b) => overlaps(occ0, occ1, b.blockStart, b.blockEnd))
          }
          if (!free) continue
          if (holds.some((h) => h.staffId === sid && overlaps(occ0, occ1, h.blockStart, h.blockEnd))) continue
          const slot = byStart.get(s)
          if (slot) slot.staffIds.push(sid)
          else byStart.set(s, { startsAt: s, endsAt: e, staffIds: [sid] })
        }
      }
    }
    const slots = [...byStart.values()].sort((a, b) => a.startsAt - b.startsAt)
    out.push(slots.length ? { date, slots } : { date, slots: [], reason: !anyWindow ? "closed" : sawTooSoon ? "too_soon" : "full" })
  }
  return out
}

/** The first date at or after `from` that has any slot, within the booking window. */
export function nextAvailableDate(q: Omit<SlotQuery, "days">, horizonDays = 90): string | null {
  const step = 14
  for (let off = 0; off < horizonDays; off += step) {
    const days = getAvailability({ ...q, fromDate: addDays(q.fromDate, off), days: Math.min(step, horizonDays - off) })
    const hit = days.find((d) => d.slots.length)
    if (hit) return hit.date
  }
  return null
}
