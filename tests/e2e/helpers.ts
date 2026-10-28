import { expect, type Page, type FrameLocator } from "@playwright/test";

export const previewFrame = (page: Page): FrameLocator =>
  page.frameLocator('iframe[title="Live preview of your page"]').first();

/** Load a synthetic sample into the demo store through the real UI and land in the editor. */
export async function openEditorWithSample(
  page: Page,
  sample:
    | "Barber"
    | "Car dealer"
    | "Tutor"
    | "Mechanic"
    | "Café"
    | "Consultant"
    | "Unlisted" = "Barber",
) {
  await page.goto("/dashboard", {waitUntil:"domcontentloaded"});
  await page.evaluate(() => localStorage.clear());
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("More sample businesses", { exact: true }).click();
  await page
    .getByRole("button", { name: new RegExp(`^${sample}`) })
    .first()
    .click();
  await page.waitForURL("**/dashboard/page");
  await expect(page.getByTestId("my-page")).toBeVisible();
  await page.waitForLoadState("networkidle");
}

export const rowOrder = (page: Page) =>
  page
    .locator("[data-widget-row]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-widget-row")!));
export const previewOrder = (page: Page) =>
  previewFrame(page)
    .locator("[data-widget]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-widget")!));
export const row = (page: Page, type: string, nth = 0) =>
  page.locator(`[data-widget-row="${type}"]`).nth(nth);

/** The controls for the current selection: a side pane on wide screens, a bottom sheet on phones. */
export const insp = (page: Page) =>
  page.locator('[data-testid="inspector"], [data-testid="editor-drawer"]');

/** True when the compact (phone/tablet) editor is showing. */
export const isCompact = (page: Page) =>
  page
    .locator('[data-editor="compact"]')
    .isVisible()
    .catch(() => false);

/** On phones the controls sheet covers the preview; close it. */
export async function closeSheet(page: Page) {
  const sheet = page.getByTestId("editor-drawer");
  if (await sheet.isVisible().catch(() => false)) {
    await page.getByTestId("drawer-close").click();
    await expect(sheet).toBeHidden();
  }
}

/** Make the content list reachable: on phones it lives under the Content tab. */
export async function openStructure(page: Page) {
  if (await isCompact(page)) {
    if (
      !(await page
        .getByTestId("structure")
        .isVisible()
        .catch(() => false))
    ) {
      await closeSheet(page);
      await page.getByTestId("tab-content").tap();
      await expect(page.getByTestId("structure")).toBeVisible();
      await page.waitForTimeout(500); // sheet finishes sliding up
    }
  } else if (
    !(await page
      .getByTestId("structure")
      .isVisible()
      .catch(() => false))
  ) {
    await page.getByTestId("tab-content").click();
    // On the Content tab while one item is open, the tab itself returns to the list; otherwise use the back button.
    if (
      !(await page
        .getByTestId("structure")
        .isVisible()
        .catch(() => false)) &&
      (await page.getByTestId("back-to-content").count())
    )
      await page.getByTestId("back-to-content").click();
    await expect(page.getByTestId("structure")).toBeVisible();
  }
}

/** Open one of the four editor tabs' screens: design (page look), header, details (business details), settings (page settings). */
export async function selectPart(
  page: Page,
  part: "page" | "header" | "details" | "settings",
) {
  const compact = await isCompact(page);
  const tab =
    part === "page" ? "design" : part === "header" ? "header" : "settings";
  const t = page.getByTestId(`tab-${tab}`);
  // On a phone the open tab is pressed; pressing it again would close its sheet.
  const open =
    (await t.getAttribute("aria-pressed")) === "true" ||
    (await t.getAttribute("aria-selected")) === "true";
  if (!(compact && open) || part === "page" || part === "header")
    await t.click();
  if (part === "settings")
    await page.getByRole("button", { name: "Page settings" }).click();
  if (part === "details")
    await page.getByRole("button", { name: "Business details" }).click();
  void compact;
}

/** Select a widget from the structure list; its controls open in the inspector. */
export async function openRow(page: Page, type: string, nth = 0) {
  await openStructure(page);
  await row(page, type, nth).getByTestId("select-widget").click();
  await expect(insp(page).getByTestId("inspector-widget")).toHaveAttribute(
    "data-widget-type",
    type,
  );
  return insp(page);
}

export async function addWidget(page: Page, label: RegExp | string) {
  await openStructure(page);
  await page.getByTestId("add-widget").click();
  await page.getByTestId("choice").filter({ hasText: label }).first().click();
}

/** Tiny valid PNG (1x1) used for upload tests. */
export const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);
export function pngFile(name = "pic.png") {
  return { name, mimeType: "image/png", buffer: PNG_1x1 };
}

/** Open a collapsible <details> section by its heading, only if it is currently closed. */
export async function openSection(page: Page, title: string | RegExp) {
  // The disclosure whose own summary matches (a `has` filter would also match an outer one that contains it).
  const sum = page.locator("summary", { hasText: title }).first();
  const d = sum.locator("xpath=..");
  if ((await d.getAttribute("open")) === null) await sum.click();
  return d;
}

/** Seed the demo store directly with a fixture (used for stress data that has no UI sample button). */
export async function seedFixture(page: Page, state: unknown) {
  await page.goto("/dashboard", {waitUntil:"domcontentloaded"});
  await page.evaluate(
    (s) => localStorage.setItem("taplo.demo.v2", JSON.stringify(s)),
    state,
  );
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
/** Retired starting looks and the current design that stands in for each. */
export const LEGACY_LOOK: Record<string, string> = { ink: "noir", night: "noir", forge: "garage", open: "paper", atelier: "maison", clay: "terra", orchard: "bloom", clean: "paper", colour: "bloom", showroom: "garage", photo: "noir", service: "bento", apex: "volt", silver: "quartz" };
export const look = (page: Page, id: string) =>
  page
    .getByRole("radiogroup", { name: "Look" })
    .locator(`label[data-choice="${LEGACY_LOOK[id] ?? id}"]`);

/** Continue, hopping the phone-only second screen of the business step. */
export async function cont(page: import("@playwright/test").Page) {
  const btn = page.getByRole("button", { name: "Continue", exact: true })
  await btn.click()
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await page.waitForTimeout(350)
    if (/^Tell people what you do\./.test((await page.getByRole("heading", { level: 1 }).textContent()) ?? "")) await btn.click()
  }
}
/** On a phone the contact step opens on the main-button choice; move on to the details screen. */
export async function openDetails(page: import("@playwright/test").Page) {
  if ((page.viewportSize()?.width ?? 1440) < 1024 && (await page.getByText("Pick your main button").isVisible())) await page.getByRole("button", { name: "Continue", exact: true }).click()
}

/** Messages some engines print for features they do not implement (WebKit ignores the `interactive-widget` viewport key and logs RSC prefetch cancellations). They are not defects in the page. */
export const isEngineNoise = (text: string) => /interactive-widget|due to access control checks/.test(text)
