"use client"

import * as React from "react"
import { Check, Copy, Download, Share2 } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { capabilities } from "@/lib/capabilities"
import { loadQrLogo, svgToPng } from "@/features/qr/browser"
import { QR_PRESETS, qrFilename, qrSvg, type QrLogo, type QrStyle } from "@/features/qr/render"

/**
 * Sharing, with three things kept separate:
 *  1. this panel: how the page is shared, with a preview of the code and the image;
 *  2. the downloadable artwork (share image, QR code), all drawn by the one QR renderer in `features/qr`;
 *  3. the Open Graph metadata external apps read (set on the public route, not here).
 * Social apps cache and show links their own way, so nothing here promises an exact preview there.
 * The code always points at the page's own address. A draft that is not public has no public address, so its link
 * is the one that opens in this browser, and the files are named and explained that way.
 */

export interface ShareData { name: string; tagline?: string; slug: string; /** The business logo, when it has one; shown at the top of the share image (never inside the QR code). */ logo?: string; /** What the share image says under the code, for example "Scan to book". */ action?: string }

/** Every business gets the same Taplo code: the Taplo mark in the middle, Taplo ink on white, soft modules and rounded finder corners. */
const TAPLO_MARK = "/logo/taplo-symbol-black-tight.svg"
const TAPLO_INK = "#12141a"
const TAPLO_QR = { dots: "rounded", corners: "rounded" } as const

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean); const lines: string[] = []; let cur = ""
  for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w } else cur = t }
  if (cur) lines.push(cur)
  return lines
}

/** At most `n` lines; if the text runs on, the last line ends in an ellipsis that still fits. */
function clamp(ctx: CanvasRenderingContext2D, lines: string[], n: number, max: number): string[] {
  if (lines.length <= n) return lines
  const out = lines.slice(0, n); let last = out[n - 1]
  while (last.length > 1 && ctx.measureText(`${last}…`).width > max) last = last.slice(0, -1)
  out[n - 1] = `${last.trimEnd()}…`
  return out
}

/** Shrink until the longest single word fits, so a very long unbroken name is never cut off. */
function fitSize(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, size: number, min: number, max: number): number {
  const longest = text.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "")
  let px = size
  for (; px > min; px -= 4) { ctx.font = `${weight} ${px}px ${family}`; if (ctx.measureText(longest).width <= max) break }
  return px
}

const loadImage = (src: string): Promise<HTMLImageElement | null> => new Promise((res) => { const i = new window.Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src })

export interface ShareImageInput { name: string; tagline?: string; url: string; action?: string; /** The business logo for the top of the image. The code carries the Taplo mark through `qr.logo`. */ logo?: QrLogo | null; qr: QrStyle; fonts?: { heading: string; body: string }; colours: { bg: string; fg: string; accent: string; accentText: string } }

