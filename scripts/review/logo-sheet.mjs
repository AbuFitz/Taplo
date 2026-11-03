// Contact sheet of every supplied logo file at several sizes on light, grey and dark grounds.
import sharp from "sharp"
import { mkdirSync } from "node:fs"
const L = new URL("../../public/logo/", import.meta.url).pathname
const out = new URL("../../docs/brand/", import.meta.url).pathname
mkdirSync(out, { recursive: true })
const rows = [
  ["symbol-black", "taplo-symbol-black.svg", "#ffffff"],
  ["symbol-white", "taplo-symbol-white.svg", "#0b0d12"],
  ["wordmark-black", "taplo-wordmark-black.svg", "#ffffff"],
  ["wordmark-white", "taplo-wordmark-white.svg", "#0b0d12"],
  ["horizontal-black", "taplo-horizontal-black.svg", "#ffffff"],
  ["horizontal-black on grey", "taplo-horizontal-black.svg", "#f1f2f5"],
  ["horizontal-white", "taplo-horizontal-white.svg", "#0b0d12"],
  ["stacked-black", "taplo-stacked-black.svg", "#ffffff"],
  ["app-black", "taplo-app-black.svg", "#ffffff"],
  ["app-square", "taplo-app-square.svg", "#ffffff"],
  ["maskable", "taplo-maskable.svg", "#ffffff"],
  ["favicon.svg", "favicon.svg", "#ffffff"],
]
const heights = [16, 24, 40, 72, 140]
const rowH = 170, labelW = 190
const cells = []
let W = labelW
const metas = []
for (const [label, file, bg] of rows) {
  const row = []
  for (const h of heights) {
    const buf = await sharp(L + file, { density: Math.max(72, h * 3) }).resize({ height: h }).png().toBuffer()
    const m = await sharp(buf).metadata()
    row.push({ buf, w: m.width, h: m.height })
  }
  metas.push({ label, bg, row })
  W = Math.max(W, labelW + row.reduce((a, c) => a + c.w + 36, 24))
}
const layers = []
const svgBg = metas.map((m, i) => `<rect x="0" y="${i * rowH}" width="${W}" height="${rowH}" fill="${m.bg}"/><text x="14" y="${i * rowH + 26}" font-family="Inter, Arial" font-size="14" fill="${m.bg === "#0b0d12" ? "#9aa" : "#556"}">${m.label}</text>`).join("")
metas.forEach((m, i) => { let x = labelW; for (const c of m.row) { layers.push({ input: c.buf, left: x, top: i * rowH + Math.round((rowH - c.h) / 2) }); x += c.w + 36 } })
await sharp({ create: { width: W, height: rowH * metas.length, channels: 4, background: "#fff" } }).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${rowH * metas.length}">${svgBg}</svg>`), left: 0, top: 0 }, ...layers]).png().toFile(out + "logo-contact-sheet.png")
console.log("written", W, rowH * metas.length)
