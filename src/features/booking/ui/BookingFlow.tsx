"use client"

import * as React from "react"
import { ArrowUpRight, CalendarDays, Check, Clock, Download, MessageCircle, User, Users } from "lucide-react"
import { ProfileImage } from "@/features/page/renderer/ProfileImage"
import { Overlay } from "@/components/taplo/overlay"
import { TaploInput } from "@/components/taplo/taplo-input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getAvailability, nextAvailableDate } from "../availability"
import { canCancel, canReschedule, holdSlot, placeBooking, setStatus } from "../engine"
import { OUTCOME, eligibleStaff, icsFor, isOnlineBookable, modeOf, priceWording, type BookableService, type BookableStaff, type BookingContext } from "../model"
import { newId, newKey, newToken, useBookingState, useSchedulingConfig } from "../demo-adapter"
import { nowMs } from "../clock"
import { addDays, daysBetween, formatClock, formatDay, formatSlot, localParts, zonesDiffer } from "../time"
import { customerDetails, type Booking } from "../types"
import { EnquiryForm } from "./EnquiryForm"

type Step = "service" | "person" | "time" | "details" | "review" | "done" | "enquiry"
const STEP_NUMBER: Record<string, number> = { service: 1, person: 2, time: 3, details: 4, review: 5 }

/**
 * The customer booking journey: service, person (when it matters), date and time, details, review, result.
 * It is one stepped flow in one overlay (a full-screen sheet on phones), never nested dialogs. The words for
 * each outcome come from OUTCOME so a confirmed appointment, a pending request and an enquiry are never confused.
 */
export function BookingFlow({ ctx, trigger, serviceId, staffId, title, open: controlledOpen, onOpenChange, onCloseAutoFocus }: { ctx: BookingContext; trigger?: React.ReactNode; serviceId?: string; staffId?: string; title?: string; open?: boolean; onOpenChange?: (o: boolean) => void; onCloseAutoFocus?: (event: Event) => void }) {
  const [inner, setInner] = React.useState(false)
  const open = controlledOpen ?? inner
  const setOpen = (o: boolean) => { setInner(o); onOpenChange?.(o) }
  return (
    <Overlay tone="page" kind="detail" onCloseAutoFocus={onCloseAutoFocus} open={open} onOpenChange={setOpen} trigger={trigger} title={title ?? "Book with " + ctx.businessName} testId="booking-flow">
      <FlowBody ctx={ctx} preService={serviceId} preStaff={staffId} onClose={() => setOpen(false)} />
    </Overlay>
  )
}

