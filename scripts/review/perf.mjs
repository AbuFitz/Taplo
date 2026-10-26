import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const rm of ["no-preference","reduce"]) {
  const p = await (await b.newContext({ viewport:{width:1440,height:900}, reducedMotion: rm })).newPage()
  await p.goto("http://localhost:3100/onboarding"); await p.waitForTimeout(1500)
  const t=Date.now(); await p.getByLabel("Business name",{exact:true}).fill("North Studio"); await p.getByRole("button",{name:"Continue",exact:true}).click()
  await p.getByLabel("Search businesses",{exact:true}).fill("Barber", {timeout:20000}).catch(e=>console.log("fill failed"))
  console.log(rm, Date.now()-t, "ms")
}
await b.close()
