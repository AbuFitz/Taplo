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
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
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
    await page.getByText("Location and opening hours", { exact: true }).click();
    const publicHours = page.getByRole("definition").filter({ hasText: "19:00" });
    await expect(publicHours).toHaveCount(5);
    await page.getByRole("button", { name: "Edit opening hours", exact: true }).click();
    const reopened = page.getByRole("dialog", { name: "Your opening hours", exact: true });
    await expect(reopened.getByLabel("Monday period 2 closes", { exact: true })).toHaveValue("19:00");
    await expect(reopened.getByLabel("Sunday open", { exact: true })).not.toBeChecked();
    await reopened.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.getByRole("button", { name: "Edit opening hours", exact: true })).toBeFocused();

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
