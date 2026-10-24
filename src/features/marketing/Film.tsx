"use client"

import * as React from "react"
import { Play } from "lucide-react"
import { getImageProps } from "next/image"

const POSTER = getImageProps({ src: "/marketing/film/poster.webp", alt: "", width: 1920, height: 1080, sizes: "(min-width:1280px) 1100px, 90vw", loading: "lazy" }).props
const PHONE_POSTER = getImageProps({ src: "/marketing/film/taplo-portrait-poster.webp", alt: "", width: 1080, height: 1920, sizes: "90vw", loading: "lazy" }).props

/**
 * The 18-second Taplo film (source: marketing/film, rendered with HyperFrames). It never autoplays and never loads
 * until asked: the poster is a sharp still, the film starts on a click, and the same story is written out below it
 * for anyone who cannot or would rather not watch.
 */
export const FILM_BEATS = [
  "Your business, one good page: Station Road Barbers brings its work, prices and booking together.",
  "A price, a time, you’re in: the haircut detail leads to the working booking journey.",
  "Same business, your own look: four designs show the same name, services and photos.",
  "Stock worth a closer look: Brookfield Motors shows large photographs, specifications and viewing requests.",
  "One link, more places: a branded share card carries the business name and QR code.",
  "Your business, all together. Start free and make your Taplo.",
] as const

export function Film({ className }: { className?: string }) {
  const [started, setStarted] = React.useState(false)
  return (
    <figure className={className}>
      <div className="relative aspect-[9/16] w-full sm:aspect-video overflow-hidden rounded-3xl bg-[#0b0d12] shadow-[0_30px_70px_-30px_rgb(0_0_0/0.5)]">
        {started ? (
          <video className="absolute inset-0 size-full" poster="/marketing/film/poster.webp" controls autoPlay playsInline muted preload="auto" aria-describedby="film-text">
            <source media="(max-width: 639px)" src="/marketing/film/taplo-portrait.mp4" type="video/mp4" />
            <source src="/marketing/film/taplo-intro.mp4" type="video/mp4" />
            Your browser cannot play this video. The same story is written out below it.
          </video>
        ) : (
          <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 grid place-items-center outline-none focus-visible:ring-3 focus-visible:ring-ring/60">
            <picture><source media="(max-width: 639px)" srcSet={PHONE_POSTER.srcSet} sizes={PHONE_POSTER.sizes} width={1080} height={1920} /><img {...POSTER} alt="" className="absolute inset-0 size-full object-cover" /></picture>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-white/95 py-2 pl-2 pr-4 text-sm font-semibold text-black shadow-xl transition-transform group-hover:scale-[1.03] motion-reduce:transition-none sm:bottom-6 sm:left-6"><span className="grid size-9 place-items-center rounded-full bg-black text-white"><Play aria-hidden="true" className="size-4 translate-x-px fill-current" /></span>Play, 18 seconds</span>
          </button>
        )}
      </div>
      <figcaption id="film-text" className="mt-4 text-sm text-foreground/60">
        <span className="font-semibold text-foreground">18 seconds, no sound.</span>
        <details className="mt-3"><summary className="w-fit cursor-pointer rounded py-2 font-medium outline-none focus-visible:ring-3 focus-visible:ring-current">Read the film</summary><ol className="mt-2 grid list-decimal gap-2 pl-5">{FILM_BEATS.map((b) => <li key={b}>{b}</li>)}</ol></details>
      </figcaption>
    </figure>
  )
}
