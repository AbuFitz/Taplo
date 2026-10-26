"use client"

import * as React from "react"
import type { ImageRef } from "@/features/businesses/content"

/** Studio cut-out: lifts the subject of the cover photograph for the Depth Cutout arrangement. The original is never touched. */
export function CutoutControl({ cover, value, name, onChange }: { cover?: ImageRef; value?: ImageRef; name: string; onChange: (v: ImageRef | undefined) => void }) {
  const [state, setState] = React.useState<"idle" | "working" | "error">("idle")
  const [message, setMessage] = React.useState("")
  if (!cover) return <p className="text-sm text-neutral-600" data-testid="cutout-need">Add a cover photograph and Taplo can lift your subject out of it.</p>
  const run = async () => {
    setState("working"); setMessage("")
    try {
      const { cutOut } = await import("./cutout")
      const out = await cutOut(cover.src)
      onChange({ src: out.src, width: out.width, height: out.height, alt: `${name || "Business"}, cut out`, fit: "contain" })
      setState("idle")
    } catch (e) {
      setState("error"); setMessage(e instanceof Error ? e.message : "The subject could not be lifted. Your photograph is unchanged.")
    }
  }
  return (
    <div className="grid gap-2" data-testid="cutout-control">
      <div role="radiogroup" aria-label="Photo treatment" className="grid grid-cols-2 gap-2">
        <button type="button" role="radio" aria-checked={!value} onClick={() => onChange(undefined)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${!value ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200"}`}>Original photo<span className="block text-xs font-normal text-neutral-500">Soft edge, nothing removed</span></button>
        <button type="button" role="radio" aria-checked={Boolean(value)} onClick={value ? undefined : run} disabled={state === "working"} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${value ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200"}`}>{state === "working" ? "Lifting your subject…" : "Studio cut-out"}<span className="block text-xs font-normal text-neutral-500">{value ? "Subject lifted from its background" : "Background removed on your device"}</span></button>
      </div>
      {state === "error" ? <p role="alert" className="text-xs text-red-700">{message}</p> : <p className="text-xs text-neutral-500">Your original photograph is always kept, so you can switch back at any time.</p>}
    </div>
  )
}
