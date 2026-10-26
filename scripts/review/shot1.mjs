import { chromium } from "@playwright/test"
const [url,out,w=1366,h=768]=process.argv.slice(2)
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const p=await (await b.newContext({viewport:{width:+w,height:+h},reducedMotion:"reduce"})).newPage()
await p.goto(url);await p.waitForTimeout(3000);await p.screenshot({path:out});await b.close()
