import { expect, test, type Page } from "@playwright/test";

const pickOption = async (page: Page, trigger: string | RegExp, option: string | RegExp) => {
  await page.getByRole("combobox", { name: trigger }).click();
  await page.getByRole("option", { name: option }).click();
};

test.describe("demo mode journey (no auth)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("home offers a real Create your page link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Create your page" })).toHaveAttribute("href", "/onboarding");
  });

  test("onboarding: unlisted industry → publish → published page", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("button", { name: /^Other \/ describe/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('#why-disabled')).toContainText("Choose a type of business");
    await page.getByLabel("Describe your business").fill("Dog groomer");
    await page.getByRole("button", { name: "Continue" }).click();

    // Business step: reserved + invalid addresses are blocked; name auto-fills a valid one.
    await page.getByLabel("Business name").fill("Paws & Polish");
    await expect(page.getByLabel("Your web address")).toHaveValue("paws-and-polish");
    await page.getByLabel("Your web address").fill("book");
    await expect(page.getByText("That address is reserved. Try another.").first()).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('#why-disabled')).toContainText("valid web address");
    await page.getByLabel("Your web address").fill("paws-and-polish");
    await page.getByLabel("Town or area").fill("Harpenden");
    await page.getByRole("button", { name: "Continue" }).click();

    // Contacts: invalid phone rejected, at least one channel required.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator('#why-disabled')).toContainText("at least one way");
    await page.getByLabel("Phone").fill("12");
    await expect(page.getByText("Enter a valid phone number")).toBeVisible();
    await page.getByLabel("Phone").fill("01632 960987");
    await page.getByRole("button", { name: "Continue" }).click();

    // Service: nothing pre-priced; price required for fixed/from.
    await page.getByLabel("Service name").fill("Full groom");
    await pickOption(page, "Price", "Fixed price");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter a price")).toBeVisible();
    await page.getByLabel("Amount (£)").fill("45");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Preview & publish" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish my page" })).toBeEnabled();
    await page.getByRole("button", { name: "Publish my page" }).click();
    await expect(page.getByRole("status")).toContainText("Published (demo) — version 1");

    await page.goto("/demo/p/paws-and-polish");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Paws & Polish");
    await expect(page.getByText("Dog groomer").first()).toBeVisible();
    await expect(page.getByText("£45").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Call/ }).first()).toHaveAttribute("href", "tel:01632960987");
    await expect(page.getByRole("note")).toContainText("stored in this browser only");
    // Nothing invented: no reviews, no gallery, no rating.
    await expect(page.locator('[data-block="reviews"]')).toHaveCount(0);
    await expect(page.locator('[data-block="gallery"]')).toHaveCount(0);
  });

  test("onboarding progress survives a reload and the live preview updates", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("list", { name: "Types of business" }).getByRole("button", { name: "Barber" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Business name").fill("Olive Test Barbers");
    await page.reload();
    await expect(page.getByRole("heading", { name: "Name & address" })).toBeVisible();
    await expect(page.getByLabel("Business name")).toHaveValue("Olive Test Barbers");
    const frame = page.frameLocator('iframe[title="Live preview of your page"]').first();
    await expect(frame.getByRole("heading", { level: 1 })).toHaveText("Olive Test Barbers");
  });

  test("dashboard: sample business, services CRUD + archive, plan gating, publish, reset", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Barber" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Draft — not published")).toBeVisible();
    // No fabricated metrics.
    await expect(page.getByLabel("Profile views: not tracked yet")).toBeVisible();

    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByText(/Published · v1/)).toBeVisible();

    // Services: add, validate, archive.
    await page.getByRole("link", { name: "Services" }).first().click();
    await page.getByRole("button", { name: "Add service" }).click();
    await page.getByRole("button", { name: "Save service" }).click();
    await expect(page.getByText("Give the service a name.")).toBeVisible();
    await page.getByLabel("Service name").fill("Kids cut");
    await pickOption(page, "Price", "Fixed price");
    await page.getByLabel("Amount (£)").fill("15.50");
    await page.getByRole("button", { name: "Save service" }).click();
    await expect(page.getByText("Kids cut")).toBeVisible();
    await expect(page.getByText("£15.50")).toBeVisible();
    await page.getByRole("listitem").filter({ hasText: "Kids cut" }).getByRole("button", { name: "Archive" }).click();
    await expect(page.getByRole("heading", { name: "Archived" })).toBeVisible();
    await page.getByRole("button", { name: "Restore" }).click();
    await expect(page.getByRole("heading", { name: "Archived" })).toHaveCount(0);

    // Plan gating: Free hides services beyond 3, locks layouts, never deletes.
    await page.goto("/dashboard/settings");
    await pickOption(page, "Simulated plan", /^Free/);
    await page.goto("/dashboard/services");
    await expect(page.getByRole("status")).toContainText("first 3 services");
    await page.goto("/dashboard/profile");
    await page.getByRole("tab", { name: /Layout/ }).click();
    await expect(page.getByText("Choosing a different layout starts on the Core plan")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Trades/ })).toBeDisabled();

    // Upgrade: layout switch changes composition, not content.
    await page.goto("/dashboard/settings");
    await pickOption(page, "Simulated plan", /^Core/);
    await page.goto("/dashboard/profile");
    await page.getByRole("tab", { name: /Layout/ }).click();
    await page.getByRole("button", { name: /^Professional/ }).click();
    const frame = page.frameLocator('iframe[title="Live preview of your page"]').first();
    await expect(frame.locator('[data-family="professional"]')).toBeVisible();
    await expect(frame.getByRole("heading", { level: 1 })).toHaveText("Olive & Oak Barbers");

    // Reset really clears.
    await page.goto("/dashboard/settings");
    await page.getByRole("button", { name: "Reset demo data" }).click();
    await page.getByRole("button", { name: "Yes, reset" }).click();
    await expect(page.getByRole("heading", { name: "Let’s set up your page" })).toBeVisible();
  });

  test("unbuilt areas are honestly labelled, not faked", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Tutor" }).click();
    for (const [path, phase] of [["bookings", "Phase 6"], ["analytics", "Phase 5"], ["products", "Phase 9"]] as const) {
      await page.goto(`/dashboard/${path}`);
      await expect(page.getByText(`Not built yet · ${phase}`)).toBeVisible();
    }
  });

  test("dashboard is usable at 390px with the mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Mechanic" }).click();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Services" }).click();
    await expect(page.getByRole("heading", { name: "Services" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
