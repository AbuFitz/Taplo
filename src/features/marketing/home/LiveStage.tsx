"use client";
import { businessAddress } from "@/lib/domains";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers3, Smartphone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PagePreview } from "@/features/preview/PagePreview";

import type { HeroScene } from "./hero-scene-types";
const subscribe = (callback: () => void) => {
  const query = matchMedia("(min-width:768px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
export function LiveStage({ scenes }: { scenes: HeroScene[] }) {
  const [selected, select] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const [revealed, reveal] = useState(false);
  const desktop = useSyncExternalStore(
    subscribe,
    () => matchMedia("(min-width:768px)").matches,
    () => false,
  );
  const reduced = useReducedMotion();
  const scene = scenes[selected];
  return (
    <div className="business-stage hero-stage hero-live-stage">
      <div
        className="hero-choices"
        role="group"
        aria-label="Try a business design"
      >
        {scenes.map((s, i) => (
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
        ref={stage}
        className="hero-composition"
        key={scene.slug}
        drag={!desktop && !reduced ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 35)
            select(
              (selected + (info.offset.x < 0 ? 1 : scenes.length - 1)) %
                scenes.length,
            );
        }}
        initial={reduced ? false : { y: 14 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ touchAction: "pan-y", perspective: 1400 }}
      >
        <motion.div
          className="hero-demo-face"
          style={{ visibility: revealed ? "hidden" : "visible" }}
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
        <motion.div
          className="hero-blueprint"
          aria-hidden={!revealed}
          data-testid="hero-page-blocks"
          style={{
            visibility: revealed ? "visible" : "hidden",
            pointerEvents: "none",
          }}
        >
          <div className="hero-blueprint-heading">
            <Layers3 size={18} aria-hidden="true" />
            <span>Built from blocks</span>
            <span>{scene.name}</span>
          </div>
          <div className="hero-blueprint-blocks">
            {scene.blocks.map((block, index) => (
              <article key={`${block.kind}-${index}`} data-kind={block.kind}>
                <div>
                  <span className="hero-blueprint-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h2>{block.title}</h2>
                </div>
                {block.entries.length ? (
                  <ul>
                    {block.entries.map((entry, n) => (
                      <li key={n}>
                        <span>{entry.title}</span>
                        <span>{entry.detail}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="hero-blueprint-lines" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </article>
            ))}
          </div>
          {scene.action ? (
            <div className="hero-blueprint-primary">
              <span>First step</span>
              <strong>{scene.action}</strong>
              <ArrowUpRight size={16} aria-hidden="true" />
            </div>
          ) : null}
        </motion.div>
      </motion.div>
      <div className="hero-stage-caption">
        <p>{scene.name}</p>
        <div className="hero-stage-actions">
          <button
            type="button"
            aria-pressed={revealed}
            onClick={() => {
              reveal(!revealed);
              const box = stage.current?.getBoundingClientRect();
              const header =
                document
                  .querySelector(".site-navigation")
                  ?.getBoundingClientRect().height ?? 80;
              if (
                box &&
                (box.top < header + 12 || box.bottom > window.innerHeight - 72)
              )
                window.scrollBy({
                  top: box.top - header - 12,
                  behavior: reduced ? "instant" : "smooth",
                });
            }}
          >
            {revealed ? (
              <Smartphone size={15} aria-hidden="true" />
            ) : (
              <Layers3 size={15} aria-hidden="true" />
            )}
            {revealed ? "See the page" : "See the blocks"}
          </button>
          <Link href={`/inspiration/${scene.slug}`}>
            Explore this page
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
