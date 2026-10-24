"use client";
import * as React from "react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans";
import { useDemo, initialState } from "./store";
export function SetupPlans() {
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
  return (
    <>
      <div className="rounded-2xl bg-neutral-100 p-4 text-sm">
        <p className="font-semibold">
          {s.setupDrafts?.planIntent
            ? `Plan preference: ${PLANS[selected].name}`
            : "Start free. Add more when you need it."}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {suggested === "pro"
            ? "Planning to take bookings? Compare Pro with the other plans."
            : "Compare the features that fit the page you’re building."}
        </p>
        <button
          type="button"
          className="mt-2 min-h-11 font-semibold underline underline-offset-4"
          onClick={() => setOpen(true)}
        >
          Find a plan
        </button>
      </div>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Choose what fits"
        description="Compare plans without limiting this preview. Your selection is saved for later."
        testId="setup-plans"
        footer={
          <Button className="min-h-11 w-full" onClick={() => setOpen(false)}>
            Continue with {PLANS[selected].name}
          </Button>
        }
      >
        <div className="grid gap-3">
          {PLAN_IDS.map((id) => (
            <button
              type="button"
              key={id}
              aria-pressed={selected === id}
              className="rounded-2xl bg-neutral-50 p-4 text-left outline-none ring-offset-2 focus-visible:ring-2 aria-pressed:ring-2 aria-pressed:ring-black"
              onClick={() =>
                update((st) => ({
                  ...st,
                  setupDrafts: { ...st.setupDrafts, planIntent: id },
                }))
              }
            >
              <span className="flex items-baseline justify-between gap-3">
                <strong>{PLANS[id].name}</strong>
                <span className="text-sm">
                  £
                  {(PLANS[id].priceMinorGbp / 100).toFixed(
                    id === "free" ? 0 : 2,
                  )}
                  /month
                </span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                {id === "free"
                  ? "Three services, call and WhatsApp."
                  : PLANS[id].highlights.slice(0, 3).join(" · ")}
              </span>
              {id === suggested ? (
                <span className="mt-2 block text-xs font-semibold">
                  Worth considering for this setup
                </span>
              ) : null}
            </button>
          ))}
          <p className="text-xs leading-relaxed text-muted-foreground">
            No card is collected here. This preview keeps all features
            available; your choice does not activate or charge a subscription.
            Live billing, payment processing and email delivery are not
            connected.
          </p>
        </div>
      </Overlay>
    </>
  );
}
