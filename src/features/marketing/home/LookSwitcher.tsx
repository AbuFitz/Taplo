"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingPreview } from "../MarketingPreview";
import { DesignRail } from "@/features/inspiration/DesignRail";
import { HOME_DESIGNS } from "./designs";
/** Each choice opens the same working business that is pictured; setup carries its arrangement. */
export function LookSwitcher() {
  const [selected, select] = React.useState(0);
  const design = HOME_DESIGNS[selected];
  return (
    <div className="home-designs" data-testid="home-designs">
      <div className="home-design-summary">
        <p className="text-sm font-medium text-black/60">{design.label}</p>
        <div className="mt-8" aria-live="polite">
          <p className="font-display text-3xl tracking-[-.04em] sm:text-4xl">
            {design.name}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <Link
            href={`/inspiration/${design.slug}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
          >
            Open the demo
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            data-brand-action
            href={`/onboarding?from=${design.slug}`}
            className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-semibold text-white"
          >
            Use this design
          </Link>
        </div>
        <Link
          href="/inspiration"
          className="mt-4 inline-flex min-h-11 items-center text-sm text-black/65 underline underline-offset-4"
        >
          All designs
        </Link>
      </div>
      <DesignRail
        label="Starting designs"
        initialIndex={0}
        onIndexChange={select}
        className="home-starting-rail"
      >
        {HOME_DESIGNS.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/inspiration/${item.slug}`}
              aria-label={`Open ${item.name} design`}
              className="design-stage"
            >
              <div className="design-surface">
                <MarketingPreview
                  scenario={item.scenario}
                  slug={item.slug}
                  name={item.name}
                />
              </div>
            </Link>
          </li>
        ))}
      </DesignRail>
    </div>
  );
}
