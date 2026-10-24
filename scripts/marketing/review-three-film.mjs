import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('../../',import.meta.url)), film=resolve(root,'marketing/film'), out=process.env.THREE_REVIEW_DIR ?? resolve(root,'.cache/three-review')
await mkdir(out,{recursive:true})
const mime={'.html':'text/html','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'}
const server=createServer(async(req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/,''),vendor=rel.startsWith('vendor/')&&['three.module.js','three.core.js'].includes(rel.split('/')[1]),p=vendor?resolve(root,'node_modules/three/build',rel.split('/')[1]):resolve(film,rel);if(!vendor&&!p.startsWith(film+sep)){res.writeHead(403).end();return}try{const bytes=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]??'application/octet-stream'}).end(bytes)}catch{res.writeHead(404).end()}})
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']})
try {for(const [name,width,height] of [['landscape',1920,1080],['portrait',1080,1920]]){const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',e=>{throw e});await page.goto(`${origin}/three-${name}.html`,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__threeReady===true);for(const t of [1,4.5,8,12,16]){await page.evaluate(t=>window.__timelines.main.seek(t),t);await page.screenshot({path:resolve(out,`${name}-${t}.png`)});}console.log(`${name}: five authored 3D scenes rendered`);await page.close()}} finally {await browser.close();server.close()}
