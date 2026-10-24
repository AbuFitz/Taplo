import { expect, test, type Page } from "@playwright/test";
import { closeSheet, openStructure, selectPart, pickLook, addWidget, openEditorWithSample, insp, openRow, openSection, pngFile, previewFrame, previewOrder, row, rowOrder } from "./helpers";

const pickOption = async (page: Page, trigger: string | RegExp, option: string | RegExp) => {
  await page.getByRole("combobox", { name: trigger }).click();
  await page.getByRole("option", { name: option }).click();
};
const preview = (page: Page) => page.frameLocator('iframe[data-testid="setup-live-page"], iframe[title="Live preview of your page"]').first();

test.describe("onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("home offers a real way in; the first question is the business name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Start free" }).first()).toHaveAttribute("href", "/onboarding");
    await page.goto("/onboarding");
    await expect(page.getByRole("heading", { name: "Make it yours." })).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/pick your trade/i);
  });

  test("setup preserves owner-entered content through review and browser-only publishing",async({page})=>{
    await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('Paws & Polish');await page.getByRole('button',{name:'Continue',exact:true}).click()
    await page.getByRole('button',{name:'Use a different business type',exact:true}).click();await page.getByLabel('Describe your business').fill('Dog groomer');await page.getByRole('button',{name:'Continue',exact:true}).click()
    await page.getByLabel('Email',{exact:true}).fill('hello@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click()
    await page.getByLabel('Service 1 name').fill('Full groom');await page.getByLabel('Service 1 price').fill('45');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
    await page.getByRole('button',{name:'Continue',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Review your page',exact:true})).toBeVisible();await page.getByRole('button',{name:'Publish my page',exact:true}).click()
    await expect(page.getByRole('status')).toContainText('Saved as your page')
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!));expect(saved.published.content.services[0].name).toBe('Full groom')
    await page.goto('/demo/p/paws-and-polish');await expect(page.getByRole('heading',{level:1})).toHaveText('Paws & Polish');await expect(page.locator('[data-widget="serviceList"]')).toContainText('Full groom')
  });

  test("progress survives a reload", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByLabel("Business name").fill("Olive Test Barbers");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("list", { name: "Kinds of business" }).getByRole("button", { name: "Barber" }).click();
    await page.reload();
    await expect(page.getByRole("heading", { name: "What do you do?" })).toBeVisible();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Business name")).toHaveValue("Olive Test Barbers");
    await expect(preview(page).getByRole("heading", { level: 1 })).toHaveText("Olive Test Barbers");
  });

  test("phone: the focused form fits at 390px and retains the live preview", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/onboarding");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.getByLabel("Business name").fill("Clearpath");
    await expect(page.getByRole("button", { name: "Expand preview" })).toHaveCount(0);
    await expect(page.locator(".setup-canvas")).toBeHidden();
    await expect(page.frameLocator('iframe[data-testid="setup-live-page"]').getByRole("heading", { level: 1 })).toHaveText("Clearpath");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test("an older saved draft is migrated, keeping the owner's content and colour choices", async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => {
      localStorage.removeItem("taplo.demo.v2");
      localStorage.setItem("taplo.demo.v1", JSON.stringify({
        v: 1, step: "review", onboarded: true, plan: "business", slugEdited: true, published: null,
        content: { identity: { name: "Legacy Cuts", slug: "legacy-cuts", industryKey: "barber", industryLabel: "Barber" }, location: { mode: "premises", locality: "Luton", timezone: "Europe/London" }, contacts: { phone: "01632960111", social: [] }, credentials: [], hours: [], services: [{ id: "s1", name: "Haircut", priceMode: "fixed", priceMinor: 2000, currency: "GBP", delivery: [], bookingMode: "contact", sortOrder: 0, archived: false }], staff: [], gallery: [], testimonials: [], reviewLinks: [], faqs: [], caseStudies: [], booking: { mode: "contact", onlineBookingReady: false } },
        config: { schemaVersion: 1, layoutId: "beauty-v1", layoutVersion: 1, tokenPresetId: "beauty-light", overrides: { accent: "#123456" } },
      }));
    });
    await page.goto("/dashboard/page");
    await expect(page.getByTestId("my-page")).toBeVisible();
    await expect(preview(page).getByRole("heading", { level: 1 })).toHaveText("Legacy Cuts");
    await expect(page.getByText(/updated to the latest design system/).first()).toBeVisible();
    const s = await page.evaluate(() => ({ v1: localStorage.getItem("taplo.demo.v1"), v2: JSON.parse(localStorage.getItem("taplo.demo.v2")!) }));
    expect(s.v1).toBeNull();
    expect(s.v2.page.themeId).toBe("clean");
    expect(s.v2.page.appearance.colors.accent).toBe("#123456");
    expect(s.v2.content.services[0].name).toBe("Haircut");
    await expect(preview(page).locator('[data-widget="serviceList"], [data-widget="priceMenu"]').first()).toContainText("Haircut");
  });
});

