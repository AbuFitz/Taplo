"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import type { ImageRef } from "@/features/businesses/content"
import { dominantAccent, paletteFromAccent } from "../themes/image-palette"
import type { Editor } from "./useEditor"

type Colours = ReturnType<typeof paletteFromAccent>
type State = { kind: "idle" } | { kind: "none"; why: string } | { kind: "ready"; palette: Colours }

function readPixels(src: string): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const c = document.createElement("canvas")
        c.width = 48; c.height = 48
        const ctx = c.getContext("2d", { willReadFrequently: true })
        if (!ctx) throw new Error("no canvas")
        ctx.drawImage(img, 0, 0, 48, 48)
        resolve(ctx.getImageData(0, 0, 48, 48).data)
      } catch (e) { reject(e) }
    }
    img.onerror = () => reject(new Error("load"))
    img.src = src
  })
}

function Sample({ label, c }: { label: string; c: Colours }) {
  return (
    <figure className="grid gap-1.5" data-testid={`colours-${label.toLowerCase()}`}>
      <div className="grid gap-2 rounded-xl border p-3" style={{ background: c.background, color: c.text, borderColor: c.border }}>
        <div className="rounded-lg p-2.5" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <p className="text-sm font-semibold">Your business</p>
          <p className="text-xs" style={{ color: c.muted }}>Services and prices</p>
        </div>
        <span className="inline-flex h-9 items-center justify-center rounded-full text-xs font-semibold" style={{ background: c.accent, color: c.accentText }}>Book now</span>
      </div>
      <figcaption className="text-xs font-medium text-muted-foreground">{label}</figcaption>
    </figure>
  )
}

/**
 * Colours from the logo or cover picture, as a suggestion only: the current and suggested colours are shown side by
 * side, nothing changes until the owner accepts, and accepting is one undoable step.
 */
export function ColourSuggestion({ ed, image, notify }: { ed: Editor; image: ImageRef | undefined; notify: (m: string, undoable?: boolean) => void }) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<State>({ kind: "idle" })
  const current = ed.vm?.style.spec.colors
  const dark = ed.vm?.style.attrs["data-tone"] === "dark"

  const suggest = async () => {
    if (!image) return
    setOpen(true)
    setState({ kind: "idle" })
    try {
      const accent = dominantAccent(await readPixels(image.src))
      setState(accent ? { kind: "ready", palette: paletteFromAccent(accent, dark) } : { kind: "none", why: "This picture does not have enough colour to suggest a palette." })
    } catch {
      setState({ kind: "none", why: "Taplo could not read the colours of this picture." })
    }
  }
  const accept = () => {
    if (state.kind !== "ready") return
    const p = state.palette
    ed.setAppearance((a) => ({ ...a, colors: { ...a.colors, ...p } }))
    setOpen(false)
    notify("Colours updated from your picture.", true)
  }

  return (
    <div className="grid gap-1.5">
      <Button type="button" variant="outline" className="min-h-11 justify-self-start" disabled={!image} onClick={suggest} data-testid="suggest-colours"><Palette /> Suggest colours from this picture</Button>
      {!image ? <p className="text-xs text-muted-foreground">Add a logo or cover picture first.</p> : <p className="text-xs text-muted-foreground">You see the new colours next to your current ones before anything changes.</p>}
      <Overlay open={open} onOpenChange={setOpen} title="Colours from your picture" description="Nothing changes until you choose to use them." testId="colour-suggestion"
        footer={state.kind === "ready" ? <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Keep my colours</Button><Button onClick={accept} data-testid="use-colours">Use these colours</Button></div> : <div className="flex justify-end"><Button variant="outline" onClick={() => setOpen(false)}>Close</Button></div>}>
        {state.kind === "idle" ? <p className="text-sm text-muted-foreground" role="status">Reading your picture…</p> : null}
        {state.kind === "none" ? <p className="text-sm" role="status">{state.why}</p> : null}
        {state.kind === "ready" && current ? (
          <div className="grid grid-cols-2 gap-3">
            <Sample label="Now" c={{ background: current.background, text: current.text, muted: current.muted, surface: current.surface, accent: current.accent, accentText: current.accentText, border: current.border }} />
            <Sample label="Suggested" c={state.palette} />
          </div>
        ) : null}
      </Overlay>
    </div>
  )
}
