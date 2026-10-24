"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarDays, ArrowUpRight } from "lucide-react"
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
import { newId } from "@/features/demo/actions"
import { ChoiceGrid, Field, Segment } from "@/features/appearance/controls"
import { ButtonTile, SurfaceTile } from "@/features/appearance/previews"
import { ColorField, FieldShell, ImageField, Segmented, SelectField, SwitchField } from "./controls"
import { RecordsField } from "./RecordsField"
import { PagePreview } from "@/features/preview/PagePreview"
import type { Editor } from "./useEditor"
import { SocialLinksEditor } from "./SocialLinksEditor"

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

  const variant = def.fields.find((f): f is Extract<FieldSpec, { kind: "select" }> => f.kind === "select" && f.key === "variant")
  return (
    <div className="grid gap-4">
      {stored.type === "booking" ? <Link href="/dashboard/bookings?section=availability" className="flex min-h-14 items-center gap-3 rounded-xl bg-neutral-100 px-4 text-sm font-medium hover:bg-neutral-200"><CalendarDays className="size-5" /><span className="flex-1">Hours and booking rules</span><ArrowUpRight className="size-4" /></Link> : null}
      {variant ? (
        <Field label="Layout">
          <ChoiceGrid label="Layout" value={String(s.variant ?? variant.options[0]!.value)} columns={variant.options.length === 1 ? 1 : 2} onChange={(v) => set("variant", v)}
            options={variant.options.map((o) => ({ value: o.value, label: o.label, preview: <span className="pointer-events-none relative block aspect-[390/330] overflow-hidden" aria-hidden="true"><PagePreview src={`/demo/preview?widget=${encodeURIComponent(stored.id)}&variant=${encodeURIComponent(o.value)}`} title={`${o.label} section preview`} mode="device" device={{ w: 390, h: 330 }} interactive={false} /></span> }))} />
        </Field>
      ) : null}
      {stored.type === "social" ? <SocialLinksEditor ed={ed} /> : null}
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
            if (f.key === "variant") return null
            return <Segmented key={f.key} label={f.label} value={String(v ?? f.options[0]!.value)} options={f.options} onChange={(x) => set(f.key, x)} columns={f.options.length > 3 ? 2 : f.options.length} />
          case "refs":
            return f.source === "socialPlatforms" || f.source === "reviewPlatforms"
              ? <RefsField key={f.key} f={f} value={v} ed={ed} onChange={(x) => set(f.key, x)} />
              : <RecordsField key={f.key} f={f} value={v} ed={ed} vehicles={stored.type === "products" && s.title === "In stock"} onChange={(x) => set(f.key, x)} />
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

/** Per-widget overrides on top of the page style, using the same visual controls as the page. Every choice shows when it differs and can reset to the page style. */
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
  const dirty = (k: keyof WidgetAppearance) => a[k] !== undefined
  const accentTile = <span className="grid h-14 w-full place-items-center bg-[#ecebe7]"><span className="grid h-9 w-[4.5rem] place-items-center rounded-lg text-[0.625rem] font-semibold" style={{ background: spec.colors.accent, color: spec.colors.accentText }}>Aa</span></span>

  const page = ed.state.page
  const saveStyle = (name: string) => ed.setPage((p) => ({ ...p, savedStyles: [...p.savedStyles.slice(-19), { id: newId("style"), name, appearance: structuredClone(a) }] }))
  const applyStyle = (id: string, toAll = false) => ed.setPage((p) => {
    const st = p.savedStyles.find((x) => x.id === id)
    if (!st) return p
    return { ...p, widgets: p.widgets.map((w) => (w.id === stored.id || (toAll && w.type === stored.type) ? { ...w, appearance: structuredClone(st.appearance) } : w)) }
  })

  return (
    <div className="grid gap-5" data-testid="widget-appearance">
      <div className="flex items-center justify-between gap-2 rounded-xl bg-black/[0.04] px-3 py-2">
        <p className="text-xs text-neutral-600">{count ? `${count} setting${count === 1 ? "" : "s"} differ from the page style.` : "Following your page style."}</p>
        <button type="button" disabled={!count} onClick={() => ed.updateWidget(stored.id, { appearance: null })} className="min-h-8 text-xs font-medium text-neutral-900 underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40">Reset to page style</button>
      </div>
      <SavedStyles styles={page.savedStyles} canSave={count > 0} onSave={saveStyle} onApply={applyStyle} onRemove={(id) => ed.setPage((p) => ({ ...p, savedStyles: p.savedStyles.filter((x) => x.id !== id) }))} typeLabel={def.label} />
      <Field label="Emphasis" dirty={dirty("emphasis")} onReset={() => unset("emphasis")} hint="Featured is larger with an accent border.">
        <Segment label="Emphasis" value={a.emphasis ?? "normal"} options={[{ value: "normal", label: "Normal" }, { value: "featured", label: "Featured" }]} onChange={(v) => set({ emphasis: v })} />
      </Field>
      {hasCard ? (
        <>
          <Field label="Surface" dirty={dirty("surface")} onReset={() => unset("surface")}>
            <ChoiceGrid label="Surface" value={a.surface ?? spec.cards.surface} columns={5} onChange={(v) => set({ surface: v })}
              options={[
                ...(["solid", "soft", "glass", "transparent"] as const).map((k) => ({ value: k as NonNullable<WidgetAppearance["surface"]>, label: { solid: "Solid", soft: "Soft", glass: "Frosted", transparent: "None" }[k], preview: <SurfaceTile kind={k} accent={spec.colors.accent} /> })),
                { value: "accent" as const, label: "Accent", preview: accentTile },
              ]} />
          </Field>
          <Field label="Corners" dirty={dirty("radius")} onReset={() => unset("radius")}><Segment label="Corners" value={a.radius ?? spec.cards.radius} options={[{ value: "none", label: "Square" }, { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }]} onChange={(v) => set({ radius: v })} /></Field>
          <Field label="Border" dirty={dirty("border")} onReset={() => unset("border")}><Segment label="Border" value={a.border ?? spec.cards.border} options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "thick", label: "Thick" }]} onChange={(v) => set({ border: v })} /></Field>
          <Field label="Shadow" dirty={dirty("shadow")} onReset={() => unset("shadow")}><Segment label="Shadow" value={a.shadow ?? spec.cards.shadow} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} onChange={(v) => set({ shadow: v })} /></Field>
          <Field label="Space inside" dirty={dirty("padding")} onReset={() => unset("padding")}><Segment label="Spacing inside" value={a.padding ?? spec.cards.padding} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "roomy", label: "Roomy" }]} onChange={(v) => set({ padding: v })} /></Field>
          <Field label="Text alignment" dirty={dirty("align")} onReset={() => unset("align")}><Segment label="Text alignment" value={a.align ?? spec.text.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => set({ align: v })} /></Field>
          <ColorField label="Card colour" value={a.background ?? spec.colors.surface} customised={dirty("background")} onReset={() => unset("background")} onChange={(v) => set({ background: v })} hint="Text colour adjusts automatically if it would be hard to read." />
          <ColorField label="Text colour" against={a.background ?? spec.colors.surface} value={a.text ?? spec.colors.text} customised={dirty("text")} onReset={() => unset("text")} onChange={(v) => set({ text: v })} />
        </>
      ) : null}
      {hasBtn ? (
        <>
          <Field label="Button style" dirty={dirty("buttonFill")} onReset={() => unset("buttonFill")}>
            <ChoiceGrid label="Button style" value={a.buttonFill ?? spec.buttons.fill} columns={3} onChange={(v) => set({ buttonFill: v })}
              options={(["solid", "outline", "soft"] as const).map((f) => ({ value: f, label: { solid: "Filled", outline: "Outline", soft: "Soft" }[f], preview: <ButtonTile fill={f} shape={a.buttonShape ?? spec.buttons.shape} accent={a.accent ?? spec.colors.accent} on={spec.colors.accentText} /> }))} />
          </Field>
          <Field label="Button shape" dirty={dirty("buttonShape")} onReset={() => unset("buttonShape")}>
            <ChoiceGrid label="Button shape" value={a.buttonShape ?? spec.buttons.shape} columns={3} onChange={(v) => set({ buttonShape: v })}
              options={(["square", "rounded", "pill"] as const).map((sh) => ({ value: sh, label: { square: "Square", rounded: "Rounded", pill: "Pill" }[sh], preview: <ButtonTile fill={a.buttonFill ?? spec.buttons.fill} shape={sh} accent={a.accent ?? spec.colors.accent} on={spec.colors.accentText} /> }))} />
          </Field>
        </>
      ) : null}
      <ColorField label="Accent colour" value={a.accent ?? spec.colors.accent} customised={dirty("accent")} onReset={() => unset("accent")} onChange={(v) => set({ accent: v })} />
      {hasThumb ? (
        <FieldShell label="Thumbnail picture" customised={a.thumbnail !== undefined} onReset={() => unset("thumbnail")}>
          <ImageField label="Shown beside the button text" value={a.thumbnail ?? null} defaultAlt="Link thumbnail" onChange={(v) => set({ thumbnail: v ?? undefined })} focalHint="Choose the part of the picture to keep in the small square." maxEdge={256} />
        </FieldShell>
      ) : null}
    </div>
  )
}

