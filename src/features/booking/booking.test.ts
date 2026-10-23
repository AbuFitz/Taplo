import { describe, expect, it } from "vitest"
import { getAvailability, windowInstants } from "./availability"
import { canCancel, canReschedule, emptyState, expirePending, holdSlot, placeBooking, reschedule, setStatus, submitEnquiry, type BookingState } from "./engine"
import { localParts, localToInstant, offsetMinutes } from "./time"
import { schedulingConfig, type SchedulingConfig } from "./types"

const TZ = "Europe/London"
const at = (date: string, time: string, tz = TZ) => localToInstant(date, time, tz)!
const week = (windows: { start: string; end: string }[]) => ({ mon: windows, tue: windows, wed: windows, thu: windows, fri: windows, sat: [], sun: [] })
const cfg = (over: Partial<SchedulingConfig> = {}): SchedulingConfig => schedulingConfig.parse({ timezone: TZ, rules: { minNoticeMinutes: 0, slotIntervalMinutes: 60, maxAdvanceDays: 90 }, staff: [{ staffId: "", hours: week([{ start: "09:00", end: "17:00" }]) }], ...over })
const svc = { id: "s1", durationMinutes: 60 }
const NOW = at("2026-11-02", "08:00") // a Monday
let n = 0
const ids = { newId: () => `id${++n}`, newToken: () => `tok${n}` }
const base = { now: NOW, service: { ...svc, name: "Cut", priceLabel: "£30" }, eligible: [""], staffId: null as string | null, customer: { name: "Sam", email: "sam@example.com" }, mode: "instant" as const, ...ids }

describe("time zones", () => {
  it("knows the offsets and the real transitions in Europe/London", () => {
    expect(offsetMinutes(at("2026-07-01", "12:00"), TZ)).toBe(60)
    expect(offsetMinutes(at("2026-01-01", "12:00"), TZ)).toBe(0)
  })
  it("a wall time skipped by clocks going forward does not exist; the next one does", () => {
    expect(localToInstant("2026-03-29", "01:30", TZ)).toBeNull()
    expect(localToInstant("2026-03-29", "02:30", TZ)).toBe(Date.UTC(2026, 2, 29, 1, 30))
  })
  it("a wall time repeated when clocks go back resolves to the first occurrence", () => {
    expect(localToInstant("2026-10-25", "01:30", TZ)).toBe(Date.UTC(2026, 9, 25, 0, 30))
    expect(localParts(Date.UTC(2026, 9, 25, 1, 30), TZ).time).toBe("01:30") // the second 01:30 reads the same on the clock
  })
  it("round-trips ordinary times in other zones", () => {
    const t = at("2026-11-02", "09:00", "America/New_York")
    expect(localParts(t, "America/New_York")).toMatchObject({ date: "2026-11-02", time: "09:00" })
    expect(t).toBe(Date.UTC(2026, 10, 2, 14, 0))
  })
  it("a day has 23 hours when clocks go forward and 25 when they go back", () => {
    const len = (d: string, next: string) => (at(next, "00:00") - at(d, "00:00")) / 3600000
    expect(len("2026-03-29", "2026-03-30")).toBe(23)
    expect(len("2026-10-25", "2026-10-26")).toBe(25)
  })
  it("a window across the skipped hour starts at the first real time", () => {
    const [s] = windowInstants("2026-03-29", { start: "01:30", end: "04:00" }, TZ)!
    expect(s).toBe(Date.UTC(2026, 2, 29, 1, 0)) // 02:00 BST
  })
})

