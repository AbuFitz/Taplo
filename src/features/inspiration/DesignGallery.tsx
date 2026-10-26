"use client"

import * as React from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { DESIGNS, type Design, type DesignMood } from "@/features/page/themes/designs"
import { DesignThumb } from "@/features/setup/DesignThumb"
import { sampleScenario } from "@/features/setup/sample"
import { SCENARIOS } from "@/features/showcase/content"
import { PagePreview } from "@/features/preview/PagePreview"
import { Overlay } from "@/components/taplo/overlay"
import { ApplyDesign } from "./ApplyDesign"
import { cn } from "@/lib/utils"
import "./design-gallery.css"

/** Kinds of business the shelf can be shown on. Every design works for every business; this only changes the sample page shown. */
const BUSINESSES: { id: string; label: string; industry: string }[] = [
  { id: "salon", label: "Hair and beauty", industry: "barber" },
  { id: "trades", label: "Trades", industry: "plumber" },
  { id: "food", label: "Food and drink", industry: "hospitality" },
  { id: "fitness", label: "Fitness", industry: "personal-trainer" },
  { id: "teaching", label: "Teaching", industry: "tutor" },
  { id: "clinic", label: "Clinics", industry: "physio" },
  { id: "pro", label: "Professional", industry: "consultant" },
  { id: "creative", label: "Creative", industry: "photographer" },
  { id: "motor", label: "Motoring", industry: "car-dealer" },
  { id: "maker", label: "Makers", industry: "maker" },
]
const MOODS: (DesignMood | "Moving")[] = ["Light", "Dark", "Colourful", "Editorial", "Minimal", "Bold", "Soft", "Playful", "Moving"]

/** The design shelf: pick a kind of business and every design is shown on a page like yours; narrow by mood; open one to see it properly. */
export function DesignGallery() {
  const [biz, setBiz] = React.useState(BUSINESSES[0]!)
  const [mood, setMood] = React.useState<DesignMood | "Moving" | null>(null)
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState<Design | null>(null)
  const q = query.trim().toLowerCase()
  const shown = DESIGNS.filter((d) => (!mood || (mood === "Moving" ? d.motion === "Moving background" : d.moods.includes(mood))) && (!q || [d.name, d.blurb, ...d.moods].join(" ").toLowerCase().includes(q)))
    .sort((a, b) => Number(b.suits.includes(biz.industry)) - Number(a.suits.includes(biz.industry)))
  const sample = SCENARIOS[sampleScenario(biz.industry)].content
  return (
    <div className="dg">
      <header className="dg-head">
        <h1>Designs that look like they were made for you.</h1>
        <p>Pick a kind of business and see every design on a page like yours. Open one to try it, then make it your own.</p>
      </header>

      <div className="dg-controls">
        <div className="dg-search"><Search aria-hidden="true" /><input type="search" aria-label="Search designs" placeholder="Search by name or mood" value={query} onChange={(e) => setQuery(e.target.value)} />{query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X aria-hidden="true" /></button> : null}</div>
        <div className="dg-chips" role="group" aria-label="Show designs on">
          <span className="dg-chips-label">Shown on</span>
          {BUSINESSES.map((b) => <button key={b.id} type="button" aria-pressed={biz.id === b.id} onClick={() => setBiz(b)}>{b.label}</button>)}
        </div>
        <div className="dg-chips" role="group" aria-label="Filter by mood">
          <span className="dg-chips-label">Mood</span>
          <button type="button" aria-pressed={mood === null} onClick={() => setMood(null)}>All</button>
          {MOODS.map((m) => <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(mood === m ? null : m)}>{m}</button>)}
        </div>
      </div>

      <ul className="dg-grid" data-testid="gallery-list">
        {shown.map((d) => (
          <li key={d.id} className="dg-card" data-testid="design-card">
            <DesignThumb design={d} industryKey={biz.industry} own={sample} height={640} />
            <div className="dg-meta">
              <div><h2>{d.name}</h2><p>{d.moods.slice(0, 3).join(" · ")}{d.motion === "Moving background" ? " · Moving" : ""}</p></div>
              {d.suits.includes(biz.industry) ? <span className="dg-fit">Great for this</span> : null}
            </div>
            <button type="button" className="dg-hit" aria-label={`${d.name}, open this design`} onClick={() => setOpen(d)} />
          </li>
        ))}
      </ul>
      {shown.length === 0 ? <p className="dg-empty">No design matches. Try another mood or clear the search.</p> : null}

      <p className="dg-more">Looking for real pages? <Link href="/inspiration/marlowe-and-finch">See a worked example</Link>.</p>
      {open ? <Detail design={open} biz={biz} onBiz={setBiz} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}

function Detail({ design, biz, onBiz, onClose }: { design: Design; biz: (typeof BUSINESSES)[number]; onBiz: (b: (typeof BUSINESSES)[number]) => void; onClose: () => void }) {
  const [device, setDevice] = React.useState<"phone" | "computer">("phone")
  const scenario = sampleScenario(biz.industry)
  const src = `/appearance/frame?scenario=${scenario}&look=${design.id}`
  return (
    <Overlay open onOpenChange={(o) => !o && onClose()} kind="detail" title={design.name} description={design.blurb} testId="design-detail" className="dg-detail"
      footer={<div className="dg-detail-actions sf-ui"><ApplyDesign design={design} industry={biz.industry} className="sf-btn dg-use">Use this design</ApplyDesign></div>}>
      <div className="dg-detail-body sf-ui">
        <div className="dg-detail-view" data-device={device}>
          <PagePreview key={`${device}-${scenario}-${design.id}`} src={src} title={`${design.name} on a ${biz.label.toLowerCase()} page`} mode={device === "phone" ? "device" : "desktop"} chrome url="yourname.mytaplo.com" />
        </div>
        <div className="dg-detail-side">
          <div className="sf-seg" role="radiogroup" aria-label="Preview size">
            {(["phone", "computer"] as const).map((d) => <label key={d} data-on={device === d}><input type="radio" name="dg-device" aria-label={d === "phone" ? "Phone" : "Computer"} checked={device === d} onChange={() => setDevice(d)} /><span>{d === "phone" ? "Phone" : "Computer"}</span></label>)}
          </div>
          <div className="dg-detail-group"><h3>Shown on</h3><div className="dg-chips dg-wrap">{BUSINESSES.map((b) => <button key={b.id} type="button" aria-pressed={biz.id === b.id} onClick={() => onBiz(b)}>{b.label}</button>)}</div></div>
          <div className="dg-detail-group"><h3>The feel</h3><div className="dg-tags">{design.moods.map((m) => <span key={m}>{m}</span>)}{design.motion === "Moving background" ? <span>Moving background</span> : null}</div></div>
          <p className="dg-detail-note">Every colour, typeface and layout can be changed afterwards. Your own content always stays yours.</p>
        </div>
      </div>
    </Overlay>
  )
}
