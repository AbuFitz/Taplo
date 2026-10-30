"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, GripVertical, MousePointer2, Play, X } from "lucide-react"

/** A small, on-demand motion walkthrough. These are illustrations, never the owner's editable page. */
export function StudioGuide() {
  const [open, setOpen] = React.useState(false)
  const [topic, setTopic] = React.useState<"design" | "organise">("design")
  return <section className="studio-guide" aria-label="A quick guide">
    <button className="studio-guide-trigger" type="button" aria-expanded={open} aria-controls="studio-guide-content" onClick={() => setOpen(!open)}>
      <span className="studio-guide-play"><Play aria-hidden="true" /></span><span><strong>Make yourself at home</strong><small>Two quick ways to shape your page</small></span>{open ? <X aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
    </button>
    {open ? <div id="studio-guide-content" className="studio-guide-content">
      <div className="studio-guide-topics" role="group" aria-label="Guide topic">
        <button type="button" aria-pressed={topic === "design"} onClick={() => setTopic("design")}>Change the look</button>
        <button type="button" aria-pressed={topic === "organise"} onClick={() => setTopic("organise")}>Arrange content</button>
      </div>
      <div className="studio-guide-demo" data-topic={topic} aria-hidden="true" key={topic}>
        <div className="studio-guide-mini"><span className="studio-guide-monogram">N</span><b>Your business</b><span className="studio-guide-demo-action">Get in touch</span>
          <div className="studio-guide-demo-row"><GripVertical />Services<span>£35</span></div>
          <div className="studio-guide-demo-row"><GripVertical />Our team<span>3 people</span></div>
        </div>
        {topic === "design" ? <div className="studio-guide-swatches"><i /><i /><i /><MousePointer2 /></div> : <MousePointer2 className="studio-guide-cursor" />}
      </div>
      <p>{topic === "design" ? "Open Design in the editor. Choose a look, then explore its coordinated colours. Your content stays yours." : "Open Content in the editor, then Organise. Drag a handle to move a section, or use the move arrows. Choose Done when it feels right."}</p>
      <Link href="/dashboard/page">Try it on your page<ArrowRight aria-hidden="true" /></Link>
    </div> : null}
  </section>
}
