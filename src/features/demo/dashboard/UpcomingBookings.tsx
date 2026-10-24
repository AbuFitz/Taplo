"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import { nowMs } from "@/features/booking/clock";
import { formatSlot } from "@/features/booking/time";

export function UpcomingBookings() {
  const { state, ctx } = useOwner();
  const [now] = useState(nowMs);
  const upcoming = state.bookings
    .filter(
      (b) =>
        b.endsAt > now &&
        (b.status === "confirmed" ||
          (b.status === "pending" && (!b.expiresAt || b.expiresAt > now))),
    )
    .sort((a, b) => a.startsAt - b.startsAt);
  const awaiting = upcoming.filter((b) => b.status === "pending").length;
  return (
    <div data-testid="upcoming-bookings">
      {upcoming.length ? (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            {upcoming.length} upcoming
            {awaiting ? ` · ${awaiting} awaiting your reply` : ""}
          </p>
          <ul className="grid gap-2">
            {upcoming.slice(0, 4).map((b) => (
              <li key={b.id}>
                <Link
                  href="/dashboard/bookings"
                  className="flex min-h-16 items-center gap-3 rounded-xl border p-3 hover:bg-muted/50"
                >
                  <CalendarDays
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {b.serviceName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {b.customer.name} ·{" "}
                      {formatSlot(b.startsAt, ctx?.timezone ?? "Europe/London")}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">
                    {b.status === "pending" ? "Needs a reply" : "Confirmed"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your next appointments will appear here. Try a booking on your page
          preview, then manage it in your calendar.
        </p>
      )}
      <Link
        href="/dashboard/bookings"
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
      >
        Open bookings <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Preview bookings stay in this browser. No email or text message is sent.
      </p>
    </div>
  );
}
