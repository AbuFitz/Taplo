import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440])
  test(`editorial hero is illustrated, cropped and responsive at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.getByTestId("hero-showcase");
    await expect(hero.locator("iframe")).toHaveCount(0);
    await expect(hero.locator(".phone-hardware")).toHaveCount(1);
    await expect(hero.locator(".phone-key")).toHaveCount(4);
    await expect(hero.locator("button")).toHaveCount(0);
    await expect(
      page.getByRole("group", { name: "Try a business design" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("group", { name: "Explore page features" }),
    ).toHaveCount(0);
    await expect(hero.getByTestId("hero-browser-illustration")).toHaveCount(
      width >= 900 ? 1 : 0,
    );
    const phone = hero.getByTestId("hero-phone-illustration");
    const before = await phone.evaluate((el) => getComputedStyle(el).transform);
    await hero.locator(".hero-showcase-canvas").hover();
    await expect(phone).toHaveCSS("transform", before);
    await expect(hero.locator(".hero-blueprint")).toHaveCount(0);
    const images = hero.locator("img");
    for (const img of await images.all())
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
        .toBeGreaterThan(0);
    await hero.scrollIntoViewIfNeeded();
    const art = await hero.locator(".hero-showcase-canvas").boundingBox(),
      caption = await hero.locator("figcaption").boundingBox();
    expect(caption!.y).toBeGreaterThanOrEqual(art!.y + art!.height - 1);
    const result = await new AxeBuilder({ page })
      .include('[data-testid="hero-showcase"]')
      .analyze();
    expect(result.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.screenshot({ path: `work/hero-editorial-page-${width}.png` });
    await hero.screenshot({ path: `work/hero-editorial-${width}.png` });
    const booking = page.getByTestId("home-booking");
    await booking.scrollIntoViewIfNeeded();
    await expect(booking.locator("img,iframe")).toHaveCount(0);
    await expect(
      booking.getByRole("img", {
        name: "Illustration of choosing a service and a time",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      booking.getByRole("link", { name: "Try a booking", exact: true }),
    ).toHaveAttribute("href", "/product/booking#try-booking");
    await booking.screenshot({
      path: `work/booking-illustration-${width}.png`,
    });
    await hero
      .getByRole("link", { name: "Find your look", exact: true })
      .click();
    await expect(page).toHaveURL(/\/inspiration$/);
  });
for (const width of [320, 390, 768, 1440])
  test(`illustrated motion scene has a composed reduced-motion view at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const scene = page.getByTestId("widget-orbit");
    await scene.scrollIntoViewIfNeeded();
    await expect(scene.locator("iframe,video,canvas")).toHaveCount(0);
    await expect(scene.locator(".widget-orbit-item")).toHaveCount(4);
    await expect(scene.locator(".orbit-ceramic-object")).toHaveCount(0);
    await expect(scene).toHaveAttribute("data-active", "false");
    const result = await new AxeBuilder({ page })
      .include('[data-testid="widget-orbit"]')
      .analyze();
    expect(result.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await scene.screenshot({ path: `work/motion-editorial-${width}.png` });
    await scene
      .getByRole("link", { name: "Explore the blocks", exact: true })
      .click();
    await expect(page).toHaveURL(/\/product$/);
  });
for (const width of [390, 1440])
  test(`motion scene moves gently, pauses offscreen and resumes at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const scene = page.getByTestId("widget-orbit");
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-active", "true");
    const item = scene.locator(".widget-orbit-item").first();
    const before = await item.evaluate((el) => getComputedStyle(el).transform);
    await expect
      .poll(() => item.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(before);
    const boxes = await scene.locator(".widget-orbit-item").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, right: r.right };
      }),
    );
    for (const box of boxes) {
      expect(box.x).toBeGreaterThan(-5);
      expect(box.right).toBeLessThan(width + 5);
    }
    await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-active", "false");
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-active", "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(scene).toHaveAttribute("data-active", "false");
  });
