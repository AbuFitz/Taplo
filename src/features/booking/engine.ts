import { getAvailability, isBlocking, type ServiceTiming } from "./availability"
import { localParts } from "./time"
import { customerDetails, type Booking, type BookingStatus, type CustomerDetails, type Enquiry, type EnquiryInput, type Hold, type SchedulingConfig } from "./types"

/**
 * Booking state transitions as pure functions over a snapshot. The demo adapter stores the snapshot in the
 * browser; the connected path runs the same rules in SQL (`public.create_booking` etc.). Every write
 * re-checks availability against the snapshot it is given, so a stale screen can never double-book.
 */

export interface BookingState { bookings: Booking[]; holds: Hold[]; enquiries: Enquiry[] }
export const emptyState = (): BookingState => ({ bookings: [], holds: [], enquiries: [] })

export type BookingMode = "instant" | "request"

export type BookError =
  | { code: "invalid"; fields: Partial<Record<keyof CustomerDetails, string>> }
  | { code: "slot_unavailable"; message: string }
  | { code: "not_found" }
  | { code: "not_allowed"; message: string }

export type Result<T> = { ok: true; value: T; replay?: boolean } | { ok: false; error: BookError }

export interface BookInput {
  now: number
  config: SchedulingConfig
  state: BookingState
  service: ServiceTiming & { name: string; priceLabel: string }
  eligible: string[]
  /** A person, or null for "anyone": the first free person is assigned. */
  staffId: string | null
  startsAt: number
  customer: unknown
  mode: BookingMode
  idempotencyKey: string
  customerTimezone?: string
  newId: () => string
  newToken: () => string
}

const day = (ms: number, tz: string) => localParts(ms, tz).date

/** Place a booking. Idempotent on `idempotencyKey`: a retry returns the original booking and changes nothing. */
export function placeBooking(i: BookInput): Result<{ booking: Booking; state: BookingState }> {
  const prior = i.state.bookings.find((b) => b.idempotencyKey === i.idempotencyKey)
  if (prior) return { ok: true, value: { booking: prior, state: i.state }, replay: true }

  const parsed = customerDetails.safeParse(i.customer)
  if (!parsed.success) {
    const fields: Partial<Record<keyof CustomerDetails, string>> = {}
    for (const issue of parsed.error.issues) fields[(issue.path[0] as keyof CustomerDetails) ?? "email"] ??= issue.message
    return { ok: false, error: { code: "invalid", fields } }
  }

  const tz = i.config.timezone
  const date = day(i.startsAt, tz)
  const avail = getAvailability({ now: i.now, config: i.config, service: i.service, eligible: i.eligible, staffPreference: i.staffId, bookings: i.state.bookings, holds: heldByOthers(i.state.holds, i.idempotencyKey), fromDate: date, days: 1 })
  const slot = avail[0]?.slots.find((s) => s.startsAt === i.startsAt)
  if (!slot) return { ok: false, error: { code: "slot_unavailable", message: "That time has just been taken. Pick another time; nothing you typed is lost." } }

  const staffId = i.staffId ?? slot.staffIds[0]!
  const ov = i.config.serviceOverrides.find((o) => o.serviceId === i.service.id)
  const before = (ov?.bufferBeforeMinutes ?? i.config.rules.bufferBeforeMinutes) * 60000
  const after = (ov?.bufferAfterMinutes ?? i.config.rules.bufferAfterMinutes) * 60000
  const status: BookingStatus = i.mode === "instant" ? "confirmed" : "pending"
  const booking: Booking = {
    id: i.newId(), serviceId: i.service.id, serviceName: i.service.name, staffId,
    startsAt: slot.startsAt, endsAt: slot.endsAt, blockStart: slot.startsAt - before, blockEnd: slot.endsAt + after,
    status, mode: i.mode, customer: parsed.data, durationMinutes: i.service.durationMinutes, priceLabel: i.service.priceLabel,
    createdAt: i.now, expiresAt: status === "pending" ? i.now + i.config.rules.pendingExpiryHours * 3600000 : undefined,
    idempotencyKey: i.idempotencyKey, customerTimezone: i.customerTimezone, manageToken: i.newToken(), history: [{ at: i.now, status }],
  }
  const state: BookingState = { ...i.state, bookings: [...i.state.bookings, booking], holds: i.state.holds.filter((h) => h.key !== i.idempotencyKey) }
  return { ok: true, value: { booking, state } }
}

const heldByOthers = (holds: Hold[], key: string) => holds.filter((h) => h.key !== key)

/** Hold a slot while the customer types. Replaces that customer's earlier hold; refuses a slot someone else holds. */
export function holdSlot(i: Omit<BookInput, "customer" | "mode" | "service"> & { service: ServiceTiming }): Result<{ hold: Hold; state: BookingState }> {
  const date = day(i.startsAt, i.config.timezone)
  const others = heldByOthers(i.state.holds, i.idempotencyKey)
  const avail = getAvailability({ now: i.now, config: i.config, service: i.service, eligible: i.eligible, staffPreference: i.staffId, bookings: i.state.bookings, holds: others, fromDate: date, days: 1 })
  const slot = avail[0]?.slots.find((s) => s.startsAt === i.startsAt)
  if (!slot) return { ok: false, error: { code: "slot_unavailable", message: "Someone else is booking that time. Pick another." } }
  const staffId = i.staffId ?? slot.staffIds[0]!
  const ov = i.config.serviceOverrides.find((o) => o.serviceId === i.service.id)
  const hold: Hold = {
    id: i.newId(), staffId, serviceId: i.service.id, key: i.idempotencyKey, expiresAt: i.now + i.config.rules.holdMinutes * 60000,
    blockStart: slot.startsAt - (ov?.bufferBeforeMinutes ?? i.config.rules.bufferBeforeMinutes) * 60000, blockEnd: slot.endsAt + (ov?.bufferAfterMinutes ?? i.config.rules.bufferAfterMinutes) * 60000,
  }
  return { ok: true, value: { hold, state: { ...i.state, holds: [...others.filter((h) => h.expiresAt > i.now), hold] } } }
}

