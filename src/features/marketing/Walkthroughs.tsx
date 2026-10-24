"use client"

import { useId, useState } from "react"
import { Play } from "lucide-react"
import recordings from "../../../public/marketing/walkthroughs/manifest.json"

const CLIPS = [
  { id: "setup", label: "Make a page", description: "Start with a design, add your own name and service, then open the editor." },
  { id: "booking", label: "Book a haircut", description: "Open a service, choose a barber and time, check the details and see the outcome." },
] as const

/** Optional real interaction recordings. No video request until the viewer presses Play. */
export function Walkthroughs() {
  const [selected, setSelected] = useState<(typeof CLIPS)[number]>(CLIPS[0])
  const [started, setStarted] = useState(false)
  const uid = useId()
  const clip = recordings[selected.id]
  return (
    <div data-testid="walkthroughs" className="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,340px)] md:gap-16">
      <div>
        <h2 id={`${uid}-title`} className="font-display text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight">Watch it happen.</h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/70">The actual setup and booking flow, from first choice to outcome. Recorded on a phone layout, with time to follow along.</p>
        <div role="group" aria-label="Choose a walkthrough" className="mt-7 grid grid-cols-2 gap-3">
          {CLIPS.map(c => <button key={c.id} type="button" aria-pressed={selected.id === c.id} onClick={() => { setSelected(c); setStarted(false) }} className={`min-h-20 rounded-xl border-2 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-signal/50 ${selected.id === c.id ? "border-signal bg-[#f4f4f4]" : "border-foreground/15 bg-white hover:border-foreground/40"}`}><span className="block font-semibold">{c.label}</span><span className="mt-1 block text-sm text-foreground/65">{Math.round(recordings[c.id].duration)} seconds · no sound</span></button>)}
        </div>
        <p className="mt-6 max-w-lg leading-relaxed">{selected.description}</p>
        <details key={selected.id} className="mt-5 max-w-lg border-y border-foreground/15 py-4">
          <summary className="cursor-pointer rounded py-1 font-semibold outline-none focus-visible:ring-3 focus-visible:ring-signal/50">Read this walkthrough</summary>
          <ol className="mt-4 grid list-decimal gap-4 pl-5 text-sm leading-relaxed">{clip.chapters.map(c => <li key={c.title}><strong>{c.title}.</strong> {c.line}</li>)}</ol>
        </details>
        <p id={`${uid}-note`} className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/65">Illustrative businesses. These recordings use the browser preview: drafts and bookings stay in this browser, and no payment or notification is sent.</p>
      </div>
      <figure className="mx-auto w-full max-w-[390px] md:max-w-none">
        <div className="relative aspect-[390/964] overflow-hidden rounded-2xl border border-foreground/15 bg-[#080808] shadow-[0_25px_60px_-35px_rgb(20_45_62/0.4)]">
          {started ? <video key={selected.id} data-testid="walkthrough-video" className="absolute inset-0 size-full" src={clip.file} poster={clip.poster} controls autoPlay playsInline muted preload="auto" aria-label={clip.title} aria-describedby={`${uid}-note`}><p>Your browser cannot play the recording. Read its steps alongside it.</p></video> : <button type="button" aria-label={`Play ${selected.label} walkthrough`} onClick={() => setStarted(true)} className="group absolute inset-0 outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={clip.poster} alt="" width={780} height={1928} loading="lazy" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080808] to-transparent" />
            <span className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-full bg-white p-2 pr-4 text-left text-sm font-semibold text-[#080808] shadow-xl"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#080808] text-white"><Play aria-hidden="true" className="size-4 fill-current" /></span>Play · {Math.round(clip.duration)} seconds</span>
          </button>}
        </div>
        <figcaption className="mt-3 text-center text-sm text-foreground/65">{clip.title} · captions included</figcaption>
      </figure>
    </div>
  )
}
