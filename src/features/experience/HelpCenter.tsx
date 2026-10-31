"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { SectionSetup } from "./SectionSetup";
import { ReportDialog } from "@/features/support/ReportDialog";
import { useDemo } from "@/features/demo/store";
import { JOURNEY_META, type JourneyId } from "./journeys";
const TOPICS: JourneyId[] = [
  "page",
  "profile",
  "design",
  "order",
  "sharing",
  "services",
  "bookings",
  "products",
  "team",
  "reviews",
  "analytics",
  "settings",
];
export function HelpCenter() {
  const { state } = useDemo();
  const [query, setQuery] = React.useState("");
  if (!state) return null;
  return (
    <div className="help-center">
      <header>
        <h1>Help when you need it.</h1>
        <p>
          Practical walkthroughs, your next setup steps and a way to tell us
          what needs fixing.
        </p>
      </header>
      <label className="help-search">
        <Search />
        <input
          type="search"
          aria-label="Find a walkthrough"
          placeholder="Bookings, products, design…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="help-topics">
        {TOPICS.filter((t) =>
          `${t} ${JOURNEY_META[t][0]}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ).map((topic) => (
          <SectionSetup key={topic} topic={topic} />
        ))}
      </div>
      <div className="help-feedback">
        <div>
          <h2>Something getting in your way?</h2>
          <p>Tell us what happened and what you expected.</p>
        </div>
        <ReportDialog
          businessName={state.content.identity.name}
          plan={state.plan}
        />
      </div>
    </div>
  );
}
