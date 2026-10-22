import { expect, test } from "@playwright/test";
import { insp, openEditorWithSample, openRow, openSection, pngFile, previewFrame, previewOrder, rowOrder } from "./helpers";

const store = (page: import("@playwright/test").Page) => page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!));

test.describe("Taplo page engine: select in preview, contextual controls", () => {
  test("clicking the preview selects, never follows links, and shows the widget's own controls", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    const frame = previewFrame(page);
    const url = page.url();

    await frame.locator('[data-widget="booking"]').click();
    await expect(insp(page).getByTestId("inspector-widget")).toHaveAttribute("data-widget-type", "booking");
    await expect(frame.locator('[data-widget="booking"]')).toHaveAttribute("data-tp-selected", "");
    expect(page.url()).toBe(url);                                   // the booking link/button did nothing
    await expect(page.getByRole("dialog")).toHaveCount(0);          // and no booking sheet opened in edit mode

    await frame.locator('[data-widget="priceMenu"]').click();
    await expect(page.getByTestId("inspector-title")).toHaveText(/Price|Menu/);
    await expect(frame.locator("[data-tp-selected]")).toHaveCount(1); // exactly one selection

    await frame.locator(".tp-name").click();
    await expect(page.getByTestId("inspector-header")).toBeVisible();
    await expect(frame.locator("[data-tp-selected]")).toHaveCount(1);

    // selecting in the structure list highlights it in the preview
    await openRow(page, "reviews");
    await expect(frame.locator('[data-widget="reviews"]')).toHaveAttribute("data-tp-selected", "");
    // page style when nothing is selected
    await page.getByTestId("select-page").click();
    await expect(page.getByTestId("inspector-page")).toBeVisible();
    await expect(frame.locator("[data-tp-selected]")).toHaveCount(0);
  });

  test("content, layout, colour and arrangement edits reach the preview; one undo per colour drag", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    const frame = previewFrame(page);

    // header arrangement + logo shape + size
    await page.getByTestId("select-header").click();
    await openSection(page, "Header");
    await insp(page).getByRole("radio", { name: /Cover banner/ }).locator("xpath=ancestor::label").click();
    await expect(frame.locator('.tp-header[data-layout="cover"]')).toHaveCount(1);
    await insp(page).getByRole("radio", { name: "Arch" }).locator("xpath=ancestor::label").click();
    await expect(frame.locator('.tp-avatar[data-shape="arch"]')).toHaveCount(1);

    // colour: drag the picker many steps = ONE history entry
    await page.getByTestId("select-page").click();
    await openSection(page, "Text");
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.appearance.colors?.accent ?? null);
    await insp(page).getByRole("button", { name: /Accent colour: choose colour/ }).click();
    const area = page.locator(".react-colorful__saturation");
    const b = (await area.boundingBox())!;
    await page.mouse.move(b.x + 20, b.y + 20);
    await page.mouse.down();
    for (let i = 0; i < 12; i++) await page.mouse.move(b.x + 20 + i * 8, b.y + 20 + i * 5);
    await page.mouse.up();
    const after = (await store(page)).page.appearance.colors?.accent;
    expect(after).toBeTruthy();
    expect(after).not.toBe(before);
    await page.keyboard.press("Escape");
    await page.getByTestId("undo").click();
    expect((await store(page)).page.appearance.colors?.accent ?? null).toBe(before);
  });

  test("per-widget overrides survive page colour changes and reset to the page style", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await openRow(page, "reviews");
    await insp(page).getByRole("tab", { name: /Appearance/ }).click();
    await insp(page).getByLabel("Card colour hex value").fill("#1f2a44");
    await expect(insp(page)).toContainText("differ from the page style");
    // contrast feedback is live
    await insp(page).getByLabel("Text colour hex value").fill("#222244");
    await expect(insp(page).getByTestId("contrast-badge")).toContainText("Hard to read");

    await page.getByTestId("select-page").click();
    await openSection(page, "Text");
    await insp(page).getByLabel("Page colour hex value").fill("#fff4e6");
    const w = (await store(page)).page.widgets.find((x: { type: string }) => x.type === "reviews");
    expect(w.appearance.background).toBe("#1f2a44");             // the deliberate override is untouched

    await openRow(page, "reviews");
    await insp(page).getByRole("tab", { name: /Appearance/ }).click();
    await insp(page).getByRole("button", { name: "Reset to page style" }).click();
    expect((await store(page)).page.widgets.find((x: { type: string }) => x.type === "reviews").appearance).toEqual({});
  });

  test("draft and published stay separate; public output matches the preview; reload restores the draft", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await page.getByTestId("publish").click();
    await expect(page.getByTestId("save-state")).toContainText("Saved · live");
    const slug = (await store(page)).content.identity.slug as string;

    // edit after publishing: draft changes, published does not
    await openRow(page, "booking");
    await insp(page).getByLabel("Button text").fill("Reserve a chair");
    await expect(page.getByTestId("save-state")).toContainText("unpublished changes");

    // the public page reads the published copy from the same browser storage
    const ctxPage = await page.context().newPage();
    await ctxPage.goto("/demo/p/" + slug);
    await expect(ctxPage.getByText("Book your chair").first()).toBeVisible();
    await expect(ctxPage.getByText("Reserve a chair")).toHaveCount(0);

    // publish B: public page now shows B, and its widget order equals the preview's
    await page.getByTestId("publish").click();
    await ctxPage.reload();
    await expect(ctxPage.getByText("Reserve a chair").first()).toBeVisible();
    const publicOrder = await ctxPage.locator("[data-widget]").evaluateAll((els) => els.map((e) => e.getAttribute("data-widget")));
    expect(publicOrder).toEqual(await previewOrder(page));
    // the public page carries no editing chrome
    await expect(ctxPage.locator("[data-tp-editing]")).toHaveCount(0);
    await ctxPage.close();

    // reload restores the draft (including undo availability being reset, but content kept)
    await page.reload();
    await expect(page.getByTestId("my-page")).toBeVisible();
    await expect(previewFrame(page).getByText("Reserve a chair").first()).toBeVisible();
  });

  test("recommendations are optional, undoable and never overwrite choices", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted");
    await page.getByTestId("select-page").click();
    const rec = page.getByTestId("recommendation").first();
    await expect(page.getByTestId("recommendations")).toBeVisible();
    const before = await rowOrder(page);
    const title = await rec.locator("p").first().textContent();
    await page.getByRole("button", { name: `Dismiss: ${title}` }).click();
    await expect(page.getByText(title!, { exact: true })).toHaveCount(0);
    expect(await rowOrder(page)).toEqual(before);                 // dismissing changes nothing
    const next = page.getByTestId("recommendation").first();
    if (await next.count()) {
      const label = (await next.getByRole("button", { name: /^Add / }).count()) ? next.getByRole("button", { name: /^Add / }) : null;
      if (label) {
        await label.click();
        expect((await rowOrder(page)).length).toBe(before.length + 1);
        await page.getByTestId("undo").click();
        expect(await rowOrder(page)).toEqual(before);             // accepting was one undoable step
      }
    }
  });

  test("logo: crop step frames the picture before it is used; social links use real brand marks", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await page.getByTestId("select-header").click();
    await openSection(page, "Header");
    await insp(page).getByLabel("Logo or profile picture: upload a picture").setInputFiles(pngFile("logo.png"));
    await expect(page.getByTestId("crop-dialog")).toBeVisible();
    await expect(page.getByTestId("crop-apply")).toBeEnabled();
    await page.getByTestId("crop-apply").click();
    await expect(page.getByTestId("crop-dialog")).toHaveCount(0);
    await expect.poll(async () => (await store(page)).content.identity.logo?.src?.startsWith("data:image/jpeg")).toBe(true);

    const frame = previewFrame(page);
    const icons = frame.locator('[data-widget="social"] svg path');
    await expect(icons.first()).toBeVisible();
    await expect(frame.locator('[data-widget="social"]')).not.toContainText("IG");
  });

  test("public pages do not ship the editor", async ({ page }) => {
    const js: string[] = [];
    page.on("response", async (r) => { if (r.url().endsWith(".js") || r.url().includes("/_next/static/chunks/")) { try { js.push(await r.text()) } catch {} } });
    await page.goto("/demo/p/does-not-matter");
    await page.waitForLoadState("networkidle");
    const all = js.join("\n");
    expect(all).not.toContain("react-colorful");
    expect(all).not.toContain("To pick up a draggable item");     // dnd-kit's default instructions
    expect(all).not.toContain("reactEasyCrop");
  });
});

