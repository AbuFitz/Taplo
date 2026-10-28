"use client"

import { TAPLO_DOMAINS } from "@/lib/domains"

import { Overlay } from "@/components/taplo/overlay"
import "./onboarding-mobile.css"
import { BusinessIcon } from "./BusinessIcon"
import { SetupDesign } from "./SetupDesign"
import { SetupThemes } from "./SetupStyles"
import { TaploLogo } from "@/components/taplo/brand"
import { SetupDetails } from "./SetupDetails"
import { setupJourney } from "./setup-journey"
import { SetupPlans } from "./SetupPlans"
import { SetupBackdrop } from "./SetupBackdrop"
import { motion } from "motion/react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { SetupCanvas } from "./SetupCanvas"
import { SetupPanel, type SetupSheetSize } from "./SetupPanel"
import { SetupLoading } from "./SetupLoading"
import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { newWidget } from "@/features/page/starter"
import { ImageField } from "@/features/page/editor/controls"
import { getWidget } from "@/features/page/widgets/registry"
import { buildPageViewModel } from "@/features/page/renderer"
import { applyDesign, getDesign, withArrangement } from "@/features/page/themes/designs"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { OTHER_INDUSTRY_ID, getIndustryPreset, searchIndustries } from "@/features/themes/presets/industries"
import { cn } from "@/lib/utils"
import { exampleStart } from "@/features/inspiration/suggest"
import { applyIndustry, blankService, canPublish, hasContactChannel, loadSample, newId, normService, publish, readiness, setName, setSlug, slugProblems } from "./actions"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { ONBOARDING_STEPS, initialState, parseContent, useDemo, type OnboardingStep } from "./store"
import { RecordForm, blankFor, commitRecord, validate } from "@/features/page/editor/RecordForms"
import { WHEN_UNAVAILABLE, capabilities } from "@/lib/capabilities"
import { SetupConnections } from "./SetupConnections"
import type { WidgetType } from "@/features/page/contracts/widgets"

const STEP_LABEL: Record<OnboardingStep, string> = {
  business: "Your name",
  widgets: "Your look",
  industry: "What you do",
  goal: "What customers do",
  reach: "Contact",
  contacts: "First content",
  plan: "Plan",
  publish: "Review",
}
const PART_TITLE = { business: "Tell people what you do.", reach: "Add your details." } as const
const STEP_TITLE: Record<OnboardingStep, string> = {
  business: "Make it yours.",
  industry: "What do you do?",
  goal: "What would you like customers to do?",
  reach: "How can customers reach you?",
  widgets: "Choose a look.",
  plan: "Room to grow.",
  contacts: "Add your first content",
  publish: "Review your page",
}

const SETUP_STEPS = ONBOARDING_STEPS

const subscribeMobileSetup = (callback: () => void) => { const query = window.matchMedia("(max-width:1023px)"); query.addEventListener("change", callback); return () => query.removeEventListener("change", callback) }
const mobileSetupSnapshot = () => window.matchMedia("(max-width:1023px)").matches
const serverMobileSetupSnapshot = () => false

const POPULAR = ["barber", "detailer", "car-dealer", "hospitality", "tutor", "plumber", "personal-trainer", "photographer", "other"]

type Goal = "book" | "enquire" | "call" | "message"
function goalOf(s: { content: { booking?: { mode: string } }; page: { meta: { primaryAction: string } } }): Goal {
  const a = s.page.meta.primaryAction
  if (a === "call") return "call"
  if (a === "whatsapp" || a === "email") return "message"
  const m = s.content.booking?.mode
  return m === "instant" || m === "request" ? "book" : "enquire"
}
// Whether a booking is confirmed straight away or accepted by hand is a setting for when services and hours exist (Bookings), not a question for the first minute.
function applyGoal<T extends ReturnType<typeof initialState>>(s: T, g: Goal): T {
  const mode = g === "book" ? "request" : "contact"
  const primaryAction = g === "book" ? "book" : g === "call" ? "call" : g === "message" ? (s.content.contacts.whatsapp ? "whatsapp" : "email") : "auto"
  // Calling or messaging should not leave a second booking action on the page.
  // Keep the widget so changing back restores its place and appearance.
  const widgets = s.page.widgets.map(w => w.type === "booking" ? { ...w, hidden: g === "call" || g === "message" } : w)
  return { ...s, content: { ...s.content, booking: { ...s.content.booking, mode } }, page: { ...s.page, widgets, meta: { ...s.page.meta, primaryAction } } }
}

/** What the first thing to add is, by kind of business. Nothing is added for them. */



