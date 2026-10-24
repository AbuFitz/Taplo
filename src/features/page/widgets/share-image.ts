"use client"
import { qrSvg, type QrLogo, type QrStyle } from "@/features/qr/render"
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
