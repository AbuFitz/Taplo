import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { mkdirSync } from "node:fs"
import { STORIES, type Step, type Story } from "../../src/features/workbench/stories"
import { SCENARIOS } from "../../src/features/showcase/content"

/**
 * Walks every workbench story: opens it at its real width, plays its interaction, checks it fits the screen,
 * runs axe (serious and critical fail) and, with WORKBENCH_SHOTS=1, saves a screenshot to docs/screens/workbench.
 * Local only; no hosted visual-testing service.
 */
const SHOTS = process.env.WORKBENCH_SHOTS === "1"
if (SHOTS) mkdirSync("docs/screens/workbench", { recursive: true })

async function play(page: Page, steps: Step[]) {
  for (const s of steps) {
    if ("click" in s) {
      const c = s.click
      const loc = "testid" in c ? page.getByTestId(c.testid).nth(c.nth ?? 0) : page.getByRole(c.role as "button", { name: c.name }).first()
      await loc.click()
    } else if ("fill" in s) await page.getByRole("textbox", { name: s.fill.label }).fill(s.fill.value)
    else await page.keyboard.press(s.press)
    await page.waitForTimeout(150)
  }
}

for (const story of STORIES) {
  test(`${story.group}: ${story.id}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: story.vp, height: story.vp === 1280 ? 800 : 844 }, reducedMotion: "reduce", hasTouch: story.vp < 600 })
    const page = await ctx.newPage()
    await page.goto(`/workbench/${story.id}`, { waitUntil: "load" })
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
    const root = page.locator(`[data-story="${story.id}"]`)
    if (story.expectedState) {
      await expect(root.getByTestId("workbench-status").first()).toHaveAttribute("data-status", story.expectedState)
      await expect(root.locator("[data-widget]")).toHaveCount(0)
    } else await expect(root.locator(story.header ? "h1" : "[data-widget]").first()).toBeVisible()
    if (story.id.startsWith("document--")) {
      const link = root.getByRole("link", { name: /No. 6 Coffee menu/ })
      const response = await page.request.get((await link.getAttribute("href"))!)
      expect(response.headers()["content-type"]).toContain("application/pdf")
      expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-")
    }
    if (story.id === "sms--light") await expect(root.getByRole("link", { name: /Text the shop/ })).toHaveAttribute("href", /^sms:/)
    if (story.id === "video--light" || story.id === "video--dark") {
      await expect(root.locator("iframe")).toHaveCount(0)
      let providerRequested = false
      await page.route("**/www.youtube-nocookie.com/**", async route => { providerRequested = true; await route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><title>Provider request fixture</title><main><h1>Provider request received</h1><p>Playback belongs to the external provider.</p></main></html>' }) })
      await root.getByRole("button", { name: /Play video/ }).click()
      await expect(root.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com/)
      await expect.poll(() => providerRequested).toBe(true)
    }
    if (story.play) await play(page, story.play)
    if (story.widgets.some(w => w.type === "team" && w.settings?.variant === "avatars")) {
      const name = SCENARIOS[story.scenario].content.staff?.[0]?.name
      const avatar = page.locator(".tp-team-avatars button").first()
      await expect(avatar).toHaveAccessibleName(`${name}. View profile`)
      await avatar.click()
      await expect(page.getByTestId("team-profile")).toContainText(name!)
      await page.getByRole("button", { name: "Close", exact: true }).click()
    }

    // 1. Fits the screen (an open dialog scrolls inside itself, never the page sideways).
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "no sideways scroll").toBe(true)

    // 2. Accessibility.
    const r = process.env.WB_AXE === "0" ? { violations: [] } : await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze()
    const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
    expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([])

    // 3. Look at it.
    if (SHOTS) {
      const el = story.shoot === "dialog" ? page.locator('[role="dialog"]').first() : page.locator(`[data-story="${story.id}"]`)
      await el.screenshot({ path: `docs/screens/workbench/${story.id}.png` })
    }
    await ctx.close()
  })
}
export type { Story }
