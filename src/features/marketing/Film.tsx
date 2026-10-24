"use client";
import * as React from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "./Shot";

/** Silent, inline film. Only plays while visible; device reduced-motion settings use the still. */
export function SilentVideo({
  sources,
  poster,
  phonePoster,
  label,
  testId,
}: {
  sources: { src: string; media?: string }[];
  poster: string;
  phonePoster?: string;
  label: string;
  testId?: string;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [reduce, setReduce] = React.useState(true);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, []);
  React.useEffect(() => {
    if (visible && !reduce) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [visible, reduce]);
  return (
    <div ref={host} className="absolute inset-0">
      {visible && !reduce ? (
        <video
          ref={video}
          data-testid={testId}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          playsInline
          muted
          loop
          preload="metadata"
          poster={poster}
          aria-label={label}
          tabIndex={-1}
        >
          {sources.map((source) => (
            <source
              key={source.src}
              media={source.media}
              src={source.src}
              type="video/mp4"
            />
          ))}
        </video>
      ) : phonePoster ? (
        <picture>
          <source
            media="(max-width:639px)"
            srcSet={
              getImageProps({
                src: phonePoster,
                alt: label,
                width: 1080,
                height: 1920,
                sizes: "90vw",
              }).props.srcSet
            }
          />
          <img
            {...getImageProps({
              src: poster,
              alt: label,
              width: 1920,
              height: 1080,
              sizes: "90vw",
            }).props}
            alt={label}
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      ) : (
        <Image
          src={poster}
          alt={label}
          fill
          sizes="(min-width:1280px) 1100px, 90vw"
          className="object-cover"
        />
      )}
    </div>
  );
}
const STORIES = [
  {
    id: "detail",
    label: "Detailing",
    business: "Detail Dept.",
    title: "Agree the work. Then the visit.",
    description:
      "Explain the package, see the request and agree the job before confirming it.",
    note: "A request is not a confirmed appointment.",
    photo: "/photography/valet.webp",
    alt: "A detailer working on a car in a real workshop",
    shot: "bk-request-review",
    shotAlt:
      "The actual detailing request review with service, price and contact details",
    href: "/inspiration/detail-dept",
    action: "Try the detailing demo",
  },
  {
    id: "stock",
    label: "Vehicle sales",
    business: "Harris Cars",
    title: "The car. The facts. The next step.",
    description:
      "Put stock, specifications and the asking price together. Keep the selected car attached to the enquiry.",
    note: "Viewings are requests for the dealer to agree.",
    photo: "/photography/golf.webp",
    alt: "Volkswagen Golf photographed outside a garage",
    shot: "veh-detail",
    shotAlt:
      "The actual vehicle detail page showing photographs and specifications",
    href: "/inspiration/harris-cars",
    action: "Explore the forecourt demo",
  },
  {
    id: "menu",
    label: "Cafés",
    business: "No. 6 Coffee",
    title: "A menu worth opening before you arrive.",
    description:
      "Give regulars the menu, prices and opening times. Keep appointment booking out of the coffee order.",
    note: "Menu items show prices without booking an appointment.",
    photo: "/photography/coffee.webp",
    alt: "A real neighbourhood café interior",
    shot: "cafe-menu",
    shotAlt: "The actual café menu with grouped food and drink prices",
    href: "/inspiration/no-6-coffee",
    action: "Open the café demo",
  },
] as const;
const STORY_MS = 11000;
/** Transparent native composition: the visual, business meaning and destination stay connected. */
export function Film({ className }: { className?: string }) {
  const host = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [reduce, setReduce] = React.useState(true);
  const [documentActive, setDocumentActive] = React.useState(true);
  const [held, setHeld] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [manual, setManual] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches),
      visibility = () => setDocumentActive(!document.hidden);
    sync();
    visibility();
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.18 },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const running =
    visible && documentActive && !reduce && !held && !focused && !manual;
  React.useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setSelected((n) => (n + 1) % STORIES.length),
      STORY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [running, selected]);
  const story = STORIES[selected];
  return (
    <div
      ref={host}
      data-testid="product-story"
      data-story={story.id}
      data-running={running}
      data-visible={visible}
      className={`product-story ${className ?? ""}`}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div
        role="group"
        aria-label="Choose a business story"
        className="product-story-choices"
      >
        {STORIES.map((s, i) => (
          <button
            type="button"
            key={s.id}
            aria-pressed={selected === i}
            onClick={() => {
              setSelected(i);
              setManual(true);
            }}
          >
            <span>{s.label}</span>
            <span aria-hidden="true" className="product-story-track">
              <span
                key={`${selected}-${i}`}
                style={{ animationPlayState: running ? "running" : "paused" }}
              />
            </span>
          </button>
        ))}
      </div>
      <div key={story.id} className="product-story-scene" data-kind={story.id}>
        <Link
          href={story.href}
          className="product-story-art"
          aria-label={`${story.business}: ${story.action}`}
        >
          <div className="product-story-photo">
            <Image
              src={story.photo}
              alt={story.alt}
              fill
              sizes="(min-width:1024px) 620px, 85vw"
              className="object-cover"
            />
          </div>
          <div className="product-story-surface">
            <Shot
              id={story.shot}
              alt={story.shotAlt}
              width={520}
              fluid
              frame="none"
              sizes="(min-width:1024px) 400px, 76vw"
            />
          </div>
          <span className="product-story-caption">
            {story.business}
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </Link>
        <div className="product-story-copy">
          <h3>{story.title}</h3>
          <p>{story.description}</p>
          <Link href={story.href} className="product-story-action">
            {story.action}
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
          <p className="product-story-note">{story.note}</p>
        </div>
      </div>
    </div>
  );
}
