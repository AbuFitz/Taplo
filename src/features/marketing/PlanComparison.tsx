"use client";
import * as React from "react";
import { Check, Minus } from "lucide-react";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import { cn } from "@/lib/utils";
export interface ComparisonRow {
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
export function PlanComparison({ rows }: { rows: ComparisonRow[] }) {
  const [selected, setSelected] = React.useState<PlanId>("free"),
    uid = React.useId();
  const column = (id: PlanId) =>
    cn("p-4 text-center", id !== selected && "hidden sm:table-cell");
  return (
    <div>
      <fieldset className="mb-6 sm:hidden">
        <legend className="mb-3 text-sm font-semibold">Compare a plan</legend>
        <div className="grid grid-cols-4 gap-2">
          {PLAN_IDS.map((id) => (
            <label key={id} className="cursor-pointer">
              <input
                type="radio"
                name={`comparison-${uid}`}
                value={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-full border-2 px-1 text-sm font-semibold peer-focus-visible:ring-3 peer-focus-visible:ring-signal/50 peer-focus-visible:ring-offset-2",
                  selected === id
                    ? "border-[#142d3e] bg-[#142d3e] text-white"
                    : "border-[#142d3e]/25 bg-white text-[#142d3e]",
                )}
              >
                {PLANS[id].name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="relative overflow-x-auto rounded-2xl border border-foreground/15 bg-white">
        <table
          className="w-full border-collapse text-left text-sm sm:min-w-[40rem]"
          data-testid="plan-table"
        >
          <caption className="sr-only">Plan comparison</caption>
          <thead>
            <tr className="border-b border-foreground/15 bg-[#e8eccc]/50">
              <th scope="col" className="p-4 font-semibold">
                Feature
              </th>
              {PLAN_IDS.map((id) => (
                <th
                  key={id}
                  scope="col"
                  className={cn(column(id), "w-24 font-semibold sm:w-28")}
                >
                  {PLANS[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-foreground/10 last:border-0"
              >
                <th scope="row" className="p-4 font-medium">
                  {row.label}
                  {row.note && (
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-foreground/65">
                      {row.note}
                    </span>
                  )}
                </th>
                {PLAN_IDS.map((id) => (
                  <td key={id} className={column(id)}>
                    <Cell value={row.values[id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
