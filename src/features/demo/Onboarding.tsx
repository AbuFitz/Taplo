"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { OTHER_INDUSTRY_ID, getIndustryPreset, searchIndustries } from "@/features/themes/presets/industries"
import { resolveLayout } from "@/features/themes/presets/layouts"
import { LOCATION_MODES, type ServiceContent } from "@/features/businesses/content"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { cn } from "@/lib/utils"
import { applyIndustry, blankService, normService, canPublish, hasContactChannel, loadSample, publish, readiness, setName, setSlug, slugProblems } from "./actions"
import { ONBOARDING_STEPS, initialState, useDemo, type OnboardingStep } from "./store"
import { ServiceForm, serviceErrors } from "./ServiceForm"
import { DemoNotice, EmailField, PhoneField, PreviewFrame } from "./ui"

const STEP_LABEL: Record<OnboardingStep, string> = {
  industry: "Your business",
  business: "Name & address",
  contacts: "Contact",
  service: "First service",
  review: "Preview & publish",
}

const LOCATION_LABEL = {
  premises: "A place customers visit",
  service_area: "I travel to customers (service area)",
  online: "Online only",
} as const

export function Onboarding() {
  const router = useRouter()
  const { ready, state, update } = useDemo()
  const [showErrors, setShowErrors] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [mobilePreview, setMobilePreview] = React.useState(false)
  const s = state ?? initialState()
  const step = s.step
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
  const rawService = (c.services ?? []).find((x) => !x.archived)
  const service = rawService ? normService(rawService) : undefined
  const industryReady = Boolean(c.identity.industryLabel.trim()) && (state !== null)

  const valid: Record<OnboardingStep, boolean> = {
    industry: industryReady,
    business: Boolean(c.identity.name.trim()) && slugErrs.length === 0,
    contacts: hasContactChannel(c),
    service: Boolean(service) && Object.keys(serviceErrors(service!)).length === 0,
    review: canPublish(s),
  }
  const why: Record<OnboardingStep, string> = {
    industry: "Choose a type of business (or Other) and describe it.",
    business: "Add a name and a valid web address.",
    contacts: "Add at least one way for customers to reach you.",
    service: "Add your first service with a price (or choose “Quote on request”).",
    review: "Complete the earlier steps to publish.",
  }

  const sampleKeys = INDUSTRY_FIXTURE_KEYS

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold">Taplo</Link>
        <Link href="/dashboard" className="text-sm underline underline-offset-4">Skip to dashboard</Link>
      </header>
      <DemoNotice className="mb-6" />

      <ol className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Progress">
        {ONBOARDING_STEPS.map((st, i) => (
          <li key={st} aria-current={st === step ? "step" : undefined} className={cn("flex items-center gap-2", st === step ? "font-semibold" : "text-muted-foreground")}>
            <span className={cn("grid size-6 place-items-center rounded-full border text-xs", i < stepIndex && "bg-primary text-primary-foreground")}>
              {i < stepIndex ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
            </span>
            {STEP_LABEL[st]}
          </li>
        ))}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-labelledby="step-title" className="min-w-0">
          <h1 id="step-title" className="mb-1 text-2xl font-semibold">{STEP_LABEL[step]}</h1>

          {step === "industry" ? (
            <div className="grid gap-6">
              <p className="text-muted-foreground">Pick the closest match. It only sets sensible defaults, and you stay in control of everything.</p>
              <TaploInput label="Search (e.g. barber, tutor, plumber)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <ul className="grid gap-2 sm:grid-cols-2" aria-label="Types of business">
                {searchIndustries(query).map((p) => {
                  const selected = state !== null && c.identity.industryKey === p.id
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update((x) => applyIndustry(x, p.id, p.id === OTHER_INDUSTRY_ID ? "" : p.label))}
                        className={cn("min-h-11 w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted", selected && "border-primary bg-muted font-semibold ring-2 ring-primary/30")}
                      >
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
                  onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }))}
                />
              ) : null}
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">Just looking around?</p>
                <p className="mb-3 text-sm text-muted-foreground">Load a synthetic sample business to explore the dashboard and every layout with content already in place.</p>
                <div className="flex flex-wrap gap-2">
                  {sampleKeys.map((k) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => { update((x) => loadSample(x, k)); router.push("/dashboard") }}>
                      {getFixture(k)!.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === "business" ? (
            <div className="grid gap-5">
              <TaploInput label="Business name" value={c.identity.name} maxLength={100} autoComplete="off" onChange={(e) => update((x) => setName(x, e.target.value))} />
              <div>
                <TaploInput
                  label="Your web address"
                  value={c.identity.slug}
                  maxLength={40}
                  autoCapitalize="none"
                  autoCorrect="off"
                  onChange={(e) => update((x) => setSlug(x, e.target.value))}
                  error={showErrors && slugErrs.length ? SLUG_PROBLEM_MESSAGE[slugErrs[0]!] : undefined}
                />
                <p className="mt-1.5 text-sm text-muted-foreground">
                  taplo.co/<strong>{c.identity.slug || "your-name"}</strong>
                  {slugErrs.length && c.identity.slug ? <span className="block text-destructive">{SLUG_PROBLEM_MESSAGE[slugErrs[0]!]}</span> : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Demo note: availability is checked against the database when you publish on a connected environment. Reserved and invalid addresses are blocked now.</p>
              </div>
              <fieldset className="grid gap-2">
                <legend className="mb-1 text-sm font-medium">Where do you work?</legend>
                {LOCATION_MODES.map((m) => (
                  <label key={m} className="flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm">
                    <input type="radio" name="loc" className="size-4 accent-[var(--primary)]" checked={c.location.mode === m} onChange={() => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, mode: m } } }))} />
                    {LOCATION_LABEL[m]}
                  </label>
                ))}
              </fieldset>
              <TaploInput
                label={c.location.mode === "service_area" ? "Areas you cover" : c.location.mode === "online" ? "Where you’re based (optional)" : "Town or area"}
                value={c.location.locality ?? ""}
                maxLength={120}
                onChange={(e) => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, locality: e.target.value || undefined } } }))}
              />
              {c.location.mode === "premises" ? (
                <TaploInput label="Street address (optional)" value={c.location.addressLine ?? ""} maxLength={240} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, addressLine: e.target.value || undefined } } }))} />
              ) : (
                <p className="text-sm text-muted-foreground">Your private address is never published for travelling or online businesses.</p>
              )}
            </div>
          ) : null}

          {step === "contacts" ? (
            <div className="grid gap-5">
              <p className="text-muted-foreground">Customers act on these straight from your page. Only the ones you fill in appear.</p>
              <PhoneField label="Phone" value={c.contacts.phone} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, phone: v } } }))} hint="Used for the Call button." />
              <PhoneField label="WhatsApp number" value={c.contacts.whatsapp} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, whatsapp: v } } }))} hint="Include the country code, e.g. +44." />
              <EmailField value={c.contacts.email} onCommit={(v) => update((x) => ({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, email: v } } }))} />
            </div>
          ) : null}

          {step === "service" ? (
            <div className="grid gap-5">
              <p className="text-muted-foreground">Add one service to start. You set the price; nothing is pre-filled for you. More can be added in the dashboard.</p>
              {(() => {
                const preset = getIndustryPreset(c.identity.industryKey)
                return preset.suggestedServices.length > 0 ? (
                  <div>
                    <p className="mb-2 text-sm font-medium">Common for {preset.label.toLowerCase()} — tap to use as the name</p>
                    <ul className="flex flex-wrap gap-2">
                      {preset.suggestedServices.map((sg) => (
                        <li key={sg.name}>
                          <button type="button" className="min-h-11 rounded-full border px-4 text-sm hover:bg-muted" onClick={() => update((x) => {
                            const list = [...(x.content.services ?? [])]
                            const i = list.findIndex((q) => !q.archived)
                            const base: ServiceContent = i >= 0 ? normService(list[i]!) : blankService(0)
                            const nextSvc = { ...base, name: sg.name }
                            if (i >= 0) list[i] = nextSvc
                            else list.push(nextSvc)
                            return { ...x, content: { ...x.content, services: list } }
                          })}>{sg.name}</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              })()}
              <ServiceForm
                key={service?.id ?? "new"}
                service={service ?? blankService(0)}
                showErrors={showErrors}
                onChange={(svc) => update((x) => {
                  const list = [...(x.content.services ?? [])]
                  const i = list.findIndex((q) => q.id === svc.id)
                  if (i >= 0) list[i] = svc
                  else list.push(svc)
                  return { ...x, content: { ...x.content, services: list } }
                })}
              />
            </div>
          ) : null}

          {step === "review" ? <ReviewStep onDone={() => router.push("/dashboard")} /> : null}

          {step !== "review" ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {stepIndex > 0 ? <Button variant="outline" size="lg" onClick={back}>Back</Button> : null}
              <Button size="lg" onClick={() => (valid[step] ? next() : setShowErrors(true))} aria-describedby="why-disabled">
                Continue
              </Button>
              {!valid[step] && showErrors ? <p id="why-disabled" role="alert" className="text-sm text-destructive">{why[step]}</p> : null}
            </div>
          ) : (
            <div className="mt-8"><Button variant="outline" size="lg" onClick={back}>Back</Button></div>
          )}
        </section>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="hidden lg:block"><h2 className="mb-2 text-sm font-semibold">Live preview</h2><PreviewFrame /></div>
          <div className="lg:hidden">
            <Button variant="outline" onClick={() => setMobilePreview((v) => !v)} aria-expanded={mobilePreview}>{mobilePreview ? "Hide preview" : "Show live preview"}</Button>
            {mobilePreview ? <div className="mt-3"><PreviewFrame /></div> : null}
          </div>
        </aside>
      </div>
    </div>
  )
}

function ReviewStep({ onDone }: { onDone: () => void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const layout = resolveLayout(s.config.layoutId).layout
  const checks = readiness(s)
  const ok = canPublish(s)
  return (
    <div className="grid gap-5">
      <p className="text-muted-foreground">
        We picked the <strong>{layout.label}</strong> layout for a {s.content.identity.industryLabel || "business"} like yours. Check the preview, then publish. You can change anything afterwards.
      </p>
      <ul className="grid gap-2">
        {checks.filter((c) => c.required).map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-sm">
            <span className={cn("grid size-5 place-items-center rounded-full border", c.done && "bg-primary text-primary-foreground")}>{c.done ? <Check className="size-3" aria-hidden="true" /> : null}</span>
            <span>{c.label}</span>
            {!c.done ? <span className="text-destructive"> — missing</span> : null}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">Optional and can wait: logo, photos, About, FAQs, reviews, team, payments.</p>
      {s.published ? (
        <div role="status" className="rounded-lg border border-green-600/40 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Published (demo) — version {s.published.version}</p>
          <p className="mt-1">View it at <Link className="underline" href={`/demo/p/${s.published.content.identity.slug}`} target="_blank">/demo/p/{s.published.content.identity.slug}</Link> in this browser.</p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={!ok} onClick={() => update((x) => ({ ...publish(x), onboarded: true }))}>
          {s.published ? "Publish changes" : "Publish my page"}
        </Button>
        <Button size="lg" variant="outline" onClick={() => { update((x) => ({ ...x, onboarded: true })); onDone() }}>Go to dashboard</Button>
      </div>
      {!ok ? <p className="text-sm text-destructive" role="alert">Finish the steps marked missing to publish.</p> : null}
    </div>
  )
}
