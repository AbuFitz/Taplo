import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440])
  for (const slug of ["fixnowmechanics", "brightlearn"]) {
    test(`${slug} uses functional source content and lifted blocks at ${width}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${slug}`);
      await expect(page.locator("[data-taplo-ready=true]")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        slug === "brightlearn" ? "BrightLearn Tutoring" : "FixNow Mechanics",
      );
      await expect(page.locator(".tp-header")).toHaveCSS(
        "box-shadow",
        /rgba|rgb/,
      );
      if (slug === "brightlearn") {
        await expect(
          page.getByRole("link", { name: /^Ask about an introduction/ }),
        ).toHaveAttribute("href", "https://wa.me/447577702613");
        const services = page.getByTestId("service-open");
        await expect(services).toHaveCount(6);
        await expect(services.first()).toContainText("£40 per month");
        await services.first().click();
        const detail = page.getByTestId("service-detail");
        await expect(detail).toContainText("£40 per month");
        await expect(
          detail.getByRole("img", { name: "KS2 maths programme illustration" }),
        ).toHaveCSS("object-fit", "contain");
        await expect
          .poll(() =>
            detail
              .getByRole("img")
              .evaluate(
                (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
              ),
          )
          .toBe(true);
        await expect(
          detail.getByRole("link", { name: "View programme" }),
        ).toHaveAttribute(
          "href",
          "https://www.brightlearntutoring.co.uk/ks2-maths-confidence-sats-preparation",
        );
        await expect(detail.getByRole("textbox")).toHaveCount(0);
        await page.keyboard.press("Escape");
        await expect(services.first()).toBeFocused();
      } else {
        await expect(page.locator(".tp-header")).toHaveAttribute(
          "data-layout",
          "centered",
        );
        await expect(page.locator(".tp-header .tp-profile-photo")).toHaveCount(
          0,
        );
        await expect(page.getByTestId("service-open").first()).toHaveAttribute(
          "data-layout",
          "compact",
        );
        await page
          .locator(".tp-header")
          .screenshot({ path: `work/fixnow-profile-${width}.png` });
        await expect(
          page.getByRole("link", { name: /^Get a quote/ }).first(),
        ).toHaveAttribute("href", "https://www.fixnowmechanics.co.uk/estimate");
        await page.getByTestId("service-open").first().click();
        const detail = page.getByTestId("service-detail");
        await expect(detail).toContainText("£45");
        await expect(
          detail.getByRole("link", { name: "Get a quote", exact: true }),
        ).toHaveAttribute("href", "https://www.fixnowmechanics.co.uk/estimate");
        await expect(detail.getByRole("textbox")).toHaveCount(0);
        await page.keyboard.press("Escape");
        await expect(
          page.getByRole("link", { name: /^View in shop: Thinkware F70/ }),
        ).toHaveAttribute(
          "href",
          /shop.fixnowmechanics.co.uk\/shop\/thinkware-f70/,
        );
        await expect(
          page.getByRole("link", { name: "FixNow on Google", exact: true }),
        ).toHaveAttribute("href", "https://share.google/9KkDSrnHkdPoeQLMl");
      }
      if (slug === "fixnowmechanics") {
        const rows = page.getByTestId("service-open");
        const prices = [
          "£45",
          "From £55",
          "From £129",
          "Quote on request",
          "From £100",
          "Quote on request",
        ];
        for (let i = 0; i < prices.length; i++) {
          await rows.nth(i).click();
          const detail = page.getByTestId("service-detail");
          await expect(detail).toContainText(prices[i]);
          await expect(detail.getByRole("link").first()).toHaveAttribute(
            "href",
            "https://www.fixnowmechanics.co.uk/estimate",
          );
          await page.keyboard.press("Escape");
          await expect(rows.nth(i)).toBeFocused();
        }
        const media = page.locator(".tp-gallery-mosaic [data-lead] .tp-media");
        const tile = page.locator(".tp-gallery-mosaic [data-lead] button");
        expect(
          Math.abs(
            (await media.boundingBox())!.width -
              (await tile.boundingBox())!.width,
          ),
        ).toBeLessThan(1);
        await tile.click();
        await expect(page.getByTestId("lightbox")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(tile).toBeFocused();
        const quote = page.getByRole("link", { name: /^Get a quote/ }).first();
        const shop = page.getByRole("link", {
          name: "Browse the full shop",
          exact: true,
        });
        expect(
          await quote.evaluate((el) => getComputedStyle(el).backgroundColor),
        ).not.toBe(
          await shop.evaluate((el) => getComputedStyle(el).backgroundColor),
        );
      }
      await page
        .getByRole("button", { name: "Share page", exact: true })
        .click();
      await expect(page.getByLabel("Page link", { exact: true })).toHaveValue(
        new RegExp(`/${slug}$`),
      );
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("share-panel")).toBeHidden();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
        "content",
        await page
          .locator("[data-taplo-page]")
          .evaluate((el) =>
            getComputedStyle(el).getPropertyValue("--tp-background").trim(),
          ),
      );
      expect(errors).toEqual([]);
    });
  }
