"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  LifeBuoy,
  Clock,
  Contact,
} from "lucide-react";
import { SectionSetup } from "./SectionSetup";
import { ReportDialog } from "@/features/support/ReportDialog";
import { useDemo } from "@/features/demo/store";
import { JOURNEY_META, type JourneyId } from "./journeys";
import { PageHeader } from "@/features/demo/dashboard/Panel";
import {
  QuickBusinessEditor,
  type BusinessEdit,
} from "@/features/demo/dashboard/QuickBusinessEditor";
const TOPICS = Object.keys(JOURNEY_META) as JourneyId[];
const FIXES = [
  {
    title: "Why are no times showing?",
    body: "Check that the service has a duration and booking is enabled. Then review the assigned person’s working hours, notice and blocked time.",
    href: "/dashboard/bookings?section=availability",
    action: "Review availability",
  },
  {
    title: "What’s stopping me publishing?",
    body: "Add your business name and a contact method. Replace or remove example content, then review the page before publishing.",
    href: "/dashboard/page?task=settings",
    action: "Review your page",
  },
  {
    title: "Why can’t I see my product?",
    body: "Check that the item is not archived, then add a Products block and select the items you want to show.",
    href: "/dashboard/products",
    action: "Check your products",
  },
  {
    title: "My changes haven’t saved",
    body: "Keep the page open and try saving again. If saving still fails, download your workspace data before clearing storage or changing devices.",
    href: "/dashboard/settings?section=data",
    action: "Open workspace data",
  },
];
export function HelpCenter() {
  const { state } = useDemo();
  const params = useSearchParams();
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<BusinessEdit | null>(null);
  const [notice, setNotice] = React.useState("");
  if (!state) return null;
  const term = query.trim().toLowerCase();
  const topics = TOPICS.filter((topic) =>
    `${topic} ${JOURNEY_META[topic].join(" ")}`.toLowerCase().includes(term),
  );
  return (
    <div className="ts-help-page">
      <PageHeader
        title="A little help. Keep moving."
        description="Find the answer, make a quick change, or tell us what’s getting in the way."
      />
      <label className="ts-help-search">
        <Search aria-hidden="true" />
        <input
          type="search"
          aria-label="Find a walkthrough"
          placeholder="What do you need help with?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <kbd>Search guides</kbd>
      </label>
      {!term ? (
        <>
          <section className="ts-help-fixes">
            <div className="ts-section-title">
              <span className="ts-overline">START HERE</span>
              <h2>Common questions, clear answers.</h2>
            </div>
            <div>
              {FIXES.map((fix) => (
                <details key={fix.title}>
                  <summary>
                    {fix.title}
                    <ArrowRight aria-hidden="true" />
                  </summary>
                  <p>{fix.body}</p>
                  <Link href={fix.href}>
                    {fix.action}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </details>
              ))}
            </div>
          </section>
          <section className="ts-help-quick">
            <div>
              <h2>Just need to change a detail?</h2>
              <p>Do it here and carry on with your day.</p>
            </div>
            <button onClick={() => setEditing("hours")}>
              <Clock aria-hidden="true" />
              Opening hours
              <ArrowUpRight aria-hidden="true" />
            </button>
            <button onClick={() => setEditing("contact")}>
              <Contact aria-hidden="true" />
              Contact details
              <ArrowUpRight aria-hidden="true" />
            </button>
          </section>
        </>
      ) : null}
      <section className="ts-help-guides">
        <div className="ts-section-title">
          <span className="ts-overline">LEARN BY DOING</span>
          <h2>
            {term
              ? `${topics.length} matching guides`
              : "A guide for every part of Studio."}
          </h2>
        </div>
        <div>
          {topics.map((topic) => (
            <SectionSetup
              key={topic}
              topic={topic}
              defaultOpen={params.get("topic") === topic}
            />
          ))}
        </div>
        {!topics.length ? (
          <p>No guides match “{query}”. Try “bookings”, “page” or “sharing”.</p>
        ) : null}
      </section>
      <section className="ts-support-contact">
        <LifeBuoy aria-hidden="true" />
        <div>
          <h2>Let’s get it sorted.</h2>
          <p>
            Tell us what happened. You can choose which task details to include.
          </p>
        </div>
        <ReportDialog
          businessName={state.content.identity.name}
          plan={state.plan}
          trigger={
            <>
              Get support
              <ArrowUpRight aria-hidden="true" />
            </>
          }
        />
      </section>
      <p role="status">{notice}</p>
      {editing ? (
        <QuickBusinessEditor
          mode={editing}
          initial={state}
          onClose={() => setEditing(null)}
          onSaved={(mode) =>
            setNotice(
              mode === "hours"
                ? "Opening hours updated."
                : "Contact details updated.",
            )
          }
        />
      ) : null}
    </div>
  );
}
