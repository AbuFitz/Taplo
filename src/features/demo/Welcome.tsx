"use client";

import Link from "next/link";
import { ALL_SHOWCASE } from "@/features/inspiration/showcase-set";
import { getStartingLook } from "@/features/page/themes/starting-looks";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  initialConfig,
  toContent,
  toPage,
} from "@/features/showcase/lab-state";
import type { Scenario } from "@/features/showcase/content";
import "./dashboard/studio-today.css";
import { initialState, useDemo } from "./store";

const SAMPLES: {
  scenario: Scenario;
  slug: string;
  asset: string;
  name: string;
  category: string;
  detail: string;
}[] = [
  {
    scenario: "station",
    slug: "jays-barbers",
    asset: "station-road-barbers",
    name: "Jay’s Barbers",
    category: "Barber shop",
    detail: "Prices, a familiar face and your next haircut sorted.",
  },
  {
    scenario: "detailer",
    slug: "detail-dept",
    asset: "parkside-valeting",
    name: "Detail Dept.",
    category: "Valeting & detailing",
    detail: "Show the work. Explain the packages. Arrange a visit.",
  },
  {
    scenario: "brookfield",
    slug: "harris-cars",
    asset: "brookfield-motors",
    name: "Harris Cars",
    category: "Car dealership",
    detail: "Proper stock photographs and the facts buyers need.",
  },
  {
    scenario: "corner",
    slug: "no-6-coffee",
    asset: "corner-table-cafe",
    name: "No. 6 Coffee",
    category: "Neighbourhood café",
    detail:
      "A proper menu, opening times and a way to ask about a larger visit.",
  },
  {
    scenario: "oakfield",
    slug: "dans-home-repairs",
    asset: "oakfield-home-repairs",
    name: "Dan’s Home Repairs",
    category: "Home repairs",
    detail: "Explain the work, agree the scope and arrange a visit.",
  },
  {
    scenario: "rowan",
    slug: "maths-with-aisha",
    asset: "rowan-learning",
    name: "Maths with Aisha",
    category: "Maths tutor",
    detail: "A personal introduction and sessions at a pace you can follow.",
  },
];

/** The starting look an example page wears, so each card says what it shows. */
const lookName = (scenario: Scenario): string | undefined => {
  const id = ALL_SHOWCASE.find((i) => i.scenario === scenario)?.look;
  return id ? getStartingLook(id)?.name : undefined;
};

/** Only shown for an empty account. Existing drafts never enter the sample-loading flow. */
export function Welcome() {
  const { state, update } = useDemo();
  const router = useRouter();
  const resumeName = state?.content.identity.name?.trim();
  const load = (scenario: Scenario) => {
    const cfg = initialConfig(scenario);
    update(
      (s) => {
        // A draft opened in another tab must not be replaced by an old welcome screen.
        if (s.onboarded || s.content.identity.name) return s;
        return {
          ...initialState(),
          plan: s.plan,
          onboarded: true,
          slugEdited: true,
          step: "finish",
          content: structuredClone(toContent(cfg)),
          page: structuredClone(toPage(cfg)),
        };
      },
      { resetHistory: true },
    );
    router.push("/dashboard/page");
  };
  return (
    <div className="studio-welcome" data-testid="first-run">
      <p className="studio-eyebrow">Your workspace</p>
      <h1>Welcome to Studio.</h1>
      <p className="studio-welcome-intro">
        {resumeName
          ? `Pick up where you left off with ${resumeName}.`
          : "A place for your business to come together. Start with a page that feels like you."}
      </p>
      <Link className="studio-button" href="/onboarding">
        {resumeName ? "Continue setup" : "Start setup"}
        <ArrowRight aria-hidden="true" />
      </Link>
      <ol className="studio-welcome-steps">
        {[
          {
            title: "Make it yours",
            line: "Your name, your look and the work you do.",
          },
          {
            title: "Add something useful",
            line: "A service, a product or a way to get in touch.",
          },
          {
            title: "Share when you’re ready",
            line: "Review your page. You decide when it goes live.",
          },
        ].map((item, i) => (
          <li key={item.title}>
            <span>0{i + 1}</span>
            <h2>{item.title}</h2>
            <p>{item.line}</p>
          </li>
        ))}
      </ol>
      <details className="studio-welcome-examples">
        <summary>
          Explore with a sample business
          <ArrowRight aria-hidden="true" />
        </summary>
        <p>Try the tools with fictional details. Your own draft stays yours.</p>
        <ul>
          {SAMPLES.map((sample) => (
            <li key={sample.scenario}>
              <button type="button" onClick={() => load(sample.scenario)}>
                <span>
                  <strong>{sample.name}</strong>
                  <small>
                    {sample.category}
                    {lookName(sample.scenario)
                      ? ` · ${lookName(sample.scenario)}`
                      : ""}
                  </small>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
