import { expect, test, type Page } from "@playwright/test";
import { FIXTURES } from "../../src/features/themes/fixtures";
import { THEMES } from "../../src/features/page/themes/catalogue";

const HEADLINE = ["mechanic", "barber", "tutor", "cafe", "consultant", "unlisted"];
const WIDTHS = [360, 390, 640, 820, 1280]; // 640 ≈ a 1280 desktop at 200% zoom

async function settle(page: Page, url: string) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  return errors;
}

async function healthy(page: Page, errors: string[], label: string, width: number) {
  expect(errors, `console ${label}`).toEqual([]);
  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    h1: document.querySelectorAll("h1").length,
    broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
    deadLinks: [...document.querySelectorAll("a")].filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#").length,
    smallTargets: [...document.querySelectorAll("[data-taplo-page] .tp-btn, [data-taplo-page] .tp-icon-action")].filter((e) => e.getBoundingClientRect().height < 40 && e.getBoundingClientRect().height > 0).length,
  }));
  expect(m.overflow, `overflow ${label}@${width}`).toBeLessThanOrEqual(0);
  expect(m.h1, `h1 ${label}`).toBe(1);
  expect(m.broken, `broken images ${label}`).toBe(0);
  expect(m.deadLinks, `dead links ${label}`).toBe(0);
  expect(m.smallTargets, `tap targets ${label}`).toBe(0);
}

test.describe("stable sample profiles (no localStorage, no sign-in)", () => {
  test("index lists the six businesses and every link opens", async ({ page }) => {
    await page.goto("/demo/profiles");
    await expect(page.getByRole("heading", { name: "Sample profiles" })).toBeVisible();
    for (const f of HEADLINE.map((k) => FIXTURES.find((x) => x.key === k)!)) {
      const res = await page.request.get(`/${f.content.identity.slug}`);
      expect(res.status(), f.key).toBe(200);
      await expect(page.getByRole("link", { name: "Open page" }).first()).toBeVisible();
    }
    await expect(page.getByText("Look: Clean").first()).toBeVisible(); // a mechanic in the soft light look…
    await expect(page.getByText("Look: Night").first()).toBeVisible(); // …and a tutor in the dark one
  });

  test("a fresh browser sees the same page; ?theme= changes only the look", async ({ browser }) => {
    const a = await (await browser.newContext()).newPage();
    const b = await (await browser.newContext()).newPage();
    await a.goto("/demo-barber"); await b.goto("/demo-barber");
    const order = (p: Page) => p.locator("[data-widget]").evaluateAll((e) => e.map((x) => x.getAttribute("data-widget")));
    expect(await order(a)).toEqual(await order(b));
    const before = await a.locator("[data-taplo-page]").getAttribute("data-header");
    await a.goto("/demo-barber?theme=night");
    expect(await a.locator("[data-taplo-page]").getAttribute("data-header")).toBe("side");
    expect(before).not.toBe("side");
    expect(await order(a)).toEqual(await order(b)); // same widgets, same order, different look
    await a.goto("/demo-barber?theme=nonsense");
    await expect(a.getByRole("heading", { level: 1 })).toBeVisible(); // unknown theme is ignored, not an error
  });

  test("the theme gallery shows one business in every look", async ({ page }) => {
    await page.goto("/demo/themes?fixture=tutor");
    await expect(page.locator("iframe")).toHaveCount(THEMES.length);
  });

  test("synthetic pages are labelled and never indexed; reserved paths 404", async ({ page }) => {
    await page.goto("/demo-tutor");
    await expect(page.getByRole("note").first()).toContainText("Synthetic demo profile");
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
    for (const p of ["/api", "/login", "/book", "/review", "/does-not-exist", "/dev"]) expect((await page.goto(p))?.status(), p).toBe(404);
  });
});

test.describe("render matrix", () => {
  for (const f of FIXTURES) {
    test(`${f.key} in its own theme (${f.page.themeId}) at every viewport`, async ({ page }) => {
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        const errs = await settle(page, `/${f.content.identity.slug}`);
        await healthy(page, errs, `${f.key}/${f.page.themeId}`, w);
        page.removeAllListeners("console"); page.removeAllListeners("pageerror");
      }
    });
  }
  for (const key of HEADLINE) {
    test(`${key} through every theme (phone and desktop)`, async ({ page }) => {
      const slug = FIXTURES.find((x) => x.key === key)!.content.identity.slug;
      for (const t of THEMES) for (const w of [390, 1280]) {
        await page.setViewportSize({ width: w, height: 900 });
        const errs = await settle(page, `/${slug}?theme=${t.id}`);
        await healthy(page, errs, `${key}/${t.id}`, w);
        page.removeAllListeners("console"); page.removeAllListeners("pageerror");
      }
    });
  }
});

