import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { isEngineNoise } from "./helpers";
for (const width of [320, 390, 768, 1440])
  test(`direct inspiration and freeform pages work at ${width}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => !isEngineNoise(e.message) && errors.push(e.message));
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/inspiration");
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pages for every kind of business.",
    );
    await page.screenshot({ path: `work/inspo-direct-${width}.png` });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.goto("/");
    const capture = page.getByTestId("hero-showcase").locator("img");
    await expect
      .poll(() => capture.evaluate((e: HTMLImageElement) => e.naturalWidth))
      .toBeGreaterThan(0);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByText("Can I keep my existing website?", { exact: true })
      .click();
    await expect(
      page.getByText(
        "Yes. Add a link to your website, shop or booking service. Use Taplo alongside the tools you already have.",
        { exact: true },
      ),
    ).toBeVisible();
    await page
      .getByText("Can I keep my existing website?", { exact: true })
      .click();
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth))
        .toBeGreaterThan(0);
    }
    await page.screenshot({
      path: `work/how-freeform-${width}.png`,
      fullPage: true,
    });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(errors).toEqual([]);
  });
test("QR sharing product page remains available", async ({ page }) => {
  await page.goto("/product/sharing");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
