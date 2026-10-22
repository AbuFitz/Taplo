"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { videoEmbed } from "@/lib/validation"
import { formatPrice } from "@/features/services/format"
import { UrlField } from "@/features/demo/ui"
import { parseSettings, type WidgetType } from "../contracts/widgets"
import type { WidgetAppearance } from "../contracts/style"
import type { StoredWidget } from "../starter"
import type { FieldSource, FieldSpec } from "../widgets/types"
import { getWidget } from "../widgets/registry"
import { ColorField, FieldShell, ImageField, Segmented, SelectField, SwitchField } from "./controls"
import type { Editor } from "./useEditor"

interface Option { id: string; label: string }

function optionsFor(source: FieldSource, ed: Editor): Option[] {
  const r = ed.records
  if (!r) return []
  switch (source) {
    case "services": return r.services.filter((s) => !s.archived).map((s) => ({ id: s.id, label: `${s.name} — ${formatPrice(s)}` }))
    case "staff": return r.staff.map((s) => ({ id: s.id, label: s.name }))
    case "gallery": return r.gallery.map((g, i) => ({ id: g.id, label: g.caption || `Photo ${i + 1}` }))
    case "faqs": return r.faqs.map((f) => ({ id: f.id, label: f.question }))
    case "testimonials": return r.testimonials.map((t) => ({ id: t.id, label: `${t.author}: “${t.quote.slice(0, 40)}${t.quote.length > 40 ? "…" : ""}”` }))
    case "products": return r.products.filter((p) => !p.archived).map((p) => ({ id: p.id, label: p.name }))
    case "offers": return r.offers.filter((o) => !o.archived).map((o) => ({ id: o.id, label: o.title }))
    case "reviewPlatforms": return r.reviewLinks.map((l) => ({ id: l.platform, label: l.platform[0]!.toUpperCase() + l.platform.slice(1) }))
    case "socialPlatforms": return r.contacts.social.map((l) => ({ id: l.platform, label: l.platform[0]!.toUpperCase() + l.platform.slice(1) }))
  }
}

/** "All (follows your records automatically)" or an explicit subset. Never copies a record. */
function RefsField({ f, value, ed, onChange }: { f: Extract<FieldSpec, { kind: "refs" }>; value: unknown; ed: Editor; onChange: (v: string[] | null) => void }) {
  const options = optionsFor(f.source, ed)
  const all = !Array.isArray(value)
  const chosen = new Set(Array.isArray(value) ? (value as string[]) : [])
  return (
    <fieldset className="grid gap-1.5">
      <legend className="text-sm font-medium">{f.label}</legend>
      <label className="flex min-h-11 items-center gap-2 text-sm"><Checkbox checked={all} onCheckedChange={(c) => onChange(c ? null : options.map((o) => o.id))} /> All of them{options.length ? ` (${options.length})` : ""} — updates automatically</label>
      {!all ? (
        options.length ? (
          <ul className="grid gap-0.5 rounded-lg border p-2">
            {options.map((o) => (
              <li key={o.id}>
                <label className="flex min-h-10 items-center gap-2 text-sm"><Checkbox checked={chosen.has(o.id)} onCheckedChange={(c) => { const next = new Set(chosen); if (c) next.add(o.id); else next.delete(o.id); onChange(options.map((x) => x.id).filter((id) => next.has(id))) }} /> <span className="[overflow-wrap:anywhere]">{o.label}</span></label>
              </li>
            ))}
          </ul>
        ) : <p className="text-xs text-muted-foreground">Nothing to choose from yet.</p>
      ) : null}
      {f.help ? <p className="text-xs text-muted-foreground">{f.help}</p> : null}
    </fieldset>
  )
}

