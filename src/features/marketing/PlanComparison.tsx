"use client";
import * as React from "react";
import { Check, Minus } from "lucide-react";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
export interface ComparisonRow {
  group?: string;
  label: string;
  note?: string;
  values: Record<PlanId, string | boolean>;
}
function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <>
        <Check aria-hidden="true" className="mx-auto size-5 text-foreground" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus
          aria-hidden="true"
          className="mx-auto size-5 text-foreground/65"
        />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="font-semibold tabular-nums">{value}</span>;
}
/** The server supplies values from the entitlement resolver. Mobile changes the view, never the plan rules. */
export function PlanComparison({
  rows,
  selectedPlan,
  onPlanChange,
}: {
  rows: ComparisonRow[];
  selectedPlan?: PlanId;
  onPlanChange?: (id: PlanId) => void;
}) {
  const [ownSelected, setOwnSelected] = React.useState<PlanId>("free"),
    uid = React.useId();
  const selected = selectedPlan ?? ownSelected;
  const setSelected = onPlanChange ?? setOwnSelected;
  const groups = rows.reduce<{ name: string; rows: ComparisonRow[] }[]>(
    (all, row) => {
      if (row.group || !all.length)
        all.push({ name: row.group ?? "Features", rows: [] });
      all[all.length - 1].rows.push(row);
      return all;
    },
    [],
  );
  return (
    <div className="pricing-comparison">
      <fieldset className="pricing-compare-choices">
        <legend>Compare a plan</legend>
        <div>
          {PLAN_IDS.map((id) => (
            <label key={id}>
              <input
                type="radio"
                name={`comparison-${uid}`}
                value={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
              />
              <span>{PLANS[id].name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="pricing-comparison-table">
        <table data-testid="plan-table">
          <caption className="sr-only">Plan comparison</caption>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {PLAN_IDS.map((id) => (
                <th
                  key={id}
                  scope="col"
                  data-plan={id}
                  data-selected={id === selected}
                >
                  {PLANS[id].name}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.name}>
              <tr className="pricing-comparison-group">
                <th scope="rowgroup" colSpan={5}>
                  {group.name}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    {row.label}
                    {row.note && <span>{row.note}</span>}
                  </th>
                  {PLAN_IDS.map((id) => (
                    <td key={id} data-plan={id} data-selected={id === selected}>
                      <Cell value={row.values[id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
