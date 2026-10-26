"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { TaploLogo } from "@/components/taplo/brand"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { newWidget } from "@/features/page/starter"
import type { WidgetType } from "@/features/page/contracts/widgets"
import { exampleStart } from "@/features/inspiration/suggest"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { applyDesign, getDesign } from "@/features/page/themes/designs"
import { ONBOARDING_STEPS, initialState, useDemo, type OnboardingStep } from "@/features/demo/store"
import { SetupLoading } from "@/features/demo/SetupLoading"
import { applyIndustry, canPublish, hasContactChannel, slugProblems } from "@/features/demo/actions"
import { setupJourney } from "@/features/demo/setup-journey"
import { Backdrop } from "./Backdrop"
import { Stage } from "./Stage"
import { SetupCtx } from "./context"
import { goalOf } from "./goal"
import { STEPS, stepIndexOf } from "./steps"
import { IdentityStep } from "./steps/IdentityStep"
import { IndustryStep } from "./steps/IndustryStep"
import { ReachStep } from "./steps/ReachStep"
import { OfferStep } from "./steps/OfferStep"
import { DesignStep } from "./steps/DesignStep"
import { PlanStep, PLAN_FOCUS } from "./steps/PlanStep"
import { FinishStep } from "./steps/FinishStep"
import "./setup.css"

const subscribeMobile = (cb: () => void) => { const q = window.matchMedia("(max-width:1023px)"); q.addEventListener("change", cb); return () => q.removeEventListener("change", cb) }
const subscribeShort = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb) }

const BLOCKED: Record<string, string> = {
  business: "Add your business name to continue.",
  industry: "Choose what you do, or describe it.",
  contacts: "Finish the name and price, or choose quote or free. Save anything you started.",
  publish: "Finish the earlier steps first.",
}

