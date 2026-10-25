import { expect, test } from "@playwright/test";
import {
  openEditorWithSample,
  selectPart,
  openSection,
  previewFrame,
} from "./helpers";

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test.describe(`${viewport.width}px workspace`, () => {
    test.use({ viewport });
    test("team editing, removal recovery and individual hours", async ({
      page,
    }) => {
      await openEditorWithSample(page);
      await page.goto("/dashboard/team");
      await page.getByTestId("team-add").click();
      const dialog = page.getByTestId("team-person-editor");
      await dialog.getByLabel("Name", { exact: true }).fill("Amira Patel");
      await dialog
        .getByLabel("Role or speciality (optional)")
        .fill("Colour specialist");
      await dialog.getByRole("button", { name: "Save team member" }).click();
      let card = page
        .getByTestId("team-person")
        .filter({ hasText: "Amira Patel" });
      await expect(card).toBeVisible();
      await card
        .getByRole("button", { name: "Edit Amira Patel", exact: true })
        .click();
      await dialog.getByLabel("Name", { exact: true }).fill("Amira Shah");
      await dialog.getByRole("button", { name: "Save team member" }).click();
      await page.reload();
      card = page.getByTestId("team-person").filter({ hasText: "Amira Shah" });
      await expect(card).toBeVisible();
      await card
        .getByRole("button", { name: "Remove Amira Shah", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Remove profile", exact: true })
        .click();
      await expect(card).toHaveCount(0);
      await page.getByRole("button", { name: "Undo removal" }).click();
      await card.getByRole("link", { name: "Working hours" }).click();
      await expect(page.getByLabel("Whose hours")).toHaveValue(
        await page.evaluate(
          () =>
            JSON.parse(
              localStorage.getItem("taplo.demo.v2")!,
            ).content.staff.find(
              (p: { name: string }) => p.name === "Amira Shah",
            ).id,
        ),
      );
      await page.getByRole("button", { name: "Edit Monday hours" }).click();
      const hours = page.getByTestId("working-hours-editor");
      if (
        await hours
          .getByRole("switch", { name: "Unavailable all day" })
          .isChecked()
      )
        await hours
          .getByRole("switch", { name: "Unavailable all day" })
          .click();
      await hours.getByLabel("From 1", { exact: true }).fill("17:00");
      await hours.getByLabel("Until 1", { exact: true }).fill("09:00");
      await hours.getByRole("button", { name: "Save hours" }).click();
      await expect(
        hours.getByText("Each period must end after it starts."),
      ).toBeVisible();
      await hours.getByLabel("From 1", { exact: true }).fill("09:00");
      await hours.getByLabel("Until 1", { exact: true }).fill("17:00");
      await hours.getByRole("button", { name: "Add a one-hour break" }).click();
      await expect(hours.getByLabel("From 2", { exact: true })).toHaveValue(
        "13:30",
      );
      await hours
        .getByRole("button", { name: /Also apply these hours/ })
        .click();
      await hours
        .getByRole("checkbox", { name: "Tuesday", exact: true })
        .check();
      await hours.getByRole("button", { name: "Save hours" }).click();
      await page.reload();
      await expect(page.locator('[data-day="mon"]')).toContainText("12:30");
      await expect(page.locator('[data-day="tue"]')).toContainText("13:30");
      await expect(page.locator("body")).toHaveJSProperty(
        "scrollWidth",
        viewport.width,
      );
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `work/engine-hours-${viewport.width}.png`,
        fullPage: true,
      });
    });
    test("dark finish, live motion, persistence and reduced motion", async ({
      page,
    }) => {
      await openEditorWithSample(page);
      await selectPart(page, "page");
      await openSection(page, /^Wallpaper/);
      await page.getByRole("radio", { name: "Mono flow", exact: true }).check();
      await page
        .getByRole("radiogroup", { name: "Background pace" })
        .getByText("Lively", { exact: true })
        .click();
      const bg = previewFrame(page).locator(".tp-bg-gradient");
      await expect(bg).toHaveCSS("animation-duration", "7s");
      const first = await bg.evaluate(
        (el) => getComputedStyle(el).backgroundPosition,
      );
      await page.waitForTimeout(800);
      expect(
        await bg.evaluate((el) => getComputedStyle(el).backgroundPosition),
      ).not.toBe(first);
      await page.reload();
      await expect(bg).toHaveCSS("animation-duration", "7s");
      await expect(previewFrame(page).getByRole("heading", { level: 1 })).toBeVisible();
      await selectPart(page, "page");
      await openSection(page, /^Wallpaper/);
      await page.getByRole("radiogroup", { name: "Background pace" }).getByText("Still", { exact: true }).click();
      await expect(bg).toHaveCSS("animation-name", "none");
      await page.getByRole("radiogroup", { name: "Background pace" }).getByText("Flow", { exact: true }).click();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(bg).toHaveCSS("animation-name", "none");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `work/engine-finish-${viewport.width}.png`,
        fullPage: true,
      });
    });
    test("date exceptions and booking rules save atomically", async ({
      page,
    }) => {
      await openEditorWithSample(page);
      await page.goto("/dashboard/bookings?section=availability");
      await page.getByRole("button", { name: "Add date", exact: true }).click();
      const date = page.getByTestId("date-hours-editor");
      await date.getByLabel("Date", { exact: true }).fill("2027-01-04");
      await date.getByRole("button", { name: "Save date" }).click();
      await page
        .getByRole("button", { name: "Edit hours for 2027-01-04" })
        .click();
      await expect(
        date.getByRole("switch", { name: "Unavailable all day" }),
      ).toBeChecked();
      await date.getByRole("switch", { name: "Unavailable all day" }).click();
      await date.getByLabel("From 1", { exact: true }).fill("10:00");
      await date.getByLabel("Until 1", { exact: true }).fill("14:00");
      await date.getByRole("button", { name: "Save date" }).click();
      await page
        .getByRole("button", { name: "Remove hours for 2027-01-04" })
        .click();
      await page.getByRole("button", { name: "Undo", exact: true }).click();
      await page.getByRole("button", { name: /^Booking rules/ }).click();
      const rules = page.getByTestId("booking-rules-editor");
      await rules.getByLabel("Minimum notice (hours)").fill("12");
      await rules.getByRole("button", { name: "Save booking rules" }).click();
      await page.reload();
      await expect(
        page.getByRole("button", { name: /^Booking rules/ }),
      ).toContainText("12h notice");
      await page
        .getByRole("button", { name: "Edit hours for 2027-01-04" })
        .click();
      await expect(date.getByLabel("From 1", { exact: true })).toHaveValue(
        "10:00",
      );
      await expect(date.getByLabel("Until 1", { exact: true })).toHaveValue(
        "14:00",
      );
    });
    test("calendar defaults suit the screen and day grid is keyboard usable", async ({
      page,
    }) => {
      await openEditorWithSample(page);
      await page.goto("/dashboard/bookings");
      if (viewport.width < 641)
        await expect(
          page.getByRole("button", { name: "Agenda", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: "Day", exact: true }).click();
      const cells = page.locator("[data-calendar-slot]");
      await cells.first().focus();
      await page.keyboard.press("ArrowDown");
      await expect(cells.nth(1)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
    });
  });
}
