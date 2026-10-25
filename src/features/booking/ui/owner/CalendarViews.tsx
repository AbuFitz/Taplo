"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  addDays,
  formatClock,
  formatDay,
  localParts,
  weekdayOf,
} from "../../time";
import type { Booking, SchedulingConfig } from "../../types";
import { LIVE, STATUS_LABEL, STATUS_STYLE } from "./shared";

const HOUR_PX = 52;
const pad = (n: number) => String(n).padStart(2, "0");

export const mondayOf = (date: string) =>
  addDays(date, -((weekdayOf(date) + 6) % 7));
const dayName = (date: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(
    new Date(`${date}T12:00:00Z`),
  );

function Chip({
  b,
  tz,
  onOpen,
  compact,
}: {
  b: Booking;
  tz: string;
  onOpen: (b: Booking) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(b)}
      data-testid="cal-booking"
      data-status={b.status}
      className={cn(
        "w-full overflow-hidden rounded-lg px-2 py-1 text-left text-xs leading-tight outline-none ring-1 focus-visible:ring-2 focus-visible:ring-primary",
        STATUS_STYLE[b.status],
      )}
    >
      <span className="block truncate font-semibold">
        {formatClock(b.startsAt, tz)} {b.customer.name}
      </span>
      {!compact ? (
        <span className="block truncate opacity-80">{b.serviceName}</span>
      ) : null}
    </button>
  );
}

