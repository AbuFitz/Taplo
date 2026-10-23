"use client"

import * as React from "react"
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * One story, told with the real product: a price on the page becomes a booking. Each step is a real capture of the page
 * renderer at phone size. From a large screen the phone stays in view while the words scroll past and the screen changes
 * with them; on a phone, or with reduced motion, the steps simply stack and nothing moves on its own.
 */
const STEPS = [
  { id: "story-1-menu", title: "Customers see what it costs.", body: "Prices sit on the page, grouped the way you sell them. Nobody has to ask first." },
  { id: "story-2-detail", title: "One tap shows the detail.", body: "How long it takes, who does it and what happens next, before anyone picks up the phone." },
  { id: "story-3-time", title: "They choose a time that suits them.", body: "Days and times come from your working hours, so every slot on screen is one you can take." },
  { id: "story-4-done", title: "Both of you have the booking.", body: "They see a clear confirmation and can add it to their calendar. It lands in your diary." },
] as const

const ALT: Record<(typeof STEPS)[number]["id"], string> = {
  "story-1-menu": "A price menu: signature cut £34, skin fade £32, junior cut £22",
  "story-2-detail": "The signature cut opened: £34, 45 minutes, and the barbers who provide it",
  "story-3-time": "A day and time picker with morning slots",
  "story-4-done": "A booking confirmation with the service, day, time and price",
}

export function BookingStory() {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.9"] })
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)))))
  const step = STEPS[active]!

  return (
    <div ref={ref} className="relative">
      {/* Phones and small screens, and reduced motion: the steps stack. */}
      <ol className="grid gap-16 lg:hidden">
        {STEPS.map((s) => (
          <li key={s.id} className="grid gap-6">
            <div><h3 className="font-display text-[1.75rem] leading-[1.05] text-balance">{s.title}</h3><p className="mt-3 max-w-md text-lg leading-relaxed text-foreground/70">{s.body}</p></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/marketing/${s.id}.webp`} alt={ALT[s.id]} width={780} height={1688} loading="lazy" className="mx-auto w-[min(100%,19rem)] rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgb(10_16_32/0.6)]" />
          </li>
        ))}
      </ol>

      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12" style={{ height: `${STEPS.length * 62}vh` }}>
        <ol className="col-span-6 grid content-start">
          {STEPS.map((s, n) => (
            <li key={s.id} className="flex h-[62vh] flex-col justify-center" aria-current={n === active ? "step" : undefined}>
              <div className={cn("max-w-md transition-opacity duration-300", n === active ? "opacity-100" : "opacity-35")}>
                <h3 className="font-display text-[2.5rem] leading-[1.02] text-balance">{s.title}</h3>
                <p className="mt-4 text-xl leading-relaxed text-foreground/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="col-span-6">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] min-h-[32rem] items-center justify-center">
            <div className="relative aspect-[390/844] h-[min(100%,46rem)] overflow-hidden rounded-[2.25rem] bg-[#0a1020] shadow-[0_0_0_1px_rgb(10_16_32/0.14),0_50px_90px_-40px_rgb(10_16_32/0.7)]">
              <AnimatePresence initial={false} mode="popLayout">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img key={step.id} src={`/marketing/${step.id}.webp`} alt={ALT[step.id]} width={780} height={1688}
                  initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute inset-0 block size-full object-cover object-top" />
              </AnimatePresence>
            </div>
            <ul className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2" aria-hidden="true">
              {STEPS.map((s, n) => <li key={s.id} className={cn("h-8 w-1 rounded-full transition-colors", n === active ? "bg-signal" : "bg-foreground/15")} />)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