export function Onboarding() {
  const shell = React.useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [direction, setDirection] = React.useState(1)
  const [sheetSize, setSheetSize] = React.useState<SetupSheetSize>("edit")
  const mobileSetup = React.useSyncExternalStore(subscribeMobileSetup, mobileSetupSnapshot, serverMobileSetupSnapshot)
  const revealCustomerDialog = React.useCallback(() => { if (mobileSetup) setSheetSize("preview") }, [mobileSetup])
  const navigated = React.useRef(false)
  React.useEffect(() => {
    const viewport = window.visualViewport
    let initialHeight = window.innerHeight
    let initialWidth = window.innerWidth
    const sync = () => {
      if (!shell.current) return
      if(Math.abs(window.innerWidth-initialWidth)>80){initialHeight=window.innerHeight;initialWidth=window.innerWidth}
      const height = viewport?.height ?? window.innerHeight
      shell.current.style.setProperty("--setup-height", `${height}px`)
      shell.current.style.setProperty("--setup-top", `${viewport?.offsetTop ?? 0}px`)
      shell.current.dataset.keyboard = String(Math.max(window.innerHeight, initialHeight) - height > 180 && Boolean(document.activeElement?.matches("input,textarea")))
    }
    const focusSync = () => requestAnimationFrame(sync)
    window.scrollTo(0,0); sync(); document.addEventListener("focusin",focusSync);document.addEventListener("focusout",focusSync); viewport?.addEventListener("resize", sync); viewport?.addEventListener("scroll", sync); window.addEventListener("resize", sync)
    return () => { document.removeEventListener("focusin",focusSync);document.removeEventListener("focusout",focusSync);viewport?.removeEventListener("resize", sync); viewport?.removeEventListener("scroll", sync); window.removeEventListener("resize", sync) }
  }, [])
  const router = useRouter()
  const { ready, state, update, storageFailed } = useDemo()
  const [showErrors, setShowErrors] = React.useState(false)
  const [contentValid,setContentValid]=React.useState(true)
  const [query, setQuery] = React.useState("")
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editSlug, setEditSlug] = React.useState(false)
  const [otherOpen, setOtherOpen] = React.useState(false)
  const [connectionsValid,setConnectionsValid]=React.useState(true)
  const s = state ?? initialState()
  const step: OnboardingStep = (ONBOARDING_STEPS as readonly string[]).includes(s.step) ? s.step : "widgets"
  const stepIndex = SETUP_STEPS.indexOf(step as OnboardingStep)

  const [part, setPart] = React.useState(0)
  // On a phone, a long step is spread over two screens so each one asks for one kind of thing.
  const parts = mobileSetup ? ({ reach: 2 } as Partial<Record<OnboardingStep, number>>)[step] ?? 1 : 1
  const lastPart = part >= parts - 1
  // The phone preview stays in view while the main button is chosen, so the choice is seen on the page at once.
  const previewStep = ["business", "contacts", "widgets", "publish"].includes(step) || (step === "reach" && parts > 1 && part === 0)
  const go = (to: OnboardingStep) => {
    setPart(0)
    setSheetSize("edit")
    setShowErrors(false)
    setDirection(SETUP_STEPS.indexOf(to as OnboardingStep) >= stepIndex ? 1 : -1)
    navigated.current = true
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    update((x) => ({ ...x, step: to }))
  }
  React.useEffect(() => {
    if (!navigated.current) return
    shell.current?.querySelector<HTMLElement>("#step-title")?.focus({ preventScroll: true })
  }, [step])
  const next = () => {if(step === "reach")update(x=>({...x,setupDrafts:{...x.setupDrafts,connections:undefined}}));if(step === "plan" && !s.setupDrafts?.planIntent)update(x=>({...x,setupDrafts:{...x.setupDrafts,planIntent:"free"}}));if(s.setupDrafts?.reviewEdit){go("publish");update(x=>({...x,setupDrafts:{...x.setupDrafts,reviewEdit:false}}))}else go(SETUP_STEPS[Math.min(stepIndex + 1, SETUP_STEPS.length - 1)]!)}
  const back = () => {if(part>0){setPart(part-1);return}if(s.setupDrafts?.reviewEdit){go("publish");update(x=>({...x,setupDrafts:{...x.setupDrafts,reviewEdit:false}}))}else go(SETUP_STEPS[Math.max(stepIndex - 1, 0)]!)}

  // A plan chosen on the pricing page carries into setup (and stays through every step) without taking payment.
  // Read from the router, not window.location: on a client-side navigation (pricing → setup) the address has not changed yet when this first renders.
  const params = useSearchParams()
  const [intent] = React.useState<PlanId | null>(() => {
    const p = params.get("plan")
    return p && (PLAN_IDS as readonly string[]).includes(p) ? (p as PlanId) : null
  })
  React.useEffect(() => {
    if (ready && intent) update((x) => (x.setupDrafts?.planIntent === intent ? x : { ...x, setupDrafts:{...x.setupDrafts,planIntent:intent} }))
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
        page: { ...withIndustry.page, themeId: ex.lookId, appearance: structuredClone(ex.overrides), widgets: ex.widgets.map((w) => ({ ...newWidget(w.type as WidgetType, w.settings), appearance: structuredClone(w.appearance) })) },
      }
    })
  }, [ready, from]) // eslint-disable-line react-hooks/exhaustive-deps

  // A design chosen in the gallery: setup begins with it on the page, and the preview shows it from the first step.
  const [chosenDesign] = React.useState(() => { const id = params.get("design"); return id ? getDesign(id) ?? null : null })
  const [arr] = React.useState(() => params.get("arr") ?? undefined)
  React.useEffect(() => {
    const d = chosenDesign
    if (!ready || !d) return
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => ({ ...x, page: withArrangement(applyDesign(x.page, d, { reorder: true }), arr) }))
  }, [ready, chosenDesign]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <SetupLoading />

  const c = s.content
  const slugErrs = slugProblems(c.identity.slug)
  const valid: Record<OnboardingStep, boolean> = {
    industry: state !== null && Boolean(c.identity.industryLabel.trim()),
    goal: true,
    reach: connectionsValid,
    plan: true,
    business: Boolean(c.identity.name.trim()) && slugErrs.length === 0,
    contacts: contentValid,
    widgets: true,
    publish: canPublish(s),
  }
  const partValid = lastPart ? valid[step] : step === "business" ? valid.business : true
  const why: Record<OnboardingStep, string> = {
    industry: "Choose what you do.",
    goal: "",
    plan: "",
    reach: goalOf(s) === "call" ? "Add the phone number people should call." : goalOf(s) === "message" ? "Add an email or WhatsApp number so people can message you." : "Add one way to reach you: a phone number, email or website.",
    business: "Add a name and a valid web address.",
    contacts: "Finish the service name and price, or choose quote/free pricing. Save any vehicle or photos you started.",
    widgets: "",
    publish: "Complete the earlier steps to publish.",
  }

  return (
    <div className="setup-scene"><SetupBackdrop phase={stepIndex} /><main ref={shell} data-preview-expanded="false" data-step={step} data-mobile-layout={previewStep ? "preview" : "focus"} className="setup-flow mx-auto w-full max-w-[90rem] px-5 py-6 sm:px-8 lg:py-8">
      <nav aria-label="Progress" className="setup-progress mb-4">
        <div className="flex min-h-9 items-center gap-3">
          <Link href="/" aria-label="Taplo home" className="setup-home"><TaploLogo className="h-9" /></Link><div role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={SETUP_STEPS.length} aria-valuenow={stepIndex+1} aria-valuetext={STEP_LABEL[step]} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10"><motion.span className="block h-full rounded-full bg-black" initial={false} animate={{width:`${((stepIndex+1)/SETUP_STEPS.length)*100}%`}} transition={reducedMotion ? {duration:0} : {type:"spring", stiffness:300, damping:36}} /></div>
        </div>
      </nav>
      {storageFailed ? <p role="alert" className="mb-4 rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-sm text-amber-950" data-testid="storage-failed">Your browser couldn’t save your latest changes (storage is full or blocked). They are showing here, but may be lost if you reload. Remove a large picture to continue safely.</p> : null}

      <div className="setup-workspace grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <SetupPanel preview={previewStep} size={sheetSize} onSizeChange={setSheetSize} compact={step === "widgets"}>
          <div className="setup-question-heading">{fromName || intent || chosenDesign ? <p className="setup-origin">{chosenDesign ? <span data-testid="from-design">Starting with {chosenDesign.name}{intent ? " · " : ""}</span> : null}{fromName ? <span data-testid="from-example">Starting from {fromName}</span> : null}{fromName && intent ? " · " : ""}{intent ? <span data-testid="plan-intent">{PLANS[intent].name} plan</span> : null}</p> : null}
          <motion.h1 key={step} initial={reducedMotion ? false : { opacity:0, x:direction*10 }} animate={{ opacity:1, x:0 }} transition={{ type:"spring", stiffness:380, damping:34 }} tabIndex={-1} id="step-title" className="font-display mb-8 max-w-xl text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{step === "contacts" ? setupJourney(c.identity.industryKey).heading : parts > 1 && part > 0 ? PART_TITLE[step as "business" | "reach"] : STEP_TITLE[step]}</motion.h1></div>

          <motion.div id="setup-controls" inert={mobileSetup && sheetSize === "preview"} className="setup-step-body" key={step} initial={reducedMotion ? false : { opacity:0, x:direction*16 }} animate={{ opacity:1, x:0 }} transition={{ type:"spring", stiffness:380, damping:34, opacity:{duration:.16} }}>
          {step === "industry" ? (
            <div className="grid gap-7">
              <div className="grid gap-3">
                <TaploInput label="Search businesses" placeholder="Search your business type" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                <ul className="setup-industry-list grid gap-1" aria-label="Kinds of business">
                  {searchIndustries(query).filter((p) => query.trim() ? true : POPULAR.slice(0, 4).includes(p.id) || (state !== null && Boolean(c.identity.industryLabel.trim()) && c.identity.industryKey === p.id)).sort((a, b) => query.trim() ? 0 : POPULAR.indexOf(a.id) - POPULAR.indexOf(b.id)).slice(0, query.trim() ? 6 : 5).map((p) => {
                    const selected = state !== null && (p.id === OTHER_INDUSTRY_ID ? otherOpen || c.identity.industryLabel !== "" && c.identity.industryKey === OTHER_INDUSTRY_ID : c.identity.industryKey === p.id)
                    return (
                      <li key={p.id}>
                        <button type="button" aria-pressed={selected} onClick={() => { setOtherOpen(p.id === OTHER_INDUSTRY_ID); update((x) => applyIndustry(x, p.id, p.id === OTHER_INDUSTRY_ID ? "" : p.label)) }}
                          className={cn("setup-industry relative flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", selected ? "bg-[#111111] text-white" : "bg-[#f5f5f5] hover:bg-[#ededed]")}>
                          <span className="setup-icon"><BusinessIcon id={p.id} /></span><span className="flex-1">{p.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                {state !== null && Boolean(c.identity.industryLabel.trim()) && c.identity.industryKey !== OTHER_INDUSTRY_ID ? (
                  <fieldset className="grid gap-2" data-testid="also-categories">
                    <legend className="text-sm font-medium">I also do (optional)</legend>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.filter((id) => id !== c.identity.industryKey && id !== OTHER_INDUSTRY_ID).slice(0, 8).map((id) => {
                        const on = (c.identity.alsoKeys ?? []).includes(id)
                        const full = !on && (c.identity.alsoKeys ?? []).length >= 2
                        return <button key={id} type="button" aria-pressed={on} disabled={full} className={cn("min-h-10 rounded-full border px-3 text-sm disabled:opacity-40", on ? "bg-[#111111] text-white" : "bg-card")} onClick={() => update((x) => { const cur = x.content.identity.alsoKeys ?? []; return { ...x, content: { ...x.content, identity: { ...x.content.identity, alsoKeys: on ? cur.filter((k) => k !== id) : [...cur, id] } } } })}>{getIndustryPreset(id).label}</button>
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">Adds suggestions only. Your page design stays your choice.</p>
                  </fieldset>
                ) : null}
                {state !== null && Boolean(c.identity.industryLabel.trim()) ? (
                  <div className="grid gap-5" data-testid="category-details">
                    <label className="flex min-h-11 items-center gap-3 text-sm font-medium"><input type="checkbox" className="size-5 accent-black" checked={c.identity.showCategory === true} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, showCategory: e.target.checked } } }))} /><span>Show “{c.identity.industryLabel}” under my name <span className="font-normal text-muted-foreground">· Optional</span></span></label>
                    <fieldset className="grid gap-2" data-testid="how-you-work">
                      <legend className="text-sm font-medium">How do you work?</legend>
                      <div className="flex flex-wrap gap-2">
                        {([["premises", "From a shop or studio"], ["service_area", "I travel to customers"], ["online", "Online"]] as const).map(([mode, label]) => (
                          <button key={mode} type="button" aria-pressed={c.location.mode === mode} className={cn("min-h-11 rounded-full border px-4 text-sm", c.location.mode === mode ? "bg-[#111111] text-white" : "bg-card")} onClick={() => update((x) => ({ ...x, content: { ...x.content, location: { ...x.content.location, mode } } }))}>{label}</button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">No address is needed now. You choose what to show later.</p>
                    </fieldset>
                  </div>
                ) : null}
                <button type="button" className="setup-secondary justify-self-start" onClick={()=>{setOtherOpen(true);update(x=>applyIndustry(x,OTHER_INDUSTRY_ID,""))}}>Use a different business type</button>
                {state !== null && (otherOpen || c.identity.industryKey === OTHER_INDUSTRY_ID && c.identity.industryLabel !== "") ? (
                  <TaploInput label="Describe your business" hint="e.g. Dog groomer, Wedding florist, Piano restorer" value={c.identity.industryLabel} maxLength={80} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })} />
                ) : null}
              </div>
              <details className="setup-sample-businesses text-sm">
                <summary className="inline-flex min-h-10 cursor-pointer list-none items-center rounded-lg text-muted-foreground underline underline-offset-4 hover:text-foreground [&::-webkit-details-marker]:hidden">Just looking? Open a sample business</summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INDUSTRY_FIXTURE_KEYS.map((k) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => { update((x) => loadSample(x, k), { resetHistory: true }); router.push("/dashboard/page") }}>{getFixture(k)!.label}</Button>
                  ))}
                </div>
              </details>
            </div>
          ) : null}

          {step === "goal" ? <SetupConnections section="goals" goal={goalOf(s)} onGoalChange={goal=>update(x=>applyGoal(x,goal))} onValidity={setConnectionsValid}/> : null}
          {step === "reach" ? <SetupConnections section="contact" part={parts > 1 ? part : undefined} goal={goalOf(s)} onGoalChange={goal=>update(x=>applyGoal(x,goal))} onValidity={setConnectionsValid}/> : null}

          {step === "business" ? (
            <div className="grid gap-5">
              <div className="grid gap-5" hidden={parts > 1 && part > 0}>
              <p className="setup-lede -mt-4 text-[0.95rem] text-muted-foreground">Start with your business name. You can add the rest whenever you’re ready.</p>
              <TaploInput label="Business name" autoFocus={!mobileSetup} placeholder="e.g. North Street Studio" value={c.identity.name} maxLength={100} autoComplete="organization" onChange={(e) => update((x) => setName(x, e.target.value), { coalesce: "name" })} />
              <ImageField presentation="identity" framing={s.page.appearance.header?.avatarShape === "circle"?"circle":s.page.appearance.header?.avatarShape === "square"?"square":"logo"} purpose="identity" samples={false} onFramingChange={shape=>update(x=>({...x,page:{...x.page,appearance:{...x.page.appearance,header:{...x.page.appearance.header,avatarShape:shape}}}}))} label="Add a logo or photo · Optional" cropAspect={1} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640} value={c.identity.logo ?? null} onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, logo: v ?? undefined } } }))} />
              <div className="setup-address" data-testid="setup-address">
                <span className="setup-address-label">Your link</span>
                <span className="setup-address-url" aria-live="polite"><span className="text-muted-foreground">{TAPLO_DOMAINS.host}/</span><strong>{c.identity.slug || "your-name"}</strong></span>
                <button type="button" onClick={() => setEditSlug((v) => !v)} aria-expanded={editSlug || (showErrors && slugErrs.length > 0)} className="setup-secondary">{editSlug ? "Done" : "Change"}</button>
                {slugErrs.length && c.identity.slug ? <span className="setup-address-error text-destructive">{SLUG_PROBLEM_MESSAGE[slugErrs[0]!]}</span> : null}
              </div>
              {editSlug || (showErrors && slugErrs.length) ? (
                <TaploInput label="Web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" autoCorrect="off" onChange={(e) => update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} error={showErrors && slugErrs.length ? SLUG_PROBLEM_MESSAGE[slugErrs[0]!] : undefined} />
              ) : null}

              </div>
              <details className="setup-more grid gap-4" data-testid="business-more"><summary className="setup-secondary cursor-pointer list-none">Add a description or cover photo · Optional</summary>
              <div className="mt-4 grid gap-5">
              <TaploInput label="Short description (optional)" placeholder="e.g. Independent hair studio in St Albans." value={c.identity.tagline ?? ""} maxLength={160} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, tagline: e.target.value || undefined } } }), { coalesce: "tag" })} />
              <Overlay trigger={<button type="button" className="setup-secondary">Add a cover photo</button>} open={profileOpen} onOpenChange={setProfileOpen} title="Cover photo" footer={<Button className="min-h-11 w-full" onClick={()=>setProfileOpen(false)}>Done</Button>}><div className="grid gap-5">


              <ImageField purpose="cover" samples={false} label="Cover photo (optional)" cropAspect={16 / 9} defaultAlt={`${c.identity.name || "Business"} cover photo`} maxEdge={1600} value={c.identity.heroImage ?? null} onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, heroImage: v ?? undefined } } }))} />
              </div></Overlay>
              </div></details>
            </div>
          ) : null}

          {step === "contacts" ? <FirstContent onValidity={setContentValid} /> : null}

          {step === "widgets" ? <WidgetsStep /> : null}
          {step === "plan" ? <SetupPlans inline /> : null}
          {step === "publish" ? <PublishStep onEditor={() => router.push("/dashboard/page")} onEdit={to=>{go(to);update(x=>({...x,setupDrafts:{...x.setupDrafts,reviewEdit:true}}))}} /> : null}

          </motion.div>
          {step !== "publish" ? (
            <div className="setup-next mt-8 flex flex-wrap items-center gap-3">
              {(step === "contacts" || step === "reach") && !s.setupDrafts?.reviewEdit ? <button type="button" className="setup-skip setup-secondary" onClick={next}>Skip for now</button> : null}
              {stepIndex > 0 ? <Button variant="outline" size="lg" onClick={back}>Back</Button> : null}
              <Button className="flex-1 bg-signal text-white hover:bg-[#333333] sm:flex-none sm:min-w-40" size="lg" onClick={() => (partValid ? (lastPart ? next() : (setShowErrors(false), setPart(part + 1))) : setShowErrors(true))} aria-describedby={!partValid && showErrors ? "why-disabled" : undefined}>{s.setupDrafts?.reviewEdit?"Save changes":"Continue"}</Button>
              {!partValid && showErrors ? <p id="why-disabled" role="alert" className="text-sm text-destructive">{why[step]}</p> : null}
            </div>
          ) : (
            <div className="setup-next"><Button variant="outline" size="lg" onClick={back}>Back</Button></div>
          )}
        </SetupPanel>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="setup-canvas"><SetupCanvas src="/demo/preview" expanded={false} fit={mobileSetup && sheetSize === "preview"} onOverlayOpen={revealCustomerDialog} /></div>

        </aside>
      </div>
    </main></div>
  )
}

