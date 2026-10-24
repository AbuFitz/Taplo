"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Shot } from "../Shot"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: "story-1-menu", capture: "svc-menu-barber", title: "See what it costs", body: "A haircut, a valet or a lesson. The price and the useful details sit together, so customers know what they are choosing.", alt: "Jay’s Barbers price menu: haircut £22, skin fade £25 and scissor cut £32" },
  { id: "story-2-detail", capture: "svc-detail", title: "Take a closer look", body: "What is included, how long it takes and who can help. One tap opens the detail without losing the page.", alt: "Haircut detail showing £22, 30 minutes and the eligible barbers" },
  { id: "story-3-time", capture: "bk-2-time", title: "Find a time that fits", body: "Choose a day, see the available times and add your details. The page follows the working hours and booking rules you set.", alt: "The actual day and time picker for a Jay’s Barbers haircut" },
  { id: "story-4-done", capture: "bk-5-done", title: "Know what happens next", body: "A booking gets a confirmation. A request clearly waits for your approval. An enquiry keeps the conversation open.", alt: "The local demo booking confirmation with service, time and calendar action" },
] as const

/** A voluntary, stable product walkthrough: no scroll hijacking or automatic screen changes. */
export function BookingStory() {
  const [active, setActive] = React.useState(0)
  const step = STEPS[active]!
  const uid = React.useId()
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([])
  function choose(index: number, focus = false) {
    const next = (index + STEPS.length) % STEPS.length
    setActive(next)
    if (focus) buttons.current[next]?.focus()
  }
  return <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-24">
    <div role="tablist" aria-label="From a price to a booking" aria-orientation="vertical" className="grid gap-1">
      {STEPS.map((s, n) => <div key={s.id} className={cn("border-t border-white/15", n === STEPS.length - 1 && "border-b")}>
        <button ref={el => { buttons.current[n] = el }} id={`${uid}-tab-${n}`} type="button" role="tab" aria-selected={active === n} aria-controls={`${uid}-panel-${n}`} tabIndex={active === n ? 0 : -1} onClick={() => choose(n)} onKeyDown={e => { const next = e.key === "ArrowDown" ? active + 1 : e.key === "ArrowUp" ? active - 1 : e.key === "Home" ? 0 : e.key === "End" ? STEPS.length - 1 : null; if (next !== null) { e.preventDefault(); choose(next, true) } }} className="flex min-h-20 w-full items-center gap-5 rounded px-1 py-5 text-left outline-none focus-visible:ring-3 focus-visible:ring-white">
          <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold", active === n ? "bg-white text-black" : "border border-white/25")}>{n + 1}</span><span className="font-display text-[clamp(1.375rem,2.2vw,2rem)] leading-tight tracking-tight">{s.title}</span><ArrowRight aria-hidden="true" className={cn("ml-auto size-5 shrink-0", active !== n && "opacity-30")} />
        </button>
        <p className={cn("max-w-lg pb-6 pl-[3.625rem] pr-3 text-base leading-relaxed text-white/60", active !== n && "hidden")}>{s.body}</p>
      </div>)}
    </div>
    <div className="min-w-0">
      {STEPS.map((s, n) => <div key={s.id} id={`${uid}-panel-${n}`} role="tabpanel" aria-labelledby={`${uid}-tab-${n}`} hidden={active !== n} tabIndex={0} className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-white">
        <div className="booking-object-scene"><Shot id={s.capture} alt={s.alt} width={520} frame="none" fluid className="w-full" /></div>
      </div>)}
      <Link href="/inspiration/jays-barbers" className="mx-auto mt-6 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold underline underline-offset-4">Try the example yourself<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      <p className="mt-2 text-center text-xs text-white/60">{step.id === "story-4-done" ? "Demo confirmation. Nothing is sent to a business." : "Jay’s Barbers · design example"}</p>
    </div>
  </div>
}
