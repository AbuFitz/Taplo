import type { initialState } from "@/features/demo/store"
import type { Goal } from "./recommend"

export type { Goal }
type S = ReturnType<typeof initialState>

/** The main button, as the owner sees it. Stored as the page's primary action plus the booking mode. */
export function goalOf(s: { content: { booking?: { mode: string } }; page: { meta: { primaryAction: string } } }): Goal {
  const a = s.page.meta.primaryAction
  if (a === "call") return "call"
  if (a === "whatsapp" || a === "email") return "message"
  if (a === "book") return "book"
  const m = s.content.booking?.mode
  return m === "instant" || m === "request" ? "book" : "enquire"
}

/**
 * Choosing the main button. Whether a booking is confirmed straight away or accepted by hand is a setting for when services and
 * hours exist, not a question for the first minute. Calling or messaging never leaves a second booking action on the page; the
 * widget is only hidden, so choosing booking again restores its place and look.
 */
export function applyGoal<T extends S>(s: T, g: Goal): T {
  const mode = g === "book" ? "request" : "contact"
  const primaryAction = g === "book" ? "book" : g === "call" ? "call" : g === "message" ? (s.content.contacts.whatsapp ? "whatsapp" : "email") : "auto"
  const widgets = s.page.widgets.map((w) => (w.type === "booking" ? { ...w, hidden: g === "call" || g === "message" } : w))
  return { ...s, content: { ...s.content, booking: { ...s.content.booking, mode } }, page: { ...s.page, widgets, meta: { ...s.page.meta, primaryAction } } }
}