describe("availability rules", () => {
  const day = (c: SchedulingConfig, state: BookingState = emptyState(), date = "2026-11-03", extra: object = {}) =>
    getAvailability({ now: NOW, config: c, service: svc, eligible: [""], bookings: state.bookings, holds: state.holds, fromDate: date, days: 1, ...extra })[0]!

  it("offers one slot per hour inside working hours and none on a closed day", () => {
    expect(day(cfg()).slots).toHaveLength(8)
    expect(day(cfg(), emptyState(), "2026-11-07")).toMatchObject({ slots: [], reason: "closed" }) // Saturday
  })
  it("respects a lunch gap between two windows", () => {
    const c = cfg({ staff: [{ staffId: "", hours: week([{ start: "09:00", end: "12:00" }, { start: "13:00", end: "17:00" }]) }] })
    expect(day(c).slots.map((s) => localParts(s.startsAt, TZ).time)).toEqual(["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"])
  })
  it("applies minimum notice and the advance-booking window", () => {
    const c = cfg({ rules: { ...cfg().rules, minNoticeMinutes: 24 * 60 } })
    expect(getAvailability({ now: NOW, config: c, service: svc, eligible: [""], bookings: [], holds: [], fromDate: "2026-11-02", days: 1 })[0]).toMatchObject({ slots: [], reason: "too_soon" })
    const far = cfg({ rules: { ...cfg().rules, maxAdvanceDays: 7 } })
    expect(getAvailability({ now: NOW, config: far, service: svc, eligible: [""], bookings: [], holds: [], fromDate: "2026-11-12", days: 1 })[0]!.reason).toBe("too_far")
  })
  it("date exceptions close a day or change its hours", () => {
    const closed = cfg({ exceptions: [{ id: "x", date: "2026-11-03", staffId: null, windows: [] }] })
    expect(day(closed)).toMatchObject({ slots: [], reason: "closed" })
    const short = cfg({ exceptions: [{ id: "x", date: "2026-11-03", staffId: null, windows: [{ start: "10:00", end: "12:00" }] }] })
    expect(day(short).slots).toHaveLength(2)
  })
  it("blocked time removes only the slots it overlaps", () => {
    const c = cfg({ blocks: [{ id: "b", staffId: null, startsAt: at("2026-11-03", "12:00"), endsAt: at("2026-11-03", "14:00"), reason: "Training" }] })
    expect(day(c).slots.map((s) => localParts(s.startsAt, TZ).time)).not.toContain("12:00")
    expect(day(c).slots).toHaveLength(6)
  })
  it("buffers keep neighbouring bookings apart", () => {
    const c = cfg({ rules: { ...cfg().rules, bufferAfterMinutes: 30 } })
    const r = placeBooking({ ...base, config: c, state: emptyState(), startsAt: at("2026-11-03", "10:00"), idempotencyKey: "k1" })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const times = day(c, r.value.state).slots.map((s) => localParts(s.startsAt, TZ).time)
    expect(times).not.toContain("10:00")
    expect(times).not.toContain("11:00") // 11:00 would start inside the 30 minute buffer after 10:00-11:00
    expect(times).toContain("12:00")
  })
  it("the start grid is the configured interval", () => {
    const c = cfg({ rules: { ...cfg().rules, slotIntervalMinutes: 30 } })
    expect(day(c).slots.length).toBe(15)
  })
  it("daylight saving: no slot lands in the skipped hour, and the day is the right length", () => {
    const c = schedulingConfig.parse({ timezone: TZ, rules: { minNoticeMinutes: 0, slotIntervalMinutes: 60, maxAdvanceDays: 400 }, staff: [{ staffId: "", hours: { sun: [{ start: "00:00", end: "06:00" }] } }] })
    const q = (date: string) => getAvailability({ now: at("2026-03-01", "08:00"), config: c, service: svc, eligible: [""], bookings: [], holds: [], fromDate: date, days: 1 })[0]!
    expect(q("2026-03-29").slots).toHaveLength(5) // 00:00 to 06:00 BST is five real hours on the day clocks go forward
    expect(q("2026-03-22").slots).toHaveLength(6)
    const cb = (date: string) => getAvailability({ now: at("2026-10-01", "08:00"), config: c, service: svc, eligible: [""], bookings: [], holds: [], fromDate: date, days: 1 })[0]!
    expect(cb("2026-10-25").slots).toHaveLength(7) // clocks go back: that window holds seven real hours
  })
})

