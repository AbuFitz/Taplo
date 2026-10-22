"use client"

import * as React from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cropFile, type CropArea } from "./image"

/** Frame a picture before it is used (logo: square, cover: wide). Touch pinch/drag and a zoom slider. */
export function CropDialog({ file, aspect, round, title, onCancel, onDone }: { file: File | null; aspect: number; round?: boolean; title: string; onCancel: () => void; onDone: (cropped: File) => void }) {
  const [url, setUrl] = React.useState<string | null>(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [area, setArea] = React.useState<CropArea | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string>()

  // Decode the file for the cropper. setState happens in the reader callback, not synchronously in the effect.
  React.useEffect(() => {
    if (!file) return
    const r = new FileReader()
    r.onload = () => { setUrl(String(r.result)); setCrop({ x: 0, y: 0 }); setZoom(1); setArea(null) }
    r.readAsDataURL(file)
    return () => { r.onload = null }
  }, [file])

  async function apply() {
    if (!file || !area) return
    setBusy(true)
    setError(undefined)
    try { onDone(await cropFile(file, area)) } catch (e) { setError(e instanceof Error ? e.message : "The crop could not be saved.") } finally { setBusy(false) }
  }

  return (
    <Dialog open={Boolean(file)} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent className="max-w-md" data-testid="crop-dialog">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Drag to move, pinch or use the slider to zoom. This is how it will be shown.</DialogDescription></DialogHeader>
        <div className="relative h-72 overflow-hidden rounded-lg bg-muted">
          {url ? <Cropper image={url} crop={crop} zoom={zoom} aspect={aspect} cropShape={round ? "round" : "rect"} showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, px) => setArea(px)} /> : null}
        </div>
        <label className="grid gap-1 text-sm font-medium">Zoom
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom" />
        </label>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="button" disabled={!area || busy} onClick={() => void apply()} data-testid="crop-apply">{busy ? "Saving…" : "Use this crop"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
