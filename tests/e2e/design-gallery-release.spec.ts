import { test, expect } from "@playwright/test";
import path from "node:path";
import {EXAMPLES} from "../../src/features/inspiration/examples";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 768, 1440]) {
  test(`business gallery separates previews and finds useful demos at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto("/inspiration");
    const cards = page.getByTestId("design-card");
    await expect(cards).toHaveCount(EXAMPLES.length);
    const search = page.getByRole("searchbox", { name: "Find a design" });
    await search.fill("clinic");
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole("heading")).toHaveText("Hollin Physiotherapy");
    await expect(cards.first().getByRole("link", { name: /Open demo/ })).toHaveAttribute("href", "/appearance/frame?scenario=physio");
    await expect(cards.first().getByTestId("start-design")).toHaveAttribute("href", "/onboarding?from=hollin-physio");
    await cards.first().locator("img").evaluate((img: HTMLImageElement) => img.decode());
    const stage = cards.first().locator(".design-stage");
    await stage.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `gallery-clinic-${width}.png`) });
    const surface = await stage.locator(".design-surface").boundingBox();
    const box = (await stage.boundingBox())!;
    expect(surface!.x).toBeGreaterThan(box.x + 10);
    expect(surface!.x + surface!.width).toBeLessThan(box.x + box.width - 10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Clear search" }).click();
    await search.fill("cafe");
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole("heading")).toHaveText("No. 6 Coffee");
    await search.fill("strength");
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole("heading")).toHaveText("Forge Strength");
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(cards).toHaveCount(EXAMPLES.length);
    await page.getByTestId("gallery-filters").getByText("Desktop", { exact: true }).click();
    await expect(page.getByTestId("gallery-list")).toHaveAttribute("data-view", "desktop");
    await cards.first().locator("img").evaluate((img: HTMLImageElement) => img.decode());
    await cards.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `gallery-desktop-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await search.fill("not-a-real-business");
    await expect(cards).toHaveCount(0);
    await expect(page.getByText("No matching designs.", { exact: false })).toBeVisible();
  });
}

for (const [slug, scenario, title, action] of [
  ["hollin-physio", "physio", "Hollin Physiotherapy", "Request an appointment"],
  ["forge-strength", "gym", "Forge Strength", "Book your free intro"],
]) {
  test(`${slug} is a working business with its own composition and clean adoption`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 950 });
    await page.goto(`/inspiration/${slug}`);
    const frame = page.frameLocator('[data-testid="design-preview-frame"]');
    await expect(frame.getByRole("heading", { level: 1 })).toHaveText(title!);
    await frame.getByRole("button", { name: action!, exact: true }).click();
    await expect(frame.getByTestId("booking-flow")).toBeVisible();
    if (scenario === "physio") await frame.getByTestId("bk-service").first().click();
    const close = frame.getByRole("button", { name: "Close", exact: true });
    await expect.poll(async () => (await close.boundingBox())?.y ?? 0).toBeGreaterThanOrEqual(64);
    await close.click();
    await expect(frame.getByTestId("booking-flow")).not.toBeVisible();
    await page.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `detail-${slug}.png`) });
    await page.getByTestId("start-design").click();
    await expect(page.getByTestId("from-example").last()).toContainText(title!);
    const state = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("taplo.demo.v2") ?? "null");
    });
    expect(state).toBeTruthy();
    const serial = JSON.stringify(state.content);
    expect(serial).not.toContain(title);
    expect(state.page.widgets.some((w: { type: string }) => w.type === "team")).toBe(true);
    expect(state.page.themeId).toBe(scenario === "physio" ? "open" : "forge");
    expect(state.page.appearance.header.layout).toBe(scenario === "physio" ? "editorial" : "feature");
  });
}

test("gallery search and new examples have no serious automated accessibility findings", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 950 });
  for (const route of ["/inspiration", "/inspiration/hollin-physio", "/inspiration/forge-strength"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (route !== "/inspiration") {
      await page.getByTestId("design-preview").scrollIntoViewIfNeeded();
      await expect(page.frameLocator('[data-testid="design-preview-frame"]').getByRole("heading", { level: 1 })).toBeVisible();
    }
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })), route).toEqual([]);
  }
});
