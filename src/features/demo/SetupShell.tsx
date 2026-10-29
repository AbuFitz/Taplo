"use client"

import * as React from "react"
import Link from "next/link"
import { TaploLogo } from "@/components/taplo/brand"
import { cn } from "@/lib/utils"

/** One sheet-height model for every step: Peek shows the page, Default is where every step opens, Full is for long lists. */
export type SheetSnap = "peek" | "default" | "full"
const ORDER: SheetSnap[] = ["peek", "default", "full"]

interface Props {
  step: number
  steps: number
  title: React.ReactNode
  stepLabel: string
  snap: SheetSnap
  onSnap: (snap: SheetSnap) => void
  mobile: boolean
  keyboard: boolean
  /** The live page. Rendered once, so moving between steps never reloads it. */
  preview: React.ReactNode
  /** Controls that live in the sheet body. */
  children: React.ReactNode
  footer: React.ReactNode
  notice?: React.ReactNode
  bodyKey: string
}

/**
 * The setup frame. On a phone the live page sits behind a bottom sheet that is always one of three heights (16, 52 or 88 percent of the visible
 * screen), never sized by its content, so the page never jumps between steps. On a desk the controls sit left and the whole page right.
 */
export const SetupShell = React.forwardRef<HTMLElement, Props>(function SetupShell({ step, steps, title, stepLabel, snap, onSnap, mobile, keyboard, preview, children, footer, notice, bodyKey }, ref) {
  const grip = React.useRef<HTMLButtonElement>(null)
  const drag = React.useRef<{ id: number; y: number; moved: boolean } | null>(null)
  const suppress = React.useRef(false)
  const bump = (dir: 1 | -1) => onSnap(ORDER[Math.max(0, Math.min(ORDER.length - 1, ORDER.indexOf(snap) + dir))]!)
  const peek = mobile && snap === "peek"

  return (
    <main ref={ref} className="sf-root" data-snap={snap} data-keyboard={keyboard} data-mobile={mobile} data-testid="setup-root">
      <header className="sf-top">
        <span className="sf-logo" data-testid="setup-logo"><TaploLogo className="h-7" /></span>
        <div className="sf-progress" role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={steps} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of ${steps}: ${stepLabel}`}>
          <span className="sf-progress-text" data-testid="setup-progress-text">Step {step + 1} of {steps}</span>
          <span className="sf-progress-bar" aria-hidden="true"><i style={{ width: `${((step + 1) / steps) * 100}%` }} /></span>
        </div>
        <Link href="/" className="sf-exit" data-testid="setup-exit" title="Your progress is saved on this device">Save and exit</Link>
      </header>

      <section className="sf-sheet" aria-labelledby="step-title" data-testid="setup-sheet">
        {mobile ? (
          <button
            ref={grip}
            type="button"
            className="sf-grip"
            data-testid="setup-grip"
            aria-label={peek ? "Return to editing" : "Show full preview"}
            aria-expanded={!peek}
            aria-controls="setup-controls"
            onClick={() => { if (suppress.current) { suppress.current = false; return } onSnap(peek ? "default" : "peek") }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") { e.preventDefault(); bump(1) }
              if (e.key === "ArrowDown") { e.preventDefault(); bump(-1) }
              if (e.key === "Escape") { e.preventDefault(); onSnap("default") }
            }}
            onPointerDown={(e) => { if (e.button !== 0) return; drag.current = { id: e.pointerId, y: e.clientY, moved: false }; suppress.current = false; e.currentTarget.setPointerCapture(e.pointerId) }}
            onPointerMove={(e) => { const d = drag.current; if (d && d.id === e.pointerId && Math.abs(e.clientY - d.y) > 8) d.moved = true }}
            onPointerUp={(e) => {
              const d = drag.current
              if (!d || d.id !== e.pointerId) return
              drag.current = null
              if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
              if (d.moved) { suppress.current = true; bump(e.clientY < d.y ? 1 : -1) }
            }}
            onPointerCancel={() => { drag.current = null }}
          ><span aria-hidden="true" /></button>
        ) : null}
        <h1 id="step-title" tabIndex={-1} className="sf-title font-display" key={`t-${bodyKey}`}>{title}</h1>
        <div id="setup-controls" className="sf-body" inert={peek} key={bodyKey} data-testid="setup-body">{children}</div>
        {notice}
        <footer className="sf-foot">{footer}</footer>
      </section>

      <div className="sf-stage" data-testid="setup-stage">{preview}</div>
    </main>
  )
})
