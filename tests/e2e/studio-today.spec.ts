import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState, type DemoState } from "../../src/features/demo/store";
import { selectPart } from "./helpers";
import { applyIndustry, setName } from "../../src/features/demo/actions";

async function prepare(
  page: Page,
  kind = "maker",
  transform?: (state: DemoState) => void,
) {
  const state = setName(
    applyIndustry(initialState(), kind),
    kind === "maker" ? "Moss Studio" : "Chapter Barbers",
  );
  state.onboarded = true;
  state.step = "finish";
  transform?.(state);
  await page.goto("/dashboard");
  await page.evaluate(
    (draft) => localStorage.setItem("taplo.demo.v2", JSON.stringify(draft)),
    state,
  );
  await page.reload();
  await expect(page.getByTestId("studio")).toBeVisible();
  return state;
}
const contactButton = (page: Page) =>
  page.getByRole("button", { name: /^Contact details/ });
const hoursButton = (page: Page) =>
  page.getByRole("button", { name: /^Opening hours/ });

for (const width of [320, 390, 1440])
  for (const scheme of ["light", "dark"] as const) {
    test(`Today and contact editor at ${width} in ${scheme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme });
      await prepare(page);
      await expect(
        page.getByRole("heading", { name: "Moss Studio", exact: true }),
      ).toHaveCount(1);
      await expect(page.locator(".studio-business-identity img")).toHaveCount(
        0,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath("today.png"),
        fullPage: true,
      });
      await contactButton(page).click();
      const dialog = page.getByRole("dialog", {
        name: "How can customers reach you?",
      });
      await expect(dialog).toBeVisible();
      await dialog.evaluate(async (element) => {
        await Promise.all(
          element.getAnimations().map((animation) => animation.finished),
        );
      });
      const bounds = await dialog.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(901);
      await dialog.getByLabel("Email", { exact: true }).fill("not-an-email");
      await dialog
        .getByRole("button", { name: "Save contact details", exact: true })
        .click();
      await expect(dialog.getByLabel("Email", { exact: true })).toBeFocused();
      await expect(dialog.getByLabel("Email", { exact: true })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      await dialog
        .getByLabel("Email", { exact: true })
        .fill("hello@example.com");
      await dialog.getByLabel("Website", { exact: true }).fill("example.com");
      const audit = await new AxeBuilder({ page })
        .include('[data-testid="quick-business-editor"]')
        .analyze();
      expect(audit.violations).toEqual([]);
      await dialog.screenshot({ path: info.outputPath("contact-editor.png") });
      await dialog
        .getByRole("button", { name: "Save contact details", exact: true })
        .click();
      await expect(dialog).not.toBeVisible();
      expect(new URL(page.url()).pathname).toBe("/dashboard");
      await expect(
        page
          .getByRole("status")
          .filter({ hasText: "Contact details updated." }),
      ).toBeVisible();
      await expect(contactButton(page)).toBeFocused();
      await page.reload();
      await contactButton(page).click();
      await expect(dialog.getByLabel("Email", { exact: true })).toHaveValue(
        "hello@example.com",
      );
      await expect(dialog.getByLabel("Website", { exact: true })).toHaveValue(
        "https://example.com",
      );
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(contactButton(page)).toBeFocused();
      const homeAudit = await new AxeBuilder({ page })
        .include('[data-testid="studio"]')
        .analyze();
      expect(homeAudit.violations).toEqual([]);
    });
  }

for (const width of [390, 1440]) {
  test(`split opening hours do not change appointment availability at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    const state = await prepare(page, "barber", (draft) => {
      draft.content.hours = [{ day: "mon", opens: "09:00", closes: "17:00" }];
    });
    await hoursButton(page).click();
    const dialog = page.getByRole("dialog", {
      name: "Your opening hours",
      exact: true,
    });
    await dialog.getByLabel("Monday opens", { exact: true }).fill("10:00");
    await dialog.getByLabel("Monday closes", { exact: true }).fill("09:00");
    await dialog
      .getByRole("button", { name: "Save opening hours", exact: true })
      .click();
    await expect(
      dialog
        .getByRole("alert")
        .filter({ hasText: "Closing time must be later" }),
    ).toBeVisible();
    await expect(
      dialog.getByLabel("Monday opens", { exact: true }),
    ).toBeFocused();
    await dialog.getByLabel("Monday closes", { exact: true }).fill("16:00");
    await dialog
      .getByRole("button", { name: "Add Monday opening period", exact: true })
      .click();
    await dialog
      .getByLabel("Monday period 2 opens", { exact: true })
      .fill("17:00");
    await dialog
      .getByLabel("Monday period 2 closes", { exact: true })
      .fill("19:00");
    await dialog
      .getByRole("button", { name: "Copy Monday to weekdays", exact: true })
      .click();
    await expect(
      dialog.getByLabel("Tuesday opens", { exact: true }),
    ).toHaveValue("10:00");
    await expect(
      dialog.getByLabel("Tuesday period 2 closes", { exact: true }),
    ).toHaveValue("19:00");
    await dialog.getByRole("checkbox", { name: /^Show these hours/ }).check();
    await dialog.screenshot({
      path: info.outputPath("split-hours-editor.png"),
    });
    await dialog
      .getByRole("button", { name: "Save opening hours", exact: true })
      .click();
    await expect(dialog).not.toBeVisible();
    const saved = await page.evaluate(
      (slug) => ({
        draft: JSON.parse(localStorage.getItem("taplo.demo.v2")!),
        config: JSON.parse(
          localStorage.getItem(`taplo.demo.scheduling.v1:${slug}`)!,
        ),
      }),
      state.content.identity.slug,
    );
    expect(
      saved.draft.content.hours.filter(
        (row: { day: string }) => row.day === "mon",
      ),
    ).toEqual([
      { day: "mon", opens: "10:00", closes: "16:00" },
      { day: "mon", opens: "17:00", closes: "19:00" },
    ]);
    // Legacy fallback has been frozen before the public hours change, preserving the old 09–17 booking pattern.
    expect(saved.config.staff[0].hours.mon).toEqual([
      { start: "09:00", end: "17:00" },
    ]);
    expect(saved.draft.content.booking.onlineBookingReady).toBe(false);
    expect(saved.draft.published).toBeNull();
    expect(new URL(page.url()).pathname).toBe("/dashboard");
    await page.goto("/demo/preview");
    await expect(page.locator('[data-widget="hours"]')).toContainText("10:00");
    await expect(page.locator('[data-widget="hours"]')).toContainText("19:00");
    await page.goto("/dashboard/page");
    await selectPart(page, "details");
    await page
      .locator("summary")
      .filter({ hasText: "Location and opening hours" })
      .click();
    const publicHours = page
      .getByRole("definition")
      .filter({ hasText: "19:00" });
    await expect(publicHours).toHaveCount(5);
    await page
      .getByRole("button", { name: "Edit opening hours", exact: true })
      .click();
    const reopened = page.getByRole("dialog", {
      name: "Your opening hours",
      exact: true,
    });
    await expect(
      reopened.getByLabel("Monday period 2 closes", { exact: true }),
    ).toHaveValue("19:00");
    await expect(
      reopened.getByLabel("Sunday open", { exact: true }),
    ).not.toBeChecked();
    await reopened.getByRole("button", { name: "Close", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Edit opening hours", exact: true }),
    ).toBeFocused();
  });
}

