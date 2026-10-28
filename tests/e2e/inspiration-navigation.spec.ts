import { test, expect } from "@playwright/test";

/** The designs area has its own framed header: the way home, the other main places, and Start free, at every width. */
for (const width of [320, 390, 768, 1440]) {
  test(`inspiration keeps website navigation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/inspiration", { waitUntil: "networkidle" });
    const header = page.getByRole("banner", { name: "Taplo website" });
    await expect(header.getByRole("link", { name: "Taplo home" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Start free" })).toBeVisible();
    for (const name of ["Product", "Pricing"]) await expect(header.getByRole("link", { name, exact: true })).toBeVisible();
    await header.getByRole("link", { name: "Pricing", exact: true }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
