import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:1280,height:900}, reducedMotion:"reduce" })).newPage()
p.on("console",m=>{ if(["error","warning"].includes(m.type())) console.log(m.type().toUpperCase(), m.text().slice(0,400)) })
p.on("pageerror",e=>console.log("PAGEERROR",e.message.slice(0,300)))
await p.goto("http://localhost:3000/onboarding"); await p.evaluate(()=>localStorage.clear()); await p.reload()
await p.getByLabel(/Business name/).fill("North Street Barbers")
for (let i=0;i<5;i++){ await p.getByRole("button",{name:/^Continue$/}).click(); await p.waitForTimeout(500); const c=p.getByRole("button",{name:"Barber",exact:true}); if(await c.count()) await c.first().click(); const e=p.locator("input[type=email]"); if(await e.count()&&await e.first().isVisible()) await e.first().fill("o@example.com") }
await p.waitForTimeout(3000)
await b.close()
