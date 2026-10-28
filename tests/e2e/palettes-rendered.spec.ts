import { test, expect, type Page } from "@playwright/test"
import sharp from "sharp"
import { cont } from "./helpers"
import { STARTING_LOOKS, applyStartingLook } from "../../src/features/page/themes/starting-looks"
import { applyPalette, palettesFor, originalPalette } from "../../src/features/page/themes/palettes"
import { newPage } from "../../src/features/page/starter"

/**
 * Every look with every palette, on real content in the real renderer. Reduced motion shows the still composition of the same
 * gradient, so this samples the background actually painted behind each piece of text, in every region the page uses, and compares it
 * with the colour the text actually has. Hiding the text and photographing again gives the background behind it.
 */
const lum = (r: number, g: number, b: number) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const ratio = (a: number[], b: number[]) => { const x = lum(a[0]!, a[1]!, a[2]!), y = lum(b[0]!, b[1]!, b[2]!); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

async function seed(page: Page) {
  await page.goto("/onboarding", { waitUntil: "networkidle" })
  await page.getByLabel("Business name", { exact: true }).fill("Marlowe & Finch")
  await cont(page); await cont(page)
  await page.getByRole("button", { name: "Barber", exact: true }).click()
}

const COMBOS = STARTING_LOOKS.flatMap((look) => [undefined, ...palettesFor(look)].map((p) => ({ look, p })))
const chunks = 4
for (let c = 0; c < chunks; c++) test(`palettes on real content, part ${c + 1}`, async ({ browser }) => {
  test.setTimeout(900_000)
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: "reduce" })
  const page = await ctx.newPage()
  await seed(page)
  const failures: string[] = []
  for (const [i, { look, p }] of COMBOS.entries()) {
    if (i % chunks !== c) continue
    const doc = applyPalette(applyStartingLook(newPage("barber"), look), look, p)
    await page.evaluate((pg) => { const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!); s.page = pg; localStorage.setItem("taplo.demo.v2", JSON.stringify(s)) }, doc as unknown as object)
    const view = await ctx.newPage()
    await view.goto("/demo/preview", { waitUntil: "networkidle" })
    await view.waitForTimeout(500)
    const picks = await view.evaluate(() => {
      const root = document.querySelector("[data-taplo-page]")!
      const sel = ["h1", ".tp-meta", "[data-widget] h2", "[data-widget] p", "[data-widget] [class*=price]", "a[href], button"]
      const out: { label: string; x: number; y: number; w: number; h: number; color: number[]; bg: number[] | null }[] = []
      for (const q of sel) for (const el of [...root.querySelectorAll(q)].slice(0, 3)) {
        const r = el.getBoundingClientRect()
        if (r.width < 8 || r.height < 6 || r.bottom < 0 || r.top > innerHeight) continue
        const cs = getComputedStyle(el)
        const m = cs.color.match(/[\\d.]+/g)!.map(Number)
        const bgm = cs.backgroundColor.match(/[\\d.]+/g)!.map(Number)
        out.push({ label: q, x: r.x, y: r.y, w: r.width, h: r.height, color: m.slice(0, 3), bg: bgm.length === 3 || bgm[3]! > 0.95 ? bgm.slice(0, 3) : null })
      }
      return out
    })
    await view.addStyleTag({ content: "*{color:transparent!important;text-shadow:none!important;caret-color:transparent!important} svg{opacity:0!important}" })
    const shot = await sharp(await view.screenshot()).raw().toBuffer({ resolveWithObject: true })
    for (const el of picks) {
      let bg = el.bg
      if (!bg) {
        const rs: number[][] = []
        for (const fx of [0.1, 0.5, 0.9]) for (const fy of [0.2, 0.8]) {
          const x = Math.min(shot.info.width - 1, Math.max(0, Math.round(el.x + el.w * fx))), y = Math.min(shot.info.height - 1, Math.max(0, Math.round(el.y + el.h * fy)))
          const o = (y * shot.info.width + x) * shot.info.channels
          rs.push([shot.data[o]!, shot.data[o + 1]!, shot.data[o + 2]!])
        }
        bg = rs.reduce((acc, v) => [Math.min(acc[0]!, v[0]!), Math.min(acc[1]!, v[1]!), Math.min(acc[2]!, v[2]!)], [255, 255, 255])
        // Use the sample with the least contrast against the text, i.e. the worst region under it.
        let worst = rs[0]!, wr = Infinity
        for (const v of rs) { const q = ratio(el.color, v); if (q < wr) { wr = q; worst = v } }
        bg = worst
      }
      const r = ratio(el.color, bg)
      if (r < 4.5 && el.label !== "a[href], button") failures.push(`${look.name} + ${p?.name ?? "own"}: ${el.label} contrast ${r.toFixed(2)}`)
      if (r < 3 && el.label === "a[href], button") failures.push(`${look.name} + ${p?.name ?? "own"}: action ${r.toFixed(2)}`)
    }
    await view.close()
  }
  expect(failures, failures.join("\n")).toEqual([])
  void originalPalette
})
