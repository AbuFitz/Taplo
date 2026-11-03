import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openEditorWithSample } from "./helpers";

test("operational appearance survives navigation and reload without changing the business design", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openEditorWithSample(page);
  await page.goto("/dashboard");
  const before = await page.evaluate(() => localStorage.getItem("taplo.demo.v2"));
  await page.getByRole("combobox", { name: "Colour mode" }).selectOption("dark");
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  await page.getByRole("navigation", { name: "Studio navigation", exact: true }).locator('a[href="/dashboard/services"]').click();
  await page.reload();
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("taplo.demo.v2"))).toBe(before);
  await page.screenshot({ path: "shots/p02-desktop-dark.png", fullPage: true });
  await page.getByRole("combobox", { name: "Colour mode" }).selectOption("light");
  await page.screenshot({ path: "shots/p02-desktop-light.png", fullPage: true });
  const audit = await new AxeBuilder({ page }).include(".studio-header").analyze();
  expect(audit.violations).toEqual([]);
});

test("mobile navigation and dialogs remain reachable in both colour schemes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openEditorWithSample(page);
  await page.goto("/dashboard");
  for (const theme of ["light", "dark"] as const) {
    await page.getByRole("combobox", { name: "Colour mode" }).selectOption(theme);
    const dock = page.getByRole("navigation", { name: "Studio", exact: true });
    await expect(dock).toBeVisible();
    const box = await dock.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(52);
    expect(box!.y + box!.height).toBeLessThanOrEqual(845);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `shots/p02-mobile-${theme}.png`, fullPage: true });
    await dock.getByRole("button", { name: "More", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Your workspace" });
    await expect(dialog).toBeVisible();
    await dialog.screenshot({ path: `shots/p02-mobile-menu-${theme}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(dock.getByRole("button", { name: "More", exact: true })).toBeFocused();
  }
});

test("device theme follows preference changes and keyboard users can skip navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/dashboard");
  await page.getByRole("combobox", { name: "Colour mode" }).selectOption("system");
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("[data-operational]")).toHaveAttribute("data-colour-scheme", "light");
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#studio-content")).toBeFocused();
});
