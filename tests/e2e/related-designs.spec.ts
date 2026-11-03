import { expect, test } from "@playwright/test";
for (const width of [390, 1440])
  test(`relevant design alternatives open correctly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/inspiration/harris-cars", { waitUntil: "networkidle" });
    const related = page.getByRole("region", { name: "Related designs" });
    const links = related.locator("ul a");
    await expect(links).toHaveCount(3);
    // The first alternative is the nearest kind of business, and says which design it wears.
    await expect(links.first()).toContainText(/Motoring|Car|valet|repair|mechanic/i);
    await related.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const target = await links.first().getAttribute("href");
    await links.first().click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("");
  });
