// Every example as designed, on a computer and on a phone: node scripts/review/examples-sheet.mjs <out-dir>
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
const base = process.env.BASE_URL ?? "http://localhost:3200"
const out = process.argv[2] ?? "/tmp/examples"
mkdirSync(out, { recursive: true })
const scenarios = ["barber", "physio", "cafe", "tutor", "gym", "trades", "dealer"]
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [name, vp] of [["desk", { width: 1280, height: 860 }], ["phone", { width: 390, height: 1100 }]]) {
  const tiles = []
  for (const sc of scenarios) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: "reduce" })
    const p = await ctx.newPage()
    await p.goto(`${base}/appearance/frame?scenario=${sc}`, { waitUntil: "load" }); await p.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(700)
    const buf = await p.screenshot(); tiles.push(buf); await sharp(buf).toFile(`${out}/${sc}-${name}.png`); await ctx.close()
  }
  console.log("ok", name)
}
await b.close()
