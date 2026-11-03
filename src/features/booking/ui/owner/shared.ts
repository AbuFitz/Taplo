import type { BookingStatus } from "../../types"

export const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed", pending: "Needs a reply", declined: "Declined", cancelled: "Cancelled", completed: "Completed", no_show: "No-show", expired: "Expired",
}
/** Tailwind classes per status: colour is never the only signal (the label is always shown with it). */
export const STATUS_STYLE: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-100 text-emerald-900 ring-emerald-600/25",
  pending: "bg-amber-100 text-amber-950 ring-amber-600/30",
  completed: "bg-neutral-100 text-neutral-700 ring-neutral-500/20",
  cancelled: "bg-neutral-100 text-neutral-500 ring-neutral-400/20 line-through",
  declined: "bg-neutral-100 text-neutral-500 ring-neutral-400/20 line-through",
  no_show: "bg-rose-100 text-rose-900 ring-rose-600/25",
  expired: "bg-neutral-100 text-neutral-500 ring-neutral-400/20",
}
export const LIVE: BookingStatus[] = ["confirmed", "pending"]
