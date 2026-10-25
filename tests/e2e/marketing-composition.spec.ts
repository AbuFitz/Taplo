import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import sharp from "sharp";
import jsQR from "jsqr";
for (const width of [320, 390, 768, 1440])
  test(`marketing decisions, readable previews and useful sharing work at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.getByTestId("hero-showcase");
    await expect(hero.locator("iframe")).toHaveCount(0);
    await expect(hero.getByTestId("hero-phone-illustration")).toBeVisible();
    await expect(hero.getByTestId("hero-browser-illustration")).toHaveCount(
      width >= 900 ? 1 : 0,
    );
    await expect(page.locator(".feature-illustration")).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="businesses-h"]'),
    ).toHaveCount(0);
    const artwork = (await hero
      .locator(".hero-showcase-canvas")
      .boundingBox())!;
    const caption = (await hero.locator("figcaption").boundingBox())!;
    expect(caption.y).toBeGreaterThanOrEqual(artwork.y + artwork.height);

    await hero.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `hero-${width}.png`,
      ),
    });
    const plaque = page.getByTestId("plaque-experience");
    await plaque.scrollIntoViewIfNeeded();
    await expect(plaque.getByRole("slider")).toHaveCount(0);
    await expect(plaque.getByRole("button")).toHaveCount(0);
    const code = await plaque
      .locator(".plaque-code svg")
      .evaluate((el) => new XMLSerializer().serializeToString(el));
    const { data, info } = await sharp(Buffer.from(code))
      .resize(800, 800)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(
      jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data,
    ).toBe("https://mytaplo.vercel.app/inspiration/no-6-coffee");
    await plaque.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `plaque-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const home = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      home.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.goto("/product");
    await page
      .getByTestId("product-experience")
      .getByRole("radio", { name: "Car dealer", exact: true })
      .check();
    await expect(
      page
        .getByTestId("product-experience")
        .getByText("Harris Cars", { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("product-demo")).toHaveAttribute(
      "href",
      "/inspiration/harris-cars",
    );
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `product-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/pricing");
    await page
      .getByRole("button", { name: "Appointments", exact: true })
      .click();
    const plan = page.locator('.pricing-plans > li[data-plan="pro"]');
    await expect(plan).toBeVisible();
    await expect(plan).toContainText("£19.99");
    await expect(
      plan.getByRole("link", { name: "Start with Pro" }),
    ).toHaveAttribute("href", "/onboarding?plan=pro");
    if (width < 640)
      await expect(
        page.getByRole("radio", { name: "Pro", exact: true }),
      ).toBeChecked();
    const pricing = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(pricing.violations.map((v) => v.id)).toEqual([]);
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `pricing-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("plaque follows the pointer without a click, settles on leaving, and the hero never captures the wheel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const plaque = page.locator(".plaque-stage");
  await plaque.scrollIntoViewIfNeeded();
  const box = (await plaque.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.3);
  await expect(plaque).toHaveAttribute("data-engaged", "true");
  await page.mouse.move(1, 1);
  await expect(plaque).toHaveAttribute("data-engaged", "false");
  await plaque.focus();
  await page.keyboard.press("ArrowRight");
  await expect(plaque).toHaveAttribute("data-engaged", "true");
  await page.keyboard.press("Escape");
  await expect(plaque).toHaveAttribute("data-engaged", "false");
  const phone = page.locator(".hero-showcase-canvas");
  await phone.scrollIntoViewIfNeeded();
  await phone.hover();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
});

test("sharing uses the simple plaque, with no reset or format controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 950 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/product/sharing");
  const plaque = page.getByTestId("plaque-experience");
  await expect(plaque).toBeVisible();
  await expect(plaque.getByRole("button")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        reason: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});

test("homepage design choices use distinct working businesses and send the selected design into setup", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 950 });
  await page.goto("/");
  const designs = page.getByTestId("home-designs");
  await designs.scrollIntoViewIfNeeded();
  await designs
    .getByRole("list", { name: "Starting designs", exact: true })
    .focus();
  await page.keyboard.press("Home");
  for (const [index, name, slug, scenario] of [
    [0, "Marlowe & Finch", "marlowe-and-finch", "barber"],
    [1, "Detail Dept.", "detail-dept", "detailer"],
    [2, "Hollin Physiotherapy", "hollin-physio", "physio"],
  ] as const) {
    if (index)
      await designs
        .getByRole("button", { name: "Next design", exact: true })
        .click();
    const frame = designs
      .getByRole("link", { name: `Open ${name} design`, exact: true })
      .locator("iframe");
    await expect(frame).toHaveAttribute(
      "src",
      `/appearance/frame?scenario=${scenario}`,
    );
    await expect(frame).toHaveAttribute("data-loaded", "true");
    await expect(designs.getByText(name, { exact: true })).toBeVisible();
    await expect(
      designs.getByRole("link", { name: "Use this design", exact: true }),
    ).toHaveAttribute("href", `/onboarding?from=${slug}`);
  }
});
