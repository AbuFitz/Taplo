import type { Booking } from "@/features/booking/types";
import { localParts } from "@/features/booking/time";
import type { DemoState } from "../store";
import { hasContactChannel } from "../actions";

/** A work projection, never invented revenue, payment state or future commitments. */
export function todayWork(bookings: Booking[], now: number, timezone: string) {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: timezone }).format(now);
  } catch {
    return {
      timezone: null,
      dateLabel: "Check your time zone",
      today: [],
      upcoming: [],
      awaiting: [],
    };
  }
  const date = localParts(now, timezone).date;
  const upcoming = bookings
    .filter(
      (b) =>
        Number.isFinite(b.startsAt) &&
        Math.abs(b.startsAt) <= 8640000000000000 &&
        Number.isFinite(b.endsAt) &&
        b.endsAt > now &&
        (b.status === "confirmed" ||
          (b.status === "pending" && (!b.expiresAt || b.expiresAt > now))),
    )
    .sort((a, b) => a.startsAt - b.startsAt || a.id.localeCompare(b.id));
  return {
    timezone,
    dateLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now),
    today: upcoming.filter(
      (b) =>
        localParts(b.startsAt, timezone).date === date || b.startsAt <= now,
    ),
    upcoming,
    awaiting: upcoming.filter((b) => b.status === "pending"),
  };
}

export function pageTasks(state: DemoState) {
  const c = state.content;
  return {
    contact: hasContactChannel(c),
    hasOffer: [...(c.services ?? []), ...(c.products ?? [])].some(
      (item) => !item.archived && !item.example,
    ),
    hasHours: (c.hours ?? []).length > 0,
    services: (c.services ?? []).filter(
      (item) => !item.archived && !item.example,
    ).length,
    products: (c.products ?? []).filter(
      (item) => !item.archived && !item.example,
    ).length,
    team: c.staff?.length ?? 0,
  };
}
