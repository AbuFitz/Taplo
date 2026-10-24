"use client"

import * as React from "react"
import Image from "next/image"
import { ImagePlus, Pencil, RotateCcw, Trash2 } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { contrastRatio } from "../themes/color"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { ImageRef } from "@/features/businesses/content"
import { Overlay } from "@/components/taplo/overlay"
import { CropDialog } from "./CropDialog"
import { SAMPLE_IMAGES, prepareImage, MAX_UPLOAD_BYTES, containedImageRect } from "./image"

/** A small "Customised · Reset to theme" affordance shared by every appearance control. */
export function ResetLink({ show, onReset, label = "Reset" }: { show: boolean; onReset: () => void; label?: string }) {
  if (!show) return null
  return (
    <button type="button" onClick={onReset} className="inline-flex min-h-8 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline">
      <RotateCcw className="size-3" aria-hidden="true" />{label}
    </button>
  )
}

export function FieldShell({ label, customised, onReset, hint, children, id }: { label: string; customised?: boolean; onReset?: () => void; hint?: string; children: React.ReactNode; id?: string }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-sm font-medium">{label}{customised ? <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Customised</span> : null}</Label>
        {onReset ? <ResetLink show={Boolean(customised)} onReset={onReset} /> : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export interface Opt<T extends string> { value: T; label: string; hint?: string }

/** Radio-style segmented control. Keyboard: arrows move, space/enter selects (native radios). */
export function Segmented<T extends string>({ label, value, options, onChange, customised, onReset, hint, columns }: {
  label: string; value: T | undefined; options: Opt<T>[]; onChange: (v: T) => void; customised?: boolean; onReset?: () => void; hint?: string; columns?: number
}) {
  const name = React.useId()
  return (
    <fieldset className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <legend className="text-sm font-medium">{label}{customised ? <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Customised</span> : null}</legend>
        {onReset ? <ResetLink show={Boolean(customised)} onReset={onReset} /> : null}
      </div>
      <div role="radiogroup" aria-label={label} className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns ?? Math.min(options.length, 3)}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label key={o.value} className={cn("flex min-h-11 cursor-pointer flex-col justify-center rounded-lg border px-2.5 py-1.5 text-center text-sm transition-colors focus-within:ring-2 focus-within:ring-ring/50 hover:bg-muted", value === o.value && "border-primary bg-primary/10 font-semibold ring-1 ring-primary")}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
            {o.hint ? <span className="text-[11px] font-normal text-muted-foreground">{o.hint}</span> : null}
          </label>
        ))}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </fieldset>
  )
}

export function SelectField<T extends string>({ label, value, options, onChange, inheritLabel, customised, onReset, id }: {
  label: string; value: T | undefined; options: Opt<T>[]; onChange: (v: T | undefined) => void; inheritLabel?: string; customised?: boolean; onReset?: () => void; id?: string
}) {
  const auto = React.useId()
  const sid = id ?? auto
  return (
    <FieldShell label={label} id={sid} customised={customised} onReset={onReset}>
      <Select value={value ?? "__inherit"} onValueChange={(v) => onChange(v === "__inherit" ? undefined : (v as T))}>
        <SelectTrigger id={sid} className="min-h-11 w-full"><SelectValue /></SelectTrigger>
        <SelectContent position="popper">
          {inheritLabel ? <SelectItem value="__inherit">{inheritLabel}</SelectItem> : null}
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </FieldShell>
  )
}

