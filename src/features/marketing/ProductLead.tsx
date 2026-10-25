"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MarketingPreview } from "./MarketingPreview";
import { MonoField } from "./MonoField";

const BUSINESSES = [
  {
    label: "Clinic",
    name: "Hollin Physio",
    title: "A little clarity before the appointment.",
    detail: "Meet the team, compare appointments and request a time.",
    scenario: "physio",
    slug: "hollin-physio",
  },
  {
    label: "Café",
    name: "No. 6 Coffee",
    title: "The menu. The hours. The next visit.",
    detail: "Give the neighbourhood a place to find what’s on today.",
    scenario: "corner",
    slug: "no-6-coffee",
  },
  {
    label: "Trades",
    name: "Dan’s Home Repairs",
    title: "Get the details before the job.",
    detail:
      "Show the work you take on and give customers a clear way to enquire.",
    scenario: "oakfield",
    slug: "dans-home-repairs",
  },
  {
    label: "Car dealer",
    name: "Harris Cars",
    title: "The car is only the start.",
    detail:
      "Photos, specifications and an enquiry that stays attached to the vehicle.",
    scenario: "brookfield",
    slug: "harris-cars",
  },
] as const;

/** One deliberate choice, with the demo and adoption destination kept together. */
export function ProductLead() {
  const [selected, select] = useState(0);
  const business = BUSINESSES[selected];
  return (
    <div className="product-atlas-experience" data-testid="product-experience">
      <fieldset className="product-atlas-choices">
        <legend className="sr-only">Choose a business example</legend>
        {BUSINESSES.map((item, index) => (
          <label key={item.slug}>
            <input
              type="radio"
              name="product-business"
              value={item.slug}
              checked={selected === index}
              onChange={() => select(index)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>
      <div className="product-atlas-stage">
        <MonoField className="product-atlas-light">{null}</MonoField>
        <div className="product-atlas-phone-slot" key={business.slug}>
          <MarketingPreview
            scenario={business.scenario}
            slug={business.slug}
            name={business.name}
          />
        </div>
        <span className="product-atlas-example-caption">Example business</span>
      </div>
      <div
        className="product-atlas-example-copy"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="product-atlas-business-name">{business.name}</p>
        <h2>{business.title}</h2>
        <p>{business.detail}</p>
      </div>
      <div className="product-atlas-example-actions">
        <Link href={`/inspiration/${business.slug}`} data-testid="product-demo">
          Open demo
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href={`/onboarding?from=${business.slug}`}
          data-testid="product-adopt"
        >
          Use this page
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
