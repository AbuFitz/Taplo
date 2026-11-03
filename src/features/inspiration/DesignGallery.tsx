"use client"

import * as React from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
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
import { originalPalette } from "@/features/page/themes/palettes"
import { rankArrangements } from "@/features/page/themes/arrangement"
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

/** Carry the exact gallery composition into the one design experience. */
function designHref(p: Pick) {
  const example = exampleForScenario(p.scenario)
  const query = new URLSearchParams({ design: p.design.id })
  if (p.look) query.set("colourway", p.look.id)
  if (p.arrangement) query.set("arr", p.arrangement)
  if (p.logo === false) query.set("logo", "0")
  return `/inspiration/${example?.slug ?? p.scenario}?${query}`
}

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
  const [dress, setDress] = React.useState<string | null>(null)
  const [arr, setArr] = React.useState<Arrangement | null>(null)
  const [styleOpen, setStyleOpen] = React.useState(false)
  const styleCount = (dress ? 1 : 0) + (arr ? 1 : 0)
  const base = React.useMemo<Pick[]>(() => interleave(ALL_SHOWCASE.flatMap((i) => { const design = getDesign(i.design); return design ? [{ scenario: i.scenario, design, look: i.look ? getStartingLook(i.look) : undefined, note: i.note, logo: i.logo, arrangement: i.arrangement, group: i.group }] : [] })), [])
  /** Putting every page in one look: the shelf becomes a way to see how your business could wear it. */
  const all = React.useMemo<Pick[]>(() => { const l = getStartingLook(dress ?? ""); const d = l ? getDesign(l.design) : undefined; return l && d ? base.map((p) => ({ ...p, look: l, design: d })) : base }, [base, dress])
  const q = query.trim().toLowerCase()
  const shown = all.filter((p) => {
    const name = SCENARIOS[p.scenario].content.identity.name
    if (biz && !BUSINESS.find((b) => b.id === biz)!.of.split(" ").includes(p.scenario)) return false
    if (arr && p.arrangement !== arr) return false
    return !q || [name, p.note, p.look?.name ?? p.design.name, SCENARIOS[p.scenario].label, arrangementName(p.arrangement) ?? ""].join(" ").toLowerCase().includes(q)
  })
  return (
    <div className="dg">
      <header className="dg-head">
        <h1>Your business.<br />Your point of view.</h1>
        <p>Find a direction. Explore the details. Make it your own—with your content, your colours and your way of doing business.</p>
      </header>
      <div className="dg-toolbar" role="region" aria-label="Find a design">
        <div className="dg-toolbar-row">
          <div className="dg-search"><Search aria-hidden="true" /><input type="search" aria-label="Search pages" placeholder="Search: florist, plumber, tutor…" value={query} onChange={(e) => setQuery(e.target.value)} />{query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : null}</div>
          <button type="button" className="dg-style-btn" onClick={() => setStyleOpen(true)} aria-label="Filter designs" aria-haspopup="dialog" data-active={styleCount > 0}>
            <SlidersHorizontal aria-hidden="true" /><span>Explore styles</span>{styleCount > 0 ? <b aria-label={`${styleCount} chosen`}>{styleCount}</b> : null}
          </button>
        </div>
        <div className="dg-rail" role="group" aria-label="Business type">
          <button type="button" aria-pressed={biz === null} onClick={() => setBiz(null)}>All</button>
          {BUSINESS.map((b) => <button key={b.id} type="button" aria-pressed={biz === b.id} onClick={() => setBiz(biz === b.id ? null : b.id)}>{b.label}</button>)}
        </div>
        {styleCount > 0 ? (
          <p className="dg-active" aria-live="polite">
            <span>{shown.length} {shown.length === 1 ? "page" : "pages"}, shown in</span>
            {dress ? <button type="button" onClick={() => setDress(null)}>{getStartingLook(dress)?.name}<X aria-hidden="true" /></button> : null}
            {arr ? <button type="button" onClick={() => setArr(null)}>{arrangementName(arr)}<X aria-hidden="true" /></button> : null}
            <button type="button" className="dg-clear" onClick={() => { setDress(null); setArr(null) }}>Clear</button>
          </p>
        ) : null}
      </div>
      <p className="dg-result-count" role="status">{shown.length} designs to explore</p>
      <ul className="dg-shelf" data-testid="gallery-list">
        {shown.map((p) => {
          const key = p.scenario
          const name = SCENARIOS[p.scenario].content.identity.name
          return (
            <li key={key} className="dg-item" data-testid="design-card">
              <div className="dg-open" style={{ "--design-stage": originalPalette(p.look ?? getStartingLook("signature") ?? STARTING_LOOKS[0]!).base } as React.CSSProperties}>
                <Phone pick={p} active={false} />
                <Link className="dg-hit" href={designHref(p)} aria-label={`${name}, open this page`} />
              </div>
              <div className="dg-meta">
                <h2>{name}</h2>
                <p>{p.note}</p>
                <div className="dg-tagrow"><span className="dg-tag">{p.look?.name ?? p.design.name}</span><span className="dg-tag">{arrangementName(p.arrangement) ?? p.design.name}</span></div>
                <div className="dg-acts"><Link href={designHref(p)}>Explore design</Link></div>
              </div>
            </li>
          )
        })}
      </ul>
      {shown.length === 0 ? <p className="dg-empty">Nothing matches. Try a different word or clear a filter.</p> : null}
      <StyleSheet open={styleOpen} onOpenChange={setStyleOpen} dress={dress} setDress={setDress} arr={arr} setArr={setArr} count={shown.length} />
    </div>
  )
}

