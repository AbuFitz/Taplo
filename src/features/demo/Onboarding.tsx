"use client"

import { TaploLogo } from "@/components/taplo/brand"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { applyIndustry, blankService, canPublish, hasContactChannel, loadSample, newId, normService, publish, readiness, setName, setSlug, slugProblems } from "./actions"
import { ONBOARDING_STEPS, initialState, parseContent, useDemo, type OnboardingStep } from "./store"
import { ServiceForm, serviceErrors } from "./ServiceForm"
import { DemoNotice, EmailField, PhoneField, PreviewFrame } from "./ui"
import type { WidgetType } from "@/features/page/contracts/widgets"

const STEP_LABEL: Record<OnboardingStep, string> = {
  industry: "What you do",
  business: "Your name",
  contacts: "Contact and place",
  widgets: "Add what’s useful",
  publish: "Preview & publish",
}
const STEP_TITLE: Record<OnboardingStep, string> = {
  industry: "What kind of business is it?",
  business: "Let’s start with your name",
  contacts: "How can people reach you?",
  widgets: "Add what’s useful",
  publish: "Preview and publish",
}

const LOCATION_LABEL = { premises: "A place customers visit", service_area: "I travel to customers (service area)", online: "Online only" } as const

export function Onboarding() {
  const router = useRouter()
  const { ready, state, update } = useDemo()
  const [showErrors, setShowErrors] = React.useState(false)
  const [query, setQuery] = React.useState("")
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
                {searchIndustries(query).map((p) => {
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
              {state !== null ? (
                <TaploInput
                  label={c.identity.industryKey === OTHER_INDUSTRY_ID ? "Describe your business" : "How should we describe you? (shown on your page)"}
                  hint={c.identity.industryKey === OTHER_INDUSTRY_ID ? "e.g. Dog groomer, Wedding florist, Piano restorer" : undefined}
                  value={c.identity.industryLabel}
                  maxLength={80}
                  onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })}
                />
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
    <div className="grid gap-6">
      <p className="text-muted-foreground">These are the building blocks of your page. Tick the ones you want now; you can add, reorder and style widgets any time in the page editor.</p>
      <ul className="grid gap-2" aria-label="Suggested widgets">
        {industry.starterWidgets.map((type) => {
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
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold">Your first service <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
        <p className="mb-3 text-sm text-muted-foreground">You set every price; nothing is pre-filled. Skip this and add services later.</p>
        {industry.suggestedServices.length ? (
          <ul className="mb-3 flex flex-wrap gap-2" aria-label="Common services">
            {industry.suggestedServices.map((sg) => (
              <li key={sg.name}><button type="button" className="min-h-11 rounded-full border px-4 text-sm hover:bg-muted" onClick={() => { const base = { ...current, name: sg.name }; setSvc(base); save(base) }}>{sg.name}</button></li>
            ))}
          </ul>
        ) : null}
        <ServiceForm key={current.id} service={current} showErrors={showErr} onChange={(x) => { setSvc(x); save(x) }} />
      </div>
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
  return (
    <div className="grid gap-5">
      <p className="text-muted-foreground">Your page has {s.page.widgets.length} widget{s.page.widgets.length === 1 ? "" : "s"}. Check the preview, then publish. Everything can be changed afterwards.</p>
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
