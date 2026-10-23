// Captures real interaction states of the page renderer (open overlays, steps of the booking journey, widget variants).
// Usage: BASE_URL=http://localhost:3200 CHROME_PATH=... node scripts/marketing/capture-states.mjs [id ...]
// Every image is the real renderer after real clicks, written next to the other marketing captures and merged into manifest.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const base = process.env.BASE_URL ?? "http://localhost:3100"
const out = new URL("../../public/marketing/", import.meta.url).pathname
mkdirSync(out, { recursive: true })
const only = process.argv.slice(2)
const frame = (scenario, look) => `/appearance/frame?scenario=${scenario}${look ? `&look=${look}` : ""}`
const DIALOG = '[role="dialog"]'

/** Each job: where to go, how to get to the state, and what to photograph. */
const jobs = [
  // ---- Booking: a real journey, step by step
  { id: "bk-1-service", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Book your chair/ }).first().click() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-2-time", url: frame("barber"), vp: [1000, 900], run: async (p) => { await openBooking(p); await p.getByTestId("booking-flow").getByTestId("bk-service").first().click(); await p.getByTestId("booking-flow").getByRole("button", { name: /Anyone available/ }).click(); await p.getByTestId("bk-slots").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-3-details", url: frame("barber"), vp: [1000, 900], run: async (p) => { await toDetails(p) }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-4-review", url: frame("barber"), vp: [1000, 900], run: async (p) => { await toDetails(p); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByText("Check your booking").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-5-done", url: frame("barber"), vp: [1000, 900], run: async (p) => { await toDetails(p); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByRole("button", { name: "Confirm booking" }).click(); await p.getByTestId("bk-done").waitFor() }, shot: '[data-testid="booking-flow"]' },
  { id: "bk-request-review", url: frame("physio"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Request an appointment/ }).first().click(); await flow(p).getByTestId("bk-service").first().click(); await anyone(p); await flow(p).getByTestId("bk-slot").nth(1).click(); await flow(p).getByRole("button", { name: /Request this time/ }).click(); await fillDetails(p); await flow(p).getByRole("button", { name: "Review" }).click(); await flow(p).getByText("Check your request").waitFor().catch(() => {}) }, shot: '[data-testid="booking-flow"]' },
  // ---- Services
  { id: "svc-detail", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByTestId("service-open").first().click() }, shot: '[data-testid="service-detail"]' },
  { id: "svc-menu-barber", url: frame("barber"), vp: [390, 900], shot: '[data-widget="priceMenu"]' },
  { id: "svc-menu-physio", url: frame("physio"), vp: [390, 900], shot: '[data-widget="serviceList"]' },
  { id: "svc-menu-cafe", url: frame("cafe"), vp: [390, 900], shot: '[data-widget="priceMenu"]' },
  { id: "svc-menu-gym", url: frame("gym"), vp: [390, 900], shot: '[data-widget="serviceList"]' },
  // ---- Team
  { id: "team-swipe", url: frame("barber"), vp: [390, 900], shot: '[data-widget="team"]' },
  { id: "team-grid", url: frame("physio"), vp: [390, 900], shot: '[data-widget="team"]' },
  { id: "team-list", url: frame("trades"), vp: [390, 900], shot: '[data-widget="team"]' },
  { id: "team-profile", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByTestId("team-card").first().getByRole("button", { name: /View profile/ }).click() }, shot: '[data-testid="team-profile"]' },
  // ---- Products, vehicles
  { id: "prod-swipe", url: frame("barber"), vp: [390, 900], shot: '[data-widget="products"]' },
  { id: "prod-detail-affiliate", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.locator(".tp-product").nth(1).getByRole("button", { name: /View details/ }).first().click() }, shot: DIALOG },
  { id: "veh-detail", url: frame("dealer"), vp: [1000, 900], run: async (p) => { await p.locator('.tp-product[data-status="available"]').first().getByRole("button", { name: /View details/ }).first().click() }, shot: DIALOG },
  // ---- Gallery, reviews, enquiry, sharing
  { id: "gal-lightbox", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByTestId("gallery-open").first().click(); await p.getByTestId("lightbox").waitFor() }, shot: '[data-testid="lightbox"]' },
  { id: "rev-quote", url: frame("trades"), vp: [390, 900], shot: '[data-widget="reviews"]' },
  { id: "enq-inline", url: frame("trades"), vp: [390, 900], shot: '[data-widget="enquiry"]' },
  { id: "enq-sent", url: frame("trades"), vp: [390, 900], run: async (p) => { const f = p.locator('[data-widget="enquiry"]'); await f.getByRole("textbox", { name: "Your name" }).fill("Ruth"); await f.getByRole("textbox", { name: "Phone (optional)" }).fill("07700 900123"); await f.getByRole("textbox", { name: "Your message" }).fill("My boiler is leaking. Can you come tomorrow?"); await f.getByRole("button", { name: /Send message/ }).click(); await p.getByTestId("enquiry-sent").waitFor() }, shot: '[data-widget="enquiry"]' },
  { id: "share-sheet", origin: "https://taplo.example", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Marlowe/ }).click(); await p.getByTestId("share-panel").waitFor(); /* the artwork shows the page as it is once it has its own address, so the workspace's preview note is left out */ await p.addStyleTag({ content: "[data-testid=share-demo-note]{display:none!important}" }); await p.waitForTimeout(400) }, shot: '[data-testid="share-panel"]' },
  // The downloadable share image, exactly as a customer would save it.
  { id: "share-image", origin: "https://taplo.example", url: frame("barber"), vp: [1000, 900], run: async (p) => { await p.getByRole("button", { name: /Share Marlowe/ }).click(); await p.getByTestId("share-panel").waitFor() }, download: async (p) => { const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: "Share image" }).click()]); return readFileSync(await dl.path()) } },
  // ---- Setup: the first, middle and last of the short journey, on a computer
  { id: "setup-2-what", url: "/onboarding", vp: [1100, 700], run: async (p) => { await p.getByLabel("Business name").fill("Marlowe & Finch"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click() }, clip: [0, 0, 1100, 700] },
  { id: "setup-3-design", url: "/onboarding", vp: [1100, 700], run: async (p) => { await p.getByLabel("Business name").fill("Marlowe & Finch"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click(); await p.getByLabel("Phone (optional)").fill("020 7946 0123"); await p.getByLabel("Phone (optional)").blur(); await p.getByRole("button", { name: "Continue" }).click() }, clip: [0, 0, 1100, 700] },
  { id: "setup-4-first", url: "/onboarding", vp: [1100, 700], run: async (p) => { await p.getByLabel("Business name").fill("Marlowe & Finch"); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click(); await p.getByLabel("Phone (optional)").fill("020 7946 0123"); await p.getByLabel("Phone (optional)").blur(); await p.getByRole("button", { name: "Continue" }).click(); await p.getByRole("button", { name: "Continue" }).click(); await p.getByLabel("Service 1 name").fill("Signature cut"); await p.getByLabel("Service 1 price").fill("34"); await p.getByLabel("Service 1 minutes").fill("45"); await p.getByRole("button", { name: "Add another" }).click(); await p.getByLabel("Service 2 name").fill("Skin fade"); await p.getByLabel("Service 2 price").fill("32") }, clip: [0, 0, 1100, 700] },
  // ---- Design: one business, six starting looks
  ...["night", "journal", "clay", "forge", "orchard", "showroom"].map((l) => ({ id: `look-${l}`, url: frame("barber", l), vp: [390, 844], clip: [0, 0, 390, 600] })),
]

const flow = (p) => p.getByTestId("booking-flow")
const anyone = async (p) => { await flow(p).getByRole("button", { name: /Anyone available/ }).click().catch(() => {}); await flow(p).getByTestId("bk-slots").waitFor() }
async function openBooking(p) { await p.getByRole("button", { name: /Book your chair/ }).first().click(); await flow(p).waitFor() }
async function toDetails(p) { await openBooking(p); await flow(p).getByTestId("bk-service").first().click(); await anyone(p); await flow(p).getByTestId("bk-slot").nth(1).click(); await flow(p).getByRole("button", { name: /Book this time/ }).click(); await flow(p).getByText("Your details").waitFor() }
async function fillDetails(p) { await flow(p).getByRole("textbox", { name: "Your name" }).fill("Sam Taylor"); await flow(p).getByRole("textbox", { name: "Email" }).fill("sam@example.com") }

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const manifest = {}
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
    await page.waitForTimeout(500)
    let buf
    if (j.download) buf = await j.download(page)
    else if (j.shot) { const el = page.locator(j.shot).first(); await el.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(300); buf = await el.screenshot({ type: "png" }) }
    else { const [x, y, w, h] = j.clip; buf = await page.screenshot({ type: "png", clip: { x, y, width: w, height: h } }) }
    const info = await sharp(buf).webp({ quality: 90, effort: 5 }).toFile(`${out}${j.id}.webp`)
    manifest[j.id] = { file: `/marketing/${j.id}.webp`, width: info.width, height: info.height, cssWidth: Math.round(info.width / 2), cssHeight: Math.round(info.height / 2), bytes: info.size, source: j.url }
    console.log(j.id, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB")
  } catch (e) { console.log("FAILED", j.id, String(e.message).split("\n")[0]) }
  await ctx.close()
}
await browser.close()
const prior = (() => { try { return JSON.parse(readFileSync(out + "manifest.json", "utf8")) } catch { return {} } })()
const merged = JSON.stringify({ ...prior, ...manifest }, null, 2) + "\n"
writeFileSync(out + "manifest.json", merged)
writeFileSync(new URL("../../src/features/marketing/manifest.json", import.meta.url).pathname, merged)
