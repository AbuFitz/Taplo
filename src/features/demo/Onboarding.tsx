"use client"

import "./setup-form.css"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { newWidget } from "@/features/page/starter"
import { getDesign, applyDesign, withArrangement } from "@/features/page/themes/designs"
import { applyStartingLook, getStartingLook } from "@/features/page/themes/starting-looks"
import { exampleStart } from "@/features/inspiration/suggest"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import type { WidgetType } from "@/features/page/contracts/widgets"
import { applyIndustry, slugProblems } from "./actions"
import { ONBOARDING_STEPS, initialState, useDemo, type OnboardingStep } from "./store"
import { SetupLook } from "./SetupLook"
import { SetupPlans } from "./SetupPlans"
import { SetupCanvas } from "./SetupCanvas"
import { SetupLoading } from "./SetupLoading"
import { SetupShell, type SheetSnap } from "./SetupShell"
import { ActionStep, FinishStep, NameStep, ServicesStep, TypeStep } from "./SetupSteps"

const STEP_LABEL: Record<OnboardingStep, string> = {
  type: "What you do",
  name: "Name",
  look: "Look",
  action: "First action",
  services: "Services",
  plan: "Plan",
  finish: "Finish",
}
const STEP_TITLE: Record<OnboardingStep, string> = {
  type: "What do you do?",
  name: "What’s it called?",
  look: "Choose a look.",
  action: "What should customers do first?",
  services: "Add your services",
  plan: "Pick a plan.",
  finish: "Your page is ready.",
}
/** Where the live page scrolls to while each step is being filled in. */
const FOCUS: Partial<Record<OnboardingStep, string>> = { name: "header", action: "actions", services: "offer" }
const SKIPPABLE: OnboardingStep[] = ["look", "action", "services"]
const STAGE = "#f4f4f2"

const subscribeMobile = (cb: () => void) => { const q = window.matchMedia("(max-width:1023px)"); q.addEventListener("change", cb); return () => q.removeEventListener("change", cb) }
const mobileSnapshot = () => window.matchMedia("(max-width:1023px)").matches

