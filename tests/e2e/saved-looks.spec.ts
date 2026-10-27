import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import {
  closeSheet,
  insp,
  look,
  openEditorWithSample,
  openRow,
  openSection,
  selectPart,
} from "./helpers";

const draft = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));

for (const width of [390, 1440]) {
  test.describe(`${width}px saved looks`, () => {
    test.use({
      viewport: { width, height: 1000 },
      hasTouch: width === 390,
      isMobile: width === 390,
      reducedMotion: "reduce",
    });
    test("visual snapshots preview the owner's page; applying, editing, deleting and undo preserve content", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await page
        .getByRole("button", { name: "Try Jay’s Barbers" })
        .click();
      await page.waitForURL("**/dashboard/page");
      await expect(page.getByTestId("my-page")).toBeVisible();
      const original = await draft(page);
      await selectPart(page, "page");
      await openSection(page, /^Look/);
      await look(page, "apex").click();
      const shelf = page.getByTestId("saved-looks");
      await shelf.getByLabel("Name this look").fill("Carbon shop");
      await shelf.getByRole("button", { name: "Save", exact: true }).click();
      const saved = (await draft(page)).page.savedLooks[0];
      await expect(
        shelf.getByRole("button", { name: "Apply Carbon shop" }),
      ).toHaveAttribute("aria-pressed", "true");
      const preview = page.frameLocator(
        'iframe[title="Carbon shop saved look preview"]',
      );
      await expect(preview.locator(".tp-name")).toHaveText(
        original.content.identity.name,
      );
      await expect(preview.locator("[data-taplo-page]")).toHaveAttribute(
        "data-bg",
        "solid",
      );
      const beforePreview = await draft(page);
      expect(beforePreview.content).toEqual(original.content);
      expect(beforePreview.page.widgets.map((w: { id: string; type: string }) => [w.id, w.type])).toEqual(original.page.widgets.map((w: { id: string; type: string }) => [w.id, w.type]));
      await look(page, "night").click();
      await expect(
        shelf.getByRole("button", { name: "Apply Carbon shop" }),
      ).toHaveAttribute("aria-pressed", "false");
      // The saved card stays carbon while the main draft changes to Night.
      // Shelf previews mount only while visible; the look picker scrolls the shelf away on a phone.
      await shelf.scrollIntoViewIfNeeded();
      await expect(preview.locator("[data-taplo-page]")).toHaveAttribute(
        "data-bg",
        "solid",
      );
      await shelf.getByRole("button", { name: "Apply Carbon shop" }).click();
      expect((await draft(page)).page.themeId).toBe("volt");
      await closeSheet(page);
      await page.getByTestId("undo").click();
      expect((await draft(page)).page.themeId).toBe("noir");
      await page.getByTestId("redo").click();
      expect((await draft(page)).page.themeId).toBe("volt");
      await page.reload();
      await expect(page.getByTestId("my-page")).toBeVisible();
      await selectPart(page, "page");
      await openSection(page, /^Look/);
      expect((await draft(page)).page.savedLooks[0]).toEqual(saved);
      await expect(
        shelf.getByRole("button", { name: "Apply Carbon shop" }),
      ).toBeVisible();
      await shelf.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await page.screenshot({
        path: path.join(
          process.env.TAPLO_REVIEW_DIR ?? "test-results",
          `saved-looks-${width}.png`,
        ),
        fullPage: true,
      });
      await shelf.getByRole("button", { name: "Delete Carbon shop" }).click();
      expect((await draft(page)).page.savedLooks).toHaveLength(0);
      expect((await draft(page)).page.themeId).toBe("volt");
      await closeSheet(page);
      await page.getByTestId("undo").click();
      expect((await draft(page)).page.savedLooks[0]).toEqual(saved);
      expect((await draft(page)).content).toEqual(original.content);
      expect((await draft(page)).page.widgets).toEqual(original.page.widgets);
    });
    test("saved section cards show current content and apply independent copies", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await page
        .getByRole("button", { name: "Try Jay’s Barbers" })
        .click();
      await page.waitForURL("**/dashboard/page");
      await expect(page.getByTestId("my-page")).toBeVisible();
      const before = await draft(page);
      await openRow(page, "priceMenu");
      await insp(page).getByRole("tab", { name: "Appearance" }).click();
      await insp(page)
        .getByRole("radio", { name: "Featured", exact: true })
        .locator("xpath=ancestor::label")
        .click();
      await insp(page).getByLabel("Card colour hex value").fill("#1f2a44");
      const shelf = page.getByTestId("saved-styles");
      await shelf.getByLabel("Name this style").fill("Deep blue");
      await shelf.getByRole("button", { name: "Save", exact: true }).click();
      const snapshot = (await draft(page)).page.savedStyles[0];
      await shelf.getByRole("button", { name: "Apply Deep blue", exact: true }).scrollIntoViewIfNeeded();
      const preview = page.frameLocator(
        'iframe[title="Deep blue saved style preview"]',
      );
      await expect(preview.locator('[data-widget="priceMenu"]')).toContainText(
        "Haircut",
      );
      await expect(preview.locator(".tp-card")).toHaveCSS(
        "background-color",
        "rgb(31, 42, 68)",
      );
      await insp(page)
        .getByRole("button", { name: "Reset to page style", exact: true })
        .click();
      expect((await draft(page)).page.savedStyles[0]).toEqual(snapshot);
      await shelf
        .getByRole("button", { name: "Apply Deep blue", exact: true })
        .click();
      const after = await draft(page);
      expect(
        after.page.widgets.find((w: { type: string }) => w.type === "priceMenu")
          .appearance,
      ).toEqual(snapshot.appearance);
      expect(after.content).toEqual(before.content);
      expect(
        after.page.widgets.filter(
          (w: { type: string }) => w.type !== "priceMenu",
        ),
      ).toEqual(
        before.page.widgets.filter(
          (w: { type: string }) => w.type !== "priceMenu",
        ),
      );
      await page.waitForTimeout(250);
      await page.screenshot({
        path: path.join(
          process.env.TAPLO_REVIEW_DIR ?? "test-results",
          `saved-styles-${width}.png`,
        ),
        fullPage: true,
      });
      await shelf
        .getByRole("button", { name: "Delete Deep blue", exact: true })
        .click();
      expect((await draft(page)).page.savedStyles).toHaveLength(0);
      expect(
        (await draft(page)).page.widgets.find(
          (w: { type: string }) => w.type === "priceMenu",
        ).appearance,
      ).toEqual(snapshot.appearance);
      await closeSheet(page);
      await page.getByTestId("undo").click();
      expect((await draft(page)).page.savedStyles[0]).toEqual(snapshot);
      await page.reload();
      await expect(page.getByTestId("my-page")).toBeVisible();
      expect((await draft(page)).page.savedStyles[0]).toEqual(snapshot);
    });
  });
}