test.describe("mobile editor", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test("the preview fills the screen; tapping it opens a sheet that leaves the selection visible; nothing overflows", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await expect(page.locator('[data-editor="compact"]')).toBeVisible();
    // the preview IS the screen: real device width, no handset frame, most of the height
    const box = (await page.getByTestId("preview-frame").boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(388);
    expect(box.height).toBeGreaterThan(844 * 0.7);
    expect(await previewFrame(page).locator("body").evaluate(() => window.innerWidth)).toBe(390);

    await previewFrame(page).locator('[data-widget="priceMenu"]').tap();
    await expect(page.getByTestId("editor-drawer")).toBeVisible();
    await expect(page.getByTestId("inspector-widget")).toHaveAttribute("data-widget-type", "priceMenu");
    await page.waitForTimeout(800);
    // the selected widget was scrolled into the part of the preview the sheet leaves visible
    const sheetTop = (await page.getByTestId("editor-drawer").boundingBox())!.y;
    const selected = await previewFrame(page).locator('[data-widget="priceMenu"]').boundingBox();
    expect(selected!.y).toBeLessThan(sheetTop - 40);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    // the toolbar stays reachable beneath the sheet
    await page.getByTestId("tab-organise").tap();
    await expect(page.getByTestId("organise-panel")).toBeVisible();
    await page.getByTestId("tab-content").tap();
    await expect(page.getByTestId("structure")).toBeVisible();
    await page.getByTestId("select-widget").first().tap();
    await expect(page.getByTestId("editor-drawer")).toBeVisible();
    // every control in the sheet is touch-sized
    const small = await page.getByTestId("editor-drawer").locator("button:visible, input:visible").evaluateAll((els) => els.filter((e) => { const r = e.getBoundingClientRect(); return r.height < 32 && r.height > 0 && !e.closest("summary") && (e as HTMLInputElement).type !== "radio" && (e as HTMLInputElement).type !== "range" && (e as HTMLInputElement).type !== "checkbox" && !e.className.includes("sr-only") }).length);
    expect(small).toBeLessThanOrEqual(1);

    // customer preview: no sheet, no toolbar, the page behaves like the real one
    await page.getByTestId("customer-preview").tap();
    await expect(page.getByTestId("editor-drawer")).toBeHidden();
    await expect(page.getByTestId("tab-content")).toBeHidden();
    await page.getByTestId("customer-preview").tap();
    await expect(page.getByTestId("tab-content")).toBeVisible();
  });
});
