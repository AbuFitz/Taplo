import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const out = new URL("../../docs/screens/r5/popups/", import.meta.url).pathname; mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [w,h,t] of [[1280,900,"d"],[390,844,"m"]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h}, hasTouch:t==="m", isMobile:t==="m" })).newPage()
  await p.goto((process.env.BASE_URL ?? "http://localhost:3000")+"/appearance/frame?scenario=barber&look=night"); await p.waitForTimeout(1500)
  await p.getByRole("button",{name:/Book your chair/}).first().click(); await p.waitForTimeout(900)
  await p.screenshot({ path: `${out}book-${t}.png` }); await p.keyboard.press("Escape"); await p.waitForTimeout(500)
  await p.getByRole("button",{name:"Share page",exact:true}).scrollIntoViewIfNeeded()
  await p.screenshot({ path: `${out}footer-${t}.png` })
  await p.getByRole("button",{name:"Share page",exact:true}).click(); await p.waitForTimeout(900)
  await p.screenshot({ path: `${out}share-${t}.png` })
}
await b.close()
