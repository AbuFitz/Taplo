"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { getDesign, FINISHES, type Design } from "@/features/page/themes/designs"
import { PROFILE_CHOICES } from "@/features/page/contracts/style"
import { DesignThumb } from "@/features/setup/DesignThumb"
import { SCENARIOS, type Scenario } from "@/features/showcase/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { PagePreview } from "@/features/preview/PagePreview"
import { ScaledPhone } from "@/features/preview/ScaledPhone"
import { PHONE } from "@/features/preview/PhoneChrome"
import { Overlay } from "@/components/taplo/overlay"
import { ApplyDesign } from "./ApplyDesign"
import { exampleForScenario } from "./examples"
import { ALL_SHOWCASE, type Arrangement } from "./showcase-set"
import { STARTING_LOOKS, getStartingLook, type StartingLook } from "@/features/page/themes/starting-looks"
import Link from "next/link"
import "./design-gallery.css"

type Pick = { scenario: Scenario; design: Design; look?: StartingLook; note: string; logo?: false; arrangement?: Arrangement; group: string }

const BUSINESS = [
  { id: "salon", label: "Salons & barbers", of: "barber lune station tattoo groom" },
  { id: "clinic", label: "Clinics & wellness", of: "physio calm slow liv" },
  { id: "trade", label: "Trades & auto", of: "trades fixnow oakfield current detailer dealer brookfield bike garden driving" },
  { id: "food", label: "Food & hospitality", of: "cafe corner hours taco bnb" },
  { id: "shop", label: "Shops & makers", of: "form edit petal books cakes" },
  { id: "studio", label: "Studios & creatives", of: "sora ellis field pace after slate twelve nami dune maya leon eden dj alba arlo" },
  { id: "coach", label: "Coaches & tutors", of: "gym north good brightlearn rowan tutor surf" },
] as const

const alignFor = (a?: Arrangement): "left" | "center" => (a === "bento" || a === "identity" ? "center" : "left")
/** The design with this page's own arrangement and (when it has no logo) a name-only profile. */
function poseOf(pick: Pick) {
  const header = { ...pick.design.overrides.header, ...(pick.arrangement ? { layout: pick.arrangement, align: alignFor(pick.arrangement) } : {}), ...(pick.logo === false ? { avatarShape: "none" as const } : {}) }
  const cw = pick.look?.colourway
  return { ...pick.design.overrides, ...(cw ? { colors: { ...pick.design.overrides.colors, ...cw.colors }, background: structuredClone(cw.background), buttons: { ...pick.design.overrides.buttons, shape: "pill" as const } } : {}), header }
}
const arrangementName = (a?: Arrangement) => PROFILE_CHOICES.find((c) => c.id === a)?.name
const frameSrc = (p: Pick) => `/appearance/frame?scenario=${p.scenario}&look=${p.design.id}&design=1${p.look ? `&colourway=${p.look.id}` : ""}${p.logo === false ? "&logo=0" : ""}${p.arrangement ? `&arr=${p.arrangement}` : ""}`

/** One handset: the page as a still, or (when active) the page itself, scrollable and tappable inside the frame. */
function Phone({ pick, active }: { pick: Pick; active: boolean }) {
  const sc = SCENARIOS[pick.scenario]
  const real = React.useMemo(() => ({ widgets: widgetsFor(pick.scenario) }), [pick.scenario])
  const own = React.useMemo(() => (pick.logo === false ? { ...sc.content, identity: { ...sc.content.identity, logo: undefined } } : sc.content), [sc, pick.logo])
  const overrides = React.useMemo(() => poseOf(pick), [pick])
  return (
    <ScaledPhone>
      {active
        ? <iframe title={`${sc.content.identity.name}, live`} src={frameSrc(pick)} style={{ width: PHONE.width, height: PHONE.height, border: 0, display: "block", background: "#fff" }} />
        : <DesignThumb design={pick.design} industryKey="" own={own} real={real} overrides={overrides} height={PHONE.height} />}
    </ScaledPhone>
  )
}

/** Round-robin the groups so neighbours are never the same kind of business. */
function interleave<T extends { group: string }>(items: T[]): T[] {
  const buckets = new Map<string, T[]>()
  for (const i of items) buckets.set(i.group, [...(buckets.get(i.group) ?? []), i])
  const lists = [...buckets.values()]
  const out: T[] = []
  for (let n = 0; lists.some((l) => n < l.length); n++) for (const l of lists) if (n < l.length) out.push(l[n]!)
  return out
}

