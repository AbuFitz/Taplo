"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import { formatMoney } from "@/features/services/format";
const PURPOSES = [
  { label: "A business profile", plan: "core" },
  { label: "Appointments", plan: "pro" },
  { label: "A team or locations", plan: "business" },
] as const;
export function PlanChooser({
  demo,
  selected,
  select,
}: {
  demo: boolean;
  selected: PlanId;
  select: (id: PlanId) => void;
}) {
  return (
    <div data-testid="plan-chooser">
      <div className="pricing-intent">
        <p className="text-sm font-semibold">What do you need next?</p>
        <div
          role="group"
          aria-label="Find a suitable plan"
          className="mt-3 flex flex-wrap gap-2"
        >
          {PURPOSES.map((p) => (
            <button
              key={p.plan}
              type="button"
              aria-pressed={selected === p.plan}
              onClick={() => select(p.plan)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
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
      <ul className="pricing-plans">
        {PLAN_IDS.map((id) => (
          <li key={id} data-plan={id} data-selected={selected === id}>
            <div>
              <h2>{PLANS[id].name}</h2>
              <p className="pricing-price">
                {id === "free" ? "£0" : formatMoney(PLANS[id].priceMinorGbp)}
                <span>/month</span>
              </p>
              <p className="pricing-summary">{PLANS[id].summary}</p>
              {id === "pro" || id === "business" ? (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Payments and email delivery need their services connected.
                </p>
              ) : null}
            </div>
            <ul className="pricing-highlights">
              {PLANS[id].highlights.slice(0, 4).map((h) => (
                <li key={h}>
                  <Check aria-hidden="true" size={15} />
                  {h}
                </li>
              ))}
            </ul>
            <Link
              data-brand-action href={demo ? `/onboarding?plan=${id}` : "/how-it-works"}
              className="pricing-start"
            >
              {id === "free" ? "Start free" : `Start with ${PLANS[id].name}`}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600">
        Your selection helps you compare. It does not activate a subscription or
        collect payment. You can explore the full preview before choosing.
      </p>
    </div>
  );
}