describe("staff, capacity and holds", () => {
  const two = cfg({ staff: [{ staffId: "a", hours: week([{ start: "09:00", end: "17:00" }]) }, { staffId: "b", hours: week([{ start: "10:00", end: "14:00" }]) }] })
  const slot10 = at("2026-11-03", "10:00")
  it("'anyone' is offered when at least one eligible person is free; a named person narrows it", () => {
    const any = getAvailability({ now: NOW, config: two, service: svc, eligible: ["a", "b"], bookings: [], holds: [], fromDate: "2026-11-03", days: 1 })[0]!
    expect(any.slots.find((s) => s.startsAt === slot10)!.staffIds).toEqual(["a", "b"])
    const onlyB = getAvailability({ now: NOW, config: two, service: svc, eligible: ["a", "b"], staffPreference: "b", bookings: [], holds: [], fromDate: "2026-11-03", days: 1 })[0]!
    expect(onlyB.slots).toHaveLength(4)
  })
  it("only people eligible for the service are considered", () => {
    const d = getAvailability({ now: NOW, config: two, service: svc, eligible: ["b"], bookings: [], holds: [], fromDate: "2026-11-03", days: 1 })[0]!
    expect(d.slots.every((s) => s.staffIds.join() === "b")).toBe(true)
  })
  it("taking one person's slot leaves the other free; taking both closes it", () => {
    let state = emptyState()
    const book = (staffId: string | null, key: string) => placeBooking({ ...base, config: two, state, eligible: ["a", "b"], staffId, startsAt: slot10, idempotencyKey: key })
    const r1 = book("a", "k1"); expect(r1.ok).toBe(true); if (r1.ok) state = r1.value.state
    const r2 = book(null, "k2"); expect(r2.ok && r2.value.booking.staffId).toBe("b"); if (r2.ok) state = r2.value.state
    const r3 = book(null, "k3"); expect(r3.ok).toBe(false)
  })
  it("capacity lets a class take several bookings at one start, then closes", () => {
    const c = cfg({ serviceOverrides: [{ serviceId: "s1", capacity: 2 }] })
    let state = emptyState()
    for (const k of ["k1", "k2"]) { const r = placeBooking({ ...base, config: c, state, startsAt: at("2026-11-03", "10:00"), idempotencyKey: k }); expect(r.ok).toBe(true); if (r.ok) state = r.value.state }
    expect(placeBooking({ ...base, config: c, state, startsAt: at("2026-11-03", "10:00"), idempotencyKey: "k3" }).ok).toBe(false)
  })
  it("a held slot is unavailable to others until the hold expires", () => {
    const h = holdSlot({ ...base, config: cfg(), state: emptyState(), startsAt: at("2026-11-03", "10:00"), idempotencyKey: "alice" })
    expect(h.ok).toBe(true); if (!h.ok) return
    const blocked = placeBooking({ ...base, config: cfg(), state: h.value.state, startsAt: at("2026-11-03", "10:00"), idempotencyKey: "bob" })
    expect(blocked.ok).toBe(false)
    const own = placeBooking({ ...base, config: cfg(), state: h.value.state, startsAt: at("2026-11-03", "10:00"), idempotencyKey: "alice" })
    expect(own.ok).toBe(true)
    const later = placeBooking({ ...base, now: NOW + 11 * 60000, config: cfg(), state: h.value.state, startsAt: at("2026-11-03", "10:00"), idempotencyKey: "bob" })
    expect(later.ok).toBe(true)
  })
})

describe("placing, retrying, conflicts", () => {
  const c = cfg()
  const t = at("2026-11-03", "10:00")
  it("a request waits for approval; an instant booking is confirmed", () => {
    const inst = placeBooking({ ...base, config: c, state: emptyState(), startsAt: t, idempotencyKey: "i" })
    const req = placeBooking({ ...base, config: c, state: emptyState(), startsAt: t, mode: "request", idempotencyKey: "r" })
    expect(inst.ok && inst.value.booking.status).toBe("confirmed")
    expect(req.ok && req.value.booking.status).toBe("pending")
    expect(req.ok && req.value.booking.expiresAt).toBe(NOW + 48 * 3600000)
  })
  it("a retry with the same key returns the same booking and creates no second one", () => {
    const a = placeBooking({ ...base, config: c, state: emptyState(), startsAt: t, idempotencyKey: "same" })
    if (!a.ok) throw new Error("setup")
    const b = placeBooking({ ...base, config: c, state: a.value.state, startsAt: t, idempotencyKey: "same" })
    expect(b.ok && b.replay).toBe(true)
    expect(b.ok && b.value.state.bookings).toHaveLength(1)
  })
  it("two customers racing for one slot: exactly one wins, the other is told clearly", () => {
    const a = placeBooking({ ...base, config: c, state: emptyState(), startsAt: t, idempotencyKey: "a" })
    if (!a.ok) throw new Error("setup")
    const b = placeBooking({ ...base, config: c, state: a.value.state, startsAt: t, idempotencyKey: "b" })
    expect(b.ok).toBe(false)
    if (!b.ok && b.error.code === "slot_unavailable") expect(b.error.message).toMatch(/Pick another/)
  })
  it("rejects off-grid, closed-hour and past times even if a stale screen offered them", () => {
    for (const startsAt of [at("2026-11-03", "10:30"), at("2026-11-03", "20:00"), at("2026-11-01", "10:00")]) expect(placeBooking({ ...base, config: c, state: emptyState(), startsAt, idempotencyKey: `x${startsAt}` }).ok).toBe(false)
  })
  it("validation keeps the customer's input and names the problem", () => {
    const r = placeBooking({ ...base, customer: { name: "", email: "nope" }, config: c, state: emptyState(), startsAt: t, idempotencyKey: "v" })
    expect(r.ok).toBe(false)
    if (!r.ok && r.error.code === "invalid") expect(Object.keys(r.error.fields)).toEqual(expect.arrayContaining(["name", "email"]))
    const none = placeBooking({ ...base, customer: { name: "Sam" }, config: c, state: emptyState(), startsAt: t, idempotencyKey: "v2" })
    expect(none.ok).toBe(false)
  })
  it("an unanswered request expires and frees the time", () => {
    const r = placeBooking({ ...base, config: c, state: emptyState(), startsAt: t, mode: "request", idempotencyKey: "p" })
    if (!r.ok) throw new Error("setup")
    const later = NOW + 49 * 3600000
    const stillThere = getAvailability({ now: later - 3 * 86400000 + 86400000, config: c, service: svc, eligible: [""], bookings: r.value.state.bookings, holds: [], fromDate: "2026-11-03", days: 1 })[0]!
    expect(stillThere.slots.find((s) => s.startsAt === t)).toBeUndefined()
    const expired = expirePending(r.value.state, later)
    expect(expired.bookings[0]!.status).toBe("expired")
  })
})

