"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { cn } from "@/lib/utils"
import { Collection } from "./Collection"

export interface GalleryImage { src: string; alt: string; width?: number; height?: number; focal?: { x: number; y: number } }
export interface GalleryItem { id: string; image: GalleryImage; before?: GalleryImage; caption?: string }
type Side = "before" | "after"
const pos = (f?: { x: number; y: number }) => (f ? { objectPosition: `${f.x}% ${f.y}%` } : undefined)

/** Real images keep their proportions in the viewer; both halves of a comparison are accessible. */
export function Gallery({ items, variant, title }: { items: GalleryItem[]; variant: "grid" | "carousel" | "beforeAfter" | "masonry"; title?: string }) {
  const [selection, setSelection] = React.useState<{ at: number; side: Side } | null>(null)
  const openedFrom = React.useRef<HTMLButtonElement | null>(null)
  const label = title || "Gallery"
  const tile = (g: GalleryItem, i: number, ratio?: string, side: Side = "after") => {
    const image = side === "before" ? g.before! : g.image
    return <button type="button" className="tp-gallery-open" onClick={(e) => { openedFrom.current = e.currentTarget; setSelection({ at: i, side }) }} aria-haspopup="dialog" aria-label={`${g.caption || image.alt}${g.before ? `, ${side}` : ""}. Open larger`} data-testid="gallery-open">
      <span className="tp-media block" style={ratio ? { aspectRatio: ratio } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt="" loading="lazy" draggable={false} style={pos(image.focal)} /></span>
    </button>
  }
  return <>
    {variant === "carousel" ? <Collection label={label} compact>{items.map((g, i) => <figure key={g.id} className="m-0">{tile(g, i, "4 / 5")}{g.caption ? <figcaption className="tp-gallery-caption">{g.caption}</figcaption> : null}</figure>)}</Collection>
      : variant === "beforeAfter" ? <ul className="grid gap-5">{items.map((g, i) => <li key={g.id}>
        <div className="grid grid-cols-2 gap-2">
          {g.before ? <div className="relative">{tile(g, i, "4 / 5", "before")}<span className="tp-ba-label pointer-events-none">Before</span></div> : null}
          <div className={cn("relative", !g.before && "col-span-2")}>{tile(g, i, g.before ? "4 / 5" : "4 / 3")}{g.before ? <span className="tp-ba-label pointer-events-none" data-after="">After</span> : null}</div>
        </div>{g.caption ? <p className="tp-gallery-caption">{g.caption}</p> : null}
      </li>)}</ul>
        : <ul className={variant === "masonry" ? "tp-photo-wall" : "tp-gallery"} aria-label={label}>{items.map((g, i) => <li key={g.id}>{tile(g, i, variant === "masonry" ? (i % 3 === 0 ? "4 / 5" : i % 3 === 1 ? "1 / 1" : "4 / 3") : undefined)}{g.caption ? <p className="tp-gallery-caption">{g.caption}</p> : null}</li>)}</ul>}
    <Overlay tone="page" kind="detail" open={selection !== null} onOpenChange={(o) => !o && setSelection(null)} title={selection ? `${label}: picture ${selection.at + 1} of ${items.length}` : label} hideTitle
      onCloseAutoFocus={(e) => { e.preventDefault(); openedFrom.current?.focus() }} className="tp-lightbox !border-0 !bg-black !text-white" bodyClassName="p-0" testId="lightbox">
      {selection && items[selection.at] ? <Lightbox items={items} at={selection.at} side={selection.side} select={setSelection} /> : null}
    </Overlay>
  </>
}

function Lightbox({ items, at, side, select }: { items: GalleryItem[]; at: number; side: Side; select: (s: { at: number; side: Side }) => void }) {
  const [zoom, setZoom] = React.useState(false)
  const start = React.useRef<{ x: number; y: number; id: number } | null>(null)
  const pointers = React.useRef(new Set<number>())
  const stage = React.useRef<HTMLDivElement>(null)
  const item = items[at]!
  const image = side === "before" && item.before ? item.before : item.image
  const n = items.length
  const go = React.useCallback((d: -1 | 1) => { setZoom(false); select({ at: (at + d + n) % n, side: "after" }) }, [at, n, select])
  const switchSide = (next: Side) => { setZoom(false); select({ at, side: next }) }
  React.useEffect(() => {
    stage.current?.scrollTo(0, 0)
    for (const g of [item.before, items[(at + 1) % n]?.image, items[(at - 1 + n) % n]?.image]) if (g) { const im = new window.Image(); im.src = g.src }
  }, [at, side, item.before, items, n])
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom || n < 2) return
      if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, n, zoom])
  const dims = image.width && image.height ? { width: image.width, height: image.height } : {}
  return <div className="tp-lightbox-body">
    <div ref={stage} className="tp-lightbox-stage" data-zoom={zoom || undefined} data-testid="lightbox-stage" style={{ touchAction: zoom ? "pan-x pan-y pinch-zoom" : "pan-y pinch-zoom" }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pointers.current.add(e.pointerId); start.current = pointers.current.size === 1 ? { x: e.clientX, y: e.clientY, id: e.pointerId } : null }}
      onPointerCancel={(e) => { pointers.current.delete(e.pointerId); start.current = null }}
      onPointerUp={(e) => { pointers.current.delete(e.pointerId); const s = start.current; start.current = null; if (!s || s.id !== e.pointerId || zoom || n < 2) return; const dx = e.clientX - s.x; const dy = e.clientY - s.y; if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} {...dims} draggable={false} className={zoom ? "max-w-none" : undefined} style={zoom ? { width: image.width ? Math.min(image.width, 2200) : "auto", maxWidth: "none", height: "auto" } : undefined} />
    </div>
    <div className="tp-lightbox-tools">
      {item.before ? <div className="tp-lightbox-switch" role="group" aria-label="Compare photographs"><button type="button" aria-pressed={side === "before"} onClick={() => switchSide("before")}>Before</button><button type="button" aria-pressed={side === "after"} onClick={() => switchSide("after")}>After</button></div> : null}
      <div className="flex items-center gap-2 text-sm">
        {n > 1 ? <button type="button" onClick={() => go(-1)} aria-label="Previous picture" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft aria-hidden="true" /></button> : null}
        <p className="min-w-0 flex-1 text-center" aria-live="polite"><span className="tabular-nums text-white/70">{at + 1} of {n}{item.before ? ` · ${side === "before" ? "Before" : "After"}` : ""}</span>{item.caption ? <span className="mt-1 block font-medium [overflow-wrap:anywhere]">{item.caption}</span> : null}</p>
        <button type="button" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? "Fit to screen" : "Zoom to full size"} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white">{zoom ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}</button>
        {n > 1 ? <button type="button" onClick={() => go(1)} aria-label="Next picture" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"><ChevronRight aria-hidden="true" /></button> : null}
      </div>
    </div>
  </div>
}
