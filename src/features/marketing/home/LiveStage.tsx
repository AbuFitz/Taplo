"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "../Shot";
import { MonoField } from "../MonoField";
const SCENES = [
  {
    label: "Barber",
    name: "Jay’s Barbers",
    slug: "jays-barbers",
    asset: "station-road-barbers",
    detail: "Services, prices and booking a chair.",
  },
  {
    label: "Detailer",
    name: "Detail Dept.",
    slug: "detail-dept",
    asset: "parkside-valeting",
    detail: "Explain the package. Agree the job first.",
  },
  {
    label: "Car dealer",
    name: "Harris Cars",
    slug: "harris-cars",
    asset: "brookfield-motors",
    detail: "Stock, specifications and the right enquiry.",
  },
  {
    label: "Café",
    name: "No. 6 Coffee",
    slug: "no-6-coffee",
    asset: "corner-table-cafe",
    detail: "The menu, opening times and a place to start.",
  },
] as const;
export function LiveStage() {
  const [selected, select] = useState(3);
  const scene = SCENES[selected];
  return (
    <MonoField className="business-stage hero-stage">
      <div
        className="hero-choices"
        role="group"
        aria-label="Try a business design"
      >
        {SCENES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-pressed={selected === i}
            onClick={() => select(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="hero-composition" key={scene.slug}>
        <div className="hero-desktop" aria-hidden="true">
          <Shot
            id={`ex-${scene.asset}-desk` as never}
            alt=""
            width={880}
            fluid
            frame="none"
            priority
          />
        </div>
        <div className="hero-phone">
          <Shot
            id={`ex-${scene.asset}-phone` as never}
            alt={`${scene.name} business page`}
            width={390}
            fluid
            frame="none"
            priority
          />
        </div>
      </div>
        <div className="hero-stage-caption">
          <p>{scene.name}</p>
          <Link href={`/inspiration/${scene.slug}`}>
            Explore this page
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
    </MonoField>
  );
}
