"use client"

import * as React from "react"
import { Check, ChevronRight, Plus, Search, Trash2 } from "lucide-react"
import { TAPLO_DOMAINS } from "@/lib/domains"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { ImageField } from "@/features/page/editor/controls"
import { getIndustryPreset, searchIndustries } from "@/features/themes/presets/industries"
import { normalizePhone } from "@/lib/validation"
import { cn } from "@/lib/utils"
import { WHEN_UNAVAILABLE } from "@/lib/capabilities"
import { BusinessIcon } from "./BusinessIcon"
import { accountsConfigured, connect, session } from "./account"
import { setupJourney } from "./setup-journey"
import { applyIndustry, blankService, newId, normService, setName, setSlug, slugProblems } from "./actions"
import { initialState, storageHasFailed, useDemo } from "./store"

/* ------------------------------------------------------------------ Type */

const PHOTO = new Set(["other", "personal-trainer", "cleaner", "barber", "detailer", "plumber", "tutor", "hospitality", "car-dealer"])
const TILES: { id: string; label: string }[] = [
  { id: "barber", label: "Barber or salon" },
  { id: "detailer", label: "Car detailing" },
  { id: "plumber", label: "Trades" },
  { id: "tutor", label: "Tutor or coach" },
  { id: "personal-trainer", label: "Trainer" },
  { id: "hospitality", label: "Cafe or restaurant" },
  { id: "car-dealer", label: "Car dealer" },
  { id: "cleaner", label: "Cleaner" },
  { id: "other", label: "Something else" },
]
/** Work that happens at the customer's door rather than at a premises. Inferred, never asked. */
const MOBILE_WORK = new Set(["plumber", "electrician", "detailer", "cleaner", "handyman", "builder"])