test.describe("records flow into widgets (nothing is copied)", () => {
  test("products and offers: add a record → widget shows it → archive → widget explains and hides", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted");
    await page.goto("/dashboard/products");
    await expect(page.getByText("No products yet")).toBeVisible();
    await page.getByRole("button", { name: "Add item" }).click();
    await page.getByLabel("Name").first().fill("Oatmeal dog shampoo");
    await page.getByLabel("Price (£, optional)").fill("8.50");
    await page.getByRole("button", { name: "Save product" }).click();
    await expect(page.getByText("Oatmeal dog shampoo")).toBeVisible();

    await page.goto("/dashboard/services");
    await page.getByLabel("Offer title").fill("First groom 10% off");
    await page.getByLabel("Last day (optional)").fill("2020-01-01");
    await page.getByRole("button", { name: "Add offer" }).click();
    await expect(page.getByText("Expired · hidden")).toBeVisible();

    await page.getByRole("link", { name: "My page" }).first().click();
    await addWidget(page, /^Products/);
    await expect(preview(page).locator('[data-widget="products"]')).toContainText("Oatmeal dog shampoo");
    await expect(preview(page).locator('[data-widget="products"]')).toContainText("£8.50");
    await addWidget(page, /^Offers/);
    await openStructure(page);
    await expect(row(page, "offers")).toContainText("Needs a first entry");        // expired offer is hidden, and explained
    await expect(preview(page).locator('[data-widget="offers"]')).toHaveCount(0);

    await page.goto("/dashboard/products");
    await page.getByRole("button", { name: "Archive" }).first().click();
    await page.getByRole("link", { name: "My page" }).first().click();
    await expect(row(page, "products")).toContainText("Needs a first entry");
    await expect(preview(page).locator('[data-widget="products"]')).toHaveCount(0);
  });

  test("a service added in Services appears in every service widget at once", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted");
    await page.goto("/dashboard/services");
    await page.getByRole("button", { name: "Add service" }).click();
    await page.getByLabel("Service name").fill("Nail trim");
    await pickOption(page, "Price", "Fixed price");
    await page.getByLabel("Amount (£)").fill("9");
    await page.getByRole("button", { name: "Save service" }).click();
    await page.getByRole("link", { name: "My page" }).first().click();
    await expect(preview(page).locator('[data-widget="serviceList"]')).toContainText("Nail trim");
    await openRow(page, "serviceList");
    // picking a subset by reference
    await insp(page).getByRole("checkbox", { name: /Show all/ }).uncheck();
    await insp(page).getByRole("checkbox", { name: /Nail trim/ }).uncheck();
    await expect(preview(page).locator('[data-widget="serviceList"]')).not.toContainText("Nail trim");
    await expect(preview(page).locator('[data-widget="serviceList"]')).toContainText("Full groom");
  });
});

test.describe("plans and page settings", () => {
  test("Free keeps the suggested theme and shows why things are locked; content is never deleted", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await page.goto("/dashboard/settings");
    await pickOption(page, "Simulated plan", /^Free/);
    await page.goto("/dashboard/page");
    await selectPart(page, "page");
    await openSection(page, /^Look/);
    await expect(page.getByText("Choosing a different theme is included from the Core plan.")).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Look" }).locator('label[data-choice="colour"] input')).toBeDisabled();
    await openStructure(page);
    await expect(row(page, "gallery")).toContainText("Not on your page");
    await expect(row(page, "gallery")).toContainText("Galleries are included from the Core plan");
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.gallery.length)).toBeGreaterThan(0);
    // upgrade restores everything
    await page.goto("/dashboard/settings");
    await pickOption(page, "Simulated plan", /^Pro/);
    await page.goto("/dashboard/page");
    await expect(row(page, "gallery")).toContainText("3 photos");
    await expect(row(page, "gallery")).not.toContainText("Not on your page");
  });

  test("page settings: address validation, search visibility, share text and honest domain state", async ({ page }) => {
    await openEditorWithSample(page, "Tutor");
    await selectPart(page, "settings");
    await page.getByLabel("Your web address").fill("book");
    await page.getByLabel("Your web address").blur();
    await expect(page.getByText("That address is reserved. Try another.")).toBeVisible();
    await page.getByLabel("Your web address").fill("clearpath-maths");
    await expect(page.getByText("mytaplo.com/clearpath-maths").first()).toBeVisible();
    await page.getByLabel("Title when shared (optional)").fill("Clearpath — maths tuition");
    await expect(page.getByLabel("Link preview")).toContainText("Clearpath — maths tuition");
    const sw = page.getByRole("switch", { name: /Let Google and others find my page/ });
    await expect(sw).toBeChecked();
    await sw.click();
    await expect(sw).not.toBeChecked();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.meta.searchVisible)).toBe(false);
    await expect(page.getByText("Not connected in this demo")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeDisabled(); // nothing to share until published
  });

  test("navigation puts My page first; overview links to it", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic");
    await page.getByRole("button", { name: "Open menu" }).click();   // the editor uses the full width, so the menu lives in the top bar
    const links = await page.getByRole("navigation", { name: "Dashboard" }).getByRole("link").allTextContents();
    expect(links[0]!.trim()).toBe("My page");
    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: "Edit my page" })).toHaveAttribute("href", "/dashboard/page");
    await page.goto("/dashboard/bookings");
    await expect(page.getByRole("heading", { name: "Bookings", level: 1 })).toBeVisible(); // the owner calendar is real
  });
});

