import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const width of [390, 1440]) {
  test(`design discovery has no serious automated accessibility findings at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const route of ["/inspiration", "/inspiration/station-road-barbers", "/inspiration/parkside-valeting", "/inspiration/brookfield-motors"]) {
      await page.goto(route, { waitUntil: "networkidle" })
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze()
      expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), route).toEqual([])
    }
  })
}
