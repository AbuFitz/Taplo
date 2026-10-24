"use client"

import * as React from "react"
import { getImageProps } from "next/image"
import { cn } from "@/lib/utils"
import type { FromPreview, Selection, ToPreview } from "@/features/page/editor/selection"

/**
 * The one preview controller. It always gives the page a real viewport (an iframe of explicit
 * CSS dimensions), because only an iframe's own width triggers the page's media queries, then
 * decides how that viewport fits the space it was given:
 *
 *  - `fill`    Editing on a phone or tablet. The frame IS the available space: no scaling, no
 *              handset. What you see is what a visitor on a screen this size sees.
 *  - `device`  Previewing a phone page from a bigger screen. A device-sized viewport (default
 *              390x844) scaled down only if it would not otherwise fit, centred.
 *  - `desktop` Previewing the desktop page. A viewport between 1024 and 1440px wide chosen so the
 *              scale stays readable; `actual` shows it 1:1 and lets the preview scroll.
 *
 * Selection (edit mode) is handled inside the frame in its own coordinates, so scaling never
 * distorts hit-testing. `bottomInset` tells the page how much of its bottom edge is covered by a
 * sheet so a selected widget is scrolled into the part that is still visible.
 */
export type PreviewMode = "fill" | "device" | "desktop"

export interface PreviewViewport { w: number; h: number; scale: number }

export interface PagePreviewProps {
  src: string
  title: string
  mode: PreviewMode
  device?: { w: number; h: number }
  zoom?: "fit" | "actual"
  /** Decorative bezel / browser bar. Only for `device` and `desktop`, never while editing on a phone. */
  chrome?: boolean
  /** Address shown in the desktop browser bar. */
  url?: string
  frameRef?: (el: HTMLIFrameElement | null) => void
  edit?: { selection: Selection; onSelect: (s: Selection) => void; bottomInset?: number }
  onViewport?: (v: PreviewViewport) => void
  className?: string
  testId?: string
  /** Decorative thumbnails cannot receive clicks or keyboard focus. */
  poster?: string
  /** Synchronously remeasure when a parent sheet expands, before the next paint. */
  resizeKey?: boolean | number | string
  interactive?: boolean
  /** Space occupied by fixed parent navigation when revealing a customer dialog. */
  topInset?: number
  /** Show the top of a full phone viewport when the available mobile canvas is short. */
  cropDevice?: boolean
}

const MIN_DESKTOP = 1024
const MAX_DESKTOP = 1440
const READABLE = 0.72

export function layoutPreview(mode: PreviewMode, box: { w: number; h: number }, device = { w: 390, h: 844 }, zoom: "fit" | "actual" = "fit", chrome = false, cropDevice = false) {
  if (mode === "fill") return { vw: box.w, vh: box.h, scale: 1, pad: 0, bar: 0, outerW: box.w, outerH: box.h }
  if (mode === "device") {
    const pad = chrome ? 6 : 0
    const outerW = device.w + pad * 2
    const outerH = device.h + pad * 2
    const scale = zoom === "actual" ? 1 : Math.min(1, box.w / outerW, cropDevice ? 1 : box.h / outerH)
    return { vw: device.w, vh: device.h, scale, pad, bar: 0, outerW, outerH }
  }
  const bar = chrome ? 38 : 0
  if (zoom === "actual") return { vw: 1280, vh: Math.max(720, box.h - bar), scale: 1, pad: 0, bar, outerW: 1280, outerH: Math.max(720, box.h) }
  const vw = Math.round(Math.min(MAX_DESKTOP, Math.max(MIN_DESKTOP, box.w / READABLE)))
  const scale = Math.min(1, box.w / vw)
  const vh = Math.max(560, Math.round(box.h / scale) - bar)
  return { vw, vh, scale, pad: 0, bar, outerW: vw, outerH: vh + bar }
}

