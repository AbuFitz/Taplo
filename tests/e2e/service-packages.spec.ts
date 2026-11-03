import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openEditorWithSample, openRow, insp } from "./helpers";

test.use({ hasTouch: true, reducedMotion: "reduce" });

type Pose = {
  header: "primary" | "buttons" | "icons";
  mode: "external" | "local" | "mixed" | "package";
  preselect?: string;
  plan?: "core" | "pro" | "business";
};
async function pose(page: Page, options: Pose) {
  await page.evaluate((opts) => {
    const state = JSON.parse(localStorage.getItem("taplo.demo.v2")!);
    const source = state.content.services[0];
    state.plan = opts.plan ?? "business";
    state.content.staff = [];
    state.content.hours = [];
    state.content.contacts = { social: [] };
    state.content.booking = { mode: "instant", onlineBookingReady: true };
    state.content.services = [
      {
        ...source,
        id: "local",
        name: "Initial appointment",
        priceMode: "fixed",
        priceMinor: 4500,
        durationMinutes: 45,
        bookingMode: "instant",
        externalUrl: undefined,
        externalLabel: undefined,
        archived: false,
        sortOrder: 0,
      },
      {
        ...source,
        id: "programme",
        name: "Monthly programme",
        priceMode: "fixed",
        priceMinor: 4000,
        priceUnit: "month",
        durationMinutes: 60,
        bookingMode: "instant",
        externalUrl:
          "https://www.brightlearntutoring.co.uk/online-one-to-one-maths-tutoring",
        externalLabel: "View programme",
        archived: false,
        sortOrder: 1,
        inclusions: [
          "Learning plan",
          "Live online lessons",
          "Parent reports",
          "Practice between lessons",
        ],
      },
    ];
    if (opts.mode === "external")
      state.content.services = state.content.services.slice(1);
    if (opts.mode === "package") {
      state.content.contacts.email = "hello@workshop.example";
      state.content.services = [
        {
          ...state.content.services[0],
          name: "Complete care package",
          description:
            "A package with time to explain each part of the work. Open the details to read the complete list of inclusions.",
          image: state.content.gallery[0]?.image,
          inclusions: [
            "Inspection",
            "Full service",
            "Written report",
            "Follow-up advice",
          ],
        },
      ];
    }
    state.page.appearance = {
      ...state.page.appearance,
      header: { layout: "side", actions: opts.header, align: "left" },
      layout: { desktop: "centered", width: "regular" },
    };
    state.page.meta = { ...state.page.meta, primaryAction: "book" };
    const base = { version: 1, hidden: false, appearance: {} };
    state.page.widgets =
      opts.mode === "package"
        ? [
            {
              ...base,
              id: "featured",
              type: "featuredService",
              settings: {
                serviceId: "local",
                headline: "Complete care",
                ctaLabel: "Choose a time",
              },
            },
            {
              ...base,
              id: "list",
              type: "serviceList",
              settings: { variant: "spotlight", title: "Services" },
            },
          ]
        : [
            {
              ...base,
              id: "booking",
              type: "booking",
              settings: {
                serviceId: opts.preselect ?? null,
                variant: "card",
                ...(!opts.preselect ? { label: "Choose a service" } : {}),
              },
            },
          ];
    localStorage.setItem("taplo.demo.v2", JSON.stringify(state));
  }, options);
  await page.goto("/demo/preview");
  await expect(page.locator("[data-taplo-ready=true]")).toBeVisible();
}
for (const width of [320, 390, 1440]) {
  test(`selected website destinations survive every header arrangement at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Mechanic");
    for (const header of ["primary", "buttons", "icons"] as const) {
      await pose(page, {
        mode: "external",
        header,
        preselect: "programme",
        plan: "core",
      });
      const link = page.getByRole("link", {
        name: /View programme.*Monthly programme/,
      });
      await expect(link).toHaveAttribute(
        "href",
        "https://www.brightlearntutoring.co.uk/online-one-to-one-maths-tutoring",
      );
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
  test(`promoted local actions preserve the chosen appointment at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Mechanic");
    for (const header of ["primary", "buttons"] as const) {
      await pose(page, {
        mode: "local",
        header,
        preselect: "local",
        plan: "pro",
      });
      await page
        .getByRole("button", { name: "Book a time", exact: true })
        .click();
      const flow = page.getByTestId("booking-flow");
      await expect(flow).toBeVisible();
      await expect(
        flow.getByRole("heading", { name: "Choose a time", exact: true }),
      ).toBeVisible();
      await expect(flow).toContainText("Initial appointment");
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Book a time", exact: true }),
      ).toBeFocused();
    }
  });
}
for (const width of [390, 1440]) {
  test(`all-website and mixed service choices offer the correct routes at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Mechanic");
    await pose(page, { mode: "external", header: "icons", plan: "core" });
    await page.getByRole("button", { name: /Choose a service/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("link", { name: "Monthly programme", exact: true }),
    ).toHaveAttribute("href", /brightlearntutoring/);
    await expect(dialog.getByTestId("enquiry-form")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await pose(page, { mode: "mixed", header: "icons", plan: "core" });
    await page.getByRole("button", { name: /Choose a service/ }).click();
    await expect(
      dialog.getByRole("link", { name: "Monthly programme", exact: true }),
    ).toBeVisible();
    await dialog.getByLabel("About (optional)", { exact: true }).click();
    await expect(
      page.getByRole("option", { name: "Initial appointment", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Monthly programme", exact: true }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
  });
  test(`featured packages share full details and hand off to booking with correct focus at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openEditorWithSample(page, "Mechanic");
    await pose(page, { mode: "package", header: "icons", plan: "pro" });
    const featured = page.locator("[data-widget=featuredService]");
    await expect(
      featured
        .getByRole("list", { name: "Included in this service" })
        .getByRole("listitem"),
    ).toHaveCount(3);
    await expect(featured).not.toContainText("Follow-up advice");
    await featured
      .getByRole("button", { name: "View details", exact: true })
      .click();
    const detail = page.getByTestId("service-detail");
    await expect(detail).toContainText("Follow-up advice");
    await detail
      .getByRole("button", { name: "Book this", exact: true })
      .click();
    const flow = page.getByTestId("booking-flow");
    await expect(flow).toBeVisible();
    await expect(detail).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(
      featured.getByRole("button", { name: "View details", exact: true }),
    ).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await featured.screenshot({ path: `work/featured-package-${width}.png` });
  });
  test(`package inclusions can be edited, reordered, removed and reused at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await openEditorWithSample(page, "Mechanic");
    await openRow(page, "serviceList");
    await insp(page)
      .getByTestId("service-picker")
      .getByRole("button", { name: /^Edit / })
      .first()
      .click();
    const dialog = page.getByTestId("record-editor-dialog");
    await dialog
      .locator("summary")
      .filter({ hasText: "What’s included (optional)" })
      .click();
    const add = dialog.getByRole("button", {
      name: "Add included item",
      exact: true,
    });
    await add.click();
    await expect(
      dialog.getByLabel("Included item 1", { exact: true }),
    ).toBeFocused();
    await dialog
      .getByLabel("Included item 1", { exact: true })
      .fill("Interior vacuum");
    await add.click();
    await dialog
      .getByLabel("Included item 2", { exact: true })
      .fill("Glass cleaned");
    await dialog
      .getByRole("button", { name: "Move included item 2 up", exact: true })
      .click();
    await expect(
      dialog.getByLabel("Included item 1", { exact: true }),
    ).toHaveValue("Glass cleaned");
    await expect(
      dialog.getByLabel("Included item 1", { exact: true }),
    ).toBeFocused();
    await add.click();
    await dialog.getByTestId("record-editor-save").click();
    await expect(dialog).toContainText(
      "Fill in each included item, or remove the empty row.",
    );
    await dialog
      .getByRole("button", { name: "Remove included item 3", exact: true })
      .click();
    await dialog.getByTestId("record-editor-save").click();
    await expect(dialog).toBeHidden();
    await page.reload();
    const saved = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.services[0]
          .inclusions,
    );
    expect(saved).toEqual(["Glass cleaned", "Interior vacuum"]);
    await page.goto("/demo/preview");
    await page.getByTestId("service-open").first().click();
    const detail = page.getByTestId("service-detail");
    await expect(detail.locator(".tp-service-inclusions li")).toHaveText([
      "•Glass cleaned",
      "•Interior vacuum",
    ]);
    expect(
      (
        await new AxeBuilder({ page })
          .include("[data-testid=service-detail]")
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}
