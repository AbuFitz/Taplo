"use client";
import * as React from "react";
import { ArrowRight, Check, Info } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import { resolveEntitlements, type Entitlements } from "@/features/subscriptions/entitlements";
import { useDemo, initialState } from "./store";
import "./setup-plans.css";

const DESCRIPTIONS: Record<PlanId, string> = {
  free: "Put your business in reach.",
  core: "Make the page your own.",
  pro: "Turn interest into bookings.",
  business: "Bring your whole team together.",
};

/** What a plan includes, from the entitlement resolver. Each plan after Free lists "Everything in" the one before, then only what it adds. */
const FEATURES: { label: (e: Entitlements) => string | null }[] = [
  { label: (e) => (e.maxServices === null ? "Unlimited services" : `${e.maxServices} services`) },
  { label: (e) => (e.callAndWhatsapp ? "Call and WhatsApp buttons" : null) },
  { label: (e) => (e.testimonials ? "Customer testimonials" : null) },
  { label: (e) => (e.gallery ? "Photo gallery" : null) },
  { label: (e) => (e.socialLinks && e.reviewLinks ? "Social and review links" : null) },
  { label: (e) => (e.analytics ? "Analytics" : null) },
  { label: (e) => (e.removeBranding ? "No Taplo branding" : null) },
  { label: (e) => (e.onlineBooking ? "Online bookings and requests" : null) },
  { label: (e) => (e.maxStaffBookable === null ? "Unlimited staff calendars" : e.maxStaffBookable > 0 ? `Up to ${e.maxStaffBookable} staff calendars` : null) },
  { label: (e) => (e.payments ? "Deposits and payments (needs a payment provider)" : null) },
  { label: (e) => (e.customDomains ? "Custom domain" : null) },
  { label: (e) => (e.multiLocation ? "More than one location" : null) },
  { label: (e) => (e.staffScheduling ? "Staff scheduling" : null) },
  { label: (e) => (e.rolePermissions ? "Team permissions" : null) },
];
export function planFeatures(id: PlanId): string[] {
  const idx = PLAN_IDS.indexOf(id);
  const here = FEATURES.map((f) => f.label(resolveEntitlements(id, "active")));
  const before = idx > 0 ? FEATURES.map((f) => f.label(resolveEntitlements(PLAN_IDS[idx - 1]!, "active"))) : [];
  const added = here.filter((label, i) => label && label !== before[i]) as string[];
  return idx > 0 ? [`Everything in ${PLANS[PLAN_IDS[idx - 1]!].name}`, ...added] : added;
}

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
  // Features come from the same entitlement resolver the pricing page and the editor use, so this list cannot drift from what a plan does.
  const goals = s.setupDrafts?.goals ?? [];
  const recommended = goals.includes("book") ? PLAN_IDS.find((id) => resolveEntitlements(id, "active").onlineBooking) : undefined;
  const content = (
    <div className="setup-plans-content" data-testid="setup-plans">
      <fieldset className="setup-plan-list">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => {
          const on = selected === id;
          const list = planFeatures(id);
          return (
            <label key={id} className="setup-plan-card" data-plan={id} data-selected={on}>
              <input type="radio" name="setup-plan" aria-label={`Choose ${PLANS[id].name}`} checked={on} onChange={() => update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, planIntent: id } }))} />
              <span className="setup-plan-head">
                <span className="setup-plan-name">{PLANS[id].name}{id === recommended ? <em>Matches your goals</em> : null}</span>
                <span className="setup-plan-price">{id === "free" ? "£0" : `£${(PLANS[id].priceMinorGbp / 100).toFixed(2)}`}<small>/month</small></span>
              </span>
              <span className="setup-plan-line">{DESCRIPTIONS[id]}</span>
              {on ? (
                <span className="setup-plan-open">
                  <ul className="setup-plan-features">{list.map((f) => <li key={f}><Check aria-hidden="true" />{f}</li>)}</ul>
                  {id === recommended ? <span className="setup-plan-why">You chose online booking, and this plan includes online bookings.</span> : null}
                </span>
              ) : null}
              <span className="setup-plan-state" aria-hidden="true">{on ? <><Check /> Selected</> : "Choose"}</span>
            </label>
          );
        })}
      </fieldset>
      <p className="setup-plan-notice" data-testid="plan-disclosure">
        <Info aria-hidden="true" />
        <span>Prices and plan limits are provisional and may change before launch. Choosing a plan saves a preference only: no payment is taken and nothing is subscribed.</span>
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
