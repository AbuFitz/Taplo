// Dev helper: node scripts/shot.mjs <url> <out.png> [width] [height] [full]
import { chromium } from "@playwright/test"
const [url, out, w = "1280", h = "900", full] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" })).newPage()
await p.goto(url, { waitUntil: "load", timeout: 90000 })
await p.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {})
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600)
await p.screenshot({ path: out, fullPage: full === "full" })
await b.close()
