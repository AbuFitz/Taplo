import { cont } from "./helpers";
import { test, expect } from "@playwright/test";

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
