import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true })).newPage()
await p.goto("http://localhost:3000/"); await p.waitForTimeout(1500)
await p.evaluate(()=>{document.documentElement.style.scrollBehavior="auto";document.querySelector(".home-presence").scrollIntoView({block:"start"});window.scrollBy(0,-60)}); await p.waitForTimeout(2500)
console.log(await p.evaluate(()=>[...document.querySelectorAll(".presence-list li")].map(l=>[l.getAttribute("data-reveal"),l.hasAttribute("data-in"),Math.round(l.getBoundingClientRect().top),getComputedStyle(l).opacity])))
await b.close()
