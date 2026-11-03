// Contact sheet of looks on one scenario. Usage: node scripts/review/looks.mjs <set> <scenario> id1,id2,...
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const [set="r7", scenario="barber", ids="open,showroom,clay,atelier,founder,service,ink,kiln,lune,orchard,personal,forge"] = process.argv.slice(2)
const out=new URL(`../../docs/screens/${set}/looks/`, import.meta.url).pathname; mkdirSync(out,{recursive:true})
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const base=process.env.BASE_URL??"http://localhost:3000"
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1, reducedMotion:"reduce" })
for (const id of ids.split(",")) {
  const p = await ctx.newPage()
  await p.goto(`${base}/appearance/frame?scenario=${scenario}&look=${id}`); await p.waitForTimeout(1400)
  await p.screenshot({ path: `${out}${scenario}-${id}.png` })
  await p.close()
}
await b.close()
