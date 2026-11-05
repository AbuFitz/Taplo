import { expect, test, type Page, type BrowserContext } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { FIXTURES } from "../../src/features/themes/fixtures";
import { captureWorkspace } from "../../src/features/setup/workspace";

function state(name = "Northgate Workshop") {
  const fixture = FIXTURES[0];
  return {
    v: 2 as const,
    step: "finish" as const,
    onboarded: false,
    plan: fixture.plan,
    content: {
      ...structuredClone(fixture.content),
      identity: { ...fixture.content.identity, name },
    },
    page: {
      ...structuredClone(fixture.page),
      savedLooks: [
        {
          id: "my-look",
          name: "My layout",
          themeId: fixture.page.themeId,
          overrides: structuredClone(fixture.page.appearance),
        },
      ],
    },
    slugEdited: true,
    published: null,
    setupDrafts: {
      services: [
        {
          id: "not-finished",
          name: "A new service",
          price: "12.",
          minutes: "",
        },
      ],
    },
  };
}
async function open(page: Page, draft = state()) {
  await page.goto("/onboarding");
  await page.evaluate(
    (value) => localStorage.setItem("taplo.demo.v2", JSON.stringify(value)),
    draft,
  );
  await page.goto("/onboarding?step=finish");
  await expect(page.getByTestId("finish-step")).toBeVisible();
  return draft;
}
async function saveRemote(
  context: BrowserContext,
  draft = state("Saved Workshop"),
) {
  const bootstrap = await context.request.get("/v1/onboarding/drafts");
  expect(bootstrap.ok()).toBe(true);
  const result = await context.request.post("/v1/onboarding/drafts", {
    headers: {
      Origin: "http://localhost:3102",
      "Idempotency-Key": crypto.randomUUID(),
    },
    data: {
      expected_version: 0,
      display_name: draft.content.identity.name,
      look_id: draft.page.themeId,
      workspace_snapshot: captureWorkspace(draft),
    },
  });
  expect(result.ok()).toBe(true);
  return await result.json();
}

for (const width of [390, 1440]) {
  test(`complete workspace reaches server storage and Studio at ${width}`, async ({
    page,
    context,
  }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const draft = await open(page);
    await page.getByTestId("save-draft").click();
    await page.waitForURL("**/dashboard");
    const response = await context.request.get("/v1/onboarding/drafts");
    const remote = (await response.json()).draft;
    expect(remote.workspace_snapshot).toEqual(captureWorkspace(draft));
    expect(remote.version).toBe(1);
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("taplo.demo.v2")!).published,
      ),
    ).toBeNull();
    await page.screenshot({
      path: info.outputPath("connected-studio.png"),
      fullPage: true,
    });
  });

  test(`saved-draft conflict is readable and restores complete content at ${width}`, async ({
    page,
    context,
  }, info) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    const remote = await saveRemote(context);
    await page.getByTestId("save-draft").click();
    const conflict = page.getByTestId("saved-draft-conflict");
    await expect(conflict).toContainText("Saved Workshop");
    await expect(conflict.getByRole("heading")).toBeFocused();
    const audit = await new AxeBuilder({ page })
      .include('[data-testid="saved-draft-conflict"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      ),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath("draft-conflict.png"),
      fullPage: true,
    });
    await conflict
      .getByRole("button", { name: "Use saved draft", exact: true })
      .click();
    await expect(page.getByTestId("save-draft")).toBeFocused();
    const restored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("taplo.demo.v2")!),
    );
    expect(restored.content).toEqual(remote.workspace_snapshot.content);
    expect(restored.page).toEqual(remote.workspace_snapshot.page);
    expect(restored.setupDrafts.services[0].price).toBe("12.");
    await page.getByTestId("save-draft").click();
    await page.waitForURL("**/dashboard");
  });
}

test("explicitly keeping this draft advances exactly the reviewed server version", async ({
  page,
  context,
}) => {
  const local = await open(page);
  await saveRemote(context);
  await page.getByTestId("save-draft").click();
  await page
    .getByRole("button", { name: "Keep this draft", exact: true })
    .click();
  await page.waitForURL("**/dashboard");
  const remote = (
    await (await context.request.get("/v1/onboarding/drafts")).json()
  ).draft;
  expect(remote.version).toBe(2);
  expect(remote.workspace_snapshot).toEqual(captureWorkspace(local));
});

test("failed save keeps input and focus, then retries the same operation", async ({
  page,
}) => {
  const local = await open(page);
  const keys: string[] = [];
  await page.route("**/v1/onboarding/drafts", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    keys.push(route.request().headers()["idempotency-key"]);
    if (keys.length === 1)
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ code: "TEMPORARILY_UNAVAILABLE" }),
      });
    return route.continue();
  });
  await page.getByTestId("save-draft").click();
  await expect(page.getByTestId("draft-save-error")).toBeFocused();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("taplo.demo.v2")!).content,
    ),
  ).toEqual(local.content);
  await page.getByTestId("save-draft").click();
  await page.waitForURL("**/dashboard");
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});
