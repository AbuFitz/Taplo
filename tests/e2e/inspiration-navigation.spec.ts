import { test, expect } from "@playwright/test";

/** The designs page uses the same website header and footer as the rest of the site, at every width. */
for (const width of [320, 390, 768, 1440]) {
  test(`inspiration keeps website navigation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/inspiration", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "Taplo home" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Start free" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Pages for every kind of business." })).toBeVisible();
    const menu = page.getByRole("button", { name: "Open menu" });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole("link", { name: "Pricing", exact: true }).first().click();
    await expect(page).toHaveURL(/\/pricing$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("the inspiration page shows no horizontal scroll and a single category rail", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/inspiration", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.getByRole("group", { name: "Business type" }).count()).toBe(1);
  }
});
