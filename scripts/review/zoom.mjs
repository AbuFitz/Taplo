import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:1280,height:900}, reducedMotion:"reduce" })).newPage()
await p.goto("http://localhost:3000/onboarding"); await p.evaluate(()=>localStorage.clear()); await p.reload()
await p.getByLabel("Business name",{exact:true}).fill("North Street Barbers"); await p.waitForTimeout(600)
const out="docs/screens/r6/"
await p.screenshot({path:out+"zoom-base.png"})
await p.getByRole("button",{name:/Zoom out/}).click(); await p.waitForTimeout(900); await p.screenshot({path:out+"zoom-out.png"})
await p.getByRole("button",{name:/Zoom in/}).click(); await p.getByRole("button",{name:/Zoom in/}).click(); await p.waitForTimeout(1200); await p.screenshot({path:out+"zoom-in.png"})
await b.close()
