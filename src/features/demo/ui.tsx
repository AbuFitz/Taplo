"use client"

import * as React from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { normalizePhone } from "@/lib/validation"
import { cn } from "@/lib/utils"

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

export function UrlField({ label, value, onCommit, validate, help }: { label: string; value?: string; onCommit: (v: string | undefined) => void; validate?: (v: string) => boolean; help?: string }) {
  const { text, setText, error, setError, commit } = useSyncedText(value)
  return (
    <TaploInput
      label={label}
      type="url"
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

/** Honest demo labelling, shown on every demo surface. */
export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={cn("rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950", className)}>
      <strong>Demo mode.</strong> No sign-in, no server storage: everything you enter stays in this browser. Payments, email, bookings and analytics are not connected.
    </p>
  )
}

/** Live preview of the draft: an iframe on /demo/preview (same renderer as the real page). */
export function PreviewFrame({ className, height = 640 }: { className?: string; height?: number }) {
  const [device, setDevice] = React.useState<"mobile" | "desktop">("mobile")
  const box = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(360)
  React.useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  const frameWidth = device === "mobile" ? 390 : 1280
  const scale = Math.min(1, width / frameWidth)
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div role="group" aria-label="Preview size" className="flex gap-1">
          {(["mobile", "desktop"] as const).map((d) => (
            <Button key={d} size="sm" type="button" variant={device === d ? "default" : "outline"} aria-pressed={device === d} onClick={() => setDevice(d)}>
              {d === "mobile" ? "Mobile" : "Desktop"}
            </Button>
          ))}
        </div>
        <a className="text-sm underline underline-offset-4" href="/demo/preview" target="_blank" rel="noreferrer">Open full preview</a>
      </div>
      <div ref={box} className="overflow-hidden rounded-2xl border bg-muted/60 shadow-sm" style={{ height: height * scale + 2 }}>
        <div className={cn(device === "mobile" ? "mx-auto" : "")} style={{ width: frameWidth * scale, height: height * scale }}>
          <iframe
            title="Live preview of your page"
            src="/demo/preview"
            style={{ width: frameWidth, height, transform: `scale(${scale})`, transformOrigin: "top left", border: 0, background: "white" }}
          />
        </div>
      </div>
    </div>
  )
}
