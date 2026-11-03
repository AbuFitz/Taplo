import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openEditorWithSample, openRow, insp, previewFrame } from "./helpers";
test.use({ hasTouch: true });
for (const width of [320, 390, 1440])
  test(`services order, popup drafts, photo and removal work at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Mechanic");
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
      const source = state.content.services[0];
      state.content.services = [
        { ...source, id: "first-service", name: "Inspection", archived: false },
        {
          ...source,
          id: "second-service",
          name: "Annual service",
          archived: false,
          image: state.content.gallery[0]?.image,
        },
        {
          ...source,
          id: "third-service",
          name: "Diagnostics",
          archived: false,
        },
      ];
      state.page.widgets = state.page.widgets.filter(
        (w: { type: string }) => w.type !== "featuredService",
      );
      const block = state.page.widgets.find(
        (w: { type: string }) => w.type === "serviceList",
      );
      block.settings = {
        ...block.settings,
        variant: "cards",
        serviceIds: null,
        excludeFeatured: false,
        limit: 12,
      };
      localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
    });
    await page.reload();
    await openRow(page, "serviceList");
    const panel = insp(page),
      picker = panel.getByTestId("service-picker");
    await expect(
      panel.getByRole("radiogroup", { name: "Layout", exact: true }),
    ).toHaveCount(0);
    await expect(picker.locator("li")).toHaveCount(3);
    await picker
      .getByRole("button", { name: "Move Diagnostics earlier", exact: true })
      .click();
    await expect(picker.locator("li").nth(1)).toContainText("Diagnostics");
    const publicServices = previewFrame(page).getByTestId("service-open");
    await expect(publicServices.nth(1)).toContainText("Diagnostics");
    await picker.getByRole("button", { name: /^Include Inspection,/ }).click();
    await expect(publicServices).toHaveCount(2);
    await picker.getByRole("button", { name: /^Edit Diagnostics / }).click();
    const dialog = page.getByTestId("record-editor-dialog");
    await expect(
      dialog.getByRole("heading", { name: "Edit service", exact: true }),
    ).toHaveCount(1);
    await dialog
      .getByLabel("Service name", { exact: true })
      .fill("Engine diagnostics");
    await dialog
      .locator("summary")
      .filter({ hasText: "Service photo (optional)" })
      .click();
    const sharp = (await import("sharp")).default;
    const buffer = await sharp({
      create: { width: 800, height: 400, channels: 3, background: "#54766b" },
    })
      .png()
      .toBuffer();
    await dialog.getByLabel("Service photo: upload a picture").setInputFiles({
      name: "service-wide.png",
      mimeType: "image/png",
      buffer,
    });
    const crop = page.getByTestId("crop-dialog");
    await expect(crop).toContainText("Keep the complete photo.");
    await crop.getByTestId("crop-apply").click();
    await expect(crop).toBeHidden();
    await dialog.getByLabel("Picture fit",{exact:true}).click();
    await page.getByRole("option",{name:"Show the whole picture",exact:true}).click();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Discard your changes?",
    );
    await dialog
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    await dialog.getByTestId("record-editor-save").click();
    await expect(dialog).toBeHidden();
    await expect(
      picker.getByRole("button", {
        name: /^Edit Engine diagnostics /,
      }),
    ).toBeFocused();
    await expect(publicServices.first()).toContainText("Engine diagnostics");
    await expect(publicServices.first().locator(".tp-service-photo img")).toHaveCSS("object-fit","contain");
    await expect(
      publicServices.first().locator(".tp-service-photo img"),
    ).toHaveCount(1);
    // Cancelling a later draft must not change the persisted record.
    await picker
      .getByRole("button", { name: /^Edit Engine diagnostics / })
      .click();
    await dialog.getByLabel("Service name", { exact: true }).fill("Not saved");
    await page.keyboard.press("Escape");
    await dialog.getByRole("button", { name: "Discard", exact: true }).click();
    await expect(picker).not.toContainText("Not saved");
    await panel.getByTestId("record-add").click();
    await dialog.getByTestId("record-editor-save").click();
    await expect(dialog).toContainText("Give the service a name.");
    await dialog
      .getByLabel("Service name", { exact: true })
      .fill("Fleet consultation");
    await dialog.getByLabel("Amount (£)", { exact: true }).fill("45");
    await dialog.getByTestId("record-editor-save").click();
    await expect(publicServices).toHaveCount(3);
    await page.reload();
    await openRow(page, "serviceList");
    await expect(publicServices.first()).toContainText("Engine diagnostics");
    await expect(publicServices.first().locator(".tp-service-photo img")).toHaveCSS("object-fit","contain");
    await expect(
      publicServices.first().locator(".tp-service-photo img"),
    ).toHaveCount(1);
    await expect(publicServices.nth(1)).toContainText("Annual service");
    await expect(
      publicServices.nth(1).locator(".tp-service-photo img"),
    ).toHaveCount(1);
    await expect(publicServices.nth(2)).toContainText("Fleet consultation");
    const before = await page.evaluate(
      () => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.services,
    );
    await panel.getByRole("tab", { name: /Appearance/ }).click();
    await expect(
      panel.getByRole("radiogroup", { name: "Layout", exact: true }),
    ).toBeVisible();
    await panel.getByRole("tab", { name: "Content", exact: true }).click();
    await picker.getByRole("button", { name: /^Edit Annual service / }).click();
    await dialog
      .getByRole("button", { name: "Remove this service…", exact: true })
      .click();
    await dialog.getByTestId("record-delete-confirm").click();
    await expect(publicServices).toHaveCount(2);
    const after = await page.evaluate(
      () => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.services,
    );
    expect(
      after.find((s: { id: string }) => s.id === "second-service").archived,
    ).toBe(true);
    expect(
      after.filter((s: { id: string }) => s.id !== "second-service"),
    ).toEqual(before.filter((s: { id: string }) => s.id !== "second-service"));
    const result = await new AxeBuilder({ page })
      .include('[data-testid="service-picker"]')
      .analyze();
    expect(result.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await picker.screenshot({ path: `work/service-picker-${width}.png` });
  });

for (const width of [390, 1440])
  test(`service detail respects the plan and booking returns focus at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openEditorWithSample(page, "Mechanic");
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
      state.plan = "core";
      state.content.booking.onlineBookingReady = true;
      state.content.services.forEach(
        (s: { bookingMode: string; durationMinutes: number }) => {
          s.bookingMode = "instant";
          s.durationMinutes = 60;
        },
      );
      state.content.staff.forEach((s: { serviceIds: null }) => {
        s.serviceIds = null;
      });
      localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
    });
    await page.goto("/demo/preview");
    const service = page.getByTestId("service-open").first();
    await service.click();
    const detail = page.getByTestId("service-detail");
    await expect(detail).toContainText("Arranged with the business directly.");
    await expect(
      detail.getByRole("button", { name: "Book this", exact: true }),
    ).toHaveCount(0);
    await detail.getByRole("button", { name: "Close", exact: true }).click();
    await expect(service).toBeFocused();
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
      state.plan = "pro";
      localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
    });
    await page.reload();
    await service.click();
    await detail
      .getByRole("button", { name: "Book this", exact: true })
      .click();
    const booking = page.getByTestId("booking-flow");
    await expect(booking).toBeVisible();
    await expect(detail).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(booking).toBeHidden();
    await expect(service).toBeFocused();
  });

