// Dev helper: node scripts/shot.mjs <url> <out.png> [width] [height] [full]
import { chromium } from "@playwright/test"
const [url, out, w = "1280", h = "900", full] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" })).newPage()
await p.goto(url, { waitUntil: "load", timeout: 90000 })
await p.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {})
await p.evaluate(() => document.fonts.ready)
if (full === "full") { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) } window.scrollTo(0, 0) }); await p.waitForTimeout(800) }
await p.waitForTimeout(600)
await p.screenshot({ path: out, fullPage: full === "full" })
await b.close()
