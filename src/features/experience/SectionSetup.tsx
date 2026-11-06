"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, BookOpen, ChevronRight } from "lucide-react";
import { useDemo } from "@/features/demo/store";
import { Overlay } from "@/components/taplo/overlay";
import { journeyFor, type JourneyId } from "./journeys";
import { useJourneyPreference } from "./preferences";

export function SectionSetup({
  topic,
  compact = false,
  launcher,
  defaultOpen = false,
}: {
  topic: JourneyId;
  compact?: boolean;
  launcher?: string;
  defaultOpen?: boolean;
}) {
  const { state } = useDemo();
  const [, setPreference] = useJourneyPreference(
    state?.content.identity.slug || "new",
    topic,
  );
  const [open, setOpen] = React.useState(defaultOpen);
  const [chosen, setChosen] = React.useState<string | null>(null);
  if (!state) return null;
  const journey = journeyFor(topic, state);
  const completed = journey.steps.filter((step) => step.done).length;
  const step =
    journey.steps.find((item) => item.id === chosen) ??
    journey.steps.find((item) => !item.done && !item.blocked) ??
    journey.steps[0]!;
  return (
    <section
      className="ts-guide-launcher section-setup"
      data-compact={compact}
      data-topic={topic}
    >
      <button
        type="button"
        className={compact ? "ts-guide-button" : "ts-guide-card"}
        onClick={() => setOpen(true)}
      >
        <BookOpen aria-hidden="true" />
        {compact ? (
          <span>{launcher || "Quick guide"}</span>
        ) : (
          <>
            <span>
              <strong>{launcher || journey.title}</strong>
              <small>{journey.intro}</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </>
        )}
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title={journey.title}
        description={journey.intro}
        kind="detail"
        className="ts-guide-dialog"
        footer={
          <div className="ts-guide-footer">
            <button
              type="button"
              onClick={() => {
                setPreference("later");
                setOpen(false);
              }}
            >
              Close guide
            </button>
            <Link
              href={
                step.blocked ? "/dashboard/settings?section=plan" : step.href
              }
              onClick={() => setOpen(false)}
            >
              {step.blocked
                ? "Review your plan"
                : step.done
                  ? "Review this step"
                  : step.action}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        }
      >
        <div className="ts-guide-progress">
          <span>
            {completed} of {journey.steps.length} ready
          </span>
          <div>
            <i
              style={{ width: `${(completed / journey.steps.length) * 100}%` }}
            />
          </div>
        </div>
        <ol className="ts-guide-steps">
          {journey.steps.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={item.id === step.id}
                onClick={() => setChosen(item.id)}
              >
                <span>
                  {item.done ? (
                    <Check aria-hidden="true" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <strong>{item.title}</strong>
                <ChevronRight aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <article className="ts-guide-detail">
          <span className="ts-overline">
            {step.done ? "READY TO REVIEW" : "YOUR NEXT STEP"}
          </span>
          <h3>{step.title}</h3>
          <p>{step.detail}</p>
          {step.blocked ? (
            <p className="ts-guide-blocked">{step.blocked}</p>
          ) : null}
          <div className="ts-guide-outcome">
            <Check aria-hidden="true" />
            <span>{journey.outcome}</span>
          </div>
        </article>
      </Overlay>
    </section>
  );
}
export function GettingStarted() {
  const { state } = useDemo();
  if (!state) return null;
  const topics: JourneyId[] = [
    "page",
    state.setupDrafts?.goals?.includes("book") ? "bookings" : "services",
    "sharing",
  ];
  return (
    <section className="ts-getting-started">
      <h2>Pick up where you left off.</h2>
      <div>
        {topics.map((topic) => (
          <SectionSetup key={topic} topic={topic} />
        ))}
      </div>
    </section>
  );
}
