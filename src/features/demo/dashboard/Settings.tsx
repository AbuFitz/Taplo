"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/features/services/format";
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import { resolveEntitlements } from "@/features/subscriptions/entitlements";
import { useDemo } from "../store";
import { PageHeader, Panel } from "./Panel";

const ENT_LABEL: [keyof ReturnType<typeof resolveEntitlements>, string][] = [
  ["themeSwitching", "Layout and colour choices"],
  ["gallery", "Gallery"],
  ["socialLinks", "Social links"],
  ["reviewLinks", "Review links"],
  ["analytics", "Analytics"],
  ["removeBranding", "Taplo branding removed"],
  ["onlineBooking", "Online bookings"],
  ["payments", "Deposits and payments"],
  ["teamPages", "Team pages"],
  ["multiStaff", "Multiple staff"],
  ["customDomains", "Custom domains"],
];

export function Settings() {
  const { state, update, reset } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("section");
  const [chosenSection, setSection] = React.useState<
    "plan" | "connections" | "data" | null
  >(null);
  const section =
    requested === "connections" || requested === "data" || requested === "plan"
      ? requested
      : (chosenSection ?? "plan");
  const [confirm, setConfirm] = React.useState(false);
  const plan = state?.plan ?? "business";
  const ent = resolveEntitlements(plan, "active");
  return (
    <>
      <PageHeader
        scene="settings"
        title="Settings"
        description="Your plan, connections and workspace data."
      />
      <div className="ws-settings">
        <nav className="ws-settings-nav" aria-label="Settings sections">
          {(
            [
              ["plan", "Plan & features"],
              ["connections", "Connections"],
              ["data", "Workspace data"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={section === id}
              onClick={() => {
                setSection(id);
                router.replace("/dashboard/settings", { scroll: false });
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="ws-settings-body">
          {section === "connections" ? (
            <Panel
              title="Connections"
              description="Connect the services your business uses."
            >
              <div className="ws-connection-list">
                {[
                  {
                    name: "Payments",
                    line: "Take deposits and payments",
                    detail:
                      "Set up your payment account to accept deposits and payments.",
                  },
                  {
                    name: "Appointment emails",
                    line: "Confirmations and booking updates",
                    detail:
                      "Choose the sender customers see on appointment confirmations and updates.",
                  },
                  {
                    name: "Custom domain",
                    line: "Use your own web address",
                    detail:
                      "Connect a domain you own and verify it to use it with your page.",
                  },
                ].map((item) => (
                  <details key={item.name}>
                    <summary>
                      <span>
                        <b>{item.name}</b>
                        <small>{item.line}</small>
                      </span>
                      <em>Not connected</em>
                    </summary>
                    <p>{item.detail}</p>
                  </details>
                ))}
              </div>
            </Panel>
          ) : null}
          {section === "plan" ? (
            <Panel
              title="Plan"
              description="Compare your plan and the features included."
            >
              <div
                className="ws-plan-options"
                role="group"
                aria-label="Choose a plan"
              >
                {PLAN_IDS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={plan === p}
                    onClick={() =>
                      update((x) => ({
                        ...x,
                        plan: p as PlanId,
                        setupDrafts: {
                          ...x.setupDrafts,
                          planIntent: p as PlanId,
                        },
                      }))
                    }
                  >
                    <b>{PLANS[p].name}</b>
                    <span>
                      {PLANS[p].priceMinorGbp
                        ? `${formatMoney(PLANS[p].priceMinorGbp)}/month`
                        : "Free"}
                    </span>
                  </button>
                ))}
              </div>
              <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
                <li>
                  {ent.maxServices === null
                    ? "✓ Unlimited services"
                    : `• Up to ${ent.maxServices} services shown`}
                </li>
                {ENT_LABEL.map(([k, label]) => (
                  <li key={k}>
                    {ent[k] ? "✓" : "✕"} {label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Downgrading never deletes your content; restricted items are
                hidden and can be restored by upgrading.
              </p>
            </Panel>
          ) : null}
          {section === "data" ? (
            <Panel
              title="Workspace data"
              description="Manage your workspace content."
            >
              {confirm ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">
                    Reset this workspace and remove its content?
                  </span>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      reset();
                      router.push("/dashboard");
                    }}
                  >
                    Yes, reset
                  </Button>
                  <Button variant="outline" onClick={() => setConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setConfirm(true)}>
                  Reset workspace
                </Button>
              )}
            </Panel>
          ) : null}
        </div>
      </div>
    </>
  );
}
