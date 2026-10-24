"use client"

import { useId, useState } from "react"
import { SilentVideo } from "./Film"
import recordings from "../../../public/marketing/walkthroughs/manifest.json"

const CLIPS = [
  { id: "setup", label: "Make a page", description: "Start with a design, add your own name and service, then open the editor." },
  { id: "booking", label: "Book a haircut", description: "Open a service, choose a barber and time, check the details and see the outcome." },
] as const

/** Actual interaction recordings, silent and inline while visible; reduced motion uses a still. */
export function Walkthroughs() {
  const [selected, setSelected] = useState<(typeof CLIPS)[number]>(CLIPS[0])
  const uid = useId()
  const clip = recordings[selected.id]
  return (
    <div data-testid="walkthroughs" className="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,340px)] md:gap-16">
      <div>
        <h2 id={`${uid}-title`} className="font-display text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight">Watch it happen.</h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/70">The actual setup and booking flow, from first choice to outcome. Recorded on a phone layout, with time to follow along.</p>
        <div role="group" aria-label="Choose a walkthrough" className="mt-7 grid grid-cols-2 gap-3">
          {CLIPS.map(c => <button key={c.id} type="button" aria-pressed={selected.id === c.id} onClick={() => { setSelected(c) }} className={`min-h-20 rounded-xl border-2 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-signal/50 ${selected.id === c.id ? "border-signal bg-[#f4f4f4]" : "border-foreground/15 bg-white hover:border-foreground/40"}`}><span className="block font-semibold">{c.label}</span><span className="mt-1 block text-sm text-foreground/65">{Math.round(recordings[c.id].duration)} seconds · no sound</span></button>)}
        </div>
        <p className="mt-6 max-w-lg leading-relaxed">{selected.description}</p>
        <ol className="sr-only">{clip.chapters.map(c=><li key={c.title}>{c.title}. {c.line}</li>)}</ol>
        <p id={`${uid}-note`} className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/65">These recordings use Taplo’s preview. No appointment, payment or notification is sent.</p>
      </div>
      <figure className="mx-auto w-full max-w-[390px] md:max-w-none">
        <div className="relative aspect-[390/964] overflow-hidden rounded-3xl bg-[#080808]">
          <SilentVideo key={selected.id} sources={[{src:clip.file}]} poster={clip.poster} label={clip.title} testId="walkthrough-video"/>
        </div>
        <figcaption className="mt-3 text-center text-sm text-foreground/65">{clip.title} · captions included</figcaption>
      </figure>
    </div>
  )
}
