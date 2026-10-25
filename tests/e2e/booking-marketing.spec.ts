import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`booking marketing is coherent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/product/booking");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Goodbye,back and forth.",
    );
    const demo = page.getByTestId("booking-marketing-demo");
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.getByRole("radio", { name: "Clinic" })).toBeChecked();
    await expect(demo.getByTestId("booking-adopt")).toHaveAttribute(
      "href",
      "/onboarding?from=hollin-physio",
    );
    await demo.getByRole("radio", { name: "Coaching" }).check();
    await expect(
      demo.getByText("Free intro session", { exact: true }),
    ).toBeVisible();
    await expect(demo.getByTestId("booking-adopt")).toHaveAttribute(
      "href",
      "/onboarding?from=forge-strength",
    );
    await expect(
      demo.getByRole("link", { name: "Open Forge Strength demo" }),
    ).toHaveAttribute("href", "/inspiration/forge-strength");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
  });
}

for (const choice of [
  {
    name: "Clinic",
    outcome: "pending",
    review: "Pending request",
    time: "Request this time",
    submit: "Send request",
    slug: "hollin-physio",
  },
  {
    name: "Coaching",
    outcome: "confirmed",
    review: "Confirmed appointment",
    time: "Book this time",
    submit: "Confirm booking",
    slug: "forge-strength",
  },
]) {
  test(`${choice.name} completes the actual booking engine with the correct outcome`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/product/booking");
    const demo = page.getByTestId("booking-marketing-demo");
    await demo.getByRole("radio", { name: choice.name }).check();
    await demo.getByRole("button", { name: "Try a booking" }).click();
    const flow = page.getByTestId("booking-flow");
    await expect(flow).toBeVisible();
    await flow.getByRole("button", { name: /Anyone available/ }).click();
    await flow.getByTestId("bk-slot").first().click();
    const actionEdge = await flow
      .getByTestId("booking-step-action")
      .boundingBox();
    const sheetEdge = await flow.boundingBox();
    expect(
      Math.abs(
        actionEdge!.y + actionEdge!.height - (sheetEdge!.y + sheetEdge!.height),
      ),
    ).toBeLessThanOrEqual(2);
    await flow
      .getByRole("button", { name: new RegExp(`^${choice.time}`) })
      .click();
    await flow
      .getByRole("textbox", { name: "Your name" })
      .fill("Sample Visitor");
    await flow
      .getByRole("textbox", { name: "Email", exact: true })
      .fill("visitor@example.com");
    await flow.getByRole("button", { name: "Review", exact: true }).click();
    await expect(flow.getByTestId("bk-outcome")).toContainText(choice.review);
    await flow
      .getByRole("button", { name: choice.submit, exact: true })
      .click();
    await expect(flow.getByTestId("bk-done")).toHaveAttribute(
      "data-status",
      choice.outcome,
    );
    const stored = await page.evaluate(
      (slug) =>
        JSON.parse(localStorage.getItem(`taplo.demo.bookings.v1:${slug}`)!),
      choice.slug,
    );
    expect(stored.bookings[0].status).toBe(choice.outcome);
    await flow.getByRole("button", { name: "Close", exact: true }).click();
    await expect(
      demo.getByRole("button", { name: "Try a booking" }),
    ).toBeFocused();
  });
}

test("reduced motion and keyboard selection retain the real demo", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/product/booking");
  const clinic = page.getByRole("radio", { name: "Clinic" });
  await clinic.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Coaching" })).toBeChecked();
  await expect(page.locator(".booking-hero-art .feature-demo-card")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(
    page.locator(".booking-demo-field .liquid-light"),
  ).toHaveAttribute("data-reduced-motion", "true");
  await page.getByRole("button", { name: "Try a booking" }).click();
  await expect(page.getByTestId("booking-flow")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("booking-flow")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Try a booking" }),
  ).toBeFocused();
});
