import { expect, test, type Page } from "@playwright/test";
import { FIXTURES } from "../../src/features/themes/fixtures";
import { LAYOUT_PRESETS } from "../../src/features/themes/presets/layouts";

// 640 wide approximates a 1280px desktop at 200% zoom.
const WIDTHS = [360, 390, 640, 820, 1280];

async function loadAll(page: Page, url: string) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  return errors;
}

for (const fixture of FIXTURES) {
  for (const layout of LAYOUT_PRESETS) {
    test(`render ${fixture.key} × ${layout.family}: no overflow, no errors, no broken images`, async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        const errors = await loadAll(page, `/dev/themes/preview/${fixture.key}/${layout.id}`);
        expect(errors, `console @${width}`).toEqual([]);
        const m = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          h1: document.querySelectorAll("h1").length,
          broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
          deadLinks: [...document.querySelectorAll("a")].filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#").length,
        }));
        expect(m.overflow, `horizontal overflow @${width}`).toBeLessThanOrEqual(0);
        expect(m.h1).toBe(1);
        expect(m.broken).toBe(0);
        expect(m.deadLinks).toBe(0);
      }
    });
  }
}

test("booking dialog and select portal inherit the profile theme (not the dashboard's)", async ({ page }) => {
  for (const [fixture, layoutId, bg] of [["mechanic", "trades-v1", "rgb(13, 15, 18)"], ["barber", "beauty-v1", "rgb(250, 246, 241)"]] as const) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/dev/themes/preview/${fixture}/${layoutId}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /book|enquire|appointment/i }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((el) => !!el.closest("[data-taplo-theme]"))).toBe(true);
    expect(await dialog.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(bg);
    await dialog.getByRole("combobox").click();
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    expect(await listbox.evaluate((el) => !!el.closest("[data-taplo-theme]"))).toBe(true);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  }
});

test("dialog traps focus and restores it to the trigger on close", async ({ page }) => {
  await page.goto("/dev/themes/preview/tutor/education-v1", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: /book a session/i }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("tokens are isolated per profile root and absent from marketing", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => document.querySelectorAll("[data-taplo-theme]").length)).toBe(0);
  expect(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--tp-accent").trim())).toBe("");
});

test("reduced motion: page renders and animations are suppressed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dev/themes/preview/barber/beauty-v1", { waitUntil: "networkidle" });
  const d = await page.evaluate(() => getComputedStyle(document.querySelector("[data-taplo-theme] a")!).transitionDuration);
  expect(parseFloat(d)).toBeLessThan(0.01);
});

test("public route: fixtures render with noindex and a synthetic notice; reserved paths 404", async ({ page }) => {
  const res = await page.goto("/demo-barber");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("note")).toContainText("Synthetic development fixture");
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
  for (const p of ["/dashboard", "/api", "/login", "/book", "/does-not-exist"]) {
    const r = await page.goto(p);
    expect(r?.status(), p).toBe(404);
  }
});
