import type { PageDoc } from "@/features/page/contracts/page"
import type { WidgetType } from "@/features/page/contracts/widgets"
import { newWidget as make } from "@/features/page/starter"

/** Showcase widgets get fixed ids so server and client render identical markup. */
export const newWidget = (type: WidgetType, settings: Record<string, unknown> = {}) => ({ ...make(type, settings), id: `showcase-${type}` })

/**
 * Two fictional businesses used to show the appearance engine. Names, numbers and reviews are
 * invented; photographs are credited in public/showcase/CREDITS.md.
 */
export const photo = (name: string, alt: string, w: number, h: number, focal?: { x: number; y: number }) => ({ src: `/showcase/${name}.jpg`, alt, width: w, height: h, focal })
export const svc = (id: string, group: string, name: string, priceMinor: number, durationMinutes: number, description: string, sortOrder: number, bookingMode: "instant" | "request" | "contact" = "instant") =>
  ({ id, group, name, description, priceMode: "fixed" as const, priceMinor, currency: "GBP", durationMinutes, delivery: [], bookingMode, sortOrder })
export const person = (id: string, name: string, role: string, bio: string, serviceIds: string[] | null, subjects: string[] = [], credentials: string[] = []) =>
  ({ id, slug: id, name, role, bio, subjects, serviceIds, credentials, bookable: true })
export const hours = (days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[], opens: string, closes: string) => days.map((day) => ({ day, opens, closes }))


export type { PageDoc }
