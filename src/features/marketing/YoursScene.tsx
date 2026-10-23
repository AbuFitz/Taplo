"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Shot } from "./Shot"
import { cn } from "@/lib/utils"

/**
 * Scene B, "Make it yours". The four stages are real renderer captures of one business with the
 * overrides listed beside them (marketing/captures.json), so what is claimed is what the editor can do.
 */
const STAGES = [
  { id: "yours-1-clean", label: "Start from a look", detail: "The Clean look, exactly as it comes. Nothing changed yet.", changes: ["Look: Clean"], alt: "A barber's page in the light Clean look" },
  { id: "yours-2-colour", label: "Choose your colours", detail: "Page, text, card and accent colours, all from the colour controls.", changes: ["Page and card colours", "Accent: gold", "Text and borders"], alt: "The same page with a deep green and gold colour scheme" },
  { id: "yours-3-type", label: "Pick type and a header", detail: "A serif and sans pairing, and the header turned into a photo poster.", changes: ["Fonts: Fraunces and Inter", "Heading weight: bold", "Header: poster"], alt: "The same page with serif headings and a full photographic header" },
  { id: "yours-4-final", label: "Finish the details", detail: "Pill buttons, frosted cards and a soft gradient wallpaper.", changes: ["Buttons: solid pill", "Cards: frosted, large corners", "Wallpaper: gradient"], alt: "The finished page with frosted cards and pill buttons" },
] as const

export function YoursScene() {
  const [i, setI] = React.useState(0)
  const reduce = useReducedMotion()
  const stage = STAGES[i]!
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-20">
      <div>
        <ol className="grid gap-2" aria-label="Customisation steps">
          {STAGES.map((s, n) => (
            <li key={s.id}>
              <button type="button" onClick={() => setI(n)} aria-current={n === i ? "step" : undefined} className={cn("group grid w-full grid-cols-[2.5rem_1fr] gap-x-3 rounded-2xl px-4 py-4 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60", n === i ? "bg-foreground text-background" : "hover:bg-foreground/5")}>
                <span className={cn("font-display text-2xl tabular-nums", n === i ? "text-background/60" : "text-foreground/30")}>{String(n + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-lg font-semibold tracking-[-0.02em]">{s.label}</span>
                  {n === i ? <span className="mt-1 block text-[0.9375rem] leading-relaxed text-background/75">{s.detail}</span> : null}
                  {n === i ? <span className="mt-3 flex flex-wrap gap-1.5">{s.changes.map((c) => <span key={c} className="rounded-full bg-background/12 px-2.5 py-1 text-xs font-medium">{c}</span>)}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-foreground/60">Every choice above is a control in the real editor. Same words, same prices, same photos throughout.</p>
      </div>
      <div className="relative mx-auto h-[min(40rem,150vw)] w-full max-w-[25rem] overflow-hidden rounded-[2rem]" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={stage.id} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }} transition={{ duration: reduce ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0">
            <Shot id={stage.id} alt={stage.alt} width={400} className="mx-auto" cropTo={640} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
      </div>
    </div>
  )
}
