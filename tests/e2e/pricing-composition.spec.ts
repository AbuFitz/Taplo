import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PLANS, PLAN_IDS } from "../../src/features/subscriptions/plans";
import { resolveEntitlements } from "../../src/features/subscriptions/entitlements";
import { formatMoney } from "../../src/features/services/format";
for (const width of [320, 390, 768, 1440])
  test(`pricing is composed, readable and truthful at ${width}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pricing");
    const chooser = page.getByTestId("plan-chooser");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "One page.Room to grow.",
    );
    await expect(
      page.getByRole("group", { name: "Find a suitable plan" }),
    ).toHaveCount(0);
    await expect(chooser.locator(".pricing-plan-illustration")).toHaveCount(0);
    await expect(chooser.locator('[data-plan="free"] .plan-art')).toHaveCount(
      0,
    );
    await expect(chooser.locator(".plan-art")).toHaveCount(3);
    for (const id of PLAN_IDS) {
      if (width < 768)
        await chooser
          .getByRole("button", { name: PLANS[id].name, exact: true })
          .click();
      const card = chooser.getByRole("listitem", {
        name: `${PLANS[id].name} plan`,
        exact: true,
      });
      await expect(card).toContainText(formatMoney(PLANS[id].priceMinorGbp));
      await expect(card.getByRole("link")).toHaveAttribute(
        "href",
        `/onboarding?plan=${id}`,
      );
      await card.scrollIntoViewIfNeeded();
      for (const img of await card.locator("img").all())
        await expect
          .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
          .toBeGreaterThan(0);
      if (width < 768)
        await card.screenshot({ path: `work/pricing-${id}-${width}.png` });
    }
    if (width < 768)
      await chooser.getByRole("button", { name: "Free", exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: `work/pricing-page-${width}.png`,
      fullPage: true,
    });
    const table = page.getByTestId("plan-table");
    for (const id of PLAN_IDS) {
      if (width < 768)
        await page
          .getByRole("group", { name: "Compare a plan" })
          .getByRole("radio", { name: PLANS[id].name, exact: true })
          .check();
      const e = resolveEntitlements(id, "active");
      for (const [label, value] of [
        ["Photo gallery", e.gallery],
        ["Online bookings and requests", e.onlineBooking],
        ["No Taplo branding", e.removeBranding],
        ["Customer management", e.customerManagement],
        ["Staff scheduling", e.staffScheduling],
        ["Team permissions", e.rolePermissions],
        ["Advanced analytics", e.advancedAnalytics],
        ["Customer testimonials", e.testimonials],
      ] as const) {
        const row = table.getByRole("row").filter({
          has: page.getByRole("rowheader", { name: label, exact: true }),
        });
        const cell =
          width < 768
            ? row.getByRole("cell")
            : row.getByRole("cell").nth(PLAN_IDS.indexOf(id));
        await expect(cell).toContainText(value ? "Included" : "Not included");
      }
    }
    const staff = table.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: "Customers choose a person" }),
    });
    if (width < 768)
      await page
        .getByRole("group", { name: "Compare a plan" })
        .getByRole("radio", { name: "Pro", exact: true })
        .check();
    await expect(
      width < 768 ? staff.getByRole("cell") : staff.getByRole("cell").nth(2),
    ).toHaveText("3");
    if (width < 768)
      await page
        .getByRole("group", { name: "Compare a plan" })
        .getByRole("radio", { name: "Business", exact: true })
        .check();
    await expect(
      width < 768 ? staff.getByRole("cell") : staff.getByRole("cell").nth(3),
    ).toHaveText("Unlimited");
    expect(errors).toEqual([]);
  });
test("fast mobile plan choices keep the last intention, comparison and setup link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/pricing");
  const choices = page.getByRole("group", {
    name: "Choose a plan",
    exact: true,
  });
  for (const name of ["Business", "Core", "Pro", "Business"])
    await choices.getByRole("button", { name, exact: true }).click();
  const card = page.locator('.pricing-plans>[data-plan="business"]');
  await expect(card).toHaveAttribute("data-selected", "true");
  await expect
    .poll(async () => Math.abs((await card.boundingBox())!.x - 20))
    .toBeLessThan(4);
  await expect(
    page
      .getByRole("group", { name: "Compare a plan" })
      .getByRole("radio", { name: "Business", exact: true }),
  ).toBeChecked();
  await card
    .getByRole("link", { name: "Start with Business", exact: true })
    .click();
  await expect(page).toHaveURL(/\/onboarding\?plan=business$/);
  await expect(page.getByTestId("plan-intent")).toContainText("Business");
});
test("comparison selection aligns the corresponding card after changing screen size", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  const compare = page.getByRole("group", { name: "Compare a plan" });
  await compare.getByRole("radio", { name: "Pro", exact: true }).check();
  await page.setViewportSize({ width: 1440, height: 950 });
  await expect(compare).toBeHidden();
  await expect(
    page.getByTestId("plan-table").getByRole("columnheader"),
  ).toHaveCount(5);
  await page.setViewportSize({ width: 390, height: 844 });
  const card = page.locator('.pricing-plans>[data-plan="pro"]');
  await expect(card).toHaveAttribute("data-selected", "true");
  await expect
    .poll(async () => Math.abs((await card.boundingBox())!.x - 20))
    .toBeLessThan(4);
  await expect(
    compare.getByRole("radio", { name: "Pro", exact: true }),
  ).toBeChecked();
});

test("manual horizontal browsing updates the selected plan without snapping back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pricing");
  const rail = page.getByRole("list", { name: "Plan options", exact: true });
  await rail.scrollIntoViewIfNeeded();
  await rail.hover();
  await page.mouse.wheel(700, 0);
  await expect
    .poll(() =>
      rail.locator('[data-selected="true"]').getAttribute("data-plan"),
    )
    .not.toBe("free");
  const chosen = await rail
    .locator('[data-selected="true"]')
    .getAttribute("data-plan");
  await expect(
    page.getByRole("group", { name: "Choose a plan" }).getByRole("button", {
      name: PLANS[chosen as keyof typeof PLANS].name,
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("group", { name: "Compare a plan" }).getByRole("radio", {
      name: PLANS[chosen as keyof typeof PLANS].name,
      exact: true,
    }),
  ).toBeChecked();
  await rail.hover();
  await page.mouse.wheel(-2000, 0);
  await expect(rail.locator('[data-plan="free"]')).toHaveAttribute(
    "data-selected",
    "true",
  );
});