export function Onboarding() {
  const shell = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const reduced = useReducedMotion()
  const mobile = React.useSyncExternalStore(subscribeMobile, () => window.matchMedia("(max-width:1023px)").matches, () => false)
  // On a short computer screen a long step is split in two, exactly as on a phone, so nothing needs scrolling to find.
  const short = React.useSyncExternalStore(subscribeShort, () => window.innerHeight < 860, () => false)
  const split = mobile || short
  const { ready, state, update } = useDemo()
  const s = state ?? initialState()
  const step = (s.step === "goal" ? "reach" : (ONBOARDING_STEPS as readonly string[]).includes(s.step) ? s.step : "widgets") as Exclude<OnboardingStep, "goal">
  const index = stepIndexOf(step)
  const def = STEPS[index]!
  const [part, setPart] = React.useState(0)
  const [peek, setPeek] = React.useState(false)
  const [direction, setDirection] = React.useState(1)
  const [showErrors, setShowErrors] = React.useState(false)
  const [valid, setValid] = React.useState(true)
  const navigated = React.useRef(false)

  const parts = split && def.parts ? def.parts.length : 1
  const last = part >= parts - 1
  const here = split && def.parts ? def.parts[Math.min(part, def.parts.length - 1)]! : null
  const title = step === "contacts" && (!here || part === 0) ? setupJourney(s.content.identity.industryKey).heading : here?.title ?? def.title
  const view = here?.view ?? def.view
  const focus = here?.focus ?? def.focus

  // Keep the layout on the visible part of the screen when a keyboard opens.
  React.useEffect(() => {
    const vv = window.visualViewport
    let initial = { h: window.innerHeight, w: window.innerWidth }
    const sync = () => {
      const el = shell.current
      if (!el) return
      if (Math.abs(window.innerWidth - initial.w) > 80) initial = { h: window.innerHeight, w: window.innerWidth }
      const h = vv?.height ?? window.innerHeight
      el.style.setProperty("--sf-height", `${h}px`)
      el.style.setProperty("--sf-top", `${vv?.offsetTop ?? 0}px`)
      el.dataset.keyboard = String(Math.max(window.innerHeight, initial.h) - h > 180 && Boolean(document.activeElement?.matches("input,textarea")))
    }
    const later = () => requestAnimationFrame(sync)
    window.scrollTo(0, 0); sync()
    document.addEventListener("focusin", later); document.addEventListener("focusout", later)
    vv?.addEventListener("resize", sync); vv?.addEventListener("scroll", sync); window.addEventListener("resize", sync)
    return () => { document.removeEventListener("focusin", later); document.removeEventListener("focusout", later); vv?.removeEventListener("resize", sync); vv?.removeEventListener("scroll", sync); window.removeEventListener("resize", sync) }
  }, [])

  const go = React.useCallback((to: Exclude<OnboardingStep, "goal">) => {
    setPart(0); setPeek(false); setShowErrors(false); setValid(true)
    setDirection(stepIndexOf(to) >= index ? 1 : -1)
    navigated.current = true
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    update((x) => ({ ...x, step: to }))
  }, [index, update])
  React.useEffect(() => {
    if (navigated.current) shell.current?.querySelector<HTMLElement>("#sf-title")?.focus({ preventScroll: true })
  }, [step, part])

  const params = useSearchParams()
  const [intent] = React.useState<PlanId | null>(() => { const p = params.get("plan"); return p && (PLAN_IDS as readonly string[]).includes(p) ? (p as PlanId) : null })
  React.useEffect(() => { if (ready && intent) update((x) => (x.setupDrafts?.planIntent === intent ? x : { ...x, setupDrafts: { ...x.setupDrafts, planIntent: intent } })) }, [ready, intent]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Start from this" on an inspiration page: its kind of business, look and content types. Never its sample content.
  const [from] = React.useState(() => { const slug = params.get("from"); return slug ? exampleStart(slug) : null })
  React.useEffect(() => {
    if (!ready || !from) return
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => {
      const withIndustry = applyIndustry(x, from.industryKey, from.industryLabel)
      return { ...withIndustry,
        content: { ...withIndustry.content, booking: { ...withIndustry.content.booking, mode: from.bookingMode } },
        page: { ...withIndustry.page, themeId: from.lookId, appearance: structuredClone(from.overrides), widgets: from.widgets.map((w) => ({ ...newWidget(w.type as WidgetType, w.settings), appearance: structuredClone(w.appearance) })) } }
    })
  }, [ready, from]) // eslint-disable-line react-hooks/exhaustive-deps

  // A design chosen in the gallery: setup begins with it applied, and every later step builds on that choice.
  const [chosenDesign] = React.useState(() => { const id = params.get("design"); return id ? getDesign(id) ?? null : null })
  React.useEffect(() => {
    if (!ready || !chosenDesign) return
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => ({ ...x, page: applyDesign(x.page, chosenDesign) }))
  }, [ready, chosenDesign]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <SetupLoading />

  const c = s.content
  const goal = goalOf(s)
  const reachOk = goal === "call" ? Boolean(c.contacts.phone) : goal === "message" ? Boolean(c.contacts.email || c.contacts.whatsapp) : hasContactChannel(c)
  const slugBad = slugProblems(c.identity.slug).length > 0
  const nameOk = Boolean(c.identity.name.trim()) && !slugBad
  const stepOk: Record<string, boolean> = {
    business: nameOk,
    industry: Boolean(c.identity.industryLabel.trim()),
    reach: !last || (valid && reachOk),
    contacts: valid,
    widgets: true,
    plan: true,
    publish: canPublish(s),
  }
  const canContinue = (step === "business" && !last ? nameOk : stepOk[step]) ?? true
  const blockedText = step === "reach"
    ? goal === "call" ? "Add the phone number people should call." : goal === "message" ? "Add an email or WhatsApp number so people can message you." : "Add a phone number, email or website so customers can reach you."
    : BLOCKED[step] ?? ""
  const editing = Boolean(s.setupDrafts?.reviewEdit)

  const next = () => {
    if (!canContinue) { setShowErrors(true); return }
    if (!last) { setShowErrors(false); setPart(part + 1); return }
    if (step === "reach") update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, connections: undefined } }))
    if (step === "plan" && !s.setupDrafts?.planIntent) update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, planIntent: "free" } }))
    if (editing) { update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, reviewEdit: false } })); go("publish"); return }
    go(STEPS[Math.min(index + 1, STEPS.length - 1)]!.id)
  }
  const back = () => {
    if (part > 0) { setPart(part - 1); return }
    if (editing) { update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, reviewEdit: false } })); go("publish"); return }
    go(STEPS[Math.max(index - 1, 0)]!.id)
  }

  const finish = step === "publish"
  const stage = mobile && finish ? "large" : def.stage
  const ctx = { s, update, part: split && def.parts ? part : undefined, mobile, showErrors, setValid }
  const hasSheet = mobile && stage !== "hidden"

  return (
    <div className="sf-scene" data-testid="setup-scene">
      <Backdrop phase={index} />
      <div ref={shell} className="sf-card" data-step={step} data-stage={stage} data-peek={peek} data-keyboard="false">
        <nav className="sf-top" aria-label="Progress">
          <Link href="/" aria-label="Taplo home" className="sf-home"><TaploLogo className="h-9" /></Link>
          <div className="sf-progress" role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={index + 1} aria-valuetext={def.label}>
            <ol aria-hidden="true">{STEPS.map((st, i) => <li key={st.id} data-state={i < index ? "done" : i === index ? "now" : "todo"}><i /></li>)}</ol>
            <span>{index + 1} of {STEPS.length} · {def.label}</span>
          </div>
        </nav>
        <div className="sf-body">
          <Stage view={finish ? "whole" : peek ? "whole" : view} focus={step === "plan" ? PLAN_FOCUS[s.setupDrafts?.planIntent ?? "free"].focus : focus} caption={step === "plan" ? PLAN_FOCUS[s.setupDrafts?.planIntent ?? "free"].caption : undefined} />
          <section className="sf-panel" aria-labelledby="sf-title">
            {hasSheet ? <button type="button" className="sf-grip" aria-label={peek ? "Back to editing" : "See more of your page"} aria-expanded={!peek} onClick={() => setPeek((v) => !v)}><span /></button> : null}
            <div className="sf-head">
              {from || intent || chosenDesign ? <p className="sf-origin">{from ? <span data-testid="from-example">Starting from {from.name}</span> : null}{chosenDesign ? <span data-testid="from-design">Starting with {chosenDesign.name}</span> : null}{(from || chosenDesign) && intent ? " · " : ""}{intent ? <span data-testid="plan-intent">{PLANS[intent].name} plan</span> : null}</p> : null}
              <motion.h1 key={`${step}-${part}`} id="sf-title" tabIndex={-1} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>{title}</motion.h1>
            </div>
            <motion.div key={`${step}-${part}`} className="sf-scroll" id="sf-controls" inert={peek} initial={reduced ? false : { opacity: 0, x: direction * 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 380, damping: 34, opacity: { duration: 0.16 } }}>
              <SetupCtx.Provider value={ctx}>
                {step === "business" ? <IdentityStep /> : null}
                {step === "industry" ? <IndustryStep /> : null}
                {step === "reach" ? <ReachStep /> : null}
                {step === "contacts" ? <OfferStep /> : null}
                {step === "widgets" ? <DesignStep /> : null}
                {step === "plan" ? <PlanStep /> : null}
                {finish ? <FinishStep onDashboard={() => router.push("/dashboard/page")} onEdit={(to: Exclude<OnboardingStep, "goal">) => { update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, reviewEdit: true } })); go(to) }} /> : null}
              </SetupCtx.Provider>
            </motion.div>
            {finish ? <div className="sf-actions" data-role="finish-actions" /> : (
              <div className="sf-actions">
                {step === "contacts" && !editing ? <button type="button" className="sf-skip" onClick={() => go("widgets")}>Skip for now</button> : null}
                {index > 0 || part > 0 ? <button type="button" className="sf-btn" data-kind="ghost" onClick={back}>Back</button> : null}
                <button type="button" className="sf-btn" data-kind="primary" onClick={next} aria-describedby={!canContinue && showErrors ? "sf-why" : undefined}>{editing ? "Save changes" : "Continue"}</button>
                {!canContinue && showErrors ? <p id="sf-why" role="alert">{blockedText}</p> : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
