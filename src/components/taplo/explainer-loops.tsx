"use client"
import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Short looping explainers for features, drawn in code with the same stroke as the illustrations.
 * Each is a few frames of cause and effect; with reduced motion the final frame is shown still, and it explains the feature on its own.
 */
export type LoopName = "share" | "booking" | "photos"

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const
const A = { ...S, stroke: "var(--loop-accent, currentColor)" } as const

function Loop({ children, reduce, times, duration = 4.8 }: { children: (p: { t: number[]; d: number; reduce: boolean }) => React.ReactNode; reduce: boolean; times: number[]; duration?: number }) {
  return <>{children({ t: times, d: duration, reduce })}</>
}

/** Fade a group in at `at` (0-1 of the loop), hold, and fade it out at the end so the loop restarts cleanly. */
function Step({ at, d, reduce, children }: { at: number; d: number; reduce: boolean; children: React.ReactNode }) {
  if (reduce) return <g>{children}</g>
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: d, times: [0, at, Math.min(at + 0.08, 0.95), 0.92, 1], repeat: Infinity, ease: "easeOut" }}>{children}</motion.g>
}

const SCENES: Record<LoopName, (reduce: boolean) => React.ReactNode> = {
  share: (r) => <Loop reduce={r} times={[0.05, 0.35, 0.65]}>{({ d, reduce }) => <>
    <Step at={0.02} d={d} reduce={reduce}><path d="M14 20h28v28H14z M20 26h6v6h-6z M30 26h6v6h-6z M20 36h6v6h-6z M32 38h6v4h-6z" {...S} /></Step>
    <Step at={0.3} d={d} reduce={reduce}><path d="M48 34h22" {...A} /><path d="M64 28l6 6-6 6" {...A} /></Step>
    <Step at={0.55} d={d} reduce={reduce}><rect x="78" y="10" width="34" height="60" rx="7" {...S} /><path d="M86 24h18M86 34h12M86 46h18" {...S} /><path d="M86 56h18" {...A} /></Step>
  </>}</Loop>,
  booking: (r) => <Loop reduce={r} times={[0.05, 0.35, 0.65]}>{({ d, reduce }) => <>
    <Step at={0.02} d={d} reduce={reduce}><rect x="10" y="12" width="52" height="46" rx="6" {...S} /><path d="M10 26h52M24 8v8M48 8v8" {...S} /></Step>
    <Step at={0.28} d={d} reduce={reduce}><rect x="18" y="34" width="14" height="10" rx="3" {...A} /></Step>
    <Step at={0.52} d={d} reduce={reduce}><rect x="76" y="22" width="40" height="30" rx="6" {...S} /><path d="M86 38l6 6 12-12" {...A} /></Step>
  </>}</Loop>,
  photos: (r) => <Loop reduce={r} times={[0.05, 0.35, 0.65]}>{({ d, reduce }) => <>
    <Step at={0.02} d={d} reduce={reduce}><rect x="10" y="14" width="40" height="34" rx="6" {...S} /><path d="M14 42l12-12 10 10 6-6 8 8" {...S} /></Step>
    <Step at={0.28} d={d} reduce={reduce}><rect x="56" y="14" width="26" height="34" rx="6" {...S} /><rect x="88" y="14" width="26" height="34" rx="6" {...S} /></Step>
    <Step at={0.52} d={d} reduce={reduce}><path d="M20 60h92" {...A} /></Step>
  </>}</Loop>,
}

export function ExplainerLoop({ name, className, label }: { name: LoopName; className?: string; label: string }) {
  const reduce = !!useReducedMotion()
  return (
    <svg viewBox="0 0 124 76" role="img" aria-label={label} className={cn("h-20 w-full max-w-40 text-foreground/75 [--loop-accent:var(--foreground)]", className)} focusable="false">
      {SCENES[name](reduce)}
    </svg>
  )
}
