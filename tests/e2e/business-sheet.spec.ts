import { test } from "@playwright/test"
import path from "node:path"
import { ALL_SHOWCASE } from "@/features/inspiration/showcase-set"

/** One real page per business type the brief names, through the gallery's own frame. TAPLO_SHEET=1. */
const OUT = process.env.TAPLO_REVIEW_DIR ?? "docs/review/businesses"
const PICKS: Record<string, string[]> = { barber: ["barber"], "mobile-detailer": ["detailer"], trade: ["trades", "fixnow"], retail: ["petal", "books"], tutor: ["tutor", "rowan"], creative: ["sora", "dune"], "other-hybrid": ["nami", "twelve"] }
test("business contact sheet", async ({ page }) => {
  test.skip(!process.env.TAPLO_SHEET, "review artefact"); test.setTimeout(300_000)
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [group, scenarios] of Object.entries(PICKS)) for (const sc of scenarios) {
    const it = ALL_SHOWCASE.find((i) => i.scenario === sc); if (!it) continue
    await page.goto(`/appearance/frame?scenario=${sc}&look=${it.design}${it.logo === false ? "&logo=0" : ""}${it.arrangement ? `&arr=${it.arrangement}` : ""}`, { waitUntil: "networkidle" })
    await page.emulateMedia({ reducedMotion: "reduce" }); await page.waitForTimeout(600)
    await page.screenshot({ path: path.join(OUT, `${group}-${sc}-${it.arrangement ?? "default"}.png`), clip: { x: 0, y: 0, width: 390, height: 844 } })
  }
})
