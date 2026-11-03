import { chromium } from "playwright"
const b = await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"})
const p = await b.newPage({viewport:{width:390,height:844}})
const pairs=[["barber","terra","sand"],["builder","marine","forest"],["barber","noir","mono"],["florist","bloom","sage"]]
const sc = await (async()=>{return null})()
for (const [s,d,c] of pairs){ await p.goto(`http://localhost:3100/appearance/frame?scenario=${s}&design=1&look=${d}&colourway=${c}`,{waitUntil:"networkidle"}); await p.waitForTimeout(600); await p.screenshot({path:`/tmp/w-${s}-${c}.png`,fullPage:true}) }
await b.close()
