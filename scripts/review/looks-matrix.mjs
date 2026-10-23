// Every look on several businesses, at phone width, as one contact sheet per business: node scripts/review/looks-matrix.mjs <out-dir>
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
const base = process.env.BASE_URL ?? "http://localhost:3200"
const out = process.argv[2] ?? "/tmp/looks"
mkdirSync(out, { recursive: true })
const looks = ["clean", "night", "colour", "photo", "showroom", "journal", "clay", "forge", "orchard"]
const scenarios = (process.env.SCENARIOS ?? "barber,physio,cafe,tutor,gym,trades,dealer").split(",")
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const sc of scenarios) {
  const tiles = []
  for (const l of looks) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 1100 }, reducedMotion: "reduce", deviceScaleFactor: 1 })
    const p = await ctx.newPage()
    await p.goto(`${base}/appearance/frame?scenario=${sc}&look=${l}`, { waitUntil: "load" }); await p.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {}); await p.waitForTimeout(500)
    tiles.push(await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 1100 } })); await ctx.close()
  }
  await sharp({ create: { width: 390 * 9 + 8 * 9, height: 1100, channels: 3, background: "#888" } }).composite(tiles.map((t, i) => ({ input: t, left: i * 398, top: 0 }))).png().toFile(`${out}/${sc}.png`)
  console.log("ok", sc)
}
await b.close()
