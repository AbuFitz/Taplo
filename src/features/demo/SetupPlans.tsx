"use client";
import * as React from "react";
import { ArrowRight, Check, Info } from "lucide-react";
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
  const features = (id: (typeof PLAN_IDS)[number]) => PLANS[id].highlights.filter((h) => !/theme/i.test(h));
  const goals = s.setupDrafts?.goals ?? [];
  // A recommendation is explained only by a listed capability that matches something the owner chose; with no match there is none.
  const recommended = goals.includes("book") ? PLAN_IDS.find((id) => PLANS[id].highlights.some((h) => /online bookings/i.test(h))) : undefined;
  const content = (
    <div className="setup-plans-content" data-testid="setup-plans">
      <p className="setup-plan-notice" data-testid="plan-disclosure">
        <Info aria-hidden="true" />
        <span>Prices and plan limits are provisional and may change before launch. Choosing a plan saves a preference only: no payment is taken and nothing is subscribed.</span>
      </p>
      <fieldset className="setup-plan-list">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => {
          const on = selected === id;
          const list = features(id);
          return (
            <label key={id} className="setup-plan-card" data-selected={on}>
              <input type="radio" name="setup-plan" aria-label={`Choose ${PLANS[id].name}`} checked={on} onChange={() => update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, planIntent: id } }))} />
              <span className="setup-plan-radio" aria-hidden="true">{on ? <Check /> : null}</span>
              <span className="setup-plan-main">
                <span className="setup-plan-head">
                  <span className="setup-plan-name">{PLANS[id].name}{id === recommended ? <em>Matches your goals</em> : null}</span>
                  <span className="setup-plan-price">{id === "free" ? "£0" : `£${(PLANS[id].priceMinorGbp / 100).toFixed(2)}`}<small>/month</small></span>
                </span>
                <span className="setup-plan-summary">{PLANS[id].summary}</span>
                {on ? (
                  <ul className="setup-plan-features">{list.map((f) => <li key={f}><Check aria-hidden="true" />{f}</li>)}</ul>
                ) : (
                  <span className="setup-plan-more">{list.length} included</span>
                )}
                {on && id === recommended ? <span className="setup-plan-why">You chose online booking, and this plan lists online bookings.</span> : null}
              </span>
            </label>
          );
        })}
      </fieldset>
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
