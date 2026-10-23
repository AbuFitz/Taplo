import { chromium } from "@playwright/test"
const base=process.env.BASE_URL??"http://localhost:3000"
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
for (const [n,w,h] of [["home-1440",1440,900],["home-390",390,844]]) {
  const c=await b.newContext({viewport:{width:w,height:h},reducedMotion:"reduce"});const p=await c.newPage()
  await p.goto(base+"/",{waitUntil:"load"});await p.waitForTimeout(2500)
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100))}window.scrollTo(0,0)})
  await p.waitForTimeout(800)
  await p.screenshot({path:`/home/user/taplo/docs/screens/r3/${n}-full.png`,fullPage:true});console.log(n)
  await c.close()
}
await b.close()
