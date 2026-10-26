"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, Check } from "lucide-react"
import { BusinessIcon } from "@/features/demo/BusinessIcon"
import { applyIndustry, loadSample } from "@/features/demo/actions"
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures"
import { INDUSTRY_PRESETS, OTHER_INDUSTRY_ID, getIndustryPreset } from "@/features/themes/presets/industries"
import { cn } from "@/lib/utils"
import { applyGoal } from "../goal"
import { recommendedAction } from "../recommend"
import { useSetup } from "../context"

/** Every kind of business, in the open, grouped the way people think about them. Search narrows the same grid. */
const SECTORS: { title: string; ids: string[] }[] = [
  { title: "Trades and home", ids: ["plumber", "electrician", "builder", "handyman", "cleaner", "landscaper", "locksmith", "removals", "pest-control", "mechanic", "detailer"] },
  { title: "Beauty and wellbeing", ids: ["barber", "hairdresser", "nails", "lashes-brows", "beauty-therapist", "massage", "makeup", "tattoo", "physio", "dentist"] },
  { title: "Teaching and training", ids: ["tutor", "music-teacher", "language-teacher", "driving-instructor", "coach", "personal-trainer", "sports-coach"] },
  { title: "Professional services", ids: ["consultant", "accountant", "solicitor", "financial-adviser", "architect", "estate-agent", "web-designer"] },
  { title: "Creative and events", ids: ["photographer", "designer", "filmmaker", "illustrator", "interiors", "florist", "maker", "event-services"] },
  { title: "Food, motoring and more", ids: ["hospitality", "car-dealer", "vet", "founder"] },
]

export function IndustryStep() {
  const { s, update } = useSetup()
  const router = useRouter()
  const c = s.content
  const [query, setQuery] = React.useState("")
  const chosen = c.identity.industryLabel.trim() ? c.identity.industryKey : null
  const [otherOpen, setOtherOpen] = React.useState(c.identity.industryKey === OTHER_INDUSTRY_ID && c.identity.industryLabel !== "")
  const q = query.trim().toLowerCase()
  const matches = (id: string) => {
    if (!q) return true
    const p = getIndustryPreset(id)
    return p.label.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q) || q.includes(k))
  }
  const sectors = SECTORS.map((sec) => ({ ...sec, ids: sec.ids.filter(matches) })).filter((sec) => sec.ids.length)
  const total = INDUSTRY_PRESETS.length - 1
  const pick = (id: string) => { setOtherOpen(id === OTHER_INDUSTRY_ID); update((x) => applyGoal(applyIndustry(x, id, id === OTHER_INDUSTRY_ID ? "" : getIndustryPreset(id).label), recommendedAction(id))) }
  const chosenOutOfView = chosen && chosen !== OTHER_INDUSTRY_ID && q && !matches(chosen)
  const mount = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => { mount.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({ block: "center" }) }, [])

  return (
    <div ref={mount} className="sf-stack" data-testid="setup-industry">
      <div className="sf-search">
        <Search aria-hidden="true" />
        <input type="search" className="sf-input" aria-label="Search businesses" placeholder={`Search ${total} kinds of business`} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        {query ? <button type="button" className="sf-search-clear" aria-label="Clear search" onClick={() => setQuery("")}><X aria-hidden="true" /></button> : null}
      </div>

      {chosen && chosen !== OTHER_INDUSTRY_ID ? (
        <p className="sf-chosen" aria-live="polite" data-out={chosenOutOfView ? "true" : undefined}><Check aria-hidden="true" />You chose <b>{c.identity.industryLabel}</b>{chosenOutOfView ? <button type="button" className="sf-link" onClick={() => setQuery("")}>Show all</button> : null}</p>
      ) : null}

      {sectors.map((sec) => (
        <section key={sec.title} className="sf-group" aria-labelledby={`sf-sec-${sec.title.replace(/\W+/g, "-")}`}>
          <h2 className="sf-section" id={`sf-sec-${sec.title.replace(/\W+/g, "-")}`}>{sec.title}</h2>
          <ul className="sf-grid" aria-label={sec.title}>
            {sec.ids.map((id) => (
              <li key={id}>
                <button type="button" className="sf-tile sf-chip" aria-pressed={chosen === id && !otherOpen} onClick={() => pick(id)}>
                  <span className="sf-chip-icon"><BusinessIcon id={id} /></span>
                  <span>{getIndustryPreset(id).label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {!q || "something else other describe".includes(q) || sectors.length === 0 ? (
        <section className="sf-group">
          <h2 className="sf-section">Something else</h2>
          <button type="button" className={cn("sf-tile sf-chip sf-chip-wide")} aria-pressed={otherOpen} onClick={() => pick(OTHER_INDUSTRY_ID)}>
            <span className="sf-chip-icon"><BusinessIcon id={OTHER_INDUSTRY_ID} /></span>
            <span>{sectors.length === 0 && q ? `None match “${query}”. Describe your business instead` : "Describe your business"}</span>
          </button>
          {otherOpen ? (
            <div className="sf-field">
              <label htmlFor="sf-other">What do you do?</label>
              <input id="sf-other" className="sf-input" aria-label="Describe your business" placeholder="e.g. Dog groomer, wedding florist, piano restorer" value={c.identity.industryLabel} maxLength={80} autoFocus onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, industryLabel: e.target.value } } }), { coalesce: "ind-label" })} />
            </div>
          ) : null}
        </section>
      ) : null}

      <details className="sf-sample">
        <summary>Just looking? Open a sample business</summary>
        <div className="sf-sample-list">
          {INDUSTRY_FIXTURE_KEYS.map((k) => <button key={k} type="button" className="sf-btn" data-kind="soft" onClick={() => { update((x) => loadSample(x, k), { resetHistory: true }); router.push("/dashboard/page") }}>{getFixture(k)!.label}</button>)}
        </div>
      </details>
    </div>
  )
}
