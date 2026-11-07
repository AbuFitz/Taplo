import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState } from "../../src/features/demo/store";
import { loadSample } from "../../src/features/demo/actions";
async function prepare(page: Page, scheme: "light" | "dark" = "light") {
  await page.goto("/dashboard");
  const draft = loadSample(initialState(), "barber");
  draft.plan = "business";
  await page.evaluate(
    ({ draft, scheme }) => {
      localStorage.setItem("taplo.demo.v2", JSON.stringify(draft));
      localStorage.setItem("taplo.operational-appearance.v1", scheme);
    },
    { draft, scheme },
  );
  await page.reload();
  await expect(page.getByTestId("studio")).toBeVisible();
}
async function settled(page: Page) {
  await page.locator("#studio-content").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .map((a) => a.finished.catch(() => {})),
    );
  });
}
for (const [width, scheme] of [
  [1440, "light"],
  [1440, "dark"],
  [390, "light"],
  [390, "dark"],
  [320, "light"],
] as const) {
  test(`rebuilt Studio sections at ${width}px in ${scheme}`, async ({
    page,
  }, info) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    await prepare(page, scheme);
    for (const route of [
      "",
      "/offers",
      "/services",
      "/products",
      "/bookings",
      "/team",
      "/reviews",
      "/analytics",
      "/settings",
      "/help",
      "/page",
    ]) {
      await page.goto(`/dashboard${route}`);
      await expect(page.locator("#studio-content")).toBeVisible();
      if (route === "/page")
        await expect(page.getByTestId("my-page")).toBeVisible();
      else await expect(page.locator("#studio-content h1")).toHaveCount(1);
      await settled(page);
      expect
        .soft(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      await page.screenshot({
        path: info.outputPath(`${route.slice(1) || "today"}.png`),
        fullPage: route !== "/page",
      });
      if (["", "/offers", "/help", "/settings"].includes(route)) {
        const audit = await new AxeBuilder({ page })
          .include(route === "" ? ".ts-workspace" : "#studio-content")
          .analyze();
        if (audit.violations.length)
          await info.attach(`accessibility-${route.slice(1) || "today"}`, {
            body: JSON.stringify(audit.violations, null, 2),
            contentType: "application/json",
          });
        expect.soft(audit.violations).toEqual([]);
      }
      if (route === "/page" && width < 900) {
        const audit = await new AxeBuilder({ page })
          .include(".mobile-studio-header")
          .include(".mobile-studio-tabs")
          .analyze();
        expect.soft(audit.violations).toEqual([]);
        const divider = page.getByRole("separator", { name: "Resize page preview" });
        await divider.focus();
        await divider.press("End");
        expect(await page.locator(".mobile-studio-body").evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(140);
      }
      if (width < 900)
        await expect(
          page.getByRole("navigation", { name: "Studio", exact: true }),
        ).toBeVisible();
      else
        await expect(
          page.getByRole("navigation", {
            name: "Studio navigation",
            exact: true,
          }),
        ).toBeVisible();
    }
  });
}

test("search finds a saved service and opens the real editor", async ({
  page,
}) => {
  await prepare(page);
  await page
    .getByRole("button", { name: "Search Studio", exact: true })
    .click();
  const search = page.getByRole("dialog", {
    name: "Search Studio",
    exact: true,
  });
  await search.getByRole("searchbox").fill("Skin fade");
  await search.getByRole("link", { name: /Skin fade/ }).click();
  const editor = page.getByRole("dialog", {
    name: "Edit service",
    exact: true,
  });
  await expect(editor).toBeVisible();
  await expect(editor.getByLabel("Service name", { exact: true })).toHaveValue(
    "Skin fade",
  );
  await editor.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/services$/);
});
test("offers add, edit, filter and search the same saved records", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.goto("/dashboard/offers");
  await page.getByRole("button", { name: "Add offer", exact: true }).click();
  await page
    .getByRole("menuitem", { name: "Add a service", exact: true })
    .click();
  const editor = page.getByRole("dialog", {
    name: "Add a service",
    exact: true,
  });
  await editor
    .getByLabel("Service name", { exact: true })
    .fill("Skin consultation");
  await editor
    .getByRole("button", { name: "Save service", exact: true })
    .click();
  await expect(editor).toBeHidden();
  await page.goto("/dashboard/offers");
  await page
    .getByRole("searchbox", { name: "Search what you offer" })
    .fill("Skin consultation");
  await expect(
    page.getByRole("link", { name: /Skin consultation/ }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("not a real offer");
  await expect(
    page.getByRole("heading", { name: "No matches this time." }),
  ).toBeVisible();
  await page.getByRole("searchbox").clear();
  await page
    .getByRole("group", { name: "Offer type" })
    .getByRole("button", { name: /Products/ })
    .click();
  await expect(
    page.getByRole("link", { name: /Skin consultation/ }),
  ).toHaveCount(0);
});
test("help answers a question and edits contact details without leaving", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.goto("/dashboard/help");
  await page.getByText("Why are no times showing?", { exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Review availability" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Contact details/ }).click();
  const editor = page.getByRole("dialog", {
    name: "How can customers reach you?",
  });
  await editor.getByLabel("Email", { exact: true }).fill("studio@example.com");
  await editor.getByRole("button", { name: "Save contact details" }).click();
  await expect(editor).toBeHidden();
  await expect(page).toHaveURL(/\/dashboard\/help$/);
  await page.getByRole("searchbox").fill("bookings");
  await page.getByRole("button", { name: /Get appointments ready/ }).click();
  const guide = page.getByRole("dialog", { name: "Get appointments ready" });
  await expect(guide).toBeVisible();
  await expect(guide.locator("video")).toHaveCount(0);
  await guide.getByRole("button", { name: "Close guide" }).click();
});
test("mobile menu and page editor keep Studio destinations reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  const dock = page.getByRole("navigation", { name: "Studio", exact: true });
  await dock.getByRole("link", { name: "Your page", exact: true }).click();
  await expect(page.getByTestId("my-page")).toBeVisible();
  await expect(dock).toBeVisible();
  await dock.getByRole("button", { name: "Open Studio menu" }).click();
  const menu = page.getByRole("dialog", { name: "Your Studio", exact: true });
  await menu.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/settings$/);
  await expect(menu).toBeHidden();
  await page
    .getByRole("combobox", { name: "Colour mode" })
    .selectOption("dark");
  await page.reload();
  await expect(page.locator("[data-operational]")).toHaveAttribute(
    "data-colour-scheme",
    "dark",
  );
});

