import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage()
await p.goto(process.argv[2], { waitUntil: "networkidle" })
console.log(await p.evaluate(() => [...document.querySelectorAll(".tp-collection, .tp-collection *")].map((e) => { const b = e.getBoundingClientRect(); return e.tagName + "." + String(e.className).slice(0, 40) + " L" + Math.round(b.left) + " R" + Math.round(b.right) + " sw" + e.scrollWidth }).slice(0, 14)))
await b.close()
