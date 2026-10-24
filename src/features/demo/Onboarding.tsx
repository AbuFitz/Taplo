"use client"

import { Overlay } from "@/components/taplo/overlay"
import { BusinessIcon } from "./BusinessIcon"
import { SetupDesign } from "./SetupDesign"
import { SetupDetails } from "./SetupDetails"
import { SetupPlans } from "./SetupPlans"
import { SetupBackdrop } from "./SetupBackdrop"
import { motion } from "motion/react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { SetupCanvas } from "./SetupCanvas"
import { SetupLoading } from "./SetupLoading"
import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Plus, Trash2, CalendarDays, MessageSquare, Phone, Mail, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { newWidget } from "@/features/page/starter"
import { ImageField } from "@/features/page/editor/controls"
import { getWidget } from "@/features/page/widgets/registry"
import { buildPageViewModel } from "@/features/page/renderer"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { OTHER_INDUSTRY_ID, getIndustryPreset, searchIndustries } from "@/features/themes/presets/industries"
import { cn } from "@/lib/utils"
import { exampleStart, suggestedLooks } from "@/features/inspiration/suggest"
import { LOOKS } from "@/features/page/themes/looks"
import { ThemeSwatch } from "./ThemeSwatch"
import { applyIndustry, blankService, canPublish, hasContactChannel, loadSample, newId, normService, publish, readiness, setName, setSlug, slugProblems } from "./actions"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { ONBOARDING_STEPS, initialState, parseContent, useDemo, type OnboardingStep } from "./store"
import { RecordForm, blankFor, commitRecord, validate } from "@/features/page/editor/RecordForms"
import { WHEN_UNAVAILABLE, capabilities } from "@/lib/capabilities"
import { SandboxBadge } from "@/components/taplo/sandbox-badge"
import { EmailField, PhoneField } from "./ui"
import type { WidgetType } from "@/features/page/contracts/widgets"

const STEP_LABEL: Record<OnboardingStep, string> = {
  business: "Your business",
  industry: "What you do",
  goal: "Your next step",
  reach: "Get in touch",
  widgets: "Design",
  contacts: "First content",
  publish: "Review",
}
const STEP_TITLE: Record<OnboardingStep, string> = {
  business: "Make it yours.",
  industry: "What do you do?",
  goal: "Choose the first step.",
  reach: "How can customers reach you?",
  widgets: "Choose your layout.",
  contacts: "Add your first content",
  publish: "Review your page",
}

const SETUP_STEPS = ONBOARDING_STEPS.filter(step => step !== "goal")

const POPULAR = ["barber", "detailer", "car-dealer", "hospitality", "tutor", "plumber", "personal-trainer", "photographer", "other"]

type Goal = "book" | "enquire" | "call" | "message"
const GOALS: { id: Goal; label: string; hint: string }[] = [
  { id: "book", label: "Book with me", hint: "Customers choose a service and ask for a time." },
  { id: "enquire", label: "Send an enquiry", hint: "A short form. Nothing is reserved." },
  { id: "call", label: "Call me", hint: "A call button comes first." },
  { id: "message", label: "Message me", hint: "WhatsApp or email comes first." },
]
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
  const primaryAction = g === "book" ? "book" : g === "call" ? "call" : g === "message" ? (s.content.contacts.whatsapp ? "whatsapp" : s.content.contacts.email ? "email" : "auto") : "auto"
  return { ...s, content: { ...s.content, booking: { ...s.content.booking, mode } }, page: { ...s.page, meta: { ...s.page.meta, primaryAction } } }
}

/** What the first thing to add is, by kind of business. Nothing is added for them. */
function firstKind(industryKey: string): "service" | "vehicle" | "photo" {
  return industryKey === "car-dealer" ? "vehicle" : industryKey === "photographer" ? "photo" : "service"
}


