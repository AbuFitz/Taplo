import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768, 1440]) {
  test(`inspiration keeps website navigation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/inspiration");
    const header = page.getByRole("banner", { name: "Taplo website" });
    await expect(
      header.getByRole("link", { name: "Taplo home" }),
    ).toBeVisible();
    await expect(
      header.getByRole("link", { name: "Start free" }),
    ).toBeVisible();
    if (width < 768) {
      await header.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog", { name: "Taplo menu" });
      await expect(menu).toBeVisible();
      await expect(
        menu.getByRole("link", { name: /Services and prices/ }),
      ).toBeVisible();
      await menu.getByRole("button", { name: "Close menu" }).click();
      await expect(
        header.getByRole("button", { name: "Open menu" }),
      ).toBeFocused();
    } else {
      await header
        .getByRole("button", { name: "Product", exact: true })
        .click();
      await expect(
        header.getByRole("link", { name: /Services/ }).first(),
      ).toBeVisible();
      await page.keyboard.press("Escape");
    }
    await expect(page.getByTestId("design-card").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `work/inspiration-nav-${width}.png` });
  });
}
