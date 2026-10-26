"use client"
import * as React from "react"
import { Check, ChevronDown, Clock3, Plus, Trash2 } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { newWidget } from "@/features/page/starter"
import { RecordForm, blankFor, commitRecord, validate } from "@/features/page/editor/RecordForms"
import { getIndustryPreset } from "@/features/themes/presets/industries"
import { blankService, newId, normService } from "@/features/demo/actions"
import { setupJourney } from "@/features/demo/setup-journey"
import { cn } from "@/lib/utils"
import { Field } from "../Field"
import { goalOf } from "../goal"
import { useSetup } from "../context"

const toPounds = (minor?: number) => (minor === undefined ? "" : (minor / 100).toFixed(minor % 100 === 0 ? 0 : 2))
interface Row { id: string; name: string; price: string; minutes: string; priceMode?: "fixed" | "from" | "quote" | "free" }
const validRow = (r: Row) => r.name.trim().length > 0 && (r.priceMode === "quote" || r.priceMode === "free" || /^\d{1,6}(\.\d{1,2})?$/.test(r.price.trim()))
const blankRow = (): Row => ({ id: newId("svc"), name: "", price: "", minutes: "" })

/** Step 4: the first things people will see, then where and when. Nothing is added or priced for them. */
export function OfferStep() {
  const { s, part, setValid } = useSetup()
  const kind = setupJourney(s.content.identity.industryKey).kind
  const showOffer = part === undefined || part === 0
  const showWhen = part === undefined || part === 1
  return (
    <div className="sf-stack">
      <div className="sf-stack" hidden={!showOffer}>
        {kind === "service" ? <Services onValidity={setValid} /> : <Record kind={kind} onValidity={setValid} />}
      </div>
      <div className="sf-stack" hidden={!showWhen}><WhereAndWhen /></div>
    </div>
  )
}