export const hoursUntil = (b: Booking, now: number) => (b.startsAt - now) / 3600000

export function canCancel(b: Booking, now: number, config: SchedulingConfig): { ok: boolean; reason?: string } {
  if (!["confirmed", "pending"].includes(b.status)) return { ok: false, reason: "This booking is already closed." }
  if (b.startsAt <= now) return { ok: false, reason: "This time has passed." }
  if (b.status === "confirmed" && hoursUntil(b, now) < config.rules.cancelUntilHours) return { ok: false, reason: `Bookings can be cancelled up to ${config.rules.cancelUntilHours} hours before. Please contact the business.` }
  return { ok: true }
}
export function canReschedule(b: Booking, now: number, config: SchedulingConfig): { ok: boolean; reason?: string } {
  if (!["confirmed", "pending"].includes(b.status)) return { ok: false, reason: "This booking is already closed." }
  if (b.startsAt <= now) return { ok: false, reason: "This time has passed." }
  if (b.status === "confirmed" && hoursUntil(b, now) < config.rules.rescheduleUntilHours) return { ok: false, reason: `Bookings can be moved up to ${config.rules.rescheduleUntilHours} hours before. Please contact the business.` }
  return { ok: true }
}

export function setStatus(state: BookingState, id: string, status: BookingStatus, now: number, note?: string): Result<BookingState> {
  const b = state.bookings.find((x) => x.id === id)
  if (!b) return { ok: false, error: { code: "not_found" } }
  const allowed: Record<BookingStatus, BookingStatus[]> = {
    pending: ["confirmed", "declined", "cancelled", "expired"], confirmed: ["cancelled", "completed", "no_show"],
    declined: [], cancelled: [], completed: [], no_show: [], expired: [],
  }
  if (b.status === status) return { ok: true, value: state }
  if (!allowed[b.status].includes(status)) return { ok: false, error: { code: "not_allowed", message: `A ${b.status.replace("_", " ")} booking cannot become ${status.replace("_", " ")}.` } }
  const next: Booking = { ...b, status, expiresAt: status === "confirmed" ? undefined : b.expiresAt, history: [...b.history, { at: now, status, note }] }
  return { ok: true, value: { ...state, bookings: state.bookings.map((x) => (x.id === id ? next : x)) } }
}

/** Move a booking to another time, checking availability as if the booking itself were not there. The status stays the same. */
export function reschedule(i: Omit<BookInput, "customer" | "mode" | "idempotencyKey" | "newToken" | "service" | "staffId"> & { bookingId: string; service: ServiceTiming; staffId: string | null }): Result<BookingState> {
  const b = i.state.bookings.find((x) => x.id === i.bookingId)
  if (!b) return { ok: false, error: { code: "not_found" } }
  const date = day(i.startsAt, i.config.timezone)
  const avail = getAvailability({ now: i.now, config: i.config, service: i.service, eligible: i.eligible, staffPreference: i.staffId ?? b.staffId, bookings: i.state.bookings, holds: i.state.holds, fromDate: date, days: 1, ignoreBookingId: b.id })
  const slot = avail[0]?.slots.find((s) => s.startsAt === i.startsAt)
  if (!slot) return { ok: false, error: { code: "slot_unavailable", message: "That time is not available." } }
  const staffId = i.staffId ?? b.staffId
  const moved: Booking = { ...b, staffId, startsAt: slot.startsAt, endsAt: slot.endsAt, blockStart: slot.startsAt - (b.startsAt - b.blockStart), blockEnd: slot.endsAt + (b.blockEnd - b.endsAt), history: [...b.history, { at: i.now, status: b.status, note: "Rescheduled" }] }
  return { ok: true, value: { ...i.state, bookings: i.state.bookings.map((x) => (x.id === b.id ? moved : x)) } }
}

/** Mark pending requests whose time to answer has passed as expired, so they stop holding the slot. */
export function expirePending(state: BookingState, now: number): BookingState {
  let changed = false
  const bookings = state.bookings.map((b) => {
    if (b.status === "pending" && b.expiresAt !== undefined && b.expiresAt <= now) { changed = true; return { ...b, status: "expired" as const, history: [...b.history, { at: now, status: "expired" as const, note: "No reply in time" }] } }
    return b
  })
  const holds = state.holds.filter((h) => h.expiresAt > now)
  return changed || holds.length !== state.holds.length ? { ...state, bookings, holds } : state
}

/** Enquiries reserve no time. Idempotent on the key. */
export function submitEnquiry(state: BookingState, input: EnquiryInput, ctx: { now: number; key: string; newId: () => string }): BookingState {
  if (state.enquiries.some((e) => e.idempotencyKey === ctx.key)) return state
  const e: Enquiry = { id: ctx.newId(), name: input.name, email: input.email, phone: input.phone, message: input.message, serviceId: input.serviceId, createdAt: ctx.now, status: "new", idempotencyKey: ctx.key }
  return { ...state, enquiries: [e, ...state.enquiries] }
}

export { isBlocking }