describe("status, cancel and reschedule", () => {
  const c = cfg({ rules: { ...cfg().rules, cancelUntilHours: 24, rescheduleUntilHours: 24 } })
  const book = (date: string, time: string, mode: "instant" | "request" = "instant", key = `k${date}${time}`) => {
    const r = placeBooking({ ...base, config: c, state: emptyState(), startsAt: at(date, time), mode, idempotencyKey: key })
    if (!r.ok) throw new Error("setup")
    return r.value
  }
  it("follows the allowed status moves and records history", () => {
    const { booking, state } = book("2026-11-10", "10:00", "request")
    const ok = setStatus(state, booking.id, "confirmed", NOW)
    expect(ok.ok).toBe(true)
    if (ok.ok) { expect(ok.value.bookings[0]!.status).toBe("confirmed"); expect(ok.value.bookings[0]!.history.map((h) => h.status)).toEqual(["pending", "confirmed"]) }
    const closed = setStatus(state, booking.id, "declined", NOW)
    if (!closed.ok) throw new Error("setup")
    expect(setStatus(closed.value, booking.id, "confirmed", NOW).ok).toBe(false)
  })
  it("cancellation and rescheduling honour the notice rule", () => {
    const far = book("2026-11-10", "10:00").booking
    const near = book("2026-11-02", "12:00").booking // NOW is 08:00 the same day: four hours away
    expect(canCancel(far, NOW, c).ok).toBe(true)
    expect(canCancel(near, NOW, c).ok).toBe(false)
    expect(canReschedule(near, NOW, c).reason).toMatch(/24 hours/)
  })
  it("rescheduling checks the new time, ignoring the booking itself", () => {
    const { booking, state } = book("2026-11-10", "10:00")
    const same = reschedule({ ...base, config: c, state, bookingId: booking.id, startsAt: at("2026-11-10", "11:00"), staffId: null })
    expect(same.ok).toBe(true)
    if (same.ok) expect(same.value.bookings[0]!.startsAt).toBe(at("2026-11-10", "11:00"))
    expect(reschedule({ ...base, config: c, state, bookingId: booking.id, startsAt: at("2026-11-10", "23:00"), staffId: null }).ok).toBe(false)
  })
})

describe("enquiries", () => {
  it("reserve no time and are idempotent", () => {
    const input = { name: "Ana", email: "ana@example.com", message: "Do you do kids' cuts?" }
    let s = submitEnquiry(emptyState(), input, { now: NOW, key: "e1", newId: () => "e" })
    s = submitEnquiry(s, input, { now: NOW, key: "e1", newId: () => "e2" })
    expect(s.enquiries).toHaveLength(1)
    expect(s.bookings).toHaveLength(0)
  })
})
