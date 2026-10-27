import { test, expect } from "@playwright/test"
import path from "node:path"
import { SCENARIOS } from "@/features/showcase/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { newPage } from "@/features/page/starter"
import { initialState } from "@/features/demo/store"
import { PROFILE_CHOICES } from "@/features/page/contracts/style"

/** Renders every profile arrangement through the real page renderer for each asset state, for visual review. */
const OUT = process.env.TAPLO_REVIEW_DIR ?? "docs/review/arrangements"
const STATES = [
  ["full", {}],
  ["logo-only", { cover: false }],
  ["cover-only", { logo: false }],
  ["neither", { cover: false, logo: false }],
  ["long-name", { long: true }],
] as const

test.describe("profile arrangement sheet", () => {
  test.skip(!process.env.TAPLO_SHEET, "review artefact: set TAPLO_SHEET=1")
  test.setTimeout(600_000)
  for (const key of ["barber", "dealer"] as const) {
    test(`arrangements ${key}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 })
      for (const arr of PROFILE_CHOICES) {
        for (const [name, o] of STATES) {
          const content = structuredClone(SCENARIOS[key].content)
          const opt = o as { cover?: boolean; logo?: boolean; long?: boolean }
          if (opt.cover === false) content.identity.heroImage = undefined
          if (opt.logo === false) content.identity.logo = undefined
          if (opt.long) content.identity.name = `${content.identity.name} Interiors, Design & Renovation Specialists`
          const s = { ...initialState(), onboarded: true, content, step: "publish", page: { ...newPage("other"), themeId: "paper", appearance: { header: { layout: arr.id, align: arr.id === "identity" || arr.id === "bento" ? "center" : "left" } }, widgets: widgetsFor(key) } }
          await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
          await page.evaluate((v) => localStorage.setItem("taplo.demo.v2", JSON.stringify(v)), s)
          await page.goto("/demo/preview", { waitUntil: "networkidle" })
          await expect(page.locator(`[data-layout="${arr.id}"]`)).toBeVisible()
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
          expect(overflow, `${arr.id}/${name} overflows`).toBe(false)
          await page.screenshot({ path: path.join(OUT, `${key}-${arr.id}-${name}.png`), clip: { x: 0, y: 0, width: 390, height: 900 } })
        }
      }
    })
  }
})

import AxeBuilder from "@axe-core/playwright"
test.describe("profile arrangements: widths and accessibility", () => {
  test.setTimeout(600_000)
  test("no overflow and no axe violations in the header at every width", async ({ page }) => {
    for (const arr of PROFILE_CHOICES) {
      const s = { ...initialState(), onboarded: true, step: "publish" as const, content: structuredClone(SCENARIOS.barber.content), page: { ...newPage("other"), themeId: "paper", appearance: { header: { layout: arr.id, align: arr.id === "identity" || arr.id === "bento" ? "center" : "left" } }, widgets: widgetsFor("barber") } }
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
      await page.evaluate((v) => localStorage.setItem("taplo.demo.v2", JSON.stringify(v)), s)
      for (const width of [320, 375, 430, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto("/demo/preview", { waitUntil: "networkidle" })
        await expect(page.locator(`[data-layout="${arr.id}"]`)).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${arr.id} overflows at ${width}`).toBe(false)
        const res = await new AxeBuilder({ page }).include("header[data-layout]").analyze()
        expect(res.violations.map((v) => `${arr.id}@${width}: ${v.id}`), `${arr.id}@${width}`).toEqual([])
        if (process.env.TAPLO_SHEET) await page.screenshot({ path: path.join(OUT, `w${width}-${arr.id}.png`), clip: { x: 0, y: 0, width, height: 700 } })
      }
    }
  })
})
