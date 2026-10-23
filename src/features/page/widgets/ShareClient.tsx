"use client"

import * as React from "react"
import qrcode from "qrcode-generator"
import { Check, Copy, Download, Share2 } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"

/**
 * Sharing, with three separate things kept separate:
 *  1. this card: Taplo's own preview of how the page is shared;
 *  2. the downloadable artwork (share image, QR code);
 *  3. the Open Graph metadata external apps read (set on the public route, not here).
 * Social apps cache and render links their own way, so nothing here promises an exact preview there.
 * A preview-mode link only works in this browser and says so.
 */

export interface ShareData { name: string; tagline?: string; slug: string }

function qrMatrix(url: string) {
  const q = qrcode(0, "M")
  q.addData(url)
  q.make()
  const n = q.getModuleCount()
  return { n, dark: (r: number, c: number) => q.isDark(r, c) }
}

function qrSvg(url: string, size = 220, quiet = 4, fg = "#000", bg = "#fff"): string {
  const m = qrMatrix(url)
  const cell = size / (m.n + quiet * 2)
  let d = ""
  for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c)) d += `M${((c + quiet) * cell).toFixed(2)} ${((r + quiet) * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="QR code for ${url.replace(/"/g, "")}"><rect width="${size}" height="${size}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page"

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/); const lines: string[] = []; let cur = ""
  for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w } else cur = t }
  if (cur) lines.push(cur)
  return lines
}

/** A 1080x1350 share image drawn from the page's own colours: name, line, QR and link. Rendered on a canvas, never uploaded. */
export async function renderShareImage(d: { name: string; tagline?: string; url: string; colours: { bg: string; fg: string; accent: string; accentText: string } }): Promise<Blob | null> {
  const W = 1080, H = 1350
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H
  const ctx = canvas.getContext("2d"); if (!ctx) return null
  try { await document.fonts.ready } catch { /* system font fallback */ }
  const { bg, fg, accent, accentText } = d.colours
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = accent; ctx.fillRect(0, 0, W, 18)
  ctx.fillStyle = fg; ctx.textBaseline = "alphabetic"
  ctx.font = '700 92px "Inter Variable", system-ui, sans-serif'
  const nameLines = wrap(ctx, d.name, W - 160).slice(0, 3)
  nameLines.forEach((l, i) => ctx.fillText(l, 80, 220 + i * 104))
  let y = 220 + nameLines.length * 104 + 20
  if (d.tagline) {
    ctx.globalAlpha = 0.72; ctx.font = '400 42px "Inter Variable", system-ui, sans-serif'
    for (const l of wrap(ctx, d.tagline, W - 160).slice(0, 4)) { ctx.fillText(l, 80, y + 40); y += 58 }
    ctx.globalAlpha = 1
  }
  const m = qrMatrix(d.url); const size = 520; const quiet = 3; const cell = size / (m.n + quiet * 2)
  const qx = (W - size) / 2, qy = H - size - 230
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(qx - 28, qy - 28, size + 56, size + 56, 36); ctx.fill()
  ctx.fillStyle = "#000"
  for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c)) ctx.fillRect(qx + (c + quiet) * cell, qy + (r + quiet) * cell, Math.ceil(cell), Math.ceil(cell))
  ctx.fillStyle = accent; ctx.beginPath(); ctx.roundRect(80, H - 150, W - 160, 84, 42); ctx.fill()
  ctx.fillStyle = accentText; ctx.font = '600 36px "Inter Variable", system-ui, sans-serif'; ctx.textAlign = "center"
  ctx.fillText(d.url.replace(/^https?:\/\//, ""), W / 2, H - 96)
  return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"))
}

function readColours(el: HTMLElement | null) {
  const cs = el ? getComputedStyle(el) : null
  const v = (n: string, fb: string) => cs?.getPropertyValue(n).trim() || fb
  return { bg: v("--tp-background", "#ffffff"), fg: v("--tp-foreground", "#111111"), accent: v("--tp-accent", "#111111"), accentText: v("--tp-accent-foreground", "#ffffff") }
}

export function ShareButton({ data, label = "Share this page", variant = "button" }: { data: ShareData; label?: string; variant?: "button" | "card" }) {
  return (
    <SharePanel data={data} trigger={
      <button type="button" className="tp-btn" data-variant={variant === "card" ? "card" : "button"}>
        <Share2 aria-hidden="true" className="size-5" /><span className="tp-btn-main"><span className="tp-btn-label">{label}</span>{variant === "card" ? <span className="tp-btn-sub">Link, QR code and image</span> : null}</span>
      </button>} />
  )
}

export function SharePanel({ data, trigger, open, onOpenChange }: { data: ShareData; trigger?: React.ReactNode; open?: boolean; onOpenChange?: (o: boolean) => void }) {
  return (
    <Overlay tone="page" kind="dialog" trigger={trigger} open={open} onOpenChange={onOpenChange} title="Share" description={`Share ${data.name}`} testId="share-panel">
      <ShareBody data={data} />
    </Overlay>
  )
}

const noopSubscribe = () => () => {}

function ShareBody({ data }: { data: ShareData }) {
  // Read from the browser without an effect: empty on the server, real values once hydrated.
  const where = React.useSyncExternalStore(noopSubscribe, () => `${window.location.origin}|${window.location.pathname}|${typeof navigator.share === "function"}`, () => "")
  const [origin = "", path = "", sharable = ""] = where.split("|")
  const demo = path.startsWith("/demo") || path.startsWith("/appearance") || path.startsWith("/dashboard")
  const url = origin ? (demo ? `${origin}/demo/p/${data.slug}` : `${origin}/${data.slug}`) : ""
  const canShare = sharable === "true"
  const [note, setNote] = React.useState("")
  const root = React.useRef<HTMLDivElement>(null)

  const say = (m: string) => { setNote(m); window.setTimeout(() => setNote((x) => (x === m ? "" : x)), 3500) }
  const svg = React.useMemo(() => (url ? qrSvg(url, 260, 2) : ""), [url])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); say("Link copied") }
    catch { const t = root.current?.querySelector<HTMLInputElement>("input[readonly]"); t?.select(); say("Press copy on your keyboard to copy the link") }
  }
  const imageBlob = () => renderShareImage({ name: data.name, tagline: data.tagline, url, colours: readColours(root.current?.closest<HTMLElement>("[data-taplo-theme]") ?? document.querySelector<HTMLElement>("[data-taplo-theme]")) })
  const shareNative = async () => {
    try {
      const blob = await imageBlob()
      const file = blob ? new File([blob], `${slugify(data.name)}-taplo.png`, { type: "image/png" }) : null
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: data.name, text: data.tagline ?? data.name, url })
      else await navigator.share({ title: data.name, text: data.tagline ?? data.name, url })
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return // the person closed the share sheet: not an error
      say("Sharing is not available here. Copy the link instead.")
    }
  }
  const saveImage = async () => { const b = await imageBlob(); if (b) { download(`${slugify(data.name)}-share.png`, b); say("Share image downloaded") } else say("Could not make the image") }
  const saveQr = (kind: "png" | "svg") => {
    if (kind === "svg") { download(`${slugify(data.name)}-qr.svg`, new Blob([qrSvg(url, 1024, 4)], { type: "image/svg+xml" })); say("QR code (SVG) downloaded"); return }
    const c = document.createElement("canvas"); c.width = c.height = 1024
    const img = new window.Image()
    img.onload = () => { const ctx = c.getContext("2d"); if (!ctx) return; ctx.drawImage(img, 0, 0, 1024, 1024); c.toBlob((b) => { if (b) { download(`${slugify(data.name)}-qr.png`, b); say("QR code (PNG) downloaded") } }, "image/png") }
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(url, 1024, 4))}`
  }

  return (
    <div ref={root} className="grid gap-5">
      <section aria-label="How your page is shared" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-tp-border bg-tp-surface p-4" data-testid="share-card">
        <div className="min-w-0"><p className="truncate font-tp-heading text-lg font-semibold">{data.name}</p>{data.tagline ? <p className="mt-0.5 line-clamp-2 text-sm text-tp-muted">{data.tagline}</p> : null}<p className="mt-2 truncate text-xs font-medium text-tp-accent">{url.replace(/^https?:\/\//, "")}</p></div>
        {svg ? <div className="size-24 overflow-hidden rounded-lg bg-white p-1 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      </section>
      {demo ? <p className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950" data-testid="share-demo-note"><strong>Preview link.</strong> This page is not public yet. The link and QR code only work in this browser. A real public link comes with publishing.</p> : null}
      <div className="grid gap-1.5">
        <label htmlFor="share-url" className="text-sm font-medium">Link</label>
        <div className="flex gap-2"><input id="share-url" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-xl border border-tp-border bg-transparent px-3 text-sm" /><Button type="button" variant="outline" className="min-h-11" onClick={copy}><Copy /> Copy link</Button></div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {canShare ? <Button type="button" className="min-h-11 bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90 sm:col-span-2" onClick={shareNative}><Share2 /> Share from this device</Button> : null}
        <Button type="button" variant="outline" className="min-h-11" onClick={saveImage}><Download /> Share image</Button>
        <Button type="button" variant="outline" className="min-h-11" onClick={() => saveQr("png")}><Download /> QR code (PNG)</Button>
        <Button type="button" variant="outline" className="min-h-11 sm:col-span-2" onClick={() => saveQr("svg")}><Download /> QR code (SVG, for print)</Button>
      </div>
      <p role="status" className="min-h-5 text-sm font-medium text-tp-accent" aria-live="polite">{note ? <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-4" />{note}</span> : null}</p>
      <p className="text-xs text-tp-muted">Apps like Instagram, WhatsApp and Facebook choose how a link looks and may keep an old preview for a while. Taplo cannot control that.</p>
    </div>
  )
}
