import { expect, test } from "@playwright/test";
import { openEditorWithSample } from "./helpers";
for (const width of [320, 768, 1440])
  test(`workspace routes and focused editors fit ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openEditorWithSample(page, "Car dealer");
    for (const route of [
      "",
      "/services",
      "/products",
      "/team",
      "/reviews",
      "/analytics",
      "/settings",
    ]) {
      await page.goto(`/dashboard${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Open menu", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
    await page.goto("/dashboard/products");
    await page.getByRole("button", { name: "Add item", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("radio", { name: "Vehicle", exact: true }),
    ).toBeChecked();
    await dialog.getByLabel("Name", { exact: true }).fill("Volvo XC40 test");
    await dialog
      .getByRole("button", { name: "Save product", exact: true })
      .click();
    await page.reload();
    await expect(
      page.getByText("Volvo XC40 test", { exact: true }),
    ).toBeVisible();
    await page.goto("/dashboard/services");
    await page
      .getByRole("button", { name: "Add service", exact: true })
      .click();
    await dialog
      .getByLabel("Service name", { exact: true })
      .fill("Pre-purchase inspection");
    await dialog
      .getByRole("button", { name: "Save service", exact: true })
      .click();
    await page.reload();
    await expect(
      page.getByText("Pre-purchase inspection", { exact: true }),
    ).toBeVisible();
  });
