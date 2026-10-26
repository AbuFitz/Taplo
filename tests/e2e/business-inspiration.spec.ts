import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [390, 1440]) {
  test(`real business inspiration demos and clean adoption work at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [name, scenario, slug] of [
      ["FixNow Mechanics", "fixnow", "fixnowmechanics"],
      ["BrightLearn Tutoring", "brightlearn", "brightlearn"],
    ]) {
      await page.goto("/inspiration");
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await page.getByRole("searchbox", { name: "Find a design" }).fill(name);
      const card = page.getByTestId("design-card");
      await expect(card).toHaveCount(1);
      await expect(card.locator("iframe")).toHaveAttribute(
        "data-loaded",
        "true",
      );
      const frame = page.frameLocator("iframe");
      await expect(frame.getByRole("heading", { level: 1 })).toHaveText(name);
      if (scenario === "fixnow") {
        await expect(frame.locator(".tp-header")).toHaveAttribute(
          "data-layout",
          "centered",
        );
        await expect(frame.getByTestId("service-open").first()).toHaveAttribute(
          "data-layout",
          "compact",
        );
      }
      const opened = page.waitForEvent("popup");
      await card.getByRole("link", { name: /Open demo/ }).click();
      const demo = await opened;
      await demo.waitForLoadState("domcontentloaded");
      await expect(demo).toHaveURL(new RegExp(`scenario=${scenario}`));
      await expect(demo.getByRole("heading", { level: 1 })).toHaveText(name);
      await demo.close();
      await page.getByRole("radio", { name: "Desktop", exact: true }).check();
      await expect(card.locator(".browser-shell")).toBeVisible();
      await page.goto(`/inspiration/${slug}`);
      await expect(page.getByTestId("design-preview")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Open full page" }),
      ).toHaveAttribute("href", `/appearance/frame?scenario=${scenario}`);
      expect(
        (await new AxeBuilder({ page }).include("main").analyze()).violations,
      ).toEqual([]);
      await page.getByTestId("start-design").click();
      await expect(page.getByTestId("from-example")).toContainText(name);
      const saved = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("taplo.demo.v2")!),
      );
      expect(saved.content.identity.name).not.toBe(name);
      expect(JSON.stringify(saved.page.widgets)).not.toMatch(
        /fixnowmechanics\.co\.uk|brightlearntutoring\.co\.uk|wa\.me\/447577702613/,
      );
    }
  });
}
