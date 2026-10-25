import { expect, test } from "@playwright/test";
for (const width of [390, 1440])
  test(`relevant design alternatives open correctly at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/inspiration/harris-cars");
    const related = page.getByRole("region", { name: "Related designs" });
    await expect(
      related.getByRole("link", { name: /Midnight/ }),
    ).toHaveAttribute("href", "/inspiration/detail-dept");
    await expect(
      related.getByRole("link", { name: /Orchard/ }),
    ).toHaveAttribute("href", "/inspiration/dans-home-repairs");
    await related.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.screenshot({ path: `work/related-designs-${width}.png` });
    await related.getByRole("link", { name: /Midnight/ }).click();
    await expect(page).toHaveURL(/\/inspiration\/detail-dept$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Midnight",
    );
  });