export function TypeStep() {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const key = s.content.identity.industryKey
  const chosen = state !== null && Boolean(s.content.identity.industryLabel.trim())
  const [otherOpen, setOtherOpen] = React.useState(() => chosen && !TILES.some((t) => t.id === key && t.id !== "other") && !["electrician"].includes(key))
  const [query, setQuery] = React.useState("")
  const pick = (id: string, label?: string) => update((x) => {
    const next = applyIndustry(x, id, label)
    return { ...next, content: { ...next.content, location: { ...next.content.location, mode: MOBILE_WORK.has(id) ? "service_area" : next.content.location.mode } } }
  })
  const inTrades = key === "plumber" || key === "electrician"
  return (
    <div className="sf-stack" data-testid="type-step">
      <ul className="sf-tiles" aria-label="Kinds of business">
        {TILES.map((t) => {
          const selected = chosen && (t.id === "other" ? otherOpen || key === "other" : t.id === "plumber" ? inTrades : key === t.id && !otherOpen)
          return (
            <li key={t.id}>
              <button
                type="button"
                className="sf-tile"
                data-photo={PHOTO.has(t.id) ? "image" : "tone"}
                aria-pressed={selected}
                data-testid={`tile-${t.id}`}
                onClick={() => { if (t.id === "other") { setOtherOpen(true); pick("other", "") } else { setOtherOpen(false); pick(t.id) } }}
              >
                <span className="sf-tile-picture" aria-hidden="true" style={PHOTO.has(t.id) ? { backgroundImage: `url(${t.id === "hospitality" ? "/showcase/originals/bakery-studio-v2.webp" : `/photography/generated/tiles/${t.id === "other" ? "general" : t.id}.webp`})` } : undefined}>
                  <span className="sf-tile-icon"><BusinessIcon id={t.id === "other" ? "other" : t.id} /></span>
                </span>
                <span className="sf-tile-label">{t.label}</span>
                {selected ? <Check className="sf-tile-check" aria-hidden="true" /> : null}
              </button>
            </li>
          )
        })}
      </ul>
      {inTrades && !otherOpen ? (
        <div className="sf-chips" role="group" aria-label="Which trade">
          {([["plumber", "Plumber"], ["electrician", "Electrician"]] as const).map(([id, label]) => (
            <button key={id} type="button" className="sf-chip" aria-pressed={key === id} onClick={() => pick(id)}>{label}</button>
          ))}
        </div>
      ) : null}
      {otherOpen ? (
        <div className="sf-stack" data-testid="other-type">
          <TaploInput label="What do you do?" hint="e.g. Dog groomer, Wedding florist, Piano restorer" value={s.content.identity.industryKey === "other" ? s.content.identity.industryLabel : ""} maxLength={80}
            onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })} />
          <div className="sf-search">
            <Search aria-hidden="true" />
            <input aria-label="Search all kinds of business" placeholder="Search all kinds of business" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
          </div>
          {query.trim() ? (
            <ul className="sf-results" aria-label="Matching kinds of business">
              {searchIndustries(query).slice(0, 5).map((p) => (
                <li key={p.id}><button type="button" onClick={() => { setOtherOpen(false); setQuery(""); pick(p.id) }}><span className="sf-tile-icon"><BusinessIcon id={p.id} /></span>{p.label}<ChevronRight aria-hidden="true" /></button></li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ Name */

export function NameStep({ showErrors, desktop }: { showErrors: boolean; desktop: boolean }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const c = s.content
  const sample = getIndustryPreset(c.identity.industryKey).suggestedServices[0]?.name
  const [editSlug, setEditSlug] = React.useState(false)
  const [lineOpen, setLineOpen] = React.useState(Boolean(c.identity.tagline))
  const errs = slugProblems(c.identity.slug)
  const nameMissing = showErrors && !c.identity.name.trim()
  return (
    <div className="sf-stack" data-testid="name-step">
      <TaploInput label="Business name" autoFocus={desktop} placeholder="e.g. Fade Street Barbers" value={c.identity.name} maxLength={100} autoComplete="organization"
        error={nameMissing ? "Add your business name to continue." : undefined}
        onChange={(e) => update((x) => setName(x, e.target.value), { coalesce: "name" })} />
      <div className="sf-address" data-testid="setup-address">
        <span className="sf-address-url" aria-live="polite"><span>{TAPLO_DOMAINS.host}/</span><strong>{c.identity.slug || "your-name"}</strong></span>
        <button type="button" onClick={() => setEditSlug((v) => !v)} aria-expanded={editSlug || (showErrors && errs.length > 0)} className="sf-link">{editSlug ? "Done" : "Change"}</button>
        {errs.length && c.identity.slug ? <span className="sf-error" role="alert">{SLUG_PROBLEM_MESSAGE[errs[0]!]}</span> : null}
      </div>
      {editSlug || (showErrors && errs.length) ? (
        <TaploInput label="Web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" autoCorrect="off" error={showErrors && errs.length ? SLUG_PROBLEM_MESSAGE[errs[0]!] : undefined}
          onChange={(e) => update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} />
      ) : null}
      <p className="sf-help">Your address is reserved when you create your account.</p>
      {lineOpen ? (
        <TaploInput label="A line about you (optional)" placeholder={sample ? `e.g. ${sample} and more, in St Albans.` : "e.g. Independent studio in St Albans."} value={c.identity.tagline ?? ""} maxLength={160}
          onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, tagline: e.target.value || undefined } } }), { coalesce: "tag" })} />
      ) : (
        <button type="button" className="sf-row" onClick={() => setLineOpen(true)}><span>Add a line about you</span><em>Optional</em><ChevronRight aria-hidden="true" /></button>
      )}
      <ImageField presentation="identity" framing={s.page.appearance.header?.avatarShape === "circle" ? "circle" : s.page.appearance.header?.avatarShape === "square" ? "square" : "logo"} purpose="identity" samples={false}
        onFramingChange={(shape) => update((x) => ({ ...x, page: { ...x.page, appearance: { ...x.page.appearance, header: { ...x.page.appearance.header, avatarShape: shape } } } }))}
        label="Add a logo or photo · Optional" cropAspect={1} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640} value={c.identity.logo ?? null}
        onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, logo: v ?? undefined } } }))} />
    </div>
  )
}

