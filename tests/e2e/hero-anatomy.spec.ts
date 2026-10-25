import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 1440])
  test(`hero block view uses actual public content and preserves the page at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator(".hero-live-stage");
    await hero.scrollIntoViewIfNeeded();
    const iframe = hero.locator(".hero-live-phone iframe");
    await expect(iframe).toHaveAttribute("data-loaded", "true");
    const origin = await iframe.evaluate(
      (element: HTMLIFrameElement) =>
        element.contentWindow!.performance.timeOrigin,
    );
    await hero
      .getByRole("button", { name: "See the blocks", exact: true })
      .click();
    const blocks = hero.getByTestId("hero-page-blocks");
    await expect(blocks).toHaveAttribute("aria-hidden", "false");
    await expect(blocks).toBeVisible();
    const title = await blocks
      .locator('article[data-kind="products"] li>span:first-child')
      .first()
      .innerText();
    await expect(
      page
        .frameLocator(".hero-live-phone iframe")
        .getByText(title, { exact: true })
        .first(),
    ).toBeAttached();
    await expect(blocks).not.toContainText(
      /Slot reserved|Synced|Live bookings|Today ·/,
    );
    await expect(
      hero.getByRole("link", { name: "Explore this page", exact: true }),
    ).toHaveAttribute("href", "/inspiration/harris-cars");
    const axe = await new AxeBuilder({ page })
      .include(".hero-live-stage")
      .analyze();
    expect(axe.violations).toEqual([]);
    await hero
      .getByRole("button", { name: "See the page", exact: true })
      .click();
    await expect(blocks).toHaveAttribute("aria-hidden", "true");
    expect(
      await iframe.evaluate(
        (element: HTMLIFrameElement) =>
          element.contentWindow!.performance.timeOrigin,
      ),
    ).toBe(origin);
    await page.screenshot({ path: `work/hero-steady-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("hero stays steady on hover and changes only through the explicit controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const stage = page.locator(".hero-composition");
  await stage.scrollIntoViewIfNeeded();
  await stage.hover();
  const blocks = page.getByTestId("hero-page-blocks");
  await expect(blocks).toHaveCSS("visibility", "hidden");
  await expect(blocks).toHaveCSS("mask-image", "none");
  await page.mouse.move(1, 1);
  await expect(blocks).toHaveCSS("visibility", "hidden");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "See the blocks", exact: true })
    .click();
  await expect(blocks).toHaveAttribute("aria-hidden", "false");
  await expect
    .poll(() => blocks.evaluate((el) => getComputedStyle(el).transform))
    .toBe("none");
  await page.getByRole("button", { name: "See the page", exact: true }).click();
});
