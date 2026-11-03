import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [w,h,t] of [[1280,900,"d"],[390,844,"m"]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h}, hasTouch:t==="m", isMobile:t==="m" })).newPage()
  await p.goto("http://localhost:3000/"); await p.waitForTimeout(1500)
  const el = p.locator(".home-presence"); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500)
  if (t==="d") await p.locator(".presence-list li").nth(1).hover()
  await p.waitForTimeout(800)
  await el.screenshot({ path:`/home/user/taplo/docs/screens/r5/presence-${t}.png` })
  const pl = p.locator(".home-plans"); await pl.scrollIntoViewIfNeeded()
  await p.evaluate(()=>window.scrollBy(0,-300)); await p.waitForTimeout(600)
  await p.screenshot({ path:`/home/user/taplo/docs/screens/r5/plans-seam-${t}.png` })
}
await b.close()