export function WidgetFields({ stored, ed }: { stored: StoredWidget; ed: Editor }) {
  const def = getWidget(stored.type)!
  const { settings } = parseSettings(stored.type as WidgetType, stored.settings)
  const s = settings as Record<string, unknown>
  const set = (key: string, v: unknown) => ed.updateWidget(stored.id, { settings: { [key]: v } })

  return (
    <div className="grid gap-4">
      {def.fields.map((f) => {
        const v = s[f.key]
        switch (f.kind) {
          case "text":
            return <TaploInput key={f.key} label={f.label} value={String(v ?? "")} maxLength={f.max} placeholder={f.placeholder} hint={f.help} onChange={(e) => set(f.key, e.target.value || (f.key === "label" || f.key === "title" ? "" : undefined))} />
          case "textarea":
            return (
              <div key={f.key} className="grid gap-1.5">
                <Label htmlFor={`${stored.id}-${f.key}`} className="text-sm font-medium">{f.label}</Label>
                <Textarea id={`${stored.id}-${f.key}`} rows={f.rows ?? 3} maxLength={f.max} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
              </div>
            )
          case "url":
            return <UrlField key={f.key} label={f.label} value={String(v ?? "") || undefined} help={f.help} validate={stored.type === "video" && f.key === "url" ? (x) => videoEmbed(x) !== null : undefined} onCommit={(x) => set(f.key, x ?? "")} />
          case "date":
            return <TaploInput key={f.key} label={f.label} type="date" value={String(v ?? "")} hint={f.help} onChange={(e) => set(f.key, e.target.value || undefined)} />
          case "switch":
            return <SwitchField key={f.key} label={f.label} checked={Boolean(v)} onChange={(c) => set(f.key, c)} />
          case "select":
            return <Segmented key={f.key} label={f.label} value={String(v ?? f.options[0]!.value)} options={f.options} onChange={(x) => set(f.key, x)} columns={f.options.length > 3 ? 2 : f.options.length} />
          case "refs":
            return <RefsField key={f.key} f={f} value={v} ed={ed} onChange={(x) => set(f.key, x)} />
          case "record": {
            const opts = optionsFor(f.source, ed)
            return <SelectField key={f.key} label={f.label} value={(v as string | null) || undefined} inheritLabel="Automatic" options={opts.map((o) => ({ value: o.id, label: o.label }))} onChange={(x) => set(f.key, x ?? null)} />
          }
          case "image":
            return <ImageField key={f.key} label={f.label} value={(v as never) ?? null} defaultAlt={String(s.caption ?? "") || "Picture"} onChange={(x) => set(f.key, x)} />
        }
      })}
    </div>
  )
}

const SURFACES = [
  { value: "solid", label: "Solid" }, { value: "glass", label: "Frosted" }, { value: "transparent", label: "None" }, { value: "accent", label: "Accent fill" },
] as const
const RADII = [{ value: "none", label: "Square" }, { value: "sm", label: "Slight" }, { value: "md", label: "Medium" }, { value: "lg", label: "Round" }, { value: "xl", label: "Rounder" }] as const

