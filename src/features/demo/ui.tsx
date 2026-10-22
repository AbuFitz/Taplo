"use client"

import * as React from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { TaploInput } from "@/components/taplo/taplo-input"
import { normalizePhone } from "@/lib/validation"
import { cn } from "@/lib/utils"
import type { FromPreview, Selection, ToPreview } from "@/features/page/editor/selection"

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
    <p role="note" className={cn("flex items-center gap-2 rounded-xl bg-signal-soft px-3.5 py-2 text-xs text-[oklch(0.35_0.08_45)]", className)}>
      <span className="size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
      <span><strong className="font-semibold">Demo.</strong> Nothing is sent or stored on a server: what you enter stays in this browser. Payments, email, bookings and analytics aren’t connected.</span>
    </p>
  )
}

/** Live preview of the draft: an iframe on /demo/preview (same renderer as the real page). */
export function PreviewFrame({ className, height = 640, selection, onSelect, initialDevice = "mobile" }: {
  className?: string; height?: number
  /** When `onSelect` is given the preview opens in edit mode: clicking the page selects what was clicked. */
  selection?: Selection; onSelect?: (s: Selection) => void; initialDevice?: "mobile" | "desktop"
}) {
  const [device, setDevice] = React.useState<"mobile" | "desktop">(initialDevice)
  const frame = React.useRef<HTMLIFrameElement>(null)
  const editing = Boolean(onSelect)
  const postSelection = React.useCallback(() => {
    if (selection) frame.current?.contentWindow?.postMessage({ type: "taplo:selected", selection } satisfies ToPreview, window.location.origin)
  }, [selection])
  React.useEffect(() => {
    if (!onSelect) return
    const onMessage = (e: MessageEvent<FromPreview>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      if (e.data?.type === "taplo:select") onSelect(e.data.selection)
      else if (e.data?.type === "taplo:ready") postSelection()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [onSelect, postSelection])
  React.useEffect(postSelection, [postSelection, device])
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
  const bezel = device === "mobile" ? 9 : 0
  const bar = device === "mobile" ? 0 : 38
  const innerW = device === "mobile" ? 390 : 1280
  const outerW = innerW + bezel * 2
  const outerH = height + bezel * 2 + bar
  const scale = Math.min(1, width / outerW)
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div role="group" aria-label="Preview size" className="inline-flex rounded-xl bg-black/[0.06] p-0.5">
          {(["mobile", "desktop"] as const).map((d) => (
            <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)}
              className={cn("min-h-8 rounded-[0.625rem] px-3 text-xs font-medium transition-colors", device === d ? "bg-white text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.16)]" : "text-muted-foreground hover:text-foreground")}>
              {d === "mobile" ? "Phone" : "Desktop"}
            </button>
          ))}
        </div>
        <a className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href="/demo/preview" target="_blank" rel="noreferrer">Open full preview</a>
      </div>
      <div ref={box} className="overflow-hidden">
        <div className="mx-auto" style={{ width: outerW * scale, height: outerH * scale }}>
          <div
            className={cn("origin-top-left overflow-hidden bg-[#0b0b0c] shadow-[0_30px_60px_-28px_rgb(0_0_0/0.5),0_0_0_1px_rgb(0_0_0/0.1)]", device === "mobile" ? "rounded-[2.75rem]" : "rounded-2xl bg-[#f3f2ef]")}
            style={{ width: outerW, height: outerH, padding: bezel, transform: `scale(${scale})` }}
          >
            {device === "desktop" ? (
              <div className="flex items-center gap-3 border-b border-black/10 px-4" style={{ height: bar }} aria-hidden="true">
                <span className="flex gap-1.5">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <i key={c} className="block size-2.5 rounded-full" style={{ background: c }} />)}</span>
                <span className="mx-auto h-5 w-64 rounded-md bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.07)]" />
                <span className="w-10" />
              </div>
            ) : null}
            <div className={cn("overflow-hidden bg-white", device === "mobile" ? "rounded-[2.2rem]" : "")} style={{ width: innerW, height }}>
              <iframe
                ref={frame}
                title="Live preview of your page"
                src={editing ? "/demo/preview?edit=1" : "/demo/preview"}
                onLoad={postSelection}
                data-testid="preview-frame"
                style={{ width: innerW, height, border: 0, background: "white", display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
