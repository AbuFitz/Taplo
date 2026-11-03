import { chromium } from "@playwright/test"
const [url, sel, props] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:390,height:900}, reducedMotion:"reduce" })).newPage()
await p.goto(url); await p.waitForTimeout(1500)
console.log(await p.evaluate(([sel,props])=>{const el=document.querySelector(sel);if(!el)return "none";const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return JSON.stringify({rect:[Math.round(r.top),Math.round(r.height)],...Object.fromEntries(props.split(",").map(k=>[k,cs.getPropertyValue(k)]))})},[sel,props]))
await b.close()
