import { chromium } from "@playwright/test"
const [W="1280",H="900",plan="Core"] = process.argv.slice(2)
const w=Number(W), mobile=w<600
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:w,height:Number(H)}, hasTouch:mobile, isMobile:mobile })).newPage()
const base=process.env.BASE_URL??"http://localhost:3100"
await p.goto(base+"/onboarding"); await p.evaluate(()=>localStorage.clear()); await p.reload()
const C=()=>p.getByRole("button",{name:"Continue",exact:true}).click()
await p.getByLabel("Business name",{exact:true}).fill("North Street Barbers"); await C(); if(mobile){await p.waitForTimeout(400); await C()}
await p.getByRole("button",{name:"Barber",exact:true}).click(); await C()
if(mobile){await p.waitForTimeout(300); await C()}
await p.getByLabel("Email",{exact:true}).fill("owner@example.com"); await C()
await p.getByRole("button",{name:"Skip for now",exact:true}).click(); await C()
await p.waitForTimeout(800)
const r=p.getByRole("radio",{name:`Choose ${plan}`,exact:true}); if(await r.count()) await r.check()
await p.waitForTimeout(1500); await p.screenshot({path:`docs/screens/r6/plan-${plan}-${mobile?"m":"d"}.png`})
console.log(await p.getByRole("heading",{level:1}).textContent())
await b.close()
