import { expect, test } from "@playwright/test";
import { FIXTURES } from "../../src/features/themes/fixtures";
import { look, pickLook, addWidget, openStructure, openEditorWithSample, insp, openRow, openSection, pngFile, previewFrame, previewOrder, row, rowOrder, seedFixture, selectPart } from "./helpers";

test.describe("My page editor", () => {
  test("add, edit, duplicate, hide and remove widgets; records survive removal", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted");
    const frame = previewFrame(page);

    // ---- add a Video widget and edit it
    await addWidget(page, /^Video/);
    await expect(insp(page).getByTestId("inspector-widget")).toHaveAttribute("data-widget-type", "video");
    await page.getByTestId("back-to-content").click();
    const panel = row(page, "video");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Nothing to show yet");            // empty state explains itself
    await panel.getByTestId("select-widget").click();
    await expect(frame.locator('[data-widget="video"]')).toHaveCount(0); // and is not shown to visitors yet
    await page.getByLabel("YouTube or Vimeo address").fill("https://example.com/not-a-video");
    await expect(page.getByText("That address isn’t supported here.")).toBeVisible();
    await page.getByLabel("YouTube or Vimeo address").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.getByLabel("Title (optional)").fill("Meet your tutor");
    await expect(frame.locator('[data-widget="video"]')).toHaveCount(1);
    await expect(frame.getByText("Loads YouTube when you press play")).toBeVisible(); // nothing third-party loads until tapped
    await expect(frame.locator("iframe")).toHaveCount(0);

    // ---- duplicate (multiple instances allowed) a gallery-like widget: use Link, which supports many
    await addWidget(page, /^Link/);
    await page.getByLabel("Button text").first().fill("First link");
    await page.getByLabel("Web address").fill("https://example.com/one");
    await insp(page).getByRole("button", { name: /Duplicate/ }).click();
    await openStructure(page);
    await expect(page.locator('[data-widget-row="link"]')).toHaveCount(2);
    // a single-instance widget cannot be duplicated and cannot be added twice
    await page.getByTestId("add-widget").click();
    await expect(page.getByTestId("choice").filter({ hasText: /^Link/ }).first()).toBeEnabled(); // links allow several
    await page.keyboard.press("Escape");

    // ---- hide / show
    const before = await previewOrder(page);
    await row(page, "video").getByRole("button", { name: /Hide Video/ }).click();
    await expect(row(page, "video")).toContainText("Hidden");
    expect(await previewOrder(page)).toEqual(before.filter((t) => t !== "video"));
    await row(page, "video").getByRole("button", { name: /Show Video/ }).click();
    expect(await previewOrder(page)).toEqual(before);

    // ---- remove from page only: the underlying records are kept
    const servicesBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.services.length);
    await openRow(page, "serviceList");
    await insp(page).getByRole("button", { name: /Remove from page/ }).click();
    await expect(page.locator('[data-widget-row="serviceList"]')).toHaveCount(0);
    await expect(page.getByTestId("notice")).toContainText("Your records are kept");
    const servicesAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.services.length);
    expect(servicesAfter).toBe(servicesBefore);
    await page.getByTestId("notice").getByRole("button", { name: "Undo" }).click();
    await expect(page.locator('[data-widget-row="serviceList"]')).toHaveCount(1);
  });

  test("reorder: arrow buttons, keyboard drag, pointer drag and touch drag", async ({ page, browser }) => {
    await openEditorWithSample(page, "Mechanic");
    const start = await rowOrder(page);
    expect(start.length).toBeGreaterThan(4);

    // -- accessible alternative: move up / down buttons (also announced to screen readers)
    const first = start[1]!; // index 1 (index 0 is the announcement)
    await openRow(page, first); await insp(page).getByRole("button", { name: "Move down" }).click();
    await openStructure(page);
    expect((await rowOrder(page))[2]).toBe(first);
    await openRow(page, first); await insp(page).getByRole("button", { name: "Move up" }).click();
    await openStructure(page);
    expect(await rowOrder(page)).toEqual(start);
    const pv0 = await previewOrder(page);
    expect(pv0).toEqual(start.filter((t) => pv0.includes(t)));

    // -- Organise mode: handles, keyboard and pointer drag
    await page.getByTestId("organise").click();
    await expect(page.getByTestId("organise-panel")).toBeVisible();
    // -- keyboard drag: focus the handle, space to pick up, arrow to move, space to drop
    const handle = row(page, start[0]!).getByTestId("drag-handle");
    await handle.focus();
    await page.keyboard.press("Space");
    await page.waitForTimeout(120); // dnd-kit registers its listeners on the next frame
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(120);
    await page.keyboard.press("Space");
    await expect.poll(() => rowOrder(page)).not.toEqual(start);
    const afterKeyboard = await rowOrder(page);
    expect(afterKeyboard[1]).toBe(start[0]);

    // -- pointer drag (mouse)
    const src = row(page, afterKeyboard[0]!).getByTestId("drag-handle");
    const dst = row(page, afterKeyboard[3]!).getByTestId("drag-handle");
    const sb = (await src.boundingBox())!;
    const db = (await dst.boundingBox())!;
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
    await page.mouse.down();
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2 + 12, { steps: 4 });
    await page.mouse.move(db.x + db.width / 2, db.y + db.height / 2 + 8, { steps: 12 });
    await page.mouse.up();
    await expect.poll(() => rowOrder(page)).not.toEqual(afterKeyboard);
    const afterMouse = await rowOrder(page);
    expect(afterMouse.indexOf(afterKeyboard[0]!)).toBeGreaterThan(0);

    // preview follows the editor order exactly
    const visibleOrder = await previewOrder(page);
    expect(visibleOrder).toEqual(afterMouse.filter((t) => visibleOrder.includes(t)));

    // -- touch drag on a touch-capable context
    const ctx = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
    const tp = await ctx.newPage();
    await tp.goto("/dashboard");
    await tp.getByRole("button", { name: /^Mechanic/ }).first().click();
    await tp.waitForURL("**/dashboard/page");
    await tp.waitForLoadState("networkidle");
    await tp.getByTestId("tab-content").tap();
    await tp.getByTestId("organise").tap();
    await expect(tp.getByTestId("organise-panel")).toBeVisible();
    await tp.waitForTimeout(700); // the sheet finishes sliding up before handles are measured
    const touchStart = await rowOrder(tp);
    const th = row(tp, touchStart[0]!).getByTestId("drag-handle");
    const tb = (await th.boundingBox())!;
    const target = row(tp, touchStart[2]!).getByTestId("drag-handle");
    const tgt = (await target.boundingBox())!;
    const cdp = await ctx.newCDPSession(tp);
    const pt = (x: number, y: number) => [{ x, y, id: 1 }];
    const x = tb.x + tb.width / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(x, tb.y + tb.height / 2) });
    await tp.waitForTimeout(260); // long-press activation (150ms) so normal scrolling still works
    for (let i = 1; i <= 14; i++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x, tb.y + tb.height / 2 + ((tgt.y - tb.y + 10) * i) / 14) });
      await tp.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => rowOrder(tp)).not.toEqual(touchStart);
    await ctx.close();
  });

  test("page style: owner choices on top of an optional look; sections reset; content untouched", async ({ page }) => {
    await openEditorWithSample(page, "Barber");
    const frame = previewFrame(page);
    const orderBefore = await rowOrder(page);
    const contentBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content);
    const widgetsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.widgets);

    // No theme has to be chosen: the page style opens on the owner's own controls.
    await selectPart(page, "page");
    await expect(page.getByTestId("inspector-page")).toBeVisible();

    // an optional look can still be a starting point; content and widgets stay exactly as they were
    await openSection(page, /^Look/);
    const seen = new Set<string>();
    for (const id of ["night", "clean", "colour", "photo", "showroom"]) {
      await look(page, id).click();
      await expect(look(page, id).locator("input")).toBeChecked();
      await expect.poll(async () => frame.locator("[data-taplo-page]").evaluate((el) => getComputedStyle(el).getPropertyValue("--tp-background").trim())).not.toBe("");
      seen.add(await frame.locator("[data-taplo-page]").evaluate((el) => JSON.stringify([el.getAttribute("data-header"), el.getAttribute("data-desktop"), getComputedStyle(el).getPropertyValue("--tp-background").trim(), getComputedStyle(el).getPropertyValue("--tp-font-heading").trim()])));
    }
    expect(seen.size).toBe(5);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content)).toEqual(contentBefore);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).page.widgets)).toEqual(widgetsBefore);
    await openStructure(page);
    expect(await rowOrder(page)).toEqual(orderBefore);
    await selectPart(page, "page");

    // owner's custom values on top
    await look(page, "clean").click();
    const buttonsSection = await openSection(page, "Buttons");
    await buttonsSection.getByRole("radio", { name: "Square" }).locator("xpath=ancestor::label").click();
    await openSection(page, "Button colours");
    await page.getByRole("textbox", { name: "Button colour hex value", exact: true }).fill("#0a7a3b");
    await expect(buttonsSection.locator("summary").first()).toContainText("changed");
    await expect.poll(() => frame.locator(".tp-btn").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe("0px");
    await look(page, "night").click();       // a different starting look replaces the owner's changes, and says so
    await expect(page.getByTestId("notice")).toContainText("replaced");
    await expect(buttonsSection.locator("summary").first()).not.toContainText("changed");
    await buttonsSection.getByRole("radio", { name: "Square" }).locator("xpath=ancestor::label").click();
    await expect(buttonsSection.locator("summary").first()).toContainText("changed");

    // reset one section, then everything
    const textSection = await openSection(page, /^Type/);
    await textSection.getByRole("radio", { name: "Large" }).locator("xpath=ancestor::label").click();
    await buttonsSection.getByRole("button", { name: /Reset this section/ }).click();
    await expect(buttonsSection.locator("summary").first()).not.toContainText("changed");
    await expect(textSection.locator("summary").first()).toContainText("changed");
    await page.getByRole("button", { name: /Reset all style changes/ }).click();
    await expect(textSection.locator("summary").first()).not.toContainText("changed");
  });

  test("per-widget appearance overrides and reset to theme", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic");
    const frame = previewFrame(page);
    await openRow(page, "serviceList");
    await insp(page).getByRole("tab", { name: "Appearance" }).click();
    await expect(insp(page)).toContainText("Following your page style");
    await insp(page).getByRole("radio", { name: "Featured" }).locator("xpath=ancestor::label").click();
    await insp(page).getByRole("radio", { name: "None", exact: true }).first().locator("xpath=ancestor::label").click();
    await insp(page).getByLabel("Card colour hex value").fill("#1f2a44");
    const widget = frame.locator('[data-widget="serviceList"]');
    await expect(widget).toHaveAttribute("data-featured", "true");
    const card = widget.locator(".tp-card");
    await expect.poll(() => card.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(31, 42, 68)");
    // text automatically flips to stay readable on the dark card
    const textColour = await card.evaluate((el) => getComputedStyle(el).color);
    expect(textColour).not.toBe("rgb(42, 32, 25)");
    // other widgets are untouched
    await expect(frame.locator('[data-widget="reviews"] .tp-card')).not.toHaveCSS("background-color", "rgb(31, 42, 68)");
    await expect(insp(page)).toContainText(/\d settings? differ/);
    await insp(page).getByRole("button", { name: "Reset to page style" }).click();
    await expect(widget).not.toHaveAttribute("data-featured", "true");
    await expect(insp(page)).toContainText("Following your page style");
  });

  test("undo and redo (buttons and keyboard) and draft persistence after refresh", async ({ page }) => {
    await openEditorWithSample(page, "Tutor");
    const frame = previewFrame(page);
    await expect(page.getByTestId("undo")).toBeDisabled();
    const start = await rowOrder(page);

    // an edit of each kind
    await openRow(page, start[1]!); await insp(page).getByRole("button", { name: "Move down" }).click();      // reorder
    await openStructure(page);
    const reordered = await rowOrder(page);
    await pickLook(page, "showroom");                           // theme
    await selectPart(page, "header");
    await openSection(page, "Your name and description");
    const name = page.getByLabel("Business name");
    await name.fill("Clearpath Maths Tuition (edited)");                              // content (typing = one undo step)
    await expect(frame.getByRole("heading", { level: 1 })).toContainText("(edited)");
    expect(reordered).not.toEqual(start);

    // undo the name edit as ONE step
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.getByTestId("undo").click();
    await expect(frame.getByRole("heading", { level: 1 })).not.toContainText("(edited)");
    // undo theme
    await page.getByTestId("undo").click();
    await expect.poll(() => frame.locator("[data-taplo-page]").getAttribute("data-header")).toBe("side"); // back to Midnight
    // undo reorder using the keyboard shortcut
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Control+z");
    await openStructure(page);
    await expect.poll(() => rowOrder(page)).toEqual(start);
    await expect(page.getByTestId("undo")).toBeDisabled();
    // redo it all with the shortcut and button
    await page.keyboard.press("Control+Shift+z");
    await expect.poll(() => rowOrder(page)).toEqual(reordered);
    await page.getByTestId("redo").click();
    await page.getByTestId("redo").click();
    await expect(frame.getByRole("heading", { level: 1 })).toContainText("(edited)");
    await expect(page.getByTestId("redo")).toBeDisabled();

    // draft persists after a refresh
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(await rowOrder(page)).toEqual(reordered);
    await expect(previewFrame(page).getByRole("heading", { level: 1 })).toContainText("(edited)");
    await expect(previewFrame(page).locator("[data-taplo-page]")).toHaveAttribute("data-header", "cover"); // Ocean
  });

  test("publishing: draft stays private, published matches the preview, changes need an explicit publish", async ({ page }) => {
    await openEditorWithSample(page, "Consultant");
    await selectPart(page, "settings");
    await expect(page.getByText("Draft — not published")).toBeVisible();
    await page.getByRole("button", { name: "Publish", exact: true }).first().click();
    await expect(page.getByText(/Published · version 1/)).toBeVisible();
    const slug = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.slug);

    // preview ↔ published parity: same widgets, same order, same theme
    const prev = await previewOrder(page);
    const attrs = await previewFrame(page).locator("[data-taplo-page]").evaluate((el) => ["data-header", "data-desktop", "data-decoration", "data-card-surface"].map((a) => el.getAttribute(a)));
    const pub = await page.context().newPage();
    await pub.goto(`/demo/p/${slug}`);
    await expect(pub.getByRole("note")).toContainText("opens in this browser only");
    const pubOrder = await pub.locator("[data-widget]").evaluateAll((els) => els.map((e) => e.getAttribute("data-widget")));
    expect(pubOrder).toEqual(prev);
    expect(await pub.locator("[data-taplo-page]").evaluate((el) => ["data-header", "data-desktop", "data-decoration", "data-card-surface"].map((a) => el.getAttribute(a)))).toEqual(attrs);

    // a later draft edit does not change the published page until publishing again
    await pickLook(page, "colour");
    await selectPart(page, "settings");
    await expect(page.getByText("You have unpublished changes.")).toBeVisible();
    await pub.reload();
    expect(await pub.locator("[data-taplo-page]").getAttribute("data-header")).toBe(attrs[0]);
    await page.getByRole("button", { name: "Publish changes" }).first().click();
    await expect(page.getByText(/Published · version 2/)).toBeVisible();
    await pub.reload();
    await expect(pub.locator("[data-taplo-page]")).toHaveAttribute("data-header", "centered");

    // discard unpublished changes returns to the published copy
    await pickLook(page, "night");
    await selectPart(page, "settings");
    await page.getByRole("button", { name: "Discard unpublished changes" }).click();
    await expect(page.getByText("You have unpublished changes.")).toHaveCount(0);
    // unpublish takes the page offline
    await page.getByRole("button", { name: "Unpublish" }).click();
    await pub.reload();
    await expect(pub.getByText("Nothing published at this address")).toBeVisible();
  });

  test("images: upload with focal point, alt text, rejection of bad files, and fallbacks without images", async ({ page }) => {
    await openEditorWithSample(page, "Unlisted");
    const frame = previewFrame(page);
    await selectPart(page, "header");
    // no logo → initials fallback, never a broken image
    await expect(frame.locator(".tp-avatar")).toContainText("PG");
    const upload = page.getByLabel("Logo or profile picture: upload a picture");
    await upload.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
    await expect(page.getByRole("alert").filter({ hasText: "JPG, PNG or WebP" })).toBeVisible();
    await upload.setInputFiles(pngFile("logo.png"));
    await page.getByTestId("crop-apply").click();               // frame it first
    await expect(frame.locator(".tp-avatar img")).toHaveCount(1);
    await page.getByLabel("Describe the picture (for screen readers)").first().fill("Paws & Polish paw logo");
    await expect(frame.locator(".tp-avatar img")).toHaveAttribute("alt", "Paws & Polish paw logo");
    // focal point via the accessible sliders drives object-position
    await page.getByLabel("Focus left–right").first().fill("20");
    await page.getByLabel("Focus top–bottom").first().fill("80");
    await expect.poll(() => frame.locator(".tp-avatar img").evaluate((el) => (el as HTMLElement).style.objectPosition)).toBe("20% 80%");
    // stored as a small downscaled data URL, never an arbitrary script
    const src = await page.evaluate(() => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.logo.src as string);
    expect(src).toMatch(/^data:image\/jpeg;base64,/);
    expect(src.length).toBeLessThan(400_000);
    // remove → initials again
    await page.getByRole("button", { name: "Remove" }).first().click();
    await expect(frame.locator(".tp-avatar img")).toHaveCount(0);
  });

  test("readability feedback: unreadable colours are corrected and explained", async ({ page }) => {
    await openEditorWithSample(page, "Mechanic");
    const frame = previewFrame(page);
    await selectPart(page, "page");
    await openSection(page, /^Colour/);
    await page.getByRole("textbox", { name: "Text hex value", exact: true }).fill("#f6f2ea"); // same as the page background
    await openSection(page, /^Readability/);
    await expect(page.getByLabel("Readability notes")).toContainText(/Text colour was adjusted because it was hard to read/);
    const ratio = await frame.locator("h1").evaluate((el) => {
      const lum = (c: string) => { const [r, g, b] = c.match(/\d+/g)!.slice(0, 3).map(Number).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!; };
      const root = el.closest("[data-taplo-page]")!;
      const fg = lum(getComputedStyle(el).color); const bg = lum(getComputedStyle(root).getPropertyValue("--tp-background").trim().startsWith("#") ? hexToRgb(getComputedStyle(root).getPropertyValue("--tp-background").trim()) : "rgb(246,242,234)");
      function hexToRgb(h: string) { const n = parseInt(h.slice(1), 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; }
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test("edge cases: long names and descriptions, many services, no images, no contacts, empty page", async ({ page }) => {
    const stress = FIXTURES.find((f) => f.key === "stress")!;
    await seedFixture(page, { v: 2, step: "publish", onboarded: true, plan: "business", content: stress.content, page: stress.page, slugEdited: true, published: null });
    const frame = previewFrame(page);
    // very long name, 14 services, long about text: the editor and the preview both stay inside the viewport
    await expect(frame.getByRole("heading", { level: 1 })).toContainText("Extraordinarily Long-Named");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/dashboard/page");
    await page.waitForLoadState("networkidle");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    const pubPage = await page.context().newPage();
    await pubPage.setViewportSize({ width: 360, height: 780 });
    await pubPage.goto("/demo-stress");
    expect(await pubPage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await expect(pubPage.locator("[data-widget=serviceList] li, [data-widget=priceMenu] li").first()).toBeVisible();

    // remove every widget → clear empty state in the editor, header-only page for visitors
    await page.setViewportSize({ width: 1440, height: 900 });
    // no images at all → initials, no broken <img>, no layout collapse
    await expect(frame.locator(".tp-avatar")).toBeVisible();
    for (let i = 0; i < 25; i++) {
      const r = page.locator("[data-widget-row]").first();
      if (!(await r.count())) break;
      await r.getByTestId("select-widget").click();
      await insp(page).getByRole("button", { name: /Remove from page/ }).click();
    }
    await openStructure(page);
    await expect(page.getByText("Nothing on your page yet")).toBeVisible();
    await expect(frame.locator("[data-widget]")).toHaveCount(0);
    await expect(frame.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByTestId("undo").click();
    await expect(page.locator("[data-widget-row]")).toHaveCount(1);
  });

  test("no contact methods: page stays valid, nothing dead is rendered, editor explains what is missing", async ({ page }) => {
    const f = FIXTURES.find((x) => x.key === "no-contacts")!;
    await seedFixture(page, { v: 2, step: "publish", onboarded: true, plan: "business", content: f.content, page: f.page, slugEdited: true, published: null });
    const frame = previewFrame(page);
    await expect(frame.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await frame.locator("a[href^='tel:'], a[href^='mailto:'], a[href*='wa.me']").count()).toBe(0);
    await expect(page.getByText("To publish: at least one way to contact you.")).toBeVisible();
    await expect(page.getByTestId("publish")).toBeDisabled();
  });
});
