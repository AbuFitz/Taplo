import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { PRODUCT_PAGES } from "../../src/features/marketing/product";
import { CURRENT_LOOKS, SPOTLIGHT_LOOK_IDS } from "../../src/features/page/themes/looks";
import { PRODUCT_LINKS } from "../../src/features/marketing/ia";
const routes = [
  "/product",
  ...PRODUCT_PAGES.map((p) => `/product/${p.slug}`),
  "/how-it-works",
  "/",
  "/pricing",
  "/inspiration",
];
async function imagesReady(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((img) => img.getClientRects().length > 0)
        .map(async (img) => {
          img.loading = "eager";
          await img.decode();
        }),
    );
  });
}
for (const width of [390, 1440])
  for (const route of routes)
    test(`current product experience ${route} at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await imagesReady(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      if (
        [
          "/product",
          "/product/services",
          "/product/team",
          "/product/vehicles",
          "/product/design",
          "/how-it-works",
          "/pricing",
        ].includes(route)
      )
        await page.screenshot({
          path: path.join(
            process.env.TAPLO_REVIEW_DIR ?? "test-results",
            `feature-${route.replaceAll("/", "-").replace(/^-/, "")}-${width}.png`,
          ),
          fullPage: false,
        });
    });
for (const width of [768, 1024, 1440])
  test(`the desktop product menu fits the real viewport at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/product");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "Product", exact: true }).click();
    for (const link of PRODUCT_LINKS) {
      const el = nav.getByRole("link", { name: new RegExp(`^${link.label}`) });
      await expect(el).toBeInViewport();
      const box = await el.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `feature-navigation-${width}.png`,
      ),
      fullPage: false,
    });
  });
for (const width of [390, 1440])
  test(`visual setup story uses current responsive captures and keyboard controls at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/how-it-works");
    const tabs = page.getByRole("tablist", { name: "See the setup steps" });
    await tabs.getByRole("tab").first().click();
    await expect(tabs.getByRole("tab")).toHaveCount(5);
    for (let n = 0; n < 5; n++) {
      await tabs.getByRole("tab").nth(n).click();
      const panel = page.getByRole("tabpanel");
      await expect(panel).toHaveCount(1);
      await panel.locator("img").evaluate(async (img: HTMLImageElement) => {
        img.loading = "eager";
        await img.decode();
      });
      const current = await panel
        .locator("img")
        .evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
      expect(current).toMatch(
        width < 640 ? /-phone\.webp$/ : /(?<!-phone)\.webp$/,
      );
    }
    await tabs.getByRole("tab").last().focus();
    await page.keyboard.press("Home");
    await expect(tabs.getByRole("tab").first()).toBeFocused();
    await expect(tabs.getByRole("tab").first()).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
test("feature copy follows the real look count and distinguishes plans, connections and platform choices", async ({
  page,
}) => {
  await page.goto("/product/design");
  const count = await page.getByRole("radio").count();
  expect(count).toBe(SPOTLIGHT_LOOK_IDS.length);
  const status = page.getByTestId("status");
  await expect(status).toContainText(`${CURRENT_LOOKS.length} starting looks`);
  const plan = status
    .getByRole("listitem")
    .filter({ hasText: "Switching to another starting look" });
  await expect(plan).toContainText("Plan feature");
  await expect(plan).not.toContainText("Needs a connection");
  await page.goto("/product/sharing");
  const platform = page
    .getByTestId("status")
    .getByRole("listitem")
    .filter({ hasText: "Exact link previews" });
  await expect(platform).toContainText("Depends on the other platform");
});
test("team profiles avoid invented portraits and booking offers that person's actual services", async ({
  page,
}) => {
  await page.goto("/appearance/frame?scenario=station");
  await page
    .getByTestId("team-card")
    .first()
    .getByRole("button", { name: /View profile/ })
    .click();
  const profile = page.getByTestId("team-profile");
  await expect(profile.getByRole("img")).toHaveCount(0);
  await expect(profile.getByRole("heading", { name: "Sam Ellis" })).toBeVisible();
  await profile.getByRole("button", { name: "Book with Sam" }).click();
  const flow = page.getByTestId("booking-flow");
  await expect(flow).toBeVisible();
  await expect(flow.getByTestId("bk-service")).toHaveCount(4);
  await expect(flow).not.toContainText("Scissor cut and restyle");
});
test("validated capture poses never change owner content and an unknown variant falls back", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByLabel("Business name").fill("Keep my content");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const before = await page.evaluate(() =>
    localStorage.getItem("taplo.demo.v2"),
  );
  expect(before).not.toBeNull();
  await page.goto(
    "/appearance/frame?scenario=station&widget=team&variant=avatars",
  );
  await expect(page.locator(".tp-team-avatars")).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem("taplo.demo.v2"))).toBe(
    before,
  );
  await page.goto(
    "/appearance/frame?scenario=station&widget=team&variant=invalid",
  );
  await expect(page.locator(".tp-team-avatars")).toHaveCount(0);
  await expect(page.getByTestId("team-card")).toHaveCount(3);
  expect(await page.evaluate(() => localStorage.getItem("taplo.demo.v2"))).toBe(
    before,
  );
});

test("phone pricing comparison changes visible plan values while the complete desktop comparison stays available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/pricing");
  const plans = page.getByRole("group", { name: "Compare a plan" }),
    table = page.getByTestId("plan-table");
  const bookings = table.getByRole("row").filter({
    has: page.getByRole("rowheader", {
      name: "Online bookings and requests",
    }),
  });
  await expect(bookings.getByRole("cell")).toHaveCount(1);
  await expect(bookings.getByRole("cell")).toContainText("Not included");
  await plans.getByText("Pro", { exact: true }).click();
  await expect(bookings.getByRole("cell")).toHaveCount(1);
  await expect(bookings.getByRole("cell")).toContainText("Included");
  await plans.getByText("Business", { exact: true }).click();
  const staff = table.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "Customers choose a person" }),
  });
  await expect(staff.getByRole("cell")).toContainText("Included");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(plans).toBeHidden();
  await expect(bookings.getByRole("cell")).toHaveCount(4);
});

test("the booking person picker stays usable without supplied staff photographs", async ({page}) => {
  await page.goto("/appearance/frame?scenario=station");
  await page.getByRole("button", {name:"Book a haircut",exact:true}).first().click();
  const flow=page.getByTestId("booking-flow");
  await flow.getByTestId("bk-service").first().click();
  await expect(flow.getByRole("button",{name:/Sam Ellis/})).toBeVisible();
  await expect(flow.getByRole("img")).toHaveCount(0);
  await flow.getByRole("button",{name:/Sam Ellis/}).click();
  await expect(flow.getByRole("heading",{name:/Choose a time/})).toBeVisible();
});
