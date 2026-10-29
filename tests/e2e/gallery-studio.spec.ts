import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`the gallery shows whole handsets and filters them at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/inspiration");
    const cards = page.getByTestId("design-card");
    await expect.poll(() => cards.count()).toBeGreaterThan(40);
    // One handset everywhere: every card is the same 390 x 844 hardware scaled down, never cropped.
    const ratios = await page.locator(".scaled-phone").evaluateAll((els) => els.slice(0, 8).map((e) => +(e.getBoundingClientRect().width / e.getBoundingClientRect().height).toFixed(2)));
    for (const r of ratios) expect(r).toBeCloseTo(402 / 856, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

    const total = await cards.count();
    await page.getByRole("button", { name: "Trades & auto", exact: true }).click();
    const trades = await cards.count();
    expect(trades).toBeGreaterThan(3);
    expect(trades).toBeLessThan(total);
    // Arrangement and look live in the Style sheet.
    await page.getByRole("button", { name: "Style the examples" }).click();
    await page.getByTestId("style-sheet").getByRole("radio", { name: /Floating Bento/ }).click();
    await page.getByTestId("style-sheet").getByRole("button", { name: /Show \d+ page/ }).click();
    expect(await cards.count()).toBeLessThanOrEqual(trades);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await page.getByRole("searchbox", { name: "Search pages" }).fill("taco");
    await expect(cards).toHaveCount(1);
    await page.getByRole("searchbox", { name: "Search pages" }).fill("zzzz");
    await expect(page.getByText("Nothing matches")).toBeVisible();
  });
}

test("opening a page offers the demo, and using a design starts setup on that design", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/inspiration");
  await page.evaluate(() => localStorage.clear());
  await page.getByRole("searchbox", { name: "Search pages" }).fill("Jay");
  await page.getByRole("button", { name: /Jay.s Barbers, open this page/ }).click();
  const detail = page.getByTestId("design-detail");
  await expect(detail.getByRole("link", { name: "Open the demo" })).toBeVisible();
  await expect(detail.locator("dd", { hasText: "Curved cover" })).toBeVisible();
  await detail.getByRole("link", { name: /Start with the .* design/ }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await expect(page.getByTestId("from-design")).toContainText("Starting with");
  // The draft is dressed from the first step: the chosen arrangement and design are on the preview.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));
  expect(saved.page.themeId).toBe("paper");
  expect(saved.page.appearance.header.layout).toBe("split");
});

test("the gallery has no serious accessibility findings", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/inspiration");
  await expect(page.getByTestId("design-card").first()).toBeVisible();
  const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]).exclude(".scaled-phone").analyze();
  expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
});