/* ---------------------------------------------------------------- Action */

export type Goal = "book" | "enquire" | "call" | "message"
export function goalOf(s: { content: { booking?: { mode: string } }; page: { meta: { primaryAction: string } } }): Goal {
  const a = s.page.meta.primaryAction
  if (a === "call") return "call"
  if (a === "whatsapp" || a === "email") return "message"
  const m = s.content.booking?.mode
  return m === "instant" || m === "request" ? "book" : "enquire"
}
// Whether a booking is confirmed straight away or accepted by hand is a setting for when services and hours exist (Bookings), not a question for the first minute.
export function applyGoal<T extends ReturnType<typeof initialState>>(s: T, g: Goal): T {
  const mode = g === "book" ? "request" : "contact"
  const primaryAction = g === "book" ? "book" : g === "call" ? "call" : g === "message" ? (s.content.contacts.whatsapp ? "whatsapp" : "email") : "auto"
  const widgets = s.page.widgets.map((w) => (w.type === "booking" ? { ...w, hidden: g !== "book" } : w))
  return { ...s, content: { ...s.content, booking: { ...s.content.booking, mode }, }, page: { ...s.page, widgets, meta: { ...s.page.meta, primaryAction } } }
}
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const ACTIONS: { id: Goal; label: string; line: string }[] = [
  { id: "book", label: "Request a booking", line: "Customers pick a service and ask for a time." },
  { id: "call", label: "Call you", line: "Opens the phone's call screen." },
  { id: "message", label: "Message you", line: "Opens WhatsApp or email." },
  { id: "enquire", label: "Get in touch", line: "A simple enquiry from your page." },
]

