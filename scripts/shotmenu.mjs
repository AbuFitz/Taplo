import { chromium } from "@playwright/test"
const [url, out, which = "Product", w = "1280"] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport: { width: +w, height: 760 }, reducedMotion: "reduce" })).newPage()
await p.goto(url, { waitUntil: "networkidle" })
if (+w >= 768) await p.getByRole("button", { name: which }).click()
else { await p.getByRole("button", { name: "Menu" }).click(); await p.getByRole("navigation", { name: "Menu" }).getByText(which, { exact: true }).click() }
await p.waitForTimeout(500)
await p.screenshot({ path: out })
await b.close()
