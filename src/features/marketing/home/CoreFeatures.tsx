"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FeaturePlayground } from "../FeaturePlayground";
import { ServicePricingDemo } from "../ServicePricingDemo";
const ITEMS = [
  {
    slug: "services",
    label: "Services",
    title: "Good work. Clear prices.",
    copy: "A menu, a package or a first conversation. Let people see what you offer.",
  },
  {
    slug: "vehicles",
    label: "Stock",
    title: "A showroom in your pocket.",
    copy: "Photos, facts and the right enquiry. Give every vehicle its own space.",
  },
  {
    slug: "team",
    label: "People",
    title: "Make the introduction.",
    copy: "Show who’s behind the work, and the services each person offers.",
  },
  {
    slug: "design",
    label: "Design",
    title: "Recognisably yours.",
    copy: "A strong starting look, with room for your identity and your content.",
  },
] as const;
export function CoreFeatures() {
  const [selected, select] = useState(0);
  const item = ITEMS[selected];
  return (
    <section className="home-core-features" aria-labelledby="core-title">
      <div className="home-core-inner">
        <div className="home-core-copy">
          <h2 id="core-title">
            One link.
            <br />A lot of possibility.
          </h2>
          <div
            className="home-core-tabs"
            role="group"
            aria-label="Explore page features"
          >
            {ITEMS.map((entry, n) => (
              <button
                key={entry.slug}
                type="button"
                aria-pressed={n === selected}
                onClick={() => select(n)}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
          <Link href={`/product/${item.slug}`} className="home-core-link">
            Explore {item.label.toLowerCase()}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-core-art" key={item.slug}>
          {item.slug === "services" ? (
            <ServicePricingDemo />
          ) : (
            <FeaturePlayground slug={item.slug} />
          )}
        </div>
      </div>
    </section>
  );
}
