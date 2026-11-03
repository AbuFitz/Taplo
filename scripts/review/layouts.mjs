// Header layouts side by side. Usage: node scripts/review/layouts.mjs <scenario> <look> out.png
import { chromium } from "@playwright/test"
const [sc="barber",look="noir",out="docs/screens/r10/layouts.png"]=process.argv.slice(2)
const L=["melt","cutout","split","bento","type"]
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const ctx=await b.newContext({viewport:{width:390,height:700},reducedMotion:"reduce"})
const shots=await Promise.all(L.map(async l=>{const p=await ctx.newPage();await p.goto(`http://localhost:3000/appearance/frame?scenario=${sc}&look=${look}&o=${encodeURIComponent(JSON.stringify({header:{layout:l}}))}`);await p.waitForTimeout(1500);const f=`/tmp/claude-0/lay-${l}.png`;await p.screenshot({path:f});await p.close();return f}))
await b.close()
import("node:child_process").then(({execSync})=>execSync(`python3 scripts/review/hsheet.py ${L.join(",")} ${out}`))
