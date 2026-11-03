import { chromium } from "@playwright/test"
const [url,out,w=1440,h=900]=process.argv.slice(2)
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const p=await (await b.newContext({viewport:{width:+w,height:+h},reducedMotion:"reduce"})).newPage()
p.on("console",m=>{if(m.type()==="error"||m.type()==="warning")console.log(m.type(),m.text().slice(0,300))})
p.on("pageerror",e=>console.log("ERR",e.message.slice(0,300)))
await p.goto(url);await p.waitForTimeout(2500)
const H=await p.evaluate(()=>document.documentElement.scrollHeight)
for(let y=0;y<H;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(250)}
await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(800)
await p.screenshot({path:out,fullPage:true});await b.close()
