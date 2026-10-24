// Flat logo marks for the fictional example businesses. Type is converted to outlines, so the files do not
// depend on any installed font. Run: node scripts/marketing/logos.mjs   Output: public/showcase/*-mark.svg
// Note: some static fonts have glyphs opentype.js misreads (Barlow T, Fraunces s), so those letters are avoided. Fonts (SIL OFL) come from the @fontsource dev dependencies.
import { writeFileSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import opentype from "opentype.js"
const require = createRequire(import.meta.url)
const load = (pkg, file) => { const b = readFileSync(require.resolve(`${pkg}/files/${file}`)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)) }
const F = {
  fraunces: load("@fontsource/fraunces", "fraunces-latin-700-normal.woff"),
  grotesk: load("@fontsource/space-grotesk", "space-grotesk-latin-700-normal.woff"),
  bricolage: load("@fontsource/bricolage-grotesque", "bricolage-grotesque-latin-700-normal.woff"),
  lexend: load("@fontsource/lexend", "lexend-latin-700-normal.woff"),
  barlow: load("@fontsource/barlow-condensed", "barlow-condensed-latin-700-normal.woff"),
  instrument: load("@fontsource/instrument-serif", "instrument-serif-latin-400-normal.woff"),
}
/** Outlined text centred on x, baseline y, with optional tracking in em. */
function text(font, s, size, cx, y, fill, tracking = 0) {
  const scale = size / font.unitsPerEm
  const glyphs = [...s].map((c) => font.charToGlyph(c))
  const adv = glyphs.map((g, i) => g.advanceWidth * scale + (i < glyphs.length - 1 ? tracking * size : 0))
  const width = adv.reduce((a, b) => a + b, 0)
  let x = cx - width / 2
  let d = ""
  glyphs.forEach((g, i) => { d += g.getPath(x, y, size).toPathData(2); x += adv[i] })
  return `<path d="${d}" fill="${fill}"/>`
}
const logo = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="${bg}"/>${body}</svg>\n`
const rule = (x, y, w, fill, h = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

const out = {
  "marlowe-mark": logo("#15120f", text(F.fraunces, "M&F", 76, 128, 138, "#d8b878") + rule(88, 158, 80, "#d8b878", 2) + text(F.grotesk, "BARBERS", 17, 128, 188, "#efe6d4", 0.28)),
  "aldous-mark": logo("#0f2a24", text(F.grotesk, "A", 138, 128, 150, "#7ee0b4") + rule(92, 168, 72, "#efeee6", 3) + text(F.grotesk, "MOTOR CO", 17, 128, 196, "#efeee6", 0.24)),
  "northgate-mark": logo("#ff5a36", text(F.bricolage, "NG", 112, 128, 146, "#ffffff", -0.02) + rule(92, 166, 72, "#ffffff", 3) + text(F.bricolage, "HEATING", 17, 128, 194, "#ffffff", 0.24)),
  "hollin-mark": logo("#f6f1e7", text(F.instrument, "Hollin", 82, 128, 138, "#7a2e1f") + rule(96, 156, 64, "#7a2e1f", 2) + text(F.grotesk, "PHYSIOTHERAPY", 13, 128, 184, "#241f1a", 0.24)),
  "pim-mark": logo("#c4482a", text(F.fraunces, "Pim", 92, 128, 144, "#fbefe3") + rule(96, 164, 64, "#fbefe3", 3) + text(F.grotesk, "KITCHEN", 17, 128, 192, "#fbefe3", 0.3)),
  "ada-mark": logo("#1c7a45", text(F.lexend, "Ada", 84, 128, 146, "#ffffff", -0.02) + rule(100, 166, 56, "#ffffff", 3) + text(F.lexend, "MATHS", 17, 128, 194, "#ffffff", 0.3)),
  "forge-mark": logo("#111111", text(F.barlow, "FORGE", 96, 128, 140, "#ff4d1a", 0.02) + rule(84, 158, 88, "#f5f5f0", 3) + text(F.grotesk, "STRENGTH", 16, 128, 186, "#f5f5f0", 0.3)),
}
for (const [name, svg] of Object.entries(out)) writeFileSync(new URL(`../../public/showcase/${name}.svg`, import.meta.url), svg)
console.log(Object.keys(out).length, "logos")

// Lead design examples: compact, outlined wordmarks coordinated with each page.
const wide = (bg, body, width = 240) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="120" viewBox="0 0 ${width} 120"><rect width="${width}" height="120" fill="${bg}"/>${body}</svg>\n`
const lead = {
  'station-road-mark': wide('#1645ff', text(F.grotesk, 'JAY’S', 49, 120, 61, '#ffffff', -.035) + text(F.lexend, 'BARBERS', 16, 120, 91, '#ffffff', .22)),
  'parkside-mark': wide('#080a0e', text(F.grotesk, 'DETAIL', 38, 120, 53, '#bcff3b', -.025) + text(F.grotesk, 'DEPT.', 38, 120, 91, '#ffffff', -.025)),
  'brookfield-mark': wide('#ffffff', text(F.grotesk, 'HARRIS', 40, 120, 55, '#111827', -.03) + rule(37, 70, 166, '#1645ff', 4) + text(F.grotesk, 'CARS', 18, 120, 100, '#111827', .32)),
  'corner-table-mark': wide('#baffeb', text(F.grotesk, 'No. 6', 61, 140, 65, '#061d24', -.045) + text(F.grotesk, 'COFFEE', 17, 140, 98, '#1645ff', .22), 280),
  'oakfield-mark': wide('#1645ff', text(F.grotesk, 'DAN’S', 42, 120, 57, '#ffffff', -.035) + text(F.grotesk, 'HOME REPAIRS', 14, 120, 88, '#ffffff', .09)),
  'rowan-mark': wide('#60e4ff', text(F.grotesk, 'Maths with', 23, 120, 48, '#071b24') + text(F.grotesk, 'Aisha', 46, 120, 93, '#071b24', -.035)),
}
for (const [name, svg] of Object.entries(lead)) { if (/NaN|Infinity/.test(svg)) throw new Error(`Invalid wordmark: ${name}`); writeFileSync(new URL(`../../public/taplo-demo/${name}.svg`, import.meta.url), svg) }
console.log(Object.keys(lead).length, 'lead wordmarks')