test.describe("editing on a phone", () => {
  test.use({ hasTouch: true });
  for (const width of [360, 390]) {
    test(`add, reorder, restyle and preview at ${width}px with no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await openEditorWithSample(page, "Unlisted");
      const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(await overflow()).toBeLessThanOrEqual(0);

      // add a widget in a single column, with big tap targets
      await addWidget(page, /^Notice/);
      await insp(page).getByRole("textbox", { name: "Message" }).fill("Closed on Monday");
      expect(await overflow()).toBeLessThanOrEqual(0);
      await openStructure(page);
      await page.waitForTimeout(700);
      const handle = await row(page, "announcement").getByTestId("drag-handle").boundingBox();
      expect(handle!.width).toBeGreaterThanOrEqual(44);
      expect(handle!.height).toBeGreaterThanOrEqual(44);

      // reorder with the move buttons (the touch-friendly alternative)
      const start = await rowOrder(page);
      const last = start[start.length - 1]!;
      await openRow(page, last); await insp(page).getByRole("button", { name: "Move up" }).click();
      await openStructure(page);
      expect((await rowOrder(page))[start.length - 2]).toBe(last);

      // design tab fits too
      await pickLook(page, "colour");
      expect(await overflow()).toBeLessThanOrEqual(0);
      await selectPart(page, "settings");
      expect(await overflow()).toBeLessThanOrEqual(0);

      // the customer preview shows exactly what was just edited
      await closeSheet(page);
      await page.getByTestId("customer-preview").tap();
      const frame = previewFrame(page);
      await expect(frame.locator('[data-widget="announcement"]')).toContainText("Closed on Monday");
      await expect(frame.locator("[data-taplo-page]")).toHaveAttribute("data-header", "centered");
      expect(await overflow()).toBeLessThanOrEqual(0);
      await expect(page.getByTestId("customer-preview")).toBeVisible();
    });
  }

  test("the 200% zoom case (640px) still fits", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 450 });
    await openEditorWithSample(page, "Barber");
    for (const tab of ["select-page", "select-header", "select-details", "select-settings"]) {
      await selectPart(page, tab.replace("select-", "") as "page");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), tab).toBeLessThanOrEqual(0);
    }
  });
});

test("uploading a logo in the editor preserves the asset on the published page", async ({ page }) => {
  await openEditorWithSample(page, "Consultant");
  await selectPart(page, "header");
  await openSection(page, "Header");
  // Name only hides the picture; choosing a shape later reveals the uploaded logo.
  await page.getByRole("radio", { name: "Name only", exact: true }).locator("xpath=ancestor::label").click();
  await openSection(page, "Logo and cover");
  await page.getByLabel("Logo or profile picture: upload a picture").setInputFiles(pngFile());
  await page.getByTestId("crop-dialog").getByRole("button", {name:"Use image",exact:true}).click();
  await expect(page.getByText("this look shows no picture")).toBeVisible();
  await page.getByRole("radio", { name: "Circle" }).locator("xpath=ancestor::label").click();
  await expect(page.getByText("this look shows no picture")).toHaveCount(0);
  await expect(preview(page).locator(".tp-header img").first()).toBeVisible();
  await selectPart(page, "settings");
  await page.getByRole("button", { name: "Publish", exact: true }).first().click();
  const slug = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.slug);
  const pub = await page.context().newPage();
  await pub.goto(`/demo/p/${slug}`);
  await expect(pub.locator(".tp-avatar img, .tp-header img").first()).toBeVisible();
  expect(await previewOrder(page)).toEqual(await pub.locator("[data-widget]").evaluateAll((e) => e.map((x) => x.getAttribute("data-widget"))));
});