/** A 1080x1350 share image in the page's own colours and fonts: name, line, the business's QR code, the message and the link. Drawn on a canvas, never uploaded. */
export async function renderShareImage(d: ShareImageInput): Promise<Blob | null> {
  const W = 1080, H = 1350, PAD = 80
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H
  const ctx = canvas.getContext("2d"); if (!ctx) return null
  const heading = d.fonts?.heading || '"Inter Variable", system-ui, sans-serif'
  const body = d.fonts?.body || '"Inter Variable", system-ui, sans-serif'
  try { await Promise.all([document.fonts.load(`700 80px ${heading}`), document.fonts.load(`400 40px ${body}`), document.fonts.ready]) } catch { /* system font fallback */ }
  const { bg, fg, accent, accentText } = d.colours
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = accent; ctx.fillRect(0, 0, W, 18)
  ctx.fillStyle = fg; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"

  let y = 150
  const logo = d.logo ? await loadImage(d.logo.href) : null
  if (logo && logo.naturalWidth > 0) {
    const s = Math.min(420 / logo.naturalWidth, 130 / logo.naturalHeight, 1.5)
    const w = logo.naturalWidth * s, h = logo.naturalHeight * s
    ctx.drawImage(logo, PAD, y - 30, w, h)
    y += h + 40
  } else y += 40

  const size = fitSize(ctx, d.name, heading, 700, 92, 44, W - PAD * 2)
  ctx.font = `700 ${size}px ${heading}`
  const nameLines = clamp(ctx, wrap(ctx, d.name, W - PAD * 2), 3, W - PAD * 2)
  nameLines.forEach((l, i) => ctx.fillText(l, PAD, y + size * 0.8 + i * size * 1.12))
  y += nameLines.length * size * 1.12 + 16

  const qrSize = 520
  const qx = (W - qrSize) / 2, qy = H - qrSize - 290
  if (d.tagline) {
    const room = Math.max(1, Math.min(4, Math.floor((qy - 56 - y) / 58)))
    ctx.globalAlpha = 0.74; ctx.font = `400 42px ${body}`
    for (const l of clamp(ctx, wrap(ctx, d.tagline, W - PAD * 2), room, W - PAD * 2)) { ctx.fillText(l, PAD, y + 40); y += 58 }
    ctx.globalAlpha = 1
  }

  // The code is the shared renderer's own drawing, on a plain plate (its quiet zone is part of the drawing).
  const qrImg = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(d.url, d.qr, qrSize))}`)
  const bgq = "#ffffff"
  ctx.fillStyle = bgq; ctx.beginPath(); ctx.roundRect(qx - 16, qy - 16, qrSize + 32, qrSize + 32, 36); ctx.fill()
  if (qrImg) ctx.drawImage(qrImg, qx, qy, qrSize, qrSize)

  if (d.action) {
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.font = `600 40px ${body}`
    ctx.fillText(clamp(ctx, [d.action], 1, W - PAD * 2)[0]!, W / 2, qy + qrSize + 78)
  }
  const label = d.url.replace(/^https?:\/\//, "")
  ctx.fillStyle = accent; ctx.beginPath(); ctx.roundRect(PAD, H - 150, W - PAD * 2, 84, 42); ctx.fill()
  ctx.fillStyle = accentText; ctx.textAlign = "center"
  let lp = 36; ctx.font = `600 ${lp}px ${body}`
  while (lp > 20 && ctx.measureText(label).width > W - PAD * 2 - 48) { lp -= 2; ctx.font = `600 ${lp}px ${body}` }
  ctx.fillText(label, W / 2, H - 96)
  return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"))
}

function readColours(el: HTMLElement | null) {
  const cs = el ? getComputedStyle(el) : null
  const v = (n: string, fb: string) => cs?.getPropertyValue(n).trim() || fb
  return { bg: v("--tp-background", "#ffffff"), fg: v("--tp-foreground", "#111111"), accent: v("--tp-accent", "#111111"), accentText: v("--tp-accent-foreground", "#ffffff") }
}

function readFonts(el: HTMLElement | null) {
  const cs = el ? getComputedStyle(el) : null
  const heading = cs?.getPropertyValue("--tp-font-heading").trim(), body = cs?.getPropertyValue("--tp-font-body").trim()
  return heading && body ? { heading, body } : undefined
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
  // Only a page served at its own public address has a public link. Anything opened from the workspace is a local preview link.
  const preview = !capabilities().publicPublishing || path.startsWith("/demo") || path.startsWith("/appearance") || path.startsWith("/dashboard")
  const url = origin ? (preview ? `${origin}/demo/p/${data.slug}` : `${origin}/${data.slug}`) : ""
  const canShare = sharable === "true"
  const local = !preview && /^(https?:\/\/)(localhost|127\.|10\.|192\.168\.|\[::1\])/.test(origin)
  const [note, setNote] = React.useState("")
  const [mark, setMark] = React.useState<QrLogo | null>(null)
  const [bizLogo, setBizLogo] = React.useState<QrLogo | null>(null)
  const [colours, setColours] = React.useState({ bg: "#ffffff", fg: "#111111", accent: "#111111", accentText: "#ffffff" })
  const root = React.useRef<HTMLDivElement>(null)
  const themed = () => root.current?.closest<HTMLElement>("[data-taplo-theme]") ?? document.querySelector<HTMLElement>("[data-taplo-theme]")

  React.useEffect(() => { setColours(readColours(themed())) }, [where])
  React.useEffect(() => { let live = true; loadQrLogo(TAPLO_MARK).then((l) => { if (live) setMark(l) }); return () => { live = false } }, [])
  React.useEffect(() => { let live = true; loadQrLogo(data.logo).then((l) => { if (live) setBizLogo(l) }); return () => { live = false } }, [data.logo])

  const say = (m: string) => { setNote(m); window.setTimeout(() => setNote((x) => (x === m ? "" : x)), 3500) }
  const style: QrStyle = React.useMemo(() => ({ ...TAPLO_QR, fg: TAPLO_INK, bg: "#ffffff", logo: mark }), [mark])
  const svg = React.useMemo(() => (url ? qrSvg(url, style, 260, `QR code for ${data.name}`) : ""), [url, style, data.name])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); say("Link copied") }
    catch { const t = root.current?.querySelector<HTMLInputElement>("input[readonly]"); t?.select(); say("Press copy on your keyboard to copy the link") }
  }
  const imageBlob = () => renderShareImage({ name: data.name, tagline: data.tagline, url, action: data.action ?? "Scan to open our page", logo: bizLogo, qr: style, fonts: readFonts(themed()), colours })
  const shareNative = async () => {
    try {
      const blob = await imageBlob()
      const file = blob ? new File([blob], qrFilename(data.slug, "share", "png", { preview }), { type: "image/png" }) : null
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: data.name, text: data.tagline ?? data.name, url })
      else await navigator.share({ title: data.name, text: data.tagline ?? data.name, url })
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return // the person closed the share sheet: not an error
      say("Sharing is not available here. Copy the link instead.")
    }
  }
  const saveImage = async () => { const b = await imageBlob(); if (b) { download(qrFilename(data.slug, "share", "png", { preview }), b); say("Share image downloaded") } else say("Could not make the image") }
  const savePng = async (px: number) => { const b = await svgToPng(qrSvg(url, style, px, `QR code for ${data.name}`), px); if (b) { download(qrFilename(data.slug, "qr", "png", { px, preview }), b); say(`QR code downloaded (${px} px)`) } else say("Could not make the QR code") }
  const saveSvg = () => { download(qrFilename(data.slug, "qr", "svg", { preview }), new Blob([qrSvg(url, style, 1024, `QR code for ${data.name}`)], { type: "image/svg+xml" })); say("QR code downloaded (SVG)") }

  return (
    <div ref={root} className="grid gap-5">
      <section aria-label="How your page is shared" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-tp-border bg-tp-surface p-4" data-testid="share-card">
        <div className="min-w-0"><p className="truncate font-tp-heading text-lg font-semibold">{data.name}</p>{data.tagline ? <p className="mt-0.5 line-clamp-2 text-sm text-tp-muted">{data.tagline}</p> : null}<p className="mt-2 truncate text-xs font-medium text-tp-accent">{url.replace(/^https?:\/\//, "")}</p></div>
        {svg ? <div className="size-28 overflow-hidden rounded-xl bg-white [&>svg]:h-full [&>svg]:w-full" data-testid="qr-preview" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      </section>
      {preview ? <p className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950" data-testid="share-demo-note"><strong>Preview link.</strong> This page is not public yet, so the link and QR code only work in this browser. Files are named “preview” until the page has its own address.</p> : null}
      {local ? <p className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950" data-testid="share-local-note"><strong>This link only works on this device.</strong> It points at your own computer, not a public address.</p> : null}
      <div className="grid gap-1.5">
        <label htmlFor="share-url" className="text-sm font-medium">Link</label>
        <div className="flex gap-2"><input id="share-url" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-xl border border-tp-border bg-transparent px-3 text-sm" /><Button type="button" variant="outline" className="min-h-11 shrink-0" onClick={copy}><Copy /> Copy link</Button></div>
      </div>
      <p className="text-xs text-tp-muted">The code carries the Taplo mark and stays dark on white so every phone reads it.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {canShare ? <Button type="button" className="min-h-11 bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90 sm:col-span-2" onClick={shareNative}><Share2 /> Share from this device</Button> : null}
        <Button type="button" variant="outline" className="min-h-11 sm:col-span-2" onClick={saveImage}><Download /> Share image (1080 × 1350)</Button>
        {QR_PRESETS.map((p) => <Button key={p.id} type="button" variant="outline" className="min-h-11" onClick={() => savePng(p.px)} title={p.note}><Download /> QR code · {p.label} ({p.px} px)</Button>)}
        <Button type="button" variant="outline" className="min-h-11 sm:col-span-2" onClick={saveSvg}><Download /> QR code · SVG (any size, for print)</Button>
      </div>
      <p role="status" className="min-h-5 text-sm font-medium text-tp-accent" aria-live="polite">{note ? <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-4" />{note}</span> : null}</p>
      <p className="text-xs text-tp-muted">Apps like Instagram, WhatsApp and Facebook choose how a link looks and may keep an old preview for a while. Taplo cannot control that.</p>
    </div>
  )
}
