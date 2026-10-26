"use client"
import * as React from "react"
import { Check, Sparkles } from "lucide-react"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { setupJourney } from "@/features/demo/setup-journey"
import { useSetup } from "../context"
import { goalOf } from "../goal"
import { planAdvice } from "../recommend"

/** What each plan adds to a page, in the words of the person choosing it. The summary line is shown for every plan; the rest opens on the one in view. */
export const PLAN_FOCUS: Record<PlanId, { focus: string; caption: string }> = {
  free: { focus: "actions", caption: "Call and WhatsApp buttons on a clean page" },
  core: { focus: "gallery", caption: "A gallery, your own look and your socials" },
  pro: { focus: "booking", caption: "Customers pick a time and ask to book" },
  business: { focus: "team", caption: "Your whole team, each with their own calendar" },
}
const ENOUGH: Record<PlanId, string> = {
  free: "A professional page with call and WhatsApp.",
  core: "Look established and be found.",
  pro: "Take bookings and payments online.",
  business: "Run a team across places.",
}

export function PlanStep() {
  const { s, update } = useSetup()
  const selected: PlanId = s.setupDrafts?.planIntent ?? "free"
  const j = setupJourney(s.content.identity.industryKey)
  const advice = planAdvice({ industryKey: s.content.identity.industryKey, goal: goalOf(s), staff: s.content.staff?.length ?? 0, hasGallery: (s.content.gallery?.length ?? 0) > 0, kind: j.kind })
  const choose = (id: PlanId) => update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, planIntent: id } }))
  const price = (id: PlanId) => (PLANS[id].priceMinorGbp === 0 ? "£0" : `£${(PLANS[id].priceMinorGbp / 100).toFixed(2)}`)
  return (
    <div className="sf-stack" data-testid="setup-plans">
      <aside className="sf-advice" aria-label="Our suggestion">
        <Sparkles aria-hidden="true" />
        <div>
          <p className="sf-advice-title">We suggest <b>{PLANS[advice.plan].name}</b> for you</p>
          <ul>{advice.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          {selected !== advice.plan ? <button type="button" className="sf-link" onClick={() => choose(advice.plan)}>Choose {PLANS[advice.plan].name}</button> : null}
        </div>
      </aside>
      <fieldset className="sf-plans">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => {
          const on = selected === id
          return (
            <label key={id} className="sf-plan setup-plan-choice" data-selected={on}>
              <input type="radio" name="setup-plan" aria-label={`Choose ${PLANS[id].name}`} checked={on} onChange={() => choose(id)} />
              <span className="sf-plan-head">
                <span className="sf-plan-radio" aria-hidden="true">{on ? <Check /> : null}</span>
                <span className="sf-plan-name">{PLANS[id].name}</span>
                {id === advice.plan ? <span className="sf-tag">Fits you</span> : null}
                <span className="sf-plan-price">{price(id)}<small>/month</small></span>
              </span>
              <span className="sf-plan-line">{ENOUGH[id]}</span>
              {on ? (
                <span className="sf-plan-more">
                  <span className="sf-plan-list">{PLANS[id].highlights.map((h) => <span key={h}><Check aria-hidden="true" />{h}</span>)}</span>
                </span>
              ) : null}
            </label>
          )
        })}
      </fieldset>
      <p className="sf-hint">Your choice is saved as a preference. No payment or subscription is started.</p>
    </div>
  )
}