/** Reusable widget styles: save what this widget looks like, then apply it to another widget (or every widget of this kind). */
function SavedStyles({ styles, canSave, onSave, onApply, onRemove, typeLabel }: { styles: { id: string; name: string }[]; canSave: boolean; onSave: (name: string) => void; onApply: (id: string, toAll?: boolean) => void; onRemove: (id: string) => void; typeLabel: string }) {
  const [name, setName] = React.useState("")
  if (!styles.length && !canSave) return null
  return (
    <div className="grid gap-2 rounded-2xl bg-black/[0.035] p-3" data-testid="saved-styles">
      <p className="text-xs font-semibold">Saved styles</p>
      {styles.length ? (
        <ul className="grid gap-1.5" aria-label="Saved widget styles">
          {styles.map((st) => (
            <li key={st.id} className="flex items-center gap-1 rounded-xl bg-white pl-3 shadow-[0_0_0_1px_rgb(0_0_0/0.1)]">
              <span className="min-w-0 flex-1 truncate text-xs font-medium">{st.name}</span>
              <button type="button" onClick={() => onApply(st.id)} className="min-h-9 px-2 text-xs font-medium underline-offset-4 hover:underline">Apply</button>
              <button type="button" onClick={() => onApply(st.id, true)} className="min-h-9 px-2 text-xs font-medium underline-offset-4 hover:underline">All {typeLabel.toLowerCase()}</button>
              <button type="button" onClick={() => onRemove(st.id)} aria-label={`Delete ${st.name}`} className="grid size-9 place-items-center text-neutral-500 hover:text-neutral-900">×</button>
            </li>
          ))}
        </ul>
      ) : null}
      {canSave ? (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return; onSave(n); setName("") }}>
          <input aria-label="Name this style" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Save this look as…" className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-white px-3 text-sm" />
          <button type="submit" disabled={!name.trim()} className="h-10 shrink-0 rounded-xl bg-neutral-900 px-3.5 text-xs font-medium text-white disabled:opacity-40">Save</button>
        </form>
      ) : null}
    </div>
  )
}