export function Onboarding() {
  const shell = React.useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [direction, setDirection] = React.useState(1)
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
    sync(); viewport?.addEventListener("resize", sync); viewport?.addEventListener("scroll", sync); window.addEventListener("resize", sync)
    return () => { viewport?.removeEventListener("resize", sync); viewport?.removeEventListener("scroll", sync); window.removeEventListener("resize", sync) }
  }, [])
  const router = useRouter()
  const { ready, state, update } = useDemo()
  const [showErrors, setShowErrors] = React.useState(false)
  const [contentValid,setContentValid]=React.useState(true)
  const [query, setQuery] = React.useState("")
  const [actionOpen, setActionOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editSlug, setEditSlug] = React.useState(false)
  const [otherOpen, setOtherOpen] = React.useState(false)
  const [mobilePreview, setMobilePreview] = React.useState(false)
  const [reachChoice, setReachChoice] = React.useState<"phone" | "email" | "whatsapp" | null>(null)
  const s = state ?? initialState()
  const step: OnboardingStep = s.step === "goal" ? "reach" : (ONBOARDING_STEPS as readonly string[]).includes(s.step) ? s.step : "widgets"
  const stepIndex = SETUP_STEPS.indexOf(step as Exclude<OnboardingStep, "goal">)

  const go = (to: OnboardingStep) => {
    setShowErrors(false)
    setDirection(SETUP_STEPS.indexOf(to as Exclude<OnboardingStep, "goal">) >= stepIndex ? 1 : -1)
    navigated.current = true
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    update((x) => ({ ...x, step: to }))
  }
  React.useEffect(() => {
    if (!navigated.current) return
    shell.current?.querySelector<HTMLElement>("#step-title")?.focus({ preventScroll: true })
  }, [step])
  const next = () => go(SETUP_STEPS[Math.min(stepIndex + 1, SETUP_STEPS.length - 1)]!)
  const back = () => go(SETUP_STEPS[Math.max(stepIndex - 1, 0)]!)

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

  if (!ready) return <SetupLoading />

  const c = s.content
  const reachMethod = goalOf(s) === "call" ? "phone" : reachChoice ?? (goalOf(s) === "message" ? "whatsapp" : c.contacts.phone ? "phone" : "email")
  const slugErrs = slugProblems(c.identity.slug)
  const valid: Record<OnboardingStep, boolean> = {
    industry: state !== null && Boolean(c.identity.industryLabel.trim()),
    goal: true,
    reach: goalOf(s) === "call" ? Boolean(c.contacts.phone) : hasContactChannel(c),
    business: Boolean(c.identity.name.trim()) && slugErrs.length === 0,
    contacts: contentValid,
    widgets: true,
    publish: canPublish(s),
  }
  const why: Record<OnboardingStep, string> = {
    industry: "Choose what you do.",
    goal: "",
    reach: goalOf(s) === "call" ? "Add the phone number people should call." : "Add at least one way to reach you.",
    business: "Add a name and a valid web address.",
    contacts: "Finish the service name and price, or choose quote/free pricing. Save any vehicle or photos you started.",
    widgets: "",
    publish: "Complete the earlier steps to publish.",
  }

  return (
    <div className="setup-scene"><SetupBackdrop /><main ref={shell} data-preview-expanded="false" data-step={step} className="setup-flow mx-auto w-full max-w-[90rem] px-5 py-6 sm:px-8 lg:py-8">
      <nav aria-label="Progress" className="setup-progress mb-4">
        <div className="flex min-h-9 items-center gap-3">
          <div role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={SETUP_STEPS.length} aria-valuenow={stepIndex+1} aria-valuetext={STEP_LABEL[step]} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10"><motion.span className="block h-full rounded-full bg-black" initial={false} animate={{width:`${((stepIndex+1)/SETUP_STEPS.length)*100}%`}} transition={reducedMotion ? {duration:0} : {type:"spring", stiffness:300, damping:36}} /></div>
          <SandboxBadge compact className="setup-context" /><Link href="/" aria-label="Leave setup" className="grid size-9 shrink-0 place-items-center rounded-full focus-visible:ring-2"><X aria-hidden="true" className="size-4" /></Link>
        </div>
      </nav>

      <div className="setup-workspace grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <section aria-labelledby="step-title" className="min-w-0">
          <div className="setup-question-heading">{fromName || intent ? <p className="setup-origin">{fromName ? <span data-testid="from-example">Starting from {fromName}</span> : null}{fromName && intent ? " · " : ""}{intent ? <span data-testid="plan-intent">{PLANS[intent].name} plan</span> : null}</p> : null}
          <motion.h1 key={step} initial={reducedMotion ? false : { opacity:0, x:direction*10 }} animate={{ opacity:1, x:0 }} transition={{ type:"spring", stiffness:380, damping:34 }} tabIndex={-1} id="step-title" className="font-display mb-8 max-w-xl text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{step === "contacts" ? { service: "Add your first service", vehicle: "Add your first vehicle", photo: "Add your first photos" }[firstKind(c.identity.industryKey)] : STEP_TITLE[step]}</motion.h1></div>

          <motion.div className="setup-step-body" key={step} initial={reducedMotion ? false : { opacity:0, x:direction*16 }} animate={{ opacity:1, x:0 }} transition={{ type:"spring", stiffness:380, damping:34, opacity:{duration:.16} }}>
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
                          <span className="setup-icon"><BusinessIcon id={p.id} /></span>{selected ? <Check aria-hidden="true" className="absolute right-2 top-2 size-3 text-current" /> : null}<span>{p.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <button type="button" className="min-h-11 justify-self-start text-sm underline underline-offset-4" onClick={()=>{setOtherOpen(true);update(x=>applyIndustry(x,OTHER_INDUSTRY_ID,""))}}>Use a different business type</button>
                {state !== null && (otherOpen || c.identity.industryKey === OTHER_INDUSTRY_ID && c.identity.industryLabel !== "") ? (
                  <TaploInput label="Describe your business" hint="e.g. Dog groomer, Wedding florist, Piano restorer" value={c.identity.industryLabel} maxLength={80} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })} />
                ) : null}
              </div>
              <details className="text-sm">
                <summary className="inline-flex min-h-10 cursor-pointer list-none items-center rounded-lg text-muted-foreground underline underline-offset-4 hover:text-foreground [&::-webkit-details-marker]:hidden">Just looking? Open a sample business</summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INDUSTRY_FIXTURE_KEYS.map((k) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => { update((x) => loadSample(x, k), { resetHistory: true }); router.push("/dashboard/page") }}>{getFixture(k)!.label}</Button>
                  ))}
                </div>
              </details>
            </div>
          ) : null}

              {step === "reach" ? (
                <div className="grid gap-5"><div className="setup-action-summary"><span><span className="block text-xs text-muted-foreground">Your main button</span><strong className="text-sm">{GOALS.find(g => g.id === goalOf(s))?.label}</strong></span><button type="button" className="min-h-11 px-3 text-sm font-semibold underline underline-offset-4" onClick={() => setActionOpen(true)}>Change main action</button></div>
                <Overlay open={actionOpen} onOpenChange={setActionOpen} title="Choose your main button" description="Choose what customers can do from your page." footer={<Button className="min-h-11 w-full" onClick={() => setActionOpen(false)}>Done</Button>}>
                  <fieldset className="grid gap-2" data-testid="goal"><legend className="sr-only">Main button</legend>{GOALS.map(g => { const Icon = { book: CalendarDays, enquire: MessageSquare, call: Phone, message: Mail }[g.id]; return <label key={g.id} className="flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl bg-neutral-50 p-3 has-[:checked]:bg-black has-[:checked]:text-white"><input type="radio" className="sr-only" name="goal" checked={goalOf(s)===g.id} onChange={()=>update(x=>applyGoal(x,g.id))}/><Icon aria-hidden="true" className="size-5 shrink-0"/><span><strong className="block text-sm">{g.label}</strong><span className="mt-1 block text-xs opacity-75">{g.hint}</span></span></label>})}</fieldset>
                </Overlay><fieldset className="grid gap-3" data-testid="reach">
                  <legend className="mb-1 text-sm font-semibold">{goalOf(s) === "call" ? "The number to call" : "How can people reach you?"}</legend>
                  {goalOf(s) !== "call" ? <div className="grid grid-cols-3 gap-3" role="group" aria-label="Contact method">{(["email", "phone", "whatsapp"] as const).map(method => { const Icon = method === "email" ? Mail : method === "phone" ? Phone : MessageSquare; return <button type="button" key={method} aria-pressed={reachMethod === method} onClick={() => setReachChoice(method)} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring", reachMethod === method ? "border-signal bg-signal-soft text-signal" : "bg-white hover:border-signal")}><Icon className="size-4" aria-hidden="true" />{method === "email" ? "Email" : method === "phone" ? "Phone" : "WhatsApp"}</button> })}</div> : null}
                  {reachMethod === "email" ? <EmailField value={c.contacts.email} onCommit={v => update(x => applyGoal({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, email: v } } }, goalOf(x)), { coalesce: "email" })} /> : <PhoneField label={reachMethod === "phone" ? "Phone" : "WhatsApp"} value={c.contacts[reachMethod]} onCommit={v => update(x => applyGoal({ ...x, content: { ...x.content, contacts: { ...x.content.contacts, [reachMethod]: v } } }, goalOf(x)), { coalesce: reachMethod })} hint={reachMethod === "whatsapp" ? "With country code, e.g. +44." : undefined} />}
                  <p className="text-sm text-muted-foreground">One contact method is enough.</p>
                </fieldset></div>
              ) : null}

          {step === "business" ? (
            <div className="grid gap-5">
              <ImageField presentation="identity" purpose="identity" samples={false} onFramingChange={shape=>update(x=>({...x,page:{...x.page,appearance:{...x.page.appearance,header:{...x.page.appearance.header,avatarShape:shape}}}}))} label="Add your logo or profile photo" cropAspect={1} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640} value={c.identity.logo ?? null} onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, logo: v ?? undefined } } }))} />
              <TaploInput label="Business name" value={c.identity.name} maxLength={100} autoComplete="organization" onChange={(e) => update((x) => setName(x, e.target.value), { coalesce: "name" })} />
              <div className="-mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">taplo.co/{c.identity.slug || "your-name"}</span>{" "}
                <button type="button" onClick={() => setEditSlug((v) => !v)} aria-expanded={editSlug || (showErrors && slugErrs.length > 0)} className="rounded px-1 font-medium text-foreground underline underline-offset-4">{editSlug ? "Done" : "Change"}</button>
                {slugErrs.length && c.identity.slug ? <span className="block text-destructive">{SLUG_PROBLEM_MESSAGE[slugErrs[0]!]}</span> : null}
              </div>
              {editSlug || (showErrors && slugErrs.length) ? (
                <TaploInput label="Web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" autoCorrect="off" onChange={(e) => update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} error={showErrors && slugErrs.length ? SLUG_PROBLEM_MESSAGE[slugErrs[0]!] : undefined} />
              ) : null}

              <TaploInput label="Short description (optional)" value={c.identity.tagline ?? ""} maxLength={160} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, tagline: e.target.value || undefined } } }), { coalesce: "tag" })} />
              <button type="button" className="min-h-11 text-left text-sm font-medium underline underline-offset-4" onClick={()=>setProfileOpen(true)}>Add a cover photo</button><Overlay open={profileOpen} onOpenChange={setProfileOpen} title="Cover photo" footer={<Button className="min-h-11 w-full" onClick={()=>setProfileOpen(false)}>Done</Button>}><div className="grid gap-5">


              <ImageField purpose="cover" label="Cover photo (optional)" cropAspect={16 / 9} defaultAlt={`${c.identity.name || "Business"} cover photo`} maxEdge={1600} value={c.identity.heroImage ?? null} onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, heroImage: v ?? undefined } } }))} />
              </div></Overlay>
            </div>
          ) : null}

          {step === "contacts" ? <FirstContent onValidity={setContentValid} /> : null}

          {step === "widgets" ? <WidgetsStep /> : null}
          {step === "publish" ? <PublishStep onEditor={() => router.push("/dashboard/page")} onEdit={go} /> : null}

          </motion.div>
          {step !== "publish" ? (
            <div className="setup-next mt-8 flex flex-wrap items-center gap-3">
              {stepIndex > 0 ? <Button variant="outline" size="lg" onClick={back}>Back</Button> : null}
              <Button className="flex-1 bg-signal text-white hover:bg-[#333333] sm:flex-none sm:min-w-40" size="lg" onClick={() => (valid[step] ? next() : setShowErrors(true))} aria-describedby="why-disabled">Continue</Button>
              {!valid[step] && showErrors ? <p id="why-disabled" role="alert" className="text-sm text-destructive">{why[step]}</p> : null}
            </div>
          ) : (
            <div className="mt-8"><Button variant="outline" size="lg" onClick={back}>Back</Button></div>
          )}
        </section>

        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="setup-canvas-heading"><button type="button" onClick={() => setMobilePreview(true)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-medium">View full size<ArrowUpRight aria-hidden="true" className="size-3" /></button></div>
          <div className="setup-canvas"><SetupCanvas src="/demo/preview" expanded={false} /></div>

        </aside>
      </div>
      <Overlay open={mobilePreview} onOpenChange={setMobilePreview} kind="detail" title="Full-size preview" testId="setup-full-preview" className="sm:h-[90dvh] sm:max-h-[90dvh] sm:w-[min(96vw,90rem)] sm:max-w-none" bodyClassName="p-0! overflow-hidden!"><div className="h-full min-h-0"><SetupCanvas src="/demo/preview" expanded /></div></Overlay>
    </main></div>
  )
}

