import { chromium } from "@playwright/test"
const [w=390,h=844,design=""]=process.argv.slice(2)
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const p=await (await b.newContext({viewport:{width:+w,height:+h},reducedMotion:"reduce",hasTouch:+w<600,isMobile:+w<600})).newPage()
p.on("pageerror",e=>console.log("ERR",e.message.slice(0,200)))
await p.goto("http://localhost:3000/onboarding"+(design?`?design=${design}`:""));await p.waitForTimeout(2500)
let n=0
for(let i=0;i<14;i++){
  const t=(await p.locator("#step-title").first().textContent().catch(()=>""))||""
  await p.screenshot({path:`docs/screens/r10/old-${w}-${String(n++).padStart(2,"0")}.png`})
  console.log(i,t)
  if(/look|style|design/i.test(t)) { if(process.env.ARR){ await p.getByRole("radio",{name:process.env.ARR}).first().check({force:true}).catch(e=>console.log("arr",e.message.slice(0,80))); } if(process.env.MAT){ await p.getByRole("radio",{name:process.env.MAT}).first().click().catch(e=>console.log("mat",e.message.slice(0,80))) } await p.waitForTimeout(1200); await p.screenshot({path:`docs/screens/r10/old-${w}-final.png`}); break }
  const nm=p.getByLabel(/business name/i); if(await nm.count()&&!(await nm.first().inputValue())) await nm.first().fill("Marlowe & Finch")
  const sr=p.getByPlaceholder(/search/i); if(await sr.count()){ await sr.first().fill("barber"); await p.waitForTimeout(400); await p.getByText("Barber",{exact:true}).first().click().catch(()=>{}) }
  const em=p.getByLabel(/email/i); if(await em.count()&&!(await em.first().inputValue())) await em.first().fill("hello@marlowe.example")
  const ph=p.locator("input[type=tel],input[name*=phone]"); if(await ph.count()&&!(await ph.first().inputValue())) await ph.first().fill("07700900123")
  const c=p.getByRole("button",{name:/^(Continue|Next)/}).first(); if(!(await c.count())) break
  await c.click(); await p.waitForTimeout(900)
}
await b.close()
