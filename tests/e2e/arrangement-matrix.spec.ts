import { test, expect } from "@playwright/test"
import path from "node:path"
import fs from "node:fs"
import sharp from "sharp"
import { SCENARIOS } from "@/features/showcase/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { newPage } from "@/features/page/starter"
import { initialState } from "@/features/demo/store"
import { PROFILE_CHOICES } from "@/features/page/contracts/style"

/**
 * Review artefact. Every profile arrangement, with every kind of logo and cover a real owner brings, at every mark size and shape,
 * for a long name and a short one, light and dark. Set TAPLO_SHEET=1; contact sheets are written to TAPLO_REVIEW_DIR.
 */
const OUT = process.env.TAPLO_REVIEW_DIR ?? "/tmp/arr-matrix"
const uri = async (svg: string, w: number, h: number) => `data:image/png;base64,${(await sharp(Buffer.from(svg)).resize(w, h).png().toBuffer()).toString("base64")}`

const photo = (w: number, h: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3a55"/><stop offset=".55" stop-color="#8aa0c0"/><stop offset="1" stop-color="#d9c7a3"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w * 0.7}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.12}" fill="#f6e7b7"/><path d="M0 ${h} L0 ${h * 0.62} L${w * 0.3} ${h * 0.42} L${w * 0.55} ${h * 0.62} L${w * 0.8} ${h * 0.38} L${w} ${h * 0.58} L${w} ${h}Z" fill="#33463a"/></svg>`
const square = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#1f4f8f"/><text x="200" y="250" font-family="Georgia,serif" font-size="150" fill="#fff" text-anchor="middle" font-weight="700">MF</text></svg>`
const wide = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="220"><text x="450" y="140" font-family="Georgia,serif" font-size="110" fill="#14202e" text-anchor="middle" font-weight="700" letter-spacing="4">MARLOWE</text></svg>`
const tall = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect x="20" y="20" width="260" height="410" rx="30" fill="none" stroke="#7a3b1d" stroke-width="14"/><text x="150" y="260" font-family="Georgia,serif" font-size="120" fill="#7a3b1d" text-anchor="middle" font-weight="700">M&amp;F</text></svg>`
const tiny = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#a33"/><text x="24" y="33" font-size="22" fill="#fff" text-anchor="middle" font-family="sans-serif">M</text></svg>`

const NAMES = { short: "Mia Cole", mid: "Marlowe & Finch", long: "Harrington & Whitfield Chartered Surveyors" }
type Logo = "none" | "square" | "wide" | "tall" | "tiny"

test.describe("profile arrangement matrix", () => {
  test.skip(!process.env.TAPLO_SHEET, "review artefact: set TAPLO_SHEET=1")
  test.setTimeout(1_800_000)
  test("render", async ({ page }) => {
    fs.mkdirSync(OUT, { recursive: true })
    await page.setViewportSize({ width: 390, height: 640 })
    const logos: Record<Exclude<Logo, "none">, { src: string; alt: string; width: number; height: number; ink?: "dark" }> = {
      square: { src: await uri(square, 400, 400), alt: "Logo", width: 400, height: 400 },
      wide: { src: await uri(wide, 900, 220), alt: "Logo", width: 900, height: 220, ink: "dark" },
      tall: { src: await uri(tall, 300, 450), alt: "Logo", width: 300, height: 450 },
      tiny: { src: await uri(tiny, 48, 48), alt: "Logo", width: 48, height: 48 },
    }
    const land = { src: await uri(photo(1200, 800), 1200, 800), alt: "Cover", width: 1200, height: 800, tint: "#d9c7a3" }
    const port = { src: await uri(photo(800, 1200), 800, 1200), alt: "Cover", width: 800, height: 1200, tint: "#d9c7a3" }
    const shot = async (file: string, o: { arr: string; logo: Logo; cover: "none" | "land" | "port"; size?: string; shape?: string; name?: keyof typeof NAMES; tagline?: boolean; dark?: boolean }) => {
      const content = structuredClone(SCENARIOS.barber.content)
      content.identity.name = NAMES[o.name ?? "mid"]
      content.identity.logo = o.logo === "none" ? undefined : logos[o.logo]
      content.identity.heroImage = o.cover === "none" ? undefined : o.cover === "land" ? land : port
      if (o.tagline === false) content.identity.tagline = undefined
      const colors = o.dark ? { background: "#0b0c0e", text: "#f4f5f7", muted: "#a3a7b0", surface: "#202226", accent: "#f4f5f7", accentText: "#101216", border: "#33363c" } : undefined
      const s = { ...initialState(), onboarded: true, content, step: "publish", page: { ...newPage("other"), themeId: "paper", appearance: { ...(colors ? { colors, background: { kind: "solid", color: colors.background } } : {}), buttons: { shape: "pill" }, header: { layout: o.arr, align: o.arr === "identity" || o.arr === "bento" ? "center" : "left", avatarSize: o.size ?? "md", ...(o.shape ? { avatarShape: o.shape } : {}) } }, widgets: widgetsFor("barber") } }
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
      await page.evaluate((v) => localStorage.setItem("taplo.demo.v2", JSON.stringify(v)), s)
      await page.goto("/demo/preview", { waitUntil: "networkidle" })
      await page.locator(`[data-layout="${o.arr}"]`).waitFor()
      await page.waitForTimeout(250)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      expect(overflow, `${file} overflows`).toBe(false)
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 390, height: 640 } })
    }
    const sheet = async (files: string[], cols: number, out: string) => {
      const ims = await Promise.all(files.map((f) => sharp(f).resize(260).toBuffer()))
      const h = Math.round(640 * 260 / 390), rows = Math.ceil(files.length / cols)
      await sharp({ create: { width: cols * 266, height: rows * (h + 6), channels: 3, background: "#777" } }).composite(ims.map((b, i) => ({ input: b, left: (i % cols) * 266, top: Math.floor(i / cols) * (h + 6) }))).png().toFile(out)
    }
    const want = (process.env.TAPLO_ONLY ?? "").split(",").filter(Boolean)
    for (const arr of PROFILE_CHOICES.map((c) => c.id)) {
      if (want.length && !want.includes(arr)) continue
      // 1. every kind of logo and cover at the default mark
      const a: string[] = []
      for (const logo of ["none", "square", "wide", "tall", "tiny"] as Logo[]) for (const cover of ["none", "land", "port"] as const) {
        const f = path.join(OUT, `${arr}-a-${logo}-${cover}.png`); await shot(f, { arr, logo, cover }); a.push(f)
      }
      await sheet(a, 5, path.join(OUT, `SHEET-${arr}-assets.png`))
      // 2. mark size by shape, with a square logo and a landscape cover
      const b: string[] = []
      for (const size of ["sm", "md", "lg"]) for (const shape of ["circle", "rounded", "square", "logo"]) {
        const f = path.join(OUT, `${arr}-b-${size}-${shape}.png`); await shot(f, { arr, logo: "square", cover: "land", size, shape }); b.push(f)
      }
      await sheet(b, 4, path.join(OUT, `SHEET-${arr}-sizes.png`))
      // 3. name and tagline extremes, light and dark
      const c: string[] = []
      for (const name of ["short", "long"] as const) for (const dark of [false, true]) for (const tagline of [true, false]) {
        const f = path.join(OUT, `${arr}-c-${name}-${dark ? "dark" : "light"}-${tagline ? "tag" : "notag"}.png`); await shot(f, { arr, logo: "square", cover: "land", name, dark, tagline }); c.push(f)
      }
      await sheet(c, 4, path.join(OUT, `SHEET-${arr}-text.png`))
    }
  })
})
