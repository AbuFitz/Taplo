import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { initialState } from "../../src/features/demo/store";
import { applyIndustry, setName } from "../../src/features/demo/actions";

for (const width of [320, 390, 1440]) {
  test(`category search and custom choice stay deliberate at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/onboarding");
    const search = page.getByRole("searchbox", {
      name: "Search or enter your business type",
    });
    await expect(search).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("category-picker.png"),
      fullPage: true,
    });
    await search.fill("mobile car deatailer");
    const results = page.getByRole("list", {
      name: "Matching kinds of business",
    });
    await expect(
      results.getByRole("button", { name: "Car detailing", exact: true }),
    ).toBeVisible();
    await results
      .getByRole("button", { name: "Car detailing", exact: true })
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: "Selected: Car detailing" }),
    ).toBeVisible();
    await search.fill("orbital mushroom curator");
    // Searching must not silently change the selected category.
    await expect(
      page.getByRole("status").filter({ hasText: "Selected: Car detailing" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: /Use “orbital mushroom curator”/ })
      .click();
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: "Selected: orbital mushroom curator" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(
      page.getByRole("textbox", { name: "Business name", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`shop owner adds a first product in Studio and sees it on their draft, ${scheme}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: scheme });
    if (scheme === "light") {
      await page.goto("/onboarding");
      await page
        .getByRole("button", { name: "Shop & handmade", exact: true })
        .click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByRole("textbox", { name: "Business name", exact: true })
        .fill("Moss Studio");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      for (let step = 0; step < 3; step++)
        await page.getByRole("button", { name: "Skip", exact: true }).click();
      await page
        .getByRole("button", { name: "Continue with Free", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Open Studio", exact: true })
        .click();
      await page.waitForURL("**/dashboard");
    } else {
      await page.goto("/dashboard");
      const draft = setName(
        applyIndustry(initialState(), "maker"),
        "Moss Studio",
      );
      draft.onboarded = true;
      draft.step = "finish";
      await page.evaluate(
        (value) => localStorage.setItem("taplo.demo.v2", JSON.stringify(value)),
        draft,
      );
      await page.reload();
    }
    const dock = page.getByRole("navigation", { name: "Studio", exact: true });
    await expect(
      dock.getByRole("link", { name: "Products", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Add your first product", exact: true })
      .click();
    const accessibility = await new AxeBuilder({ page })
      .include('[data-testid="first-offer-setup"]')
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath("studio-quick-setup.png"),
      fullPage: true,
    });
    await page
      .getByLabel("Product name", { exact: true })
      .fill("Stoneware cup");
    await page
      .getByRole("button", { name: "Add to your page", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText("Enter an amount");
    await expect(page.getByLabel("Amount (£)", { exact: true })).toBeFocused();
    await page.getByLabel("Amount (£)", { exact: true }).fill("18.50");
    await page
      .getByRole("button", { name: "Add to your page", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Stoneware cup is on your draft" }),
    ).toBeVisible();
    expect(page.url()).toContain("/dashboard");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/dashboard/products");
    await expect(
      page.getByText("Stoneware cup", { exact: true }).first(),
    ).toBeVisible();
    await page.goto("/demo/preview");
    await expect(
      page.getByRole("button", { name: /Stoneware cup/ }).first(),
    ).toBeVisible();
  });
}
