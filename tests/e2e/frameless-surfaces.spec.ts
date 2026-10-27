import { cont, openDetails } from "./helpers";
import { test, expect } from "@playwright/test";

test("popup surfaces keep focus and dismissal without an outer frame", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Add a cover photo", exact: true }).click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveCSS("border-top-width", "0px");
  await expect(modal.locator("header")).toHaveCSS("border-bottom-width", "0px");
  await expect(modal.locator("footer")).toHaveCSS("border-top-width", "0px");
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await expect(page.getByRole("button", { name: "Add a cover photo", exact: true })).toBeFocused();
  await expect(page.getByRole("button",{name:"View full size"})).toHaveCount(0);
});

test("mobile motion preference changes keep setup intact and stop tonal motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/onboarding");
  await page.getByLabel("Business name", { exact: true }).fill("North Street Studio");
  const field = page.getByTestId("setup-backdrop");
  await expect(field.locator("canvas")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toHaveAttribute("data-reduced-motion", "true");
  await expect(field.locator("canvas")).toHaveCount(0);
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue("North Street Studio");
});


test("closing a chooser does not steal focus from the next field while typing", async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto("/onboarding");
  await page.getByLabel("Business name", { exact:true }).fill("North Street Studio");
  await cont(page);
  await page.getByRole("button", { name:"Barber", exact:true }).click();
  await page.getByRole("button", { name:"Continue", exact:true }).click();
  await page.getByRole("button",{name:"Phone calls",exact:true}).click();
  await openDetails(page);
  await page.getByRole("button",{name:"Instagram",exact:true}).click();
  await page.getByLabel("Instagram profile").fill("northstreet");
  await page.getByLabel("Phone", { exact:true }).pressSequentially("01632 960123", { delay:60 });
    await expect(page.getByLabel("Phone", { exact:true })).toHaveValue("01632 960123");
  await expect(page.getByLabel("Phone", { exact:true })).toBeFocused();
  await page.getByRole("button", { name:"Continue", exact:true }).click();
  await expect(page.getByRole("heading", { level:1 })).toHaveText("Add your first service");
});