function Services({ onValidity }: { onValidity: (v: boolean) => void }) {
  const { s, update } = useSetup()
  const industry = getIndustryPreset(s.content.identity.industryKey)
  const j = setupJourney(industry.id)
  const [rows, setRows] = React.useState<Row[]>(() => {
    if (s.setupDrafts?.services) return s.setupDrafts.services
    const have = (s.content.services ?? []).filter((x) => !x.archived).map((x) => ({ id: x.id, name: x.name, price: toPounds(x.priceMinor), priceMode: x.priceMode, minutes: x.durationMinutes ? String(x.durationMinutes) : "" }))
    return have.length ? have : [blankRow()]
  })
  React.useEffect(() => { onValidity(rows.every((r) => (!r.name.trim() && !r.price && !r.minutes) || validRow(r))) }, [rows, onValidity])
  const [focus, setFocus] = React.useState<string | null>(null)
  const [pricing, setPricing] = React.useState<string | null>(null)
  const booking = goalOf(s) === "book"

  const sync = (next: Row[]) => {
    setRows(next)
    update((st) => {
      const kept = (st.content.services ?? []).filter((x) => x.archived)
      const done = next.filter(validRow).map((r, i) => {
        const prev = (st.content.services ?? []).find((x) => x.id === r.id)
        const minutes = r.minutes ? Math.min(parseInt(r.minutes, 10), 1440) : undefined
        return normService({ ...(prev ?? blankService(i)), id: r.id, name: r.name.trim(), priceMode: r.priceMode ?? "fixed", priceMinor: r.priceMode === "quote" || r.priceMode === "free" ? undefined : Math.round(parseFloat(r.price) * 100), durationMinutes: minutes && minutes > 0 ? minutes : undefined, bookingMode: booking ? "request" : "contact", sortOrder: i + 1 })
      })
      return { ...st, content: { ...st.content, services: [...kept, ...done] }, setupDrafts: { ...st.setupDrafts, services: next } }
    }, { coalesce: "first-services" })
  }
  const patch = (id: string, p: Partial<Row>) => sync(rows.map((r) => (r.id === id ? { ...r, ...p } : r)))
  const used = new Set(rows.map((r) => r.name.trim().toLowerCase()))
  const suggestions = industry.suggestedServices.filter((x) => !used.has(x.name.toLowerCase())).slice(0, 5)
  const add = (name = "") => { const row = { ...blankRow(), name }; setFocus(name ? `${row.id}-price` : `${row.id}-name`); sync([...rows, row]) }
  const anyMinutes = rows.some((r) => validRow(r) && r.minutes)
  const first = rows[0]

  return (
    <div className="sf-stack" data-testid="first-services">
      {suggestions.length ? (
        <div className="sf-group">
          <p className="sf-label">Popular for {industry.label.toLowerCase()}</p>
          <ul className="sf-suggest" aria-label="Common services">
            {suggestions.map((sg) => (
              <li key={sg.name}>
                <button type="button" className="sf-pill" onClick={() => { const empty = rows.find((r) => !r.name.trim() && !r.price); if (empty) { setFocus(`${empty.id}-price`); patch(empty.id, { name: sg.name }) } else add(sg.name) }}><Plus aria-hidden="true" />{sg.name}</button>
              </li>
            ))}
          </ul>
          <p className="sf-hint">Tap one to start, then add your own price.</p>
        </div>
      ) : null}
      <ul className="sf-rows">
        {rows.map((r, i) => (
          <li key={r.id} className="sf-row">
            <div className="sf-field sf-row-name"><label htmlFor={`${r.id}-name`}>{i === 0 ? j.noun : <span className="sr-only">Service</span>}</label><input id={`${r.id}-name`} className="sf-input" aria-label={`Service ${i + 1} name`} placeholder={first && i === 0 ? industry.suggestedServices[0]?.name ?? "e.g. Initial consultation" : "Name"} maxLength={120} autoFocus={focus === `${r.id}-name`} value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} /></div>
            <div className="sf-field"><label htmlFor={`${r.id}-price`}>{i === 0 ? "Price (£)" : <span className="sr-only">Price</span>}</label><input id={`${r.id}-price`} className="sf-input" aria-label={`Service ${i + 1} price`} inputMode="decimal" disabled={r.priceMode === "quote" || r.priceMode === "free"} placeholder={r.priceMode === "quote" ? "Quote" : r.priceMode === "free" ? "Free" : "0.00"} autoFocus={focus === `${r.id}-price`} value={r.priceMode === "quote" || r.priceMode === "free" ? "" : r.price} onChange={(e) => { if (/^\d{0,6}(\.\d{0,2})?$/.test(e.target.value)) patch(r.id, { price: e.target.value }) }} /></div>
            <div className={cn("sf-field", industry.id === "hospitality" && "hidden")}><label htmlFor={`${r.id}-min`}>{i === 0 ? "Minutes" : <span className="sr-only">Minutes</span>}</label><input id={`${r.id}-min`} className="sf-input" aria-label={`Service ${i + 1} minutes`} inputMode="numeric" placeholder="30" value={r.minutes} onChange={(e) => patch(r.id, { minutes: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></div>
            <button type="button" className="sf-icon-btn sf-row-remove" aria-label={`Remove service ${i + 1}`} disabled={rows.length === 1 && !r.name && !r.price} onClick={() => { const next = rows.filter((x) => x.id !== r.id); sync(next.length ? next : [blankRow()]) }}><Trash2 aria-hidden="true" /></button>
            <button type="button" className="sf-link sf-row-options" onClick={() => setPricing(r.id)}>Pricing options{r.priceMode && r.priceMode !== "fixed" ? ` · ${r.priceMode}` : ""}</button>
          </li>
        ))}
      </ul>
      <button type="button" className="sf-btn" data-kind="soft" style={{ justifySelf: "start", minHeight: 46 }} onClick={() => add()}><Plus aria-hidden="true" />Add another</button>
      {booking && !anyMinutes ? <p className="sf-hint" data-testid="booking-hint">Add how long a service takes and people can ask to book it. Without a time, they send an enquiry instead.</p> : null}
      <Overlay open={pricing !== null} onOpenChange={(o) => !o && setPricing(null)} title="How is this priced?" footer={<button type="button" className="sf-btn" data-kind="primary" style={{ width: "100%" }} onClick={() => setPricing(null)}>Done</button>}>
        <div className="grid gap-2">{([{ id: "fixed", label: "A fixed price" }, { id: "from", label: "Prices start from" }, { id: "quote", label: "Ask for a quote" }, { id: "free", label: "Free" }] as const).map((mode) => <button key={mode.id} type="button" className="sf-tile" aria-pressed={(rows.find((r) => r.id === pricing)?.priceMode ?? "fixed") === mode.id} onClick={() => pricing && patch(pricing, { priceMode: mode.id })}>{mode.label}</button>)}</div>
      </Overlay>
    </div>
  )
}

function Record({ kind, onValidity }: { kind: "vehicle" | "photo" | "product"; onValidity: (v: boolean) => void }) {
  const { s, update } = useSetup()
  const [draft, setDraft] = React.useState<unknown>(() => (s.setupDrafts?.record?.kind === kind ? s.setupDrafts.record.value : blankFor(kind, s.content)))
  const [show, setShow] = React.useState(false)
  const [blank] = React.useState(() => JSON.stringify(blankFor(kind, s.content), (k, v) => (k === "id" ? undefined : v)))
  React.useEffect(() => onValidity(JSON.stringify(draft, (k, v) => (k === "id" ? undefined : v)) === blank), [draft, blank, onValidity])
  const items = kind !== "photo" ? (s.content.products ?? []).filter((p) => !p.archived && p.kind === kind).map((p) => p.name) : (s.content.gallery ?? []).map((g, i) => g.caption || `Photo ${i + 1}`)
  const save = () => {
    if (Object.keys(validate(kind, draft)).length) { setShow(true); return }
    update((st) => ({ ...st, content: commitRecord(kind, draft, st.content), setupDrafts: { ...st.setupDrafts, record: undefined } }))
    setDraft(blankFor(kind, s.content)); setShow(false)
  }
  return (
    <div className="sf-stack" data-testid="first-record">
      {items.length ? <ul className="sf-added" aria-label="Added"><li><b>Added so far</b></li>{items.map((n, i) => <li key={i}><Check aria-hidden="true" />{n}</li>)}</ul> : null}
      <RecordForm setup key={items.length} kind={kind} value={draft} onChange={(v) => { setDraft(v); update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, record: { kind, value: v } } })) }} showErrors={show} content={s.content} />
      <button type="button" className="sf-btn" data-kind="primary" style={{ justifySelf: "start" }} onClick={save} data-testid="first-record-save">{kind === "vehicle" ? "Add this vehicle" : kind === "product" ? "Add this product" : "Add these photos"}</button>
    </div>
  )
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
type Day = { day: (typeof DAYS)[number]; opens: string; closes: string }
const PRESETS: { id: string; label: string; days: Day[] }[] = [
  { id: "wk", label: "Mon to Fri, 9 to 5", days: DAYS.slice(0, 5).map((day) => ({ day, opens: "09:00", closes: "17:00" })) },
  { id: "wks", label: "Mon to Sat, 9 to 6", days: DAYS.slice(0, 6).map((day) => ({ day, opens: "09:00", closes: "18:00" })) },
  { id: "all", label: "Every day, 8 to 8", days: DAYS.map((day) => ({ day, opens: "08:00", closes: "20:00" })) },
]

