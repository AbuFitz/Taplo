"use client"

import * as React from "react"
import { ArrowLeft, Pencil, Plus } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPrice } from "@/features/services/format"
import type { BusinessContentInput } from "@/features/businesses/content"
import type { FieldSource, FieldSpec } from "../widgets/types"
import type { RecordKind } from "./content-model"
import { RECORD_TITLE, RecordForm, blankFor, commitRecord, validate } from "./RecordForms"
import type { Editor } from "./useEditor"

/**
 * The records behind a widget (services, people, products, questions...), shown where they are used: pick which ones the
 * widget shows, edit one, or add one, without leaving the panel. A record belongs to the business, not the page, so
 * taking a widget off the page never deletes it. Services, products and offers are archived rather than erased, because
 * bookings and links may refer to them.
 */

interface Row { id: string; name: string; meta?: string; thumb?: string }
interface Spec { kind: RecordKind | ((editing: unknown) => RecordKind); noun: string; editable: boolean; archive: boolean }

const SPEC: Partial<Record<FieldSource, Spec>> = {
  services: { kind: "service", noun: "service", editable: true, archive: true },
  staff: { kind: "staff", noun: "team member", editable: true, archive: false },
  testimonials: { kind: "review", noun: "review", editable: true, archive: false },
  faqs: { kind: "faq", noun: "question", editable: true, archive: false },
  products: { kind: "product", noun: "product", editable: true, archive: true },
  offers: { kind: "offer", noun: "offer", editable: true, archive: true },
  gallery: { kind: "photo", noun: "photo", editable: true, archive: false },
}

function rowsFor(source: FieldSource, c: BusinessContentInput, vehicles: boolean): Row[] {
  switch (source) {
    case "services": return (c.services ?? []).filter((s) => !s.archived).map((s) => ({ id: s.id, name: s.name, meta: formatPrice({ ...s, currency: s.currency ?? "GBP" }) }))
    case "staff": return (c.staff ?? []).map((s) => ({ id: s.id, name: s.name, meta: s.role, thumb: s.photo?.src }))
    case "testimonials": return (c.testimonials ?? []).map((t) => ({ id: t.id, name: t.author, meta: `“${t.quote.slice(0, 48)}${t.quote.length > 48 ? "…" : ""}”` }))
    case "faqs": return (c.faqs ?? []).map((f) => ({ id: f.id, name: f.question || "Untitled question" }))
    case "products": return (c.products ?? []).filter((p) => !p.archived && (p.kind === "vehicle") === vehicles).map((p) => ({ id: p.id, name: p.name, meta: p.kind === "vehicle" ? "Vehicle" : undefined, thumb: p.images?.[0]?.src }))
    case "offers": return (c.offers ?? []).filter((o) => !o.archived).map((o) => ({ id: o.id, name: o.title }))
    case "gallery": return (c.gallery ?? []).map((g, i) => ({ id: g.id, name: g.caption || `Photo ${i + 1}`, thumb: g.image.src }))
    default: return []
  }
}

/** Find the stored record, in the shape its form edits. */
function find(source: FieldSource, c: BusinessContentInput, id: string): unknown {
  switch (source) {
    case "services": return c.services?.find((x) => x.id === id)
    case "staff": return c.staff?.find((x) => x.id === id)
    case "testimonials": return c.testimonials?.find((x) => x.id === id)
    case "faqs": return c.faqs?.find((x) => x.id === id)
    case "products": return c.products?.find((x) => x.id === id)
    case "offers": return c.offers?.find((x) => x.id === id)
    case "gallery": { const g=c.gallery?.find(x=>x.id===id); return g ? {id:g.id,images:[g.image],caption:g.caption??"",before:g.beforeImage} : undefined }
    default: return undefined
  }
}

function replace(source: FieldSource, c: BusinessContentInput, id: string, v: any): BusinessContentInput {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const swap = <T extends { id: string }>(list: T[] | undefined) => (list ?? []).map((x) => (x.id === id ? v : x))
  switch (source) {
    case "services": return { ...c, services: swap(c.services) }
    case "staff": return { ...c, staff: swap(c.staff) }
    case "testimonials": return { ...c, testimonials: swap(c.testimonials) }
    case "faqs": return { ...c, faqs: swap(c.faqs) }
    case "products": return { ...c, products: swap(c.products) }
    case "offers": return { ...c, offers: swap(c.offers) }
    case "gallery": return {...c,gallery:swap(c.gallery).map(g=>g.id===id?{id,image:v.images[0],caption:v.caption?.trim()||undefined,beforeImage:v.before}:g)}
    default: return c
  }
}