export function Onboarding() {
  const shell = React.useRef<HTMLElement>(null)
  const router = useRouter()
  const params = useSearchParams()
  const mobile = React.useSyncExternalStore(subscribeMobile, mobileSnapshot, () => false)
  const { ready, state, update, storageFailed } = useDemo()
  const [snap, setSnap] = React.useState<SheetSnap>("default")
  const [keyboard, setKeyboard] = React.useState(false)
  const [showErrors, setShowErrors] = React.useState(false)
  const [actionValid, setActionValid] = React.useState(true)
  const [servicesValid, setServicesValid] = React.useState(true)
  const navigated = React.useRef(false)

  const s = state ?? initialState()
  const step: OnboardingStep = (ONBOARDING_STEPS as readonly string[]).includes(s.step) ? s.step : "type"
  const index = ONBOARDING_STEPS.indexOf(step)

  // The visible screen is what the sheet is sized from: the visual viewport, so an open keyboard never hides the footer.
  React.useEffect(() => {
    const vv = window.visualViewport
    const sync = () => {
      const el = shell.current
      if (!el) return
      const height = vv?.height ?? window.innerHeight
      el.style.setProperty("--sf-vh", `${height}px`)
      el.style.setProperty("--sf-top", `${vv?.offsetTop ?? 0}px`)
      const open = window.innerHeight - height > 180 && Boolean(document.activeElement?.matches("input,textarea,select"))
      setKeyboard(open)
    }
    const later = () => requestAnimationFrame(sync)
    window.scrollTo(0, 0)
    sync()
    vv?.addEventListener("resize", sync); vv?.addEventListener("scroll", sync)
    document.addEventListener("focusin", later); document.addEventListener("focusout", later)
    window.addEventListener("resize", sync)
    return () => { vv?.removeEventListener("resize", sync); vv?.removeEventListener("scroll", sync); document.removeEventListener("focusin", later); document.removeEventListener("focusout", later); window.removeEventListener("resize", sync) }
  }, [])

  // The browser chrome around the screen reads as part of the stage, never a white strip.
  React.useEffect(() => {
    const html = document.documentElement
    const before = { bg: html.style.backgroundColor, body: document.body.style.backgroundColor }
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const created = !meta
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.append(meta) }
    const content = meta.content
    meta.setAttribute("content", STAGE); html.style.backgroundColor = STAGE; document.body.style.backgroundColor = STAGE
    return () => { html.style.backgroundColor = before.bg; document.body.style.backgroundColor = before.body; if (created) meta.remove(); else meta.setAttribute("content", content) }
  }, [])

  const go = React.useCallback((to: OnboardingStep, opts: { push?: boolean } = {}) => {
    setSnap("default"); setShowErrors(false); navigated.current = true
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (opts.push !== false) window.history.pushState({ step: to }, "", `${window.location.pathname}?step=${to}`)
    update((x) => ({ ...x, step: to }))
  }, [update])

  // Each step is a history entry: the browser's Back goes to the step before, with everything entered still there.
  React.useEffect(() => {
    const onPop = () => {
      const to = new URLSearchParams(window.location.search).get("step")
      if (to && (ONBOARDING_STEPS as readonly string[]).includes(to)) go(to as OnboardingStep, { push: false })
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [go])

  React.useEffect(() => {
    if (!navigated.current) return
    shell.current?.querySelector<HTMLElement>("#step-title")?.focus({ preventScroll: true })
  }, [step])

  // A plan chosen on the pricing page carries through setup without taking payment.
  const [intent] = React.useState<PlanId | null>(() => { const p = params.get("plan"); return p && (PLAN_IDS as readonly string[]).includes(p) ? (p as PlanId) : null })
  React.useEffect(() => {
    if (ready && intent) update((x) => (x.setupDrafts?.planIntent === intent ? x : { ...x, setupDrafts: { ...x.setupDrafts, planIntent: intent } }))
  }, [ready, intent]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Start from this" on an inspiration page: its kind of business, look and content types, never its sample content.
  const [from] = React.useState(() => { const slug = params.get("from"); return slug ? exampleStart(slug) : null })
  React.useEffect(() => {
    if (!ready || !from) return
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => {
      const withIndustry = applyIndustry(x, from.industryKey, from.industryLabel)
      return {
        ...withIndustry,
        content: { ...withIndustry.content, booking: { ...withIndustry.content.booking, mode: from.bookingMode } },
        page: { ...withIndustry.page, themeId: from.lookId, appearance: structuredClone(from.overrides), widgets: from.widgets.map((w) => ({ ...newWidget(w.type as WidgetType, w.settings), appearance: structuredClone(w.appearance) })) },
      }
    })
  }, [ready, from]) // eslint-disable-line react-hooks/exhaustive-deps

  // A design chosen in the gallery: setup begins with it on the page.
  const [chosenDesign] = React.useState(() => { const id = params.get("design"); return id ? getDesign(id) ?? null : null })
  const [arr] = React.useState(() => params.get("arr") ?? undefined)
  const [chosenLook] = React.useState(() => getStartingLook(params.get("look") ?? undefined) ?? null)
  React.useEffect(() => {
    if (!ready || !chosenDesign) return
    window.history.replaceState(null, "", window.location.pathname)
    update((x) => ({ ...x, page: withArrangement(chosenLook ? applyStartingLook(x.page, chosenLook, { reorder: true }) : applyDesign(x.page, chosenDesign, { reorder: true }), arr), ...(chosenLook ? { setupDrafts: { ...x.setupDrafts, colourway: chosenLook.id } } : {}) }))
  }, [ready, chosenDesign]) // eslint-disable-line react-hooks/exhaustive-deps

  // A first visit has no saved draft yet; start one so the live page shows a populated sample from the first moment.
  React.useEffect(() => { if (ready && state === null) update((x) => x, { resetHistory: true }) }, [ready, state]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <SetupLoading />

  const c = s.content
  const valid: Record<OnboardingStep, boolean> = {
    type: Boolean(c.identity.industryLabel.trim()),
    name: Boolean(c.identity.name.trim()) && slugProblems(c.identity.slug).length === 0,
    look: true,
    action: actionValid,
    services: servicesValid,
    plan: true,
    finish: true,
  }
  const why: Record<OnboardingStep, string> = {
    type: "Choose what you do.",
    name: "Add your business name and a valid web address.",
    look: "",
    action: "Add the detail for the choice you made, or choose Get in touch.",
    services: "Finish the service name and price, or choose quote or free pricing.",
    plan: "",
    finish: "",
  }
  const next = () => {
    if (step === "plan" && !s.setupDrafts?.planIntent) update((x) => ({ ...x, setupDrafts: { ...x.setupDrafts, planIntent: "free" } }))
    go(ONBOARDING_STEPS[Math.min(index + 1, ONBOARDING_STEPS.length - 1)]!)
  }
  const back = () => { if (index > 0) go(ONBOARDING_STEPS[index - 1]!) }
  const press = () => {
    if (valid[step]) return next()
    setShowErrors(true)
    // Errors are read out once and focus moves to the first field that needs attention.
    requestAnimationFrame(() => shell.current?.querySelector<HTMLElement>("#setup-controls input:not([type=hidden]), #setup-controls [role=radio][aria-checked=true]")?.focus())
  }
  const planName = PLANS[s.setupDrafts?.planIntent ?? "free"].name

  const notice = storageFailed ? (
    <p role="alert" className="sf-notice sf-notice-warn" data-testid="storage-failed">Your browser couldn’t save your latest change (storage is full or blocked). It’s showing here but may be lost if you reload. Remove a large picture to continue safely.</p>
  ) : showErrors && !valid[step] && why[step] ? (
    <p role="alert" className="sf-notice" id="why-disabled">{why[step]}</p>
  ) : null

  const footer = (
    <>
      {index > 0 ? <button type="button" className="sf-back" onClick={back}>Back</button> : <span />}
      {step === "finish" ? null : (
        <>
          {SKIPPABLE.includes(step) ? <button type="button" className="sf-skip" onClick={next}>Skip for now</button> : null}
          <Button className="sf-primary" size="lg" onClick={press} aria-describedby={!valid[step] && showErrors ? "why-disabled" : undefined}>{step === "plan" ? `Continue with ${planName}` : "Continue"}</Button>
        </>
      )}
    </>
  )

  const origin = (chosenDesign || from || intent) ? (
    <p className="sf-origin">
      {chosenDesign ? <span data-testid="from-design">Starting with {chosenDesign.name}</span> : null}
      {from ? <span data-testid="from-example">Starting from {from.name}</span> : null}
      {intent ? <span data-testid="plan-intent">{PLANS[intent].name} plan</span> : null}
    </p>
  ) : null

  return (
    <SetupShell
      ref={shell}
      step={index}
      steps={ONBOARDING_STEPS.length}
      stepLabel={STEP_LABEL[step]}
      title={STEP_TITLE[step]}
      snap={snap}
      onSnap={setSnap}
      mobile={mobile}
      keyboard={keyboard}
      bodyKey={step}
      notice={notice}
      footer={footer}
      preview={
        <div className="sf-canvas">
          <SetupCanvas src="/demo/preview" expanded={false} fit={!mobile || snap === "peek"} focus={FOCUS[step]} onOverlayOpen={() => { if (mobile) setSnap("peek") }} />
        </div>
      }
    >
      {origin}
      {step === "type" ? <TypeStep /> : null}
      {step === "name" ? <NameStep showErrors={showErrors} desktop={!mobile} /> : null}
      {step === "look" ? <SetupLook /> : null}
      {step === "action" ? <ActionStep showErrors={showErrors} onValidity={setActionValid} /> : null}
      {step === "services" ? <ServicesStep onValidity={setServicesValid} /> : null}
      {step === "plan" ? <SetupPlans inline /> : null}
      {step === "finish" ? <FinishStep onStudio={() => router.push("/dashboard")} /> : null}
    </SetupShell>
  )
}
