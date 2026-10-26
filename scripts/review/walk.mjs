// Walk the complete setup and snapshot every screen. Usage: node scripts/review/walk.mjs <set> <w> <h> "<Category>"
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const [set="r7", W="1280", H="900", cat="Barber"] = process.argv.slice(2)
const w=Number(W), mobile=w<600
const out=new URL(`../../docs/screens/${set}/walk/`, import.meta.url).pathname; mkdirSync(out,{recursive:true})
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:w,height:Number(H)}, hasTouch:mobile, isMobile:mobile, reducedMotion:"reduce" })).newPage()
const base=process.env.BASE_URL??"http://localhost:3000"
let n=0; const tag=`${cat.toLowerCase().replace(/\W+/g,"-")}-${mobile?"m":"d"}`
const snap=async(t)=>{await p.waitForTimeout(700);await p.screenshot({path:`${out}${tag}-${String(++n).padStart(2,"0")}-${t}.png`})}
await p.goto(base+"/onboarding"); await p.evaluate(()=>localStorage.clear()); await p.reload()
const C=async()=>{await p.getByRole("button",{name:/^(Continue|Next)$/}).first().click()}
await p.getByLabel(/Business name/).fill(process.env.NAME??"North Street Barbers"); await snap("business"); await C()
for(let i=0;i<14;i++){
  await p.waitForTimeout(500)
  const h=((await p.getByRole("heading",{level:1}).first().textContent().catch(()=>""))??"").trim()
  await snap(h.slice(0,24).replace(/\W+/g,"-")||"step")
  const catBtn=p.getByRole("button",{name:cat,exact:true}); if(await catBtn.count()) await catBtn.first().click().catch(()=>{})
  const email=p.locator("input[type=email]"); if(await email.count() && await email.first().isVisible()) await email.first().fill("owner@example.com")
  const skip=p.getByRole("button",{name:"Skip for now",exact:true}); 
  const next=p.getByRole("button",{name:/^(Continue|Next)$/})
  if(!(await next.count())) break
  if(await skip.count()) { await skip.first().click() } else await next.first().click()
}
await b.close()
