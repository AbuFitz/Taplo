"use client"

import { TaploLogo } from "@/components/taplo/brand"
import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { LOCATION_MODES } from "@/features/businesses/content"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { newWidget } from "@/features/page/starter"
import { ImageField } from "@/features/page/editor/controls"
import { getWidget } from "@/features/page/widgets/registry"
import { buildPageViewModel } from "@/features/page/renderer"
import { resolveEntitlements } from "@/features/subscriptions/entitlements"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { OTHER_INDUSTRY_ID, getIndustryPreset, searchIndustries } from "@/features/themes/presets/industries"
import { cn } from "@/lib/utils"
import { exampleStart, suggestedLooks } from "@/features/inspiration/suggest"
import { FONT_STACKS } from "@/features/page/themes/fonts"
import { applyIndustry, blankService, canPublish, hasContactChannel, loadSample, newId, normService, publish, readiness, setName, setSlug, slugProblems } from "./actions"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { ONBOARDING_STEPS, initialState, parseContent, useDemo, type OnboardingStep } from "./store"
import { ServiceForm, serviceErrors } from "./ServiceForm"
import { DemoNotice, EmailField, PhoneField, PreviewFrame } from "./ui"
import type { WidgetType } from "@/features/page/contracts/widgets"

const STEP_LABEL: Record<OnboardingStep, string> = {
  business: "Your name",
  industry: "What you do",
  widgets: "Look and content",
  contacts: "Contact and place",
  publish: "Preview and share",
}
const STEP_TITLE: Record<OnboardingStep, string> = {
  business: "Let’s start with your name",
  industry: "What do you do, and what should people do first?",
  widgets: "Choose a starting point",
  contacts: "How can people reach you?",
  publish: "Preview, publish and share",
}

const POPULAR = ["barber", "hairdresser", "beauty-therapist", "nails", "plumber", "electrician", "builder", "mechanic", "cleaner", "tutor", "personal-trainer", "physio", "hospitality", "car-dealer", "photographer", "other"]

type Goal = "book" | "request" | "call" | "message"
const GOALS: { id: Goal; label: string; hint: string }[] = [
  { id: "book", label: "Book a time", hint: "The time is confirmed straight away." },
  { id: "request", label: "Ask for a time", hint: "You accept or decline each request." },
  { id: "call", label: "Call me", hint: "A big call button comes first." },
  { id: "message", label: "Send me a message", hint: "Nothing is reserved. You reply." },
]
function goalOf(s: { content: { booking?: { mode: string } }; page: { meta: { primaryAction: string } } }): Goal {
  if (s.page.meta.primaryAction === "call") return "call"
  const m = s.content.booking?.mode
  return m === "instant" ? "book" : m === "request" ? "request" : "message"
}
function applyGoal<T extends ReturnType<typeof initialState>>(s: T, g: Goal): T {
  const mode = g === "book" ? "instant" : g === "request" ? "request" : "contact"
  return { ...s, content: { ...s.content, booking: { ...s.content.booking, mode } }, page: { ...s.page, meta: { ...s.page.meta, primaryAction: g === "call" ? "call" : g === "message" ? "auto" : "book" } } }
}

const LOCATION_LABEL = { premises: "A place customers visit", service_area: "I travel to customers (service area)", online: "Online only" } as const

