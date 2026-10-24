import { createHash } from "node:crypto"
// Captures real Taplo renderer output for marketing. Build-time only: nothing here ships in the app bundle.
// Usage: BASE_URL=http://localhost:3100 node scripts/marketing/capture.mjs [jobId ...]
import { readFileSync, mkdirSync, writeFileSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const cfg = JSON.parse(readFileSync(new URL("../../marketing/captures.json", import.meta.url), "utf8"))
const base = process.env.BASE_URL ?? cfg.base
const only = process.argv.slice(2)
for (const id of only) if (!cfg.jobs.some((j) => j.id === id)) throw new Error(`Unknown capture: ${id}`)
const out = new URL("../../public/marketing/", import.meta.url).pathname
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const manifest = {}
for (const job of cfg.jobs.filter((j) => !only.length || only.includes(j.id))) {
  const [w, h] = job.viewport
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: job.dsf ?? cfg.dsf, reducedMotion: "reduce" })
  const page = await ctx.newPage()
  const url = base + job.url + (job.overrides ? `&o=${encodeURIComponent(JSON.stringify(job.overrides))}` : "")
  await page.goto(url, { waitUntil: "load", timeout: 45000 })
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(async () => { // lazy images below the fold never load until scrolled to, so only wait for the ones in view, and never indefinitely
    const wait = [...document.images].filter((i) => !i.complete && i.loading !== "lazy").map((i) => new Promise((r) => { i.onload = i.onerror = r }))
    await Promise.race([Promise.all(wait), new Promise((r) => setTimeout(r, 6000))]) })
  await page.waitForTimeout(500)
  let buf
  if (job.selector) buf = await page.locator(job.selector).first().screenshot({ type: "png" })
  else { const [x, y, cw, ch] = job.clip; buf = await page.screenshot({ type: "png", clip: { x, y, width: cw, height: ch } }) }
  const file = `${job.id}.webp`
  const info = await sharp(buf).webp({ quality: 90, effort: 5 }).toFile(out + file)
  manifest[job.id] = { file: `/marketing/${file}`, width: info.width, height: info.height, cssWidth: Math.round(info.width / (job.dsf ?? cfg.dsf)), cssHeight: Math.round(info.height / (job.dsf ?? cfg.dsf)), bytes: info.size, source: job.url }
  console.log(job.id, info.width + "x" + info.height, Math.round(info.size / 1024) + "KB")
  await ctx.close()
}
await browser.close()
const prior = (() => { try { return JSON.parse(readFileSync(out + "manifest.json", "utf8")) } catch { return {} } })()
const entries = { ...prior, ...manifest }
for (const m of Object.values(entries)) m.sha256 = createHash("sha256").update(readFileSync(new URL("../../public" + m.file, import.meta.url))).digest("hex").slice(0,12)
for (const [id, m] of Object.entries(entries)) {
  if (!id.endsWith("-phone")) continue
  const pixel = await sharp(new URL("../../public" + m.file, import.meta.url).pathname).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer()
  m.surface = "#" + [...pixel].map(n => n.toString(16).padStart(2, "0")).join("")
}
const merged = JSON.stringify(entries, null, 2) + "\n"
writeFileSync(out + "manifest.json", merged)
// The app imports the same manifest so every marketing image has real intrinsic dimensions (no layout shift).
writeFileSync(new URL("../../src/features/marketing/manifest.json", import.meta.url).pathname, merged)