/** One decision and, for the chosen channel only, its one detail. Replaces the old goals, main-button and contact steps. */
export function ActionStep({ showErrors, onValidity }: { showErrors: boolean; onValidity: (valid: boolean) => void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const goal = goalOf(s)
  const c = s.content.contacts
  const [phone, setPhone] = React.useState(c.phone ?? "")
  const [email, setEmail] = React.useState(c.email ?? "")
  const [whatsapp, setWhatsapp] = React.useState(c.whatsapp ?? "")
  const phoneOk = Boolean(normalizePhone(phone))
  const msgOk = (Boolean(email) && emailOk(email)) || (Boolean(whatsapp) && Boolean(normalizePhone(whatsapp)))
  const valid = goal === "call" ? phoneOk : goal === "message" ? msgOk : (!email || emailOk(email)) && (!phone || phoneOk)
  React.useEffect(() => onValidity(valid), [valid, onValidity])
  const save = (patch: { phone?: string; email?: string; whatsapp?: string }) => update((st) => ({
    ...st,
    content: { ...st.content, contacts: {
      ...st.content.contacts,
      ...(patch.phone !== undefined ? { phone: normalizePhone(patch.phone) ?? undefined } : {}),
      ...(patch.email !== undefined ? { email: emailOk(patch.email) ? patch.email.trim() : undefined } : {}),
      ...(patch.whatsapp !== undefined ? { whatsapp: normalizePhone(patch.whatsapp) ?? undefined } : {}),
    } },
  }), { coalesce: "contact" })
  return (
    <div className="sf-stack" data-testid="action-step">
      <div role="radiogroup" aria-label="What should customers do first?" className="sf-radios">
        {ACTIONS.map((a) => {
          const on = goal === a.id
          return (
            <div key={a.id} className="sf-radio" data-on={on}>
              <button type="button" role="radio" aria-checked={on} className="sf-radio-head" data-testid={`action-${a.id}`} onClick={() => update((x) => applyGoal(x, a.id))}>
                <span className="sf-radio-dot" aria-hidden="true" />
                <span className="sf-radio-text"><strong>{a.label}</strong><small>{a.line}</small></span>
              </button>
              {on && a.id === "call" ? (
                <TaploInput label="Phone number" type="tel" inputMode="tel" autoComplete="tel" placeholder="07700 900123" value={phone} error={showErrors && !phoneOk ? "Enter the number people should call." : undefined}
                  onChange={(e) => { setPhone(e.target.value); save({ phone: e.target.value }) }} />
              ) : null}
              {on && a.id === "message" ? (
                <div className="sf-stack">
                  <TaploInput label="Email" type="email" inputMode="email" autoComplete="email" placeholder="hello@yourbusiness.co.uk" value={email} error={showErrors && !msgOk ? "Add an email or a WhatsApp number." : undefined}
                    onChange={(e) => { setEmail(e.target.value); save({ email: e.target.value }) }} />
                  <TaploInput label="WhatsApp number (optional)" type="tel" inputMode="tel" placeholder="07700 900123" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); save({ whatsapp: e.target.value }) }} />
                </div>
              ) : null}
              {on && a.id === "enquire" ? (
                <TaploInput label="Where should enquiries go? (optional)" type="email" inputMode="email" autoComplete="email" placeholder="hello@yourbusiness.co.uk" value={email} error={showErrors && email && !emailOk(email) ? "Enter a valid email address." : undefined}
                  onChange={(e) => { setEmail(e.target.value); save({ email: e.target.value }) }} />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- Services */

const toPounds = (minor?: number) => (minor === undefined ? "" : (minor / 100).toFixed(minor % 100 === 0 ? 0 : 2))
interface Row { id: string; name: string; price: string; minutes: string; priceMode?: "fixed" | "from" | "quote" | "free" }
const validRow = (r: Row) => r.name.trim().length > 0 && (r.priceMode === "quote" || r.priceMode === "free" || /^\d{1,6}(\.\d{1,2})?$/.test(r.price.trim()))

/**
 * Services are the last thing asked because they ask the most. Rows save as soon as they are complete, so the page fills in while the owner types.
 * Nothing is suggested as a price; the examples already on the page stay labelled as examples until the owner adds their own.
 */
export function ServicesStep({ onValidity }: { onValidity: (valid: boolean) => void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const industry = getIndustryPreset(s.content.identity.industryKey)
  const journey = setupJourney(industry.id)
  const [rows, setRows] = React.useState<Row[]>(() => {
    if (s.setupDrafts?.services) return s.setupDrafts.services
    const have = (s.content.services ?? []).filter((x) => !x.archived).map((x) => ({ id: x.id, name: x.name, price: toPounds(x.priceMinor), priceMode: x.priceMode, minutes: x.durationMinutes ? String(x.durationMinutes) : "" }))
    return have.length ? have : [{ id: newId("svc"), name: "", price: "", minutes: "" }]
  })
  React.useEffect(() => { onValidity(rows.every((r) => (!r.name.trim() && !r.price && !r.minutes) || validRow(r))) }, [rows, onValidity])
  const [focus, setFocus] = React.useState<string | null>(null)
  const [pricing, setPricing] = React.useState<string | null>(null)
  const booking = goalOf(s) === "book"

  if (journey.kind !== "service") {
    return (
      <div className="sf-stack" data-testid="services-step">
        <p className="sf-help">{journey.kind === "vehicle" ? "Add your vehicles in Studio, where you can upload photos and set prices." : journey.kind === "product" ? "Add your products in Studio, where you can upload photos and set prices." : "Add your photos in Studio, where you can crop and caption them."} Your page already works without them.</p>
      </div>
    )
  }
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
  const suggestions = industry.suggestedServices.filter((x) => !used.has(x.name.toLowerCase())).slice(0, 4)
  const add = (name = "") => { const row = { id: newId("svc"), name, price: "", minutes: "" }; setFocus(name ? `${row.id}-price` : `${row.id}-name`); sync([...rows, row]) }
  const field = "sf-input"
  return (
    <div className="sf-stack" data-testid="services-step">
      <p className="sf-help">Add what you want people to see first, with a price if you like. The examples on your page stay labelled as examples until you do.</p>
      {suggestions.length ? (
        <ul className="sf-chips" aria-label="Common services">
          {suggestions.map((sg) => (
            <li key={sg.name}><button type="button" className="sf-chip" onClick={() => { const empty = rows.find((r) => !r.name.trim() && !r.price); if (empty) { setFocus(`${empty.id}-price`); patch(empty.id, { name: sg.name }) } else add(sg.name) }}>{sg.name}</button></li>
          ))}
        </ul>
      ) : null}
      <div className="sf-service sf-service-head" aria-hidden="true"><span>Service</span><span>Price £</span><span>Minutes</span><span /></div>
      <ul className="sf-stack">
        {rows.map((r, i) => (
          <li key={r.id} className="sf-service">
            <label><span className="sr-only">{`Service ${i + 1} name`}</span><input className={field} aria-label={`Service ${i + 1} name`} placeholder={`e.g. ${industry.suggestedServices[0]?.name ?? "Initial consultation"}`} maxLength={120} autoFocus={focus === `${r.id}-name`} value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} /></label>
            <label><span className="sr-only">Price</span><input className={field} aria-label={`Service ${i + 1} price`} inputMode="decimal" disabled={r.priceMode === "quote" || r.priceMode === "free"} placeholder={r.priceMode === "quote" ? "Quote" : r.priceMode === "free" ? "Free" : "0"} autoFocus={focus === `${r.id}-price`} value={r.priceMode === "quote" || r.priceMode === "free" ? "" : r.price} onChange={(e) => { if (/^\d{0,6}(\.\d{0,2})?$/.test(e.target.value)) patch(r.id, { price: e.target.value }) }} /></label>
            <label className={cn(industry.id === "hospitality" && "hidden")}><span className="sr-only">Minutes</span><input className={field} aria-label={`Service ${i + 1} minutes`} inputMode="numeric" placeholder="30" value={r.minutes} onChange={(e) => patch(r.id, { minutes: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></label>
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Remove service ${i + 1}`} disabled={rows.length === 1 && !r.name && !r.price} onClick={() => { const next = rows.filter((x) => x.id !== r.id); sync(next.length ? next : [{ id: newId("svc"), name: "", price: "", minutes: "" }]) }}><Trash2 /></Button>
            <button type="button" className="sf-link sf-service-more" onClick={() => setPricing(r.id)}>How is it priced?{r.priceMode && r.priceMode !== "fixed" ? ` · ${r.priceMode}` : ""}</button>
          </li>
        ))}
      </ul>
      <Overlay open={pricing !== null} onOpenChange={(o) => !o && setPricing(null)} title="How is this service priced?" footer={<Button className="min-h-11 w-full" onClick={() => setPricing(null)}>Done</Button>}>
        <div className="grid gap-2">{([{ id: "fixed", label: "A fixed price" }, { id: "from", label: "Prices start from" }, { id: "quote", label: "Ask for a quote" }, { id: "free", label: "Free" }] as const).map((mode) => <button key={mode.id} type="button" aria-pressed={(rows.find((r) => r.id === pricing)?.priceMode ?? "fixed") === mode.id} className="min-h-14 rounded-2xl bg-neutral-50 p-3 text-left font-medium aria-pressed:bg-black aria-pressed:text-white" onClick={() => pricing && patch(pricing, { priceMode: mode.id })}>{mode.label}</button>)}</div>
      </Overlay>
      <Button type="button" variant="outline" className="sf-add" onClick={() => add()}><Plus /> Add another</Button>
      {booking && !rows.some((r) => validRow(r) && r.minutes) ? <p className="sf-help" data-testid="booking-hint">Add how long a service takes and people can ask to book it. Without a time, they send an enquiry instead.</p> : null}
    </div>
  )
}

/* ---------------------------------------------------------------- Finish */

/** Account last. In an environment without accounts the screen says so plainly and offers only a labelled testing route. */
export function FinishStep({ onStudio }: { onStudio: () => void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const [signedIn, setSignedIn] = React.useState(false)
  const [phase, setPhase] = React.useState<"idle" | "connecting" | "done">("idle")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [failure, setFailure] = React.useState("")
  const [saveFailed, setSaveFailed] = React.useState(false)
  const configured = accountsConfigured()
  React.useEffect(() => { void session().then((r) => setSignedIn(r.signedIn)) }, [])
  const toStudio = () => {
    update((x) => ({ ...x, onboarded: true, plan: x.setupDrafts?.planIntent ?? x.plan }))
    // The draft is only called saved once the browser has accepted the write.
    window.setTimeout(() => { if (storageHasFailed()) setSaveFailed(true); else onStudio() }, 0)
  }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: { email?: string; password?: string } = {}
    if (!emailOk(email)) next.email = "Enter an email address like name@example.com."
    if (password.length < 8) next.password = "Use at least 8 characters."
    setErrors(next); setFailure("")
    if (next.email || next.password) return
    setPhase("connecting")
    const r = await connect()
    if (r.ok) { setPhase("done"); window.setTimeout(toStudio, 900); return }
    setPhase("idle")
    setFailure(r.reason === "cancelled" ? "Sign-up was cancelled. Your draft is still here." : r.reason === "not-configured" ? "Account creation isn’t available in this environment yet, so nothing was created. Your draft is unchanged and still in this browser." : "That didn’t work. Your draft is unchanged, so you can try again.")
  }
  return (
    <div className="sf-stack" data-testid="finish-step">
      <p className="sf-lede">{s.content.identity.name ? `Your first draft of ${s.content.identity.name} is here.` : "Your first draft is here."} Open Studio to add the finishing touches. You decide when to publish.</p>
      {!storageHasFailed() ? <p className="sf-saved" data-testid="saved-status"><Check aria-hidden="true" /> Saved as a draft. Not published.</p> : null}
      {phase === "done" ? (
        <p role="status" className="sf-ok"><Check aria-hidden="true" /> Account connected and draft saved. Opening Studio…</p>
      ) : signedIn ? (
        <div className="sf-sticky"><Button size="lg" className="sf-primary" data-testid="save-draft" onClick={toStudio}>Open Studio</Button></div>
      ) : configured ? (
        <form className="sf-stack" data-testid="account-step" onSubmit={(e) => void submit(e)} noValidate>
          <TaploInput label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} aria-invalid={Boolean(errors.email)} />
          <TaploInput label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} aria-invalid={Boolean(errors.password)} hint="At least 8 characters." />
          <Button size="lg" type="submit" className="sf-primary" disabled={phase === "connecting"}>{phase === "connecting" ? "Creating account…" : "Create account and open Studio"}</Button>
          {failure ? <p role="alert" className="sf-error" data-testid="account-failure">{failure}</p> : null}
        </form>
      ) : (
        <div className="sf-testing" data-testid="dev-route">
          <div className="sf-sticky"><Button size="lg" className="sf-primary" data-testid="save-draft" onClick={toStudio}>Open Studio</Button></div>
          <p className="sf-help" data-testid="draft-note">{WHEN_UNAVAILABLE.accounts}</p>
        </div>
      )}
      {saveFailed ? <p role="alert" className="sf-error" data-testid="save-failed">Your browser couldn’t save this draft (storage is full or blocked), so it isn’t saved yet. Remove a large picture and try again.</p> : null}
    </div>
  )
}
