"use client"

import * as React from "react"
import { CalendarClock, Check, Mail, Phone, X } from "lucide-react"
import { ConfirmDialog, Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAvailability } from "../../availability"
import { nowMs } from "../../clock"
import { newId } from "../../demo-adapter"
import { reschedule, setStatus, type BookingState } from "../../engine"
import { eligibleStaff, type BookingContext } from "../../model"
import { formatClock, formatSlot, localParts } from "../../time"
import type { Booking, BookingStatus, SchedulingConfig } from "../../types"
import { STATUS_LABEL, STATUS_STYLE } from "./shared"

/**
 * One booking, with only the actions its status allows. Every action says exactly what it does; cancelling
 * asks first. Rescheduling checks availability as if the booking itself were not there, and keeps its status.
 */
export function BookingDetail({ booking, ctx, config, state, update, onClose, notify }: {
  booking: Booking | null; ctx: BookingContext; config: SchedulingConfig; state: BookingState; update: (fn: (s: BookingState) => BookingState) => boolean; onClose: () => void; notify: (m: string) => void
}) {
  const live = booking ? state.bookings.find((b) => b.id === booking.id) ?? booking : null
  const [mode, setMode] = React.useState<"view" | "move">("view")
  const [confirmCancel, setConfirmCancel] = React.useState(false)
  const tz = config.timezone
  const staff = live ? ctx.staff.find((s) => s.id === live.staffId) : null

  const act = (status: BookingStatus, note: string) => {
    if (!live) return
    let msg = ""
    update((s) => { const r = setStatus(s, live.id, status, nowMs()); if (!r.ok) { msg = r.error.code === "not_allowed" ? r.error.message : "Could not change this booking."; return s } return r.value })
    notify(msg || note)
    if (!msg && (status === "cancelled" || status === "declined")) onClose()
  }

  return (
    <>
      <Overlay kind="panel" open={live !== null} onOpenChange={(o) => { if (!o) { setMode("view"); onClose() } }} onBack={mode === "move" ? () => setMode("view") : undefined}
        title={mode === "move" ? "Choose a new time" : live ? live.customer.name : "Booking"} description={live ? `${live.serviceName} · ${formatSlot(live.startsAt, tz)}` : undefined} testId="booking-detail">
        {live ? (mode === "move" ? <Move booking={live} ctx={ctx} config={config} state={state} update={update} done={() => { setMode("view"); notify("Booking moved. The customer has not been told: preview mode sends no messages.") }} /> : (
          <div className="grid gap-5">
            <p className="flex flex-wrap items-center gap-2"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", STATUS_STYLE[live.status])}>{STATUS_LABEL[live.status]}</span><span className="text-sm text-muted-foreground">{live.mode === "request" ? "A request" : "An instant booking"}</span></p>
            <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">When</dt><dd className="font-medium">{formatSlot(live.startsAt, tz, { withZone: true })} to {formatClock(live.endsAt, tz)}</dd>
              <dt className="text-muted-foreground">Service</dt><dd className="font-medium">{live.serviceName} · {live.durationMinutes} min · {live.priceLabel}</dd>
              <dt className="text-muted-foreground">With</dt><dd className="font-medium">{staff?.name ?? "The business"}</dd>
              <dt className="text-muted-foreground">Customer</dt><dd className="grid gap-1 font-medium"><span>{live.customer.name}</span>{live.customer.email ? <a className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline" href={`mailto:${live.customer.email}`}><Mail className="size-3.5" aria-hidden="true" />{live.customer.email}</a> : null}{live.customer.phone ? <a className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline" href={`tel:${live.customer.phone}`}><Phone className="size-3.5" aria-hidden="true" />{live.customer.phone}</a> : null}</dd>
              {live.customer.notes ? <><dt className="text-muted-foreground">Notes</dt><dd>{live.customer.notes}</dd></> : null}
              {live.customerTimezone && live.customerTimezone !== tz ? <><dt className="text-muted-foreground">Their zone</dt><dd>{live.customerTimezone}</dd></> : null}
              {live.expiresAt && live.status === "pending" ? <><dt className="text-muted-foreground">Reply by</dt><dd>{formatSlot(live.expiresAt, tz)}</dd></> : null}
            </dl>
            <div className="flex flex-wrap gap-2" data-testid="booking-actions">
              {live.status === "pending" ? <><Button className="min-h-11" onClick={() => act("confirmed", "Accepted. The customer has not been told: preview mode sends no messages.")}><Check /> Accept request</Button><Button variant="outline" className="min-h-11" onClick={() => act("declined", "Request declined.")}><X /> Decline</Button></> : null}
              {live.status === "confirmed" ? <><Button variant="outline" className="min-h-11" onClick={() => act("completed", "Marked completed.")}><Check /> Mark completed</Button><Button variant="outline" className="min-h-11" onClick={() => act("no_show", "Marked as a no-show.")}>No-show</Button></> : null}
              {live.status === "pending" || live.status === "confirmed" ? <><Button variant="outline" className="min-h-11" onClick={() => setMode("move")}><CalendarClock /> Reschedule</Button><Button variant="outline" className="min-h-11 text-destructive" onClick={() => setConfirmCancel(true)}>Cancel booking</Button></> : null}
            </div>
            <section aria-label="History"><h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</h3><ol className="grid gap-1 text-sm">{live.history.map((h, i) => <li key={i} className="flex justify-between gap-3"><span>{STATUS_LABEL[h.status]}{h.note ? ` · ${h.note}` : ""}</span><span className="text-muted-foreground tabular-nums">{formatSlot(h.at, tz)}</span></li>)}</ol></section>
            <p className="text-xs text-muted-foreground">Preview mode: changes are saved in this browser. Customers are not emailed or texted.</p>
          </div>
        )) : null}
      </Overlay>
      <ConfirmDialog open={confirmCancel} onOpenChange={setConfirmCancel} title="Cancel this booking?" description={live ? `${live.customer.name}'s ${live.serviceName} on ${formatSlot(live.startsAt, tz)} will be cancelled and the time freed. The customer record is kept. Taplo does not message them in preview mode, so tell them yourself.` : ""} confirmLabel="Cancel booking" onConfirm={() => { setConfirmCancel(false); act("cancelled", "Booking cancelled. The time is free again.") }} />
    </>
  )
}

