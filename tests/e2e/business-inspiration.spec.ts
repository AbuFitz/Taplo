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
      // Both real businesses are in the gallery, on their own authorised designs, and open as the same page.
      await page.getByRole("searchbox", { name: "Search pages" }).fill(name);
      await expect(page.getByTestId("design-card")).toHaveCount(1);
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
