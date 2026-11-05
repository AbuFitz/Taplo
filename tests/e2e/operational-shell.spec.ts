import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState } from "../../src/features/demo/store";
import { applyIndustry, setName } from "../../src/features/demo/actions";
async function openSample(page: Page) {
  await page.goto("/dashboard");
  await page.getByText("Explore with a sample business", { exact: true }).click();
  await page.getByRole("button", { name: /^Jay’s Barbers/ }).click();
  await page.waitForURL("**/dashboard/page");
  await expect(page.getByTestId("my-page")).toBeVisible();
}

test("operational appearance survives navigation and reload without changing the business design", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openSample(page);
  await page.goto("/dashboard");
  const before = await page.evaluate(() => localStorage.getItem("taplo.demo.v2"));
  await page.getByRole("combobox", { name: "Colour mode" }).selectOption("dark");
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  await page.getByRole("navigation", { name: "Studio navigation", exact: true }).locator('a[href="/dashboard/services"]').click();
  await page.waitForURL("**/dashboard/services");
  await page.reload();
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("taplo.demo.v2"))).toBe(before);
  await page.getByRole("button", { name: "Add service", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Add a service", exact: true });
  await form.getByRole("textbox", { name: "Service name", exact: true }).fill("Workshop consultation");
  const formAudit = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
  expect(formAudit.violations).toEqual([]);
  await form.screenshot({ path: "shots/p02-service-form-dark.png" });
  await form.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(form).toBeHidden();
  await expect(page.locator('[data-overlay="detail"]')).toHaveCount(0);
  await page.screenshot({ path: "shots/p02-desktop-dark.png", fullPage: true });
  await page.getByRole("combobox", { name: "Colour mode" }).selectOption("light");
  await page.screenshot({ path: "shots/p02-desktop-light.png", fullPage: true });
  const audit = await new AxeBuilder({ page }).include(".studio-rail").analyze();
  expect(audit.violations).toEqual([]);
});

test("mobile navigation and dialogs remain reachable in both colour schemes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSample(page);
  await page.goto("/dashboard");
  await page.getByTestId("studio").evaluate(async (element) => { await Promise.all(element.getAnimations().map((animation) => animation.finished)); });
  for (const theme of ["light", "dark"] as const) {
    const dock = page.getByRole("navigation", { name: "Studio", exact: true });
    await dock.getByRole("button", { name: "Tools", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Studio sections" });
    await dialog.getByRole("combobox", { name: "Colour mode" }).selectOption(theme);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(dock).toBeVisible();
    const box = await dock.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(52);
    expect(box!.y + box!.height).toBeLessThanOrEqual(845);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `shots/p02-mobile-${theme}.png`, fullPage: true });
    await dock.getByRole("button", { name: "Tools", exact: true }).click();
    await expect(dialog).toBeVisible();
    for (const section of ["page", "services", "products", "bookings", "team", "reviews", "analytics", "help", "settings"]) {
      await expect(dialog.locator(`a[href="/dashboard/${section}"]`)).toBeVisible();
    }
    await dialog.screenshot({ path: `shots/p02-mobile-menu-${theme}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(dock.getByRole("button", { name: "Tools", exact: true })).toBeFocused();
  }
});

test("Studio sections stay reachable and category shortcuts adapt on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/dashboard");
  const draft = setName(applyIndustry(initialState(), "maker"), "Moss Studio");
  draft.onboarded = true;
  draft.step = "finish";
  await page.evaluate((state) => localStorage.setItem("taplo.demo.v2", JSON.stringify(state)), draft);
  await page.reload();
  const dock = page.getByRole("navigation", { name: "Studio", exact: true });
  await expect(dock.getByRole("link", { name: "Products", exact: true })).toBeVisible();
  await dock.getByRole("button", { name: "Tools" }).click();
  const directory = page.getByRole("dialog", { name: "Studio sections" });
  await expect(directory.getByRole("heading", { name: "Create" })).toBeVisible();
  await expect(directory.getByRole("heading", { name: "Run" })).toBeVisible();
  await directory.getByRole("link", { name: "Team", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/team$/);
  await expect(directory).toBeHidden();
  await expect(dock.getByRole("button", { name: "Tools" })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("device theme follows preference changes and keyboard users can skip navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/dashboard");
  await page.getByRole("navigation", { name: "Studio", exact: true }).getByRole("button", { name: "Tools" }).click();
  await page.getByRole("dialog", { name: "Studio sections" }).getByRole("combobox", { name: "Colour mode" }).selectOption("system");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "light");
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#studio-content")).toBeFocused();
});