/** The place and the opening hours. Both optional: only what is added appears on the page. */
function WhereAndWhen() {
  const { s, update } = useSetup()
  const hours = (s.content.hours ?? []).filter((h) => h.opens && h.closes).map((h) => ({ day: h.day, opens: h.opens!, closes: h.closes! })) as Day[]
  const [custom, setCustom] = React.useState(false)
  const setHours = (days: Day[]) => update((st) => {
    const widgets = [...st.page.widgets]
    if (days.length && !widgets.some((w) => w.type === "hours")) widgets.push(newWidget("hours"))
    return { ...st, content: { ...st.content, hours: days }, page: { ...st.page, widgets } }
  }, { coalesce: "hours" })
  const setTown = (town: string) => update((st) => {
    const widgets = [...st.page.widgets]
    const type = st.content.location.mode === "service_area" ? "serviceArea" : "location"
    if (town.trim() && !widgets.some((w) => w.type === type)) widgets.push(newWidget(type))
    return { ...st, content: { ...st.content, location: { ...st.content.location, locality: town.trim() ? town : undefined } }, page: { ...st.page, widgets } }
  }, { coalesce: "town" })
  const preset = PRESETS.find((p) => JSON.stringify(p.days) === JSON.stringify(hours))
  const edit = (day: Day["day"], patch: Partial<Day> | null) => setHours(patch === null ? hours.filter((h) => h.day !== day) : hours.some((h) => h.day === day) ? hours.map((h) => (h.day === day ? { ...h, ...patch } : h)) : [...hours, { day, opens: "09:00", closes: "17:00", ...patch }].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)))
  return (
    <div className="sf-stack" data-testid="setup-business-details">
      <Field label="Town or area" optional placeholder="e.g. St Albans" value={s.content.location.locality ?? ""} maxLength={120} onChange={(e) => setTown(e.target.value)} />
      <div className="sf-group">
        <p className="sf-label">Opening hours <small>optional</small></p>
        <div className="sf-suggest" role="group" aria-label="Opening hours">
          {PRESETS.map((p) => <button key={p.id} type="button" className="sf-pill" aria-pressed={preset?.id === p.id} onClick={() => setHours(preset?.id === p.id ? [] : p.days)}><Clock3 aria-hidden="true" />{p.label}</button>)}
          <button type="button" className="sf-pill" aria-expanded={custom} onClick={() => setCustom((v) => !v)}>Set each day<ChevronDown aria-hidden="true" className={cn("transition-transform", custom && "rotate-180")} /></button>
        </div>
        {custom ? (
          <ul className="sf-days">
            {DAYS.map((day, i) => {
              const h = hours.find((x) => x.day === day)
              return (
                <li key={day} data-on={Boolean(h)}>
                  <label className="sf-day-toggle"><input type="checkbox" aria-label={NAMES[i]} checked={Boolean(h)} onChange={(e) => edit(day, e.target.checked ? {} : null)} /><span>{NAMES[i]}</span></label>
                  {h ? <span className="sf-day-times"><input type="time" aria-label={`${NAMES[i]} opens`} value={h.opens} onChange={(e) => edit(day, { opens: e.target.value })} /><span aria-hidden="true">to</span><input type="time" aria-label={`${NAMES[i]} closes`} value={h.closes} onChange={(e) => edit(day, { closes: e.target.value })} /></span> : <span className="sf-day-closed">Closed</span>}
                </li>
              )
            })}
          </ul>
        ) : null}
        <p className="sf-hint">By appointment? Leave this empty. Only what you add appears on your page.</p>
      </div>
    </div>
  )
}
