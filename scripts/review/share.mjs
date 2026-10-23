// Share panel captures: QR tab (white, transparent, business logo) and the card in both formats.
import { mkdirSync } from "node:fs"
import { chromium } from "@playwright/test"
const set = process.argv[2] ?? "r3"
const base = process.env.BASE_URL ?? "http://localhost:3000"
const out = new URL(`../../docs/screens/${set}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const ctx = await b.newContext({ viewport: { width: 1000, height: 1000 }, reducedMotion: "reduce" })
const p = await ctx.newPage()
await p.goto(base + "/appearance/frame?scenario=barber", { waitUntil: "load" }); await p.waitForLoadState("networkidle").catch(() => {})
await p.getByRole("button", { name: /Share Marlowe/ }).click(); await p.getByTestId("share-panel").waitFor(); await p.waitForTimeout(800)
const panel = p.getByTestId("share-panel")
const snap = async (n) => { await p.waitForTimeout(500); await panel.screenshot({ path: `${out}${n}.png` }); console.log("ok", n) }
await snap("share-qr-white")
await p.getByRole("radio", { name: "Transparent" }).click(); await snap("share-qr-clear")
await p.getByRole("radio", { name: "Your logo" }).click(); await p.getByRole("radio", { name: "Dots" }).click(); await p.getByRole("radio", { name: "Your colour" }).click(); await p.getByRole("radio", { name: "White" }).click(); await snap("share-qr-logo")
await p.getByTestId("share-tab-card").click(); await p.waitForSelector('[data-testid="share-card-preview"]'); await snap("share-card-post")
await p.getByRole("radio", { name: /Story/ }).click(); await p.waitForTimeout(800); await snap("share-card-story")
await b.close()