function Swatch({ look }: { look: StartingLook }) {
  const c = originalPalette(look)
  return <i aria-hidden="true" className="dg-swatch" style={{ background: c.base, boxShadow: `inset 0 0 0 1px rgba(0,0,0,.14), 9px 0 0 -1px ${c.accent}` }} />
}

/** The two "try every page in…" choices live in one sheet instead of three stacked rows of chips. */
function StyleSheet({ open, onOpenChange, dress, setDress, arr, setArr, count }: { open: boolean; onOpenChange: (o: boolean) => void; dress: string | null; setDress: (v: string | null) => void; arr: Arrangement | null; setArr: (v: Arrangement | null) => void; count: number }) {
  return (
    <Overlay open={open} onOpenChange={onOpenChange} kind="dialog" title="Find your direction" description="Explore colour palettes and profile layouts. Every design works across business types." testId="style-sheet"
      footer={<div className="dg-sheet-actions"><button type="button" className="dg-sheet-clear" onClick={() => { setDress(null); setArr(null) }}>Clear</button><button type="button" className="dg-sheet-done" onClick={() => onOpenChange(false)}>Show {count} {count === 1 ? "page" : "pages"}</button></div>}>
      <div className="dg-sheet">
        <section aria-labelledby="dg-look-h">
          <h3 id="dg-look-h">Look</h3>
          <div className="dg-look-grid" role="radiogroup" aria-label="Look">
            <button type="button" role="radio" aria-checked={dress === null} onClick={() => setDress(null)} className="dg-look-tile"><i className="dg-look-art dg-look-own" aria-hidden="true" /><span>Their own</span></button>
            {STARTING_LOOKS.map((l) => { const c = originalPalette(l); return (
              <button key={l.id} type="button" role="radio" aria-checked={dress === l.id} onClick={() => setDress(dress === l.id ? null : l.id)} className="dg-look-tile">
                <span className="dg-look-art" aria-hidden="true" style={{ background: c.base }}><DesignThumb design={getDesign(l.design)!} industryKey="barber" own={SCENARIOS.barber.content} overrides={poseOf({ scenario: "barber", design: getDesign(l.design)!, look: l, note: "", group: "" })} height={520} /></span>
                <span>{l.name}</span>
              </button>) })}
          </div>
        </section>
        <section aria-labelledby="dg-arr-h">
          <h3 id="dg-arr-h">Profile</h3>
          <div className="dg-arr-list" role="radiogroup" aria-label="Profile arrangement">
            <button type="button" role="radio" aria-checked={arr === null} onClick={() => setArr(null)}><span>As designed</span></button>
            {PROFILE_CHOICES.map((c) => <button key={c.id} type="button" role="radio" aria-checked={arr === c.id} onClick={() => setArr(arr === c.id ? null : c.id)}><span>{c.name}</span><small>{c.line}</small></button>)}
          </div>
        </section>
      </div>
    </Overlay>
  )
}

