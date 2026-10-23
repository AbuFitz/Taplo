"use client"

import * as React from "react"
import { Play } from "lucide-react"

/**
 * The 18-second Taplo film (source: marketing/film, rendered with HyperFrames). It never autoplays and never loads
 * until asked: the poster is a sharp still, the film starts on a click, and the same story is written out below it
 * for anyone who cannot or would rather not watch.
 */
export const FILM_BEATS = [
  "Customers see prices first: a service opens with its price, length and who does it.",
  "Then they pick a time, in a few taps.",
  "Setting up is quick: add a service and the page fills in beside you.",
  "Start from a design and change anything about it.",
  "Share a QR code, a designed card or a link.",
  "One page for your business. Make your Taplo.",
] as const

export function Film({ className }: { className?: string }) {
  const [started, setStarted] = React.useState(false)
  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-[#0b0d12] shadow-[0_30px_70px_-30px_rgb(0_0_0/0.5)]">
        {started ? (
          <video className="absolute inset-0 size-full" src="/marketing/film/taplo-intro.mp4" poster="/marketing/film/poster.webp" controls autoPlay playsInline muted preload="auto" aria-describedby="film-text">
            Your browser cannot play this video. The same story is written out below it.
          </video>
        ) : (
          <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-ring/60" aria-label="Play the 18-second film">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/film/poster.webp" alt="" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-white/95 py-2 pl-2 pr-4 text-sm font-semibold text-black shadow-xl transition-transform group-hover:scale-[1.03] motion-reduce:transition-none sm:bottom-6 sm:left-6"><span className="grid size-9 place-items-center rounded-full bg-black text-white"><Play aria-hidden="true" className="size-4 translate-x-px fill-current" /></span>Play, 18 seconds</span>
          </button>
        )}
      </div>
      <figcaption id="film-text" className="mt-4 text-sm text-foreground/60">
        <span className="font-semibold text-foreground">18 seconds, no sound.</span>
        <ol className="mt-3 grid list-decimal gap-1 pl-5">{FILM_BEATS.map((b) => <li key={b}>{b}</li>)}</ol>
      </figcaption>
    </figure>
  )
}