export function Onboarding() {
  const router = useRouter()
  const { ready, state, update } = useDemo()
  const [showErrors, setShowErrors] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [showAll, setShowAll] = React.useState(false)
  const [mobilePreview, setMobilePreview] = React.useState(false)
  const s = state ?? initialState()
  const step: OnboardingStep = (ONBOARDING_STEPS as readonly string[]).includes(s.step) ? s.step : "widgets"
  const stepIndex = ONBOARDING_STEPS.indexOf(step)

  const go = (to: OnboardingStep) => {
    setShowErrors(false)
    update((x) => ({ ...x, step: to }))
    window.scrollTo({ top: 0 })
  }
  const next = () => go(ONBOARDING_STEPS[Math.min(stepIndex + 1, ONBOARDING_STEPS.length - 1)]!)
  const back = () => go(ONBOARDING_STEPS[Math.max(stepIndex - 1, 0)]!)

  // A plan chosen on the pricing page carries into setup (and stays through every step) without taking payment.
  // Read from the router, not window.location: on a client-side navigation (pricing → setup) the address has not changed yet when this first renders.
  const params = useSearchParams()
  const [intent] = React.useState<PlanId | null>(() => {
    const p = params.get("plan")
    return p && (PLAN_IDS as readonly string[]).includes(p) ? (p as PlanId) : null
  })
  React.useEffect(() => {
    if (ready && intent) update((x) => (x.plan === intent ? x : { ...x, plan: intent }))
  }, [ready, intent]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Start from this" on an inspiration page: take its kind of business, look and content types. Never its sample content.
  const [from] = React.useState(() => {
    const slug = params.get("from")
    return slug ? exampleStart(slug) : null
  })
  const fromName = from?.name ?? null
  React.useEffect(() => {
    const ex = from
    if (!ready || !ex) return
    // Applied once: drop it from the address so a refresh never overwrites what the owner has done since.
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => {
      const withIndustry = applyIndustry(x, ex.industryKey, ex.industryLabel)
      return {
        ...withIndustry,
        content: { ...withIndustry.content, booking: { ...withIndustry.content.booking, mode: ex.bookingMode } },
        page: { ...withIndustry.page, themeId: ex.lookId, appearance: {}, widgets: ex.widgets.map((w) => newWidget(w.type as WidgetType, w.settings)) },
      }
    })
  }, [ready, from]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <main className="p-8 text-sm text-muted-foreground">Loading…</main>

  const c = s.content
  const slugErrs = slugProblems(c.identity.slug)
  const valid: Record<OnboardingStep, boolean> = {
    industry: state !== null && Boolean(c.identity.industryLabel.trim()),
    business: Boolean(c.identity.name.trim()) && slugErrs.length === 0,
    contacts: hasContactChannel(c),
    widgets: true,
    publish: canPublish(s),
  }
  const why: Record<OnboardingStep, string> = {
    industry: "Choose what you do (or Other) and describe it in a few words.",
    business: "Add a name and a valid web address.",
    contacts: "Add at least one way for customers to reach you.",
    widgets: "",
    publish: "Complete the earlier steps to publish.",
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <DemoNotice className="mb-6" />
      {fromName ? <p className="mb-4 rounded-xl bg-black/[0.04] px-4 py-2.5 text-sm" data-testid="from-example">Starting from the look and content types of <strong>{fromName}</strong>. It is a fictional business: none of its words, prices or pictures are copied, and you can change everything.</p> : null}
      {intent ? <p className="mb-4 rounded-xl bg-black/[0.04] px-4 py-2.5 text-sm" data-testid="plan-intent">You are setting up on the <strong>{PLANS[intent].name}</strong> plan. In preview mode nothing is charged, and you can switch plans in Settings.</p> : null}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" aria-label="Taplo home" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60"><TaploLogo /></Link>
        <Link href="/dashboard/page" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Skip to the page editor</Link>
      </header>

      <nav aria-label="Progress" className="mb-10">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Step {stepIndex + 1} of {ONBOARDING_STEPS.length} · {STEP_LABEL[step]}</p>
        <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${ONBOARDING_STEPS.length}, minmax(0, 1fr))` }}>
          {ONBOARDING_STEPS.map((st, i) => (
            <li key={st} aria-current={st === step ? "step" : undefined} className="h-1 overflow-hidden rounded-full bg-black/[0.09]">
              <span className={cn("block h-full rounded-full bg-primary transition-[width] duration-500 ease-out", i < stepIndex ? "w-full" : i === stepIndex ? "w-1/2 bg-signal" : "w-0")} />
              <span className="sr-only">{STEP_LABEL[st]}{i < stepIndex ? " (done)" : ""}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-labelledby="step-title" className="min-w-0">
          <h1 id="step-title" className="font-display mb-3 text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.02]">{STEP_TITLE[step]}</h1>

          {step === "industry" ? (
            <div className="grid gap-6">
              <p className="text-muted-foreground">Pick the closest match. It only suggests which sections to start with; you can change anything later.</p>
              <TaploInput label="Search (e.g. barber, tutor, café, plumber)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <ul className="grid gap-2 sm:grid-cols-2" aria-label="Types of business">
                {searchIndustries(query).filter((p) => query.trim() || showAll || POPULAR.includes(p.id) || (state !== null && c.identity.industryKey === p.id)).map((p) => {
                  const selected = state !== null && c.identity.industryKey === p.id
                  return (
                    <li key={p.id}>
                      <button type="button" aria-pressed={selected} onClick={() => update((x) => applyIndustry(x, p.id, p.id === OTHER_INDUSTRY_ID ? "" : p.label))}
                        className={cn("min-h-12 w-full rounded-xl bg-white px-4 py-2.5 text-left text-sm shadow-[0_0_0_1px_rgb(0_0_0/0.09)] transition-[box-shadow,transform] duration-150 hover:shadow-[0_0_0_1px_rgb(0_0_0/0.22)] active:scale-[0.99]", selected && "font-semibold shadow-[0_0_0_2px_var(--primary),0_8px_20px_-12px_rgb(0_0_0/0.4)]")}>
                        {p.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {!query.trim() && !showAll ? <button type="button" onClick={() => setShowAll(true)} className="justify-self-start rounded-lg px-1 py-2 text-sm font-medium underline underline-offset-4">Show every kind of business</button> : null}
              {state !== null ? (
                <TaploInput
                  label={c.identity.industryKey === OTHER_INDUSTRY_ID ? "Describe your business" : "How should we describe you? (shown on your page)"}
                  hint={c.identity.industryKey === OTHER_INDUSTRY_ID ? "e.g. Dog groomer, Wedding florist, Piano restorer" : undefined}
                  value={c.identity.industryLabel}
                  maxLength={80}
                  onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })}
                />
              ) : null}
              {state !== null ? (
                <fieldset className="grid gap-2" data-testid="goal">
                  <legend className="mb-1 text-sm font-medium">What should people do first on your page?</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {GOALS.map((g) => (
                      <label key={g.id} className={cn("flex min-h-14 cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-sm shadow-[0_0_0_1px_rgb(0_0_0/0.09)] has-[:checked]:shadow-[0_0_0_2px_var(--primary)]")}>
                        <input type="radio" name="goal" className="mt-0.5 size-4 accent-[var(--primary)]" checked={goalOf(s) === g.id} onChange={() => update((x) => applyGoal(x, g.id))} />
                        <span><span className="block font-semibold">{g.label}</span><span className="text-muted-foreground">{g.hint}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">Just looking around?</p>
                <p className="mb-3 text-sm text-muted-foreground">Open a sample business with content already in place, or see them all on the <Link className="underline" href="/demo/profiles">sample profiles</Link> page.</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_FIXTURE_KEYS.map((k) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => { update((x) => loadSample(x, k), { resetHistory: true }); router.push("/dashboard/page") }}>{getFixture(k)!.label}</Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === "business" ? (
            <div className="grid gap-5">
              <p className="text-muted-foreground">Add your name and, if you have one, your logo. Your page appears on the right as you type.</p>
              <TaploInput label="Business name" value={c.identity.name} maxLength={100} autoComplete="off" onChange={(e) => update((x) => setName(x, e.target.value), { coalesce: "name" })} />
              <div>
                <TaploInput label="Your web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" autoCorrect="off" onChange={(e) => update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} error={showErrors && slugErrs.length ? SLUG_PROBLEM_MESSAGE[slugErrs[0]!] : undefined} />
                <p className="mt-1.5 text-sm text-muted-foreground">
                  taplo.co/<strong>{c.identity.slug || "your-name"}</strong>
                  {slugErrs.length && c.identity.slug ? <span className="block text-destructive">{SLUG_PROBLEM_MESSAGE[slugErrs[0]!]}</span> : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Demo note: whether an address is already taken is checked against the database when you publish on a connected environment. Reserved and invalid addresses are blocked now.</p>
              </div>
              <ImageField label="Logo or profile picture (optional)" cropAspect={1} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640} value={c.identity.logo ?? null} onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, logo: v ?? undefined } } }))} />
            </div>
          ) : null}

          {step === "contacts" ? (
            <div className="grid gap-5">
              <p className="text-muted-foreground">Customers act on these straight from your page. Only the ones you fill in appear. You can add a logo, description and more afterwards.</p>
              <PhoneField label="Phone" value={c.contacts.phone} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, phone: v } } }), { coalesce: "phone" })} hint="Used for the Call button." />
              <PhoneField label="WhatsApp number" value={c.contacts.whatsapp} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, whatsapp: v } } }), { coalesce: "wa" })} hint="Include the country code, e.g. +44." />
              <EmailField value={c.contacts.email} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, email: v } } }), { coalesce: "email" })} />
              <TaploInput label="A line about you (optional)" hint="Shown under your name." value={c.identity.tagline ?? ""} maxLength={160} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, tagline: e.target.value || undefined } } }), { coalesce: "tag" })} />
              <fieldset className="grid gap-2">
                <legend className="mb-1 text-sm font-medium">Where do you work?</legend>
                {LOCATION_MODES.map((m) => (
                  <label key={m} className="flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm">
                    <input type="radio" name="loc" className="size-4 accent-[var(--primary)]" checked={c.location.mode === m} onChange={() => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, mode: m } } }))} />
                    {LOCATION_LABEL[m]}
                  </label>
                ))}
              </fieldset>
              <TaploInput label={c.location.mode === "service_area" ? "Areas you cover" : c.location.mode === "online" ? "Where you’re based (optional)" : "Town or area"} value={c.location.locality ?? ""} maxLength={120} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, locality: e.target.value || undefined } } }), { coalesce: "loc" })} />
              {c.location.mode === "premises" ? null : <p className="text-sm text-muted-foreground">Your private address is never published for travelling or online businesses.</p>}
            </div>
          ) : null}

          {step === "widgets" ? <WidgetsStep /> : null}
          {step === "publish" ? <PublishStep onEditor={() => router.push("/dashboard/page")} /> : null}

          {step !== "publish" ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {stepIndex > 0 ? <Button variant="outline" size="lg" onClick={back}>Back</Button> : null}
              <Button size="lg" onClick={() => (valid[step] ? next() : setShowErrors(true))} aria-describedby="why-disabled">Continue</Button>
              {!valid[step] && showErrors ? <p id="why-disabled" role="alert" className="text-sm text-destructive">{why[step]}</p> : null}
            </div>
          ) : (
            <div className="mt-8"><Button variant="outline" size="lg" onClick={back}>Back</Button></div>
          )}
        </section>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="hidden lg:block"><h2 className="font-display mb-3 text-2xl">Your page, taking shape</h2><PreviewFrame height={720} /></div>
          <div className="lg:hidden">
            <Button variant="outline" onClick={() => setMobilePreview((v) => !v)} aria-expanded={mobilePreview}>{mobilePreview ? "Hide preview" : "Show my page"}</Button>
            {mobilePreview ? <div className="mt-3"><PreviewFrame /></div> : null}
          </div>
        </aside>
      </div>
    </main>
  )
}

/** Suggested looks for this kind of business. A look is a starting point: every colour, font and shape can be changed afterwards. */
function LookPicker({ industryKey, themeId, onPick }: { industryKey: string; themeId: string; onPick: (id: string) => void }) {
  const looks = React.useMemo(() => suggestedLooks(industryKey), [industryKey])
  return (
    <fieldset className="grid gap-3" data-testid="look-picker">
      <legend className="mb-1 text-lg font-semibold">Pick a look</legend>
      <p className="-mt-1 text-muted-foreground">Your page on the right changes as you choose. This is only a start: you can change every colour, font and shape later, and no look is tied to a kind of business.</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {looks.map((l, i) => {
          const o = l.overrides
          const c = o.colors!
          const active = themeId === l.id
          return (
            <label key={l.id} className={cn("relative grid cursor-pointer gap-2 rounded-xl p-2.5 text-left text-sm shadow-[0_0_0_1px_rgb(0_0_0/0.09)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", active && "shadow-[0_0_0_2px_var(--primary)]")}>
              <input type="radio" name="look" value={l.id} checked={active} onChange={() => onPick(l.id)} className="sr-only" />
              <span aria-hidden="true" className="flex h-14 items-end justify-between rounded-lg p-2" style={{ background: c.background }}>
                <span className="text-xl leading-none" style={{ color: c.text, fontFamily: FONT_STACKS[o.text!.headingFont!], fontWeight: o.text!.headingWeight === "bold" ? 700 : 400, textTransform: o.text!.headingCase === "upper" ? "uppercase" : "none" }}>Aa</span>
                <span className="flex gap-1">{[c.surface, c.accent, c.text].map((x, n) => <i key={n} className="block size-3.5 rounded-full border border-black/10" style={{ background: x }} />)}</span>
              </span>
              <span><span className="block font-semibold">{l.name}{i === 0 ? <span className="ml-1.5 rounded-full bg-black/[0.06] px-1.5 py-0.5 text-[0.6875rem] font-medium">Suggested</span> : null}</span><span className="block text-xs leading-snug text-muted-foreground">{l.blurb}</span></span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Suggested widgets for this kind of business: tick to include. Nothing is added silently; empty ones explain what they need. */
function WidgetsStep() {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const industry = getIndustryPreset(s.content.identity.industryKey)
  const parsed = parseContent(s.content)
  const vm = React.useMemo(() => (parsed.success && parsed.data.identity.name ? buildPageViewModel(parsed.data, s.page, { plan: s.plan }) : null), [parsed, s.page, s.plan])
  const have = new Set(s.page.widgets.map((w) => w.type as string))
  const [svc, setSvc] = React.useState(() => (s.content.services ?? []).find((x) => !x.archived) ?? null)
  const [showErr, setShowErr] = React.useState(false)
  const first = (s.content.services ?? []).find((x) => !x.archived)
  const current = first ? normService(first) : svc ? normService(svc) : blankService(0)

  const toggle = (type: WidgetType, on: boolean) => update((x) => ({
    ...x,
    page: { ...x.page, widgets: on ? [...x.page.widgets, newWidget(type, {})] : x.page.widgets.filter((w) => w.type !== type) },
  }))
  const ent = resolveEntitlements(s.plan, "active")
  void ent

  return (
    <div className="grid gap-8">
      <LookPicker industryKey={s.content.identity.industryKey} themeId={s.page.themeId} onPick={(id) => update((x) => ({ ...x, page: { ...x.page, themeId: id, appearance: {} } }))} />
      <div className="grid gap-3">
      <h2 className="text-lg font-semibold">Content to start with</h2>
      <p className="text-muted-foreground">Tick what you want on your page. Anything you have not added yet stays hidden from visitors until you do, so there is nothing to fill in now.</p>
      <ul className="grid gap-2" aria-label="Suggested content">
        {[...new Set([...industry.starterWidgets, ...s.page.widgets.map((w) => w.type as WidgetType)])].map((type) => {
          const def = getWidget(type)!
          const st = vm?.widgets.find((w) => w.type === type)?.status
          return (
            <li key={type}>
              <label className="flex min-h-12 items-start gap-3 rounded-lg border p-3 text-sm">
                <input type="checkbox" className="mt-0.5 size-4 accent-[var(--primary)]" checked={have.has(type)} onChange={(e) => toggle(type, e.target.checked)} />
                <span><span className="font-semibold">{def.label}</span> <span className="text-muted-foreground">— {def.description}</span>
                  {have.has(type) && st && st.state !== "ready" ? <span className="block text-xs text-muted-foreground">Needs: {st.reason}</span> : null}</span>
              </label>
            </li>
          )
        })}
      </ul>
      </div>
      <details className="group rounded-xl border p-4" open={Boolean(first)}>
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
          <span>Add your first service <span className="text-sm font-normal text-muted-foreground">(optional)</span></span>
          <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <p className="mb-3 mt-2 text-sm text-muted-foreground">You set every price; nothing is pre-filled. Skip this and add services later.</p>
        {industry.suggestedServices.length ? (
          <ul className="mb-3 flex flex-wrap gap-2" aria-label="Common services">
            {industry.suggestedServices.map((sg) => (
              <li key={sg.name}><button type="button" className="min-h-11 rounded-full border px-4 text-sm hover:bg-muted" onClick={() => { const base = { ...current, name: sg.name }; setSvc(base); save(base) }}>{sg.name}</button></li>
            ))}
          </ul>
        ) : null}
        <ServiceForm key={current.id} service={current} showErrors={showErr} onChange={(x) => { setSvc(x); save(x) }} />
      </details>
    </div>
  )

  function save(x: ReturnType<typeof normService>) {
    const ok = Object.keys(serviceErrors(x)).length === 0
    setShowErr(false)
    if (!ok) { // keep typing local until it is a valid service, so the page never shows half-finished data
      if (!x.name.trim()) return
    }
    update((st) => {
      const list = [...(st.content.services ?? [])]
      const i = list.findIndex((q) => q.id === x.id)
      if (ok) { if (i >= 0) list[i] = x; else list.push({ ...x, id: x.id || newId("svc") }) }
      return { ...st, content: { ...st.content, services: list } }
    }, { coalesce: "first-service" })
  }
}

function PublishStep({ onEditor }: { onEditor: () => void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const checks = readiness(s)
  const ok = canPublish(s)
  const parsed = parseContent(s.content)
  const vm = React.useMemo(() => (parsed.success && parsed.data.identity.name ? buildPageViewModel(parsed.data, s.page, { plan: s.plan }) : null), [parsed, s.page, s.plan])
  const label = (type: string) => getWidget(type as WidgetType)?.label ?? type
  const shown = vm ? vm.widgets.filter((w) => w.status.state === "ready").map((w) => label(w.type)) : []
  const waiting = vm ? vm.widgets.filter((w) => w.status.state !== "ready").map((w) => label(w.type)) : []
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="grid gap-5">
      <p className="text-muted-foreground">Check the preview, then publish. Everything can be changed afterwards.</p>
      {shown.length || waiting.length ? (
        <div className="grid gap-3 rounded-xl border p-4 text-sm" data-testid="page-summary">
          <p><span className="font-semibold">On your page now:</span> {shown.length ? shown.join(", ") : "your name and contact buttons"}.</p>
          {waiting.length ? <p className="text-muted-foreground"><span className="font-semibold text-foreground">Hidden until you add them:</span> {waiting.join(", ")}. Visitors never see an empty section.</p> : null}
        </div>
      ) : null}
      <ul className="grid gap-2">
        {checks.filter((c) => c.required).map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-sm">
            <span className={cn("grid size-5 place-items-center rounded-full border", c.done && "bg-primary text-primary-foreground")}>{c.done ? <Check className="size-3" aria-hidden="true" /> : null}</span>
            <span>{c.label}</span>
            {!c.done ? <span className="text-destructive"> — missing</span> : null}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">Optional and can wait: logo and cover picture, photos, services, reviews, team, payments.</p>
      {s.published ? (
        <div role="status" className="rounded-lg border border-green-600/40 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Published (demo) — version {s.published.version}</p>
          <p className="mt-1">View it at <Link className="underline" href={`/demo/p/${s.published.content.identity.slug}`} target="_blank">/demo/p/{s.published.content.identity.slug}</Link> in this browser.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/demo/p/${s.published!.content.identity.slug}`).then(() => setCopied(true)).catch(() => undefined) }}>{copied ? "Link copied" : "Copy link"}</Button>
            <span className="text-xs">Preview link: it only opens in this browser. A public link needs accounts and hosting, which are not connected yet.</span>
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={!ok} onClick={() => update((x) => ({ ...publish(x), onboarded: true }))}>{s.published ? "Publish changes" : "Publish my page"}</Button>
        <Button size="lg" variant="outline" onClick={() => { update((x) => ({ ...x, onboarded: true })); onEditor() }}>Customise my page</Button>
      </div>
      {!ok ? <p className="text-sm text-destructive" role="alert">Finish the steps marked missing to publish.</p> : null}
    </div>
  )
}
