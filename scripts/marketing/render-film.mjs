/** Deterministic local fallback renderer for the authored GSAP compositions.
 * Captures the explicit full canvas, avoiding the observed 88px clipping in the local HyperFrames export wrapper.
 * No model calls, accounts or network assets. Playwright and FFmpeg only. */
import { chromium } from "@playwright/test"
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { resolve, extname, sep } from "node:path"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { fileURLToPath } from "node:url"
const projectRoot = fileURLToPath(new URL("../../", import.meta.url))
const filmRoot = resolve(projectRoot, "marketing/film")
const mime = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" }
const server = createServer(async (req,res) => {
  const relative = decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/^\/+/, "")
  const path = resolve(filmRoot, relative || "index.html")
  if (!path.startsWith(filmRoot + sep)) { res.writeHead(403).end(); return }
  try { const bytes = await readFile(path); res.writeHead(200, { "Content-Type": mime[extname(path)] ?? "application/octet-stream" }); res.end(bytes) } catch { res.writeHead(404).end() }
})
await new Promise(r => server.listen(0, "127.0.0.1", r))
const origin = `http://127.0.0.1:${server.address().port}`
let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? process.env.HYPERFRAMES_BROWSER_PATH })
  for (const [file, name, width, height] of [["index.html", "taplo-intro", 1920, 1080], ["formats/portrait/index.html", "taplo-portrait", 1080, 1920], ["formats/square/index.html", "taplo-square", 1080, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    const errors = []
    page.on("pageerror", err => errors.push(err.message))
    page.on("response", r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
    await page.goto(`${origin}/${file}`, { waitUntil: "networkidle" })
    await page.evaluate(async () => { await document.fonts.ready; if(!document.fonts.check('700 50px Display') || !document.fonts.check('400 24px Body')) throw new Error('Film fonts not ready') })
    const encoder = spawn(process.env.HYPERFRAMES_FFMPEG_PATH ?? "ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-vcodec", "mjpeg", "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", resolve(projectRoot, `public/marketing/film/${name}.mp4`)], { stdio: ["pipe", "ignore", "pipe"] })
    let encodingErrors = ""
    encoder.stderr.on("data", b => { encodingErrors += b.toString() })
    const completion = new Promise((ok,fail) => { encoder.once("error",fail);encoder.once("close",code=>code===0?ok():fail(new Error(encodingErrors))) })
    // Attach immediately so a failed encoder never produces an unhandled rejection while frames are being captured.
    completion.catch(() => {})
    for(let frame=0; frame<540; frame++) {
      await page.evaluate(t => { window.__timelines.main.seek(t, false) }, frame/30)
      const bytes = await page.screenshot({ type:"jpeg", quality:95, clip:{ x:0, y:0, width, height }, animations:"allow" })
      if (!encoder.stdin.write(bytes)) await once(encoder.stdin, "drain")
      if(frame % 180 === 0) console.log(`${name}: ${frame}/540 frames`)
    }
    encoder.stdin.end()
    await completion
    await page.close()
    if(errors.length) throw new Error(errors.join("\n"))
    console.log(`${name}: ${width}×${height}, 540 frames encoded`)
  }
} finally { await browser?.close();server.close() }
