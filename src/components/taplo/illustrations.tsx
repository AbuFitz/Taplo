"use client"
import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { Scene, type SceneName } from "./scenes"

/**
 * Small, consistent line illustrations for empty, locked and connect moments.
 * One 1.75 stroke, rounded joins, the surrounding text colour for lines and the accent for one highlight.
 * Drawn in code so they follow light and dark, stay a few hundred bytes, and show a complete static frame
 * when the visitor prefers reduced motion.
 */
export type IllustrationName = "analytics" | "bookings" | "profile" | "upgrade" | "verify" | "connect"

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const

function Draw({ d, delay = 0, accent = false, reduce }: { d: string; delay?: number; accent?: boolean; reduce: boolean }) {
  const props = accent ? { ...STROKE, stroke: "var(--illus-accent, currentColor)" } : STROKE
  return reduce
    ? <path d={d} {...props} />
    : <motion.path d={d} {...props} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7, delay, ease: "easeOut" }} />
}

const ART: Record<IllustrationName, (reduce: boolean) => React.ReactNode> = {
  analytics: (r) => <>
    <Draw reduce={r} d="M14 78h92" />
    <Draw reduce={r} d="M26 78V58M48 78V44M70 78V52M92 78V30" delay={0.1} />
    <Draw reduce={r} d="M22 40l22-14 22 8 26-20" accent delay={0.4} />
    <Draw reduce={r} d="M84 14h8v8" accent delay={0.9} />
  </>,
  bookings: (r) => <>
    <Draw reduce={r} d="M20 28h80a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V34a6 6 0 0 1 6-6Z" />
    <Draw reduce={r} d="M14 46h92M38 20v14M82 20v14" delay={0.15} />
    <Draw reduce={r} d="M50 66l7 7 14-15" accent delay={0.45} />
  </>,
  profile: (r) => <>
    <Draw reduce={r} d="M34 14h52a8 8 0 0 1 8 8v60a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z" />
    <Draw reduce={r} d="M60 34a8 8 0 1 0 0 .01M46 64h28M50 74h20" delay={0.2} />
    <Draw reduce={r} d="M86 14l8-8M94 14h-8v-8" accent delay={0.7} />
  </>,
  upgrade: (r) => <>
    <Draw reduce={r} d="M40 52v-8a20 20 0 0 1 40 0v8" />
    <Draw reduce={r} d="M32 52h56a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V58a6 6 0 0 1 6-6Z" delay={0.15} />
    <Draw reduce={r} d="M60 66v8" accent delay={0.5} />
  </>,
  verify: (r) => <>
    <Draw reduce={r} d="M60 12l30 10v22c0 20-13 32-30 40-17-8-30-20-30-40V22l30-10Z" />
    <Draw reduce={r} d="M47 50l9 9 17-19" accent delay={0.45} />
  </>,
  connect: (r) => <>
    <Draw reduce={r} d="M34 30a36 36 0 0 1 0 40M46 38a22 22 0 0 1 0 24" />
    <Draw reduce={r} d="M58 46a8 8 0 0 1 0 8" delay={0.15} />
    <Draw reduce={r} d="M74 28h24a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H74a6 6 0 0 1-6-6V34a6 6 0 0 1 6-6Z" accent delay={0.4} />
  </>,
}

export function Illustration({ name, className, label }: { name: IllustrationName; className?: string; label?: string }) {
  const reduce = !!useReducedMotion()
  return (
    <svg viewBox="0 0 120 96" className={cn("h-24 w-30 text-foreground/70 [--illus-accent:var(--foreground)]", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      {ART[name](reduce)}
    </svg>
  )
}

/** The shape every empty, locked or not-yet-connected screen follows: a picture, one message, one next action. */
export function EmptyPanel({ illustration, scene, title, children, action, className }: { illustration?: IllustrationName; scene?: SceneName; title: string; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <section className={cn("grid max-w-3xl items-center gap-6 overflow-hidden rounded-3xl border bg-card p-6 sm:p-8", scene && "md:grid-cols-[1fr_1.1fr]", className)} data-testid="empty-panel">
      {scene ? <Scene name={scene} className="order-first max-w-sm md:order-last" /> : null}
      <div className="grid justify-items-start gap-3">
      {illustration && !scene ? <Illustration name={illustration} /> : null}
      <h2 className="text-lg font-semibold">{title}</h2>
      {children ? <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground">{children}</div> : null}
      {action ? <div className="mt-1">{action}</div> : null}
      </div>
    </section>
  )
}