export function DesignExperience({ scenario, initialDesign, initialLook, initialArrangement, hideLogo = false }: { scenario: Scenario; initialDesign?: string; initialLook?: string; initialArrangement?: string; hideLogo?: boolean }) {
  const item = ALL_SHOWCASE.find((p) => p.scenario === scenario)
  const design = getDesign(initialDesign ?? item?.design ?? "bento") ?? getDesign("bento")!
  const first: Pick = { scenario, design, look: getStartingLook(initialLook ?? item?.look ?? ""), arrangement: PROFILE_CHOICES.some((p) => p.id === initialArrangement) ? initialArrangement as Arrangement : item?.arrangement, logo: hideLogo ? false : item?.logo, note: item?.note ?? SCENARIOS[scenario].label, group: item?.group ?? "" }
  return <DesignDetail key={`${scenario}-${initialDesign}-${initialLook}-${initialArrangement}-${hideLogo}`} pick={first} />
}

function DesignDetail({ pick: first }: { pick: Pick }) {
  const [device, setDevice] = React.useState<"phone" | "computer">("phone")
  const [lookId, setLookId] = React.useState<string | undefined>(first.look?.id)
  const [arrId, setArrId] = React.useState<Arrangement | undefined>(first.arrangement)
  const pick = React.useMemo<Pick>(() => { const l = getStartingLook(lookId ?? ""); const d = l ? getDesign(l.design) : undefined; const base = l && d ? { ...first, look: l, design: d } : first; return { ...base, arrangement: arrId } }, [first, lookId, arrId])
  const ranked = React.useMemo(() => rankArrangements(SCENARIOS[first.scenario].content.identity), [first.scenario])
  const name = SCENARIOS[pick.scenario].content.identity.name
  return (
    <section className="dg-experience" aria-label={`Explore ${name}`} data-testid="design-detail">
      <div className="dg-detail-body">
        <div className="dg-detail-view" data-device={device}>
          <PagePreview src={frameSrc(pick)} title={`${name} on the ${pick.design.name} design`} mode={device === "phone" ? "device" : "desktop"} chrome testId="design-preview-frame" url="yourname.mytaplo.com" />
        </div>
        <div className="dg-detail-side">
          <div className="dg-device" role="radiogroup" aria-label="Preview size">
            {(["phone", "computer"] as const).map((d) => <label key={d} data-on={device === d}><input type="radio" name="dg-device" aria-label={d === "phone" ? "Phone" : "Desktop"} checked={device === d} onChange={() => setDevice(d)} /><span>{d === "phone" ? "Phone" : "Desktop"}</span></label>)}
          </div>
          <div className="dg-detail-group"><h3>Try another look</h3><div className="dg-tags" role="group" aria-label="Look for this page">{STARTING_LOOKS.map((l) => <button key={l.id} type="button" className="dg-look" aria-pressed={pick.look?.id === l.id} onClick={() => setLookId(l.id)}><Swatch look={l} />{l.name}</button>)}</div></div>
          <div className="dg-detail-group"><h3>Arrange the top</h3><div className="dg-tags" role="group" aria-label="Profile arrangement for this page">{ranked.map((r, i) => <button key={r.id} type="button" className="dg-look" aria-pressed={pick.arrangement === r.id} title={r.why} onClick={() => setArrId(r.id)}>{arrangementName(r.id)}{i === 0 ? <small> · suggested</small> : null}</button>)}</div></div>
          <div className="dg-detail-group"><h3>Design details</h3>
            <dl className="dg-facts"><dt>Look</dt><dd>{pick.look?.name ?? "As designed"}</dd><dt>Arrangement</dt><dd>{arrangementName(pick.arrangement) ?? "As designed"}</dd><dt>Design</dt><dd>{pick.design.name}. {pick.design.blurb}</dd><dt>Material</dt><dd>{FINISHES.find((f) => f.id === pick.design.overrides.layout?.finish)?.name ?? "Set by the design"}</dd></dl>
          </div>
          <div className="dg-detail-group"><h3>The feel</h3><div className="dg-tags">{pick.design.moods.map((m) => <span key={m}>{m}</span>)}{pick.design.motion === "Moving background" ? <span>Moving background</span> : null}</div></div>
          <p className="dg-detail-note">Every colour, typeface and layout can be changed afterwards. Your own content always stays yours.</p>
        </div>
      </div>
      <div className="dg-page-actions"><p>Your content stays yours. Change the design anytime.</p><ApplyDesign design={pick.design} look={pick.look?.id} arrangement={pick.arrangement} className="dg-use">Use this design</ApplyDesign></div>
    </section>
  )
}
