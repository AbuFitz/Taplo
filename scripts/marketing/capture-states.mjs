// Captures real interaction states of the page renderer (open overlays, steps of the booking journey, widget variants).
// Usage: BASE_URL=http://localhost:3200 CHROME_PATH=... node scripts/marketing/capture-states.mjs [id ...]
// Every image is the real renderer after real clicks, written next to the other marketing captures and merged into manifest.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import { createHash } from "node:crypto"

const base = process.env.BASE_URL ?? "http://localhost:3100"
const out = new URL("../../public/marketing/", import.meta.url).pathname
mkdirSync(out, { recursive: true })
const only = process.argv.slice(2)
const frame = (scenario, look) => `/appearance/frame?scenario=${scenario}${look ? `&look=${look}` : ""}`
const DIALOG = '[role="dialog"]'

/** Each job: where to go, how to get to the state, and what to photograph. */
const jobs = [
  // ---- Booking: a real journey, step by step
  { id: "bk-1-service", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Book (your chair|a haircut)/ }).first().click() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-2-time", url: frame("station"), vp: [1000, 900], run: async (p) => { await openBooking(p); await p.getByTestId("booking-flow").getByTestId("bk-service").first().click(); await p.getByTestId("booking-flow").getByRole("button", { name: /Anyone available/ }).click(); await p.getByTestId("bk-slots").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-3-details", url: frame("station"), vp: [1000, 900], run: async (p) => { await toDetails(p) }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-4-review", url: frame("station"), vp: [1000, 900], run: async (p) => { await toDetails(p); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByText("Check your booking").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-5-done", url: frame("station"), vp: [1000, 900], run: async (p) => { await toDetails(p); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByRole("button", { name: "Confirm booking" }).click(); await p.getByTestId("bk-done").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-request-review", url: frame("detailer"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Request a valet/ }).first().click(); await flow(p).getByTestId("bk-service").first().click(); await anyone(p); await flow(p).getByTestId("bk-slot").nth(1).click(); await flow(p).getByRole("button", { name: /Request this time/ }).click(); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByText("Check your request").waitFor().catch(() => {}) }, shot: '[data-testid="booking-flow"]' },
  // ---- The service-to-booking story, on a phone, one viewport each (390 x 844)
  { id: "story-1-menu", url: frame("station"), vp: [390, 844], run: async (p) => { await p.evaluate(() => { const el = document.querySelector('[data-widget="priceMenu"]'); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 24) }) }, clip: [0, 0, 390, 844] },
  { id: "story-2-detail", url: frame("station"), vp: [390, 844], run: async (p) => { await p.getByTestId("service-open").first().click(); await p.getByTestId("service-detail").waitFor() }, clip: [0, 0, 390, 844] },
  { id: "story-3-time", url: frame("station"), vp: [390, 844], run: async (p) => { await p.getByTestId("service-open").first().click(); await p.getByTestId("service-detail").getByRole("button", { name: /Book this/ }).click(); await p.getByTestId("booking-flow").waitFor(); await anyone(p) }, clip: [0, 0, 390, 844] },
  { id: "story-4-done", url: frame("station"), vp: [390, 844], run: async (p) => { await toDetails(p); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByRole("button", { name: "Confirm booking" }).click(); await p.getByTestId("bk-done").waitFor() }, clip: [0, 0, 390, 844] },
  // ---- Services
  { id: "svc-detail", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByTestId("service-open").first().click() }, shot: '[data-testid="service-detail"]' },
  { id: "svc-menu-barber", url: frame("station"), vp: [390, 900], shot: '[data-widget="priceMenu"]' },
  { id: "svc-menu-physio", url: frame("physio"), vp: [390, 900], shot: '[data-widget="serviceList"]' },
  { id: "svc-menu-cafe", url: frame("cafe"), vp: [390, 900], shot: '[data-widget="priceMenu"]' },
  { id: "svc-menu-gym", url: frame("gym"), vp: [390, 900], shot: '[data-widget="serviceList"]' },
  { id: "svc-cards-parkside", url: frame("detailer"), vp: [390, 900], shot: '[data-widget="serviceList"]' },
  { id: "vehicle-catalogue-brookfield", url: frame("brookfield"), vp: [1100, 1000], shot: '[data-widget="products"]' },
  { id: "product-detail-station", url: frame("station"), vp: [1000, 900], run: async p => { await p.locator(".tp-product").first().getByRole("button", { name: /View details/ }).click() }, shot: DIALOG },
  // ---- Team
  { id: "team-swipe", url: frame("station") + "&widget=team&variant=swipe", vp: [390, 900], shot: '[data-widget="team"]' },
  { id: "team-grid", url: frame("station") + "&widget=team&variant=grid", vp: [740, 900], shot: '[data-widget="team"]' },
  { id: "team-list", url: frame("station"), vp: [390, 900], shot: '[data-widget="team"]' },
  { id: "team-profile", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByTestId("team-card").first().getByRole("button", { name: /View profile/ }).click() }, shot: '[data-testid="team-profile"]' },
  // ---- Products, vehicles
  { id: "prod-swipe", url: frame("station"), vp: [390, 900], shot: '[data-widget="products"]' },
  { id: "prod-detail-affiliate", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.locator(".tp-product").nth(1).getByRole("button", { name: /View details/ }).first().click() }, shot: DIALOG },
  { id: "veh-detail", url: frame("brookfield"), vp: [1000, 900], run: async (p) => { await p.locator('.tp-product[data-status="available"]').first().getByRole("button", { name: /View details/ }).first().click() }, shot: DIALOG },
  // ---- Gallery, reviews, enquiry, sharing
  { id: "gal-lightbox", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByTestId("gallery-open").first().click(); await p.getByTestId("lightbox").waitFor() }, shot: '[data-testid="lightbox"]' },
  { id: "rev-quote", url: frame("trades"), vp: [390, 900], shot: '[data-widget="reviews"]' },
  { id: "enq-inline", url: frame("detailer"), vp: [390, 900], shot: '[data-widget="enquiry"]' },
  { id: "enq-sent", url: frame("detailer"), vp: [390, 900], run: async (p) => { const f = p.locator('[data-widget="enquiry"]'); await f.getByRole("textbox", { name: "Your name" }).fill("Ruth"); await f.getByRole("textbox", { name: "Phone (optional)" }).fill("07700 900123"); await f.getByRole("textbox", { name: "Your message" }).fill("Could you quote for an interior clean for a Ford Focus?"); await f.getByRole("button", { name: /Send message/ }).click(); await p.getByTestId("enquiry-sent").waitFor() }, shot: '[data-widget="enquiry"]' },
  { id: "share-sheet", origin: "https://taplo.example", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Station/ }).click(); await p.getByTestId("share-panel").waitFor(); /* the artwork shows the page as it is once it has its own address, so the workspace's preview note is left out */ await p.addStyleTag({ content: "[data-testid=share-demo-note]{display:none!important}" }); await p.waitForTimeout(400) }, shot: '[data-testid="share-panel"]' },
  // The downloadable share image, exactly as a customer would save it.
  { id: "share-image", origin: "https://taplo.example", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Station/ }).click(); await p.getByTestId("share-panel").waitFor() }, download: async (p) => { await p.getByTestId("share-tab-card").click(); const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: /Share image/ }).click()]); return readFileSync(await dl.path()) } },
  // The standalone QR code on a transparent background, set against a light surface to show it is real.
  { id: "qr-options", origin: "https://taplo.example", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Station/ }).click(); await p.getByTestId("share-panel").waitFor(); await p.addStyleTag({ content: "[data-testid=share-demo-note]{display:none!important}" }); await p.getByRole("radio", { name: "Your logo" }).click(); await p.getByRole("radio", { name: "Dots" }).click(); await p.waitForTimeout(400) }, shot: '[data-testid="share-panel"]' },
  { id: "qr-standalone", origin: "https://taplo.example", url: frame("station"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Station/ }).click(); await p.getByTestId("share-panel").waitFor() }, download: async (p) => { await p.getByRole("radio", { name: "Transparent" }).click(); const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: /QR code · Screen/ }).click()]); return readFileSync(await dl.path()) } },
  { id: "setup-1-name", url: "/onboarding", vp: [1100, 860], run: async p => { await p.getByLabel("Business name").fill("Your local business") }, clip: [0, 0, 1100, 860] },
  // ---- Setup: the first, middle and last of the short journey, on a computer
  { id: "setup-2-what", url: "/onboarding", vp: [1100, 860], run: async (p) => { await p.getByLabel("Business name").fill("Your local business"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click() }, clip: [0, 0, 1100, 860] },
  { id: "setup-3-design", url: "/onboarding", vp: [1100, 860], run: async (p) => { await p.getByLabel("Business name").fill("Your local business"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click(); await p.getByLabel("Phone (optional)").fill("020 7946 0123"); await p.getByLabel("Phone (optional)").blur(); await p.getByRole("button", { name: "Continue" }).click() }, clip: [0, 0, 1100, 860] },
  { id: "setup-4-first", url: "/onboarding", vp: [1100, 860], run: async (p) => { await p.getByLabel("Business name").fill("Your local business"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click(); await p.getByLabel("Phone (optional)").fill("020 7946 0123"); await p.getByLabel("Phone (optional)").blur(); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("button", { name: "Continue" }).click(); await p.getByLabel("Service 1 name").fill("Haircut"); await p.getByLabel("Service 1 price").fill("22"); await p.getByLabel("Service 1 minutes").fill("30"); await p.getByRole("button", { name: "Add another" }).click(); await p.getByLabel("Service 2 name").fill("Skin fade"); await p.getByLabel("Service 2 price").fill("32") }, clip: [0, 0, 1100, 860] },
  // ---- Design: one business, six starting looks
  ...["night", "journal", "clay", "forge", "orchard", "showroom"].map((l) => ({ id: `look-${l}`, url: frame("barber", l), vp: [390, 844], clip: [0, 0, 390, 600] })),
]

// The setup story uses real mobile captures on phones, rather than shrinking desktop form text.
for (const j of [...jobs].filter(j => j.id.startsWith("setup-"))) jobs.push({ ...j, id: `${j.id}-phone`, vp: [390, 844], clip: [0, 0, 390, 844], run: async p => { await j.run(p); await p.locator("#step-title").scrollIntoViewIfNeeded() } })

const flow = (p) => p.getByTestId("booking-flow")
const anyone = async (p) => { await flow(p).getByRole("button", { name: /Anyone available/ }).click().catch(() => {}); await flow(p).getByTestId("bk-slots").waitFor() }
async function openBooking(p) { await p.getByRole("button", { name: /Book (your chair|a haircut)/ }).first().click(); await flow(p).waitFor() }
async function toDetails(p) { await openBooking(p); await flow(p).getByTestId("bk-service").first().click(); await anyone(p); await flow(p).getByTestId("bk-slot").nth(1).click(); await flow(p).getByRole("button", { name: /Book this time/ }).click(); await flow(p).getByText("Your details").waitFor() }
async function fillDetails(p) { await flow(p).getByRole("textbox", { name: "Your name" }).fill("Sam Taylor"); await flow(p).getByRole("textbox", { name: "Email" }).fill("sam@example.com") }

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const manifest = {}
let failed = 0
const unknown = only.filter(id => !jobs.some(j => j.id === id))
if (unknown.length) throw new Error(`Unknown capture jobs: ${unknown.join(", ")}`)
for (const j of jobs.filter((x) => !only.length || only.includes(x.id))) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: j.vp[0], height: j.vp[1] }, deviceScaleFactor: 2, reducedMotion: "reduce" })
  // A job can pose as another origin (a reserved .example name), so shared links and QR codes never say "localhost".
  if (j.origin) await ctx.route(`${j.origin}/**`, async (r) => {
    const headers = { ...r.request().headers(), host: new URL(base).host }
    for (const h of ["origin", "referer", "sec-fetch-site", "sec-fetch-mode", "sec-fetch-dest"]) delete headers[h]
    await r.fulfill({ response: await r.fetch({ url: r.request().url().replace(j.origin, base), headers }) })
  })
  const page = await ctx.newPage()
  try {
    await page.goto((j.origin ?? base) + j.url, { waitUntil: "load", timeout: 60000 })
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: "load" })
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
    await page.evaluate(() => document.fonts.ready)
    if (j.run) await j.run(page)
    await page.evaluate(async () => { await Promise.all([...document.images].map(async img => { img.loading = "eager"; await img.decode() })) })
    await page.waitForTimeout(500)
    let buf
    if (j.download) buf = await j.download(page)
    else if (j.shot) { const el = page.locator(j.shot).first(); await el.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(300); buf = await el.screenshot({ type: "png" }) }
    else { const [x, y, w, h] = j.clip; buf = await page.screenshot({ type: "png", clip: { x, y, width: w, height: h } }) }
    const info = await sharp(buf).webp({ quality: 90, effort: 5 }).toFile(`${out}${j.id}.webp`)
    manifest[j.id] = { file: `/marketing/${j.id}.webp`, width: info.width, height: info.height, cssWidth: Math.round(info.width / 2), cssHeight: Math.round(info.height / 2), bytes: info.size, source: j.url, sha256: createHash("sha256").update(readFileSync(`${out}${j.id}.webp`)).digest("hex"), capturedAt: new Date().toISOString() }
    console.log(j.id, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB")
  } catch (e) { failed++; console.error("FAILED", j.id, String(e.message).split("\n")[0]) }
  await ctx.close()
}
await browser.close()
const prior = (() => { try { return JSON.parse(readFileSync(out + "manifest.json", "utf8")) } catch { return {} } })()
const merged = JSON.stringify({ ...prior, ...manifest }, null, 2) + "\n"
writeFileSync(out + "manifest.json", merged)
writeFileSync(new URL("../../src/features/marketing/manifest.json", import.meta.url).pathname, merged)

if (failed) process.exitCode = 1
