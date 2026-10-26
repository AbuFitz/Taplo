import { chromium } from "@playwright/test"
const [sc="barber",look="noir",dark="1",out="docs/screens/r10/fin.png"]=process.argv.slice(2)
const d=dark==="1"
const F={frosted:{cards:{surface:"glass",opacity:d?8:65,radius:"xl",border:"thin",shadow:"soft"},layout:{finish:"frosted",composition:"stack"}},solid:{cards:{surface:"solid",opacity:100,radius:"lg",border:"none",shadow:"soft"},layout:{finish:"solid",composition:"stack"}},flat:{cards:{surface:"transparent",opacity:0,radius:"none",border:"none",shadow:"none"},layout:{finish:"flat",composition:"ledger"},header:{surface:"open"}},grid:{cards:{surface:"solid",opacity:100,radius:"sm",border:"thin",shadow:"none"},layout:{finish:"grid",composition:"bento"}}}
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"})
const names=Object.keys(F)
await Promise.all(names.map(async n=>{const p=await ctx.newPage();await p.goto(`http://localhost:3000/appearance/frame?scenario=${sc}&look=${look}&o=${encodeURIComponent(JSON.stringify(F[n]))}`);await p.waitForTimeout(1500);await p.evaluate(()=>scrollTo(0,420));await p.waitForTimeout(300);await p.screenshot({path:`/tmp/claude-0/lay-${n}.png`});await p.close()}))
await b.close()
