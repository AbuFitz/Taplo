import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440])
  test(`master navigation works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const header = page.getByRole("banner", { name: "Taplo website" });
    const dock = page.getByRole("navigation", {
      name: "Mobile navigation",
      exact: true,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(dock).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Open Studio" })).toHaveCount(
      0,
    );
    await expect(
      header.getByRole("link", { name: "Start free" }),
    ).toBeVisible();
    await expect(header.getByRole("button", { name: "Open menu" })).toHaveCount(
      0,
    );
    const product = header.getByRole("button", {
      name: "Product",
      exact: true,
    });
    await product.click();
    for (const slug of [
      "design",
      "services",
      "enquiries",
      "messages",
      "booking",
      "team",
      "products",
      "vehicles",
      "gallery-reviews",
      "sharing",
    ])
      await expect(header.locator(`a[href="/product/${slug}"]`)).toBeVisible();
    if (width < 768) {
      const designs = header.getByRole("button", {
        name: "Designs",
        exact: true,
      });
      await designs.click();
      await expect(
        header.getByRole("link", { name: "Explore all designs", exact: true }),
      ).toBeVisible();
      await product.click();
      await expect(
        header.getByRole("link", { name: /Services and prices/ }),
      ).toBeVisible();
    }
    const car = header.locator('[data-product-icon="vehicles"]');
    await expect(car.locator("circle")).toHaveCount(2);
    await page.screenshot({ path: `work/master-feature-sheet-${width}.png` });
    const openAxe = await new AxeBuilder({ page })
      .include(".site-navigation")
      .analyze();
    expect(openAxe.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(product).toBeFocused();
    await product.click();
    await header.getByRole("link", { name: /Services and prices/ }).click();
    await expect(page).toHaveURL(/\/product\/services$/);
    await expect(product).toHaveAttribute("data-state", "closed");
    await header.getByRole("button", { name: "Designs", exact: true }).click();
    await header
      .getByRole("link", { name: "Car dealers and garages", exact: true })
      .click();
    await expect(page).toHaveURL(/\/inspiration\?industry=motoring$/);
    await expect(
      header.getByRole("button", { name: "Designs", exact: true }),
    ).toHaveAttribute("data-state", "closed");
    await expect(
      page.getByRole("heading", { name: "What’s available." }),
    ).toHaveCount(0);
    await page.screenshot({ path: `work/master-navigation-${width}.png` });
    const results = await new AxeBuilder({ page })
      .include(".site-navigation")

      .analyze();
    expect(results.violations).toEqual([]);
  });
test("shared menu dismisses on breakpoint change, closes outside and leaves the footer unobstructed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/inspiration");
  const product = page.getByRole("button", { name: "Product", exact: true });
  await product.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(product).toHaveAttribute("data-state", "closed");
  await expect(product).toBeFocused();
  await product.press("Enter");
  await expect(page.locator(".site-feature-link").first()).toBeVisible();
  await page.mouse.click(5, 900);
  await expect(product).toHaveAttribute("data-state", "closed");
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(product).toHaveAttribute("data-state", "closed");
  await product.click();
  const sharing = page.locator('.site-navigation a[href="/product/sharing"]');
  await sharing.scrollIntoViewIfNeeded();
  await expect(sharing).toBeInViewport();
  await sharing.click();
  await expect(page).toHaveURL(/\/product\/sharing$/);
  const terms = page.getByRole("link", { name: "Terms", exact: true });
  await terms.scrollIntoViewIfNeeded();
  await expect(terms).toBeInViewport();
});
test("a local draft does not impersonate an authenticated account", async ({
  page,
}) => {
  const { openEditorWithSample } = await import("./helpers");
  await openEditorWithSample(page);
  await page.goto("/");
  const header = page.getByRole("banner", { name: "Taplo website" });
  await expect(
    header.getByRole("link", { name: "Open Studio", exact: true }),
  ).toHaveCount(0);
  await expect(
    header.getByRole("link", { name: "Start free", exact: true }),
  ).toHaveAttribute("href", "/onboarding");
});
test("authoring has one contextual preview explanation", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "About this Studio preview" }).click();
  const dialog = page.getByRole("dialog", { name: "Your Studio preview" });
  await expect(dialog).toContainText("does not publish a public page");
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Set up your business page." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "About this Studio preview" }),
  ).toBeVisible();
});

for (const width of [390, 1440])
  test(`services illustration responds to pricing and opens context at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/product/services");
    const demo = page.getByTestId("service-pricing-demo");
    await expect(demo.getByText("£85", { exact: true })).toBeVisible();
    await demo.getByRole("radio", { name: "From", exact: true }).check();
    await expect(demo.getByText("From £65", { exact: true })).toBeVisible();
    await demo.getByRole("radio", { name: "Quote", exact: true }).check();
    await expect(demo.getByText("Let’s talk", { exact: true })).toBeVisible();
    await demo
      .getByRole("button", { name: "View the enquiry", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "An enquiry with context",
    });
    await expect(dialog).toContainText(
      "No booking or enquiry has been submitted.",
    );
    await page.keyboard.press("Escape");
    await expect(
      demo.getByRole("button", { name: "View the enquiry", exact: true }),
    ).toBeFocused();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await demo.getByRole("radio", { name: "Fixed", exact: true }).check();
    await expect(demo.getByText("£85", { exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.screenshot({ path: `work/master-services-${width}.png` });
    const results = await new AxeBuilder({ page })
      .include('[data-testid="service-pricing-demo"]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

test("Pro exposes three staff calendars and Business retains the fourth", async ({
  page,
}) => {
  const { openEditorWithSample } = await import("./helpers");
  await openEditorWithSample(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    s.plan = "pro";
    s.content.staff.push({
      ...s.content.staff[0],
      id: "fourth-person",
      slug: "fourth-person",
      name: "Fourth Person",
      serviceIds: null,
      bookable: true,
    });
    localStorage.setItem("taplo.demo.v2", JSON.stringify(s));
  });
  await page.goto("/demo/preview");
  const start = async () => {
    const f = page;
    await f
      .getByRole("button", { name: /Book your chair/ })
      .first()
      .click();
    await f
      .getByTestId("booking-flow")
      .getByTestId("bk-service")
      .first()
      .click();
    return f.getByTestId("booking-flow");
  };
  let flow = await start();
  await expect(
    flow.getByRole("button", { name: /Anyone available/ }),
  ).toBeVisible();
  await expect(flow.getByRole("button", { name: /Fourth Person/ })).toHaveCount(
    0,
  );
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    s.plan = "business";
    localStorage.setItem("taplo.demo.v2", JSON.stringify(s));
  });
  await page.reload();
  flow = await start();
  await expect(
    flow.getByRole("button", { name: /Fourth Person/ }),
  ).toBeVisible();
});
