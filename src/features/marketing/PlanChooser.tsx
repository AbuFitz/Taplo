"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import "./pricing-story.css";
import { ArrowRight, Check } from "lucide-react";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import { formatMoney } from "@/features/services/format";
import { PlanIllustration } from "./PlanIllustration";

const DESCRIPTIONS: Record<PlanId, string> = {
  free: "Put your business in reach.",
  core: "Make the page your own.",
  pro: "Turn interest into bookings.",
  business: "Bring your whole team together.",
};
const HIGHLIGHTS: Record<PlanId, string[]> = {
  free: [
    "Your business profile",
    "Three services",
    "Call and WhatsApp",
    "A starting look for your category",
  ],
  core: [
    "Unlimited services and a gallery",
    "More starting looks",
    "Social and review links",
    "Analytics and no Taplo branding",
  ],
  pro: [
    "Everything in Core",
    "Online bookings and requests",
    "Up to three staff calendars",
    "Deposits, payments and a custom domain",
  ],
  business: [
    "Everything in Pro",
    "Unlimited staff calendars",
    "Multiple locations",
    "Staff scheduling and permissions",
  ],
};
export function PlanChooser({
  demo,
  selected,
  select,
}: {
  demo: boolean;
  selected: PlanId;
  select: (id: PlanId) => void;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const requested = useRef<PlanId | null>(null);
  // A resize reflows the rail and moves its scroll position; those scrolls are layout, not the visitor choosing another plan.
  const settlingUntil = useRef(0);
  const fromScroll = useRef<PlanId | null>(null);
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    if (fromScroll.current === selected) {
      fromScroll.current = null;
      return;
    }
    const el = rail.current;
    if (!el || !window.matchMedia("(max-width:767px)").matches) return;
    const card = el.querySelector<HTMLElement>(`[data-plan="${selected}"]`);
    if (!card) return;
    requested.current = selected;
    el.scrollTo({
      left: card.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [selected]);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const query = window.matchMedia("(max-width:767px)");
    const align = () => {
      requested.current = null;
      settlingUntil.current = performance.now() + 400;
      if (!query.matches) return;
      const card = el.querySelector<HTMLElement>(
        `[data-plan="${selectedRef.current}"]`,
      );
      if (card) el.scrollTo({ left: card.offsetLeft, behavior: "instant" });
    };
    query.addEventListener("change", align);
    const observer = new ResizeObserver(align);
    observer.observe(el);
    return () => {
      query.removeEventListener("change", align);
      observer.disconnect();
    };
  }, []);
  return (
    <div data-testid="plan-chooser">
      <div
        className="pricing-mobile-choices"
        role="group"
        aria-label="Choose a plan"
      >
        {PLAN_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => select(id)}
          >
            {PLANS[id].name}
          </button>
        ))}
      </div>
      <ul
        ref={rail}
        className="pricing-plans"
        aria-label="Plan options"
        onPointerDown={() => {
          requested.current = null;
        }}
        onWheel={() => {
          requested.current = null;
        }}
        onScroll={() => {
          const el = rail.current;
          if (!el || !window.matchMedia("(max-width:767px)").matches) return;
          if (performance.now() < settlingUntil.current) return;
          const cards = Array.from(
            el.querySelectorAll<HTMLElement>("[data-plan]"),
          );
          const nearest = cards.reduce((a, b) =>
            Math.abs(a.offsetLeft - el.scrollLeft) <
            Math.abs(b.offsetLeft - el.scrollLeft)
              ? a
              : b,
          );
          const id = nearest.dataset.plan as PlanId;
          if (requested.current !== null) {
            if (
              id === requested.current &&
              Math.abs(nearest.offsetLeft - el.scrollLeft) < 3
            )
              requested.current = null;
            else return;
          }
          if (id !== selectedRef.current) {
            fromScroll.current = id;
            selectedRef.current = id;
            select(id);
          }
        }}
      >
        {PLAN_IDS.map((id) => (
          <li
            key={id}
            data-plan={id}
            data-selected={selected === id}
            aria-label={`${PLANS[id].name} plan`}
          >
            <div className="pricing-plan-heading">
              <h2>{PLANS[id].name}</h2>
              {id === "pro" ? (
                <span>For bookings</span>
              ) : id === "business" ? (
                <span>For teams</span>
              ) : null}
            </div>
            <p className="pricing-price">
              {formatMoney(PLANS[id].priceMinorGbp)}
              <span>/month</span>
            </p>
            <p className="pricing-summary">{DESCRIPTIONS[id]}</p>
            {id !== "free" && <PlanIllustration plan={id} />}
            <ul className="pricing-highlights">
              {HIGHLIGHTS[id].map((h) => (
                <li key={h}>
                  <Check size={15} aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
            <Link
              data-brand-action
              href={demo ? `/onboarding?plan=${id}` : "/how-it-works"}
              className="pricing-start"
            >
              {id === "free" ? "Start free" : `Start with ${PLANS[id].name}`}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
