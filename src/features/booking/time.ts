/**
 * Wall-clock time in a named IANA zone, without a date library. Booking correctness depends on this being
 * right at daylight-saving boundaries, so it is small, explicit and tested against the real transitions.
 *
 * An "instant" is a UTC timestamp in milliseconds. A "local" time is a date (YYYY-MM-DD) and a time (HH:MM)
 * as a person in that zone reads a clock.
 */

const dtfCache = new Map<string, Intl.DateTimeFormat>()
function dtf(tz: string): Intl.DateTimeFormat {
  let f = dtfCache.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    dtfCache.set(tz, f)
  }
  return f
}

export interface LocalParts { date: string; time: string; weekday: number; minutes: number }

/** The wall-clock reading in `tz` at an instant. `weekday` is 0 (Sunday) to 6. */
export function localParts(instant: number, tz: string): LocalParts {
  const p: Record<string, string> = {}
  for (const part of dtf(tz).formatToParts(new Date(instant))) if (part.type !== "literal") p[part.type] = part.value
  const date = `${p.year}-${p.month}-${p.day}`
  const hh = p.hour === "24" ? "00" : p.hour!
  return { date, time: `${hh}:${p.minute}`, weekday: new Date(`${date}T00:00:00Z`).getUTCDay(), minutes: Number(hh) * 60 + Number(p.minute) }
}

/** Offset of `tz` from UTC at an instant, in minutes (positive = ahead of UTC). */
export function offsetMinutes(instant: number, tz: string): number {
  const p: Record<string, string> = {}
  for (const part of dtf(tz).formatToParts(new Date(instant))) if (part.type !== "literal") p[part.type] = part.value
  const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour) % 24, Number(p.minute), Number(p.second))
  return Math.round((asUtc - Math.floor(instant / 1000) * 1000) / 60000)
}

const parseDate = (d: string) => { const [y, m, day] = d.split("-").map(Number); return { y: y!, m: m!, d: day! } }
export const minutesOf = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h! * 60 + m! }
export const hhmm = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`

/**
 * The instant at which a clock in `tz` reads `date` `time`, or null when that wall time does not exist
 * (the hour skipped when clocks go forward). When it occurs twice (clocks go back) the first occurrence is used.
 */
export function localToInstant(date: string, time: string, tz: string): number | null {
  const { y, m, d } = parseDate(date)
  const mins = minutesOf(time)
  const naive = Date.UTC(y, m - 1, d, Math.floor(mins / 60), mins % 60)
  // Try the offsets in force a day either side; the right answer round-trips to the same wall time.
  const candidates = new Set<number>()
  for (const probe of [naive - 86400000, naive, naive + 86400000]) candidates.add(offsetMinutes(probe, tz))
  const hits: number[] = []
  for (const off of candidates) {
    const t = naive - off * 60000
    const lp = localParts(t, tz)
    if (lp.date === date && lp.minutes === mins) hits.push(t)
  }
  return hits.length ? Math.min(...hits) : null
}

export const addDays = (date: string, n: number): string => {
  const { y, m, d } = parseDate(date)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}
export const weekdayOf = (date: string): number => new Date(`${date}T00:00:00Z`).getUTCDay()
export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const
export type Weekday = (typeof WEEKDAYS)[number]
export const weekdayKey = (date: string): Weekday => WEEKDAYS[weekdayOf(date)]!

/** Calendar days from `a` to `b` (b - a), by date string. */
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000)

/** "Tue 3 Nov, 10:30" in the zone, for a customer-facing label. */
export function formatSlot(instant: number, tz: string, opts: { withZone?: boolean } = {}): string {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", ...(opts.withZone ? { timeZoneName: "short" } : {}) })
  return f.format(new Date(instant)).replace(",", "")
}
export function formatClock(instant: number, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(instant))
}
export function formatDay(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T00:00:00Z`))
}

/** True when the visitor's own zone differs from the business's at this instant, so times need a clarifying hint. */
export function zonesDiffer(businessTz: string, viewerTz: string, instant: number): boolean {
  return offsetMinutes(instant, businessTz) !== offsetMinutes(instant, viewerTz)
}
