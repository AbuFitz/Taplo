import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" })).newPage()
await p.goto("http://localhost:3000/inspiration"); await p.waitForTimeout(3500)
console.log(await p.evaluate(()=>[...document.querySelectorAll(".tp-bg-gradient")].slice(0,6).map(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return [cs.position,Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height),cs.zIndex]})))
console.log(await p.evaluate(()=>{const e=document.querySelector(".sf-thumb-inner");const cs=getComputedStyle(e);return [cs.transform,cs.contain,cs.position]}))
await b.close()
