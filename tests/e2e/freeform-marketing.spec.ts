import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440])
  test(`direct inspiration and freeform pages work at ${width}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/inspiration");
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Design inspiration",
    );
    const first = page.getByTestId("design-card").first();
    await expect(first).toBeVisible();
    const mainTop = (await page.locator("main").boundingBox())!.y;
    expect((await first.boundingBox())!.y - mainTop).toBeLessThan(170);
    await expect(first.locator("iframe")).toHaveAttribute(
      "data-loaded",
      "true",
    );
    await page.screenshot({ path: `work/inspo-direct-${width}.png` });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole("searchbox", { name: "Find a design" }).fill("Maya");
    await expect(page.getByTestId("design-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.getByTestId("design-card")).toHaveCount(12);
    await page.goto("/");
    await expect(page.locator(".hero-showcase-offer")).toHaveCount(0);
    const capture = page.getByTestId("hero-showcase").locator("img");
    await expect(capture).toHaveAttribute(
      "src",
      "/marketing/detail-dept-hero.png",
    );
    await expect
      .poll(() => capture.evaluate((e: HTMLImageElement) => e.naturalWidth))
      .toBe(1170);
    await expect(page.getByTestId("service-pricing-demo")).toHaveCount(0);
    await expect(
      page.getByText("Make a little time.", { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText("conversation.", { exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByTestId("home-work")).toHaveCount(0);
    await expect(page.locator("#sharing-h")).toHaveCount(0);
    await page.getByTestId("home-booking").scrollIntoViewIfNeeded();
    await expect(page.locator(".booking-art-service > strong")).toHaveText(
      "Initialassessment.",
    );
    await page
      .getByTestId("home-booking")
      .screenshot({ path: `work/booking-clear-${width}.png` });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Set up yourTaplo page.",
    );
    await expect(page.getByTestId("setup-story")).toHaveCount(0);
    await expect(
      page.locator(".how-editorial [data-scroll-reveal]"),
    ).toHaveCount(9);
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
