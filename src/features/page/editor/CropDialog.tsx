"use client"
import * as React from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Overlay } from "@/components/taplo/overlay"
import "./crop-dialog.css"
import { cropFile, type CropArea } from "./image"

/** Nothing reaches the page until the owner confirms this framing popup. */
export function CropDialog({ file, aspect, round, title, allowOriginal = false, defaultCrop = false, onCancel, onDone }: { file: File | null; aspect: number; round?: boolean; title: string; allowOriginal?: boolean; defaultCrop?: boolean; onCancel: () => void; onDone: (cropped: File, shape?: "logo"|"circle"|"square") => void }) {
  const active=React.useRef(true)
  React.useEffect(()=>{active.current=true;return()=>{active.current=false}},[])
  const [decoded,setDecoded]=React.useState<File|null>(null)
  const [url, setUrl] = React.useState<string | null>(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [area, setArea] = React.useState<CropArea | null>(null)
  const [whole, setWhole] = React.useState(allowOriginal&&!defaultCrop)
  const [circle, setCircle] = React.useState(Boolean(round))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string>()
  React.useEffect(() => {
    if (!file) return
    let alive=true
    const r = new FileReader()
    r.onloadstart=()=>{if(alive){setDecoded(null);setUrl(null);setError(undefined)}}
    r.onload = async () => {
      const source=String(r.result);const image=new Image();image.src=source
      try {await image.decode();if(!alive)return;setDecoded(file);setUrl(source);setCrop({x:0,y:0});setZoom(1);setArea(null);setWhole(allowOriginal&&!defaultCrop);setCircle(Boolean(round))}
      catch {if(alive)setError("That image could not be opened. Choose another file.")}
    }
    r.onerror=()=>{if(alive)setError("That image could not be opened. Choose another file.")}
    r.readAsDataURL(file)
    return () => {alive=false;r.onload=null;r.onloadstart=null;r.onerror=null;if(r.readyState===FileReader.LOADING)r.abort()}
  }, [file, allowOriginal, round, defaultCrop])
  async function apply() {
    if (!file || (!whole && !area)) return
    setBusy(true); setError(undefined)
    try { const output=whole ? file : await cropFile(file, area!);if(active.current)onDone(output, whole ? "logo" : circle ? "circle" : "square") } catch (e) { if(active.current)setError(e instanceof Error ? e.message : "The image could not be saved.") } finally { if(active.current)setBusy(false) }
  }
  return <Overlay open={Boolean(file)} onOpenChange={(o) => !o && onCancel()} title={title} description={whole ? "Keep your logo complete, including its transparency." : "Move the image into place."} className="crop-editor" testId="crop-dialog" bodyClassName="grid content-start gap-4"
    footer={<div className="flex gap-2"><Button type="button" variant="outline" className="min-h-11" onClick={onCancel}>Cancel</Button><Button type="button" className="min-h-11 flex-1" disabled={decoded!==file || !url || (!whole && !area) || busy} onClick={() => void apply()} data-testid="crop-apply">{busy ? "Preparing…" : whole ? "Use image" : "Use this crop"}</Button></div>}>
    {allowOriginal ? <div role="group" aria-label="Image framing" className="grid grid-cols-2 gap-2"><Button variant={whole ? 'default' : 'outline'} className="min-h-11 rounded-full" aria-pressed={whole} onClick={() => setWhole(true)}>Keep whole image</Button><Button variant={!whole ? 'default' : 'outline'} className="min-h-11 rounded-full" aria-pressed={!whole} onClick={() => setWhole(false)}>Crop photo</Button></div> : null}
    <div className="crop-editor-stage">
      {url && decoded===file ? whole ? <div className="grid size-full place-items-center p-6">{/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Your image before applying" className="absolute inset-0 size-full object-contain p-8" /></div> : <Cropper image={url} crop={crop} zoom={zoom} aspect={aspect} cropShape={circle ? "round" : "rect"} showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, px) => setArea(px)} /> : null}
    </div>
    {!whole ? <><label className="grid gap-1 text-sm font-medium">Zoom<input className="min-h-11 accent-black" type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom" /></label>{aspect === 1 ? <div role="group" aria-label="Preview shape" className="flex gap-2"><Button variant={!circle ? 'default' : 'outline'} aria-pressed={!circle} onClick={()=>setCircle(false)}>Square preview</Button><Button variant={circle ? 'default' : 'outline'} aria-pressed={circle} onClick={()=>setCircle(true)}>Round preview</Button></div> : null}</> : null}
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
  </Overlay>
}
