import { expect, type Page, type FrameLocator } from "@playwright/test";

export const previewFrame = (page: Page): FrameLocator => page.frameLocator('iframe[title="Live preview of your page"]').first();

/** Load a synthetic sample into the demo store through the real UI and land in the editor. */
export async function openEditorWithSample(page: Page, sample: "Barber" | "Tutor" | "Mechanic" | "Café" | "Consultant" | "Unlisted" = "Barber") {
  await page.goto("/dashboard");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: new RegExp(`^${sample}`) }).first().click();
  await page.waitForURL("**/dashboard/page");
  await expect(page.getByTestId("my-page")).toBeVisible();
  await page.waitForLoadState("networkidle");
}

export const rowOrder = (page: Page) => page.locator("[data-widget-row]").evaluateAll((els) => els.map((e) => e.getAttribute("data-widget-row")!));
export const previewOrder = (page: Page) => previewFrame(page).locator("[data-widget]").evaluateAll((els) => els.map((e) => e.getAttribute("data-widget")!));
export const row = (page: Page, type: string, nth = 0) => page.locator(`[data-widget-row="${type}"]`).nth(nth);

/** The controls for the current selection: a side pane on wide screens, a bottom sheet on phones. */
export const insp = (page: Page) => page.locator('[data-testid="inspector"], [data-testid="editor-drawer"]');

/** True when the compact (phone/tablet) editor is showing. */
export const isCompact = (page: Page) => page.locator('[data-editor="compact"]').isVisible().catch(() => false);

/** On phones the controls sheet covers the preview; close it. */
export async function closeSheet(page: Page) {
  const sheet = page.getByTestId("editor-drawer");
  if (await sheet.isVisible().catch(() => false)) {
    await page.getByTestId("drawer-close").click();
    await expect(sheet).toBeHidden();
  }
}

/** Make the structure list (page style, header, widgets, details, settings) reachable: on phones it lives under the Content tab. */
export async function openStructure(page: Page) {
  if (await isCompact(page)) {
    if (!(await page.getByTestId("structure").isVisible().catch(() => false))) {
      await closeSheet(page);
      await page.getByTestId("tab-content").tap();
      await expect(page.getByTestId("structure")).toBeVisible();
      await page.waitForTimeout(500); // sheet finishes sliding up
    }
  }
}

/** Open a row of the structure list: select-page, select-header, select-details, select-settings. */
export async function selectPart(page: Page, part: "page" | "header" | "details" | "settings") {
  await openStructure(page);
  await page.getByTestId(`select-${part}`).click();
}

/** Select a widget from the structure list; its controls open in the inspector. */
export async function openRow(page: Page, type: string, nth = 0) {
  await openStructure(page);
  await row(page, type, nth).getByTestId("select-widget").click();
  await expect(insp(page).getByTestId("inspector-widget")).toHaveAttribute("data-widget-type", type);
  return insp(page);
}

export async function addWidget(page: Page, label: RegExp | string) {
  await openStructure(page);
  await page.getByTestId("add-widget").click();
  await page.getByRole("dialog").getByRole("button", { name: label }).first().click();
}

/** Tiny valid PNG (1x1) used for upload tests. */
export const PNG_1x1 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
export function pngFile(name = "pic.png") {
  return { name, mimeType: "image/png", buffer: PNG_1x1 };
}

/** Open a collapsible <details> section by its heading, only if it is currently closed. */
export async function openSection(page: Page, title: string | RegExp) {
  const d = page.locator("details", { has: page.locator("summary", { hasText: title }) }).first();
  if ((await d.getAttribute("open")) === null) await d.locator("summary").first().click();
  return d;
}

/** Seed the demo store directly with a fixture (used for stress data that has no UI sample button). */
export async function seedFixture(page: Page, state: unknown) {
  await page.goto("/dashboard");
  await page.evaluate((s) => localStorage.setItem("taplo.demo.v2", JSON.stringify(s)), state);
  await page.goto("/dashboard/page");
  await expect(page.getByTestId("my-page")).toBeVisible();
  await page.waitForLoadState("networkidle");
}

/** Choose an optional starting look (collapsed by default: nothing requires it). */
export async function pickLook(page: Page, id: string) {
  await selectPart(page, "page");
  await openSection(page, /^Look/);
  await look(page, id).click();
}

/** The starting-look choice with this id, in the shared Look selector. */
export const look = (page: Page, id: string) => page.getByRole("radiogroup", { name: "Look" }).locator(`label[data-choice="${id}"]`)
