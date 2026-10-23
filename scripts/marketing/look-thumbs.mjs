// Thumbnails for the look chooser: one real business, every starting look, rendered by the real page renderer.
// 1) BASE_URL=http://localhost:3200 CHROME_PATH=... node scripts/marketing/look-thumbs.mjs
// 2) UPDATE_LOOK_THUMBS=1 npx vitest run src/features/page/look-thumbs.test.ts   (records which version of the looks they show)
// A test fails when a look changes and its thumbnail was not regenerated.
import { readFileSync, mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const base = process.env.BASE_URL ?? "http://localhost:3200"
const out = new URL("../../public/looks/", import.meta.url).pathname
mkdirSync(out, { recursive: true })
const src = readFileSync(new URL("../../src/features/page/themes/looks.ts", import.meta.url), "utf8")
const ids = [...src.matchAll(/^\s{4}id: "([a-z]+)",$/gm)].map((m) => m[1])
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const id of ids) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce" })
  const p = await ctx.newPage()
  await p.goto(`${base}/appearance/frame?scenario=barber&look=${id}`, { waitUntil: "load", timeout: 60000 })
  await p.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(600)
  const buf = await p.screenshot({ type: "png", clip: { x: 0, y: 0, width: 390, height: 540 } })
  const info = await sharp(buf).webp({ quality: 82, effort: 5 }).toFile(`${out}${id}.webp`)
  console.log(id, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB")
  await ctx.close()
}
await b.close()
