import { test, expect } from "@playwright/test";
for (const width of [390, 1440]) {
  test(`decorative media stays non-selectable and pricing has its own readable palette at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const scene = page.getByTestId("widget-orbit");
    await scene.scrollIntoViewIfNeeded();
    await expect(scene.locator(".widget-orbit-world")).toHaveCSS(
      "user-select",
      "none",
    );
    await expect(scene.locator(".orbit-sculpture img")).toHaveAttribute(
      "src",
      /concept-ceramic/,
    );
    await expect
      .poll(() =>
        scene
          .locator(".orbit-sculpture img")
          .evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
      )
      .toBe(true);
    const name = scene.locator(".orbit-profile-name");
    const box = (await name.boundingBox())!;
    await page.evaluate(() => getSelection()?.removeAllRanges());
    await page.mouse.move(box.x + 2, box.y + box.height / 3);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 2, box.y + box.height / 3, {
      steps: 8,
    });
    await page.mouse.up();
    expect(await page.evaluate(() => getSelection()?.toString())).toBe("");
    const plans = page.getByTestId("home-plans");
    await plans.scrollIntoViewIfNeeded();
    await expect(plans).toHaveCSS("background-color", "rgb(232, 238, 242)");
    await expect(plans.locator("[data-plan]")).toHaveCount(4);
    await plans.screenshot({ path: `work/home-plans-final-${width}.png` });
    await page.goto("/product/sharing");
    await expect(page.locator(".plaque-object")).toHaveCSS(
      "user-select",
      "none",
    );
    const plaque = page.getByTestId("plaque-experience");
    await plaque.screenshot({ path: `work/plaque-nonselect-${width}.png` });
  });
}
