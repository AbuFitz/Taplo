"use client"

import * as React from "react"
import { Play } from "lucide-react"

/**
 * The 15-second Taplo film (source: marketing/film, rendered with HyperFrames). It never autoplays and never loads
 * until asked: the poster is a sharp still, the film starts on a click, and the same story is written out below it
 * for anyone who cannot or would rather not watch.
 */
export const FILM_BEATS = [
  "Prices, up front: a service opens with its price and how long it takes.",
  "Pick a time: choose a day and time in the booking journey.",
  "Confirmed, or requested. It says which: a confirmed appointment and a pending request are worded differently.",
  "Nine looks, every one changeable: the same business, the same words and prices, only the look changes.",
  "One page for your business. Make your Taplo.",
] as const

export function Film({ className }: { className?: string }) {
  const [started, setStarted] = React.useState(false)
  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-[#14110f] shadow-[0_30px_70px_-30px_rgb(0_0_0/0.5)]">
        {started ? (
          <video className="absolute inset-0 size-full" src="/marketing/film/taplo-intro.mp4" poster="/marketing/film/poster.webp" controls autoPlay playsInline muted preload="auto" aria-describedby="film-text">
            Your browser cannot play this video. The same story is written out below it.
          </video>
        ) : (
          <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-ring/60" aria-label="Play the 15-second film">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/film/poster.webp" alt="" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
            <span className="relative grid size-20 place-items-center rounded-full bg-white/95 text-black shadow-xl transition-transform group-hover:scale-105 motion-reduce:transition-none"><Play aria-hidden="true" className="size-8 translate-x-0.5 fill-current" /></span>
          </button>
        )}
      </div>
      <figcaption id="film-text" className="mt-4 text-sm text-foreground/60">
        <span className="font-semibold text-foreground">15 seconds, no sound.</span> The film shows fictional businesses.
        <ol className="mt-3 grid list-decimal gap-1 pl-5">{FILM_BEATS.map((b) => <li key={b}>{b}</li>)}</ol>
      </figcaption>
    </figure>
  )
}