test("full shelves keep earlier looks and section styles rather than evicting them", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openEditorWithSample(page, "Mechanic");
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    s.page.savedLooks = Array.from({ length: 12 }, (_, i) => ({
      id: `look-${i}`,
      name: `Look ${i + 1}`,
      themeId: "clean",
      overrides: {},
    }));
    s.page.savedStyles = Array.from({ length: 20 }, (_, i) => ({
      id: `style-${i}`,
      name: `Style ${i + 1}`,
      appearance: { emphasis: "featured" },
    }));
    localStorage.setItem("taplo.demo.v2", JSON.stringify(s));
  });
  await page.reload();
  await expect(page.getByTestId("my-page")).toBeVisible();
  const before = await draft(page);
  await selectPart(page, "page");
  const shelf = page.getByTestId("saved-looks");
  await shelf.getByLabel("Name this look").fill("A new look");
  await expect(
    shelf.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await expect(shelf).toContainText("Remove one to make room");
  expect((await draft(page)).page.savedLooks).toEqual(before.page.savedLooks);
  await shelf
    .getByRole("button", { name: "Delete Look 12", exact: true })
    .click();
  await expect(
    shelf.getByRole("button", { name: "Save", exact: true }),
  ).toBeEnabled();
  await shelf.getByRole("button", { name: "Save", exact: true }).click();
  expect(
    (await draft(page)).page.savedLooks.map((l: { name: string }) => l.name),
  ).toContain("Look 1");
  expect((await draft(page)).page.savedLooks).toHaveLength(12);
  await openRow(page, "serviceList");
  await insp(page).getByRole("tab", { name: "Appearance" }).click();
  await insp(page)
    .getByRole("radio", { name: "Featured" })
    .locator("xpath=ancestor::label")
    .click();
  const styles = page.getByTestId("saved-styles");
  await styles.getByLabel("Name this style").fill("Another style");
  await expect(
    styles.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  expect((await draft(page)).page.savedStyles).toEqual(before.page.savedStyles);
});
