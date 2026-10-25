import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 1440]) {
  test(`top menu and anonymous actions stay coherent at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/product/vehicles");
    await expect(page.getByRole("link", { name: "Open Studio" })).toHaveCount(
      0,
    );
    await expect(page.locator(".site-thumb-dock")).toHaveCount(0);
    await expect(
      page.locator("header").getByRole("link", { name: "Start free" }),
    ).toBeVisible();
    if (width < 768) {
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      const menu = page.getByRole("dialog", { name: "Taplo menu" });
      await menu.getByRole("button", { name: "Designs", exact: true }).click();
      await expect(
        menu.getByRole("link", {
          name: "Clinics and practitioners",
          exact: true,
        }),
      ).toBeVisible();
      await expect(menu.locator("#mobile-product-links")).toBeHidden();
      const axe = await new AxeBuilder({ page })
        .include(".site-feature-sheet")
        .analyze();
      expect(axe.violations).toEqual([]);
      await menu
        .getByRole("link", { name: "Clinics and practitioners", exact: true })
        .click();
      await expect(page).toHaveURL(/inspiration\?industry=health/);
      await expect(page.getByRole("dialog")).toBeHidden();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}
for (const slug of [
  "design",
  "enquiries",
  "messages",
  "team",
  "products",
  "vehicles",
  "gallery-reviews",
  "booking",
]) {
  test(`${slug} has a working interactive hero and real destination`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.goto(`/product/${slug}`);
    const demo = page.getByTestId(`feature-demo-${slug}`);
    await expect(demo).toBeVisible();
    const radio = demo.getByRole("radio");
    await radio.nth(2).check();
    await expect(radio.nth(2)).toBeChecked();
    await expect(demo.locator(".feature-demo-card")).toHaveCount(1);
    await expect(demo.locator(".feature-demo-action")).toHaveAttribute(
      "href",
      slug === "booking" ? "#try-booking" : /\/inspiration|\/product/,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390);
    expect(
      (
        await new AxeBuilder({ page })
          .include(`[data-testid="feature-demo-${slug}"]`)
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}
test("home uses composed illustrations with shared hardware and working design discovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hero = page.getByTestId("hero-showcase");
  await expect(hero.locator(".phone-hardware")).toBeVisible();
  await expect(hero.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore designs", exact: true }),
  ).toHaveAttribute("href", "/inspiration");
  await expect(
    page.getByRole("group", { name: "Explore page features" }),
  ).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test("gallery mounts real renderer previews with current hardware", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/inspiration");
  const first = page.getByTestId("design-card").first();
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator("iframe")).toHaveAttribute(
    "src",
    /\/appearance\/frame\?scenario=/,
  );
  await expect(first.locator(".phone-hardware")).toBeVisible();
  await page.getByRole("radio", { name: "Desktop", exact: true }).check();
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator(".browser-shell")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test("mobile plan buttons scroll the full card and carry the selected plan to setup", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await page
    .getByRole("group", { name: "Choose a plan", exact: true })
    .getByRole("button", { name: "Business", exact: true })
    .click();
  const card = page.locator('.pricing-plans > [data-plan="business"]');
  await expect(card).toHaveAttribute("data-selected", "true");
  await expect
    .poll(async () => (await card.boundingBox())!.x)
    .toBeGreaterThanOrEqual(0);
  await expect.poll(async () => (await card.boundingBox())!.x).toBeLessThan(40);
  await card
    .getByRole("link", { name: "Start with Business" })
    .scrollIntoViewIfNeeded();
  await expect(
    card.getByRole("link", { name: "Start with Business" }),
  ).toBeInViewport();
  await card.getByRole("link", { name: "Start with Business" }).click();
  await expect(page).toHaveURL(/onboarding\?plan=business/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
