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
    await page.screenshot({ path: `shots/p02-look-chooser-${width}.png` });
  });
}