test.describe("themed interaction", () => {
  for (const [slug, theme] of [["demo-mechanic", "clean"], ["demo-tutor", "night"], ["demo-barber", "showroom"], ["demo-cafe", "colour"]] as const) {
    test(`booking dialog and select portal inherit the ${theme} theme`, async ({ page }) => {
      await page.goto(`/${slug}`, { waitUntil: "networkidle" });
      const rootBg = await page.locator("[data-taplo-page]").evaluate((el) => getComputedStyle(el).getPropertyValue("--tp-background").trim());
      await page.locator('.tp-actions-primary button, [data-widget="booking"] button').first().click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      expect(await dialog.evaluate((el) => !!el.closest("[data-taplo-theme]"))).toBe(true);
      const dialogBg = await dialog.evaluate((el) => getComputedStyle(el).backgroundColor);
      const hexToRgb = (h: string) => { const n = parseInt(h.slice(1), 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; };
      expect(dialogBg).toBe(hexToRgb(rootBg));
      // A select inside the dialog, if this flow has one, opens in a portal that still carries the theme.
      if (await dialog.getByRole("combobox").count()) {
        await dialog.getByRole("combobox").first().click();
        const listbox = page.getByRole("listbox");
        await expect(listbox).toBeVisible();
        expect(await listbox.evaluate((el) => !!el.closest("[data-taplo-theme]"))).toBe(true);
        await page.keyboard.press("Escape");
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    });
  }

  test("keyboard-only: visible focus, dialog traps focus and restores it", async ({ page }) => {
    await page.goto("/demo-tutor", { waitUntil: "networkidle" });
    // tab until the first page control is focused; it must show a visible focus ring
    let ring = "";
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      ring = await page.evaluate(() => { const e = document.activeElement as HTMLElement; const cs = getComputedStyle(e); return `${cs.outlineStyle}|${cs.outlineWidth}`; });
      if (await page.evaluate(() => !!document.activeElement?.closest("[data-taplo-page]"))) break;
    }
    expect(ring).toMatch(/solid\|2px/);
    const trigger = page.locator('.tp-actions-primary button, [data-widget="booking"] button').first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("reduced motion removes the entrance and hover transitions; normal motion runs them", async ({ page }) => {
    await page.goto("/demo-barber", { waitUntil: "networkidle" });
    expect(await page.locator(".tp-widget").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("tp-rise");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });
    expect(await page.locator(".tp-widget").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(parseFloat(await page.locator(".tp-btn").first().evaluate((el) => getComputedStyle(el).transitionDuration))).toBeLessThan(0.01);
  });

  test("video loads nothing third-party until the visitor taps play", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto("/demo-tutor", { waitUntil: "networkidle" });
    expect(requests.filter((u) => /youtube|ytimg|vimeo|google/.test(u))).toEqual([]);
    await expect(page.locator('[data-widget="video"] iframe')).toHaveCount(0);
    await page.getByRole("button", { name: /Play video/ }).click();
    await expect(page.locator('[data-widget="video"] iframe')).toHaveAttribute("src", /youtube-nocookie\.com\/embed\//);
  });

  test("a payment block stays off the public page until payments are connected", async ({ page }) => {
    await page.goto("/demo-mechanic", { waitUntil: "networkidle" });
    // Nothing on the page pretends to take money: the widget is saved on the page but not shown.
    await expect(page.locator('[data-widget="payment"]')).toHaveCount(0);
    await expect(page.getByText(/Simulated|deposit/i)).toHaveCount(0);
  });

  test("header never repeats a channel that already has its own widget", async ({ page }) => {
    await page.goto("/demo-mechanic", { waitUntil: "networkidle" });
    // the mechanic page has a Call widget, so the header offers WhatsApp/Email but not Call
    expect(await page.locator("header a[href^='tel:']").count()).toBe(0);
    expect(await page.locator('[data-widget="call"] a[href^="tel:"]').count()).toBe(1);
  });
});
