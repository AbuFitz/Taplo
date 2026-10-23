import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { THEMES } from "../../src/features/page/themes/catalogue";
import { openEditorWithSample, selectPart } from "./helpers";

/** Serious and critical axe findings fail the build; each is printed with the offending selector. */
async function scan(page: Page, context: string, include?: string) {
  let b = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]);
  if (include) b = b.include(include);
  const r = await b.analyze();
  const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const msg = bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")} — ${v.help}`);
  expect(msg, context).toEqual([]);
}

test.describe("automated accessibility (axe, WCAG 2.1 A/AA + best practice)", () => {
  for (const t of THEMES) {
    test(`public profile: every widget type in the ${t.id} theme`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const slug of ["demo-cafe", "demo-tutor"]) {
        await page.goto(`/${slug}?theme=${t.id}`, { waitUntil: "networkidle" });
        await scan(page, `${slug}/${t.id}`, "[data-taplo-page]");
      }
    });
  }

  test("public profile: each headline business in its own theme, phone and desktop", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); // scan the settled page, not a frame of the entrance animation
    for (const slug of ["demo-mechanic", "demo-barber", "demo-tutor", "demo-cafe", "demo-consultant", "demo-groomer"]) {
      for (const w of [390, 1280]) {
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(`/${slug}`, { waitUntil: "networkidle" });
        await scan(page, `${slug}@${w}`, "[data-taplo-page]");
      }
    }
  });

  test("themed booking dialog", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const theme of ["night", "colour", "showroom", "clean"]) {
      await page.goto(`/demo-cafe?theme=${theme}`, { waitUntil: "networkidle" });
      await page.locator('.tp-actions-primary button, [data-widget="booking"] button').first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await scan(page, `dialog/${theme}`, '[role="dialog"]');
      await page.keyboard.press("Escape");
    }
  });

  test("editor: structure, page style, header, a widget, details and settings", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    await scan(page, "editor/page-style", '[data-testid="my-page"]');
    await selectPart(page, "header");
    await scan(page, "editor/header", '[data-testid="my-page"]');
    await page.getByTestId("select-widget").first().click();
    await scan(page, "editor/widget", '[data-testid="my-page"]');
    await selectPart(page, "details");
    await scan(page, "editor/details", '[data-testid="my-page"]');
    await selectPart(page, "settings");
    await scan(page, "editor/settings", '[data-testid="my-page"]');
  });

  test("onboarding and the add-widget dialog", async ({ page }) => {
    await page.goto("/onboarding");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await scan(page, "onboarding/industry");
    await openEditorWithSample(page, "Mechanic");
    await page.getByTestId("add-widget").click();
    await scan(page, "add-widget dialog", '[role="dialog"]');
  });
});
