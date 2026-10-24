"use client"

import * as React from "react"
import { z } from "zod"
import { TaploInput } from "@/components/taplo/taplo-input"
import { normalizePhone } from "@/lib/validation"
import { cn } from "@/lib/utils"
import { PagePreview } from "@/features/preview/PagePreview"
import type { Selection } from "@/features/page/editor/selection"

/** Local text that re-syncs when the stored value changes from elsewhere (undo/redo, loading a sample). */
function useSyncedText(value: string | undefined) {
  const [text, setText] = React.useState(value ?? "")
  const [error, setError] = React.useState<string>()
  const [committed, setCommitted] = React.useState(value)
  if (value !== committed) {
    setCommitted(value)
    setText(value ?? "")
    setError(undefined)
  }
  return { text, setText, error, setError, commit: setCommitted }
}

/** Holds what the user is typing; only valid (or empty) values are committed to the draft. */
export function PhoneField({ label, value, onCommit, hint }: { label: string; value?: string; onCommit: (v: string | undefined) => void; hint?: string }) {
  const { text, setText, error, setError, commit } = useSyncedText(value)
  return (
    <TaploInput
      label={label}
      type="tel"
      inputMode="tel"
      autoComplete="off"
      hint={hint}
      error={error}
      value={text}
      onChange={(e) => {
        const v = e.target.value
        setText(v)
        if (!v.trim()) {
          setError(undefined)
          commit(undefined)
          onCommit(undefined)
        } else {
          const n = normalizePhone(v)
          if (n) {
            setError(undefined)
            commit(n)
            onCommit(n)
          } else setError("Enter a valid phone number (7–15 digits).")
        }
      }}
    />
  )
}

const emailSchema = z.string().trim().email().max(254)

export function EmailField({ value, onCommit }: { value?: string; onCommit: (v: string | undefined) => void }) {
  const { text, setText, error, setError, commit } = useSyncedText(value)
  return (
    <TaploInput
      label="Email"
      type="email"
      autoComplete="off"
      error={error}
      value={text}
      onChange={(e) => {
        const v = e.target.value
        setText(v)
        if (!v.trim()) {
          setError(undefined)
          commit(undefined)
          onCommit(undefined)
        } else if (emailSchema.safeParse(v).success) {
          setError(undefined)
          commit(v.trim())
          onCommit(v.trim())
        } else setError("Enter a valid email address.")
      }}
    />
  )
}

export function UrlField({ label, value, onCommit, validate, help, autoFocus = false }: { label: string; value?: string; onCommit: (v: string | undefined) => void; validate?: (v: string) => boolean; help?: string; autoFocus?: boolean }) {
  const { text, setText, error, setError, commit } = useSyncedText(value)
  return (
    <TaploInput
      label={label}
      type="url"
      autoFocus={autoFocus}
      placeholder="https://"
      hint={help}
      error={error}
      value={text}
      onChange={(e) => {
        const v = e.target.value
        setText(v)
        if (!v.trim()) {
          setError(undefined)
          commit(undefined)
          onCommit(undefined)
          return
        }
        let ok = false
        try {
          const u = new URL(v.trim())
          ok = u.protocol === "https:" || u.protocol === "http:"
        } catch {}
        if (ok && validate && !validate(v.trim())) ok = false
        if (ok) {
          setError(undefined)
          commit(v.trim())
          onCommit(v.trim())
        } else setError(validate ? "That address isn’t supported here." : "Enter a full web address starting with https://")
      }}
    />
  )
}

/**
 * Live preview of the draft on /demo/preview (the same renderer as the real page), shown through
 * the shared PagePreview controller. Phone shows a device-sized viewport; Desktop shows a readable
 * desktop viewport that fits the space, or at actual size (scrollable).
 */
export function PreviewFrame({ className, height = 640, fill = false, selection, onSelect, initialDevice = "mobile", presentation = "device" }: {
  className?: string; height?: number; presentation?: "device" | "canvas"
  /** Take the height left in the window instead of a fixed `height`. */
  fill?: boolean
  /** When `onSelect` is given the preview opens in edit mode: clicking the page selects what was clicked. */
  selection?: Selection; onSelect?: (s: Selection) => void; initialDevice?: "mobile" | "desktop"
}) {
  const [device, setDevice] = React.useState<"mobile" | "desktop">(initialDevice)
  const [zoom, setZoom] = React.useState<"fit" | "actual">("fit")
  const [narrow, setNarrow] = React.useState(false)
  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)")
    const sync = () => setNarrow(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])
  const canvas = presentation === "canvas"
  const editing = Boolean(onSelect)
  const seg = (on: boolean) => cn("min-h-8 rounded-[0.625rem] px-3 text-xs font-medium transition-colors", on ? "bg-white text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.16)]" : "text-muted-foreground hover:text-foreground")
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Preview size" className="inline-flex rounded-xl bg-black/[0.06] p-0.5">
            {(["mobile", "desktop"] as const).map((d) => (
              <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)} className={seg(device === d)}>{d === "mobile" ? "Phone" : "Desktop"}</button>
            ))}
          </div>
          {!canvas ? <div role="group" aria-label="Preview zoom" className="inline-flex rounded-xl bg-black/[0.06] p-0.5">
              {(["fit", "actual"] as const).map((z) => (
                <button key={z} type="button" aria-pressed={zoom === z} onClick={() => setZoom(z)} className={seg(zoom === z)}>{z === "fit" ? "Fit" : "Actual size"}</button>
              ))}
            </div> : null}
        </div>
        <a className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href="/demo/preview" target="_blank" rel="noreferrer">Open full preview</a>
      </div>
      <div data-preview-stage style={fill ? { height: "max(32rem, calc(100dvh - 9rem))" } : { height }}>
        <PagePreview
          mode={canvas && narrow && device === "mobile" ? "fill" : device === "mobile" ? "device" : "desktop"}
          device={{ w: 390, h: 844 }}
          zoom={canvas ? "fit" : zoom}
          chrome={!canvas}
          src={editing ? "/demo/preview?edit=1" : "/demo/preview"}
          title="Live preview of your page"
          edit={onSelect && selection ? { selection, onSelect } : undefined}
          testId="preview-frame"
        />
      </div>
    </div>
  )
}
