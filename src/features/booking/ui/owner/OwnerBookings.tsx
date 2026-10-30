"use client";

import { useSearchParams } from "next/navigation";
import { EmptyPanel } from "@/components/taplo/illustrations"

import * as React from "react";
import {
  Ban,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/features/demo/dashboard/Panel";
import { nowMs } from "../../clock";
import { newId, newKey, newToken } from "../../demo-adapter";
import { placeBooking, setStatus } from "../../engine";
import {
  eligibleStaff,
  isOnlineBookable,
  modeOf,
  priceWording,
} from "../../model";
import { addDays, formatSlot, localParts, localToInstant } from "../../time";
import type { Booking } from "../../types";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { BookingDetail } from "./BookingDetail";
import {
  Agenda,
  Month,
  TimeGrid,
  dayLabel,
  mondayOf,
  monthTitle,
} from "./CalendarViews";
import { useOwner } from "./useOwner";

const subscribeScreen = (notify: () => void) => {
  const query = matchMedia("(max-width:640px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const compactScreen = () => matchMedia("(max-width:640px)").matches;
const serverScreen = () => false;

type View = "agenda" | "day" | "week" | "month";
type Tab = "calendar" | "enquiries" | "availability";
const VIEWS: { id: View; label: string }[] = [
  { id: "agenda", label: "Agenda" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];
const SAMPLE_PEOPLE = [
  ["Priya Shah", "priya@example.com"],
  ["Daniel Reed", "daniel@example.com"],
  ["Aisha Khan", "aisha@example.com"],
  ["Tom Hughes", "tom@example.com"],
  ["Lena Fischer", "lena@example.com"],
  ["Marcus Bell", "marcus@example.com"],
];

export function OwnerBookings({
  initialSection = "calendar",
}: {
  initialSection?: Tab;
}) {
  const params = useSearchParams();
  const o = useOwner();
  const [tab, setTab] = React.useState<Tab>(
    params.get("section") === "availability" ? "availability" : initialSection,
  );
  const compact = React.useSyncExternalStore(
    subscribeScreen,
    compactScreen,
    serverScreen,
  );
  const [chosenView, setView] = React.useState<View | null>(null);
  const view = chosenView ?? (compact ? "agenda" : "week");
  const [now] = React.useState(nowMs);
  const [anchor, setAnchor] = React.useState<string | null>(null);
  const [who, setWho] = React.useState("all");
  const [open, setOpen] = React.useState<Booking | null>(null);
  const [block, setBlock] = React.useState<{
    date: string;
    start: string;
    end: string;
    who: string;
    reason: string;
  } | null>(null);
  const [note, setNote] = React.useState("");
  const say = React.useCallback((m: string) => {
    setNote(m);
    window.setTimeout(() => setNote((x) => (x === m ? "" : x)), 6000);
  }, []);
  if (!o.ctx || !o.records)
    return (
      <p className="text-sm text-muted-foreground">
        Make your Taplo first and your bookings will appear here.
      </p>
    );
  const { ctx, config, state, update } = o;
  const tz = config.timezone;
  const today = localParts(now, tz).date;
  const date = anchor ?? today;
  const staff = ctx.staff;
  const list = state.bookings.filter((b) => who === "all" || b.staffId === who);
  const pendingCount = state.bookings.filter(
    (b) => b.status === "pending",
  ).length;
  const online = o.records.booking.onlineBookingReady;
  const entitled = o.ed?.vm?.ent.onlineBooking ?? true;
  const bookable = ctx.services.filter(isOnlineBookable);

  const step = (n: number) =>
    setAnchor(
      view === "month"
        ? `${new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1 + n, 1)).toISOString().slice(0, 7)}-01`
        : addDays(date, n * (view === "week" ? 7 : 1)),
    );
  const title =
    view === "month"
      ? monthTitle(date.slice(0, 7))
      : view === "week"
        ? `Week of ${dayLabel(mondayOf(date)).sub}`
        : view === "day"
          ? dayLabel(date).label + " " + dayLabel(date).sub
          : "Upcoming";

  const decide = (b: Booking, s: "confirmed" | "declined") => {
    update((st) => {
      const r = setStatus(st, b.id, s, nowMs());
      return r.ok ? r.value : st;
    });
    say(
      s === "confirmed"
        ? `Accepted ${b.customer.name}. They have not been told: preview mode sends no messages.`
        : `Declined ${b.customer.name}.`,
    );
  };

  const seed = () => {
    let added = 0;
    update((s0) => {
      let st = s0;
      bookable.forEach((svc, i) => {
        for (let k = 0; k < 2; k++) {
          const [name, email] =
            SAMPLE_PEOPLE[(i * 2 + k) % SAMPLE_PEOPLE.length]!;
          const people = ctx.staff.length ? eligibleStaff(ctx, svc) : [""];
          for (let d = 1 + k + i; d < 21; d++) {
            const days =
              config.staff.find((x) => x.staffId === people[0])?.hours ?? {};
            const dayKey = (
              ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const
            )[new Date(`${addDays(today, d)}T12:00:00Z`).getUTCDay()]!;
            const wins = (days as Record<string, { start: string }[]>)[dayKey];
            if (!wins?.length) continue;
            const t = localToInstant(addDays(today, d), wins[0]!.start, tz);
            if (t === null) continue;
            const start = t + (k * 2 + i) * 3600000 + 30 * 60000 * k;
            const r = placeBooking({
              now: nowMs(),
              config,
              state: st,
              service: {
                id: svc.id,
                durationMinutes: svc.durationMinutes!,
                name: svc.name,
                priceLabel: priceWording(svc),
              },
              eligible: eligibleStaff(ctx, svc),
              staffId: null,
              startsAt: start,
              customer: { name, email },
              mode: modeOf(svc) === "request" ? "request" : "instant",
              idempotencyKey: newKey(),
              newId: () => newId("bk"),
              newToken,
            });
            if (r.ok) {
              st = r.value.state;
              added++;
              break;
            }
          }
        }
      });
      return st;
    });
    say(
      added
        ? `Added ${added} sample bookings with made-up customers, so you can see the calendar working.`
        : "Could not find free times to add samples. Check your working hours.",
    );
  };

  const addBlock = () => {
    if (!block) return;
    const s = localToInstant(block.date, block.start, tz);
    const e = localToInstant(block.date, block.end, tz);
    if (s === null || e === null || e <= s) return;
    o.setConfig((c) => ({
      ...c,
      blocks: [
        ...c.blocks,
        {
          id: newId("blk"),
          staffId: block.who === "all" ? null : block.who,
          startsAt: s,
          endsAt: e,
          reason: block.reason,
        },
      ],
    }));
    setBlock(null);
    say("Time blocked. It is no longer offered to customers.");
  };

  const columns =
    view === "week"
      ? Array.from({ length: 7 }, (_, i) => addDays(mondayOf(date), i)).map(
          (d) => ({ key: d, date: d, ...dayLabel(d) }),
        )
      : staff.length > 1 && who === "all"
        ? staff.map((p) => ({
            key: p.id,
            date,
            ...dayLabel(date),
            label: p.name,
            staffId: p.id,
          }))
        : [
            {
              key: date,
              date,
              ...dayLabel(date),
              staffId: who === "all" ? undefined : who,
            },
          ];

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Your calendar, requests and the hours customers can book."
        actions={
          bookable.length ? (
            <Button variant="outline" onClick={seed}>
              <CalendarPlus /> Add sample bookings
            </Button>
          ) : undefined
        }
      />
      <div className="grid max-w-6xl gap-4">
        <div
          role="tablist"
          aria-label="Bookings sections"
          className="flex gap-1 rounded-xl bg-muted p-1 sm:w-fit"
        >
          {(
            [
              ["calendar", "Calendar", pendingCount],
              [
                "enquiries",
                "Enquiries",
                state.enquiries.filter((e) => e.status === "new").length,
              ],
              ["availability", "Hours", 0],
            ] as const
          ).map(([id, label, n]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              data-testid={`tab-${id}`}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-4 text-sm font-medium sm:flex-none",
                tab === id
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
              {n ? (
                <span className="ml-1.5 rounded-full bg-amber-200 px-1.5 py-0.5 text-xs font-semibold text-amber-950">
                  {n}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {note ? (
          <p
            role="status"
            className="rounded-xl bg-neutral-900 px-4 py-3 text-sm text-white"
            data-testid="owner-note"
          >
            {note}
          </p>
        ) : null}
        {!online && tab === "calendar" ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Online booking is off, so customers cannot pick a time on your page.
            Turn it on under Hours and rules.
          </p>
        ) : null}

        {tab === "calendar" ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Calendar view"
                className="flex rounded-xl bg-muted p-1"
              >
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={view === v.id}
                    onClick={() => setView(v.id)}
                    data-testid={`view-${v.id}`}
                    className={cn(
                      "min-h-10 rounded-lg px-3 text-sm font-medium",
                      view === v.id
                        ? "bg-background shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {view !== "agenda" ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    aria-label="Previous"
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() => setAnchor(null)}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    aria-label="Next"
                    onClick={() => step(1)}
                  >
                    <ChevronRight />
                  </Button>
                  <h2
                    className="px-1 text-base font-semibold"
                    aria-live="polite"
                  >
                    {title}
                  </h2>
                </>
              ) : null}
              <span className="ml-auto flex flex-wrap items-center gap-2">
                {staff.length > 1 ? (
                  <label className="flex items-center gap-2 text-sm">
                    <span className="sr-only sm:not-sr-only text-muted-foreground">
                      Show
                    </span>
                    <select
                      aria-label="Filter by person"
                      className="min-h-11 rounded-xl border bg-transparent px-3 text-sm"
                      value={who}
                      onChange={(e) => setWho(e.target.value)}
                    >
                      <option value="all">Everyone</option>
                      {staff.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <Button
                  variant="outline"
                  className="min-h-11"
                  onClick={() =>
                    setBlock({
                      date,
                      start: "12:00",
                      end: "13:00",
                      who: "all",
                      reason: "",
                    })
                  }
                >
                  <Ban /> Block time
                </Button>
              </span>
            </div>
            {view === "agenda" ? (
              <Agenda
                bookings={list}
                tz={tz}
                now={now}
                onOpen={setOpen}
                onDecide={decide}
              />
            ) : view === "month" ? (
              <Month
                month={date.slice(0, 7)}
                bookings={list}
                tz={tz}
                now={now}
                onPickDay={(d) => {
                  setAnchor(d);
                  setView("day");
                }}
              />
            ) : (
              <TimeGrid
                columns={columns}
                bookings={list}
                config={config}
                tz={tz}
                now={now}
                onOpen={setOpen}
                onSlot={(d, m, w) =>
                  setBlock({
                    date: d,
                    start: `${String(Math.floor(m / 60)).padStart(2, "0")}:00`,
                    end: `${String(Math.floor(m / 60) + 1).padStart(2, "0")}:00`,
                    who: w ?? "all",
                    reason: "",
                  })
                }
              />
            )}
            {config.blocks.length ? (
              <section aria-label="Blocked time">
                <h3 className="mb-2 text-sm font-semibold">Blocked time</h3>
                <ul className="grid gap-1.5">
                  {config.blocks
                    .slice()
                    .sort((a, b) => a.startsAt - b.startsAt)
                    .map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
                      >
                        <span>
                          {formatSlot(b.startsAt, tz)} to{" "}
                          {formatSlot(b.endsAt, tz).split(" ").slice(-1)} ·{" "}
                          {b.staffId === null
                            ? "Everyone"
                            : (staff.find((p) => p.id === b.staffId)?.name ??
                              b.staffId)}
                          {b.reason ? ` · ${b.reason}` : ""}
                        </span>
                        <Button
                          variant="ghost"
                          className="min-h-11"
                          onClick={() =>
                            o.setConfig((c) => ({
                              ...c,
                              blocks: c.blocks.filter((x) => x.id !== b.id),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}

        {tab === "enquiries" ? (
          <ul className="grid max-w-3xl gap-2" data-testid="enquiries">
            {state.enquiries.length === 0 ? (
              <li>
                <EmptyPanel scene="bookings" title="No enquiries yet">
                  <p>
                    Messages from your contact form, and from services you arrange
                    with customers directly, appear here. An enquiry reserves no time.
                  </p>
                </EmptyPanel>
              </li>
            ) : null}
            {state.enquiries.map((e) => (
              <li
                key={e.id}
                className={cn(
                  "rounded-2xl border p-4",
                  e.status === "new" ? "bg-card" : "bg-muted/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSlot(e.createdAt, tz)}
                      {e.serviceId
                        ? ` · about ${ctx.services.find((s) => s.id === e.serviceId)?.name ?? "a service"}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      e.status === "new"
                        ? "bg-amber-100 text-amber-950"
                        : "bg-neutral-100 text-neutral-600",
                    )}
                  >
                    {e.status === "new"
                      ? "New"
                      : e.status === "answered"
                        ? "Answered"
                        : "Archived"}
                  </span>
                </div>
                {e.topic ? (
                  <p className="mt-2 text-sm font-medium">About: {e.topic}</p>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap text-sm">{e.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.email ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="min-h-10"
                    >
                      <a href={`mailto:${e.email}`}>
                        <Mail /> Reply by email
                      </a>
                    </Button>
                  ) : null}
                  {e.phone ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="min-h-10"
                    >
                      <a href={`tel:${e.phone}`}>
                        <Phone /> Call
                      </a>
                    </Button>
                  ) : null}
                  {e.status === "new" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-10"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          enquiries: s.enquiries.map((x) =>
                            x.id === e.id ? { ...x, status: "answered" } : x,
                          ),
                        }))
                      }
                    >
                      Mark answered
                    </Button>
                  ) : null}
                  {e.status !== "archived" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-10"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          enquiries: s.enquiries.map((x) =>
                            x.id === e.id ? { ...x, status: "archived" } : x,
                          ),
                        }))
                      }
                    >
                      Archive
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "availability" ? (
          <AvailabilityEditor
            initialStaffId={params.get("staff") ?? undefined}
            ctx={ctx}
            config={config}
            setConfig={o.setConfig}
            online={online}
            setOnline={(v) =>
              o.ed?.setContent((c) => ({
                ...c,
                booking: {
                  mode: c.booking?.mode ?? "request",
                  onlineBookingReady: v,
                },
              }))
            }
            entitled={entitled}
          />
        ) : null}
      </div>

      <BookingDetail
        booking={open}
        ctx={ctx}
        config={config}
        state={state}
        update={update}
        onClose={() => setOpen(null)}
        notify={say}
      />

      <Overlay
        kind="dialog"
        open={block !== null}
        onOpenChange={(v) => !v && setBlock(null)}
        title="Block time"
        description="Customers will not be offered times that overlap this."
        dirty={false}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBlock(null)}>
              Cancel
            </Button>
            <Button
              onClick={addBlock}
              disabled={!block || block.start >= block.end}
            >
              Block this time
            </Button>
          </div>
        }
      >
        {block ? (
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm font-medium">
              Day
              <input
                type="date"
                value={block.date}
                onChange={(e) => setBlock({ ...block, date: e.target.value })}
                className="min-h-11 rounded-xl border bg-transparent px-3"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm font-medium">
                From
                <input
                  type="time"
                  value={block.start}
                  onChange={(e) =>
                    setBlock({ ...block, start: e.target.value })
                  }
                  className="min-h-11 rounded-xl border bg-transparent px-3"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Until
                <input
                  type="time"
                  value={block.end}
                  onChange={(e) => setBlock({ ...block, end: e.target.value })}
                  className="min-h-11 rounded-xl border bg-transparent px-3"
                />
              </label>
            </div>
            {staff.length > 1 ? (
              <label className="grid gap-1 text-sm font-medium">
                Who
                <select
                  value={block.who}
                  onChange={(e) => setBlock({ ...block, who: e.target.value })}
                  className="min-h-11 rounded-xl border bg-transparent px-3"
                >
                  <option value="all">Everyone</option>
                  {staff.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="grid gap-1 text-sm font-medium">
              Reason (optional)
              <input
                maxLength={120}
                value={block.reason}
                onChange={(e) => setBlock({ ...block, reason: e.target.value })}
                placeholder="Training, lunch, holiday…"
                className="min-h-11 rounded-xl border bg-transparent px-3"
              />
            </label>
            {block.start >= block.end ? (
              <p role="alert" className="text-sm text-destructive">
                The end time must be after the start.
              </p>
            ) : null}
          </div>
        ) : null}
      </Overlay>
    </>
  );
}
