// Every gallery page as the customer sees it (first screen and a scrolled screen). Usage: node scripts/review/allpages.mjs [scroll]
import { readFileSync, mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const scroll=+(process.argv[2]??0)
const src=readFileSync("src/features/inspiration/showcase-set.ts","utf8")
const items=[...src.matchAll(/\{ scenario: "(\w+)", design: "(\w+)", note: "[^"]*"(, logo: false)?(?:, arrangement: "(\w+)")? \}/g)].map(m=>({sc:m[1],d:m[2],nologo:!!m[3],arr:m[4]}))
mkdirSync("/tmp/claude-0/ap",{recursive:true})
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"})
const run=async(it)=>{const p=await ctx.newPage();await p.goto(`http://localhost:3000/appearance/frame?scenario=${it.sc}&look=${it.d}${it.nologo?"&logo=0":""}${it.arr?`&arr=${it.arr}`:""}`);await p.waitForTimeout(1600);if(scroll)await p.evaluate(y=>scrollTo(0,y),scroll);await p.waitForTimeout(300);await p.screenshot({path:`/tmp/claude-0/ap/${it.sc}-${scroll}.png`});await p.close()}
for(let i=0;i<items.length;i+=8) await Promise.all(items.slice(i,i+8).map(run))
await b.close()
console.log(items.length, items.map(i=>i.sc).join(" "))
