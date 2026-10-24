"use client";
import { useState } from "react";
import type { PlanId } from "@/features/subscriptions/plans";
import { PlanChooser } from "./PlanChooser";
import { PlanComparison, type ComparisonRow } from "./PlanComparison";
/** One selected plan continues from the recommendation into the detailed phone comparison. */
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
      <h2 className="font-display mt-20 text-[clamp(1.75rem,4vw,3rem)] font-medium tracking-tight">
        What each plan includes
      </h2>
      <div className="mt-8">
        <PlanComparison
          rows={rows}
          selectedPlan={selected}
          onPlanChange={select}
        />
      </div>
    </>
  );
}
