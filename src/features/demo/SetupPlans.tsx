"use client";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans";
import { useDemo, initialState } from "./store";
import "./setup-plans.css";
import { PlanExperience } from "./PlanExperience";

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
  const content = (
    <div className="setup-plans-content" data-testid="setup-plans">
      <fieldset className="setup-plan-tabs">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => (
          <label
            key={id}
            className="setup-plan-choice"
            data-selected={selected === id}
          >
            <input
              type="radio"
              name="setup-plan"
              aria-label={`Choose ${PLANS[id].name}`}
              checked={selected === id}
              onChange={() =>
                update((st) => ({
                  ...st,
                  setupDrafts: { ...st.setupDrafts, planIntent: id },
                }))
              }
            />
            <span className="setup-plan-name">{PLANS[id].name}</span>
            <span className="setup-plan-price">
              £{(PLANS[id].priceMinorGbp / 100).toFixed(id === "free" ? 0 : 2)}
              <small>/month</small>
            </span>
            {id === suggested && selected !== id ? (
              <span className="setup-plan-badge">Fits you</span>
            ) : null}
          </label>
        ))}
      </fieldset>
      <PlanExperience
        plan={selected}
        industryKey={s.content.identity.industryKey}
        name={s.content.identity.name}
        onChoose={(id) =>
          update((st) => ({
            ...st,
            setupDrafts: { ...st.setupDrafts, planIntent: id },
          }))
        }
      />
      <p className="setup-plan-disclosure">
        Your choice is saved as a preference. No payment or subscription is
        started.
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