/** Suggested looks for this kind of business, each shown as a real page. A look is a starting point: every colour, font and shape can be changed afterwards. */
function LookPicker({ industryKey, themeId, onPick }: { industryKey: string; themeId: string; onPick: (id: string) => void }) {
  const [initialLook] = React.useState(themeId)
  const looks = React.useMemo(() => { const list = suggestedLooks(industryKey); const current = LOOKS.find(l => l.id === initialLook); const at = list.findIndex(l => l.id === initialLook); return current && (at < 0 || at >= 6) ? [current, ...list.filter(l => l.id !== initialLook)] : list }, [industryKey, initialLook])
  const card = (l: (typeof looks)[number]) => {
    const active = themeId === l.id
    return (
      <label key={l.id} className="setup-look-choice" data-selected={active}>
        <input type="radio" name="look" value={l.id} checked={active} onChange={() => onPick(l.id)} className="sr-only" />
        <span className="block overflow-hidden rounded-xl"><ThemeSwatch look={l} /></span>
        <span className="setup-look-name">{l.name}{active ? <Check aria-hidden="true" className="size-3" /> : null}</span>
      </label>
    )
  }
  return (
    <fieldset className="setup-look-picker grid gap-3" data-testid="look-picker">
      <legend className="sr-only">Pick a look</legend>
      <div className="grid grid-cols-3 gap-2 pb-2">{looks.slice(0, 6).map(card)}</div>
      {looks.length > 6 ? <details className="group">
        <summary className="inline-flex min-h-10 cursor-pointer list-none items-center rounded-lg text-sm font-medium underline underline-offset-4 [&::-webkit-details-marker]:hidden">More looks</summary>
        <div className="mt-3 grid grid-cols-3 gap-3 pb-2">{looks.slice(6).map(card)}</div>
      </details> : null}
    </fieldset>
  )
}

