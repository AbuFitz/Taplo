import { expect, test, type Page } from "@playwright/test";
import { PLAN_IDS } from "../../src/features/subscriptions/plans";
import { resolveEntitlements } from "../../src/features/subscriptions/entitlements";
import { bySlug } from "../../src/features/inspiration/examples";
import { PRODUCT_LINKS } from "../../src/features/marketing/ia";

const EXAMPLE_SLUGS = [
  "brookfield-motors",
  "station-road-barbers",
  "parkside-valeting",
  "marlowe-and-finch",
  "hollin-physio",
  "pims-kitchen",
  "ada-okafor-maths",
  "forge-strength",
  "northgate-heating",
  "aldous-motor-co",
];

// The marketing site: navigation, product pages, inspiration, pricing, the film and "start from this".
const noSideScroll = async (page: Page) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

test.describe("navigation", () => {
  test("Product opens a real menu from the keyboard; every entry is a real page; Escape closes and returns focus; Designs opens industry categories", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const product = nav.getByRole("button", { name: "Product" });
    await product.focus();
    await page.keyboard.press("Enter");
    await expect(product).toHaveAttribute("aria-expanded", "true");
    for (const l of PRODUCT_LINKS)
      await expect(
        nav.getByRole("link", { name: new RegExp(`^${l.label}`) }),
      ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(product).toHaveAttribute("aria-expanded", "false");
    await expect(product).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("button", { name: "Designs" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      nav.getByRole("link", { name: "Clinics and practitioners", exact: true }),
    ).toHaveAttribute("href", "/inspiration?industry=health");
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("button", { name: "Designs" })).toBeFocused();
  });

  test("with a mouse, hovering opens a menu and moving away closes it", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "Product" }).hover();
    await expect(
      nav.getByRole("link", { name: /Explore the platform/ }),
    ).toBeVisible();
    await page.mouse.move(640, 700);
    await expect(
      nav.getByRole("link", { name: /Explore the platform/ }),
    ).toBeHidden();
  });

  test("the signed-out header offers Pricing and Start free without claiming an account", async ({
    page,
  }) => {
    await page.goto("/pricing");
    const header = page.locator("header").first();
    await expect(header.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(header.getByRole("link", { name: "Open Studio" })).toHaveCount(
      0,
    );
    await expect(
      header.getByRole("link", { name: "Start free" }),
    ).toHaveAttribute("href", /\/onboarding|\/pricing/);
  });

  test("on a phone the header menu has product categories, a visible primary action, Escape and focus return", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(
      sheet.getByRole("link", { name: /The platform/ }),
    ).toBeVisible();
    await expect(sheet.getByRole("link", { name: /^Booking/ })).toBeVisible();
    await expect(
      sheet.getByRole("link", { name: "Start free" }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
    await ctx.close();
  });

  test("earlier marketing addresses still lead somewhere sensible", async ({
    page,
  }) => {
    await page.goto("/features/make-it-yours");
    await expect(page).toHaveURL(/\/product\/design$/);
    await page.goto("/for/car-dealers");
    await expect(page).toHaveURL(/\/inspiration\?industry=motoring$/);
  });
});

test.describe("product pages", () => {
  for (const l of PRODUCT_LINKS) {
    test(`${l.label}: loads without development-status walls or sideways scroll on a phone`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      const page = await ctx.newPage();
      await page.goto(l.href);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByTestId("status")).toHaveCount(0);
      await noSideScroll(page);
      await ctx.close();
    });
  }
  test("the interactive booking demo explains its outcome at the point of use", async ({
    page,
  }) => {
    await page.goto("/product/booking");
    await expect(page.getByTestId("booking-marketing-demo")).toContainText(
      "Nothing is sent or charged.",
    );
  });
});

test.describe("inspiration", () => {
  test("every example has its own page with a live phone and a way to start from it", async ({
    page,
  }) => {
    for (const slug of EXAMPLE_SLUGS) {
      await page.goto(`/inspiration/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(page.getByTestId("start-design")).toHaveAttribute(
        "href",
        `/onboarding?from=${bySlug(slug)!.slug}`,
      );
    }
  });
});

test.describe("pricing", () => {
  test("the comparison table is generated from the entitlements: it cannot claim what a plan does not allow", async ({
    page,
  }) => {
    await page.goto("/pricing");
    const table = page.getByTestId("plan-table");
    const row = (label: string) =>
      table
        .getByRole("row")
        .filter({ has: page.getByRole("rowheader", { name: label }) });
    for (const [i, id] of PLAN_IDS.entries()) {
      const e = resolveEntitlements(id, "active");
      const cell = row("Photo gallery").getByRole("cell").nth(i);
      await expect(cell).toContainText(e.gallery ? "Included" : "Not included");
      const book = row("Online bookings and requests").getByRole("cell").nth(i);
      await expect(book).toContainText(
        e.onlineBooking ? "Included" : "Not included",
      );
    }
    await expect(page.locator("main")).not.toContainText(/full editor/i);
  });
  test("a plan's button carries it into setup", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("link", { name: "Start with Pro" }).click();
    await expect(page).toHaveURL(/\/onboarding\?plan=pro$/);
    await expect(page.getByTestId("plan-intent")).toContainText("Pro");
  });
});

test.describe("film", () => {
});

test.describe("home and widths", () => {
  for (const w of [360, 390, 430, 768, 1024, 1280, 1536]) {
    test(`home, product, inspiration and pricing fit at ${w}px`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
      });
      const page = await ctx.newPage();
      for (const u of [
        "/",
        "/product",
        "/inspiration",
        "/pricing",
        "/how-it-works",
      ]) {
        await page.goto(u);
        await noSideScroll(page);
      }
      await ctx.close();
    });
  }
});
