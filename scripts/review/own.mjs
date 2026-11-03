// Every scenario on its own designed example look. Usage: node scripts/review/own.mjs <set> id1,id2,...
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const [set="r10", ids=""] = process.argv.slice(2)
const out=new URL(`../../docs/screens/${set}/own/`, import.meta.url).pathname; mkdirSync(out,{recursive:true})
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const ctx = await b.newContext({ viewport:{width:390,height:844}, reducedMotion:"reduce" })
await Promise.all(ids.split(",").map(async (id)=>{ const p=await ctx.newPage(); await p.goto(`http://localhost:3000/appearance/frame?scenario=${id}`); await p.waitForTimeout(1800); await p.screenshot({path:`${out}${id}.png`}); await p.close() }))
await b.close()