test("search quick edits stay on the current task and restore focus", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/dashboard/offers");
  const trigger = page.getByRole("button", {
    name: "Search Studio",
    exact: true,
  });
  await trigger.click();
  const search = page.getByRole("dialog", {
    name: "Search Studio",
    exact: true,
  });
  await search.getByRole("searchbox").fill("Opening hours");
  await search.getByRole("button", { name: /Opening hours/ }).click();
  const hours = page.getByRole("dialog", {
    name: "Your opening hours",
    exact: true,
  });
  await expect(hours).toBeVisible();
  await hours.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/offers$/);
  await expect(trigger).toBeFocused();
});

test("an empty workspace can open a sample without losing Studio navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.evaluate(() => localStorage.removeItem("taplo.demo.v2"));
  await page.reload();
  await expect(page.getByTestId("first-run")).toBeVisible();
  await page.getByText("Explore with a sample business", { exact: true }).click();
  await page.getByRole("button", { name: /Jay’s Barbers/ }).click();
  await expect(page.getByTestId("my-page")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Studio", exact: true })).toBeVisible();
});

test("Studio availability explains why a service has no customer times", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.setFixedTime(new Date("2026-11-02T08:00:00Z"));
  await page.goto("/dashboard");
  const draft = loadSample(initialState(), "barber");
  draft.plan = "business";
  draft.content.staff = [];
  const sampleService = draft.content.services?.[0];
  if (!sampleService) throw new Error("Barber fixture requires a service.");
  draft.content.services = [{
    ...sampleService,
    id: "test-cut",
    name: "Test cut",
    bookingMode: "instant",
    durationMinutes: 60,
  }];
  await page.evaluate((value) => {
    localStorage.setItem("taplo.demo.v2", JSON.stringify(value));
    localStorage.setItem(
      `taplo.demo.scheduling.v1:${value.content.identity.slug}`,
      JSON.stringify({
        timezone: "Europe/London",
        staff: [{ staffId: "", hours: {
          tue: [{ start: "09:00", end: "11:00" }],
          wed: [{ start: "09:00", end: "11:00" }],
        } }],
        rules: { minNoticeMinutes: 0, slotIntervalMinutes: 60 },
        blocks: [{
          id: "training",
          staffId: null,
          startsAt: Date.parse("2026-11-04T09:00:00Z"),
          endsAt: Date.parse("2026-11-04T11:00:00Z"),
          reason: "Training",
        }],
      }),
    );
  }, draft);
  await page.goto("/dashboard/bookings?section=availability");
  await page.getByText("Check customer availability", { exact: true }).click();
  const date = page.getByLabel("Date to check", { exact: true });
  await date.fill("2026-11-03");
  const times = page.getByRole("list", { name: "Available times", exact: true });
  await expect(times.getByRole("listitem")).toHaveText(["09:00", "10:00"]);
  await date.fill("2026-11-04");
  await expect(times).toHaveCount(0);
  await expect(page.getByRole("list", { name: "Why times are unavailable" }))
    .toHaveText("Blocked time on the calendar removes these times.");
});
