"use client"

import * as React from "react"
import { ArrowDown, ArrowRight, Check, GripVertical, HelpCircle, Image, Layers3, Palette, Plus, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import "./context-help.css"

export type HelpTopic = "blocks" | "order" | "design"
const subscribeHelp = (cb: () => void) => { window.addEventListener("taplo:help", cb); window.addEventListener("storage", cb); return () => { window.removeEventListener("taplo:help", cb); window.removeEventListener("storage", cb) } }
const GUIDES = {
  blocks: { title: "Build with blocks", steps: ["Choose what customers need", "Add the first entry", "Adjust it on your page"], body: ["Add content opens the block library. Search for services, photos, products or anything else you want to show.", "Add your real details in the same panel. Existing business records can be reused.", "Tap a block to edit it. Use its menu to hide it or change its position."], Icons: [Layers3, Plus, Check] },
  order: { title: "Put the important things first", steps: ["Pick up the handle", "Move the block", "Drop it into place"], body: ["Press and hold the dotted handle beside a block. The rest of the row still scrolls normally.", "Drag up or down to choose its new position. You can also use Move in the block menu.", "Release to save the order. Undo will put it back. Keyboard: Space, arrow keys, then Space."], Icons: [GripVertical, ArrowDown, Check] },
  design: { title: "Make the look yours", steps: ["Choose a starting look", "Find your colours", "Keep your content"], body: ["Pick a look to change typography, profile layout and block styling together.", "Use coordinated colours, then adjust individual details if you want more control.", "Your business details stay in place. Undo takes you back if you prefer the previous look."], Icons: [Image, Palette, Check] },
} as const

/** Help is attached to the task. No timers, autoplay, blocking tours or repeated automatic modals. */
export function ContextHelp({ topic }: { topic: HelpTopic }) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const seen = React.useSyncExternalStore(subscribeHelp, () => { try { return localStorage.getItem(`taplo.help.v1.${topic}`) === "done" } catch { return false } }, () => false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const guide = GUIDES[topic]
  const finish = () => {
    try { localStorage.setItem(`taplo.help.v1.${topic}`, "done") } catch { /* optional preference */ }
    window.dispatchEvent(new Event("taplo:help")); setOpen(false)
  }
  const Icon = guide.Icons[step]!
  return <Popover open={open} onOpenChange={o => { setOpen(o); if (o) setStep(0) }}>
    <PopoverTrigger asChild><button ref={trigger} type="button" className="context-help-trigger" aria-label={`Help: ${guide.title}`}><HelpCircle aria-hidden="true" /><span>{seen ? "Quick guide" : topic === "order" ? "How to reorder" : topic === "design" ? "How design works" : "How blocks work"}</span></button></PopoverTrigger>
    <PopoverContent className="context-help" side="bottom" align="end" sideOffset={10} onCloseAutoFocus={e => { e.preventDefault(); trigger.current?.focus() }}>
      <div className="context-help-top"><strong>{guide.title}</strong><button type="button" onClick={() => setOpen(false)} aria-label="Close guide"><X aria-hidden="true" /></button></div>
      <div className="context-help-art" data-topic={topic} data-step={step} aria-hidden="true"><div className="context-help-page"><i /><b>Your business</b><span>Get in touch</span><div className={step === 1 && topic === "order" ? "help-row-moved" : ""}><GripVertical />Services</div><div><GripVertical />Our team</div></div><span className="context-help-symbol"><Icon /></span></div>
      <div className="context-help-progress" aria-label={`Guide step ${step + 1} of 3`}>{guide.steps.map((s,i) => <button key={s} type="button" aria-label={s} aria-current={step === i ? "step" : undefined} onClick={() => setStep(i)} />)}</div>
      <h3>{guide.steps[step]}</h3><p>{guide.body[step]}</p>
      <div className="context-help-actions"><button type="button" onClick={finish}>Got it</button>{step > 0 ? <button type="button" onClick={() => setStep(step - 1)}>Back</button> : null}{step < 2 ? <button type="button" className="context-help-next" onClick={() => setStep(step + 1)}>Next<ArrowRight aria-hidden="true" /></button> : null}</div>
    </PopoverContent>
  </Popover>
}
