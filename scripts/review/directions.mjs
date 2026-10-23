import { chromium } from "@playwright/test"
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const p=await b.newPage({viewport:{width:1440,height:1800}})
for(const d of ["a","b","c"]){await p.goto(`file:///home/user/taplo/docs/directions/${d}.html`);await p.waitForTimeout(600);await p.screenshot({path:`/home/user/taplo/docs/directions/${d}.png`});console.log(d)}
await b.close()
