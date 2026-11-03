import { test } from "@playwright/test"
import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"
import { STARTING_LOOKS } from "@/features/page/themes/starting-looks"

/** Review harness: every look at the top and scrolled, on a phone, to check the top edge. TAPLO_SHEET=1 to run. */
test.skip(!process.env.TAPLO_SHEET, "review harness")
test("looks top edge", async ({ page }) => {
  test.setTimeout(600000)
  const OUT = process.env.TAPLO_REVIEW_DIR ?? "/tmp/looks-top"; fs.mkdirSync(OUT, { recursive: true })
  await page.setViewportSize({ width: 390, height: 700 }); await page.emulateMedia({ reducedMotion: "no-preference" })
  const files: string[] = []
  for (const l of STARTING_LOOKS) for (const y of [0, 420]) {
    await page.goto(`/appearance/frame?scenario=barber&design=1&look=${l.design}&colourway=${l.id}`, { waitUntil: "networkidle" })
    await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(400)
    const f = path.join(OUT, `${l.id}-${y}.png`); await page.screenshot({ path: f }); files.push(f)
  }
  const ims = await Promise.all(files.map((f) => sharp(f).resize(195).toBuffer()))
  const h = Math.round(700 * 195 / 390), cols = 6
  await sharp({ create: { width: cols * 201, height: Math.ceil(files.length / cols) * (h + 6), channels: 3, background: "#777" } }).composite(ims.map((b, i) => ({ input: b, left: (i % cols) * 201, top: Math.floor(i / cols) * (h + 6) }))).png().toFile(path.join(OUT, "SHEET.png"))
})
