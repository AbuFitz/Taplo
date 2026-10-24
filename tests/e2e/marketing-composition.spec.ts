import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import sharp from "sharp";
import jsQR from "jsqr";
for (const width of [320, 390, 768, 1440])
  test(`marketing decisions, readable previews and useful sharing work at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator(".hero-stage");
    await expect(hero.locator("iframe")).toHaveCount(0);
    for (const label of ["Car dealer", "Café"]) {
      await hero.getByRole("button", { name: label, exact: true }).click();
      await expect(hero.locator(".hero-phone img")).toHaveAttribute(
        "alt",
        label === "Café"
          ? "No. 6 Coffee business page"
          : "Harris Cars business page",
      );
    }
    expect(
      (await hero.locator(".hero-phone").boundingBox())!.width,
    ).toBeLessThan(310);
    await expect(page.locator(".feature-illustration")).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="businesses-h"]'),
    ).toHaveCount(0);
    await expect.poll(()=>hero.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true)
    const artwork = (await hero.locator('.hero-composition').boundingBox())!;
    const caption = (await hero.locator('.hero-stage-caption').boundingBox())!;
    expect(caption.y).toBeGreaterThanOrEqual(artwork.y + artwork.height);

    await hero.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `hero-${width}.png`,
      ),
    });
    const plaque = page.getByTestId("plaque-experience");
    await plaque.scrollIntoViewIfNeeded();
    await expect(plaque.getByRole("slider")).toHaveCount(0);
    await expect(plaque.getByRole("button")).toHaveCount(0);
    const code = await plaque.locator(".plaque-code svg").evaluate(el => new XMLSerializer().serializeToString(el));
    const {data,info} = await sharp(Buffer.from(code)).resize(800,800).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    expect(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data).toBe("https://taplo-lilac.vercel.app/inspiration/no-6-coffee");
    await plaque.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `plaque-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const home = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      home.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.goto("/product");
    await page
      .getByRole("button", { name: "Show your stock", exact: true })
      .click();
    await expect(page.locator(".product-lead-art img")).toHaveAttribute(
      "alt",
      "Keep the car in the conversation.",
    );
    await expect(page.locator(".product-lead-body a")).toHaveAttribute(
      "href",
      "/product/vehicles",
    );
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `product-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/pricing");
    await page
      .getByRole("button", { name: "Appointments", exact: true })
      .click();
    const plan = page.locator('.pricing-plans > li[data-plan="pro"]');
    await expect(plan).toBeVisible();
    await expect(plan).toContainText("£19.99");
    await expect(
      plan.getByRole("link", { name: "Start with Pro" }),
    ).toHaveAttribute("href", "/onboarding?plan=pro");
    if (width < 640)
      await expect(
        page.getByRole("radio", { name: "Pro", exact: true }),
      ).toBeChecked();
    const pricing = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(pricing.violations.map((v) => v.id)).toEqual([]);
    await page.screenshot({
      path: path.join(
        process.env.TAPLO_REVIEW_DIR ?? "test-results",
        `pricing-${width}.png`,
      ),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("plaque follows the pointer without a click, settles on leaving, and the hero never captures the wheel", async ({page}) => {
  await page.setViewportSize({width:1440,height:950});
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/");
  const plaque=page.locator(".plaque-stage");await plaque.scrollIntoViewIfNeeded();
  const box=(await plaque.boundingBox())!;
  await page.mouse.move(box.x+box.width*.85,box.y+box.height*.3);
  await expect(plaque).toHaveAttribute("data-engaged","true");
  await page.mouse.move(1,1);
  await expect(plaque).toHaveAttribute("data-engaged","false");
  await plaque.focus();await page.keyboard.press("ArrowRight");await expect(plaque).toHaveAttribute("data-engaged","true");
  await page.keyboard.press("Escape");await expect(plaque).toHaveAttribute("data-engaged","false");
  const phone=page.locator(".hero-phone");await phone.scrollIntoViewIfNeeded();await phone.hover();const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,300);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
});

test("sharing uses the simple plaque, with no reset or format controls",async({page})=>{
  await page.setViewportSize({width:390,height:950});await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/product/sharing");
  const plaque=page.getByTestId("plaque-experience");await expect(plaque).toBeVisible();await expect(plaque.getByRole("button")).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>v.id)).toEqual([]);
});

test("homepage design choices use distinct working businesses and send the selected design into setup",async({page})=>{
 await page.setViewportSize({width:390,height:950});await page.goto("/");const designs=page.getByTestId("home-designs");
 for(const [label,name,slug] of [["Appointments","Hollin Physiotherapy","hollin-physio"],["Stock","Harris Cars","harris-cars"],["Menus","No. 6 Coffee","no-6-coffee"]]){
  await designs.getByText(label,{exact:true}).click();await expect(designs.locator('.home-design-phone img')).toHaveAttribute('alt',`${name} business design`);
  await expect(designs.getByRole('link',{name:'Use this design',exact:true})).toHaveAttribute('href',`/onboarding?from=${slug}`);
 }
});
