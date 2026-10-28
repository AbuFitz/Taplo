"use client";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans";
import { useDemo, initialState } from "./store";
import "./setup-plans.css";

/** A preference, never a paid activation. Definitions and prices stay in the locked plan model. */
export function SetupPlans({ inline = false }: { inline?: boolean }) {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [open, setOpen] = React.useState(false);
  const selected = s.setupDrafts?.planIntent ?? "free";
  const suggested =
    (s.content.staff?.length ?? 0) > 1
      ? "business"
      : s.content.booking?.mode !== "contact"
        ? "pro"
        : "core";
  // Prices, limits and any industry-based theme limits have not been approved, so they are shown as provisional and the theme limits are not shown at all.
  const features = (id: (typeof PLAN_IDS)[number]) => PLANS[id].highlights.filter((h) => !/theme/i.test(h)).slice(0, 5);
  const content = (
    <div className="setup-plans-content" data-testid="setup-plans">
      <fieldset className="setup-plan-list">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => (
          <label key={id} className="setup-plan-card" data-selected={selected === id}>
            <input
              type="radio"
              name="setup-plan"
              aria-label={`Choose ${PLANS[id].name}`}
              checked={selected === id}
              onChange={() => update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, planIntent: id } }))}
            />
            <span className="setup-plan-head">
              <span className="setup-plan-name">{PLANS[id].name}</span>
              <span className="setup-plan-price">
                {id === "free" ? "£0" : `£${(PLANS[id].priceMinorGbp / 100).toFixed(2)}`}
                <small>/month</small>
              </span>
            </span>
            <span className="setup-plan-summary">{PLANS[id].summary}</span>
            <ul className="setup-plan-features">{features(id).map((f) => <li key={f}>{f}</li>)}</ul>
            {id === suggested && selected !== id ? <span className="setup-plan-badge">Fits you</span> : null}
          </label>
        ))}
      </fieldset>
      <p className="setup-plan-disclosure" data-testid="plan-disclosure">
        Prices and plan limits are provisional and may change before launch. Choosing a plan saves a preference only: no payment is taken and nothing is subscribed.
      </p>
    </div>
  );
  return inline ? (
    content
  ) : (
    <>
      <button
        className="setup-edit-row"
        type="button"
        onClick={() => setOpen(true)}
      >
        {PLANS[selected].name} plan
        <ArrowRight size={18} className="ml-auto" aria-hidden="true" />
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Choose your plan"
        footer={
          <Button className="w-full" onClick={() => setOpen(false)}>
            Continue with {PLANS[selected].name}
          </Button>
        }
      >
        {content}
      </Overlay>
    </>
  );
}
