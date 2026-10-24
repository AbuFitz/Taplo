"use client"

import * as React from "react"
import { Copy, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Disclosure } from "@/features/appearance/controls"
import { newId } from "../../demo-adapter"
import { formatDay } from "../../time"
import { weekdayEnum, type SchedulingConfig, type TimeWindow, type WeekdayKey } from "../../types"
import type { BookingContext } from "../../model"

const DAYS = weekdayEnum.options
const NAME: Record<WeekdayKey, string> = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" }
const ZONES = ["Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Toronto", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney", "Pacific/Auckland", "UTC"]

const num = (v: string, min: number, max: number, fb: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fb }
const input = "min-h-11 rounded-xl border bg-transparent px-3 text-sm"

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm"><span className="font-medium">{label}</span>{children}{hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}</label>
}

export function AvailabilityEditor({ ctx, config, setConfig, online, setOnline, entitled }: {
  ctx: BookingContext; config: SchedulingConfig; setConfig: (fn: (c: SchedulingConfig) => SchedulingConfig) => void
  online: boolean; setOnline: (v: boolean) => void; entitled: boolean
}) {
  const people = ctx.staff.length ? ctx.staff.map((p) => ({ id: p.id, name: p.name })) : [{ id: "", name: ctx.businessName }]
  const [who, setWho] = React.useState(people[0]!.id)
  const hours = config.staff.find((s) => s.staffId === who)?.hours ?? {}
  const patchHours = (fn: (h: Partial<Record<WeekdayKey, TimeWindow[]>>) => Partial<Record<WeekdayKey, TimeWindow[]>>) =>
    setConfig((c) => {
      const has = c.staff.some((s) => s.staffId === who)
      const next = (has ? c.staff : [...c.staff, { staffId: who, hours: {} }]).map((s) => (s.staffId === who ? { ...s, hours: fn(s.hours) } : s))
      return { ...c, staff: next }
    })
  const setWin = (d: WeekdayKey, i: number, patch: Partial<TimeWindow>) => patchHours((h) => ({ ...h, [d]: (h[d] ?? []).map((w, n) => (n === i ? { ...w, ...patch } : w)) }))
  const rules = config.rules
  const setRule = <K extends keyof typeof rules>(k: K, v: (typeof rules)[K]) => setConfig((c) => ({ ...c, rules: { ...c.rules, [k]: v } }))
  const [ex, setEx] = React.useState({ date: "", who: "all", closed: true, start: "10:00", end: "14:00" })

  return (
    <div className="grid max-w-3xl gap-3" data-testid="availability">
      <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
        <div><p className="font-semibold">Accept online bookings</p><p className="text-sm text-muted-foreground">{entitled ? "Customers can pick a time on your page." : "Online booking is part of the Pro plan. You can set everything up now; it shows on your page once your plan includes it."}</p></div>
        <Switch checked={online} onCheckedChange={setOnline} aria-label="Accept online bookings" />
      </div>

      <Disclosure title="Time zone" defaultOpen hint="Times on your page and in your calendar use this zone. Visitors in another zone see their own time too.">
        <Field label="Your time zone"><select className={input} value={ZONES.includes(config.timezone) ? config.timezone : "custom"} onChange={(e) => e.target.value !== "custom" && setConfig((c) => ({ ...c, timezone: e.target.value }))}>{ZONES.map((z) => <option key={z} value={z}>{z.replace("_", " ")}</option>)}{ZONES.includes(config.timezone) ? null : <option value="custom">{config.timezone}</option>}</select></Field>
      </Disclosure>

      <Disclosure title="Working hours" defaultOpen hint="When each person can be booked. A break is simply a gap between two times.">
        {people.length > 1 ? <Field label="Whose hours"><select className={input} value={who} onChange={(e) => setWho(e.target.value)}>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field> : null}
        <ul className="grid gap-2">
          {DAYS.map((d) => {
            const wins = hours[d] ?? []
            return (
              <li key={d} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[8rem_1fr] sm:items-start" data-day={d}>
                <label className="flex min-h-11 items-center gap-3 text-sm font-medium"><Switch checked={wins.length > 0} aria-label={`${NAME[d]} open`} onCheckedChange={(on) => patchHours((h) => ({ ...h, [d]: on ? [{ start: "09:00", end: "17:00" }] : [] }))} />{NAME[d]}</label>
                {wins.length ? (
                  <div className="grid gap-2">
                    {wins.map((w, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <input type="time" aria-label={`${NAME[d]} from`} className={input} value={w.start} onChange={(e) => setWin(d, i, { start: e.target.value })} />
                        <span aria-hidden="true">to</span>
                        <input type="time" aria-label={`${NAME[d]} until`} className={input} value={w.end} onChange={(e) => setWin(d, i, { end: e.target.value })} />
                        <Button variant="ghost" size="icon" className="size-11" aria-label={`Remove this time on ${NAME[d]}`} onClick={() => patchHours((h) => ({ ...h, [d]: wins.filter((_, n) => n !== i) }))}><Trash2 /></Button>
                        {w.start >= w.end ? <span role="alert" className="text-xs text-destructive">Must end after it starts</span> : null}
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => patchHours((h) => ({ ...h, [d]: [...wins, { start: "14:00", end: "17:00" }] }))}><Plus /> Add a time (for a break)</Button>
                      <Button variant="outline" size="sm" onClick={() => patchHours((h) => Object.fromEntries(DAYS.map((x) => [x, ["sat", "sun"].includes(x) ? h[x] ?? [] : wins.map((w) => ({ ...w }))])))}><Copy /> Copy to Mon to Fri</Button>
                    </div>
                  </div>
                ) : <p className="py-2.5 text-sm text-muted-foreground">Closed</p>}
              </li>
            )
          })}
        </ul>
      </Disclosure>

      <Disclosure title="Booking rules" hint="Applied to every online booking.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Minimum notice (hours)" hint="How soon before a time it can still be booked."><input className={input} type="number" min={0} max={720} value={Math.round(rules.minNoticeMinutes / 60)} onChange={(e) => setRule("minNoticeMinutes", num(e.target.value, 0, 720, 2) * 60)} /></Field>
          <Field label="Book up to (days ahead)"><input className={input} type="number" min={1} max={730} value={rules.maxAdvanceDays} onChange={(e) => setRule("maxAdvanceDays", num(e.target.value, 1, 730, 60))} /></Field>
          <Field label="Start times every (minutes)"><select className={input} value={rules.slotIntervalMinutes} onChange={(e) => setRule("slotIntervalMinutes", Number(e.target.value))}>{[10, 15, 20, 30, 45, 60].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
          <Field label="Hold a chosen time for (minutes)" hint="While the customer fills in their details."><input className={input} type="number" min={1} max={60} value={rules.holdMinutes} onChange={(e) => setRule("holdMinutes", num(e.target.value, 1, 60, 10))} /></Field>
          <Field label="Buffer before (minutes)"><input className={input} type="number" min={0} max={240} value={rules.bufferBeforeMinutes} onChange={(e) => setRule("bufferBeforeMinutes", num(e.target.value, 0, 240, 0))} /></Field>
          <Field label="Buffer after (minutes)"><input className={input} type="number" min={0} max={240} value={rules.bufferAfterMinutes} onChange={(e) => setRule("bufferAfterMinutes", num(e.target.value, 0, 240, 0))} /></Field>
          <Field label="Time to answer a request (hours)" hint="After this, an unanswered request stops holding the time."><input className={input} type="number" min={1} max={336} value={rules.pendingExpiryHours} onChange={(e) => setRule("pendingExpiryHours", num(e.target.value, 1, 336, 48))} /></Field>
          <Field label="Customers can cancel until (hours before)"><input className={input} type="number" min={0} max={720} value={rules.cancelUntilHours} onChange={(e) => setRule("cancelUntilHours", num(e.target.value, 0, 720, 24))} /></Field>
          <Field label="Customers can reschedule until (hours before)"><input className={input} type="number" min={0} max={720} value={rules.rescheduleUntilHours} onChange={(e) => setRule("rescheduleUntilHours", num(e.target.value, 0, 720, 24))} /></Field>
        </div>
        <Field label="Cancellation wording shown to customers (optional)"><input className={input} maxLength={300} value={rules.cancellationNote ?? ""} onChange={(e) => setRule("cancellationNote", e.target.value || undefined)} /></Field>
      </Disclosure>

      <Disclosure title="Days off and special hours" count={config.exceptions.length || undefined} hint="Holidays, a late start, or a day when only one person works.">
        <ul className="grid gap-2">
          {config.exceptions.length === 0 ? <li className="text-sm text-muted-foreground">None yet.</li> : null}
          {config.exceptions.slice().sort((a, b) => a.date.localeCompare(b.date)).map((x) => (
            <li key={x.id} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"><span><strong>{formatDay(x.date)}</strong> · {x.staffId === null ? "Everyone" : people.find((p) => p.id === x.staffId)?.name ?? x.staffId} · {x.windows.length ? x.windows.map((w) => `${w.start} to ${w.end}`).join(", ") : "Closed"}</span><Button variant="ghost" size="icon" className="size-11" aria-label="Remove" onClick={() => setConfig((c) => ({ ...c, exceptions: c.exceptions.filter((e) => e.id !== x.id) }))}><Trash2 /></Button></li>
          ))}
        </ul>
        <div className="grid gap-3 rounded-xl bg-muted/50 p-3 sm:grid-cols-2">
          <Field label="Date"><input type="date" className={input} value={ex.date} onChange={(e) => setEx({ ...ex, date: e.target.value })} /></Field>
          <Field label="Who"><select className={input} value={ex.who} onChange={(e) => setEx({ ...ex, who: e.target.value })}><option value="all">Everyone</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2"><Switch checked={ex.closed} onCheckedChange={(v) => setEx({ ...ex, closed: v })} aria-label="Closed all day" />Closed all day</label>
          {!ex.closed ? <div className="flex items-center gap-2 sm:col-span-2"><input type="time" aria-label="From" className={input} value={ex.start} onChange={(e) => setEx({ ...ex, start: e.target.value })} /><span aria-hidden="true">to</span><input type="time" aria-label="Until" className={input} value={ex.end} onChange={(e) => setEx({ ...ex, end: e.target.value })} /></div> : null}
          <Button className="min-h-11 sm:col-span-2" disabled={!ex.date || (!ex.closed && ex.start >= ex.end)} onClick={() => { setConfig((c) => ({ ...c, exceptions: [...c.exceptions.filter((e) => !(e.date === ex.date && e.staffId === (ex.who === "all" ? null : ex.who))), { id: newId("ex"), date: ex.date, staffId: ex.who === "all" ? null : ex.who, windows: ex.closed ? [] : [{ start: ex.start, end: ex.end }] }] })); setEx({ ...ex, date: "" }) }}>Add</Button>
        </div>
      </Disclosure>

      {ctx.services.some((s) => s.durationMinutes) ? (
        <Disclosure title="Per service" hint="Extra time around a service, or a class that takes several people at once.">
          <ul className="grid gap-2">
            {ctx.services.filter((s) => s.durationMinutes).map((s) => {
              const o = config.serviceOverrides.find((x) => x.serviceId === s.id)
              const set = (patch: Partial<NonNullable<typeof o>>) => setConfig((c) => ({ ...c, serviceOverrides: [...c.serviceOverrides.filter((x) => x.serviceId !== s.id), { serviceId: s.id, ...o, ...patch }] }))
              return (
                <li key={s.id} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_repeat(3,6.5rem)] sm:items-end">
                  <p className="font-medium">{s.name}<span className="block text-xs font-normal text-muted-foreground">{s.durationMinutes} min</span></p>
                  <Field label="Buffer before"><input className={input} type="number" min={0} max={240} placeholder={String(rules.bufferBeforeMinutes)} value={o?.bufferBeforeMinutes ?? ""} onChange={(e) => set({ bufferBeforeMinutes: e.target.value === "" ? undefined : num(e.target.value, 0, 240, 0) })} /></Field>
                  <Field label="Buffer after"><input className={input} type="number" min={0} max={240} placeholder={String(rules.bufferAfterMinutes)} value={o?.bufferAfterMinutes ?? ""} onChange={(e) => set({ bufferAfterMinutes: e.target.value === "" ? undefined : num(e.target.value, 0, 240, 0) })} /></Field>
                  <Field label="People per time"><input className={input} type="number" min={1} max={200} value={o?.capacity ?? 1} onChange={(e) => set({ capacity: num(e.target.value, 1, 200, 1) })} /></Field>
                </li>
              )
            })}
          </ul>
        </Disclosure>
      ) : <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">Add a service with a length of time (and set it to instant booking or by request) so customers have something to book.</p>}
    </div>
  )
}
