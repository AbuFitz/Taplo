import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
for (const width of [390, 1440])
  test(`continuous film plays transparently, responds to interaction and opens Product at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const film = page.getByTestId("cinematic-film");
    await film.scrollIntoViewIfNeeded();
    await page.mouse.move(1, 1);
    const v = film.getByTestId("cinematic-source");
    await expect(film).toHaveAttribute("data-ready", "true", {
      timeout: 20000,
    });
    await expect
      .poll(() => v.evaluate((el: HTMLVideoElement) => el.currentTime))
      .toBeGreaterThan(0.1);
    expect(
      await v.evaluate((el: HTMLVideoElement) => ({
        auto: el.autoplay,
        muted: el.muted,
        loop: el.loop,
        controls: el.controls,
        inline: el.hasAttribute("playsinline"),
      })),
    ).toEqual({
      auto: true,
      muted: true,
      loop: true,
      controls: false,
      inline: true,
    });
    await v.evaluate((el: HTMLVideoElement) => {
      el.pause();
      el.currentTime = 22;
    });
    await expect
      .poll(() => v.evaluate((el: HTMLVideoElement) => el.seeking))
      .toBe(false);
    const samples = await film
      .getByTestId("cinematic-canvas")
      .evaluate((src: HTMLCanvasElement) => {
        const c = document.createElement("canvas");
        c.width = src.width;
        c.height = src.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(src, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        let solid = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 240) solid++;
        return { corner: d[3], solid, width: c.width, height: c.height };
      });
    expect(samples.corner).toBeLessThan(2);
    expect(samples.solid).toBeGreaterThan(1000);
    expect(samples.width).toBe(width < 640 ? 780 : 1280);
    await film.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `cinema-${width}.png`,
      ),
    });
    await film.evaluate((el) => {
      el.style.color = "#111";
      el.style.background = "#fff";
      el.style.padding = "16px";
    });
    await film.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `cinema-light-${width}.png`,
      ),
    });
    const a11y = await new AxeBuilder({ page })
      .include('[data-testid="cinematic-film"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(a11y.violations.map((v) => v.id)).toEqual([]);
    await film
      .getByRole("link", { name: "Explore Taplo after the product animation" })
      .focus();
    await expect(v).toHaveJSProperty("paused", true);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/product$/);
  });
test("reduced motion keeps a transparent still without loading movie bytes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requested: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/reveal/") && r.url().endsWith(".mp4"))
      requested.push(r.url());
  });
  await page.goto("/");
  const film = page.getByTestId("cinematic-film");
  await film.scrollIntoViewIfNeeded();
  await expect(film.locator("video")).toHaveCount(0);
  await expect(film.locator("picture")).toBeVisible();
  expect(requested).toEqual([]);
});
test("offscreen film pauses and a lost graphics capability keeps the actual poster", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const film = page.getByTestId("cinematic-film");
  await film.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(film).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(film.getByTestId("cinematic-source")).toHaveJSProperty(
    "paused",
    true,
  );
  await film.scrollIntoViewIfNeeded();
  await film
    .getByTestId("cinematic-canvas")
    .evaluate((el) =>
      el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(film).toHaveAttribute("data-fallback", "true");
  await expect(film.locator("picture")).toBeVisible();
});

test("film switches to a real desktop source after a phone resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 950 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const film = page.getByTestId("cinematic-film");
  await film.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(film).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await page.setViewportSize({ width: 1440, height: 950 });
  await film.scrollIntoViewIfNeeded();
  await expect(film).toHaveAttribute("data-format", "landscape");
  await expect(film).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await expect
    .poll(() =>
      film
        .getByTestId("cinematic-canvas")
        .evaluate((c: HTMLCanvasElement) => c.width),
    )
    .toBe(1280);
  await expect(film.locator("video")).toHaveCount(1);
});
