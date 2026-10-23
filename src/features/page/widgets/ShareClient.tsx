"use client"

import * as React from "react"
import { Check, Copy, Download, Share2 } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { Button } from "@/components/ui/button"
import { capabilities } from "@/lib/capabilities"
import { loadQrLogo, svgToPng } from "@/features/qr/browser"
import { QR_PRESETS, qrFilename, qrSvg, safeColours, type QrLogo, type QrStyle } from "@/features/qr/render"

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

/** The default code is Taplo's own: the Taplo mark in the middle, Taplo ink on white, soft modules and rounded finder corners. A business can choose its own logo, colour and shape. */
const TAPLO_MARK = "/logo/taplo-symbol-black-tight.svg"
const TAPLO_INK = "#12141a"

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

export type ShareFormat = "post" | "story"
export const SHARE_FORMATS: { id: ShareFormat; label: string; w: number; h: number; note: string }[] = [
  { id: "post", label: "Post", w: 1080, h: 1350, note: "4:5, for a feed post or a message" },
  { id: "story", label: "Story", w: 1080, h: 1920, note: "9:16, for a story or a status" },
]

export interface ShareImageInput { format?: ShareFormat; name: string; tagline?: string; url: string; action?: string; /** The business logo for the top of the image. The code carries the Taplo mark through `qr.logo`. */ logo?: QrLogo | null; qr: QrStyle; fonts?: { heading: string; body: string }; colours: { bg: string; fg: string; accent: string; accentText: string } }

