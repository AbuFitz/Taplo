import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const out = "/home/user/taplo/docs/screens/r3-before/"
for (const [n,u,w,h] of [["home-full-1440","/",1440,900],["home-full-390","/",390,844],["gallery-full-1440","/inspiration",1440,900],["product-full-1440","/product",1440,900],["pricing-full-1440","/pricing",1440,900]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce" }); const p = await c.newPage()
  await p.goto("http://localhost:3100"+u,{waitUntil:"load"}); await p.waitForTimeout(1500)
  // force reveal elements visible
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))} window.scrollTo(0,0)})
  await p.waitForTimeout(500)
  await p.screenshot({path:out+n+".png",fullPage:true}); console.log(n)
  await c.close()
}
await b.close()
