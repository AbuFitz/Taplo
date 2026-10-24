"use client"

import * as React from "react"
import Link from "next/link"
import { LOOKS, SPOTLIGHT_LOOK_IDS } from "@/features/page/themes/looks"
import { cn } from "@/lib/utils"

/** Every choice shows the same fictional business through the real appearance engine. */
export function LookSwitcher() {
  const [id, setId] = React.useState("voltage")
  const look = LOOKS.find((l) => l.id === id) ?? LOOKS[0]!
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
      <div>
        <p className="max-w-lg text-lg leading-relaxed text-foreground/65">Your name and prices stay put. Try a different mood, change a colour, bring in your own photos. You can keep making it yours.</p>
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-semibold">Try a starting look</legend>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-4">
            {LOOKS.filter(l => (SPOTLIGHT_LOOK_IDS as readonly string[]).includes(l.id)).map((l) => <label key={l.id} className="group min-w-0 cursor-pointer">
              <input type="radio" name="home-look" value={l.id} checked={id === l.id} onChange={() => setId(l.id)} className="peer sr-only" />
              <span className={cn("block overflow-hidden rounded-lg border-2 p-1 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/60", id === l.id ? "border-signal" : "border-transparent group-hover:border-foreground/30")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/looks/${l.id}.webp`} alt="" width={780} height={1080} loading="lazy" className="aspect-[0.85] w-full rounded object-cover object-top" />
              </span>
              <span className={cn("mt-1 block text-center text-xs", id === l.id ? "font-semibold text-foreground" : "text-foreground/65")}>{l.name}</span>
            </label>)}
          </div>
        </fieldset>
        <Link href="/inspiration" className="mt-7 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Explore the designs</Link>
      </div>
      <div className="rounded-xl border border-white/15 bg-[#141414] px-6 pb-7 pt-9 sm:px-12">
        <div className="mx-auto max-w-[22rem] overflow-hidden rounded-lg border border-white/15 bg-white shadow-[0_25px_50px_-20px_rgb(20_45_62/0.3)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/looks/${look.id}.webp`} alt={`Jay’s Barbers in the ${look.name} look`} width={780} height={1080} loading="lazy" className="block h-auto w-full" />
        </div>
        <div className="mx-auto mt-6 max-w-sm text-center" aria-live="polite"><p className="font-display text-2xl">{look.name}</p><p className="mt-1 text-sm leading-relaxed text-foreground/65">{look.blurb}</p></div>
      </div>
    </div>
  )
}
