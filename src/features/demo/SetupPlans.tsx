"use client";
import * as React from "react";
import {
  ArrowRight,
  Check,
  Info,
  CalendarDays,
  Users,
  Palette,
  Store,
} from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import {
  resolveEntitlements,
  type Entitlements,
} from "@/features/subscriptions/entitlements";
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
  {
    label: (e) =>
      e.maxServices === null
        ? "Unlimited services"
        : `${e.maxServices} services`,
  },
  { label: (e) => (e.callAndWhatsapp ? "Call and WhatsApp buttons" : null) },
  { label: (e) => (e.testimonials ? "Customer testimonials" : null) },
  { label: (e) => (e.gallery ? "Photo gallery" : null) },
  {
    label: (e) =>
      e.socialLinks && e.reviewLinks ? "Social and review links" : null,
  },
  { label: (e) => (e.analytics ? "Analytics" : null) },
  { label: (e) => (e.removeBranding ? "No Taplo branding" : null) },
  { label: (e) => (e.onlineBooking ? "Online bookings and requests" : null) },
  {
    label: (e) =>
      e.maxStaffBookable === null
        ? "Unlimited staff calendars"
        : e.maxStaffBookable > 0
          ? `Up to ${e.maxStaffBookable} staff calendars`
          : null,
  },
  {
    label: (e) =>
      e.payments ? "Deposits and payments (needs a payment provider)" : null,
  },
  { label: (e) => (e.customDomains ? "Custom domain" : null) },
  { label: (e) => (e.multiLocation ? "More than one location" : null) },
  { label: (e) => (e.staffScheduling ? "Staff scheduling" : null) },
  { label: (e) => (e.rolePermissions ? "Team permissions" : null) },
];
export function planFeatures(id: PlanId): string[] {
  const idx = PLAN_IDS.indexOf(id);
  const here = FEATURES.map((f) => f.label(resolveEntitlements(id, "active")));
  const before =
    idx > 0
      ? FEATURES.map((f) =>
          f.label(resolveEntitlements(PLAN_IDS[idx - 1]!, "active")),
        )
      : [];
  const added = here.filter(
    (label, i) => label && label !== before[i],
  ) as string[];
  return idx > 0
    ? [`Everything in ${PLANS[PLAN_IDS[idx - 1]!].name}`, ...added]
    : added;
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
  const price = (id: PlanId) =>
    id === "free" ? "£0" : `£${(PLANS[id].priceMinorGbp / 100).toFixed(2)}`;
  const ArtIcon = {
    free: Store,
    core: Palette,
    pro: CalendarDays,
    business: Users,
  }[selected];
  const content = (
    <div className="plan-experience" data-testid="setup-plans">
      <fieldset className="plan-choice-strip" data-testid="plan-card">
        <legend className="sr-only">Choose a plan preference</legend>
        {PLAN_IDS.map((id) => (
          <label key={id} data-selected={selected === id}>
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
            <strong>{PLANS[id].name}</strong>
            <span>{price(id)}</span>
          </label>
        ))}
      </fieldset>
      <section
        className="plan-feature-scene"
        data-plan={selected}
        aria-labelledby="plan-title"
      >
        <div className="plan-scene-art" aria-hidden="true">
          <span className="plan-art-orbit" />
          <div className="plan-art-page">
            <span className="plan-art-avatar">
              {(s.content.identity.name || "T").slice(0, 1)}
            </span>
            <b>{s.content.identity.name || "Your business"}</b>
            <i />
            <span className="plan-art-action">
              {selected === "pro" ? "Book a visit" : "Get in touch"}
            </span>
            <div className="plan-art-content">
              {selected === "core" ? (
                <>
                  <span className="plan-mini-look" />
                  <span className="plan-mini-look" />
                  <span className="plan-mini-look" />
                </>
              ) : selected === "business" ? (
                <>
                  <span className="plan-mini-person">A</span>
                  <span className="plan-mini-person">B</span>
                  <span className="plan-mini-person">C</span>
                </>
              ) : selected === "pro" ? (
                <span className="plan-mini-calendar">
                  {Array.from({ length: 14 }, (_, i) => (
                    <i key={i} data-picked={i === 9}>
                      {i + 1}
                    </i>
                  ))}
                </span>
              ) : (
                <>
                  <span className="plan-mini-line" />
                  <span className="plan-mini-line" />
                </>
              )}
            </div>
          </div>
          <span className="plan-art-float">
            <ArtIcon />
          </span>
        </div>
        <div className="plan-scene-copy">
          <div>
            <h2 id="plan-title">{PLANS[selected].name}</h2>
            {selected === suggested ? (
              <span className="plan-fit-label">Fits your setup</span>
            ) : null}
          </div>
          <p className="plan-scene-price">
            {price(selected)}
            <span>{selected === "free" ? "to get started" : "/ month"}</span>
          </p>
          <p>{DESCRIPTIONS[selected]}</p>
        </div>
      </section>
      <ul className="plan-value-list">
        {planFeatures(selected)
          .slice(0, 4)
          .map((f) => (
            <li key={f}>
              <Check aria-hidden="true" />
              {f}
            </li>
          ))}
      </ul>
      <details className="plan-full-compare">
        <summary>See everything in {PLANS[selected].name}</summary>
        <ul>
          {planFeatures(selected).map((f) => (
            <li key={f}>
              <Check aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </details>
      <p className="plan-choice-notice" data-testid="plan-disclosure">
        <Info aria-hidden="true" />
        <span>
          Prices are provisional. This saves your preference; you won’t be
          charged.
        </span>
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
