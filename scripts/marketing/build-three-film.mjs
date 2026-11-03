/** Prepare local-only textures/fonts and authored format canvases. Three.js stays a production tool, not an app dependency. */
import { copyFileSync, writeFileSync, mkdirSync } from 'node:fs'
const root = new URL('../../', import.meta.url)
const file = p => new URL(p, root).pathname
mkdirSync(file('marketing/film/assets/three'), { recursive: true })
for (const [from, to] of [
  ['public/marketing/ex-station-road-barbers-phone.webp', 'station.webp'],
  ['public/marketing/ex-parkside-valeting-phone.webp', 'detailer.webp'],
  ['public/marketing/ex-brookfield-motors-phone.webp', 'dealer.webp'],
  ['public/marketing/ex-brookfield-motors-desk.webp', 'desktop.webp'],
  ['public/marketing/story-3-time.webp', 'booking.webp'],
]) copyFileSync(file(from), file('marketing/film/assets/three/' + to))
copyFileSync(file('node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'), file('marketing/film/assets/three/display.woff2'))
copyFileSync(file('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'), file('marketing/film/assets/three/body.woff2'))
for (const [from, to] of [["node_modules/@fontsource-variable/space-grotesk/LICENSE","DISPLAY-LICENSE.txt"],["node_modules/@fontsource-variable/inter/LICENSE","BODY-LICENSE.txt"],["node_modules/three/LICENSE","THREE-LICENSE.txt"]]) copyFileSync(file(from),file("marketing/film/assets/three/"+to))
for (const [name, width, height, duration] of [['landscape',1920,1080,18],['portrait',1080,1920,18],['square',1080,1080,18],['feed',1080,1350,20]]) {
  writeFileSync(file(`marketing/film/three-${name}.html`), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Taplo — Business pages, ${name} 3D film</title><style>
@font-face{font-family:Display;src:url(assets/three/display.woff2);font-weight:300 700}@font-face{font-family:Body;src:url(assets/three/body.woff2);font-weight:100 900}*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#080808;color:white}canvas{position:absolute;inset:0}#words{position:absolute;z-index:2;left:6%;top:22%;width:39%;font-family:Display,sans-serif}#eyebrow{font:600 20px Body,sans-serif;color:#ffffff;letter-spacing:3px;text-transform:uppercase;margin:0 0 26px}h1{font-size:106px;line-height:.98;letter-spacing:-6px;font-weight:600;margin:0;white-space:pre-line}#line{font:400 28px/1.4 Body,sans-serif;color:#b7b7b7;max-width:560px;margin-top:28px}#brand{position:absolute;left:6%;top:7%;width:170px;z-index:3}#note{position:absolute;bottom:4%;left:6%;font:400 16px Body,sans-serif;color:#a4a4a4;z-index:3}.portrait #words{left:8%;top:8%;width:84%}.portrait h1{font-size:116px}.portrait #eyebrow{font-size:22px}.portrait #line{font-size:31px;max-width:860px}.portrait #brand{top:4%;width:150px}.portrait #note{left:8%;bottom:3%;font-size:20px}.square #words{top:10%;width:83%;left:7%}.square h1{font-size:84px;letter-spacing:-4px}.square #eyebrow{font-size:17px;margin-bottom:20px}.square #line{font-size:24px;margin-top:20px}.square #brand{display:none}.feed #words{top:8%;left:8%;width:84%}.feed h1{font-size:94px;letter-spacing:-4px}.feed #line{font-size:26px;max-width:850px}.feed #brand{display:none}
</style></head><body class="${name}" data-duration="${duration}" data-width="${width}" data-height="${height}"><canvas id="stage"></canvas><img id="brand" src="assets/taplo-white.svg" alt="Taplo"><div id="words"><p id="eyebrow"></p><h1></h1><p id="line"></p></div><p id="note">Services · Bookings · Stock</p><script type="module" src="assets/three-scene.js"></script></body></html>`)
}
