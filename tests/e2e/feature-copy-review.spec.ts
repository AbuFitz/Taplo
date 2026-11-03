import { expect, test } from "@playwright/test";
for (const width of [390, 1440]) {
  test(`fictional driving products keep their visual and price together without shop actions at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/product/products");
    const demo = page.getByTestId("feature-demo-products");
    for (const [tab, name, price, asset] of [
      ["Dash cam", "Compact dash cam", "£79", "dashcam"],
      ["Phone mount", "Magnetic phone mount", "£24", "mount"],
      ["Tyre inflator", "Portable tyre inflator", "£49", "inflator"],
    ]) {
      await demo.getByRole("radio", { name: tab, exact: true }).check();
      await expect(
        demo.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
      await expect(demo.getByText(price, { exact: true })).toBeVisible();
      await expect(demo.locator("a, button")).toHaveCount(0);
      await expect(demo.locator("[data-illustrative-action]")).toHaveText(
        "View in shop",
      );
      const img = demo.getByRole("img");
      await expect(img).toHaveAttribute("alt", name);
      await expect(img).toHaveAttribute("src", new RegExp(`concept-${asset}`));
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await expect(
      page.getByRole("link", { name: "See details", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveCount(0);
  });
  test(`message illustrations stay coherent when switching states at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/product/messages");
    const demo = page.getByTestId("feature-demo-messages");
    for (const [option, heading, text] of [
      ["Confirm", "Booking confirmed.", "Thursday at 11:30"],
      ["Remind", "See you tomorrow.", "tomorrow at 11:30"],
      ["Update", "Booking updated.", "Friday at 14:00"],
    ]) {
      await demo.getByRole("radio", { name: option, exact: true }).check();
      await expect(
        demo.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
      await expect(demo.locator(".feature-message-bubble")).toContainText(text);
      await expect(demo.locator(".feature-message-bubble")).toContainText(
        "pottery workshop",
      );
    }
    await expect(demo).not.toContainText(
      /Example message|Illustration|no message sent|connected delivery service/,
    );
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveCount(0);
  });
}

for (const width of [390, 1440]) {
  test(`feature introductions avoid redundant details links at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const slug of [
      "design",
      "services",
      "booking",
      "enquiries",
      "messages",
      "team",
      "products",
      "vehicles",
      "gallery-reviews",
      "sharing",
    ]) {
      const response = await page.goto(`/product/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "See details", exact: true }),
      ).toHaveCount(0);
    }
  });
}
