"use client"

import * as React from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { getDesign, type Design } from "@/features/page/themes/designs"
import { DesignThumb } from "@/features/setup/DesignThumb"
import { SCENARIOS, type Scenario } from "@/features/showcase/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { PagePreview } from "@/features/preview/PagePreview"
import { Overlay } from "@/components/taplo/overlay"
import { ApplyDesign } from "./ApplyDesign"
import { exampleForScenario } from "./examples"
import { SHOWCASE } from "./showcase-set"
import "./design-gallery.css"

type Pick = { scenario: Scenario; design: Design; note: string; logo?: false }

/** A whole handset: bezel, island and a screen showing the real page from the top. Nothing is cropped by the card. */
function Phone({ pick, priority }: { pick: Pick; priority?: boolean }) {
  const sc = SCENARIOS[pick.scenario]
  const real = React.useMemo(() => ({ widgets: widgetsFor(pick.scenario) }), [pick.scenario])
  const overrides = React.useMemo(() => (pick.logo === false ? { ...pick.design.overrides, header: { ...pick.design.overrides.header, avatarShape: "none" as const } } : undefined), [pick])
  const own = React.useMemo(() => (pick.logo === false ? { ...sc.content, identity: { ...sc.content.identity, logo: undefined } } : sc.content), [sc, pick.logo])
  return (
    <span className="dg-phone" aria-hidden="true">
      <span className="dg-phone-screen">
        <DesignThumb design={pick.design} industryKey="" own={own} real={real} overrides={overrides} height={820} key={priority ? "p" : undefined} />
      </span>
      <span className="dg-island" />
    </span>
  )
}

/** The design shelf: different businesses, each on the design made for it. Open one to see it properly. */
export function DesignGallery() {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState<Pick | null>(null)
  const q = query.trim().toLowerCase()
  const groups = SHOWCASE.map((g) => ({
    ...g,
    items: g.items.flatMap((i) => {
      const design = getDesign(i.design)
      if (!design) return []
      const label = SCENARIOS[i.scenario].content.identity.name
      const hay = [label, i.note, design.name, SCENARIOS[i.scenario].label, g.title].join(" ").toLowerCase()
      return !q || hay.includes(q) ? [{ scenario: i.scenario, design, note: i.note, logo: i.logo }] : []
    }),
  })).filter((g) => g.items.length)
  return (
    <div className="dg">
      <header className="dg-head">
        <h1>Pages for every kind of business.</h1>
        <p>Barbers and bakers, plumbers and photographers. Each page is a real Taplo page on a design made for it. Open one to look closer, then make it yours.</p>
        <div className="dg-search"><Search aria-hidden="true" /><input type="search" aria-label="Search pages" placeholder="Search: florist, plumber, tutor…" value={query} onChange={(e) => setQuery(e.target.value)} />{query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : null}</div>
        <nav className="dg-jump" aria-label="Sections">{SHOWCASE.map((g) => <a key={g.id} href={`#${g.id}`}>{g.title}</a>)}</nav>
      </header>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="dg-group">
          <div className="dg-group-head"><h2>{g.title}</h2><p>{g.line}</p></div>
          <ul className="dg-shelf" data-testid="gallery-list">
            {g.items.map((p) => (
              <li key={p.scenario} className="dg-item" data-testid="design-card">
                <div className="dg-open">
                  <Phone pick={p} />
                  <button type="button" className="dg-hit" onClick={() => setOpen(p)} aria-label={`${SCENARIOS[p.scenario].content.identity.name}, open this page`} />
                </div>
                <div className="dg-meta"><h3>{SCENARIOS[p.scenario].content.identity.name}</h3><p>{p.note}</p><span className="dg-tag">{p.design.name}</span></div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {groups.length === 0 ? <p className="dg-empty">Nothing matches. Try a different word.</p> : null}
      {open ? <Detail pick={open} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}

function Detail({ pick, onClose }: { pick: Pick; onClose: () => void }) {
  const [device, setDevice] = React.useState<"phone" | "computer">("phone")
  const name = SCENARIOS[pick.scenario].content.identity.name
  const demo = exampleForScenario(pick.scenario)
  const src = `/appearance/frame?scenario=${pick.scenario}&look=${pick.design.id}${pick.logo === false ? "&logo=0" : ""}`
  return (
    <Overlay open onOpenChange={(o) => !o && onClose()} kind="detail" title={name} description={pick.note} testId="design-detail" className="dg-detail"
      footer={<div className="dg-detail-actions sf-ui">{demo ? <Link className="dg-demo" href={`/inspiration/${demo.slug}`} onClick={onClose}>Open the demo</Link> : null}<ApplyDesign design={pick.design} className="sf-btn dg-use">Use this design</ApplyDesign></div>}>
      <div className="dg-detail-body sf-ui">
        <div className="dg-detail-view" data-device={device}>
          <PagePreview key={`${device}-${pick.scenario}`} src={src} title={`${name} on the ${pick.design.name} design`} mode={device === "phone" ? "device" : "desktop"} chrome url="yourname.mytaplo.com" />
        </div>
        <div className="dg-detail-side">
          <div className="sf-seg" role="radiogroup" aria-label="Preview size">
            {(["phone", "computer"] as const).map((d) => <label key={d} data-on={device === d}><input type="radio" name="dg-device" aria-label={d === "phone" ? "Phone" : "Computer"} checked={device === d} onChange={() => setDevice(d)} /><span>{d === "phone" ? "Phone" : "Computer"}</span></label>)}
          </div>
          <div className="dg-detail-group"><h3>Design</h3><p className="dg-detail-note"><strong>{pick.design.name}.</strong> {pick.design.blurb}</p></div>
          <div className="dg-detail-group"><h3>The feel</h3><div className="dg-tags">{pick.design.moods.map((m) => <span key={m}>{m}</span>)}{pick.design.motion === "Moving background" ? <span>Moving background</span> : null}</div></div>
          <p className="dg-detail-note">Every colour, typeface and layout can be changed afterwards. Your own content always stays yours.</p>
        </div>
      </div>
    </Overlay>
  )
}
