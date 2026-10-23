// One-off captures: node scripts/review/shot.mjs <name> <path> <w> <h> [scrollY|full]
import { chromium } from "@playwright/test"
const [name, path, w, h, mode] = process.argv.slice(2)
const base = process.env.BASE_URL ?? "http://localhost:3000"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const c = await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: "no-preference", deviceScaleFactor: +(process.env.DSF ?? 1) }); const p = await c.newPage()
await p.goto(base + path, { waitUntil: "load" }); await p.waitForLoadState("networkidle").catch(() => {}); await p.waitForTimeout(1500)
if (mode && mode !== "full") { await p.evaluate((y) => window.scrollTo(0, +y), mode); await p.waitForTimeout(900) }
await p.screenshot({ path: `/home/user/taplo/docs/screens/r4/${name}.png`, fullPage: mode === "full" })
await b.close()
