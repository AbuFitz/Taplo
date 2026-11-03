import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [w,h,t] of [[1440,900,"d"],[390,844,"m"]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce", hasTouch:t==="m", isMobile:t==="m" })).newPage()
  p.on("pageerror",e=>console.log("ERR",e.message.slice(0,200)))
  await p.goto("http://localhost:3000/inspiration"); await p.waitForTimeout(3500)
  await p.screenshot({path:`docs/screens/r9/gallery-${t}.png`})
  await p.getByRole("button",{name:/Marlowe.*open this page/}).click(); await p.waitForTimeout(2500)
  await p.screenshot({path:`docs/screens/r9/gallery-detail-${t}.png`})
  await p.getByRole("link",{name:/Start with the Noir/}).click().catch(()=>{}); await p.waitForTimeout(2500)
  await p.screenshot({path:`docs/screens/r9/gallery-start-${t}.png`})
}
await b.close()