for (const width of [390, 1440]) test(`service price basis and an existing website link persist through editing at ${width}`, async ({page})=>{
 await page.setViewportSize({width,height:1000});
 await openEditorWithSample(page,"Mechanic");
 await openRow(page,"serviceList");
 const picker=insp(page).getByTestId("service-picker");
 await picker.getByRole("button",{name:/^Edit /}).first().click();
 const dialog=page.getByTestId("record-editor-dialog");
 await dialog.getByLabel("Service name",{exact:true}).fill("Monthly support programme");
 await dialog.getByLabel("Price",{exact:true}).click();await page.getByRole("option",{name:"Fixed price",exact:true}).click();
 await dialog.getByLabel("Amount (£)",{exact:true}).fill("40");
 await dialog.getByLabel("Price is for",{exact:true}).click();await page.getByRole("option",{name:"One month",exact:true}).click();
 await dialog.locator("summary").filter({hasText:"Use an existing website or booking link"}).click();
 await dialog.getByLabel("Service link",{exact:true}).fill("javascript:alert(1)");
 await dialog.getByTestId("record-editor-save").click();
 await expect(dialog).toContainText("Enter a full web address starting with https://.");
 await dialog.getByLabel("Service link",{exact:true}).fill("https://www.brightlearntutoring.co.uk/online-one-to-one-maths-tutoring");
 await dialog.getByLabel("Link text",{exact:true}).fill("View programme");
 await expect(dialog.getByLabel("How do customers book?",{exact:true})).toHaveCount(0);
 await dialog.getByTestId("record-editor-save").click();await expect(dialog).toBeHidden();
 await page.reload();
 const service=previewFrame(page).getByTestId("service-open").filter({hasText:"Monthly support programme"});
 await expect(service).toContainText("£40 per month");
 await page.goto("/demo/preview");
 await page.getByTestId("service-open").filter({hasText:"Monthly support programme"}).click();
 const detail=page.getByTestId("service-detail");
 await expect(detail).toContainText("£40 per month");
 await expect(detail.getByRole("link",{name:"View programme",exact:true})).toHaveAttribute("href","https://www.brightlearntutoring.co.uk/online-one-to-one-maths-tutoring");
 await expect(detail.getByRole("textbox")).toHaveCount(0);
});
