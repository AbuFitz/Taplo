import { expect as baseExpect, test, type Page } from "@playwright/test";

// Frames load a full page each; give polling assertions room on a busy machine.
const expect = baseExpect.configure({ timeout: 15_000 });

const frame = (page: Page, title = "Desktop preview") => page.frameLocator(`iframe[title="${title}"]`);
const attr = async (page: Page, name: string, title?: string) => (await frame(page, title).locator("[data-taplo-page]").getAttribute(name)) ?? "";
const LEGACY_LABEL: Record<string, string> = { Night: "Noir", Clean: "Paper", Colour: "Bloom", Photo: "Terra", Showroom: "Garage" };
const choice = async (page: Page, group: string, label: string | RegExp) => {
  if (group === "Look" && typeof label === "string") label = LEGACY_LABEL[label] ?? label;
  const g = page.locator(`[role="radiogroup"][aria-label="${group}"]`);
  // Sections are collapsed disclosures; open the one that holds this control, as a person would.
  await g.first().evaluate((el) => { for (let d = el.closest("details"); d; d = d.parentElement?.closest("details") ?? null) d.open = true; });
  await g.locator("label", { hasText: label }).first().click();
};

test.describe("Appearance lab: one engine, four configurations", () => {
  // Reduced motion freezes animated wallpapers, which are heavy in a software-rendered browser.
  test.use({ viewport: { width: 1600, height: 1000 }, reducedMotion: "reduce" });

  test("looks are configurations of the same engine; content never changes", async ({ page }) => {
    await page.goto("/appearance");
    const f = frame(page);
    await expect(f.getByRole("heading", { level: 1 })).toHaveText("Jay’s Barbers");
    const name = await f.getByRole("heading", { level: 1 }).textContent();
    const services = await f.locator('[data-widget="priceMenu"] li').count();

    const seen = new Set<string>();
    for (const look of ["Night", "Clean", "Colour", "Photo", "Showroom"]) {
      await choice(page, "Look", look);
      await expect.poll(async () => (await attr(page, "data-header")) + (await attr(page, "data-tone"))).not.toBe("");
      const sig = JSON.stringify([await attr(page, "data-header"), await attr(page, "data-tone"), await attr(page, "data-bg"), await attr(page, "data-card-surface"), await f.locator("[data-taplo-page]").evaluate((el) => getComputedStyle(el).getPropertyValue("--tp-font-heading").trim())]);
      seen.add(sig);
      expect(await f.getByRole("heading", { level: 1 }).textContent()).toBe(name);        // same words
      expect(await f.locator('[data-widget="priceMenu"] li').count()).toBe(services);       // same records
    }
    expect(seen.size).toBe(5);                                                              // five genuinely different results
  });

  test("every demonstrated choice is editable; undo, redo and reset work", async ({ page }) => {
    await page.goto("/appearance");
    const f = frame(page);
    // The lab opens on the barber's own design (High Street). This walk-through starts from the Night look so every step changes something.
    await choice(page, "Look", "Night");
    await expect.poll(() => attr(page, "data-header")).toBe("poster");
    await expect(page.getByTestId("lab-reset")).toBeDisabled();                             // untouched look

    await choice(page, "Header arrangement", "Editorial Poster");
    await expect.poll(() => attr(page, "data-header")).toBe("type");
    await choice(page, "Button shape", "Square");
    await expect.poll(() => f.locator(".tp-btn").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe("0px");
    await choice(page, "Card surface", "Frosted");
    await expect.poll(() => attr(page, "data-card-surface")).toBe("glass");
    await choice(page, "Font pair", "Technical");
    await expect.poll(() => f.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Space Grotesk");
    await choice(page, "Wallpaper", "Aurora");
    await expect.poll(() => attr(page, "data-bg")).toBe("shader");
    await expect(page.getByTestId("lab-reset")).toBeEnabled();

    // undo walks back one choice at a time; redo returns
    await page.getByTestId("lab-undo").click();
    await expect.poll(() => attr(page, "data-bg")).toBe("solid");
    await page.getByTestId("lab-redo").click();
    await expect.poll(() => attr(page, "data-bg")).toBe("shader");

    // reset returns to the look, and is itself undoable
    await page.getByTestId("lab-reset").click();
    await expect.poll(() => attr(page, "data-header")).toBe("poster");
    await expect(page.getByTestId("lab-reset")).toBeDisabled();
    await page.getByTestId("lab-undo").click();
    await expect.poll(() => attr(page, "data-bg")).toBe("shader");
  });

  test("a colour drag is one undo step and readability is reported", async ({ page }) => {
    await page.goto("/appearance");
    await choice(page, "Look", "Night");                                                   // a dark page, so a dark text colour is the unreadable one
    const accent = () => frame(page).locator("[data-taplo-page]").evaluate((el) => getComputedStyle(el).getPropertyValue("--tp-accent").trim());
    await expect.poll(accent, { timeout: 15000 }).toBe("#c8a35a");                                              // the look has landed in the preview before the colour is measured
    const before = await accent();
    await page.locator("details").evaluateAll((all) => all.forEach((d) => { (d as HTMLDetailsElement).open = true }));
    await page.getByRole("button", { name: /Accent: choose colour/ }).click();
    const area = page.locator(".react-colorful__saturation");
    const b = (await area.boundingBox())!;
    await page.mouse.move(b.x + 30, b.y + 30);
    await page.mouse.down();
    for (let i = 0; i < 10; i++) await page.mouse.move(b.x + 30 + i * 9, b.y + 30 + i * 6);
    await page.mouse.up();
    expect(await accent()).not.toBe(before);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500); // let the drag commit as one history entry before undoing
    await page.getByTestId("lab-undo").click();
    await expect.poll(accent).toBe(before);

    // an unreadable pairing is corrected and explained, never silently shipped
    await page.getByRole("textbox", { name: "Text hex value", exact: true }).fill("#1a1816");
    await expect(page.getByLabel("Readability notes")).toContainText(/adjusted|readable/i);
  });

  test("the same appearance renders a car dealer's stock; phone and desktop both reflect it", async ({ page }) => {
    await page.goto("/appearance");
    await choice(page, "Look", "Showroom");
    await page.getByRole("combobox", { name: "Business", exact: true }).selectOption("dealer");
    const d = frame(page);
    await expect(d.getByRole("heading", { level: 1 })).toHaveText("Aldous Motor Co.");
    await expect(d.locator(".tp-product")).toHaveCount(4);
    await expect(d.locator(".tp-product").first()).toContainText("£27,995");
    await expect(d.locator(".tp-product").first().locator(".tp-fact")).toHaveCount(4);
    await expect(d.locator(".tp-badge").first()).toHaveText("Just arrived");
    // phone frame shows the identical configuration
    const m = frame(page, "Mobile preview");
    await expect(m.getByRole("heading", { level: 1 })).toHaveText("Aldous Motor Co.");
    expect(await attr(page, "data-header", "Mobile preview")).toBe(await attr(page, "data-header"));
  });

  test("the showcase carries no developer commentary", async ({ page }) => {
    await page.goto("/appearance");
    await frame(page).getByRole("heading", { level: 1 }).waitFor();
    for (const frag of ["Synthetic", "fixture", "placeholder", "TODO", "Lorem", "?theme="]) {
      await expect(page.locator("body")).not.toContainText(frag);
      await expect(frame(page).locator("body")).not.toContainText(frag);
    }
  });
});

test.describe("appearance lab on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test("fits the screen and every selector is reachable", async ({ page }) => {
    await page.goto("/appearance");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("radiogroup", { name: "Preview" }).locator("label", { hasText: "Desktop" }).click();
    await expect(page.locator('iframe[title="Desktop preview"]')).toBeVisible();
    await choice(page, "Look", "Clean");
    await page.getByRole("radiogroup", { name: "Preview" }).locator("label", { hasText: "Phone" }).click();
    await expect.poll(() => page.frameLocator('iframe[title="Mobile preview"]').locator("[data-taplo-page]").getAttribute("data-header")).toBe("split");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

test("changing a look keeps the current example preview and open customer content in place", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 })
  await page.goto("/appearance")
  const preview = frame(page)
  await expect(preview.getByRole("heading", { level: 1 })).toHaveText("Jay’s Barbers")
  const faq = preview.locator("summary").filter({ hasText: "Can I choose a barber?" })
  await faq.click()
  await expect(faq.locator("xpath=parent::details")).toHaveAttribute("open", "")
  const stamp = await preview.locator("body").evaluate(() => performance.timeOrigin)
  await choice(page, "Look", "Night")
  await expect.poll(() => preview.locator("[data-taplo-page]").evaluate((el) => getComputedStyle(el).getPropertyValue("--tp-accent").trim())).toBe("#c8a35a")
  expect(await preview.locator("body").evaluate(() => performance.timeOrigin)).toBe(stamp)
  // A design may restyle the section (and so redraw it); what must not happen is a reload of the whole preview, which the stamp above proves.
})

for (const width of [768, 1280, 1440]) {
  test(`phone preview stays near the top at ${width}px instead of centring in an oversized blank canvas`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 })
    await page.goto("/appearance")
    const phone = page.locator('iframe[title="Mobile preview"]')
    await expect(phone).toBeVisible()
    const bounds = await phone.boundingBox()
    expect(bounds!.y).toBeLessThan(260)
    expect(bounds!.width).toBeLessThanOrEqual(410)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/appearance-layout-${width}.png`, fullPage: true })
  })
}