/** A 1080x1350 share image in the page's own colours and fonts: name, line, the business's QR code, the message and the link. Drawn on a canvas, never uploaded. */
export async function renderShareImage(d: ShareImageInput): Promise<Blob | null> {
  const fmt = SHARE_FORMATS.find((x) => x.id === (d.format ?? "post"))!
  const W = fmt.w, H = fmt.h, PAD = 80, story = fmt.id === "story"
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H
  const ctx = canvas.getContext("2d"); if (!ctx) return null
  const heading = d.fonts?.heading || '"Inter Variable", system-ui, sans-serif'
  const body = d.fonts?.body || '"Inter Variable", system-ui, sans-serif'
  try { await Promise.all([document.fonts.load(`700 80px ${heading}`), document.fonts.load(`400 40px ${body}`), document.fonts.ready]) } catch { /* system font fallback */ }
  const { bg, fg, accent, accentText } = d.colours
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = accent; ctx.fillRect(0, 0, W, 18)
  ctx.fillStyle = fg; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"

  let y = story ? 330 : 150
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

  const qrSize = story ? 640 : 520
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

type Centre = "taplo" | "logo" | "none"
type Shape = "classic" | "soft" | "dots"
const SHAPES: Record<Shape, Pick<QrStyle, "dots" | "corners">> = { classic: { dots: "square", corners: "square" }, soft: { dots: "rounded", corners: "rounded" }, dots: { dots: "dots", corners: "rounded" } }

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string; disabled?: boolean; swatch?: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} disabled={o.disabled} onClick={() => onChange(o.value)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-tp-border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-tp-accent disabled:opacity-40 aria-checked:border-tp-accent aria-checked:bg-tp-accent/10 aria-checked:font-semibold">
            {o.swatch ? <span aria-hidden="true" className="size-3.5 rounded-full border border-black/20" style={{ background: o.swatch }} /> : null}{o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ShareBody({ data }: { data: ShareData }) {
  // Read from the browser without an effect: empty on the server, real values once hydrated.
  const where = React.useSyncExternalStore(noopSubscribe, () => `${window.location.origin}|${window.location.pathname}|${typeof navigator.share === "function"}`, () => "")
  const [origin = "", path = "", sharable = ""] = where.split("|")
  // Only a page served at its own public address has a public link. Anything opened from the workspace is a local preview link.
  const preview = !capabilities().publicPublishing || path.startsWith("/demo") || path.startsWith("/appearance") || path.startsWith("/dashboard")
  const url = origin ? (preview ? `${origin}/demo/p/${data.slug}` : `${origin}/${data.slug}`) : ""
  const canShare = sharable === "true"
  const local = !preview && /^(https?:\/\/)(localhost|127\.|10\.|192\.168\.|\[::1\])/.test(origin)
  const [tab, setTab] = React.useState<"qr" | "card">("qr")
  const [note, setNote] = React.useState("")
  const [mark, setMark] = React.useState<QrLogo | null>(null)
  const [bizLogo, setBizLogo] = React.useState<QrLogo | null>(null)
  const [centre, setCentre] = React.useState<Centre>("taplo")
  const [shape, setShape] = React.useState<Shape>("soft")
  const [brand, setBrand] = React.useState(false)
  const [clear, setClear] = React.useState(false)
  const [format, setFormat] = React.useState<ShareFormat>("post")
  const [brandHex, setBrandHex] = React.useState<string | null>(null)
  const [cardUrl, setCardUrl] = React.useState<string | null>(null)
  const root = React.useRef<HTMLDivElement>(null)
  const themed = () => root.current?.closest<HTMLElement>("[data-taplo-theme]") ?? document.querySelector<HTMLElement>("[data-taplo-theme]")

  React.useEffect(() => { let live = true; loadQrLogo(TAPLO_MARK).then((l) => { if (live) setMark(l) }); return () => { live = false } }, [])
  React.useEffect(() => { let live = true; loadQrLogo(data.logo).then((l) => { if (live) setBizLogo(l) }); return () => { live = false } }, [data.logo])
  React.useEffect(() => { const t = window.setTimeout(() => setBrandHex(toHex6(readColours(themed()).accent)), 0); return () => window.clearTimeout(t) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const logoFits = Boolean(bizLogo && bizLogo.aspect < 3)
  const chosenLogo = centre === "taplo" ? mark : centre === "logo" && logoFits ? bizLogo : null
  const fg = brand && brandHex ? brandHex : TAPLO_INK
  const style: QrStyle = React.useMemo(() => ({ ...SHAPES[shape], fg, bg: "#ffffff", transparent: clear, logo: chosenLogo }), [shape, fg, clear, chosenLogo])
  const drawn = React.useMemo(() => safeColours(fg, "#ffffff").fg, [fg])
  const svg = React.useMemo(() => (url ? qrSvg(url, style, 280, `QR code for ${data.name}`) : ""), [url, style, data.name])
  const fileOpts = { preview, transparent: clear }

  // The share card preview is the exported image itself, drawn by the same function. A newer request replaces an older one, so it can never show stale output.
  const request = React.useRef(0)
  React.useEffect(() => {
    if (tab !== "card" || !url) return
    const id = ++request.current
    const t = window.setTimeout(async () => {
      const blob = await renderShareImage({ format, name: data.name, tagline: data.tagline, url, action: data.action ?? "Scan to open our page", logo: bizLogo, qr: { ...style, transparent: false }, fonts: readFonts(themed()), colours: readColours(themed()) })
      if (id !== request.current || !blob) return
      setCardUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(blob) })
    }, 120)
    return () => window.clearTimeout(t)
  }, [tab, url, format, data.name, data.tagline, data.action, bizLogo, style])  // eslint-disable-line react-hooks/exhaustive-deps

  const say = (m: string) => { setNote(m); window.setTimeout(() => setNote((x) => (x === m ? "" : x)), 3500) }
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); say("Link copied") }
    catch { const t = root.current?.querySelector<HTMLInputElement>("input[readonly]"); t?.select(); say("Press copy on your keyboard to copy the link") }
  }
  const imageBlob = () => renderShareImage({ format, name: data.name, tagline: data.tagline, url, action: data.action ?? "Scan to open our page", logo: bizLogo, qr: { ...style, transparent: false }, fonts: readFonts(themed()), colours: readColours(themed()) })
  const shareNative = async () => {
    try {
      const blob = await imageBlob()
      const file = blob ? new File([blob], qrFilename(data.slug, "share", "png", { preview, format }), { type: "image/png" }) : null
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: data.name, text: data.tagline ?? data.name, url })
      else await navigator.share({ title: data.name, text: data.tagline ?? data.name, url })
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return // the person closed the share sheet: not an error
      say("Sharing is not available here. Copy the link instead.")
    }
  }
  const saveImage = async () => { const b = await imageBlob(); if (b) { download(qrFilename(data.slug, "share", "png", { preview, format }), b); say("Share image downloaded") } else say("Could not make the image") }
  const savePng = async (px: number) => { const b = await svgToPng(qrSvg(url, style, px, `QR code for ${data.name}`), px); if (b) { download(qrFilename(data.slug, "qr", "png", { px, ...fileOpts }), b); say(`QR code downloaded (${px} px)`) } else say("Could not make the QR code") }
  const saveSvg = () => { download(qrFilename(data.slug, "qr", "svg", fileOpts), new Blob([qrSvg(url, style, 1024, `QR code for ${data.name}`)], { type: "image/svg+xml" })); say("QR code downloaded (SVG)") }

  const tabBtn = (id: "qr" | "card", label: string) => (
    <button type="button" role="tab" aria-selected={tab === id} id={`share-tab-${id}`} aria-controls={`share-panel-${id}`} onClick={() => setTab(id)} data-testid={`share-tab-${id}`}
      className="min-h-11 flex-1 rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-tp-accent aria-selected:bg-tp-accent aria-selected:font-semibold aria-selected:text-tp-accent-fg">{label}</button>
  )

  return (
    <div ref={root} className="grid gap-5">
      <div className="grid gap-1.5">
        <label htmlFor="share-url" className="text-sm font-medium">Your link</label>
        <div className="flex gap-2"><input id="share-url" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-xl border border-tp-border bg-transparent px-3 text-sm" /><Button type="button" variant="outline" className="min-h-11 shrink-0" onClick={copy}><Copy /> Copy link</Button></div>
      </div>
      {preview ? <p className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950" data-testid="share-demo-note"><strong>Preview link.</strong> This page is not public yet, so the link and QR code only work in this browser. Files are named “preview” until the page has its own address.</p> : null}
      {local ? <p className="rounded-xl border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm text-amber-950" data-testid="share-local-note"><strong>This link only works on this device.</strong> It points at your own computer, not a public address.</p> : null}

      <div role="tablist" aria-label="What to share" className="flex gap-1 rounded-xl bg-tp-surface p-1">{tabBtn("qr", "QR code")}{tabBtn("card", "Share card")}</div>

      {tab === "qr" ? (
        <section role="tabpanel" id="share-panel-qr" aria-labelledby="share-tab-qr" className="grid gap-5" data-testid="share-qr">
          <div className="grid items-start gap-5 sm:grid-cols-[13rem_minmax(0,1fr)]">
            <div className={`mx-auto aspect-square w-52 max-w-full overflow-hidden rounded-2xl border border-tp-border ${clear ? "[background:repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%/16px_16px]" : "bg-white"}`}>
              {svg ? <div className="size-full [&>svg]:h-full [&>svg]:w-full" data-testid="qr-preview" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
            </div>
            <div className="grid gap-4">
              <Choice label="In the middle" value={centre} onChange={setCentre} options={[{ value: "taplo", label: "Taplo mark" }, { value: "logo", label: "Your logo", disabled: !logoFits }, { value: "none", label: "Nothing" }]} />
              {data.logo && !logoFits && bizLogo ? <p className="-mt-2 text-xs text-tp-muted">Your logo is too wide to sit inside a code. It stays on the share card.</p> : null}
              <Choice label="Colour" value={brand ? "brand" : "ink"} onChange={(v) => setBrand(v === "brand")} options={[{ value: "ink", label: "Black", swatch: TAPLO_INK }, { value: "brand", label: "Your colour", swatch: safeColours(brandHex ?? TAPLO_INK, "#ffffff").fg, disabled: !brandHex }]} />
              <Choice label="Shape" value={shape} onChange={setShape} options={[{ value: "classic", label: "Classic" }, { value: "soft", label: "Soft" }, { value: "dots", label: "Dots" }]} />
              <Choice label="Background" value={clear ? "clear" : "white"} onChange={(v) => setClear(v === "clear")} options={[{ value: "white", label: "White" }, { value: "clear", label: "Transparent" }]} />
            </div>
          </div>
          <p className="text-xs text-tp-muted">{clear ? "A transparent code needs a light surface behind it. On white, cream or light grey it scans; on a dark or busy picture it will not." : brand && drawn !== brandHex ? "Your colour was darkened a little so every phone can read it." : "Dark on white is the most reliable choice."}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {QR_PRESETS.map((p) => <Button key={p.id} type="button" variant="outline" className="min-h-11" onClick={() => savePng(p.px)} title={p.note}><Download /> QR code · {p.label} ({p.px} px)</Button>)}
            <Button type="button" variant="outline" className="min-h-11 sm:col-span-2" onClick={saveSvg}><Download /> QR code · SVG (any size, for print)</Button>
          </div>
        </section>
      ) : (
        <section role="tabpanel" id="share-panel-card" aria-labelledby="share-tab-card" className="grid gap-4" data-testid="share-card">
          <div role="radiogroup" aria-label="Format" className="flex flex-wrap gap-1.5">
            {SHARE_FORMATS.map((f) => <button key={f.id} type="button" role="radio" aria-checked={format === f.id} onClick={() => setFormat(f.id)} title={f.note} className="inline-flex min-h-10 items-center rounded-lg border border-tp-border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-tp-accent aria-checked:border-tp-accent aria-checked:bg-tp-accent/10 aria-checked:font-semibold">{f.label} · {f.note.split(",")[0]}</button>)}
          </div>
          <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-2xl border border-tp-border bg-tp-surface" style={{ aspectRatio: `${SHARE_FORMATS.find((f) => f.id === format)!.w} / ${SHARE_FORMATS.find((f) => f.id === format)!.h}` }}>
            {cardUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={cardUrl} alt={`Share card for ${data.name}`} className="size-full object-contain" data-testid="share-card-preview" /> : <div className="size-full animate-pulse" aria-hidden="true" />}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {canShare ? <Button type="button" className="min-h-11 bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90 sm:col-span-2" onClick={shareNative}><Share2 /> Share from this device</Button> : null}
            <Button type="button" variant="outline" className="min-h-11 sm:col-span-2" onClick={saveImage}><Download /> Share image ({SHARE_FORMATS.find((f) => f.id === format)!.w} × {SHARE_FORMATS.find((f) => f.id === format)!.h})</Button>
          </div>
        </section>
      )}
      <p role="status" className="min-h-5 text-sm font-medium text-tp-accent" aria-live="polite">{note ? <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-4" />{note}</span> : null}</p>
      <p className="text-xs text-tp-muted">Apps like Instagram, WhatsApp and Facebook choose how a link looks and may keep an old preview for a while. Taplo cannot control that.</p>
    </div>
  )
}

/** Any CSS colour the page uses, as #rrggbb (or null if it cannot be read). */
function toHex6(c: string): string | null {
  const m = /^#([0-9a-f]{3})$/i.exec(c.trim())
  if (m) return `#${m[1]!.split("").map((x) => x + x).join("")}`.toLowerCase()
  if (/^#[0-9a-f]{6}$/i.test(c.trim())) return c.trim().toLowerCase()
  const cv = document.createElement("canvas"); cv.width = cv.height = 1
  const ctx = cv.getContext("2d"); if (!ctx) return null
  ctx.fillStyle = "#000000"; ctx.fillStyle = c
  const out = ctx.fillStyle
  return /^#[0-9a-f]{6}$/i.test(out) ? out : null
}
