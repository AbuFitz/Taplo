"use client"
import * as React from "react"
import { Check } from "lucide-react"
import { ColorField } from "@/features/page/editor/controls"
import { PALETTES } from "@/features/page/themes/looks"
import { applyDesign, DESIGNS, type Design, type DesignMood } from "@/features/page/themes/designs"
import { paletteFromAccent, readsWell } from "@/features/page/themes/image-palette"
import { readableOn } from "@/features/page/themes/color"
import { resolveStyle } from "@/features/page/themes/resolve"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { getIndustryPreset } from "@/features/themes/presets/industries"
import { cn } from "@/lib/utils"
import { DesignThumb } from "../DesignThumb"
import { useSetup } from "../context"

type Tab = "designs" | "colours" | "details"
const TABS: { id: Tab; label: string }[] = [{ id: "designs", label: "Designs" }, { id: "colours", label: "Colours" }, { id: "details", label: "Details" }]
const MOODS: DesignMood[] = ["Light", "Dark", "Colourful", "Editorial", "Minimal", "Bold", "Soft", "Playful"]

/** Step 5. Choose a design, then make it yours: colours that come from your logo, and the shape, type and layout of the page. */
export function DesignStep() {
  const [tab, setTab] = React.useState<Tab>("designs")
  return (
    <div className="sf-stack" data-testid="setup-design-controls">
      <div className="sf-tabs" role="tablist" aria-label="Design options">
        {TABS.map((t) => <button key={t.id} type="button" role="tab" id={`sf-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`sf-panel-${t.id}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div role="tabpanel" id={`sf-panel-${tab}`} aria-labelledby={`sf-tab-${tab}`} className="sf-stack">
        {tab === "designs" ? <Designs /> : tab === "colours" ? <Colours /> : <Details />}
      </div>
    </div>
  )
}

function useAppearance() {
  const { s, update } = useSetup()
  const set = (fn: (a: StyleOverrides) => StyleOverrides, key: string) => update((st) => ({ ...st, setupDrafts: { ...st.setupDrafts, backgroundEdited: true }, page: { ...st.page, appearance: fn(st.page.appearance) } }), { coalesce: key })
  const resolved = resolveStyle(s.page.themeId, s.page.appearance, s.content.identity.logo?.accent)
  return { s, update, set, spec: resolved.spec, resolved }
}

function Designs() {
  const { s, update } = useSetup()
  const industry = s.content.identity.industryKey
  const label = getIndustryPreset(industry).label.toLowerCase()
  const [mood, setMood] = React.useState<DesignMood | null>(null)
  const suited = DESIGNS.filter((d) => d.suits.includes(industry))
  const lead = (suited.length >= 3 ? suited : [...suited, ...DESIGNS.filter((d) => !suited.includes(d))]).slice(0, 4)
  const rest = DESIGNS.filter((d) => !lead.includes(d) && (!mood || d.moods.includes(mood)))
  const choose = (d: Design) => update((st) => ({ ...st, page: applyDesign(st.page, d) }))
  const card = (d: Design, recommended: boolean) => (
    <li key={d.id} className="sf-design" data-on={s.page.themeId === d.id}>
      <DesignThumb design={d} industryKey={industry} own={s.content} />
      <span className="sf-design-meta">
        <span className="sf-design-name">{d.name}{s.page.themeId === d.id ? <Check aria-hidden="true" /> : null}</span>
        <span className="sf-design-note">{d.motion === "Moving background" ? "Moving background" : d.moods.slice(0, 2).join(" · ")}</span>
      </span>
      {recommended ? <span className="sf-tag sf-design-tag">Fits {label}</span> : null}
      <button type="button" className="sf-design-hit" aria-pressed={s.page.themeId === d.id} aria-label={d.name} onClick={() => choose(d)} />
    </li>
  )
  return (
    <>
      <section className="sf-group" aria-label="Recommended designs">
        <h2 className="sf-section">Picked for {label}</h2>
        <ul className="sf-designs">{lead.map((d) => card(d, suited.includes(d)))}</ul>
      </section>
      <section className="sf-group" aria-label="More designs">
        <h2 className="sf-section">More to explore</h2>
        <div className="sf-suggest" role="group" aria-label="Filter designs by mood">
          <button type="button" className="sf-pill" aria-pressed={mood === null} onClick={() => setMood(null)}>All</button>
          {MOODS.map((m) => <button key={m} type="button" className="sf-pill" aria-pressed={mood === m} onClick={() => setMood(mood === m ? null : m)}>{m}</button>)}
        </div>
        <ul className="sf-designs">{rest.map((d) => card(d, false))}</ul>
        {rest.length === 0 ? <p className="sf-hint">No other designs match. Try another mood.</p> : null}
        <p className="sf-hint">Previews show a sample {label} page in each design with your name. Your own content appears in the large preview.</p>
      </section>
    </>
  )
}

const ACCENTS = ["#2f5bff", "#0d7a5f", "#d63f66", "#ff6a1a", "#7c3aed", "#c8a35a", "#111111", "#0ea5e9", "#b4492d", "#16a34a"]

function Colours() {
  const { s, set, spec, resolved } = useAppearance()
  const logoAccent = s.content.identity.logo?.accent
  const dark = resolved.attrs["data-tone"] === "dark"
  const applyPalette = (c: NonNullable<StyleOverrides["colors"]>, key: string) => set((a) => ({ ...a, colors: { ...a.colors, ...c }, ...(spec.background.kind === "solid" || !a.background ? { background: { kind: "solid" as const, color: c.background! } } : {}) }), key)
  const fromLogo = logoAccent ? [{ id: "logo-light", name: "Your logo, light", c: paletteFromAccent(logoAccent, false) }, { id: "logo-dark", name: "Your logo, dark", c: paletteFromAccent(logoAccent, true) }].filter((p) => readsWell(p.c)) : []
  const same = (c: NonNullable<StyleOverrides["colors"]>) => c.accent === spec.colors.accent && c.background === spec.colors.background
  const pick = (id: string, name: string, c: NonNullable<StyleOverrides["colors"]>) => (
    <li key={id}>
      <button type="button" className="sf-palette" aria-pressed={same(c)} aria-label={name} onClick={() => applyPalette(c, "palette")}>
        <span className="sf-palette-art" style={{ background: c.background, borderColor: c.border }}>
          <span style={{ background: c.surface, borderColor: c.border }} /><i style={{ background: c.accent }} /><b style={{ background: c.text }} />
        </span>
        <span className="sf-palette-name">{name}{same(c) ? <Check aria-hidden="true" /> : null}</span>
      </button>
    </li>
  )
  const bad = resolved.contrast.filter((x) => !x.ok)
  return (
    <>
      {fromLogo.length ? (
        <section className="sf-group" aria-label="From your logo">
          <h2 className="sf-section">From your logo</h2>
          <ul className="sf-palettes">{fromLogo.map((p) => pick(p.id, p.name, p.c))}</ul>
        </section>
      ) : (
        <p className="sf-note">Add a logo on the first step and colours that match it appear here.</p>
      )}
      <section className="sf-group" aria-label="Colour stories">
        <h2 className="sf-section">Colour stories</h2>
        <ul className="sf-palettes">{PALETTES.filter((p) => !dark || p.mode === "dark" || true).map((p) => pick(p.id, p.name, p.colors))}</ul>
      </section>
      <section className="sf-group" aria-label="Accent colour">
        <h2 className="sf-section">Accent</h2>
        <div className="sf-swatches" role="group" aria-label="Accent colour">
          {ACCENTS.map((hex) => <button key={hex} type="button" className="sf-swatch" style={{ background: hex }} aria-label={hex} aria-pressed={spec.colors.accent.toLowerCase() === hex} onClick={() => set((a) => ({ ...a, colors: { ...a.colors, accent: hex, accentText: readableOn(hex) } }), "accent")} />)}
        </div>
        <ColorField label="Your own accent" value={spec.colors.accent} against={spec.colors.background} onChange={(hex) => set((a) => ({ ...a, colors: { ...a.colors, accent: hex, accentText: readableOn(hex) } }), "accent")} />
      </section>
      <p className={cn("sf-readable", bad.length && "is-warn")} role="status">{bad.length ? `Taplo adjusted ${bad.length === 1 ? "one colour" : `${bad.length} colours`} so everything stays readable.` : <><Check aria-hidden="true" />Everything is easy to read.</>}</p>
    </>
  )
}

const COMPOSITIONS = [
  { id: "stack", name: "Cards", note: "Sections on cards" },
  { id: "bento", name: "Compact grid", note: "Short sections side by side" },
  { id: "sheet", name: "Soft sheet", note: "Rises over a tint" },
  { id: "sheet-bold", name: "Bold sheet", note: "Rises over your colour" },
  { id: "ledger", name: "Open ledger", note: "No boxes, numbered" },
] as const
const TYPE_SETS = [
  { id: "modern", name: "Modern", heading: "outfit", body: "inter", sample: "Aa" },
  { id: "editorial", name: "Editorial", heading: "newsreader", body: "inter", sample: "Aa" },
  { id: "elegant", name: "Elegant", heading: "bodoni", body: "inter", sample: "Aa" },
  { id: "friendly", name: "Friendly", heading: "bricolage", body: "inter", sample: "Aa" },
  { id: "strong", name: "Strong", heading: "barlowCondensed", body: "inter", sample: "AA" },
  { id: "warm", name: "Warm", heading: "dmSerif", body: "inter", sample: "Aa" },
  { id: "tech", name: "Technical", heading: "spaceGrotesk", body: "inter", sample: "Aa" },
  { id: "creative", name: "Creative", heading: "syne", body: "inter", sample: "Aa" },
] as const
const CORNERS = [
  { id: "sharp", name: "Sharp", radius: "none", shape: "square" },
  { id: "soft", name: "Soft", radius: "lg", shape: "rounded" },
  { id: "round", name: "Round", radius: "xl", shape: "pill" },
] as const

function Details() {
  const { set, spec } = useAppearance()
  const moving = (spec.background.kind === "gradient" || spec.background.kind === "shader")
  const composition = spec.layout.composition ?? "stack"
  const upper = spec.text.headingCase === "upper"
  return (
    <>
      <fieldset className="sf-group">
        <legend className="sf-section">Layout</legend>
        <div className="sf-layouts" role="radiogroup" aria-label="Page layout">
          {COMPOSITIONS.map((c) => (
            <label key={c.id} className="sf-layout" data-on={composition === c.id}>
              <input type="radio" name="composition" aria-label={c.name} checked={composition === c.id} onChange={() => set((a) => ({ ...a, layout: { ...a.layout, composition: c.id }, header: { ...a.header, surface: c.id === "stack" || c.id === "bento" ? "card" : "open" } }), "composition")} />
              <span className="sf-layout-art" data-kind={c.id} aria-hidden="true"><i /><b /><b /><b /></span>
              <span className="sf-layout-name">{c.name}</span>
              <small>{c.note}</small>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="sf-group">
        <legend className="sf-section">Typeface</legend>
        <div className="sf-types" role="radiogroup" aria-label="Typeface">
          {TYPE_SETS.map((t) => (
            <label key={t.id} className="sf-type" data-on={spec.text.headingFont === t.heading}>
              <input type="radio" name="typeface" aria-label={t.name} checked={spec.text.headingFont === t.heading} onChange={() => set((a) => ({ ...a, text: { ...a.text, headingFont: t.heading, bodyFont: t.body } }), "type")} />
              <span className="sf-type-sample" data-font={t.heading} aria-hidden="true">{upper && t.id !== "strong" ? "AA" : t.sample}</span>
              <span>{t.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="sf-group">
        <legend className="sf-section">Corners</legend>
        <div className="sf-seg" role="radiogroup" aria-label="Corners">
          {CORNERS.map((c) => {
            const on = spec.cards.radius === c.radius || (c.id === "round" && spec.cards.radius === "xl") || (c.id === "soft" && ["md", "lg"].includes(spec.cards.radius))
            return (
              <label key={c.id} data-on={on}>
                <input type="radio" name="corners" aria-label={c.name} checked={on} onChange={() => set((a) => ({ ...a, cards: { ...a.cards, radius: c.radius }, buttons: { ...a.buttons, shape: c.shape } }), "corners")} />
                <span>{c.name}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      {moving ? (
        <fieldset className="sf-group">
          <legend className="sf-section">Background movement</legend>
          <div className="sf-seg" role="radiogroup" aria-label="Background movement">
            {([["still", "Still"], ["slow", "Gentle"], ["steady", "Flowing"], ["expressive", "Lively"]] as const).map(([v, name]) => {
              const b = spec.background
              const cur = b.kind === "gradient" || b.kind === "shader" ? (b.motion === false ? "still" : (b.pace ?? "steady")) : "still"
              return (
                <label key={v} data-on={cur === v}>
                  <input type="radio" name="movement" aria-label={name} checked={cur === v} onChange={() => set((a) => ({ ...a, background: { ...spec.background, motion: v !== "still", ...(v !== "still" ? { pace: v } : {}) } as StyleOverrides["background"] }), "movement")} />
                  <span>{name}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ) : null}
      <p className="sf-note">Everything here can be changed again from your dashboard.</p>
    </>
  )
}