export function SwitchField({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = React.useId()
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <div><Label htmlFor={id} className="text-sm font-medium">{label}</Label>{hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}</div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function RangeField({ label, value, min, max, step = 1, unit = "%", onChange, customised, onReset }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void; customised?: boolean; onReset?: () => void }) {
  const id = React.useId()
  return (
    <FieldShell label={label} id={id} customised={customised} onReset={onReset}>
      <div className="flex items-center gap-3">
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-11 flex-1 accent-[var(--primary)]" />
        <output htmlFor={id} className="w-14 text-right text-sm tabular-nums">{value}{unit}</output>
      </div>
    </FieldShell>
  )
}

const HEX = /^#[0-9a-fA-F]{6}$/

/** Native colour picker plus a hex box; only valid colours are committed. `value` is the resolved colour in effect. */
export function ColorField({ label, value, onChange, customised, onReset, hint, against }: { label: string; value: string; onChange: (hex: string) => void; customised?: boolean; onReset?: () => void; hint?: string; /** Background this colour is read against; shows a live contrast rating. */ against?: string }) {
  const id = React.useId()
  const [text, setText] = React.useState(value)
  const [seen, setSeen] = React.useState(value)
  // Re-sync when the colour changes from elsewhere (undo, reset); render-phase update, per React docs.
  if (value !== seen) {
    setSeen(value)
    setText(value)
  }
  const bad = text !== value && !HEX.test(text)
  const ratio = against && HEX.test(value) && HEX.test(against) ? contrastRatio(value, against) : null
  return (
    <FieldShell label={label} id={id} customised={customised} onReset={onReset} hint={hint}>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" aria-label={`${label}: choose colour`} data-testid="colour-swatch" className="size-11 shrink-0 rounded-lg border p-1 focus-visible:ring-2 focus-visible:ring-ring">
              <span className="block size-full rounded-md border border-black/10" style={{ background: HEX.test(value) ? value : "#000000" }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3" align="start">
            <HexColorPicker color={HEX.test(value) ? value : "#000000"} onChange={(c) => onChange(c.toLowerCase())} />
          </PopoverContent>
        </Popover>
        <input id={id} type="text" inputMode="text" spellCheck={false} aria-label={`${label} hex value`} aria-invalid={bad || undefined} value={text} maxLength={7}
          onChange={(e) => { const v = e.target.value; setText(v); if (HEX.test(v)) onChange(v.toLowerCase()) }}
          className={cn("h-11 w-28 rounded-lg border bg-transparent px-3 font-mono text-sm", bad && "border-destructive")} />
        {ratio !== null ? <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", ratio >= 4.5 ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900")} data-testid="contrast-badge">{ratio >= 4.5 ? "Readable" : "Hard to read"} · {ratio.toFixed(1)}:1</span> : null}
      </div>
      {bad ? <p role="alert" className="text-xs text-destructive">Use a six-digit colour like #1a2b3c.</p> : null}
    </FieldShell>
  )
}

/** Image chooser: upload (downscaled in the browser), pick a sample, remove; plus a focal-point picker so crops keep the subject. */
export function ImageField({ presentation = "standard", framing = "logo", label, value, onChange, defaultAlt, maxEdge, cropAspect, cropRound, purpose = "photo", samples = true, onFramingChange, focalHint = "Click the picture (or use the sliders) to choose the part that should always stay in view." }: {
  presentation?: "standard" | "identity"; framing?: "logo"|"circle"|"square"; label: string; value: ImageRef | null | undefined; onChange: (v: ImageRef | null) => void; defaultAlt: string; maxEdge?: number; /** When set, a crop step frames the picture at this width/height ratio before it is used. */ cropAspect?: number; cropRound?: boolean; purpose?: "photo" | "identity" | "cover"; samples?: boolean; onFramingChange?: (shape:"logo"|"circle"|"square")=>void; focalHint?: string
}) {
  const inputId = React.useId()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const [showSamples, setShowSamples] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const original = React.useRef<File | null>(null)
  const box = React.useRef<HTMLDivElement>(null)

  const [pending, setPending] = React.useState<File | null>(null)
  function onPick(file: File | undefined) {
    if (!file) return
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setError("Choose a JPG, PNG or WebP picture."); return }
    if (file.size > MAX_UPLOAD_BYTES) { setError("That picture is over 12 MB. Choose a smaller one."); return }
    setError(undefined); setPending(file)
  }
  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(undefined)
    try {
      const p = await prepareImage(file, maxEdge, { preserveAlpha: purpose === "identity" })
      onChange({ src: p.src, width: p.width, height: p.height, ...(p.ink ? { ink: p.ink } : {}), ...(p.accent ? { accent: p.accent } : {}), alt: value?.alt || defaultAlt, focal: { x: 50, y: 50 } })
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : "That picture could not be used.")
      return false
    } finally {
      setBusy(false)
    }
  }
  const setFocal = (x: number, y: number) => value && onChange({ ...value, focal: { x: Math.round(Math.max(0, Math.min(100, x))), y: Math.round(Math.max(0, Math.min(100, y))) } })
  const fx = value?.focal?.x ?? 50
  const fy = value?.focal?.y ?? 50
  const wholeLogo = purpose === "identity" && Boolean(value?.width && value?.height && value.width / value.height > 1.5)
  const marker = containedImageRect({ width: 160, height: 100 }, value ?? {})
  const openFraming = async () => {
    if (!value) return
    try {
      const file = original.current ?? new File([await (await fetch(value.src)).blob()], "profile-image.png", { type: value.src.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png' })
      setPending(file)
    } catch { setError("Choose the original file to change its crop.") }
  }


  return (
    <div className={cn("grid gap-2", presentation === "identity" && "setup-identity-upload")}>
      {presentation === "identity" ? <button type="button" disabled={busy} className="setup-avatar-control" onClick={() => value ? void openFraming() : document.getElementById(inputId)?.click()} aria-label={value ? `Edit image: ${label}` : label}>
        <span className="setup-avatar-picture">{value ? <span className="setup-avatar-image" data-framing={framing} style={{borderRadius:framing === "circle"?"50%":framing === "square"?"10px":0}}><Image src={value.src} alt="" fill sizes="96px" unoptimized className={framing === "logo"?"object-contain":"object-cover"} /></span> : <ImagePlus aria-hidden="true" className="size-7" />}{value ? <span className="setup-avatar-plus"><Pencil aria-hidden="true" className="size-3" /></span> : null}</span>
        <span>{busy ? "Preparing…" : value ? "Adjust your logo" : "Add a logo or photo"}<span className="setup-upload-meta">PNG, JPG or WebP. Optional.</span></span>
      </button> : <p className="text-sm font-medium">{label}</p>}
      {value && presentation === "identity" ? <div className="flex gap-5"><button type="button" className="setup-secondary" disabled={busy} onClick={()=>document.getElementById(inputId)?.click()}>Replace image</button><button type="button" className="setup-secondary" disabled={busy} onClick={()=>onChange(null)}>Remove image</button></div> : null}
      {value && presentation !== "identity" ? <button type="button" className="flex min-h-24 items-center gap-4 rounded-2xl bg-neutral-50 p-3 text-left" onClick={() => setEditing(true)} aria-label={`Edit image: ${label}`}><span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white"><Image src={value.src} alt="" fill sizes="64px" unoptimized className="object-contain" /></span><span className="text-sm font-medium">Edit image<span className="mt-1 block text-xs font-normal text-muted-foreground">Framing and image details</span></span><Pencil aria-hidden="true" className="ml-auto size-4"/></button> : null}
      <Overlay open={editing} onOpenChange={setEditing} title={`Edit image: ${label}`} testId="image-edit-dialog" footer={<Button className="min-h-11 w-full" onClick={() => setEditing(false)}>Done</Button>}>
      {value ? (
        <div className="grid gap-3">
          <div
            ref={box}
            className="relative aspect-[16/10] w-full cursor-crosshair overflow-hidden rounded-lg border bg-muted"
            onPointerDown={(e) => {
              const r = box.current!.getBoundingClientRect()
              if (wholeLogo) return
              const image = containedImageRect(r, value)
              setFocal(((e.clientX - r.left - image.x) / image.width) * 100, ((e.clientY - r.top - image.y) / image.height) * 100)
            }}
          >
            <Image src={value.src} alt={value.alt} fill sizes="400px" unoptimized className="object-contain" />
            {!wholeLogo ? <span aria-hidden="true" className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,.6)]" style={{ left: `${(marker.x + marker.width * fx / 100) / 1.6}%`, top: `${marker.y + marker.height * fy / 100}%` }} /> : null}
          </div>
          <p className="text-xs text-muted-foreground">{wholeLogo ? "Your logo keeps its original proportions and transparency. It is shown whole in every profile layout." : focalHint}</p>
          {!wholeLogo ? <div className="grid grid-cols-2 gap-3">
            <RangeField label="Horizontal focus" value={fx} min={0} max={100} onChange={(v) => setFocal(v, fy)} />
            <RangeField label="Vertical focus" value={fy} min={0} max={100} onChange={(v) => setFocal(fx, v)} />
          </div> : null}
          <div className="grid gap-1.5">
            <Label htmlFor={`${inputId}-alt`} className="text-sm font-medium">Describe the picture (for screen readers)</Label>
            <input id={`${inputId}-alt`} value={value.alt} maxLength={240} onChange={(e) => onChange({ ...value, alt: e.target.value })} className="h-11 rounded-lg border bg-transparent px-3 text-sm" />
          </div>
        </div>
      ) : null}
      <Button type="button" variant="outline" className="mt-4 min-h-11 w-full" onClick={async () => {
        if (!value) return
        try { const file = original.current ?? new File([await (await fetch(value.src)).blob()], "profile-image.png", { type: value.src.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png' }); setEditing(false); setPending(file) } catch { setError("Choose the original file to change its crop.") }
      }}>Change crop or framing</Button>
      {presentation === "identity" ? <div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => { setEditing(false); document.getElementById(inputId)?.click() }}>Replace picture</Button><Button variant="ghost" onClick={() => { onChange(null); setEditing(false) }}><Trash2 aria-hidden="true" />Remove</Button></div> : null}
      </Overlay>
      <div className="flex flex-wrap gap-2">
        {presentation !== "identity" ? <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => document.getElementById(inputId)?.click()}><ImagePlus /> {busy ? "Preparing…" : value ? "Replace picture" : "Upload a picture"}</Button> : null}
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = "" }} aria-label={`${label}: upload a picture`} />
        {pending ? <CropDialog file={pending} aspect={cropAspect ?? 1} round={framing === "circle" || cropRound} defaultCrop={framing !== "logo"} allowOriginal={purpose !== "photo"} title={purpose === "identity" ? "Your logo, your way." : "Adjust your photo"} onCancel={() => setPending(null)} onDone={(f,shape) => { const source=pending;setPending(null);void onFile(f).then(success=>{if(success){original.current=source;if(shape)onFramingChange?.(shape)}}) }} /> : null}
        {samples ? <Button type="button" variant="ghost" size="sm" onClick={() => setShowSamples((v) => !v)} aria-expanded={showSamples}>Use a sample picture</Button> : null}
        {value && presentation !== "identity" ? <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}><Trash2 /> Remove</Button> : null}
      </div>
      {showSamples ? (
        <ul className="grid grid-cols-4 gap-2" aria-label="Sample pictures">
          {SAMPLE_IMAGES.map((s) => (
            <li key={s.src}>
              <button type="button" onClick={() => { onChange({ src: s.src, alt: value?.alt || defaultAlt, focal: { x: 50, y: 50 }, width: 1200, height: 900 }); setShowSamples(false) }} className="relative block aspect-square w-full overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-ring">
                <Image src={s.src} alt={s.label} fill sizes="80px" unoptimized className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {!value && presentation !== "identity" ? <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Preview and frame it before adding.</p> : null}
    </div>
  )
}
