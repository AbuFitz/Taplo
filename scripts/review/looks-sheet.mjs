// All starting looks side by side on one business: node scripts/review/looks-sheet.mjs out.png [scenario] [height]
import { chromium } from "@playwright/test"
import sharp from "sharp"
const [out = "/tmp/looks.png", scenario = "barber", h = "700"] = process.argv.slice(2)
const base = process.env.BASE_URL ?? "http://localhost:3200"
const ids = ["clean", "night", "colour", "photo", "showroom", "journal", "clay", "forge", "orchard"]
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const bufs = []
for (const id of ids) {
  const p = await (await b.newContext({ viewport: { width: 390, height: +h }, reducedMotion: "reduce" })).newPage()
  await p.goto(`${base}/appearance/frame?scenario=${scenario}&look=${id}`, { waitUntil: "networkidle" })
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500)
  bufs.push(await p.screenshot())
  await p.close()
}
await b.close()
await sharp({ create: { width: 410 * ids.length, height: +h, channels: 3, background: "#888" } }).composite(bufs.map((input, i) => ({ input, left: i * 410, top: 0 }))).png().toFile(out)
