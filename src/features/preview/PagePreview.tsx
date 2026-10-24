"use client"

import * as React from "react"
import { getImageProps } from "next/image"
import { PHONE, PhoneChrome } from "./PhoneChrome"
import { BrowserChrome } from "./BrowserChrome"
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
  loading?: "eager" | "lazy"
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
  if (mode === "fill") return { vw: box.w, vh: box.h, scale: 1, pad: 0, bar: 0, safeTop: 0, safeBottom: 0, outerW: box.w, outerH: box.h }
  if (mode === "device") {
    const pad = chrome ? PHONE.bezel : 0
    const safeTop = 0
    const safeBottom = 0
    const outerW = device.w + pad * 2
    const outerH = device.h + pad * 2
    const scale = zoom === "actual" ? 1 : Math.min(1, Math.max(1,box.w - (chrome ? 8 : 0)) / outerW, cropDevice ? 1 : box.h / outerH)
    return { vw: device.w, vh: device.h - safeTop - safeBottom, scale, pad, bar: 0, safeTop, safeBottom, outerW, outerH }
  }
  const bar = chrome ? 38 : 0
  if (zoom === "actual") return { vw: 1280, vh: Math.max(720, box.h - bar), scale: 1, pad: 0, bar, safeTop: 0, safeBottom: 0, outerW: 1280, outerH: Math.max(720, box.h) }
  const vw = Math.round(Math.min(MAX_DESKTOP, Math.max(MIN_DESKTOP, box.w / READABLE)))
  const scale = Math.min(1, box.w / vw)
  const vh = Math.max(560, Math.round(box.h / scale) - bar)
  return { vw, vh, scale, pad: 0, bar, safeTop: 0, safeBottom: 0, outerW: vw, outerH: vh + bar }
}

export function PagePreview({ src, loading = "eager", title, mode, device, zoom = "fit", chrome = false, url, frameRef, edit, onViewport, className, testId, poster, interactive = true, resizeKey, topInset = 0, cropDevice = false }: PagePreviewProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const frame = React.useRef<HTMLIFrameElement | null>(null)
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = React.useState(false)
  const isPhone = chrome && mode === "device"
  const stopWatching = React.useRef<(() => void) | null>(null)
  React.useEffect(() => () => stopWatching.current?.(), [])

  const prepareDocument = React.useCallback(() => {
    stopWatching.current?.()
    const doc = frame.current?.contentDocument
    if (!doc?.body) return
    doc.documentElement.dataset.taploEmbedded = "true"
    doc.documentElement.setAttribute("data-taplo-phone", String(isPhone))
    let page: Element | null = null
    const sync = () => {
      const next = doc.querySelector("[data-taplo-page]")
      if (!next) return
      const color = doc.defaultView?.getComputedStyle(next).getPropertyValue("--tp-background").trim()
      if (color) host.current?.style.setProperty("--phone-surface", color)
      setLoaded(true)
      if (page !== next) {
        page = next
        observer.disconnect()
        observer.observe(next, { attributes: true, attributeFilter: ["style"] })
      }
    }
    const observer = new MutationObserver(sync)
    observer.observe(doc.body, { childList: true, subtree: true })
    sync()
    stopWatching.current = () => observer.disconnect()
  }, [isPhone])

  React.useEffect(() => {
    const doc = frame.current?.contentDocument
    if (doc) doc.documentElement.setAttribute("data-taplo-phone", String(isPhone))
  }, [isPhone])

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
      else if (e.data?.type === "taplo:ready" || (e.data as {type?: string})?.type === "taplo:lab-ready") { prepareDocument(); post() }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [onSelect, post, topInset, prepareDocument])
  React.useEffect(post, [post, L?.vw, L?.vh])

  const iframe = L ? (
    <iframe
      ref={setFrame}
      title={title}
      tabIndex={interactive ? undefined : -1}
      aria-hidden={interactive ? undefined : true}
      inert={!interactive}
      src={src}
      loading={loading}
      data-testid={testId ?? "preview-frame"}
      onLoad={() => { prepareDocument(); post() }}
      className="preview-document"
      data-loaded={loaded}
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
              className={cn("relative origin-top-left", decorated ? (mode === "device" ? "phone-shell" : "browser-shell") : "")}
              style={{ width: L.outerW, height: L.outerH, padding: L.pad, transform: L.scale === 1 ? undefined : `scale(${L.scale})` }}
            >
              {L.bar ? <BrowserChrome url={url} height={L.bar} /> : null}
              <div className={cn("relative overflow-hidden bg-white", decorated && mode === "device" && "phone-screen")} style={{ width: L.vw, height: L.vh + L.safeTop + L.safeBottom, paddingTop: L.safeTop, paddingBottom: L.safeBottom }}>
                {iframe}
                {!loaded ? <div className="preview-screen-loading" aria-hidden="true"><span /><span /><span /></div> : null}
              </div>
              {decorated && mode === "device" ? <PhoneChrome /> : null}
            </div>
          </div>
        </div>
      ) : null}
      {!loaded && poster ? <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...getImageProps({ src: `${poster}?v=20261024-brands`, alt: "", width: mode === "desktop" ? 2200 : 780, height: mode === "desktop" ? 1520 : 1600, sizes: mode === "desktop" ? "550px" : "310px", loading: "eager", fetchPriority: "high" }).props} alt="" className={cn("size-full object-top", mode === "desktop" ? "object-contain" : "object-cover")} /></div> : null}
    </div>
  )
}
