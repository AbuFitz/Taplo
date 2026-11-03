import { chromium } from "@playwright/test"
const base = process.env.BASE_URL ?? "http://localhost:3000"
const out = new URL("../../docs/screens/r6/", import.meta.url).pathname
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
for (const [w,h,t] of [[1440,900,"d"],[390,844,"m"]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h}, hasTouch:t==="m", isMobile:t==="m" })).newPage()
  await p.goto(base+"/"); await p.waitForTimeout(1500)
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior="auto";document.querySelector(".home-presence").scrollIntoView({block:"start"});window.scrollBy(0,-60)}); await p.waitForTimeout(250)
  await p.screenshot({ path: `${out}fx-mid-${t}.png` })        // mid-transition
  await p.waitForTimeout(1600)
  await p.screenshot({ path: `${out}fx-done-${t}.png` })
  const y0 = await p.evaluate(()=>scrollY)
  await p.getByRole("link",{name:"Taplo home"}).first().click(); await p.waitForTimeout(1500)
  console.log(t, "scrolled from", y0, "to", await p.evaluate(()=>scrollY), "attr", await p.evaluate(()=>document.documentElement.getAttribute("data-fx")))
}
await b.close()