/** Per-widget overrides on top of the page style. Every control shows when it is customised and can reset to the theme. */
export function WidgetAppearanceForm({ stored, ed }: { stored: StoredWidget; ed: Editor }) {
  const def = getWidget(stored.type)!
  const a = stored.appearance as WidgetAppearance
  const spec = ed.vm?.style.spec
  if (!spec) return null
  const set = (patch: Partial<WidgetAppearance>) => {
    const next = { ...a, ...patch } as Record<string, unknown>
    for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k]
    ed.updateWidget(stored.id, { appearance: next as WidgetAppearance })
  }
  const unset = (...keys: (keyof WidgetAppearance)[]) => set(Object.fromEntries(keys.map((k) => [k, undefined])) as Partial<WidgetAppearance>)
  const count = Object.keys(a).length
  const hasCard = def.appearance.includes("card")
  const hasBtn = def.appearance.includes("button")
  const hasThumb = def.appearance.includes("thumbnail")

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{count ? `${count} setting${count === 1 ? "" : "s"} differ from the page style.` : "Following your page style."}</p>
        <button type="button" disabled={!count} onClick={() => ed.updateWidget(stored.id, { appearance: null })} className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40">Reset to page style</button>
      </div>
      <Segmented label="Emphasis" value={a.emphasis ?? "normal"} options={[{ value: "normal", label: "Normal" }, { value: "featured", label: "Featured", hint: "Bigger, accent border" }]} customised={a.emphasis !== undefined} onReset={() => unset("emphasis")} onChange={(v) => set({ emphasis: v })} />
      {hasCard ? (
        <>
          <Segmented label="Background" value={a.surface} options={SURFACES.map((x) => ({ ...x }))} columns={2} customised={a.surface !== undefined} onReset={() => unset("surface")} onChange={(v) => set({ surface: v })} />
          <Segmented label="Corners" value={a.radius} options={RADII.map((x) => ({ ...x }))} columns={3} customised={a.radius !== undefined} onReset={() => unset("radius")} onChange={(v) => set({ radius: v })} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Border" value={a.border} inheritLabel="Page style" options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "thick", label: "Thick" }]} customised={a.border !== undefined} onReset={() => unset("border")} onChange={(v) => set({ border: v })} />
            <SelectField label="Shadow" value={a.shadow} inheritLabel="Page style" options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard offset" }]} customised={a.shadow !== undefined} onReset={() => unset("shadow")} onChange={(v) => set({ shadow: v })} />
            <SelectField label="Spacing inside" value={a.padding} inheritLabel="Page style" options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "roomy", label: "Roomy" }]} customised={a.padding !== undefined} onReset={() => unset("padding")} onChange={(v) => set({ padding: v })} />
            <SelectField label="Text alignment" value={a.align} inheritLabel="Page style" options={[{ value: "left", label: "Left" }, { value: "center", label: "Centred" }]} customised={a.align !== undefined} onReset={() => unset("align")} onChange={(v) => set({ align: v })} />
          </div>
          <ColorField label="Card colour" value={a.background ?? spec.colors.surface} customised={a.background !== undefined} onReset={() => unset("background")} onChange={(v) => set({ background: v })} hint="Text colour adjusts automatically if it would be hard to read." />
          <ColorField label="Text colour" against={a.background ?? spec.colors.surface} value={a.text ?? spec.colors.text} customised={a.text !== undefined} onReset={() => unset("text")} onChange={(v) => set({ text: v })} />
        </>
      ) : null}
      {hasBtn ? (
        <>
          <Segmented label="Button style" value={a.buttonFill} options={[{ value: "solid", label: "Filled" }, { value: "outline", label: "Outline" }, { value: "soft", label: "Soft" }]} customised={a.buttonFill !== undefined} onReset={() => unset("buttonFill")} onChange={(v) => set({ buttonFill: v })} />
          <Segmented label="Button shape" value={a.buttonShape} options={[{ value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }, { value: "pill", label: "Pill" }]} customised={a.buttonShape !== undefined} onReset={() => unset("buttonShape")} onChange={(v) => set({ buttonShape: v })} />
        </>
      ) : null}
      <ColorField label="Accent colour" value={a.accent ?? spec.colors.accent} customised={a.accent !== undefined} onReset={() => unset("accent")} onChange={(v) => set({ accent: v })} />
      {hasThumb ? (
        <div className="grid gap-1.5">
          <FieldShell label="Thumbnail picture" customised={a.thumbnail !== undefined} onReset={() => unset("thumbnail")}>
            <ImageField label="Shown beside the button text" value={a.thumbnail ?? null} defaultAlt="Link thumbnail" onChange={(v) => set({ thumbnail: v ?? undefined })} focalHint="Choose the part of the picture to keep in the small square." maxEdge={256} />
          </FieldShell>
        </div>
      ) : null}
    </div>
  )
}
