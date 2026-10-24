import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import path from "node:path";
const read = (page: import("@playwright/test").Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));
for (const width of [390, 1440])
  test(`a complete business setup uses focused popups and produces an actual useful page at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/onboarding");
    await page
      .getByLabel("Business name", { exact: true })
      .fill("West Road Motors");
    const buffer = await sharp(
      Buffer.from(
        '<svg width="800" height="240" xmlns="http://www.w3.org/2000/svg"><path fill="#9e3e1f" d="M20 50h760v140H20z"/></svg>',
      ),
    )
      .png()
      .toBuffer();
    const file = { name: "garage-mark.png", mimeType: "image/png", buffer };
    const upload = page.getByLabel(
      "Add your logo or profile photo: upload a picture",
    );
    await upload.setInputFiles(file);
    const crop = page.getByTestId("crop-dialog");
    await expect(crop).toBeVisible();
    expect((await read(page)).content.identity.logo).toBeUndefined();
    await crop.getByRole("button", { name: "Cancel", exact: true }).click();
    expect((await read(page)).content.identity.logo).toBeUndefined();
    await upload.setInputFiles(file);
    await crop.getByRole("button", { name: "Use image", exact: true }).click();
    await expect
      .poll(async () => (await read(page)).content.identity.logo?.width)
      .toBe(640);
    expect((await read(page)).content.identity.logo.height).toBe(192);
    await page
      .getByRole("button", {
        name: "Edit image: Add your logo or profile photo",
        exact: true,
      })
      .click();
    await expect(page.getByTestId("image-edit-dialog")).toBeVisible();
    await page
      .getByTestId("image-edit-dialog")
      .getByRole("button", { name: "Done", exact: true })
      .click();
    const next = () =>
      page.getByRole("button", { name: "Continue", exact: true }).click();
    await next();
    await expect(
      page.getByRole("list", { name: "Kinds of business" }).getByRole("button"),
    ).toHaveCount(4);
    await page.getByLabel("Search businesses").fill("mechanic");
    await page
      .getByRole("list", { name: "Kinds of business" })
      .getByRole("button", { name: "Mechanic / garage", exact: true })
      .click();
    await next();
    await expect(page.getByTestId("goal")).toHaveCount(0);
    await expect(page.getByTestId("reach").getByRole("textbox")).toHaveCount(1);
    await page
      .getByRole("button", { name: "Change main action", exact: true })
      .click();
    await page.getByRole("radio", { name: /Book with me/ }).check();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill("owner@example.com");
    await next();
    await page.getByLabel("Service 1 name").fill("Diagnostic inspection");
    await page.getByLabel("Service 1 minutes").fill("45");
    await page
      .getByRole("button", { name: "Pricing options", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Ask for a quote", exact: true })
      .click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    expect((await read(page)).content.services[0]).toMatchObject({
      name: "Diagnostic inspection",
      priceMode: "quote",
      durationMinutes: 45,
    });
    await page.getByRole("button", { name: /Business details/ }).click();
    const details = page.getByTestId("setup-business-details");
    await details
      .getByLabel("Short description")
      .fill("Vehicle diagnostics, servicing and repairs.");
    await details
      .getByLabel("Town or area", { exact: true })
      .fill("Hemel Hempstead");
    await details.getByLabel("Website", { exact: true }).fill("example.co.uk");
    await details.getByLabel("Tuesday", { exact: true }).check();
    await details.getByRole("button", { name: "Save details" }).click();
    await next();
    await page
      .getByTestId("look-picker")
      .locator("label")
      .filter({ has: page.locator('input[value="silver"]') })
      .click();
    await page.getByRole("button", { name: /Background & colours/ }).click();
    const design = page.getByTestId("setup-design-dialog");
    await design
      .getByRole("button", { name: "Smoke gradient", exact: true })
      .click();
    await expect(design.getByLabel("Follow my logo colours")).toBeChecked();
    await design.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByRole("button", { name: /Profile arrangement/ }).click();
    await design
      .getByRole("button", { name: "Side by side", exact: true })
      .click();
    await design.getByRole("button", { name: "Done", exact: true }).click();
    const frame = page.frameLocator('[data-testid="setup-live-page"]');
    await expect(frame.locator("[data-taplo-page]")).toHaveAttribute(
      "data-motion",
      "drift",
    );
    await expect(frame.locator(".tp-header")).toHaveAttribute(
      "data-layout",
      "side",
    );
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `design-${width}.png`,
      ),
    });
    await next();
    await expect(
      page.getByRole("heading", { name: "Review your page", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Find a plan", exact: true })
      .click();
    const plans = page.getByTestId("setup-plans");
    await expect(plans).toContainText("No card is collected here.");
    await plans.getByRole("button", { name: /^Free/ }).click();
    await plans
      .getByRole("button", { name: "Continue with Free", exact: true })
      .click();
    expect((await read(page)).setupDrafts.planIntent).toBe("free");
    expect((await read(page)).plan).toBe("business");
    if (width < 1024) {
      await page
        .getByRole("button", { name: "Expand preview", exact: true })
        .click();
      await expect
        .poll(
          async () =>
            (await page
              .locator('[data-testid="setup-live-page"]')
              .boundingBox())!.height,
        )
        .toBeGreaterThan(700);
    }
    await expect(
      frame.getByRole("heading", { name: "West Road Motors", exact: true }),
    ).toBeVisible();
    await expect(frame.locator('[data-widget="hours"]')).toContainText("Tue");
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `finished-page-${width}.png`,
      ),
    });
    if (width < 1024)
      await page
        .getByRole("button", { name: "Back to setup", exact: true })
        .click();
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.reload();
    const saved = await read(page);
    expect(saved.content.services[0].priceMode).toBe("quote");
    expect(saved.page.appearance.background.source).toBe("logo");
    expect(saved.content.hours).toHaveLength(1);
  });
for (const width of [320, 390])
  test(`image cropping is confirmed in a phone popup, preserves PNG transparency and can be reopened at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/onboarding");
    await page
      .getByLabel("Business name", { exact: true })
      .fill("North Street");
    const buffer = await sharp({
      create: { width: 800, height: 600, channels: 4, background: "#ab502080" },
    })
      .png()
      .toBuffer();
    await page
      .getByLabel("Add your logo or profile photo: upload a picture")
      .setInputFiles({ name: "picture.png", mimeType: "image/png", buffer });
    const crop = page.getByTestId("crop-dialog");
    await crop.getByRole("button", { name: "Crop photo", exact: true }).click();
    await crop.getByRole("slider", { name: "Zoom", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await crop
      .getByRole("button", { name: "Round preview", exact: true })
      .click();
    await expect(crop.getByTestId("crop-apply")).toBeInViewport();
    expect((await read(page)).content.identity.logo).toBeUndefined();
    await crop.getByTestId("crop-apply").click();
    await expect
      .poll(async () => Boolean((await read(page)).content.identity.logo))
      .toBe(true);
    const logo = (await read(page)).content.identity.logo;
    expect(logo.width).toBe(logo.height);
    expect(logo.src).toMatch(/^data:image\/png/);
    expect((await read(page)).page.appearance.header.avatarShape).toBe(
      "circle",
    );
    const alpha = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(1, 1, 1, 1).data[3];
    }, logo.src);
    expect(alpha).toBeLessThan(255);
    await page
      .getByRole("button", {
        name: "Edit image: Add your logo or profile photo",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Change crop or framing", exact: true })
      .click();
    await expect(crop).toBeVisible();
    await crop.getByRole("button", { name: "Cancel", exact: true }).click();
    expect((await read(page)).content.identity.logo.src).toBe(logo.src);
  });

test("partial service text survives back and reload, custom businesses work, and colour edits survive layout changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/onboarding");
  await page
    .getByLabel("Business name", { exact: true })
    .fill("North Yard Workshop");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Use a different business type", exact: true })
    .click();
  await page.getByLabel("Describe your business").fill("Repair workshop");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Service 1 name").fill("Initial assessment");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator("#why-disabled")).toContainText(
    "Finish the service name",
  );
  await page.reload();
  await expect(page.getByLabel("Service 1 name")).toHaveValue(
    "Initial assessment",
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Service 1 name")).toHaveValue(
    "Initial assessment",
  );
  await page
    .getByRole("button", { name: "Pricing options", exact: true })
    .click();
  await page.getByRole("button", { name: "Free", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect
    .poll(async () => (await read(page)).page.appearance.background?.source)
    .toBe("logo");
  await page.getByRole("button", { name: /Background & colours/ }).click();
  await page
    .getByTestId("setup-design-dialog")
    .getByLabel("Gradient end hex value")
    .fill("#cccccc");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page
    .getByTestId("look-picker")
    .locator("label")
    .filter({ has: page.locator('input[value="ink"]') })
    .click();
  expect((await read(page)).page.appearance.background.to).toBe("#cccccc");
  expect((await read(page)).page.appearance.background.source).toBe("manual");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: /Business name and image Add/ })
    .click();
  await expect(
    page.getByLabel("Add your logo or profile photo: upload a picture"),
  ).toBeAttached();
});
