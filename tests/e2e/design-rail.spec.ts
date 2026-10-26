import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 1440])
  test(`inspiration carousel preserves real demos and keyboard navigation at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/inspiration");
    const rail = page.getByTestId("gallery-list");
    await rail.scrollIntoViewIfNeeded();
    await rail.focus();
    await page.keyboard.press("End");
    await expect(
      page.getByRole("button", { name: "Next design", exact: true }),
    ).toBeDisabled();
    await rail.focus();
    await page.keyboard.press("Home");
    await expect(
      page.getByRole("button", { name: "Previous design", exact: true }),
    ).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("button", { name: "Previous design", exact: true }),
    ).toBeEnabled();
    await rail.locator(":scope > li").nth(1).scrollIntoViewIfNeeded();
    await expect(
      rail.locator(":scope > li").nth(1).locator("iframe"),
    ).toHaveAttribute("src", /appearance\/frame\?scenario=/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .include('[data-testid="gallery-list"]')
          .analyze()
      ).violations,
    ).toEqual([]);
  });
test("gallery carousel filtering and viewport controls keep real links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/inspiration");
  const rail = page.getByTestId("gallery-list");
  await expect(rail.locator(":scope>li")).toHaveCount(14);
  await rail.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("button", { name: "Next design", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("group", { name: "Page categories", exact: true })
    .getByRole("button", { name: "Car dealers and garages", exact: true })
    .click();
  await expect(rail.locator(":scope>li")).toHaveCount(3);
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
  await page.goto("/inspiration");
  const rail = page.getByTestId("gallery-list");
  await rail.scrollIntoViewIfNeeded();
  await rail.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Next design", exact: true })
      .click();
  await expect(page.getByText("Design 4 of 14", { exact: true })).toHaveCount(
    1,
  );
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
