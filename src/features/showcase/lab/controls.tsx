"use client"

import * as React from "react"
import { LayoutGroup, motion } from "motion/react"
import { cn } from "@/lib/utils"

/** A titled group of controls. */
export function Section({ title, hint, action, children }: { title: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-black/[0.07] py-5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-[0.8125rem] font-semibold tracking-[-0.005em]">{title}</h3>
          {hint ? <p className="mt-0.5 text-xs text-neutral-500">{hint}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export interface Choice<T extends string> { value: T; label: string; preview?: React.ReactNode }

/**
 * Visual single-choice selector. Each option shows a miniature of what it does; the selection
 * ring glides between options (Motion shared layout), which is the one continuous, responsive
 * piece of feedback in the controls. Native radios underneath keep it keyboard and screen-reader complete.
 */
export function ChoiceGrid<T extends string>({ label, value, options, onChange, columns = 3 }: { label: string; value: T | undefined; options: Choice<T>[]; onChange: (v: T) => void; columns?: number }) {
  const id = React.useId()
  return (
    <LayoutGroup id={id}>
      <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = value === o.value
          return (
            <label key={o.value} className={cn("relative grid cursor-pointer gap-1.5 rounded-xl p-1.5 text-center outline-none transition-colors focus-within:ring-2 focus-within:ring-blue-500/60", on ? "" : "hover:bg-black/[0.035]")}>
              <input type="radio" className="sr-only" name={id} value={o.value} checked={on} onChange={() => onChange(o.value)} />
              {on ? <motion.span layoutId="choice-ring" transition={{ type: "spring", stiffness: 520, damping: 40 }} className="absolute inset-0 rounded-xl bg-white shadow-[0_0_0_1.5px_rgb(23_23_23),0_6px_16px_-8px_rgb(0_0_0/0.35)]" /> : null}
              {o.preview ? <span className="relative block overflow-hidden rounded-lg">{o.preview}</span> : null}
              <span className={cn("relative text-[0.6875rem] leading-tight", on ? "font-semibold text-neutral-900" : "text-neutral-600")}>{o.label}</span>
            </label>
          )
        })}
      </div>
    </LayoutGroup>
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
            <label key={o.value} className="relative grid min-h-8 cursor-pointer place-items-center rounded-[0.5625rem] px-2 text-xs outline-none focus-within:ring-2 focus-within:ring-blue-500/60">
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
