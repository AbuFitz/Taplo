"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { cn } from "@/lib/utils"
import { Collection } from "./Collection"

export interface GalleryImage { src: string; alt: string; width?: number; height?: number; focal?: { x: number; y: number } }
export interface GalleryItem { id: string; image: GalleryImage; before?: GalleryImage; caption?: string }

const pos = (f?: { x: number; y: number }) => (f ? { objectPosition: `${f.x}% ${f.y}%` } : undefined)

/**
 * Gallery: a grid, a swipe collection, or before/after pairs, each opening a lightbox. The lightbox keeps the
 * picture's own proportions (it is shown contained, never cropped), supports previous/next by button, arrow
 * key and swipe, zooms to full size inside a scrollable frame (native pinch also works), and returns focus to
 * the thumbnail of the picture you were last looking at.
 */
export function Gallery({ items, variant, title }: { items: GalleryItem[]; variant: "grid" | "carousel" | "beforeAfter"; title?: string }) {
  const [at, setAt] = React.useState<number | null>(null)
  const thumbs = React.useRef<(HTMLButtonElement | null)[]>([])
  const label = title || "Gallery"

  const tile = (g: GalleryItem, i: number, ratio?: string) => (
    <button type="button" ref={(el) => { thumbs.current[i] = el }} className="tp-gallery-open" onClick={() => setAt(i)} aria-haspopup="dialog" aria-label={`${g.caption || g.image.alt}. Open larger`} data-testid="gallery-open">
      <span className="tp-media block" style={ratio ? { aspectRatio: ratio } : undefined}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={g.image.src} alt="" loading="lazy" draggable={false} style={pos(g.image.focal)} /></span>
    </button>
  )

  return (
    <>
      {variant === "carousel" ? (
        <Collection label={label} compact>{items.map((g, i) => <figure key={g.id} className="m-0">{tile(g, i, "4 / 5")}{g.caption ? <figcaption className="tp-muted mt-1 text-xs">{g.caption}</figcaption> : null}</figure>)}</Collection>
      ) : variant === "beforeAfter" ? (
        <ul className="grid gap-4">{items.map((g, i) => (
          <li key={g.id}>
            <div className="grid grid-cols-2 gap-1">
              {g.before ? <div className="tp-media relative" style={{ aspectRatio: "4 / 5" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={g.before.src} alt={g.before.alt} loading="lazy" style={pos(g.before.focal)} /><span className="tp-ba-label">Before</span></div> : null}
              <div className={cn("relative", !g.before && "col-span-2")}>{tile(g, i, g.before ? "4 / 5" : "4 / 3")}{g.before ? <span className="tp-ba-label" data-after="">After</span> : null}</div>
            </div>
            {g.caption ? <p className="tp-muted mt-1 text-xs">{g.caption}</p> : null}
          </li>))}</ul>
      ) : (
        <ul className="tp-gallery" aria-label={label}>{items.map((g, i) => <li key={g.id}>{tile(g, i)}</li>)}</ul>
      )}
      <Overlay tone="page" kind="detail" open={at !== null} onOpenChange={(o) => !o && setAt(null)} title={at !== null ? `${label}: picture ${at + 1} of ${items.length}` : label} hideTitle
        onCloseAutoFocus={(e) => { e.preventDefault(); thumbs.current[at ?? 0]?.focus() }} className="!border-0 !bg-black !text-white" bodyClassName="p-0" testId="lightbox">
        {at !== null ? <Lightbox items={items} at={at} setAt={setAt} /> : null}
      </Overlay>
    </>
  )
}

function Lightbox({ items, at, setAt }: { items: GalleryItem[]; at: number; setAt: (i: number) => void }) {
  const [zoom, setZoom] = React.useState(false)
  const start = React.useRef<{ x: number; y: number } | null>(null)
  const item = items[at]!
  const n = items.length
  const go = React.useCallback((d: -1 | 1) => { setZoom(false); setAt((at + d + n) % n) }, [at, n, setAt])
  React.useEffect(() => { for (const d of [-1, 1]) { const g = items[(at + d + n) % n]; if (g) { const im = new window.Image(); im.src = g.image.src } } }, [at, items, n])
  const dims = item.image.width && item.image.height ? { width: item.image.width, height: item.image.height } : {}
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col" tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1) } else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) } }}
      onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY } }}
      onPointerUp={(e) => { const s = start.current; start.current = null; if (!s || zoom) return; const dx = e.clientX - s.x; const dy = e.clientY - s.y; if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1) }}>
      <div className={cn("min-h-0 flex-1 overscroll-contain", zoom ? "overflow-auto" : "grid place-items-center overflow-hidden")} style={{ touchAction: zoom ? "pan-x pan-y pinch-zoom" : "pan-y pinch-zoom" }} data-testid="lightbox-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image.src} alt={item.image.alt} {...dims} draggable={false} className={zoom ? "max-w-none" : "max-h-full max-w-full object-contain"} style={zoom ? { width: item.image.width ? Math.min(item.image.width, 2200) : "auto" } : { maxHeight: "calc(100% - 0px)" }} />
      </div>
      <div className="flex shrink-0 items-center gap-2 px-3 py-2 text-sm">
        <button type="button" onClick={() => go(-1)} aria-label="Previous picture" className="grid size-11 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft aria-hidden="true" /></button>
        <p className="min-w-0 flex-1 text-center" aria-live="polite"><span className="tabular-nums text-white/70">{at + 1} of {n}</span>{item.caption ? <span className="block truncate font-medium">{item.caption}</span> : null}</p>
        <button type="button" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? "Fit to screen" : "Zoom to full size"} className="grid size-11 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white">{zoom ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}</button>
        <button type="button" onClick={() => go(1)} aria-label="Next picture" className="grid size-11 place-items-center rounded-full bg-white/10 outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"><ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
  )
}
