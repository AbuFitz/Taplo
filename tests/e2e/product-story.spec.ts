import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
for (const width of [320, 390, 768, 1440])
  test(`transparent product story is useful and opens each working demo at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const story = page.getByTestId("product-story");
    await story.scrollIntoViewIfNeeded();
    await expect(story).toHaveAttribute("data-running", "false");
    await expect(story.locator("video")).toHaveCount(0);
    expect(
      await story.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe("rgba(0, 0, 0, 0)");
    for (const [label, id, slug] of [
      ["Detailing", "detail", "detail-dept"],
      ["Vehicle sales", "stock", "harris-cars"],
      ["Cafés", "menu", "no-6-coffee"],
    ]) {
      await story.getByRole("button", { name: label, exact: true }).click();
      await expect(story).toHaveAttribute("data-story", id);
      const link = story.locator(".product-story-action");
      await expect(link).toHaveAttribute("href", `/inspiration/${slug}`);
      await expect(story.locator(".product-story-surface img")).toBeVisible();
      await expect
        .poll(() =>
          story
            .locator("img")
            .evaluateAll((imgs) =>
              imgs.every(
                (i) =>
                  (i as HTMLImageElement).complete &&
                  (i as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const surface=(await story.locator('.product-story-surface').boundingBox())!;
      const image=(await story.locator('.product-story-surface img').boundingBox())!;
      expect(image.height).toBeLessThanOrEqual(surface.height+1);
      await story.screenshot({
        path: path.join(
          process.env.TAPLO_REVIEW_DIR ?? "test-results",
          `story-${id}-${width}.png`,
        ),
      });
    }
    const results = await new AxeBuilder({ page })
      .include('[data-testid="product-story"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await story.locator(".product-story-action").click();
    await expect(page).toHaveURL(/\/inspiration\/no-6-coffee$/);
    await expect(page.getByTestId("design-preview")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open full page" }),
    ).toHaveAttribute("href", "/appearance/frame?scenario=corner");
  });
test("story progresses slowly only in view; interaction and reduced motion stop automatic changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const story = page.getByTestId("product-story");
  await story.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(story).toHaveAttribute("data-running", "true");
  await page.clock.runFor(9000);
  await expect(story).toHaveAttribute("data-story", "detail");
  await page.clock.runFor(2100);
  await expect(story).toHaveAttribute("data-story", "stock");
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-running", "false");
  await page.clock.runFor(12000);
  await expect(story).toHaveAttribute("data-story", "stock");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-running", "true");
  await story.hover();
  await expect(story).toHaveAttribute("data-running", "false");
  await page.clock.runFor(12000);
  await expect(story).toHaveAttribute("data-story", "stock");
  await story.getByRole("button", { name: "Cafés", exact: true }).click();
  await page.mouse.move(1, 1);
  await page.getByRole("heading", { level: 1 }).click();
  await expect(story).toHaveAttribute("data-story", "menu");
  await page.clock.runFor(12000);
  await expect(story).toHaveAttribute("data-story", "menu");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story).toHaveAttribute("data-running", "false");
});
test("the same transparent composition sits cleanly on a light canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 950 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const story = page.getByTestId("product-story");
  await story.scrollIntoViewIfNeeded();
  await story.evaluate((el) => {
    el.style.color = "#111";
    el.parentElement!.style.background = "#fff";
    el.parentElement!.style.padding = "24px";
  });
  for (const [label, id] of [
    ["Detailing", "detail"],
    ["Vehicle sales", "stock"],
    ["Cafés", "menu"],
  ]) {
    await story.getByRole("button", { name: label, exact: true }).click();
    await expect
      .poll(() =>
        story
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every(
              (i) =>
                (i as HTMLImageElement).complete &&
                (i as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await story.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `story-${id}-light-390.png`,
      ),
    });
  }
  const result = await new AxeBuilder({ page })
    .include('[data-testid="product-story"]')
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
});
