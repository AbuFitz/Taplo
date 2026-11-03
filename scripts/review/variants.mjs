import { chromium } from "@playwright/test"
const [sc="barber",look="noir",w="serviceList",vs="list,cards,tiles,compact,spotlight",out="docs/screens/r10/variants.png"]=process.argv.slice(2)
const L=vs.split(",")
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:390,height:700},reducedMotion:"reduce"})
await Promise.all(L.map(async v=>{const p=await ctx.newPage();await p.goto(`http://localhost:3000/appearance/frame?scenario=${sc}&look=${look}&widget=${w}&variant=${v}`);await p.waitForTimeout(1500);await p.screenshot({path:`/tmp/claude-0/lay-${v}.png`});await p.close()}))
await b.close()
