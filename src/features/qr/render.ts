import qrcode from "qrcode-generator"

/**
 * One QR renderer for everything: the on-screen preview, the standalone SVG and PNG downloads, and the share image.
 * It draws the matrix itself (so every output is the same drawing), on top of `qrcode-generator` for the encoding.
 *
 * Scanning rules this file enforces rather than leaves to the caller:
 *  - the quiet zone is always 4 modules, on a plain background;
 *  - the three finder patterns are drawn whole (only their outline style varies) and nothing is ever drawn over them;
 *  - dark modules are always darker than the background by at least 7:1; a brand colour that cannot do that is darkened,
 *    and a brand that has no usable dark colour falls back to black;
 *  - a centred logo is limited to a square 20% of the code's width (4% of its area) plus one module of clear space.
 *    With error correction Q (about 25% recoverable) that is far inside what a scanner can lose, so a logo never relies on
 *    correction to hide an arbitrary amount of the code; without a logo the code uses M;
 *  - the destination is encoded verbatim, and the caller decides what that destination is.
 */

export type DotStyle = "square" | "rounded" | "dots"
export type CornerStyle = "square" | "rounded" | "round"

export interface QrLogo {
  /** A data: URI (so an exported SVG stays self-contained). */
  href: string
  /** Natural width / height, used to fit it inside the clear area. */
  aspect: number
}

export interface QrStyle {
  dots: DotStyle
  corners: CornerStyle
  /** Dark module colour, as a hex. Darkened automatically if it would not scan reliably. */
  fg: string
  /** Background and quiet-zone colour, as a hex. */
  bg: string
  logo?: QrLogo | null
}

export const QUIET = 4
export const LOGO_SHARE = 0.2