export function DesignGallery() {
  const [query, setQuery] = React.useState("")
  const [biz, setBiz] = React.useState<string | null>(null)
  const [lookId, setLookId] = React.useState<string | null>(null)
  const [arr, setArr] = React.useState<Arrangement | null>(null)
  const [open, setOpen] = React.useState<Pick | null>(null)
  const all = React.useMemo<Pick[]>(() => interleave(ALL_SHOWCASE.flatMap((i) => { const design = getDesign(i.design); return design ? [{ scenario: i.scenario, design, look: i.look ? getStartingLook(i.look) : undefined, note: i.note, logo: i.logo, arrangement: i.arrangement, group: i.group }] : [] })), [])
  const q = query.trim().toLowerCase()
  const shown = all.filter((p) => {
    const name = SCENARIOS[p.scenario].content.identity.name
    if (biz && !BUSINESS.find((b) => b.id === biz)!.of.split(" ").includes(p.scenario)) return false
    if (lookId && p.look?.id !== lookId) return false
    if (arr && p.arrangement !== arr) return false
    return !q || [name, p.note, p.look?.name ?? p.design.name, SCENARIOS[p.scenario].label, arrangementName(p.arrangement) ?? ""].join(" ").toLowerCase().includes(q)
  })
  return (
    <div className="dg">
      <header className="dg-head">
        <h1>Pages for every kind of business.</h1>
        <p>Every page here is a real Taplo page: a profile arrangement, a material and a design chosen to fit the business. Open one to scroll it, try it on a phone or a computer, then make it yours.</p>
      </header>
      <div className="dg-bar" role="region" aria-label="Filter designs">
        <div className="dg-search"><Search aria-hidden="true" /><input type="search" aria-label="Search pages" placeholder="Search: florist, plumber, tutor…" value={query} onChange={(e) => setQuery(e.target.value)} />{query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : null}</div>
        <div className="dg-row" role="group" aria-label="Business type"><button type="button" aria-pressed={biz === null} onClick={() => setBiz(null)}>All</button>{BUSINESS.map((b) => <button key={b.id} type="button" aria-pressed={biz === b.id} onClick={() => setBiz(biz === b.id ? null : b.id)}>{b.label}</button>)}</div>
        <div className="dg-row" role="group" aria-label="Look"><span>Look</span>{STARTING_LOOKS.map((l) => <button key={l.id} type="button" aria-pressed={lookId === l.id} onClick={() => setLookId(lookId === l.id ? null : l.id)}>{l.name}</button>)}</div>
        <div className="dg-row" role="group" aria-label="Profile arrangement"><span>Profile</span>{PROFILE_CHOICES.map((c) => <button key={c.id} type="button" aria-pressed={arr === c.id} onClick={() => setArr(arr === c.id ? null : c.id)}>{c.name}</button>)}</div>
      </div>
      <ul className="dg-shelf" data-testid="gallery-list">
        {shown.map((p) => {
          const key = p.scenario
          const name = SCENARIOS[p.scenario].content.identity.name
          return (
            <li key={key} className="dg-item" data-testid="design-card">
              <div className="dg-open">
                <Phone pick={p} active={false} />
                <button type="button" className="dg-hit" onClick={() => setOpen(p)} aria-label={`${name}, open this page`} />
              </div>
              <div className="dg-meta">
                <h2>{name}</h2>
                <p>{p.note}</p>
                <div className="dg-tagrow"><span className="dg-tag">{p.look?.name ?? p.design.name}</span><span className="dg-tag">{arrangementName(p.arrangement) ?? p.design.name}</span></div>
                <div className="dg-acts"><button type="button" onClick={() => setOpen(p)}>Look closer</button></div>
              </div>
            </li>
          )
        })}
      </ul>
      {shown.length === 0 ? <p className="dg-empty">Nothing matches. Try a different word or clear a filter.</p> : null}
      {open ? <Detail pick={open} onClose={() => setOpen(null)} /> : null}
    </div>
  )
}

function Detail({ pick, onClose }: { pick: Pick; onClose: () => void }) {
  const [device, setDevice] = React.useState<"phone" | "computer">("phone")
  const name = SCENARIOS[pick.scenario].content.identity.name
  const demo = exampleForScenario(pick.scenario)
  return (
    <Overlay open onOpenChange={(o) => !o && onClose()} kind="detail" title={name} description={pick.note} testId="design-detail" className="dg-detail"
      footer={<div className="dg-detail-actions sf-ui">{demo ? <Link className="dg-demo" href={`/inspiration/${demo.slug}`} onClick={onClose}>Open the demo</Link> : null}<ApplyDesign design={pick.design} look={pick.look?.id} arrangement={pick.arrangement} className="sf-btn dg-use">Use this design</ApplyDesign></div>}>
      <div className="dg-detail-body sf-ui">
        <div className="dg-detail-view" data-device={device}>
          <PagePreview key={`${device}-${pick.scenario}`} src={frameSrc(pick)} title={`${name} on the ${pick.design.name} design`} mode={device === "phone" ? "device" : "desktop"} chrome url="yourname.mytaplo.com" />
        </div>
        <div className="dg-detail-side">
          <div className="sf-seg" role="radiogroup" aria-label="Preview size">
            {(["phone", "computer"] as const).map((d) => <label key={d} data-on={device === d}><input type="radio" name="dg-device" aria-label={d === "phone" ? "Phone" : "Computer"} checked={device === d} onChange={() => setDevice(d)} /><span>{d === "phone" ? "Phone" : "Computer"}</span></label>)}
          </div>
          <div className="dg-detail-group"><h3>How it is made</h3>
            <dl className="dg-facts"><dt>Arrangement</dt><dd>{arrangementName(pick.arrangement) ?? "As designed"}</dd><dt>Design</dt><dd>{pick.design.name}. {pick.design.blurb}</dd><dt>Material</dt><dd>{FINISHES.find((f) => f.id === pick.design.overrides.layout?.finish)?.name ?? "Set by the design"}</dd></dl>
          </div>
          <div className="dg-detail-group"><h3>The feel</h3><div className="dg-tags">{pick.design.moods.map((m) => <span key={m}>{m}</span>)}{pick.design.motion === "Moving background" ? <span>Moving background</span> : null}</div></div>
          <p className="dg-detail-note">Every colour, typeface and layout can be changed afterwards. Your own content always stays yours.</p>
        </div>
      </div>
    </Overlay>
  )
}
