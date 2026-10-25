import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  openEditorWithSample,
  openStructure,
  row,
  insp,
  previewFrame,
} from "./helpers";
test.use({ hasTouch: true });
for (const width of [320, 390, 1440])
  test(`gallery selection, order and captions survive edits at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Barber");
    // Three separate photo references make ordering observable in the customer renderer.
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
      const photo = state.content.gallery[0];
      state.content.gallery = [
        photo,
        { ...photo, id: "second-photo", caption: "Second photo" },
        { ...photo, id: "third-photo", caption: "Third photo" },
      ];
      localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
    });
    await page.reload();
    await openStructure(page);
    await row(page, "gallery").getByTestId("select-widget").click();
    const picker = insp(page).getByTestId("gallery-photo-picker");
    await expect(picker.locator("li")).toHaveCount(3);
    await picker
      .getByRole("button", { name: "Move Third photo earlier", exact: true })
      .click();
    await expect(picker.locator("li").nth(1)).toContainText("Third photo");
    await picker
      .getByRole("button", { name: /^Include Second photo,/ })
      .click();
    await expect(
      picker.getByRole("button", { name: /^Include Second photo,/ }),
    ).toHaveAttribute("aria-pressed", "false");
    await expect(previewFrame(page).getByTestId("gallery-open")).toHaveCount(2);
    await picker
      .getByRole("button", { name: "Edit Third photo", exact: true })
      .click();
    const dialog = page.getByTestId("gallery-photo-editor");
    await dialog.getByLabel("Caption (optional)").fill("The workshop");
    await dialog.getByTestId("record-editor-save").click();
    await expect(dialog).toBeHidden();
    await expect(
      picker.getByRole("button", { name: "Edit The workshop", exact: true }),
    ).toBeFocused();
    await page.reload();
    await openStructure(page);
    await row(page, "gallery").getByTestId("select-widget").click();
    await expect(picker.locator("li").nth(1)).toContainText("The workshop");
    await expect(
      previewFrame(page).getByTestId("gallery-open").nth(1),
    ).toHaveAttribute("aria-label", /The workshop/);
    const result = await new AxeBuilder({ page })
      .include('[data-testid="gallery-photo-picker"]')
      .analyze();
    expect(result.violations).toEqual([]);
    await picker.screenshot({ path: `work/gallery-authoring-${width}.png` });
  });
for (const variant of [
  "grid",
  "mosaic",
  "masonry",
  "filmstrip",
  "carousel",
  "beforeAfter",
])
  test(`gallery ${variant} keeps photos usable in a narrow page`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      `/appearance/frame?scenario=sora&widget=gallery&variant=${variant}`,
    );
    const photos = page.getByTestId("gallery-open");
    await expect(photos).toHaveCount(3);
    const first = (await photos.first().boundingBox())!;
    expect(first.height).toBeLessThanOrEqual(360);
    await photos.first().click();
    await expect(page.getByTestId("lightbox")).toBeVisible();
    await page
      .getByRole("button", { name: "Next picture", exact: true })
      .click();
    await expect(page.getByTestId("lightbox")).toContainText("2 of 3");
    await page.keyboard.press("Escape");
    await expect(photos.first()).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390);
  });

test("a compact collage keeps later photos accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openEditorWithSample(page, "Barber");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    const first = state.content.gallery[0];
    state.content.gallery = Array.from({ length: 6 }, (_, i) => ({
      ...first,
      id: `photo-${i}`,
      caption: `View ${i + 1}`,
    }));
    const gallery = state.page.widgets.find(
      (block: { type: string }) => block.type === "gallery",
    );
    gallery.settings = {
      ...gallery.settings,
      itemIds: null,
      variant: "mosaic",
    };
    localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
  });
  await page.goto("/demo/preview");
  const photos = page.getByTestId("gallery-open");
  await expect(photos).toHaveCount(5);
  await expect(page.locator(".tp-gallery-more")).toHaveText("+1");
  const first = (await photos.first().boundingBox())!;
  expect(first.height).toBeLessThan(360);
  await photos.last().click();
  await expect(page.getByTestId("lightbox")).toContainText("5 of 6");
  await page.getByRole("button", { name: "Next picture", exact: true }).click();
  await expect(page.getByTestId("lightbox")).toContainText("6 of 6");
});

test("a before-and-after pair retains both images through the viewer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openEditorWithSample(page, "Barber");
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    const photo = state.content.gallery[0];
    photo.caption = "Restored interior";
    photo.beforeImage = { ...photo.image, alt: "Interior before restoration" };
    const gallery = state.page.widgets.find(
      (block: { type: string }) => block.type === "gallery",
    );
    gallery.settings = {
      ...gallery.settings,
      itemIds: [photo.id],
      variant: "beforeAfter",
    };
    localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
  });
  await page.goto("/demo/preview");
  await page
    .getByRole("button", {
      name: "Restored interior, before. Open larger",
      exact: true,
    })
    .click();
  const viewer = page.getByTestId("lightbox");
  await expect(viewer.getByRole("img")).toHaveAttribute(
    "alt",
    "Interior before restoration",
  );
  await viewer.getByRole("button", { name: "After", exact: true }).click();
  await expect(
    viewer.getByRole("button", { name: "After", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(viewer.getByRole("img")).not.toHaveAttribute(
    "alt",
    "Interior before restoration",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", {
      name: "Restored interior, before. Open larger",
      exact: true,
    }),
  ).toBeFocused();
});

test("gallery uploads preserve the whole photo, cancel safely, and support removal undo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openEditorWithSample(page, "Barber");
  const read = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));
  const initial = (await read()).content.gallery.length;
  await openStructure(page);
  await row(page, "gallery").getByTestId("select-widget").click();
  const records = insp(page).getByTestId("records-field");
  await records.getByTestId("record-add").click();
  const dialog = page.getByTestId("gallery-photo-editor");
  const sharp = (await import("sharp")).default;
  const buffer = await sharp({
    create: { width: 800, height: 400, channels: 3, background: "#957359" },
  })
    .png()
    .toBuffer();
  const upload = () =>
    dialog
      .getByLabel("Choose a photo: upload a picture")
      .setInputFiles({
        name: "studio-wide.png",
        mimeType: "image/png",
        buffer,
      });
  await upload();
  const crop = page.getByTestId("crop-dialog");
  await expect(crop).toContainText("Keep the complete photo.");
  await crop.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await read()).content.gallery).toHaveLength(initial);
  await upload();
  await crop.getByTestId("crop-apply").click();
  await expect(crop).toBeHidden();
  await expect(
    dialog.getByLabel("Add another photo: upload a picture"),
  ).toBeAttached();
  await dialog.getByTestId("record-editor-save").click();
  await expect(records.getByTestId("record-add")).toBeFocused();
  const added = (await read()).content.gallery.at(-1);
  expect(added.image.width / added.image.height).toBe(2);
  await expect(records.locator("[data-record-id]")).toHaveCount(initial + 1);
  await records
    .locator(`[data-record-id="${added.id}"]`)
    .getByTestId("record-edit")
    .click();
  await dialog
    .getByRole("button", { name: "Delete this photo…", exact: true })
    .click();
  await dialog.getByTestId("record-delete-confirm").click();
  expect((await read()).content.gallery).toHaveLength(initial);
  await expect(records.getByTestId("record-add")).toBeFocused();
  const { closeSheet } = await import("./helpers");
  await closeSheet(page);
  await page.getByTestId("undo").click();
  expect(
    (await read()).content.gallery.some(
      (photo: { id: string }) => photo.id === added.id,
    ),
  ).toBe(true);
  await page.reload();
  await openStructure(page);
  await row(page, "gallery").getByTestId("select-widget").click();
  await expect(
    insp(page).locator(`[data-record-id="${added.id}"]`),
  ).toBeVisible();
});
