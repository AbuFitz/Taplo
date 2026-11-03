// Usage: node scripts/critic/capture.mjs <outDir> <url>[=name] ...
// Captures each URL at 390x844 and 1440x900 for the visual critic.
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"
const [out, ...pages] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ["--no-sandbox"] })
for (const [w, h, tag] of [[390, 844, "m"], [1440, 900, "d"]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage()
  for (const spec of pages) {
    const [url, name = new URL(url).pathname.replace(/\W+/g, "-")] = spec.split("=")
    await page.goto(url, { waitUntil: "networkidle" }).catch(() => {})
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/${name}-${tag}.png` })
  }
}
await browser.close()