export function PagePreview({ src, title, mode, device, zoom = "fit", chrome = false, url, frameRef, edit, onViewport, className, testId, poster, interactive = true, resizeKey, topInset = 0, cropDevice = false }: PagePreviewProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const frame = React.useRef<HTMLIFrameElement | null>(null)
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mode, zoom, resizeKey])

  const decorated = chrome && mode !== "fill"
  const L = box ? layoutPreview(mode, box, device, zoom, decorated, cropDevice) : null
  React.useEffect(() => { if (L) onViewport?.({ w: L.vw, h: L.vh, scale: L.scale }) }, [L?.vw, L?.vh, L?.scale]) // eslint-disable-line react-hooks/exhaustive-deps

  const setFrame = React.useCallback((el: HTMLIFrameElement | null) => { frame.current = el; frameRef?.(el) }, [frameRef])

  const selection = edit?.selection
  const inset = edit?.bottomInset ?? 0
  const post = React.useCallback(() => {
    if (selection) frame.current?.contentWindow?.postMessage({ type: "taplo:selected", selection, bottomInset: inset } satisfies ToPreview, window.location.origin)
  }, [selection, inset])
  const onSelect = edit?.onSelect
  React.useEffect(() => {
    const onMessage = (e: MessageEvent<FromPreview>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      if (e.data?.type === "taplo:overlay-open") {
        // Make the whole dialog visible before its next tap. A smooth outer scroll moves iframe hit targets during the flow.
        const rect = host.current?.getBoundingClientRect()
        if (rect && (rect.top < topInset || rect.bottom > window.innerHeight)) {
          const top = topInset + Math.max(0, (window.innerHeight - topInset - rect.height) / 2)
          window.scrollBy({ top: rect.top - top, behavior: "instant" })
        }
      } else if (e.data?.type === "taplo:select") onSelect?.(e.data.selection)
      else if (e.data?.type === "taplo:ready" || (e.data as {type?: string})?.type === "taplo:lab-ready") { setLoaded(true); post() }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [onSelect, post, topInset])
  React.useEffect(post, [post, L?.vw, L?.vh])

  const iframe = L ? (
    <iframe
      ref={setFrame}
      title={title}
      tabIndex={interactive ? undefined : -1}
      aria-hidden={interactive ? undefined : true}
      inert={!interactive}
      src={src}
      data-testid={testId ?? "preview-frame"}
      onLoad={() => { if (!poster) setLoaded(true); post() }}
      style={{ width: mode === "fill" ? "100%" : L.vw, height: mode === "fill" ? "100%" : L.vh, border: 0, display: "block", background: "white", pointerEvents: interactive ? undefined : "none" }}
    />
  ) : null

  return (
    <div ref={host} className={cn("relative h-full w-full min-h-0", zoom === "actual" ? "overflow-auto" : "overflow-hidden", className)} data-preview-mode={mode}>
      {/* Keep one DOM path for the iframe: changing viewport must not reload a booking or discard typed details. */}
      {L ? (
        <div className={cn("absolute inset-x-0 top-0 flex justify-center", mode === "device" && zoom !== "actual" && !cropDevice && "inset-y-0 items-center", zoom === "actual" && "relative")}>
          <div style={{ width: L.outerW * L.scale, height: L.outerH * L.scale }} className="shrink-0">
            <div
              className={cn("origin-top-left overflow-hidden", decorated ? (mode === "device" ? "rounded-[2.375rem] bg-[#141416] shadow-[0_0_0_1px_rgb(0_0_0/0.14),0_28px_48px_-26px_rgb(0_0_0/0.4)]" : "rounded-2xl bg-[#f3f2ef] shadow-[0_30px_60px_-28px_rgb(0_0_0/0.4),0_0_0_1px_rgb(0_0_0/0.1)]") : "")}
              style={{ width: L.outerW, height: L.outerH, padding: L.pad, transform: L.scale === 1 ? undefined : `scale(${L.scale})` }}
            >
              {L.bar ? (
                <div className="flex items-center gap-3 border-b border-black/10 px-4" style={{ height: L.bar }} aria-hidden="true">
                  <span className="flex gap-1.5">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <i key={c} className="block size-2.5 rounded-full" style={{ background: c }} />)}</span>
                  <span className="mx-auto flex h-5 w-64 items-center justify-center truncate rounded-md bg-white px-2 text-[11px] text-neutral-500 shadow-[0_0_0_1px_rgb(0_0_0/0.07)]">{url}</span>
                  <span className="w-10" />
                </div>
              ) : null}
              <div className={cn("overflow-hidden bg-white", decorated && mode === "device" && "rounded-[2rem]")} style={{ width: L.vw, height: L.vh }}>{iframe}</div>
            </div>
          </div>
        </div>
      ) : null}
      {!loaded && poster ? <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...getImageProps({ src: `${poster}?v=20261024-brands`, alt: "", width: mode === "desktop" ? 2200 : 780, height: mode === "desktop" ? 1520 : 1600, sizes: mode === "desktop" ? "550px" : "310px", loading: "eager", fetchPriority: "high" }).props} alt="" className={cn("size-full object-top", mode === "desktop" ? "object-contain" : "object-cover")} /></div> : null}
      {!loaded && !poster ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-black/[0.04] motion-reduce:animate-none" /> : null}
    </div>
  )
}
