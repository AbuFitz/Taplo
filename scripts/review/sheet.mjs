// Contact sheet of workbench screenshots at 1x: node scripts/review/sheet.mjs out.png id1 id2 ...
import sharp from "sharp"
const [out, ...ids] = process.argv.slice(2)
const dir = new URL("../../docs/screens/workbench/", import.meta.url).pathname
const imgs = await Promise.all(ids.map(async (id) => { const b = await sharp(dir + id + ".png").png().toBuffer(); const m = await sharp(b).metadata(); return { b, w: m.width, h: m.height } }))
const H = Math.max(...imgs.map((i) => i.h))
let x = 0
const comps = imgs.map((i) => { const c = { input: i.b, left: x, top: 0 }; x += i.w + 20; return c })
await sharp({ create: { width: x, height: H, channels: 3, background: "#9a9a9a" } }).composite(comps).png().toFile(out)
console.log(x, H)
