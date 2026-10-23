"use client"

import * as React from "react"
import { LayoutGroup, motion } from "motion/react"
import { ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Visual controls shared by every surface that edits appearance: the owner editor, guided setup
 * and the public showcase. They know nothing about where the values live; a host passes values
 * and callbacks (see model.ts).
 */

/** A titled group of controls. */
export function Section({ title, hint, action, children }: { title: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-black/[0.07] py-5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-[0.8125rem] font-semibold tracking-[-0.005em]">{title}</h3>
          {hint ? <p className="mt-0.5 text-xs text-neutral-600">{hint}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * Progressive disclosure. A native <details> keeps it keyboard- and screen-reader-complete
 * (and survives without JavaScript); the summary carries how many choices differ from the
 * starting look, with a reset for just this group.
 */
export function Disclosure({ title, hint, count, onReset, defaultOpen, id, children }: { title: string; hint?: string; count?: number; onReset?: () => void; defaultOpen?: boolean; id?: string; children: React.ReactNode }) {
  return (
    <details id={id} open={defaultOpen} className="group/disc min-w-0 rounded-2xl bg-black/[0.03] open:bg-transparent open:shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 rounded-2xl px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          {title}
          {count ? <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[0.6875rem] font-medium text-white">{count} changed</span> : null}
        </span>
        <ChevronRight aria-hidden="true" className="size-4 text-neutral-400 transition-transform duration-200 group-open/disc:rotate-90" />
      </summary>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 px-4 pb-5 pt-1">
        {hint ? <p className="-mt-1 text-xs text-neutral-600">{hint}</p> : null}
        {children}
        {onReset && count ? (
          <button type="button" onClick={onReset} className="inline-flex min-h-9 items-center gap-1.5 justify-self-start text-xs font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
            <RotateCcw aria-hidden="true" className="size-3" />Reset this section
          </button>
        ) : null}
      </div>
    </details>
  )
}

/** Labelled row with an optional "changed / reset" affordance for one value. */
export function Field({ label, dirty, onReset, hint, children }: { label: string; dirty?: boolean; onReset?: () => void; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-700">{label}{dirty ? <span className="ml-1.5 text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--signal)]">Changed</span> : null}</span>
        {dirty && onReset ? (
          <button type="button" onClick={onReset} className="inline-flex min-h-6 items-center gap-1 text-[0.6875rem] font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
            <RotateCcw aria-hidden="true" className="size-3" />Reset
          </button>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-neutral-600">{hint}</p> : null}
    </div>
  )
}

export interface Choice<T extends string> { value: T; label: string; preview?: React.ReactNode; disabled?: boolean }

/**
 * Visual single-choice selector. Selection stays on its tile rather than flying across
 * other previews when the grid scrolls or changes size. Native radios provide keyboard semantics.
 */
export function ChoiceGrid<T extends string>({ label, value, options, onChange, columns = 3 }: { label: string; value: T | undefined; options: Choice<T>[]; onChange: (v: T) => void; columns?: number }) {
  const id = React.useId()
  return (
      <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = value === o.value
          return (
            <label key={o.value} data-choice={o.value} className={cn("relative grid cursor-pointer gap-1.5 rounded-xl p-1.5 text-center outline-none transition-colors focus-within:ring-2 focus-within:ring-[var(--ring)]/60", on ? "bg-white shadow-[0_0_0_1.5px_rgb(23_23_23),0_6px_16px_-8px_rgb(0_0_0/0.35)]" : "hover:bg-black/[0.035]", o.disabled && "pointer-events-none opacity-45")}>
              <input type="radio" className="sr-only" name={id} value={o.value} checked={on} disabled={o.disabled} onChange={() => onChange(o.value)} />
              {o.preview ? <span className="relative block overflow-hidden rounded-lg">{o.preview}</span> : null}
              <span className={cn("relative text-[0.6875rem] leading-tight", on ? "font-semibold text-neutral-900" : "text-neutral-600")}>{o.label}</span>
            </label>
          )
        })}
      </div>
  )
}

/** Compact segmented control for small enumerations. */
export function Segment<T extends string>({ label, value, options, onChange }: { label: string; value: T | undefined; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const id = React.useId()
  return (
    <LayoutGroup id={id}>
      <div role="radiogroup" aria-label={label} className="grid rounded-[0.6875rem] bg-black/[0.055] p-0.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = value === o.value
          return (
            <label key={o.value} className="relative grid min-h-10 cursor-pointer place-items-center rounded-[0.5625rem] px-2 text-xs outline-none focus-within:ring-2 focus-within:ring-[var(--ring)]/60">
              <input type="radio" className="sr-only" name={id} value={o.value} checked={on} onChange={() => onChange(o.value)} />
              {on ? <motion.span layoutId="seg" transition={{ type: "spring", stiffness: 600, damping: 42 }} className="absolute inset-0 rounded-[0.5625rem] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.06)]" /> : null}
              <span className={cn("relative", on ? "font-semibold text-neutral-900" : "text-neutral-600")}>{o.label}</span>
            </label>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

/** On/off row. */
export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = React.useId()
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <label htmlFor={id} className="min-w-0 text-xs font-medium text-neutral-700">{label}{hint ? <span className="block font-normal text-neutral-600">{hint}</span> : null}</label>
      <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60", checked ? "bg-neutral-900" : "bg-black/[0.16]")}>
        <span className={cn("absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.3)] transition-transform duration-200", checked && "translate-x-5")} />
      </button>
    </div>
  )
}

/** Range with a visible value. */
export function Slider({ label, value, min, max, step = 1, unit = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  const id = React.useId()
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-xs"><label htmlFor={id} className="font-medium text-neutral-700">{label}</label><span className="tabular-nums text-neutral-600">{value}{unit}</span></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full accent-neutral-900" />
    </div>
  )
}
