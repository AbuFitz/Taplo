import { chromium } from "@playwright/test"
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:"reduce"})
const p=await ctx.newPage()
await p.goto("http://localhost:3000/onboarding");await p.waitForTimeout(1500)
for(let i=0;i<16;i++){
  const t=(await p.locator("#step-title").first().textContent().catch(()=>""))||""
  if(/ready/i.test(t)) break
  const nm=p.getByLabel(/business name/i); if(await nm.count()&&!(await nm.first().inputValue())) await nm.first().fill("Marlowe & Finch")
  const sr=p.getByPlaceholder(/search/i); if(await sr.count()){ await sr.first().fill("barber"); await p.waitForTimeout(300); await p.getByText("Barber",{exact:true}).first().click().catch(()=>{}) }
  const em=p.getByLabel(/email/i).first(); if(await em.count()&&await em.isVisible().catch(()=>false)&&!(await em.inputValue().catch(()=>"x"))) await em.fill("hello@marlowe.example")
  const sv=p.getByLabel(/Service 1 name/i); if(await sv.count()&&!(await sv.inputValue())){await sv.fill("Skin fade");await p.getByLabel(/Service 1 price/i).fill("28")}
  const c=p.getByRole("button",{name:/^(Continue|Next)/}).first(); if(!(await c.count())) break
  await c.click(); await p.waitForTimeout(700)
}
await p.goto("http://localhost:3000/dashboard/page");await p.waitForTimeout(2000)
await p.getByRole("tab",{name:/Design/}).or(p.getByText("Design",{exact:true}).first()).first().click();await p.waitForTimeout(800)
await p.screenshot({path:"docs/screens/r10/dash-design.png"})
await p.getByText("Profile",{exact:true}).first().click();await p.waitForTimeout(800)
await p.screenshot({path:"docs/screens/r10/dash-profile.png"})
await b.close()
