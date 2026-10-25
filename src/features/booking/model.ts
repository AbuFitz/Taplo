import type { BusinessContent } from "@/features/businesses/content"
import { WEEKDAYS } from "./time"
import { schedulingConfig, type SchedulingConfig, type WeeklyHours } from "./types"

/** What the booking flow needs to know about a service, staff member and business: plain data, safe to pass to the browser. */
export interface BookableService {
  id: string
  name: string
  description?: string
  group?: string
  priceMode: "fixed" | "from" | "quote" | "free"
  priceMinor?: number
  currency: string
  durationMinutes?: number
  bookingMode: "contact" | "request" | "instant"
}
export interface BookableStaff {
  id: string
  name: string
  role?: string
  photo?: { src: string; alt: string; focal?: { x: number; y: number } }
  /** null = provides every service. */
  serviceIds: string[] | null
}
export interface BookingContext {
  slug: string
  businessName: string
  timezone: string
  services: BookableService[]
  staff: BookableStaff[]
  config: SchedulingConfig
  contact: { phone?: string; whatsapp?: string; email?: string }
}

const DAY_MAP: Record<string, keyof WeeklyHours> = { mon: "mon", tue: "tue", wed: "wed", thu: "thu", fri: "fri", sat: "sat", sun: "sun" }

/** A working pattern from the business's opening hours, the starting point until the owner sets their own. */
export function deriveConfig(c: BusinessContent): SchedulingConfig {
  const hours: WeeklyHours = {}
  for (const h of c.hours) if (h.opens && h.closes && h.opens < h.closes) hours[DAY_MAP[h.day]!] = [...(hours[DAY_MAP[h.day]!] ?? []), { start: h.opens, end: h.closes }]
  const people = c.staff.length ? c.staff.filter((s) => s.bookable !== false).map((s) => s.id) : [""]
  return schedulingConfig.parse({ timezone: c.location.timezone || "Europe/London", staff: people.map((id) => ({ staffId: id, hours })) })
}

export function buildContext(c: BusinessContent, config?: SchedulingConfig | null): BookingContext {
  return {
    slug: c.identity.slug,
    businessName: c.identity.name,
    timezone: (config ?? deriveConfig(c)).timezone,
    services: c.services.filter((s) => !s.archived).map((s) => ({ id: s.id, name: s.name, description: s.description, group: s.group, priceMode: s.priceMode, priceMinor: s.priceMinor, currency: s.currency, durationMinutes: s.durationMinutes, bookingMode: s.bookingMode })),
    staff: c.staff.filter((s) => s.bookable !== false).map((s) => ({ id: s.id, name: s.name, role: s.role, photo: s.photo, serviceIds: s.serviceIds ?? null })),
    config: config ?? deriveConfig(c),
    contact: { phone: c.contacts.phone, whatsapp: c.contacts.whatsapp, email: c.contacts.email },
  }
}

export const isOnlineBookable = (s: BookableService) => (s.bookingMode === "instant" || s.bookingMode === "request") && Boolean(s.durationMinutes)

/** Who can do a service. [""] when the business has no staff list. */
export function eligibleStaff(ctx: BookingContext, service: BookableService): string[] {
  if (ctx.staff.length === 0) return [""]
  return ctx.staff.filter((p) => p.serviceIds === null || p.serviceIds.includes(service.id)).map((p) => p.id)
}

const money = (minor: number, currency: string) => new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: minor % 100 === 0 ? 0 : 2 }).format(minor / 100)

/** Accurate price wording: never a bare number where the price is "from" or a quote. */
export function priceWording(s: BookableService): string {
  switch (s.priceMode) {
    case "fixed": return s.priceMinor !== undefined ? money(s.priceMinor, s.currency) : "Price on request"
    case "from": return s.priceMinor !== undefined ? `From ${money(s.priceMinor, s.currency)}` : "Price on request"
    case "free": return "Free"
    default: return "Quote on request"
  }
}

/** Precise wording for what each outcome is, so a request is never described as a confirmed appointment. */
export const OUTCOME = {
  instant: { choose: "Book this time", review: "Confirm booking", done: "Booking confirmed", kind: "Confirmed appointment", detail: "Your time is reserved." },
  request: { choose: "Request this time", review: "Send request", done: "Request sent", kind: "Pending request", detail: "This is a request. It is not confirmed until the business accepts it." },
  contact: { choose: "Send enquiry", review: "Send enquiry", done: "Enquiry sent", kind: "Enquiry", detail: "No time is reserved. The business will get back to you." },
} as const

export const modeOf = (s: BookableService): keyof typeof OUTCOME => (s.bookingMode === "instant" && s.durationMinutes ? "instant" : s.bookingMode === "request" && s.durationMinutes ? "request" : "contact")

/** An .ics file so a confirmed or requested time can be added to a calendar. */
export function icsFor(b: { id: string; serviceName: string; startsAt: number; endsAt: number; status: string }, business: string): string {
  const f = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const esc = (t: string) => t.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n")
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Taplo//Booking//EN", "BEGIN:VEVENT", `UID:${b.id}@taplo`, `DTSTAMP:${f(Date.now())}`, `DTSTART:${f(b.startsAt)}`, `DTEND:${f(b.endsAt)}`,
    `SUMMARY:${esc(`${b.serviceName} at ${business}${b.status === "pending" ? " (requested)" : ""}`)}`, `STATUS:${b.status === "confirmed" ? "CONFIRMED" : "TENTATIVE"}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n")
}

export const WEEKDAY_ORDER = WEEKDAYS

/** The public booking journey follows the same staff limit as pricing, without deleting saved people. */
export function buildPlanContext(c: BusinessContent, ent: Pick<import("@/features/subscriptions/entitlements").Entitlements, "maxStaffBookable">): BookingContext {
  const people = c.staff.filter(person => person.bookable !== false);
  const staff = ent.maxStaffBookable === null ? people : people.slice(0, ent.maxStaffBookable);
  return buildContext({ ...c, staff });
}
