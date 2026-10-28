import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { cont } from "./helpers";
for (const width of [320, 390, 768])
  test(`setup sheet reveals the actual page and preserves the form at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/onboarding");
    await page
      .getByLabel("Business name", { exact: true })
      .fill("North Studio");
    const frame = page.getByTestId("setup-live-page");
    await expect(frame).toHaveAttribute("data-loaded", "true");
    const grip = page.getByRole("button", {
      name: "Show more of your page",
      exact: true,
    });
    const panel = page.locator(".setup-panel");
    const before = (await panel.boundingBox())!.height;
    await grip.click();
    await expect(panel).toHaveAttribute("data-sheet", "preview");
    await expect(
      page.getByLabel("Business name", { exact: true }),
    ).toBeHidden();
    await expect(frame).toHaveAttribute("data-loaded", "true");
    await page
      .getByRole("button", { name: "Return to editing", exact: true })
      .click();
    await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
      "North Studio",
    );
    await grip.focus();
    await page.keyboard.press("ArrowUp");
    await expect(panel).toHaveAttribute("data-sheet", "expanded");
    await expect
      .poll(async () => (await panel.boundingBox())!.height)
      .toBeGreaterThan(before + 60);
    await page.keyboard.press("ArrowDown");
    await expect(panel).toHaveAttribute("data-sheet", "edit");
    await expect
      .poll(async () => Math.abs((await panel.boundingBox())!.height - before))
      .toBeLessThan(2);
    await grip.hover();
    const box = (await grip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 430, {
      steps: 12,
    });
    await page.mouse.up();
    await expect(panel).toHaveAttribute("data-sheet", "preview");
    await page
      .getByRole("button", { name: "Return to editing", exact: true })
      .click();
    await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
      "North Studio",
    );
    await cont(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "What do you do?",
    );
    await expect(grip).toBeVisible();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
      "North Studio",
    );
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollHeight <= innerHeight + 1 &&
          document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page }).include(".setup-flow").analyze();
    expect(axe.violations).toEqual([]);
    await page.screenshot({ path: `work/setup-sheet-${width}.png` });
  });
test("sheet state never hides or disables desktop fields after resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/onboarding");
  await page.getByLabel("Business name", { exact: true }).fill("North Studio");
  await page.getByRole("button", { name: "Show more of your page" }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(
    page.getByRole("button", { name: "Return to editing" }),
  ).toBeHidden();
  await page
    .getByLabel("Business name", { exact: true })
    .fill("North Studio Desktop");
  await expect(page.locator("#setup-controls")).not.toHaveAttribute("inert");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Choose a look.",
  );
});
test("reduced motion removes sheet travel without dropping edits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/onboarding");
  await page.getByLabel("Business name", { exact: true }).fill("North Studio");
  await page.getByRole("button", { name: "Show more of your page" }).click();
  await expect(page.locator(".setup-panel")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.getByRole("button", { name: "Return to editing" }).click();
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
    "North Studio",
  );
});
