import { expect, test } from "@playwright/test";
import { openEditorWithSample, selectPart, openSection } from "./helpers";
for (const width of [390, 1440])
  test(`finish history, photo cancellation and service rules preserve data at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openEditorWithSample(page);
    await selectPart(page, "page");
    await openSection(page, /^Wallpaper/);
    const state = () =>
      page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));
    const before = await state();
    await page
      .getByRole("radio", { name: "Midnight flow", exact: true })
      .check();
    await expect
      .poll(async () => (await state()).page.appearance?.background?.kind)
      .toBe("shader");
    await page.getByTestId("undo").click();
    await expect
      .poll(async () => JSON.stringify((await state()).page.appearance))
      .toBe(JSON.stringify(before.page.appearance));
    await page.getByTestId("redo").click();
    await expect
      .poll(async () => (await state()).page.appearance?.background?.kind)
      .toBe("shader");
    await openSection(page, /^Fine-tune background/);
    await page
      .getByRole("radiogroup", { name: "Wallpaper", exact: true })
      .getByText("Photo", { exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Cancel photo", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Cancel photo", exact: true })
      .click();
    expect((await state()).page.appearance.background.kind).toBe("shader");
    await page.goto("/dashboard/bookings?section=availability");
    await openSection(page, /^Rules for a specific service/);
    await page
      .getByRole("button", { name: /^Edit rules for/ })
      .first()
      .click();
    const dialog = page.getByTestId("service-rules-editor");
    await dialog.getByLabel("Buffer before (minutes)").fill("15");
    await dialog.getByLabel("People per time").fill("2");
    await dialog
      .getByRole("button", { name: "Save service rules", exact: true })
      .click();
    await page.reload();
    await openSection(page, /^Rules for a specific service/);
    await page
      .getByRole("button", { name: /^Edit rules for/ })
      .first()
      .click();
    await expect(dialog.getByLabel("Buffer before (minutes)")).toHaveValue(
      "15",
    );
    await expect(dialog.getByLabel("People per time")).toHaveValue("2");
    await dialog
      .getByRole("button", { name: "Use default rules", exact: true })
      .click();
    await page
      .getByRole("button", { name: /^Edit rules for/ })
      .first()
      .click();
    await expect(dialog.getByLabel("Buffer before (minutes)")).toHaveValue("");
    await expect(dialog.getByLabel("People per time")).toHaveValue("1");
  });
