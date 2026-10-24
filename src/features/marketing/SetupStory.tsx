"use client";
import * as React from "react";
import { STEPS } from "./content";
import { cn } from "@/lib/utils";
const CAPTURES = [
  "setup-1-name",
  "setup-2-what",
  "setup-4-first",
  "setup-3-design",
  "setup-5-review",
] as const;

/** Voluntary setup preview, using separate real phone/desktop captures. No fake fields or automatic progression. */
export function SetupStory() {
  const [active, setActive] = React.useState(0),
    uid = React.useId(),
    buttons = React.useRef<(HTMLButtonElement | null)[]>([]);
  const choose = (n: number, focus = false) => {
    const next = (n + STEPS.length) % STEPS.length;
    setActive(next);
    if (focus) buttons.current[next]?.focus();
  };
  return (
    <div>
      <div
        role="tablist"
        aria-label="See the setup steps"
        className="grid grid-cols-2 gap-3 md:grid-cols-5"
      >
        {STEPS.map((s, n) => (
          <button
            key={s.n}
            ref={(el) => {
              buttons.current[n] = el;
            }}
            id={`${uid}-tab-${n}`}
            type="button"
            role="tab"
            aria-selected={active === n}
            aria-controls={`${uid}-panel-${n}`}
            tabIndex={active === n ? 0 : -1}
            onClick={() => choose(n)}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowRight"
                  ? active + 1
                  : e.key === "ArrowLeft"
                    ? active - 1
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? STEPS.length - 1
                        : null;
              if (next !== null) {
                e.preventDefault();
                choose(next, true);
              }
            }}
            className={cn(
              "overflow-hidden rounded-2xl border-2 p-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-signal/50 focus-visible:ring-offset-2",
              n === STEPS.length - 1 &&
                "col-span-2 grid grid-cols-[7rem_1fr] items-center md:col-span-1 md:block",
              active === n
                ? "border-signal bg-[#f4f4f4]"
                : "border-foreground/15 bg-white hover:border-foreground/35",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/marketing/${CAPTURES[n]}.webp`}
              alt=""
              width={2200}
              height={1720}
              loading="lazy"
              className="aspect-[1.8] w-full rounded-lg object-cover object-top"
            />
            <span className="flex items-baseline gap-2 px-1 pb-2 pt-3">
              <span className="text-xs font-semibold text-signal">{s.n}</span>
              <span className="text-sm font-semibold sm:text-base">
                {s.title}
              </span>
            </span>
          </button>
        ))}
      </div>
      {STEPS.map((s, n) => (
        <div
          key={s.n}
          id={`${uid}-panel-${n}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${n}`}
          hidden={active !== n}
          tabIndex={0}
          className="mt-8 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-signal/50"
        >
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-foreground/70">
            {s.body}
          </p>
          <div className="overflow-hidden rounded-2xl border border-foreground/15 bg-white shadow-[0_25px_60px_-40px_rgb(20_45_62/0.35)]">
            <picture>
              <source
                width={780}
                height={1688}
                media="(max-width:639px)"
                srcSet={`/marketing/${CAPTURES[n]}-phone.webp`}
              />
              <img
                src={`/marketing/${CAPTURES[n]}.webp`}
                alt={`The actual setup screen: ${s.title}`}
                width={2200}
                height={1720}
                loading="lazy"
                className="block h-auto w-full"
              />
            </picture>
          </div>
        </div>
      ))}
      <p className="mt-5 text-sm text-foreground/65">
        Captured from the working setup. Your page starts with your own content.
      </p>
    </div>
  );
}
