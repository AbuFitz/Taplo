"use client";
import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleHelp,
  X,
  LockKeyhole,
  ChevronDown,
} from "lucide-react";
import { useDemo } from "@/features/demo/store";
import { Overlay } from "@/components/taplo/overlay";
import { journeyFor, type JourneyId } from "./journeys";
import { useJourneyPreference } from "./preferences";
import { GuideFilm } from "./GuideFilm";
import "./journeys.css";

export function SectionSetup({
  topic,
  compact = false,
  launcher,
}: {
  topic: JourneyId;
  compact?: boolean;
  launcher?: string;
}) {
  const { state } = useDemo();
  const [preference, setPreference] = useJourneyPreference(
    state?.content.identity.slug || "new",
    topic,
  );
  const [open, setOpen] = React.useState(false);
  const journey = React.useMemo(
    () => (state ? journeyFor(topic, state) : null),
    [state, topic],
  );
  if (!state || !journey) return null;
  const done = journey.steps.filter((s) => s.done).length;
  const next =
    journey.steps.find((s) => !s.done && !s.blocked) ??
    journey.steps.find((s) => !s.done) ??
    journey.steps[0]!;
  const complete = done === journey.steps.length;
  return (
    <section
      className="section-setup"
      data-compact={compact}
      data-topic={topic}
      data-dismissed={preference === "later" || complete}
      aria-label={`${journey.title} setup`}
    >
      {launcher ? (
        <button
          type="button"
          className="setup-reopen"
          onClick={() => setOpen(true)}
        >
          <CircleHelp />
          {launcher}
        </button>
      ) : preference === "later" || complete ? (
        <button
          type="button"
          className="setup-reopen"
          onClick={() => setOpen(true)}
        >
          <CircleHelp />
          <span>{journey.title}</span>
          <small>{complete ? "Walkthrough" : "Continue setup"}</small>
          <ChevronDown />
        </button>
      ) : (
        <div className="setup-invitation">
          <div className="setup-invitation-copy">
            <span
              className="setup-progress-mark"
              aria-label={`${done} of ${journey.steps.length} setup tasks complete`}
              style={
                {
                  "--progress": `${(done / journey.steps.length) * 100}%`,
                } as React.CSSProperties
              }
            >
              {complete ? (
                <Check />
              ) : (
                <span className="setup-progress-count">{done}</span>
              )}
            </span>
            <div>
              <h2>{journey.title}</h2>
              <p>
                {done ? `${done} of ${journey.steps.length} ready. ` : ""}
                {next.title}.
              </p>
            </div>
          </div>
          <div className="setup-invitation-actions">
            <button
              className="setup-start"
              type="button"
              onClick={() => setOpen(true)}
            >
              Setup guide
              <ArrowRight />
            </button>
            <button
              className="setup-dismiss"
              type="button"
              aria-label={`Set up ${topic} later`}
              onClick={() => setPreference("later")}
            >
              <X />
            </button>
          </div>
        </div>
      )}
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title={journey.title}
        description={journey.intro}
        kind="detail"
        className="journey-overlay"
        footer={
          <div className="journey-footer">
            <button
              type="button"
              className="journey-later"
              onClick={() => {
                setPreference("later");
                setOpen(false);
              }}
            >
              Save for later
            </button>
            <Link
              className="journey-primary"
              href={
                next.blocked ? "/dashboard/settings?section=plan" : next.href
              }
              onClick={() => setOpen(false)}
            >
              {next.blocked
                ? "Review access"
                : complete
                  ? "Review setup"
                  : next.action}
              <ArrowRight />
            </Link>
          </div>
        }
      >
        <GuideFilm
          topic={topic}
          industry={state.content.identity.industryKey}
        />
        <div className="journey-outcome">
          <Check />
          <p>{journey.outcome}</p>
        </div>
        <ol className="journey-steps">
          {journey.steps.map((step, i) => (
            <li key={step.id} data-done={step.done}>
              <span className="journey-step-number">
                {step.done ? <Check /> : i + 1}
              </span>
              <div>
                <h3>
                  {step.title}
                  {step.done ? (
                    <>
                      {" "}
                      <small>Ready</small>
                    </>
                  ) : null}
                </h3>
                <p>{step.detail}</p>
                {step.blocked ? (
                  <div className="journey-blocked">
                    <LockKeyhole />
                    <span>{step.blocked}</span>
                  </div>
                ) : null}
                {!step.blocked ? (
                  <Link
                    onClick={() => setOpen(false)}
                    href={
                      step.done ? step.href.replace(/\?new=1$/, "") : step.href
                    }
                  >
                    {step.done ? "Review" : step.action}
                    <ArrowRight />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/settings?section=plan"
                    onClick={() => setOpen(false)}
                  >
                    Review plan & connections
                    <ArrowRight />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Overlay>
    </section>
  );
}

/** A small personal launchpad, not another list of every feature. */
export function GettingStarted() {
  const { state } = useDemo();
  if (!state) return null;
  const goals = state.setupDrafts?.goals ?? [];
  const relevant: JourneyId[] = [
    "page",
    ...(goals.includes("book") ? ["bookings" as const] : []),
    ...(state.content.identity.industryKey === "car-dealer" ||
    goals.includes("products") ||
    goals.includes("buy")
      ? ["products" as const]
      : ["services" as const]),
  ];
  return (
    <div className="getting-started">
      <div>
        <h2>Make it work for your business.</h2>
        <p>Pick up where you left off. Your records and page stay connected.</p>
      </div>
      <div className="getting-started-list">
        {[...new Set(relevant)].slice(0, 3).map((topic) => (
          <SectionSetup key={topic} topic={topic} />
        ))}
      </div>
    </div>
  );
}