/** Agenda: what needs a reply, then everything coming up, by day. */
export function Agenda({
  bookings,
  tz,
  onOpen,
  now,
  onDecide,
}: {
  bookings: Booking[];
  tz: string;
  onOpen: (b: Booking) => void;
  now: number;
  onDecide: (b: Booking, s: "confirmed" | "declined") => void;
}) {
  const pending = bookings
    .filter((b) => b.status === "pending")
    .sort((a, b) => a.startsAt - b.startsAt);
  const upcoming = bookings
    .filter((b) => b.startsAt >= now - 3600000 && b.status !== "pending")
    .sort((a, b) => a.startsAt - b.startsAt);
  const byDay = new Map<string, Booking[]>();
  for (const b of upcoming) {
    const d = localParts(b.startsAt, tz).date;
    byDay.set(d, [...(byDay.get(d) ?? []), b]);
  }
  return (
    <div className="grid gap-6" data-testid="agenda">
      {pending.length ? (
        <section
          aria-labelledby="needs-reply"
          className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4"
        >
          <h3 id="needs-reply" className="text-sm font-semibold text-amber-950">
            Needs a reply ({pending.length})
          </h3>
          <ul className="mt-3 grid gap-2">
            {pending.map((b) => (
              <li
                key={b.id}
                className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                data-testid="pending-row"
              >
                <button
                  type="button"
                  onClick={() => onOpen(b)}
                  className="text-left"
                >
                  <span className="block font-semibold">
                    {b.customer.name} · {b.serviceName}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: tz,
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    }).format(b.startsAt)}
                    {b.expiresAt
                      ? ` · reply by ${new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(b.expiresAt)}`
                      : ""}
                  </span>
                </button>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onDecide(b, "confirmed")}
                    className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecide(b, "declined")}
                    className="min-h-11 rounded-lg border px-4 text-sm font-medium"
                  >
                    Decline
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {byDay.size === 0 && !pending.length ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No upcoming bookings. When customers book or request a time it appears
          here.
        </p>
      ) : null}
      {[...byDay.entries()].map(([d, list]) => (
        <section key={d} aria-label={formatDay(d)}>
          <h3 className="mb-2 text-sm font-semibold">{formatDay(d)}</h3>
          <ul className="grid gap-1.5">
            {list.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onOpen(b)}
                  data-testid="agenda-row"
                  className="grid w-full grid-cols-[4rem_1fr_auto] items-center gap-3 rounded-xl border bg-card p-3 text-left hover:bg-muted"
                >
                  <span className="font-semibold tabular-nums">
                    {formatClock(b.startsAt, tz)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {b.customer.name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {b.serviceName} · {b.durationMinutes} min
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                      STATUS_STYLE[b.status],
                    )}
                  >
                    {STATUS_LABEL[b.status]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function bounds(
  config: SchedulingConfig,
  bookings: Booking[],
  dates: string[],
  tz: string,
) {
  let lo = 8 * 60,
    hi = 18 * 60;
  for (const s of config.staff)
    for (const wins of Object.values(s.hours))
      for (const w of wins ?? []) {
        lo = Math.min(lo, Number(w.start.slice(0, 2)) * 60);
        hi = Math.max(
          hi,
          Number(w.end.slice(0, 2)) * 60 + (w.end.slice(3) === "00" ? 0 : 60),
        );
      }
  for (const b of bookings) {
    if (!dates.includes(localParts(b.startsAt, tz).date)) continue;
    lo = Math.min(lo, Math.floor(localParts(b.startsAt, tz).minutes / 60) * 60);
    hi = Math.max(hi, Math.ceil(localParts(b.endsAt, tz).minutes / 60) * 60);
  }
  return {
    lo: Math.max(0, lo - 0),
    hi: Math.min(24 * 60, Math.max(hi, lo + 4 * 60)),
  };
}

/** A time grid for one or more days (week view) or one day per person (day view). */
export function TimeGrid({
  columns,
  bookings,
  config,
  tz,
  onOpen,
  onSlot,
  now,
}: {
  columns: {
    key: string;
    date: string;
    label: string;
    sub?: string;
    staffId?: string;
  }[];
  bookings: Booking[];
  config: SchedulingConfig;
  tz: string;
  onOpen: (b: Booking) => void;
  onSlot?: (date: string, minutes: number, staffId?: string) => void;
  now: number;
}) {
  const [cell, setCell] = React.useState({ column: 0, row: 0 });
  const help = React.useId();
  const { lo, hi } = bounds(
    config,
    bookings,
    columns.map((c) => c.date),
    tz,
  );
  const hours = Array.from({ length: (hi - lo) / 60 }, (_, i) => lo / 60 + i);
  const today = localParts(now, tz).date;
  const nowMin = localParts(now, tz).minutes;
  return (
    <div
      className="relative overflow-x-auto rounded-2xl border bg-card"
      data-testid="time-grid"
      role="group"
      aria-label="Booking time grid"
      aria-describedby={help}
      onKeyDown={(event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>(
          "[data-calendar-slot]",
        );
        if (!target) return;
        const [column, row] = target.dataset
          .calendarSlot!.split(":")
          .map(Number);
        let nextColumn = column!,
          nextRow = row!;
        if (event.key === "ArrowRight") nextColumn++;
        else if (event.key === "ArrowLeft") nextColumn--;
        else if (event.key === "ArrowDown") nextRow++;
        else if (event.key === "ArrowUp") nextRow--;
        else if (event.key === "Home") nextRow = 0;
        else if (event.key === "End") nextRow = hours.length - 1;
        else return;
        event.preventDefault();
        event.currentTarget
          .querySelector<HTMLElement>(
            `[data-calendar-slot="${Math.min(columns.length - 1, Math.max(0, nextColumn))}:${Math.min(hours.length - 1, Math.max(0, nextRow))}"]`,
          )
          ?.focus();
      }}
    >
      <p id={help} className="sr-only">
        Use the arrow keys to choose a time, then Enter to block it. Home and
        End move to the first and last time.
      </p>
      <div
        className="grid"
        style={{
          minWidth: columns.length > 3 ? "40rem" : "100%",
          gridTemplateColumns: `3.25rem repeat(${columns.length}, minmax(5.5rem, 1fr))`,
        }}
      >
        <div />
        {columns.map((c) => (
          <div
            key={c.key}
            className={cn(
              "border-l px-2 py-2 text-center text-xs",
              c.date === today && "bg-primary/5",
            )}
          >
            <span className="block font-semibold">{c.label}</span>
            {c.sub ? (
              <span className="block text-muted-foreground">{c.sub}</span>
            ) : null}
          </div>
        ))}
        <div className="relative" style={{ height: hours.length * HOUR_PX }}>
          {hours.map((h, i) => (
            <span
              key={h}
              className="absolute right-1.5 -translate-y-1/2 text-[0.6875rem] tabular-nums text-muted-foreground"
              style={{ top: i * HOUR_PX + (i === 0 ? 8 : 0) }}
            >
              {pad(h)}:00
            </span>
          ))}
        </div>
        {columns.map((c, columnIndex) => {
          const items = bookings.filter(
            (b) =>
              LIVE.concat(["completed", "no_show"]).includes(b.status) &&
              localParts(b.startsAt, tz).date === c.date &&
              (c.staffId === undefined || b.staffId === c.staffId),
          );
          const blocks = config.blocks.filter(
            (b) =>
              (b.staffId === null ||
                c.staffId === undefined ||
                b.staffId === c.staffId) &&
              localParts(b.startsAt, tz).date === c.date,
          );
          return (
            <div
              key={c.key}
              className="relative border-l"
              style={{ height: hours.length * HOUR_PX }}
              data-col={c.date}
            >
              {hours.map((h, i) => (
                <button
                  key={h}
                  type="button"
                  aria-label={`${c.label} ${pad(h)}:00, add a block`}
                  data-calendar-slot={`${columnIndex}:${i}`}
                  tabIndex={
                    columnIndex === Math.min(cell.column, columns.length - 1) &&
                    i === Math.min(cell.row, hours.length - 1)
                      ? 0
                      : -1
                  }
                  onFocus={() => setCell({ column: columnIndex, row: i })}
                  onClick={() => onSlot?.(c.date, h * 60, c.staffId)}
                  className="absolute inset-x-0 border-t border-border/60 hover:bg-muted/50"
                  style={{ top: i * HOUR_PX, height: HOUR_PX }}
                />
              ))}
              {blocks.map((b) => {
                const s = localParts(b.startsAt, tz).minutes,
                  e = Math.min(hi, s + (b.endsAt - b.startsAt) / 60000);
                return (
                  <div
                    key={b.id}
                    className="pointer-events-none absolute inset-x-0.5 overflow-hidden rounded-md bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(0_0_0/0.07)_6px_12px)] px-1 text-[0.6875rem] text-muted-foreground ring-1 ring-border"
                    style={{
                      top: ((s - lo) / 60) * HOUR_PX,
                      height: Math.max(18, ((e - s) / 60) * HOUR_PX),
                    }}
                  >
                    {b.reason || "Blocked"}
                  </div>
                );
              })}
              {items.map((b) => {
                const s = localParts(b.startsAt, tz).minutes;
                const dur = (b.endsAt - b.startsAt) / 60000;
                return (
                  <div
                    key={b.id}
                    className="absolute inset-x-0.5"
                    style={{
                      top: ((s - lo) / 60) * HOUR_PX + 1,
                      height: Math.max(26, (dur / 60) * HOUR_PX - 2),
                    }}
                  >
                    <Chip b={b} tz={tz} onOpen={onOpen} compact={dur < 40} />
                  </div>
                );
              })}
              {c.date === today && nowMin >= lo && nowMin <= hi ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-rose-500"
                  style={{ top: ((nowMin - lo) / 60) * HOUR_PX }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Month: a count per day; choosing a day opens it. */
export function Month({
  month,
  bookings,
  tz,
  onPickDay,
  now,
}: {
  month: string;
  bookings: Booking[];
  tz: string;
  onPickDay: (d: string) => void;
  now: number;
}) {
  const first = `${month}-01`;
  const start = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const today = localParts(now, tz).date;
  const count = (d: string) =>
    bookings.filter(
      (b) => LIVE.includes(b.status) && localParts(b.startsAt, tz).date === d,
    );
  return (
    <div className="rounded-2xl border bg-card p-2" data-testid="month-grid">
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((d) => {
          const list = count(d);
          const pend = list.filter((b) => b.status === "pending").length;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onPickDay(d)}
              aria-label={`${formatDay(d)}: ${list.length} bookings${pend ? `, ${pend} need a reply` : ""}`}
              className={cn(
                "grid min-h-14 content-start rounded-lg p-1.5 text-left text-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary",
                d.slice(0, 7) !== month && "opacity-40",
                d === today && "bg-primary/10 font-semibold",
              )}
            >
              <span className="tabular-nums">{Number(d.slice(8))}</span>
              {list.length ? (
                <span
                  className={cn(
                    "mt-1 inline-flex w-fit rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium ring-1",
                    pend ? STATUS_STYLE.pending : STATUS_STYLE.confirmed,
                  )}
                >
                  {list.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const monthTitle = (month: string) =>
  dayName(`${month}-01`, { month: "long", year: "numeric" });
export const dayLabel = (date: string) => ({
  label: dayName(date, { weekday: "short" }),
  sub: dayName(date, { day: "numeric", month: "short" }),
});
