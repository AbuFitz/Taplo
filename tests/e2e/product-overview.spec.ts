import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PRODUCT_LINKS } from "../../src/features/marketing/ia";

for (const width of [320, 390, 768, 1440]) {
  test(`product overview keeps all business journeys coherent at ${width}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/product");
    const experience = page.getByTestId("product-experience");
    await experience.scrollIntoViewIfNeeded();
    for (const choice of [
      {
        label: "Clinic",
        name: "Hollin Physio",
        slug: "hollin-physio",
        scenario: "physio",
      },
      {
        label: "Café",
        name: "No. 6 Coffee",
        slug: "no-6-coffee",
        scenario: "corner",
      },
      {
        label: "Trades",
        name: "Dan’s Home Repairs",
        slug: "dans-home-repairs",
        scenario: "oakfield",
      },
      {
        label: "Car dealer",
        name: "Harris Cars",
        slug: "harris-cars",
        scenario: "brookfield",
      },
    ]) {
      const before = await experience.boundingBox();
      const scroll = await page.evaluate(() => scrollY);
      await experience
        .getByRole("radio", { name: choice.label, exact: true })
        .check();
      await expect(
        experience.getByText(choice.name, { exact: true }),
      ).toBeVisible();
      await expect(page.getByTestId("product-demo")).toHaveAttribute(
        "href",
        `/inspiration/${choice.slug}`,
      );
      await expect(page.getByTestId("product-adopt")).toHaveAttribute(
        "href",
        `/onboarding?from=${choice.slug}`,
      );
      await expect(experience.locator("iframe")).toHaveAttribute(
        "src",
        `/appearance/frame?scenario=${choice.scenario}`,
      );
      await expect(experience.locator("iframe")).toHaveAttribute(
        "data-loaded",
        "true",
      );
      expect(
        Math.abs((await experience.boundingBox())!.height - before!.height),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs((await page.evaluate(() => scrollY)) - scroll),
      ).toBeLessThanOrEqual(1);
    }
    const directory = page.getByRole("navigation", {
      name: "All product features",
    });
    for (const link of PRODUCT_LINKS)
      await expect(
        directory.getByRole("link", { name: new RegExp(`^${link.label}`) }),
      ).toHaveAttribute("href", link.href);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("business choices support keyboard, reduced motion and accessible content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/product");
  const experience = page.getByTestId("product-experience");
  await experience.getByRole("radio", { name: "Clinic", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    experience.getByRole("radio", { name: "Café", exact: true }),
  ).toBeChecked();
  await expect(page.locator(".product-atlas-phone-slot")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(
    page.locator(".product-atlas-light .liquid-light"),
  ).toHaveAttribute("data-reduced-motion", "true");
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations).toEqual([]);
  await page.getByTestId("product-demo").click();
  await expect(page).toHaveURL(/\/inspiration\/no-6-coffee$/);
});
