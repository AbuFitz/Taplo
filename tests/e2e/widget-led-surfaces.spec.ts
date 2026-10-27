import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
for (const width of [320, 390, 768, 1440])
  test(`orbital widgets, cropped hero and sharing stack fit at ${width}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const orbit = page.getByTestId("widget-orbit");
    await orbit.scrollIntoViewIfNeeded();
    await expect(orbit.locator(".widget-orbit-item")).toHaveCount(4);
    await expect(orbit.locator("video,canvas")).toHaveCount(0);
    await expect(orbit.locator(".widget-orbit-item").first()).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(orbit.locator("a,button")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (process.env.TAPLO_REVIEW_DIR)
      await orbit.screenshot({
        path: path.join(process.env.TAPLO_REVIEW_DIR, `orbit-${width}.png`),
      });
    await page.goto("/product/sharing");
    const plaque = page.getByTestId("plaque-experience");
    await plaque.scrollIntoViewIfNeeded();
    await expect(plaque.locator(".plaque-stack-layer")).toHaveCount(2);
    await expect(plaque.getByRole("button")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (process.env.TAPLO_REVIEW_DIR)
      await plaque.screenshot({
        path: path.join(process.env.TAPLO_REVIEW_DIR, `plaque-${width}.png`),
      });
    expect(errors).toEqual([]);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.goto("/inspiration");
    await expect(page.locator(".design-library>.liquid-light")).toHaveCount(0);
    await expect(page.getByRole("group", { name: "Business type" }).getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("orbit runs only while visible, keeps all block content, without unnecessary controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const orbit = page.getByTestId("widget-orbit");
  await orbit.scrollIntoViewIfNeeded();
  await expect(orbit).toHaveAttribute("data-active", "true");
  const first = await orbit
    .locator(".widget-orbit-item")
    .first()
    .evaluate((el) => getComputedStyle(el).translate);
  await page.waitForTimeout(400);
  expect(
    await orbit
      .locator(".widget-orbit-item")
      .first()
      .evaluate((el) => getComputedStyle(el).translate),
  ).not.toBe(first);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(orbit).toHaveAttribute("data-active", "false");
  await orbit.scrollIntoViewIfNeeded();
  await expect(orbit).toHaveAttribute("data-active", "true");
  await expect(orbit.locator("a,button")).toHaveCount(0);
});

test("the plaque tilts directly and settles when interaction leaves the section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/product/sharing");
  const stage = page.locator(".plaque-stage");
  await stage.scrollIntoViewIfNeeded();
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3);
  await expect(stage).toHaveAttribute("data-engaged", "true");
  await expect
    .poll(() =>
      stage
        .locator(".plaque-object")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe("none");
  await page.mouse.move(2, 2); // the pointer leaves, so only the keyboard is steering from here
  await expect(stage).toHaveAttribute("data-engaged", "false");
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  await expect(stage).toHaveAttribute("data-engaged", "true");
  await page.keyboard.press("Escape");
  await expect(stage).toHaveAttribute("data-engaged", "false");
  await page.keyboard.press("ArrowRight");
  await expect(stage).toHaveAttribute("data-engaged", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(stage).toHaveAttribute("data-engaged", "false");
});