test("dirty quick edits require an explicit discard and restore focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await contactButton(page).click();
  const dialog = page.getByRole("dialog", {
    name: "How can customers reach you?",
  });
  await dialog
    .getByLabel("Email", { exact: true })
    .fill("unfinished@example.com");
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(
    dialog.getByText("Discard your changes?", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Keep editing", exact: true })
    .click();
  await expect(dialog.getByLabel("Email", { exact: true })).toHaveValue(
    "unfinished@example.com",
  );
  await page.keyboard.press("Escape");
  await dialog.getByRole("button", { name: "Discard", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(contactButton(page)).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.contacts
          .email,
    ),
  ).toBeUndefined();
});

test("a second tab cannot silently overwrite contact details", async ({
  page,
  context,
}) => {
  await prepare(page);
  await contactButton(page).click();
  const dialog = page.getByRole("dialog", {
    name: "How can customers reach you?",
  });
  await dialog.getByLabel("Email", { exact: true }).fill("mine@example.com");
  const other = await context.newPage();
  await other.goto("/dashboard");
  await contactButton(other).click();
  const otherDialog = other.getByRole("dialog", {
    name: "How can customers reach you?",
  });
  await otherDialog
    .getByLabel("Email", { exact: true })
    .fill("theirs@example.com");
  await otherDialog
    .getByRole("button", { name: "Save contact details", exact: true })
    .click();
  await expect(otherDialog).not.toBeVisible();
  await dialog
    .getByRole("button", { name: "Save contact details", exact: true })
    .click();
  await expect(
    dialog.getByRole("alert").filter({ hasText: "changed elsewhere" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.contacts
          .email,
    ),
  ).toBe("theirs@example.com");
  await dialog
    .getByRole("button", { name: "Load latest details", exact: true })
    .click();
  await expect(dialog.getByLabel("Email", { exact: true })).toHaveValue(
    "theirs@example.com",
  );
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await other.close();
});

test("Today routes enquiries and individual work to the correct task", async ({
  page,
}) => {
  const draft = await prepare(page, "barber", (state) => {
    state.content.services = [
      {
        id: "svc_visit",
        name: "Consultation",
        priceMode: "fixed",
        priceMinor: 2500,
        currency: "GBP",
        durationMinutes: 30,
        delivery: ["premises"],
        bookingMode: "request",
        sortOrder: 0,
        archived: false,
      },
    ];
  });
  const now = Date.now(),
    start = now + 3600000;
  const booking = {
    id: "bk_valid",
    serviceId: "svc_visit",
    serviceName: "Consultation",
    staffId: "",
    startsAt: start,
    endsAt: start + 1800000,
    blockStart: start,
    blockEnd: start + 1800000,
    status: "pending",
    mode: "request",
    customer: { name: "Riley Demo", email: "riley@example.test" },
    durationMinutes: 30,
    priceLabel: "£25",
    createdAt: now,
    expiresAt: now + 86400000,
    idempotencyKey: "synthetic-one",
    manageToken: "synthetic-only",
    history: [{ at: now, status: "pending" }],
  };
  const state = {
    bookings: [
      booking,
      {
        ...booking,
        id: "bk_expired",
        customer: { name: "Expired request", email: "expired@example.test" },
        expiresAt: now - 1000,
      },
    ],
    holds: [],
    enquiries: [
      {
        id: "enq_one",
        name: "Example customer",
        email: "example@example.test",
        message: "Could we arrange a consultation?",
        createdAt: now,
        status: "new",
        idempotencyKey: "enquiry-only",
      },
    ],
  };
  await page.evaluate(
    ({ slug, value }) =>
      localStorage.setItem(
        `taplo.demo.bookings.v1:${slug}`,
        JSON.stringify(value),
      ),
    { slug: draft.content.identity.slug, value: state },
  );
  await page.reload();
  const attention = page.getByRole("region", {
    name: "A reply is needed",
    exact: true,
  });
  await expect(
    attention.getByRole("link", { name: "1 booking request", exact: true }),
  ).toBeVisible();
  await attention
    .getByRole("link", { name: "1 new enquiry", exact: true })
    .click();
  await expect(page.getByRole("tab", { name: /^Enquiries/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByText("Could we arrange a consultation?", { exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await page
    .locator(".studio-agenda")
    .getByRole("link")
    .filter({ hasText: "Riley Demo" })
    .click();
  await expect(page).toHaveURL(/booking=bk_valid/);
  const detail = page.getByRole("dialog", { name: "Riley Demo", exact: true });
  await expect(detail).toBeVisible();
  await detail.getByRole("button", { name: "Close", exact: true }).click();
  await expect(detail).not.toBeVisible();
  await expect(page).not.toHaveURL(/booking=/);
  await page.goto("/dashboard/bookings?booking=not-available");
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "That appointment is no longer available" }),
  ).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`customer team profile returns focus without invented portraits at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "/appearance/frame?scenario=station&widget=team&variant=list",
    );
    const person = page
      .getByTestId("team-card")
      .filter({ hasText: "Sam Ellis" })
      .getByRole("button", { name: /View profile/ });
    await expect(person).toBeVisible();
    await expect(person.locator(".tp-portrait")).toHaveCount(0);
    await person.click();
    const dialog = page.getByTestId("team-profile");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(person).toBeFocused();
    await person.click();
    await dialog.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(person).toBeFocused();
    await person.click();
    await dialog
      .getByRole("button", { name: "Book with Sam", exact: true })
      .click();
    const booking = page.getByTestId("booking-flow");
    await expect(booking).toBeVisible();
    await expect(dialog).not.toBeVisible();
    await expect(booking.locator(":focus")).toHaveCount(1);
    await booking.getByRole("button", { name: "Close", exact: true }).click();
    await expect(booking).not.toBeVisible();
    await expect(person).toBeFocused();
  });
}

for (const width of [390, 1440])
  for (const category of ["maker", "car-dealer"]) {
    test(`catalogue-first Studio connects to item setup for ${category} at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await prepare(page, category, (draft) => {
        draft.content.products = [];
      });
      await expect(page.getByTestId("upcoming-bookings")).toHaveCount(0);
      await expect(page.getByTestId("first-offer-setup")).toBeVisible();
      await prepare(page, category, (draft) => {
        draft.content.products = [
          {
            id: "own-catalogue-item",
            name: "Owner catalogue item",
            priceMinor: 2300,
            kind: category === "car-dealer" ? "vehicle" : "product",
            availability: "reserved",
          },
          { id: "old-item", name: "Archived item", archived: true },
          { id: "sample-item", name: "Example item", example: true },
        ];
      });
      const catalogue = page.getByTestId("catalogue-work");
      await expect(catalogue).toContainText("Owner catalogue item");
      await expect(catalogue).toContainText("Reserved");
      await expect(catalogue).not.toContainText("Archived item");
      await expect(catalogue).not.toContainText("Example item");
      await expect(page.getByTestId("upcoming-bookings")).toHaveCount(0);
      await catalogue
        .getByRole("link", {
          name: category === "car-dealer" ? "Add a vehicle" : "Add a product",
          exact: true,
        })
        .click();
      const dialog = page.getByRole("dialog", {
        name: category === "car-dealer" ? "Add a vehicle" : "Add a product",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      await dialog
        .getByRole("button", { name: "Save product", exact: true })
        .click();
      await expect(dialog.getByLabel("Name", { exact: true })).toBeFocused();
      await dialog
        .getByLabel("Name", { exact: true })
        .fill("Second owner item");
      await dialog
        .getByRole("button", { name: "Save product", exact: true })
        .click();
      await expect(dialog).not.toBeVisible();
      await page.goto("/dashboard");
      await expect(page.getByTestId("catalogue-work")).toContainText(
        "Second owner item",
      );
    });
  }

test("product save failure retains inputs and retry never duplicates the item", async ({
  page,
}) => {
  await prepare(page, "maker", (draft) => {
    draft.content.products = [];
  });
  await page.goto("/dashboard/products?new=1");
  const dialog = page.getByRole("dialog", {
    name: "Add a product",
    exact: true,
  });
  await dialog.getByLabel("Name", { exact: true }).fill("Retry cup");
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    let rejected = false;
    Storage.prototype.setItem = function (key, value) {
      if (key === "taplo.demo.v2" && !rejected) {
        rejected = true;
        throw new DOMException("Full storage", "QuotaExceededError");
      }
      return original.call(this, key, value);
    };
  });
  await dialog
    .getByRole("button", { name: "Save product", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("couldn’t save");
  await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
    "Retry cup",
  );
  await dialog
    .getByRole("button", { name: "Save product", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.products.filter(
      (product: { name: string }) => product.name === "Retry cup",
    ),
  );
  expect(saved).toHaveLength(1);
  await page.reload();
  await expect(page.getByText("Retry cup", { exact: true })).toBeVisible();
});

test("conflicting product edits retain inputs and explicitly load the latest price", async ({
  page,
}) => {
  await prepare(page, "maker", (draft) => {
    draft.content.products = [
      { id: "cup", name: "Original cup", priceMinor: 1200 },
    ];
  });
  await page.goto("/dashboard/products");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Edit product",
    exact: true,
  });
  await dialog.getByLabel("Name", { exact: true }).fill("My unsaved name");
  const other = await page.context().newPage();
  await other.goto("/dashboard/products");
  await other.getByRole("button", { name: "Edit", exact: true }).click();
  const theirs = other.getByRole("dialog", {
    name: "Edit product",
    exact: true,
  });
  await theirs.getByLabel("Name", { exact: true }).fill("Other tab cup");
  await theirs.getByLabel("Price (£, optional)", { exact: true }).fill("18");
  await theirs
    .getByRole("button", { name: "Save product", exact: true })
    .click();
  await expect(theirs).not.toBeVisible();
  await expect(page.locator(".ws-product-copy")).toContainText("Other tab cup");
  await dialog
    .getByRole("button", { name: "Save product", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("changed elsewhere");
  await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
    "My unsaved name",
  );
  await dialog
    .getByRole("button", { name: "Load latest item", exact: true })
    .click();
  await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
    "Other tab cup",
  );
  await expect(
    dialog.getByLabel("Price (£, optional)", { exact: true }),
  ).toHaveValue("18");
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await other.close();
});

for (const width of [390, 1440])
  test(`plan choices stay readable at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const draft = setName(
      applyIndustry(initialState(), "barber"),
      "Clear Studio",
    );
    draft.step = "plan";
    await page.goto("/onboarding");
    await page.evaluate(
      (state) => localStorage.setItem("taplo.demo.v2", JSON.stringify(state)),
      draft,
    );
    await page.goto("/onboarding?step=plan");
    await expect(page.getByTestId("setup-plans")).toBeVisible();
    const result = await new AxeBuilder({ page })
      .include('[data-testid="setup-plans"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      ),
    ).toEqual([]);
  });
