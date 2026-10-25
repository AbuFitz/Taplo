"use client";
import { useState } from "react";
import type { PlanId } from "@/features/subscriptions/plans";
import { PlanChooser } from "./PlanChooser";
import { PlanComparison, type ComparisonRow } from "./PlanComparison";
/** One selected plan stays consistent between the cards and detailed phone comparison. */
export function PricingExperience({
  demo,
  rows,
}: {
  demo: boolean;
  rows: ComparisonRow[];
}) {
  const [selected, select] = useState<PlanId>("free");
  return (
    <>
      <PlanChooser demo={demo} selected={selected} select={select} />
      <section
        className="pricing-comparison-section"
        aria-labelledby="pricing-comparison-title"
      >
        <h2 id="pricing-comparison-title">The details, side by side.</h2>
        <PlanComparison
          rows={rows}
          selectedPlan={selected}
          onPlanChange={select}
        />
      </section>
    </>
  );
}
