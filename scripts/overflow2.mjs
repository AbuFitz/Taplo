import { chromium } from "@playwright/test"
const [url] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage()
await p.goto(url, { waitUntil: "networkidle" })
console.log(await p.evaluate(() => { const out = []; const test = (sel) => { document.querySelectorAll(sel).forEach((e) => { e.style.display = "none" }); out.push(sel + " -> " + document.documentElement.scrollWidth) }; const base = document.documentElement.scrollWidth; for (const s of [".tp-collection", ".tp-hours", "[class*=tp-decor]", ".tp-header", ".tp-avatar"]) test(s); return [base, ...out] }))
await b.close()
