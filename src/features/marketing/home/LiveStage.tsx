"use client";
import { businessAddress } from "@/lib/domains";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PagePreview } from "@/features/preview/PagePreview";

const SCENES = [
  {
    label: "Appointments",
    name: "Hollin Physiotherapy",
    slug: "hollin-physio",
    scenario: "physio",
  },
  {
    label: "Stock",
    name: "Harris Cars",
    slug: "harris-cars",
    scenario: "brookfield",
  },
  {
    label: "Portfolios",
    name: "Sora Fields",
    slug: "sora-fields",
    scenario: "sora",
  },
  {
    label: "Cafés",
    name: "No. 6 Coffee",
    slug: "no-6-coffee",
    scenario: "corner",
  },
] as const;
const subscribe = (callback: () => void) => {
  const query = matchMedia("(min-width:768px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
export function LiveStage() {
  const [selected, select] = useState(1);
  const desktop = useSyncExternalStore(
    subscribe,
    () => matchMedia("(min-width:768px)").matches,
    () => false,
  );
  const reduced = useReducedMotion();
  const scene = SCENES[selected];
  return (
    <div className="business-stage hero-stage hero-live-stage">
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
      <motion.div
        className="hero-composition"
        key={scene.slug}
        drag={!desktop && !reduced ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 35)
            select(
              (selected + (info.offset.x < 0 ? 1 : SCENES.length - 1)) %
                SCENES.length,
            );
        }}
        initial={reduced ? false : { y: 14 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ touchAction: "pan-y" }}
      >
        {desktop ? (
          <div className="hero-live-browser">
            <PagePreview
              src={`/appearance/frame?scenario=${scene.scenario}`}
              title={`${scene.name}, desktop`}
              mode="desktop"
              chrome
              url={businessAddress(scene.slug)}
              interactive={false}
            />
          </div>
        ) : null}
        <div className="hero-live-phone">
          <PagePreview
            src={`/appearance/frame?scenario=${scene.scenario}`}
            title={`${scene.name}, phone`}
            mode="device"
            chrome
            interactive={false}
            cropDevice
          />
        </div>
      </motion.div>
      <div className="hero-stage-caption">
        <p>{scene.name}</p>
        <Link href={`/inspiration/${scene.slug}`}>
          Explore this page
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </div>
  );
}
