// Completes setup, then screenshots dashboard pages. Usage: node scripts/review/dash.mjs w h
import { chromium } from "@playwright/test"
const [w=1440,h=900]=process.argv.slice(2)
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:+w,height:+h},reducedMotion:"reduce"})
const p=await ctx.newPage()
p.on("pageerror",e=>console.log("ERR",e.message.slice(0,160)))
await p.goto("http://localhost:3000/onboarding");await p.waitForTimeout(2000)
for(let i=0;i<16;i++){
  const t=(await p.locator("#step-title").first().textContent().catch(()=>""))||""
  if(/ready/i.test(t)) break
  const nm=p.getByLabel(/business name/i); if(await nm.count()&&!(await nm.first().inputValue())) await nm.first().fill("Marlowe & Finch")
  const sr=p.getByPlaceholder(/search/i); if(await sr.count()){ await sr.first().fill("barber"); await p.waitForTimeout(300); await p.getByText("Barber",{exact:true}).first().click().catch(()=>{}) }
  const em=p.getByLabel(/email/i).first(); if(await em.count()&&await em.isVisible().catch(()=>false)&&!(await em.inputValue().catch(()=>"x"))) await em.fill("hello@marlowe.example")
  const ph=p.locator("input[type=tel]").first(); if(await ph.count()&&await ph.isVisible().catch(()=>false)&&!(await ph.inputValue().catch(()=>"x"))) await ph.fill("07700900123")
  const sv=p.getByLabel(/Service 1 name/i); if(await sv.count()&&!(await sv.inputValue())){await sv.fill("Skin fade");await p.getByLabel(/Service 1 price/i).fill("28")}
  const c=p.getByRole("button",{name:/^(Continue|Next)/}).first(); if(!(await c.count())) break
  await c.click(); await p.waitForTimeout(800)
}
await p.screenshot({path:"docs/screens/r10/dash-finish.png"})
const go=p.getByRole("button",{name:/dashboard/i}).first(); if(await go.count()) await go.click(); await p.waitForTimeout(3000)
console.log(p.url())
for(const [path,name] of [["/dashboard","home"],["/dashboard/page","page"],["/dashboard/bookings","bookings"],["/dashboard/services","services"]]){await p.goto("http://localhost:3000"+path);await p.waitForTimeout(2500);await p.screenshot({path:`docs/screens/r10/dash-${name}-${w}.png`})}
await b.close()
