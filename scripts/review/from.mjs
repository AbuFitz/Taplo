import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage()
p.on("pageerror",e=>console.log("ERR",e.message));p.on("console",m=>m.type()==="error"&&console.log("CON",m.text().slice(0,300)));await p.goto("http://localhost:3100/onboarding?from=hollin-physio"); await p.waitForTimeout(2500)
console.log(await p.url(), await p.getByRole("heading",{level:1}).allTextContents())
await p.screenshot({path:"docs/screens/r6/from.png"})
await b.close()
