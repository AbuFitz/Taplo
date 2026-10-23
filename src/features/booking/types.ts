import { z } from "zod"

/**
 * Scheduling data model. Shared by the availability engine, the demo adapter and the SQL function that is
 * authoritative when a database is connected. Times that are instants are UTC milliseconds in memory and
 * timestamptz in SQL; times of day are wall-clock "HH:MM" in the business's own time zone.
 */

export const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
export const weekdayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
export type WeekdayKey = z.infer<typeof weekdayEnum>

export const timeWindow = z.object({ start: hhmm, end: hhmm }).refine((w) => w.start < w.end, "A window must end after it starts")
export type TimeWindow = z.infer<typeof timeWindow>

/** Working windows per weekday. A lunch break is simply a gap between two windows. */
export const weeklyHours = z.object({ mon: z.array(timeWindow), tue: z.array(timeWindow), wed: z.array(timeWindow), thu: z.array(timeWindow), fri: z.array(timeWindow), sat: z.array(timeWindow), sun: z.array(timeWindow) }).partial()
export type WeeklyHours = z.infer<typeof weeklyHours>

/** "" is the business itself, for businesses with no staff list. */
export const staffKey = z.string().max(64)

export const staffSchedule = z.object({ staffId: staffKey, hours: weeklyHours })

/** One date overriding the weekly pattern: holidays (no windows = closed) or special hours. `staffId` null = whole business. */
export const dateException = z.object({ id: z.string(), date: isoDate, staffId: staffKey.nullable(), windows: z.array(timeWindow), note: z.string().max(120).optional() })

/** Blocked time (leave, a training day, a dentist appointment). `staffId` null = everyone. */
export const timeBlock = z.object({ id: z.string(), staffId: staffKey.nullable(), startsAt: z.number(), endsAt: z.number(), reason: z.string().max(120).default("") })

export const schedulingRules = z.object({
  minNoticeMinutes: z.number().int().min(0).max(60 * 24 * 30).default(120),
  maxAdvanceDays: z.number().int().min(1).max(730).default(60),
  /** Start times are offered on this grid. */
  slotIntervalMinutes: z.number().int().min(5).max(240).default(15),
  bufferBeforeMinutes: z.number().int().min(0).max(240).default(0),
  bufferAfterMinutes: z.number().int().min(0).max(240).default(0),
  /** How long a chosen slot is held while the customer fills in their details. */
  holdMinutes: z.number().int().min(1).max(60).default(10),
  /** A request nobody answers stops holding the time after this long. */
  pendingExpiryHours: z.number().int().min(1).max(24 * 14).default(48),
  cancelUntilHours: z.number().int().min(0).max(24 * 30).default(24),
  rescheduleUntilHours: z.number().int().min(0).max(24 * 30).default(24),
  cancellationNote: z.string().max(300).optional(),
})
export type SchedulingRules = z.infer<typeof schedulingRules>

/** Per-service overrides of the business rules. */
export const serviceScheduling = z.object({
  serviceId: z.string(),
  bufferBeforeMinutes: z.number().int().min(0).max(240).optional(),
  bufferAfterMinutes: z.number().int().min(0).max(240).optional(),
  /** More than one booking may share the same start (a class). */
  capacity: z.number().int().min(1).max(200).optional(),
})

export const schedulingConfig = z.object({
  timezone: z.string().min(1).default("Europe/London"),
  rules: schedulingRules.default(schedulingRules.parse({})),
  /** Weekly hours per staff member. Empty list = the business's own hours under staffId "". */
  staff: z.array(staffSchedule).default([]),
  exceptions: z.array(dateException).default([]),
  blocks: z.array(timeBlock).default([]),
  serviceOverrides: z.array(serviceScheduling).default([]),
})
export type SchedulingConfig = z.infer<typeof schedulingConfig>

export const BOOKING_STATUSES = ["confirmed", "pending", "declined", "cancelled", "completed", "no_show", "expired"] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]
/** Statuses that hold a time and so stop others booking it. */
export const HOLDING: readonly BookingStatus[] = ["confirmed", "pending"]

export const customerDetails = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254).optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().max(32).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(600).optional().or(z.literal("").transform(() => undefined)),
}).refine((c) => Boolean(c.email || c.phone), { message: "Add an email address or a phone number so the business can reach you", path: ["email"] })
export type CustomerDetails = z.infer<typeof customerDetails>

export interface Booking {
  id: string
  serviceId: string
  serviceName: string
  /** Staff key; "" when the business has no staff list. */
  staffId: string
  startsAt: number
  endsAt: number
  /** The time actually held, including buffers. */
  blockStart: number
  blockEnd: number
  status: BookingStatus
  /** What was asked for. "instant" confirms immediately; "request" waits for the business. */
  mode: "instant" | "request"
  customer: CustomerDetails
  durationMinutes: number
  priceLabel: string
  createdAt: number
  /** Pending requests stop holding the time at this instant. */
  expiresAt?: number
  idempotencyKey: string
  customerTimezone?: string
  /** Secret the customer uses to cancel or reschedule from their confirmation. */
  manageToken: string
  history: { at: number; status: BookingStatus; note?: string }[]
}

export interface Hold { id: string; staffId: string; serviceId: string; blockStart: number; blockEnd: number; expiresAt: number; key: string }

export interface Enquiry {
  id: string
  name: string
  email?: string
  phone?: string
  message: string
  serviceId?: string
  topic?: string
  createdAt: number
  status: "new" | "answered" | "archived"
  idempotencyKey: string
}

export const enquiryInput = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254).optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().max(32).optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().min(5, "Tell the business a little about what you need").max(1200),
  serviceId: z.string().max(64).optional(),
}).refine((c) => Boolean(c.email || c.phone), { message: "Add an email address or a phone number so the business can reply", path: ["email"] })
export type EnquiryInput = z.infer<typeof enquiryInput>

export const DEFAULT_CONFIG: SchedulingConfig = schedulingConfig.parse({})
