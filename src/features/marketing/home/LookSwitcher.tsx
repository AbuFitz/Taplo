"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

const LOOKS = [
  { id: "night", name: "Night", note: "Dark, with one bright action", swatch: "#0d0e11", ink: "#c6f432" },
  { id: "clean", name: "Clean", note: "Light, calm and dependable", swatch: "#f5f5f5", ink: "#1f56ff" },
  { id: "colour", name: "Colour", note: "A saturated page that stands out", swatch: "#3a3af5", ink: "#ffd23f" },
  { id: "photo", name: "Photo", note: "A picture leads, the type sits on it", swatch: "#1b1a19", ink: "#ffffff" },
  { id: "showroom", name: "Showroom", note: "Crisp, structured and trustworthy", swatch: "#eef2f1", ink: "#14503f" },
  { id: "journal", name: "Mono", note: "Quiet and typographic", swatch: "#ffffff", ink: "#0a0a0a" },
  { id: "clay", name: "Terracotta", note: "Warm, rounded and friendly", swatch: "#c4472f", ink: "#fff3e8" },
  { id: "forge", name: "Forge", note: "Loud, condensed, high contrast", swatch: "#101010", ink: "#ff5a1f" },
  { id: "orchard", name: "Orchard", note: "Fresh, soft and green", swatch: "#e6f3e6", ink: "#1f7a4a" },
] as const

/**
 * The same business in every starting look. Each picture is the real page renderer (see public/looks), not a mock-up;
 * picking one only changes the look, and the words, prices and photos stay put.
 */
export function LookSwitcher() {
  const [i, setI] = React.useState(0)
  const reduce = useReducedMotion()
  const look = LOOKS[i]!
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div role="radiogroup" aria-label="Starting looks" className="grid gap-1.5">
          {LOOKS.map((l, n) => (
            <label key={l.id} className={cn("flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl px-4 py-2.5 outline-none transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/60", n === i ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]")}>
              <input type="radio" name="home-look" value={l.id} checked={n === i} onChange={() => setI(n)} className="sr-only" />
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20" style={{ background: l.swatch }}><span className="size-3 rounded-full" style={{ background: l.ink }} /></span>
              <span className="min-w-0"><span className="block font-semibold">{l.name}</span><span className={cn("block text-sm", n === i ? "text-background/70" : "text-foreground/60")}>{l.note}</span></span>
            </label>
          ))}
        </div>
        <Link href="/inspiration" className="mt-8 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">See every design on a desktop and a phone</Link>
      </div>
      <div className="relative lg:col-span-7">
        <div className="mx-auto w-[min(100%,25rem)]">
          <div className="relative aspect-[780/1080] overflow-hidden rounded-[2rem] bg-neutral-900 p-[6px] shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_50px_80px_-40px_rgb(0_0_0/0.55)]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img key={look.id} src={`/looks/${look.id}.webp`} alt={`The same barber's page in the ${look.name} look`} width={780} height={1080}
                initial={reduce ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-[6px] block h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[1.6rem] object-cover object-top" />
            </AnimatePresence>
          </div>
          <p className="mt-4 text-center text-sm text-foreground/60" aria-live="polite">{look.name}. Same words, same prices, same photos.</p>
        </div>
      </div>
    </div>
  )
}
