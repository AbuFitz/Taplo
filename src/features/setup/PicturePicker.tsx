"use client"
import * as React from "react"
import Image from "next/image"
import { ImagePlus, Pencil, Trash2 } from "lucide-react"
import { CropDialog } from "@/features/page/editor/CropDialog"
import { MAX_UPLOAD_BYTES, prepareImage } from "@/features/page/editor/image"
import type { ImageRef } from "@/features/businesses/content"
import { cn } from "@/lib/utils"

type Shape = "logo" | "circle" | "square"

/**
 * A logo or cover photo. One surface: drop a file on it, tap it, or change it later; the framing dialog always comes first,
 * so nothing reaches the page until it has been framed.
 */
export function PicturePicker({ kind, value, onChange, onFraming, framing = "logo", name, label }: {
  kind: "logo" | "cover"
  value: ImageRef | null | undefined
  onChange: (v: ImageRef | null) => void
  onFraming?: (shape: Shape) => void
  framing?: Shape
  name: string
  label: string
}) {
  const id = React.useId()
  const input = React.useRef<HTMLInputElement>(null)
  const original = React.useRef<File | null>(null)
  const [pending, setPending] = React.useState<File | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [over, setOver] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const logo = kind === "logo"

  const pick = (file?: File) => {
    if (!file) return
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setError("Choose a JPG, PNG or WebP picture."); return }
    if (file.size > MAX_UPLOAD_BYTES) { setError("That picture is over 12 MB. Choose a smaller one."); return }
    setError(undefined); setPending(file)
  }
  const store = async (file: File, shape?: Shape) => {
    setBusy(true); setError(undefined)
    try {
      const p = await prepareImage(file, logo ? 640 : 1600, { preserveAlpha: logo })
      onChange({ src: p.src, width: p.width, height: p.height, ...(p.ink ? { ink: p.ink } : {}), ...(p.accent ? { accent: p.accent } : {}), alt: value?.alt || (logo ? `${name || "Business"} logo` : `${name || "Business"} cover photo`), focal: { x: 50, y: 50 } })
      original.current = file
      if (shape) onFraming?.(shape)
    } catch (e) { setError(e instanceof Error ? e.message : "That picture could not be used.") } finally { setBusy(false) }
  }
  const reframe = async () => {
    if (!value) return
    try { setPending(original.current ?? new File([await (await fetch(value.src)).blob()], logo ? "logo.png" : "cover.jpg", { type: value.src.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png" })) }
    catch { input.current?.click() }
  }
  return (
    <div className="sf-picture" data-kind={kind} data-has={Boolean(value)}>
      <div
        className={cn("sf-picture-drop", over && "is-over")}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]) }}
      >
        <button type="button" className="sf-picture-tile" disabled={busy} aria-label={value ? `${label}: change the picture` : `${label}: choose a picture`} onClick={() => (value ? void reframe() : input.current?.click())}>
          {value ? <Image src={value.src} alt="" fill sizes={logo ? "120px" : "520px"} unoptimized className={logo && framing === "logo" ? "object-contain p-2" : "object-cover"} style={logo && framing === "circle" ? { borderRadius: "50%" } : undefined} /> : <span className="sf-picture-empty"><ImagePlus aria-hidden="true" /><span>{busy ? "Preparing…" : logo ? "Add" : "Add a cover photo"}</span></span>}
        </button>
        <div className="sf-picture-copy">
          <strong>{label}</strong>
          <span>{value ? "Looks good. Tap the picture to change its framing." : logo ? "Your logo or a photo of you. PNG, JPG or WebP." : "A wide photo of your work or your place. It shows behind your name."}</span>
          <span className="sf-picture-actions">
            {value ? <>
              <button type="button" onClick={() => void reframe()} disabled={busy}><Pencil aria-hidden="true" />Adjust</button>
              <button type="button" onClick={() => input.current?.click()} disabled={busy}>Replace</button>
              <button type="button" onClick={() => onChange(null)} disabled={busy}><Trash2 aria-hidden="true" />Remove</button>
            </> : <button type="button" onClick={() => input.current?.click()} disabled={busy}>{busy ? "Preparing…" : "Choose a picture"}</button>}
          </span>
        </div>
      </div>
      <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label={`${label}: upload a picture`} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = "" }} />
      {error ? <p role="alert" className="sf-error">{error}</p> : null}
      {pending ? <CropDialog file={pending} aspect={logo ? 1 : 16 / 9} round={logo && framing === "circle"} defaultCrop={!logo || framing !== "logo" ? true : false} allowOriginal
        originalDescription={logo ? "Keep your logo complete, including its transparency." : "Keep the complete photo."} title={logo ? "Your logo, your way." : "Frame your cover photo."}
        onCancel={() => setPending(null)} onDone={(f, shape) => { const source = f; setPending(null); void store(source, logo ? (shape as Shape | undefined) : undefined) }} /> : null}
    </div>
  )
}
