import { test, expect } from "@playwright/test";
import { openEditorWithSample, openDesignTask, previewFrame, selectPart } from "./helpers";

for (const width of [390, 1440]) {
  test(`starting looks render genuine pages and task navigation stays coherent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openEditorWithSample(page, "Barber");
    await selectPart(page, "page");
    await expect(page.getByRole("button", { name: "Page walkthrough", exact: true })).toHaveCount(1);
    await openDesignTask(page, "look");
    const choice = page.getByRole("radiogroup", { name: "Look", exact: true }).locator('label[data-choice="paper"]');
    await choice.scrollIntoViewIfNeeded();
    // The chooser must contain a rendered business page, never an absent /looks/paper.webp image.
    await expect(choice.locator('img[src="/looks/paper.webp"]')).toHaveCount(0);
    await expect(page.frameLocator('iframe[title="Paper starting look preview"]').locator("[data-taplo-page]")).toBeVisible();
    await choice.click();
    await expect(choice.locator('input[type="radio"]')).toBeChecked();
    await openDesignTask(page, "type");
    await expect(page.getByTestId("appearance-panel")).toHaveAttribute("data-design-task-active", "type");
    await openDesignTask(page, "look");
    await expect(choice.locator('input[type="radio"]')).toBeChecked();
    await expect(previewFrame(page).locator("[data-taplo-page]")).toBeAttached();
    if (width === 390) {
      // The complete profile mark remains in the short document viewport, rather than scrolling straight to the name.
      await expect.poll(() => previewFrame(page).locator(".tp-avatar").evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      })).toBe(true);
      const frame = await page.locator('iframe[title="Live preview of your page"]').boundingBox();
      const island = await page.locator('.mobile-studio-live .phone-island').boundingBox();
      expect(frame).not.toBeNull();
      expect(island).not.toBeNull();
      expect(frame!.y).toBeGreaterThanOrEqual(island!.y + island!.height);
    }
    await page.screenshot({ path: `shots/p02-look-chooser-${width}.png` });
  });
}

test("mobile block selection stays on the selected block after preview reframing settles", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openEditorWithSample(page, "Mechanic");
  await page.getByTestId("tab-content").click();
  await page.locator('[data-widget-row="faq"]').getByTestId("select-widget").click();
  const selected = previewFrame(page).locator('[data-widget="faq"][data-tp-selected]');
  await expect(selected).toBeAttached();
  // Wait beyond the preview's deferred 120ms focus message so a later header jump cannot give a false pass.
  await page.waitForTimeout(350);
  await expect.poll(() => selected.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.top < window.innerHeight;
  })).toBe(true);
  await page.screenshot({ path: "shots/p02-mobile-selected-block.png" });
});