function Move({ booking, ctx, config, state, update, done }: { booking: Booking; ctx: BookingContext; config: SchedulingConfig; state: BookingState; update: (fn: (s: BookingState) => BookingState) => boolean; done: () => void }) {
  const service = ctx.services.find((s) => s.id === booking.serviceId)
  const tz = config.timezone
  const [now] = React.useState(nowMs)
  const [date, setDate] = React.useState(localParts(booking.startsAt, tz).date)
  const [error, setError] = React.useState("")
  const eligible = service ? eligibleStaff(ctx, service) : [booking.staffId]
  const eligibleKey = eligible.join()
  const day = React.useMemo(() => (service?.durationMinutes ? getAvailability({ now, config, service: { id: service.id, durationMinutes: service.durationMinutes }, eligible, staffPreference: booking.staffId, bookings: state.bookings, holds: state.holds, fromDate: date, days: 1, ignoreBookingId: booking.id })[0] : undefined), [service, now, config, eligibleKey, booking, state, date])  // eslint-disable-line react-hooks/exhaustive-deps
  const move = (startsAt: number) => {
    if (!service?.durationMinutes) return
    let msg = ""
    const ok = update((s) => { const r = reschedule({ now: nowMs(), config, state: s, service: { id: service.id, durationMinutes: service.durationMinutes! }, eligible, staffId: booking.staffId, startsAt, bookingId: booking.id, newId: () => newId() }); if (!r.ok) { msg = r.error.code === "slot_unavailable" ? r.error.message : "Could not move this booking."; return s } return r.value })
    if (msg) setError(msg); else if (ok) done()
  }
  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium">Day<input type="date" value={date} onChange={(e) => { setDate(e.target.value); setError("") }} className="min-h-11 rounded-xl border bg-transparent px-3" /></label>
      {error ? <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{error}</p> : null}
      {day && day.slots.length ? <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">{day.slots.map((s) => <li key={s.startsAt}><button type="button" onClick={() => move(s.startsAt)} className="min-h-11 w-full rounded-xl border font-semibold tabular-nums hover:border-primary focus-visible:ring-2 focus-visible:ring-primary">{formatClock(s.startsAt, tz)}</button></li>)}</ul> : <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{day?.reason === "closed" ? "Not working that day." : day?.reason === "past" ? "That day has passed." : day?.reason === "too_far" ? "That is beyond your advance booking window." : "No free times that day."}</p>}
      <p className="text-xs text-muted-foreground">The booking keeps its status. Only free times are shown, as if this booking were not there.</p>
    </div>
  )
}