/** Design: one choice, shown on an example business, applied to theirs as they pick. Everything can be changed in the editor. */
function WidgetsStep() {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  React.useEffect(()=>{
    if(s.page.appearance.background || s.setupDrafts?.backgroundEdited)return
    const bg=LOOKS.find(l=>l.id===s.page.themeId)?.overrides.colors?.background??'#ffffff'
    const dark=bg==='#000000'||bg==='#080808'
    update(st=>({...st,page:{...st.page,appearance:{...st.page.appearance,background:{kind:'gradient',from:dark?'#000000':'#ffffff',to:dark?'#303030':'#dddddd',angle:135,motion:true,source:'logo'},decoration:'grain'}}}))
  },[s.page.themeId,s.page.appearance.background,s.setupDrafts?.backgroundEdited,update])
  return <div className="grid gap-4"><SetupDesign compact /><LookPicker industryKey={s.content.identity.industryKey} themeId={s.page.themeId} onPick={(id) => update((x) => ({ ...x, page: { ...x.page, themeId: id, appearance: x.setupDrafts?.backgroundEdited?{background:x.page.appearance.background,colors:x.page.appearance.colors,decoration:x.page.appearance.decoration}:{} } }))} /></div>
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
  const suggestions = industry.suggestedServices.filter((x) => !used.has(x.name.toLowerCase())).slice(0, 3)
  const add = (name = "") => {
    const row = { id: newId("svc"), name, price: "", minutes: "" }
    setFocus(name ? `${row.id}-price` : `${row.id}-name`)
    sync([...rows,row])
  }
  const anyMinutes = rows.some((r) => validRow(r) && r.minutes)
  const field = "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <label className="grid gap-1 max-sm:col-span-3"><span className="text-xs font-medium text-muted-foreground">{i === 0 ? "Service" : <span className="sr-only">Service</span>}</span><input className={field} aria-label={`Service ${i + 1} name`} placeholder="e.g. Initial consultation" maxLength={120} autoFocus={focus === `${r.id}-name`} value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-xs font-medium text-muted-foreground">{i === 0 ? "Price (£)" : <span className="sr-only">Price</span>}</span><input className={field} aria-label={`Service ${i + 1} price`} inputMode="decimal" disabled={r.priceMode === "quote" || r.priceMode === "free"} placeholder={r.priceMode === "quote" ? "Quote" : r.priceMode === "free" ? "Free" : ""} autoFocus={focus === `${r.id}-price`} value={r.price} onChange={(e) => { if (/^\d{0,6}(\.\d{0,2})?$/.test(e.target.value)) patch(r.id, { price: e.target.value }) }} /></label>
            <label className="grid gap-1"><span className="text-xs font-medium text-muted-foreground">{i === 0 ? "Minutes" : <span className="sr-only">Minutes</span>}</span><input className={field} aria-label={`Service ${i + 1} minutes`} inputMode="numeric" value={r.minutes} onChange={(e) => patch(r.id, { minutes: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></label>
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Remove service ${i + 1}`} disabled={rows.length === 1 && !r.name && !r.price} onClick={() => { const next = rows.filter((x) => x.id !== r.id); sync(next.length ? next : [{ id: newId("svc"), name: "", price: "", minutes: "" }]) }}><Trash2 /></Button>
            <button type="button" className="col-span-full min-h-8 justify-self-start text-xs font-medium underline underline-offset-4" onClick={()=>setPricing(r.id)}>Pricing options{r.priceMode && r.priceMode!=="fixed" ? ` · ${r.priceMode}` : ""}</button>
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
function FirstRecord({ kind, onValidity }: { kind: "vehicle" | "photo"; onValidity:(valid:boolean)=>void }) {
  const { state, update } = useDemo()
  const s = state ?? initialState()
  const [draft, setDraft] = React.useState<unknown>(() => s.setupDrafts?.record?.kind===kind?s.setupDrafts.record.value:blankFor(kind, s.content))
  const [show, setShow] = React.useState(false)
  const [blank] = React.useState(()=>JSON.stringify(blankFor(kind,s.content),(k,v)=>k==='id'?undefined:v))
  React.useEffect(()=>onValidity(JSON.stringify(draft,(k,v)=>k==='id'?undefined:v)===blank),[draft,blank,onValidity])
  const items = kind === "vehicle" ? (s.content.products ?? []).filter((p) => !p.archived && p.kind === "vehicle").map((p) => p.name) : (s.content.gallery ?? []).map((g, i) => g.caption || `Photo ${i + 1}`)
  const save = () => {
    if (Object.keys(validate(kind, draft)).length) { setShow(true); return }
    update((st) => ({ ...st, content: commitRecord(kind, draft, st.content),setupDrafts:{...st.setupDrafts,record:undefined} }))
    setDraft(blankFor(kind, s.content)); setShow(false)
  }
  return (
    <div className="grid gap-4" data-testid="first-record">
      {items.length ? <ul className="grid gap-1 text-sm" aria-label="Added"><li className="font-medium">Added so far</li>{items.map((n, i) => <li key={i} className="flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-foreground" />{n}</li>)}</ul> : null}
      <RecordForm key={items.length} kind={kind} value={draft} onChange={v=>{setDraft(v);update(st=>({...st,setupDrafts:{...st.setupDrafts,record:{kind,value:v}}}))}} showErrors={show} content={s.content} />
      <Button type="button" className="min-h-11 justify-self-start" onClick={save} data-testid="first-record-save">{kind === "vehicle" ? "Add this vehicle" : "Add these photos"}</Button>
    </div>
  )
}

function FirstContent({onValidity}:{onValidity:(valid:boolean)=>void}) {
  const { state } = useDemo()
  const s = state ?? initialState()
  const c = s.content
  const kind = firstKind(c.identity.industryKey)
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <p className="-mt-3 text-sm text-muted-foreground">Add one to start. You can fill out the rest later.</p>
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
      <p className="text-sm text-muted-foreground">Check the real page above. Fill any gaps before you save it.</p>
      <div className="grid gap-1" aria-label="Page checklist">{[{label:'Business name and image',step:'business' as const,done:Boolean(s.content.identity.logo)},{label:'Description',step:'business' as const,done:Boolean(s.content.identity.tagline)},{label:'Services, stock or work',step:'contacts' as const,done:Boolean(s.content.services?.some(x=>!x.archived)||s.content.products?.some(x=>!x.archived)||s.content.gallery?.length)},{label:'Layout and colours',step:'widgets' as const,done:true}].map(item=><button key={item.label} type="button" className="setup-edit-row" onClick={()=>onEdit(item.step)}><span className="grid size-6 place-items-center rounded-full bg-neutral-100 text-xs">{item.done?<Check aria-hidden="true" className="size-3"/>:'+'}</span><span>{item.label}</span><span className="ml-auto text-xs text-muted-foreground">{item.done?'Edit':'Add'}</span></button>)}</div>
      <SetupDetails /><SetupDesign /><SetupPlans />
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