const hex = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const }
const toHex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`
const lum = (c: string) => { const [r, g, b] = hex(c).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! }
export const contrast = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

/** The colours actually drawn: dark modules on a light plain background, at least 7:1 apart. */
export function safeColours(fg: string, bg: string): { fg: string; bg: string } {
  const valid = (c: string) => /^#[0-9a-f]{6}$/i.test(c)
  let back = valid(bg) ? bg : "#ffffff"
  if (lum(back) < 0.6) back = "#ffffff" // a dark background scans badly in many apps; the code sits on white instead
  let front = valid(fg) ? fg : "#000000"
  for (let i = 0; i < 24 && contrast(front, back) < 7; i++) { const [r, g, b] = hex(front); front = toHex(r * 0.85, g * 0.85, b * 0.85) }
  if (contrast(front, back) < 7) front = "#000000"
  return { fg: front, bg: back }
}

export interface QrModel { n: number; size: number; dark: (r: number, c: number) => boolean; ecc: "M" | "Q"; logoModules: number }

export function qrModel(url: string, withLogo: boolean): QrModel {
  const ecc = withLogo ? "Q" : "M"
  const q = qrcode(0, ecc)
  q.addData(url)
  q.make()
  const n = q.getModuleCount()
  // An odd count keeps the logo centred on the middle module.
  let logoModules = withLogo ? Math.floor(n * LOGO_SHARE) : 0
  if (logoModules % 2 === 0) logoModules -= 1
  return { n, size: n + QUIET * 2, dark: (r, c) => q.isDark(r, c), ecc, logoModules: Math.max(0, logoModules) }
}

const inFinder = (n: number, r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)

function finderPath(x: number, y: number, style: CornerStyle): string {
  // Outer ring 7x7 with a 5x5 hole, then a 3x3 solid centre; the ring is filled with the even-odd rule.
  const rr = (px: number, py: number, w: number, rad: number) => {
    const r = Math.min(rad, w / 2)
    return `M${px + r} ${py}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${w - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(w - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`
  }
  // "round" stops short of a circle: concentric circles are the one finder shape some scanners lose.
  const k = style === "square" ? 0 : style === "rounded" ? 1.4 : 2.4
  return `${rr(x, y, 7, k)}${rr(x + 1, y + 1, 5, Math.max(0, k - 1))}${rr(x + 2, y + 2, 3, style === "square" ? 0 : style === "rounded" ? 0.7 : 1.1)}`
}

const f = (v: number) => (Math.round(v * 100) / 100).toString()

/** The drawing as an SVG document, in module units (viewBox `0 0 size size`), scaled to `px` by width/height. */
export function qrSvg(url: string, style: QrStyle, px = 512, label?: string): string {
  const colours = safeColours(style.fg, style.bg)
  const logo = style.logo && style.logo.aspect > 0 && style.logo.aspect < 3 ? style.logo : null
  const m = qrModel(url, Boolean(logo))
  const { n, size } = m
  const lo = logo ? Math.floor((n - m.logoModules) / 2) : 0
  const hi = logo ? lo + m.logoModules - 1 : -1
  // One module of clear space around the logo plate.
  const clear = (r: number, c: number) => logo !== null && r >= lo - 1 && r <= hi + 1 && c >= lo - 1 && c <= hi + 1

  let d = ""
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!m.dark(r, c) || inFinder(n, r, c) || clear(r, c)) continue
    const x = c + QUIET, y = r + QUIET
    if (style.dots === "square") d += `M${x} ${y}h1v1h-1z`
    else if (style.dots === "dots") d += `M${f(x + 0.5 - 0.5)} ${f(y + 0.5)}a0.5 0.5 0 1 0 0.92 0a0.5 0.5 0 1 0 -0.92 0z`
    else { const k = 0.22; d += `M${f(x + k)} ${y}h${f(1 - 2 * k)}a${k} ${k} 0 0 1 ${k} ${k}v${f(1 - 2 * k)}a${k} ${k} 0 0 1 ${-k} ${k}h${f(-(1 - 2 * k))}a${k} ${k} 0 0 1 ${-k} ${-k}v${f(-(1 - 2 * k))}a${k} ${k} 0 0 1 ${k} ${-k}z` }
  }
  const finders = [[0, 0], [0, n - 7], [n - 7, 0]].map(([r, c]) => finderPath(c! + QUIET, r! + QUIET, style.corners)).join("")

  let logoEl = ""
  if (logo) {
    const plate = (m.logoModules + 2) // the plate covers the clear space
    const px0 = lo - 1 + QUIET
    const inner = m.logoModules
    // Fit the logo inside the inner square, keeping its proportions.
    const w = logo.aspect >= 1 ? inner : inner * logo.aspect
    const h = logo.aspect >= 1 ? inner / logo.aspect : inner
    logoEl = `<rect x="${px0}" y="${px0}" width="${plate}" height="${plate}" rx="${f(plate * 0.18)}" fill="${colours.bg}"/><image href="${logo.href}" x="${f(lo + QUIET + (inner - w) / 2)}" y="${f(lo + QUIET + (inner - h) / 2)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="xMidYMid meet"/>`
  }

  const title = label ? `<title>${label.replace(/[<>&"]/g, "")}</title>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${px}" height="${px}" role="img" aria-label="${(label ?? "QR code").replace(/[<>&"]/g, "")}" shape-rendering="geometricPrecision">${title}<rect width="${size}" height="${size}" fill="${colours.bg}"/><path d="${d}" fill="${colours.fg}"/><path d="${finders}" fill="${colours.fg}" fill-rule="evenodd"/>${logoEl}</svg>`
}

/** What the exports offer. Sizes are explicit so a filename always says what it is. */
export const QR_PRESETS = [
  { id: "screen", label: "Screen", px: 1024, note: "1024 px PNG, for a website, a story or a message" },
  { id: "print", label: "Print", px: 3000, note: "3000 px PNG: 25 cm at 300 dpi, for a window sticker or a flyer" },
] as const
export type QrPresetId = (typeof QR_PRESETS)[number]["id"]

export const qrFilename = (slug: string, kind: "qr" | "share", ext: "png" | "svg", opts: { px?: number; preview?: boolean } = {}) =>
  `${slug || "page"}${opts.preview ? "-preview" : ""}-${kind}${opts.px ? `-${opts.px}px` : ""}.${ext}`