function remove(source: FieldSource, c: BusinessContentInput, id: string, archive: boolean): BusinessContentInput {
  const out = <T extends { id: string }>(list: T[] | undefined) => (list ?? []).filter((x) => x.id !== id)
  const arch = <T extends { id: string }>(list: T[] | undefined) => (list ?? []).map((x) => (x.id === id ? { ...x, archived: true } : x))
  switch (source) {
    case "services": return { ...c, services: arch(c.services) }
    case "products": return { ...c, products: arch(c.products) }
    case "offers": return { ...c, offers: arch(c.offers) }
    case "staff": return { ...c, staff: out(c.staff) }
    case "testimonials": return { ...c, testimonials: out(c.testimonials) }
    case "faqs": return { ...c, faqs: out(c.faqs) }
    case "gallery": return { ...c, gallery: out(c.gallery) }
    default: void archive; return c
  }
}

type Mode = { kind: "add" } | { kind: "edit"; id: string } | null

export function RecordsField({ f, value, ed, onChange, vehicles = false }: { f: Extract<FieldSpec, { kind: "refs" }>; value: unknown; ed: Editor; onChange: (v: string[] | null) => void; vehicles?: boolean }) {
  const spec = SPEC[f.source]
  const content = ed.state.content
  const rows = rowsFor(f.source, content, vehicles)
  const all = !Array.isArray(value)
  const chosen = new Set(Array.isArray(value) ? (value as string[]) : [])
  const field = React.useRef<HTMLFieldSetElement>(null)
  const [mode, setMode] = React.useState<Mode>(null)
  const [draft, setDraft] = React.useState<any>(null)  // eslint-disable-line @typescript-eslint/no-explicit-any
  const [show, setShow] = React.useState(false)
  const [confirm, setConfirm] = React.useState(false)
  const kind: RecordKind | null = spec ? (f.source === "products" ? (vehicles ? "vehicle" : "product") : (spec.kind as RecordKind)) : null

  const close = () => { const id=mode?.kind==="edit"?mode.id:null; setMode(null); setDraft(null); setShow(false); setConfirm(false); if(id)requestAnimationFrame(()=>field.current?.querySelector<HTMLButtonElement>(`[data-record-id="${CSS.escape(id)}"] [data-testid="record-edit"]`)?.focus()) }
  const openAdd = () => { if (!kind) return; setDraft(blankFor(kind, content)); setShow(false); setMode({ kind: "add" }) }
  const openEdit = (id: string) => { const rec = find(f.source, content, id); if (!rec) return; setDraft(structuredClone(rec)); setShow(false); setConfirm(false); setMode({ kind: "edit", id }) }

  if (!spec || !kind) return null

  if (mode && draft) {
    const editKind: RecordKind = f.source === "products" && draft.kind === "vehicle" ? "vehicle" : kind
    const save = () => {
      if (Object.keys(validate(editKind, draft)).length) { setShow(true); return }
      if (mode.kind === "add") {
        if (editKind === "photo") {
          const next=commitRecord(editKind,draft,content)
          ed.setContent(()=>next)
          if(!all) { const previous=new Set(content.gallery?.map(g=>g.id)); onChange([...chosen,...(next.gallery??[]).filter(g=>!previous.has(g.id)).map(g=>g.id)]) }
        } else {
          ed.setContent((c) => commitRecord(editKind, draft, c))
          if (!all && draft.id) onChange([...chosen, draft.id as string])
        }
      } else {
        ed.setContent((c) => replace(f.source, c, mode.id, editKind === "service" ? { ...draft, name: draft.name.trim() } : draft))
      }
      close()
    }
    const form = (
      <div className="grid gap-4" data-testid="record-editor">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" className="-ml-2 min-h-10 gap-1.5 px-2" onClick={close}><ArrowLeft /> Back</Button>
          <p className="min-w-0 flex-1 truncate text-right text-sm font-semibold">{mode.kind === "add" ? RECORD_TITLE[editKind] : `Edit ${spec.noun}`}</p>
        </div>
        <RecordForm kind={editKind} value={draft} onChange={setDraft} showErrors={show} content={content} />
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" className="min-h-11 flex-1" onClick={save} data-testid="record-editor-save">{mode.kind === "add" ? `Add ${spec.noun}` : "Save changes"}</Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={close}>Cancel</Button>
        </div>
        {mode.kind === "edit" && spec.editable ? (
          confirm ? (
            <div className="grid gap-2 rounded-xl bg-muted p-3 text-sm" role="alert">
              <p>{spec.archive ? `Take this ${spec.noun} off your page and your bookings? Past bookings keep it.` : `Delete this ${spec.noun} everywhere it appears?`}</p>
              <div className="flex gap-2">
                <Button type="button" variant="destructive" className="min-h-11" onClick={() => { ed.setContent((c) => remove(f.source, c, mode.id, spec.archive)); close() }} data-testid="record-delete-confirm">{spec.archive ? "Remove it" : "Delete it"}</Button>
                <Button type="button" variant="outline" className="min-h-11" onClick={() => setConfirm(false)}>Keep it</Button>
              </div>
            </div>
          ) : <button type="button" onClick={() => setConfirm(true)} className="min-h-10 justify-self-start text-sm font-medium text-destructive underline-offset-4 hover:underline">{spec.archive ? `Remove this ${spec.noun}…` : `Delete this ${spec.noun}…`}</button>
        ) : null}
      </div>
    )
    return f.source === "gallery" ? <Overlay open onCloseAutoFocus={event=>event.preventDefault()} onOpenChange={open=>!open&&close()} title={mode.kind==="edit"?"Edit photo":"Add photos"} testId="gallery-photo-editor">{form}</Overlay> : form
  }

  return (
    <fieldset ref={field} className="grid gap-2" data-testid="records-field">
      <legend className="mb-1 text-sm font-medium">{f.label}</legend>
      <label className="flex min-h-11 items-center gap-2 text-sm"><Checkbox checked={all} onCheckedChange={(c) => onChange(c ? null : rows.map((o) => o.id))} /> Show all{rows.length ? ` (${rows.length})` : ""}, including new ones</label>
      {rows.length ? (
        <ul className="min-w-0 divide-y overflow-hidden rounded-xl border">
          {rows.map((r) => (
            <li key={r.id} data-record-id={r.id} className="flex min-h-14 items-center gap-2 px-3 py-1.5">
              {!all ? <Checkbox checked={chosen.has(r.id)} aria-label={`Show ${r.name}`} onCheckedChange={(c) => { const next = new Set(chosen); if (c) next.add(r.id); else next.delete(r.id); onChange(rows.map((x) => x.id).filter((id) => next.has(id))) }} /> : null}
              {r.thumb ? (
                // Browser uploads are already local image data.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.thumb} alt="" className="size-9 shrink-0 rounded-md object-cover" />
              ) : null}
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{r.name}</span>{r.meta ? <span className="block truncate text-xs text-muted-foreground">{r.meta}</span> : null}</span>
              {spec.editable ? <Button type="button" variant="ghost" size="sm" className="min-h-11 shrink-0 gap-1.5 px-2.5" onClick={() => openEdit(r.id)} aria-label={`Edit ${r.name}`} data-testid="record-edit"><Pencil /> Edit</Button> : <Button type="button" variant="ghost" size="sm" className="min-h-11 shrink-0 px-2.5 text-destructive" aria-label={`Remove ${r.name}`} onClick={() => ed.setContent((c) => remove(f.source, c, r.id, false))}>Remove</Button>}
            </li>
          ))}
        </ul>
      ) : <p className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">Nothing here yet.</p>}
      <Button type="button" variant="outline" className="min-h-11 justify-self-start" onClick={openAdd} data-testid="record-add"><Plus /> {RECORD_TITLE[kind]}</Button>
      {f.help ? <p className="text-xs text-muted-foreground">{f.help}</p> : null}
    </fieldset>
  )
}
