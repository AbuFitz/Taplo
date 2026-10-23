import { chromium } from "@playwright/test"
const [url, w = "390"] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: +w, height: 800 } })).newPage()
await p.goto(url, { waitUntil: "networkidle" })
console.log(await p.evaluate((w) => { const r = []; document.querySelectorAll("*").forEach((e) => { const b = e.getBoundingClientRect(); if (b.right > w + 1 && !e.closest(".tp-collection-track")) r.push(e.tagName + "." + (e.className?.toString?.().slice(0, 60)) + " " + Math.round(b.right)) }); return [document.documentElement.scrollWidth, ...r.slice(0, 8)] }, +w))
await b.close()