/** Mobile page composition, starting theme and fine adjustment are separate choices. */
function WidgetsStep() {
 return <div className="grid gap-7"><p className="setup-lede -mt-4 text-[0.95rem] text-muted-foreground">A look is already on your page. Try another, or change the colours. You can change all of it later without losing anything.</p><SetupThemes/><SetupDesign/></div>;
}

const toPounds = (minor?: number) => (minor === undefined ? "" : (minor / 100).toFixed(minor % 100 === 0 ? 0 : 2))
interface Row { id: string; name: string; price: string; minutes: string; priceMode?: "fixed"|"from"|"quote"|"free" }
const validRow = (r: Row) => r.name.trim().length > 0 && (r.priceMode === "quote" || r.priceMode === "free" || /^\d{1,6}(\.\d{1,2})?$/.test(r.price.trim()))

/**
 * The first content. A service is a name and a price (and a time, which is what lets people book it); rows are saved as
 * soon as they are complete, so the page fills in while the owner types. Nothing is suggested as a price.
 */
function FirstServices({onValidity}:{onValidity:(valid:boolean)=>void}) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const industry = getIndustryPreset(s.content.identity.industryKey)
  const [rows, setRows] = React.useState<Row[]>(() => {
    if(s.setupDrafts?.services)return s.setupDrafts.services
    const have = (s.content.services ?? []).filter((x) => !x.archived).map((x) => ({ id: x.id, name: x.name, price: toPounds(x.priceMinor), priceMode:x.priceMode, minutes: x.durationMinutes ? String(x.durationMinutes) : "" }))
    return have.length ? have : [{ id: newId("svc"), name: "", price: "", minutes: "" }]
  })
  React.useEffect(()=>{onValidity(rows.every(r=>(!r.name.trim()&&!r.price&&!r.minutes)||validRow(r)))},[rows,onValidity])
  const [focus, setFocus] = React.useState<string | null>(null)
  const [pricing,setPricing]=React.useState<string|null>(null)
  const booking = goalOf(s) === "book"
  const itemLabel = setupJourney(industry.id).noun

  const sync = (next: Row[]) => {
    setRows(next)
    update((st) => {
      const kept = (st.content.services ?? []).filter((x) => x.archived)
      const done = next.filter(validRow).map((r, i) => {
        const prev = (st.content.services ?? []).find((x) => x.id === r.id)
        const minutes = r.minutes ? Math.min(parseInt(r.minutes, 10), 1440) : undefined
        return normService({ ...(prev ?? blankService(i)), id: r.id, name: r.name.trim(), priceMode: r.priceMode ?? "fixed", priceMinor: r.priceMode === "quote" || r.priceMode === "free" ? undefined : Math.round(parseFloat(r.price) * 100), durationMinutes: minutes && minutes > 0 ? minutes : undefined, bookingMode: booking ? "request" : "contact", sortOrder: i + 1 })
      })
      return { ...st, content: { ...st.content, services: [...kept, ...done] }, setupDrafts:{...st.setupDrafts,services:next} }
    }, { coalesce: "first-services" })
  }
  const patch = (id: string, p: Partial<Row>) => sync(rows.map((r) => (r.id === id ? { ...r, ...p } : r)))
  const used = new Set(rows.map((r) => r.name.trim().toLowerCase()))
  const extra = (s.content.identity.alsoKeys ?? []).flatMap((k) => getIndustryPreset(k).suggestedServices)
  const suggestions = [...industry.suggestedServices, ...extra].filter((x) => !used.has(x.name.toLowerCase())).slice(0, 3)
  const add = (name = "") => {
    const row = { id: newId("svc"), name, price: "", minutes: "" }
    setFocus(name ? `${row.id}-price` : `${row.id}-name`)
    sync([...rows,row])
  }
  const anyMinutes = rows.some((r) => validRow(r) && r.minutes)
  const field = "h-12 w-full min-w-0 rounded-lg border-0 bg-white/80 px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
  return (
    <div className="grid gap-4" data-testid="first-services">
      {suggestions.length ? (
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Tap one to start, then add your own price.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Common services">{suggestions.map((sg) => <li key={sg.name}><button type="button" onClick={() => { const empty = rows.find((r) => !r.name.trim() && !r.price); if (empty) { setFocus(`${empty.id}-price`); patch(empty.id, { name: sg.name }) } else add(sg.name) }} className="min-h-10 rounded-lg border bg-card px-3 text-sm hover:border-foreground/40">{sg.name}</button></li>)}</ul>
        </div>
      ) : null}
      <ul className="grid gap-3">
        {rows.map((r, i) => (
          <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_auto] items-end gap-2 max-sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <label className="grid gap-1 max-sm:col-span-3"><span className="text-base font-semibold text-foreground">{i === 0 ? itemLabel : <span className="sr-only">Service</span>}</span><input className={field} aria-label={`Service ${i + 1} name`} placeholder={industry.suggestedServices[0]?.name ?? "e.g. Initial consultation"} maxLength={120} autoFocus={focus === `${r.id}-name`} value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-base font-semibold text-foreground">{i === 0 ? "Price (£)" : <span className="sr-only">Price</span>}</span><input className={field} aria-label={`Service ${i + 1} price`} inputMode="decimal" disabled={r.priceMode === "quote" || r.priceMode === "free"} placeholder={r.priceMode === "quote" ? "Quote" : r.priceMode === "free" ? "Free" : "0.00"} autoFocus={focus === `${r.id}-price`} value={r.priceMode === "quote" || r.priceMode === "free" ? "" : r.price} onChange={(e) => { if (/^\d{0,6}(\.\d{0,2})?$/.test(e.target.value)) patch(r.id, { price: e.target.value }) }} /></label>
            <label className={cn("grid gap-1", industry.id === "hospitality" && "hidden")}><span className="text-base font-semibold text-foreground">{i === 0 ? "Minutes" : <span className="sr-only">Minutes</span>}</span><input className={field} aria-label={`Service ${i + 1} minutes`} inputMode="numeric" placeholder="30" value={r.minutes} onChange={(e) => patch(r.id, { minutes: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></label>
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Remove service ${i + 1}`} disabled={rows.length === 1 && !r.name && !r.price} onClick={() => { const next = rows.filter((x) => x.id !== r.id); sync(next.length ? next : [{ id: newId("svc"), name: "", price: "", minutes: "" }]) }}><Trash2 /></Button>
            <button type="button" className="col-span-full min-h-8 justify-self-start setup-secondary" onClick={()=>setPricing(r.id)}>Pricing options{r.priceMode && r.priceMode!=="fixed" ? ` · ${r.priceMode}` : ""}</button>
          </li>
        ))}
      </ul>
      <Overlay open={pricing!==null} onOpenChange={o=>!o&&setPricing(null)} title="How is this service priced?" footer={<Button className="min-h-11 w-full" onClick={()=>setPricing(null)}>Done</Button>}><div className="grid gap-2">{([{id:"fixed",label:"A fixed price"},{id:"from",label:"Prices start from"},{id:"quote",label:"Ask for a quote"},{id:"free",label:"Free"}] as const).map(mode=><button key={mode.id} type="button" aria-pressed={(rows.find(r=>r.id===pricing)?.priceMode??"fixed")===mode.id} className="min-h-14 rounded-2xl bg-neutral-50 p-3 text-left font-medium aria-pressed:bg-black aria-pressed:text-white" onClick={()=>pricing&&patch(pricing,{priceMode:mode.id})}>{mode.label}</button>)}</div></Overlay>
      <Button type="button" variant="outline" className="min-h-11 justify-self-start" onClick={() => add()}><Plus /> Add another</Button>
      {booking && !anyMinutes ? <p className="text-sm text-muted-foreground" data-testid="booking-hint">Add how long a service takes and people can ask to book it. Without a time, they send an enquiry instead.</p> : null}
    </div>
  )
}

/** A vehicle or product, entered with the same form the editor uses, so nothing is learned twice. */
function FirstRecord({ kind, onValidity }: { kind: "vehicle" | "photo" | "product"; onValidity:(valid:boolean)=>void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const [draft, setDraft] = React.useState<unknown>(() => s.setupDrafts?.record?.kind===kind?s.setupDrafts.record.value:blankFor(kind, s.content))
  const [show, setShow] = React.useState(false)
  const [blank] = React.useState(()=>JSON.stringify(blankFor(kind,s.content),(k,v)=>k==='id'?undefined:v))
  React.useEffect(()=>onValidity(JSON.stringify(draft,(k,v)=>k==='id'?undefined:v)===blank),[draft,blank,onValidity])
  const items = kind !== "photo" ? (s.content.products ?? []).filter((p) => !p.archived && p.kind === kind).map((p) => p.name) : (s.content.gallery ?? []).map((g, i) => g.caption || `Photo ${i + 1}`)
  const save = () => {
    if (Object.keys(validate(kind, draft)).length) { setShow(true); return }
    update((st) => ({ ...st, content: commitRecord(kind, draft, st.content),setupDrafts:{...st.setupDrafts,record:undefined} }))
    setDraft(blankFor(kind, s.content)); setShow(false)
  }
  return (
    <div className="grid gap-4" data-testid="first-record">
      {items.length ? <ul className="grid gap-1 text-sm" aria-label="Added"><li className="font-medium">Added so far</li>{items.map((n, i) => <li key={i} className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-foreground" />{n}</li>)}</ul> : null}
      <RecordForm setup key={items.length} kind={kind} value={draft} onChange={v=>{setDraft(v);update(st=>({...st,setupDrafts:{...st.setupDrafts,record:{kind,value:v}}}))}} showErrors={show} content={s.content} />
      <Button type="button" className="min-h-11 justify-self-start" onClick={save} data-testid="first-record-save">{kind === "vehicle" ? "Add this vehicle" : kind === "product" ? "Add this product" : "Add these photos"}</Button>
    </div>
  )
}

function FirstContent({onValidity}:{onValidity:(valid:boolean)=>void}) {
  const { state } = useDemo()
  const s = state ?? initialState()
  const c = s.content
  const kind = setupJourney(c.identity.industryKey).kind
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <p className="-mt-3 text-sm text-muted-foreground">Add what you want people to see first. You can do this later.</p>
        {kind === "service" ? <FirstServices onValidity={onValidity} /> : <FirstRecord kind={kind} onValidity={onValidity} />}
      </div>
      <SetupDetails />
    </div>
  )
}

function PublishStep({ onEditor, onEdit }: { onEditor: () => void; onEdit: (step:OnboardingStep) => void }) {
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
      <p className="text-sm text-muted-foreground">Your page is taking shape. Check the details before you save it.</p>
      <div className="grid gap-1" aria-label="Page checklist">{[{label:'Business name and image',step:'business' as const,done:Boolean(s.content.identity.logo)},{label:'Description',step:'business' as const,done:Boolean(s.content.identity.tagline)},{label:'Services, stock or work',step:'contacts' as const,done:Boolean(s.content.services?.some(x=>!x.archived)||s.content.products?.some(x=>!x.archived)||s.content.gallery?.length)},{label:'Layout and colours',step:'widgets' as const,done:true}].map(item=><button key={item.label} type="button" className="setup-edit-row" onClick={()=>onEdit(item.step)}><span className="grid size-6 place-items-center rounded-full bg-neutral-100 text-xs">{item.done?<Check aria-hidden="true" className="size-3"/>:'+'}</span><span>{item.label}</span><span className="ml-auto text-xs text-muted-foreground">{item.done?'Edit':'Add'}</span></button>)}</div>
      <SetupDetails /><SetupDesign /><button type="button" className="setup-edit-row" onClick={()=>onEdit("plan")}><span>{PLANS[s.setupDrafts?.planIntent??"free"].name} plan</span><span className="ml-auto setup-secondary">Change</span></button>
      {checks.some((c) => c.required && !c.done) ? (
        <ul className="grid gap-2" aria-label="Still needed">
          {checks.filter((c) => c.required && !c.done).map((c) => <li key={c.id} className="flex items-center gap-2 text-sm text-destructive"><span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />{c.label}</li>)}
        </ul>
      ) : null}
      {checks.some((c) => !c.required && !c.done && c.id !== "published") || waiting.length ? (
        <div className="grid gap-2 border-t pt-4 text-sm" data-testid="finish-later">
          <p className="font-semibold">Add next</p>
          <ul className="grid gap-1 text-muted-foreground">
            {checks.filter((c) => !c.required && !c.done && c.id !== "published").map((c) => <li key={c.id}>{c.label}</li>)}
            {waiting.length ? <li>{waiting.join(", ")}</li> : null}
          </ul>
        </div>
      ) : null}
      <span className="sr-only" data-testid="page-summary">{shown.length ? `On your page: ${shown.join(", ")}.` : ""}</span>
      {s.published ? (
        <div role="status" className="rounded-lg border border-green-600/40 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">{capabilities().publicPublishing ? "Published" : "Saved as your page"} · version {s.published.version}</p>
          <p className="mt-1">View it at <Link className="underline" href={`/demo/p/${s.published.content.identity.slug}`} target="_blank">/demo/p/{s.published.content.identity.slug}</Link> in this browser.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/demo/p/${s.published!.content.identity.slug}`).then(() => setCopied(true)).catch(() => undefined) }}>{copied ? "Link copied" : "Copy link"}</Button>
            <span className="text-xs">{WHEN_UNAVAILABLE.publicPublishing}</span>
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={!ok} onClick={() => update((x) => ({ ...publish(x), onboarded: true }))}>{s.published ? "Publish changes" : "Publish my page"}</Button>
        <Button size="lg" variant="outline" onClick={() => { update((x) => ({ ...x, onboarded: true })); onEditor() }}>Customise my page</Button>
      </div>
      {!ok ? <p className="text-sm text-destructive" role="alert">Finish the steps marked missing to publish.</p> : <p className="text-xs text-muted-foreground">{WHEN_UNAVAILABLE.publicPublishing}</p>}
    </div>
  )
}
