"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, X } from "lucide-react";
import { SetupAtmosphere } from "./SetupAtmosphere";
import { TaploLogo } from "@/components/taplo/brand";

/** One sheet-height model for every step: Peek shows the page, Default is where every step opens, Full is for long lists. */
export type SheetSnap = "peek" | "default" | "full";

interface Props {
  step: number;
  steps: number;
  title: React.ReactNode;
  description?: string;
  stepLabel: string;
  snap: SheetSnap;
  onSnap: (snap: SheetSnap) => void;
  mobile: boolean;
  keyboard: boolean;
  /** The live page. Rendered once, so moving between steps never reloads it. */
  preview: React.ReactNode;
  /** Controls that live in the sheet body. */
  children: React.ReactNode;
  footer: React.ReactNode;
  notice?: React.ReactNode;
  bodyKey: string;
  onBack?: () => void;
}

/** Mobile is a focused form; the live page stays above the form and adapts to the current task. */
export const SetupShell = React.forwardRef<HTMLElement, Props>(
  function SetupShell(
    {
      step,
      steps,
      title,
      description,
      stepLabel,
      snap,
      onSnap,
      mobile,
      keyboard,
      preview,
      children,
      footer,
      notice,
      bodyKey,
      onBack,
    },
    ref,
  ) {
    const previewing = mobile && snap === "peek";
    const scroller = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      scroller.current?.scrollTo({ top: 0 });
    }, [bodyKey]);
    return (
      <main
        ref={ref}
        className="sf-root"
        data-snap={snap}
        data-step={bodyKey}
        data-keyboard={keyboard}
        data-mobile={mobile}
        data-previewing={previewing}
        data-testid="setup-root"
      >
        <SetupAtmosphere />
        <header className="sf-top">
          {mobile && step > 0 ? (
            <button
              type="button"
              className="sf-top-back"
              onClick={onBack}
              aria-label="Back to previous step"
            >
              <ArrowLeft />
            </button>
          ) : null}
          <Link
            href="/"
            className="sf-logo"
            data-testid="setup-logo"
            aria-label="Taplo home"
          >
            <TaploLogo className="h-7" />
          </Link>
          <div
            className="sf-progress"
            role="progressbar"
            aria-label="Setup progress"
            aria-valuemin={1}
            aria-valuemax={steps}
            aria-valuenow={step + 1}
            aria-valuetext={`Step ${step + 1} of ${steps}: ${stepLabel}`}
          >
            <span className="sf-progress-bar" aria-hidden="true">
              <i style={{ width: `${((step + 1) / steps) * 100}%` }} />
            </span>
          </div>
          {mobile ? (
            <button
              type="button"
              className="sf-preview-toggle"
              onClick={() => onSnap(previewing ? "default" : "peek")}
              aria-pressed={previewing}
              aria-label={previewing ? "Back to setup" : "Expand page preview"}
            >
              {previewing ? <X /> : <Maximize2 />}
              <span className="sr-only">
                {previewing ? "Back to setup" : "Expand preview"}
              </span>
            </button>
          ) : null}
        </header>

        <section
          inert={previewing}
          className="sf-sheet"
          aria-labelledby="step-title"
          data-testid="setup-sheet"
        >
          <div ref={scroller} className="sf-scroll" data-testid="setup-scroll">
            <h1
              id="step-title"
              tabIndex={-1}
              className="sf-title font-display"
              key={`t-${bodyKey}`}
            >
              {title}
            </h1>
            {description ? (
              <p className="sf-description">{description}</p>
            ) : null}
            <div
              id="setup-controls"
              className="sf-body"
              key={bodyKey}
              data-testid="setup-body"
              onFocusCapture={(e) => {
                const target = e.target as HTMLElement;
                if (
                  !target.matches(
                    'input:not([type="radio"]):not([type="checkbox"]):not([type="range"]),textarea,select',
                  )
                )
                  return;
                requestAnimationFrame(() =>
                  target.scrollIntoView({
                    block: "nearest",
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                  }),
                );
              }}
            >
              {children}
            </div>
          </div>
          {notice}
          <footer className="sf-foot">{footer}</footer>
        </section>

        <div className="sf-stage" data-testid="setup-stage">
          {preview}
        </div>
      </main>
    );
  },
);