function FlowBody({ ctx, preService, preStaff, onClose }: { ctx: BookingContext; preService?: string; preStaff?: string; onClose: () => void }) {
  const config = useSchedulingConfig(ctx.slug, ctx.config)
  const { state, update } = useBookingState(ctx.slug)
  const tz = config.timezone
  const viewerTz = React.useMemo(() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return tz } }, [tz])
  const [now] = React.useState(nowMs)

  const initialService = ctx.services.find((s) => s.id === preService && (!preStaff || eligibleStaff(ctx, s).includes(preStaff))) ?? null
  const [service, setService] = React.useState<BookableService | null>(initialService)
  const [staff, setStaff] = React.useState<string | null>(preStaff ?? null)
  const [step, setStep] = React.useState<Step>(() => !initialService ? "service" : !isOnlineBookable(initialService) ? "enquiry" : !preStaff && ctx.staff.length > 0 && eligibleStaff(ctx, initialService).length > 1 ? "person" : "time")
  const [pick, setPick] = React.useState<{ date: string; startsAt: number } | null>(null)
  const [date, setDate] = React.useState<string | null>(null)
  const [more, setMore] = React.useState(false)
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", notes: "" })
  const [errors, setErrors] = React.useState<Partial<Record<"name" | "email" | "phone" | "notes", string>>>({})
  const [banner, setBanner] = React.useState<string | null>(null)
  const [done, setDone] = React.useState<Booking | null>(null)
  const [sending, setSending] = React.useState(false)
  const [holdUntil, setHoldUntil] = React.useState<number | null>(null)
  const [key] = React.useState(newKey)
  const heading = React.useRef<HTMLHeadingElement>(null)

  const eligible = service ? eligibleStaff(ctx, service) : []
  const mode = service ? modeOf(service) : "instant"
  const online = service ? isOnlineBookable(service) : false
  const people = ctx.staff.filter((p) => eligible.includes(p.id))
  // Opened for one person: only the services they provide are offered.
  const offered = preStaff ? ctx.services.filter((s) => eligibleStaff(ctx, s).includes(preStaff)) : ctx.services
  const eligibleKey = eligible.join()

  React.useEffect(() => {
    heading.current?.closest<HTMLElement>("[data-overlay-body]")?.scrollTo({ top: 0, behavior: "instant" })
    heading.current?.focus({ preventScroll: true })
  }, [step])

  // Availability for the whole booking window, recomputed from the live state (so a time someone else just took disappears).
  const avail = React.useMemo(() => {
    if (!service || !online) return []
    return getAvailability({ now, config, service: { id: service.id, durationMinutes: service.durationMinutes! }, eligible, staffPreference: staff, bookings: state.bookings, holds: state.holds.filter((h) => h.key !== key), fromDate: localParts(now, tz).date, days: Math.min(config.rules.maxAdvanceDays + 1, 120) })
  }, [service, online, now, config, eligibleKey, staff, state, tz, key])  // eslint-disable-line react-hooks/exhaustive-deps
  const withSlots = avail.filter((d) => d.slots.length)
  const activeDate = date ?? withSlots[0]?.date ?? null
  const day = avail.find((d) => d.date === activeDate)

  const go = (s: Step) => { setBanner(null); setStep(s) }
  const back = () => {
    if (step === "person") return go("service")
    if (step === "time") return go(!preStaff && people.length > 0 && eligible.length > 1 ? "person" : "service")
    if (step === "details") return go("time")
    if (step === "review") return go("details")
    if (step === "enquiry") return go("service")
  }

  const chooseService = (s: BookableService) => {
    setService(s); setStaff(preStaff ?? null); setPick(null); setDate(null)
    if (!isOnlineBookable(s)) return go("enquiry")
    const el = eligibleStaff(ctx, s)
    go(!preStaff && ctx.staff.length > 0 && el.length > 1 ? "person" : "time")
  }

  const choosePick = (startsAt: number) => { if (activeDate) setPick({ date: activeDate, startsAt }) }

  const toDetails = () => {
    if (!service || !pick) return
    const r = holdSlot({ now: nowMs(), config, state, service: { id: service.id, durationMinutes: service.durationMinutes! }, eligible, staffId: staff, startsAt: pick.startsAt, idempotencyKey: key, newId: () => newId("hold"), newToken })
    if (!r.ok) { setBanner(r.error.code === "slot_unavailable" ? r.error.message : "That time is not available."); setPick(null); return }
    update(() => r.value.state)
    setHoldUntil(r.value.hold.expiresAt)
    go("details")
  }

  const validate = () => {
    const p = customerDetails.safeParse(form)
    if (p.success) { setErrors({}); return true }
    const e: typeof errors = {}
    for (const i of p.error.issues) e[(i.path[0] as keyof typeof e) ?? "email"] ??= i.message
    setErrors(e)
    return false
  }

  const submit = () => {
    if (!service || !pick) return
    setSending(true)
    let result: ReturnType<typeof placeBooking> | null = null
    const ok = update((s) => {
      const r = placeBooking({ now: nowMs(), config, state: s, service: { id: service.id, durationMinutes: service.durationMinutes!, name: service.name, priceLabel: priceWording(service) }, eligible, staffId: staff, startsAt: pick.startsAt, customer: form, mode: mode === "request" ? "request" : "instant", idempotencyKey: key, customerTimezone: viewerTz, newId: () => newId("bk"), newToken })
      result = r
      return r.ok ? r.value.state : s
    })
    setSending(false)
    const r = result as ReturnType<typeof placeBooking> | null
    if (!r) return
    if (!ok) { setBanner("Your browser could not save this booking (storage is full or blocked). Nothing was booked."); return }
    if (r.ok) { setDone(r.value.booking); go("done"); return }
    if (r.error.code === "slot_unavailable") { setBanner(r.error.message); setPick(null); go("time"); return }
    if (r.error.code === "invalid") { setErrors(r.error.fields as typeof errors); go("details"); return }
    setBanner("Something went wrong. Your details are kept; please try again.")
  }

  const hold = useCountdown(holdUntil)
  const person = staff ? ctx.staff.find((p) => p.id === staff) : null
  const num = STEP_NUMBER[step]
  const hasPersonStep = !preStaff && people.length > 0 && eligible.length > 1
  const total = hasPersonStep ? 5 : 4
  const shown = num && num > 2 && !hasPersonStep ? num - 1 : num

  const footer =
    step === "time" ? <Button className="min-h-12 w-full" disabled={!pick} onClick={toDetails}>{pick ? `${OUTCOME[mode].choose}: ${formatSlot(pick.startsAt, tz)}` : "Choose a time"}</Button>
    : step === "details" ? <Button className="min-h-12 w-full" onClick={() => { if (validate()) go("review") }}>Review</Button>
    : step === "review" ? <Button className="min-h-12 w-full" disabled={sending} onClick={submit}>{sending ? "Sending…" : OUTCOME[mode].review}</Button>
    : null

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5" data-step={step}>
      <div className="flex items-center justify-between gap-3">
        {step !== "service" && step !== "done" ? <button type="button" onClick={back} className="-ml-1 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium underline-offset-4 hover:underline">← Back</button> : <span />}
        {shown && step !== "done" && step !== "enquiry" ? <p className="text-xs text-tp-muted" aria-live="polite">Step {shown} of {total}</p> : null}
      </div>
      {banner ? <p role="alert" className="rounded-xl border border-amber-500/50 bg-amber-50 px-4 py-3 text-sm text-amber-950" data-testid="booking-banner">{banner}</p> : null}

      {step === "service" ? (
        <section aria-labelledby="bk-h">
          <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">What would you like to book?</h2>
          {offered.length === 0 ? <p className="mt-3 text-tp-muted">This business has not listed any services yet.</p> : (
            <ul className="mt-4 grid gap-2">
              {offered.map((s) => {
                const m = modeOf(s)
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => chooseService(s)} data-testid="bk-service" className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 rounded-2xl border border-tp-border bg-tp-surface p-4 text-left outline-none transition-colors hover:border-tp-accent focus-visible:ring-2 focus-visible:ring-tp-accent">
                      <span className="min-w-0"><span className="block font-semibold">{s.name}</span><span className="mt-0.5 block text-sm text-tp-muted">{s.externalUrl ? "Continue on website" : <>{s.durationMinutes ? `${s.durationMinutes} min` : "Time agreed with you"}{m === "request" ? " · by request" : m === "contact" ? " · enquiry" : ""}</>}</span></span>
                      <span className="text-right font-semibold tabular-nums">{priceWording(s)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : null}

      {step === "person" && service ? (
        <section aria-labelledby="bk-h">
          <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">Who would you like to see?</h2>
          <ul className="mt-4 grid gap-2">
            <li><PersonRow label="Anyone available" sub="The first free person" icon={<Users aria-hidden="true" className="size-5" />} on={() => { setStaff(null); go("time") }} /></li>
            {people.map((p) => <li key={p.id}><PersonRow label={p.name} sub={p.role} photo={p.photo} on={() => { setStaff(p.id); go("time") }} /></li>)}
          </ul>
        </section>
      ) : null}

      {step === "time" && service ? (
        <section aria-labelledby="bk-h" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
          <div>
            <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">Choose a time</h2>
            <p className="mt-1 text-sm text-tp-muted">{service.name} · {service.durationMinutes} min · {priceWording(service)}{person ? ` · with ${person.name}` : ""}</p>
          </div>
          {withSlots.length === 0 ? (
            <div className="rounded-2xl border border-tp-border p-5" data-testid="bk-none">
              <p className="font-semibold">No times are available online right now.</p>
              <p className="mt-1 text-sm text-tp-muted">{ctx.businessName} may be fully booked or between opening times. You can send an enquiry and they will reply.</p>
              <Button variant="outline" className="mt-3 min-h-11" onClick={() => go("enquiry")}><MessageCircle /> Send an enquiry</Button>
            </div>
          ) : (
            <>
              <DayStrip avail={avail} date={activeDate} onPick={(d) => { setDate(d); setPick(null) }} tz={tz} now={now} onMore={() => setMore((m) => !m)} more={more} />
              {more ? (
                <div className="rounded-2xl border border-tp-border p-2">
                  <Calendar mode="single" timeZone={tz} selected={activeDate ? new Date(`${activeDate}T12:00:00Z`) : undefined} startMonth={new Date(`${avail[0]!.date}T12:00:00Z`)} endMonth={new Date(`${avail[avail.length - 1]!.date}T12:00:00Z`)}
                    disabled={(d) => { const ds = localParts(d.getTime(), tz).date; return !avail.some((a) => a.date === ds && a.slots.length) }}
                    onSelect={(d) => { if (d) { setDate(localParts(d.getTime(), tz).date); setPick(null); setMore(false) } }} className="mx-auto" />
                </div>
              ) : null}
              {day && day.slots.length ? <SlotGrid slots={day.slots} tz={tz} viewerTz={viewerTz} pick={pick?.startsAt ?? null} onPick={choosePick} date={day.date} /> : (
                <div className="rounded-2xl border border-tp-border p-4 text-sm" data-testid="bk-day-empty">
                  <p className="font-semibold">{activeDate ? `No times on ${formatDay(activeDate)}.` : "Pick a day."}</p>
                  {(() => { const next = activeDate ? nextAvailableDate({ now, config, service: { id: service.id, durationMinutes: service.durationMinutes! }, eligible, staffPreference: staff, bookings: state.bookings, holds: [], fromDate: addDays(activeDate, 1) }) : null; return next ? <button type="button" className="mt-1 font-medium underline underline-offset-4" onClick={() => setDate(next)}>Next available: {formatDay(next)}</button> : null })()}
                </div>
              )}
              <p className="text-xs text-tp-muted">Times are in {tzName(tz)}{zonesDiffer(tz, viewerTz, now) ? `. Your device is on ${tzName(viewerTz)}, so we show your local time under each time.` : "."}</p>
            </>
          )}
        </section>
      ) : null}

      {step === "details" && service && pick ? (
        <section aria-labelledby="bk-h" className="grid gap-4">
          <div><h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">Your details</h2>
            {hold !== null ? <p className="mt-1 text-sm text-tp-muted" role="status">{hold > 0 ? `Held for you: ${formatSlot(pick.startsAt, tz)} (${Math.floor(hold / 60)}:${String(hold % 60).padStart(2, "0")} left).` : `The hold on ${formatSlot(pick.startsAt, tz)} has ended. The time may still be free; we check again when you confirm.`}</p> : null}</div>
          <TaploInput label="Your name" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TaploInput label="Email" type="email" autoComplete="email" inputMode="email" value={form.email} error={errors.email} hint="How the business can reach you. Email or phone is enough." onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TaploInput label="Phone (optional)" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid gap-1.5"><Label htmlFor="bk-notes">Anything they should know (optional)</Label><Textarea id="bk-notes" rows={3} maxLength={600} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </section>
      ) : null}

      {step === "review" && service && pick ? (
        <section aria-labelledby="bk-h" className="grid gap-4">
          <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">{mode === "request" ? "Check your request" : "Check your booking"}</h2>
          <dl className="grid gap-3 rounded-2xl border border-tp-border bg-tp-surface p-4 text-sm">
            <Row icon={<CalendarDays className="size-4" aria-hidden="true" />} k="When" v={`${formatSlot(pick.startsAt, tz)} (${tzName(tz)})`} />
            <Row icon={<Clock className="size-4" aria-hidden="true" />} k="Service" v={`${service.name} · ${service.durationMinutes} min · ${priceWording(service)}`} />
            <Row icon={<User className="size-4" aria-hidden="true" />} k="With" v={person?.name ?? "First available person"} />
            <Row icon={<MessageCircle className="size-4" aria-hidden="true" />} k="You" v={[form.name, form.email, form.phone].filter(Boolean).join(" · ")} />
          </dl>
          <p className="rounded-xl bg-tp-surface p-3 text-sm" data-testid="bk-outcome"><strong>{OUTCOME[mode].kind}.</strong> {OUTCOME[mode].detail} {mode === "request" ? `They have ${config.rules.pendingExpiryHours} hours to reply.` : ""}</p>
          {config.rules.cancellationNote || config.rules.cancelUntilHours ? <p className="text-xs text-tp-muted">{config.rules.cancellationNote ?? `You can cancel up to ${config.rules.cancelUntilHours} hours before.`}</p> : null}
          <p className="text-xs text-tp-muted">Saved in this browser only. No email or text message is sent, and no payment is taken.</p>
        </section>
      ) : null}

      {step === "enquiry" && service ? (
        <section aria-labelledby="bk-h" className="grid gap-3">
          <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">Ask about {service.name}</h2>
          {service.externalUrl ? <>
            <p className="text-sm text-tp-muted">Continue on the business’s website to arrange this service.</p>
            <a className="tp-btn" href={service.externalUrl} target="_blank" rel="noopener noreferrer">{service.externalLabel || "View on website"}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </> : <>
            <p className="text-sm text-tp-muted">This service is arranged with the business directly. No time is reserved by sending this.</p>
            <EnquiryForm slug={ctx.slug} businessName={ctx.businessName} services={ctx.services.filter(s=>!s.externalUrl).map((s) => ({ id: s.id, name: s.name }))} serviceId={service.id} onDone={() => undefined} />
          </>}
        </section>
      ) : null}

      {step === "done" && done ? <Done onClose={onClose} ctx={ctx} booking={done} tz={tz} viewerTz={viewerTz} onChanged={() => undefined} update={update} state={state} config={config} /> : null}
      {footer ? <div data-testid="booking-step-action" className="sticky -bottom-4 -mx-4 -mb-4 border-t border-tp-border/60 bg-tp-bg px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom,0px))] pt-3 sm:static sm:mx-0 sm:mb-0 sm:border-0 sm:p-0">{footer}</div> : null}
    </div>
  )
}

const tzName = (tz: string) => { try { return new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "long" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value ?? tz } catch { return tz } }

function useCountdown(until: number | null): number | null {
  const [left, setLeft] = React.useState<number | null>(until === null ? null : Math.max(0, Math.round((until - nowMs()) / 1000)))
  React.useEffect(() => {
    if (until === null) return
    const tick = () => setLeft(Math.max(0, Math.round((until - nowMs()) / 1000)))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [until])
  return until === null ? null : left
}

function PersonRow({ label, sub, photo, icon, on }: { label: string; sub?: string; photo?: BookableStaff["photo"]; icon?: React.ReactNode; on: () => void }) {
  return (
    <button type="button" onClick={on} className="flex w-full items-center gap-3 rounded-2xl border border-tp-border bg-tp-surface p-3 text-left outline-none transition-colors hover:border-tp-accent focus-visible:ring-2 focus-visible:ring-tp-accent">
      {photo ? (
        <span aria-hidden="true" className="relative size-12 shrink-0 overflow-hidden rounded-xl"><ProfileImage image={photo} sizes="48px" /></span>
      ) : <span className="grid size-12 place-items-center rounded-xl bg-tp-bg">{icon ?? <User aria-hidden="true" className="size-5" />}</span>}
      <span><span className="block font-semibold">{label}</span>{sub ? <span className="block text-sm text-tp-muted">{sub}</span> : null}</span>
    </button>
  )
}

const Row = ({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) => <div className="grid grid-cols-[1.25rem_4rem_1fr] items-start gap-2"><span className="mt-0.5 text-tp-muted">{icon}</span><dt className="text-tp-muted">{k}</dt><dd className="font-medium">{v}</dd></div>

function DayStrip({ avail, date, onPick, tz, now, onMore, more }: { avail: ReturnType<typeof getAvailability>; date: string | null; onPick: (d: string) => void; tz: string; now: number; onMore: () => void; more: boolean }) {
  const today = localParts(now, tz).date
  const days = avail.filter((d) => daysBetween(today, d.date) <= 13)
  return (
    <div>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" aria-label="Days" data-testid="bk-days">
        {days.map((d) => {
          const has = d.slots.length > 0
          const on = d.date === date
          const p = new Date(`${d.date}T12:00:00Z`)
          return (
            <li key={d.date} className="snap-start">
              <button type="button" disabled={!has} onClick={() => onPick(d.date)} aria-pressed={on} aria-label={`${formatDay(d.date)}${has ? `, ${d.slots.length} times` : ", no times"}`} data-testid="bk-day"
                className={cn("grid min-h-[4.25rem] w-14 place-items-center rounded-2xl border px-1 py-2 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-tp-accent disabled:opacity-40", on ? "border-tp-accent bg-tp-accent text-tp-accent-fg" : "border-tp-border bg-tp-surface hover:border-tp-accent")}>
                <span className="text-xs font-medium opacity-80">{new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(p)}</span>
                <span className="text-lg font-semibold tabular-nums">{p.getUTCDate()}</span>
                <span className="text-[0.625rem] opacity-80">{new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(p)}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" onClick={onMore} aria-expanded={more} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"><CalendarDays className="size-4" aria-hidden="true" />{more ? "Hide calendar" : "More dates"}</button>
    </div>
  )
}

function SlotGrid({ slots, tz, viewerTz, pick, onPick, date }: { slots: { startsAt: number; endsAt: number }[]; tz: string; viewerTz: string; pick: number | null; onPick: (t: number) => void; date: string }) {
  const part = (ms: number) => { const m = localParts(ms, tz).minutes; return m < 12 * 60 ? "Morning" : m < 17 * 60 ? "Afternoon" : "Evening" }
  const groups = ["Morning", "Afternoon", "Evening"].map((g) => ({ g, items: slots.filter((s) => part(s.startsAt) === g) })).filter((x) => x.items.length)
  return (
    <div className="grid gap-4" role="group" aria-label={`Times on ${formatDay(date)}`} data-testid="bk-slots">
      {groups.map(({ g, items }) => (
        <div key={g}>
          <h3 className="mb-2 text-sm font-semibold text-tp-muted">{g}</h3>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {items.map((s) => {
              const on = pick === s.startsAt
              const diff = zonesDiffer(tz, viewerTz, s.startsAt)
              return (
                <li key={s.startsAt}>
                  <button type="button" onClick={() => onPick(s.startsAt)} aria-pressed={on} data-testid="bk-slot"
                    className={cn("grid min-h-12 w-full place-items-center rounded-xl border px-2 py-1.5 font-semibold tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-tp-accent", on ? "border-tp-accent bg-tp-accent text-tp-accent-fg" : "border-tp-border bg-tp-surface hover:border-tp-accent")}>
                    {formatClock(s.startsAt, tz)}
                    {diff ? <span className="text-[0.625rem] font-normal opacity-75">{formatClock(s.startsAt, viewerTz)} your time</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Done({ ctx, booking, tz, viewerTz, update, state, config, onClose }: { onClose: () => void; ctx: BookingContext; booking: Booking; tz: string; viewerTz: string; onChanged: () => void; update: (fn: (s: typeof state) => typeof state) => boolean; state: ReturnType<typeof useBookingState>["state"]; config: ReturnType<typeof useSchedulingConfig> }) {
  const heading = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [])
  const live = state.bookings.find((b) => b.id === booking.id) ?? booking
  const o = OUTCOME[live.mode]
  const cancelled = live.status === "cancelled"
  const [t0] = React.useState(nowMs)
  // A double tap on "Confirm booking" must not land on "Done" and dismiss the confirmation.
  const [armed, setArmed] = React.useState(false)
  React.useEffect(() => { const t = window.setTimeout(() => setArmed(true), 800); return () => window.clearTimeout(t) }, [])
  const cancel = canCancel(live, t0, config)
  const move = canReschedule(live, t0, config)
  const download = () => {
    const url = URL.createObjectURL(new Blob([icsFor(live, ctx.businessName)], { type: "text/calendar" }))
    const a = document.createElement("a"); a.href = url; a.download = "booking.ics"; a.click(); URL.revokeObjectURL(url)
  }
  return (
    <section aria-labelledby="bk-h" className="grid gap-4" data-testid="bk-done" data-status={live.status}>
      <div className="grid size-12 place-items-center rounded-full bg-tp-accent text-tp-accent-fg"><Check aria-hidden="true" className="size-6" /></div>
      <div>
        <h2 id="bk-h" ref={heading} tabIndex={-1} className="font-tp-heading text-2xl outline-none">{cancelled ? "Booking cancelled" : o.done}</h2>
        <p className="mt-1 text-tp-muted"><strong className="text-tp-fg">{cancelled ? "Cancelled" : o.kind}.</strong> {cancelled ? "The time is free for someone else." : o.detail}</p>
      </div>
      <dl className="grid gap-1 rounded-2xl border border-tp-border bg-tp-surface p-4 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-tp-muted">Service</dt><dd className="font-medium">{live.serviceName}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-tp-muted">When</dt><dd className="font-medium">{formatSlot(live.startsAt, tz, { withZone: true })}</dd></div>
        {zonesDiffer(tz, viewerTz, live.startsAt) ? <div className="flex justify-between gap-3"><dt className="text-tp-muted">Your time</dt><dd className="font-medium">{formatSlot(live.startsAt, viewerTz, { withZone: true })}</dd></div> : null}
        <div className="flex justify-between gap-3"><dt className="text-tp-muted">Price</dt><dd className="font-medium">{live.priceLabel}</dd></div>
      </dl>
      <p className="text-xs text-tp-muted">Saved in this browser only. {ctx.businessName} was not emailed or texted.</p>
      {!cancelled ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-11" onClick={download}><Download /> Add to calendar</Button>
          <Button variant="outline" className="min-h-11" disabled={!cancel.ok} title={cancel.reason} onClick={() => update((s) => { const r = setStatus(s, live.id, "cancelled", nowMs(), "Cancelled by customer"); return r.ok ? r.value : s })}>Cancel booking</Button>
        </div>
      ) : null}
      {!cancelled && !move.ok && move.reason ? <p className="text-xs text-tp-muted">{move.reason}</p> : null}
      <Button className="mt-2 min-h-12 w-full" onClick={() => { if (armed) onClose() }}>Done</Button>
    </section>
  )
}
