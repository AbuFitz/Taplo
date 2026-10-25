import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 1440])
  test(`design carousel preserves real demos and supports keyboard browsing at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const designs = page.getByTestId("home-designs");
    await designs.scrollIntoViewIfNeeded();
    const rail = designs.getByRole("list", {
      name: "Starting designs",
      exact: true,
    });
    await rail.focus();
    await page.keyboard.press("Home");
    await expect(
      designs
        .locator(".home-design-summary")
        .getByText("Marlowe & Finch", { exact: true }),
    ).toBeVisible();
    await expect(rail.locator("li").first().locator("iframe")).toHaveAttribute(
      "src",
      "/appearance/frame?scenario=barber",
    );
    await expect(
      designs.getByRole("link", { name: "Use this design", exact: true }),
    ).toHaveAttribute("href", "/onboarding?from=marlowe-and-finch");
    await page.keyboard.press("End");
    await expect(
      designs
        .locator(".home-design-summary")
        .getByText("Maya Builds", { exact: true }),
    ).toBeVisible();
    await expect(
      designs.getByRole("button", { name: "Next design", exact: true }),
    ).toBeDisabled();
    await rail.focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await expect(
      designs.getByRole("link", { name: "Use this design", exact: true }),
    ).toHaveAttribute("href", "/onboarding?from=detail-dept");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .include('[data-testid="home-designs"]')
      .analyze();
    expect(axe.violations).toEqual([]);
    await designs.screenshot({ path: `work/design-rail-${width}.png` });
  });
test("gallery carousel filtering and viewport controls keep real links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/inspiration");
  const rail = page.getByTestId("gallery-list");
  await expect(rail.locator(":scope>li")).toHaveCount(12);
  await rail.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("button", { name: "Next design", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("group", { name: "Page categories", exact: true })
    .getByRole("button", { name: "Car dealers and garages", exact: true })
    .click();
  await expect(rail.locator(":scope>li")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Previous design", exact: true }),
  ).toBeDisabled();
  await page.getByRole("radio", { name: "Desktop", exact: true }).check();
  await rail.locator("li").first().scrollIntoViewIfNeeded();
  await expect(
    rail.locator("li").first().locator(".browser-shell"),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("desktop drag advances designs without accidentally opening a page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/inspiration");
  const rail = page.getByTestId("gallery-list");
  await rail.scrollIntoViewIfNeeded();
  const box = (await rail.boundingBox())!;
  const before = await rail.evaluate((el) => el.scrollLeft);
  await page.mouse.move(box.x + box.width * 0.65, box.y + 140);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, box.y + 140, { steps: 18 });
  await page.mouse.up();
  await expect
    .poll(() => rail.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(before + 100);
  await expect(page).toHaveURL(/\/inspiration$/);
});

test("quick repeated Next taps keep the intended design and adoption link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 950 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const designs = page.getByTestId("home-designs");
  await designs.scrollIntoViewIfNeeded();
  const rail = designs.getByRole("list", {
    name: "Starting designs",
    exact: true,
  });
  await rail.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 3; i++)
    await designs
      .getByRole("button", { name: "Next design", exact: true })
      .click();
  await expect(
    designs.getByRole("link", { name: "Use this design", exact: true }),
  ).toHaveAttribute("href", "/onboarding?from=sora-fields");
  await expect
    .poll(() =>
      rail.evaluate((el) => {
        const card = el.children[3] as HTMLElement;
        return Math.abs(
          card.offsetLeft +
            card.offsetWidth / 2 -
            el.scrollLeft -
            el.clientWidth / 2,
        );
      }),
    )
    .toBeLessThan(15);
});
