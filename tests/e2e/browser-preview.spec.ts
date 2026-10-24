import { test,expect } from "@playwright/test";
import {openEditorWithSample} from "./helpers";
import AxeBuilder from "@axe-core/playwright";
for(const width of [390,1440]) test(`shared browser outline and current addresses at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  const hero=page.locator('.hero-stage');
  await expect(hero.locator('[data-browser-chrome]')).toContainText('mytaplo.com/no-6-coffee');
  await hero.getByRole('button',{name:'Car dealer',exact:true}).click();
  await expect(hero.locator('[data-browser-chrome]')).toContainText('mytaplo.com/harris-cars');
  await expect(hero.locator('[data-phone-static]')).toHaveCount(1);
  await expect(page.locator('footer').getByRole('link',{name:'hello@mytaplo.com',exact:true})).toHaveAttribute('href','mailto:hello@mytaplo.com');
  await page.goto('/inspiration/hollin-physio');
  const preview=page.getByTestId('design-preview');
  const frame=page.getByTestId('design-preview-frame');
  await frame.waitFor();const original=await frame.elementHandle();
  await preview.getByText('Desktop',{exact:true}).click();
  await expect(preview.locator('[data-browser-chrome]')).toContainText('mytaplo.com/hollin-physio');
  expect(await frame.evaluate((el,old)=>el===old,original)).toBe(true);
  await preview.getByText('Phone',{exact:true}).click();
  await expect(preview.locator('[data-browser-chrome]')).toHaveCount(0);
  await expect(preview.locator('.phone-shell')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.frameLocator('iframe[data-testid=design-preview-frame]').getByRole('heading',{level:1}).waitFor();
  const scan=await new AxeBuilder({page}).include('[data-testid=design-preview]').analyze();expect(scan.violations).toEqual([]);
});

test("owner desktop preview uses the draft business address",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await openEditorWithSample(page,"Tutor");
  const slug=await page.evaluate(()=>JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.slug);
  await page.getByRole("group",{name:"Preview size",exact:true}).getByRole("button",{name:"Desktop",exact:true}).click();
  await expect(page.locator("[data-preview-stage] [data-browser-chrome]")).toContainText(`mytaplo.com/${slug}`);
  await page.frameLocator('iframe[data-testid="preview-frame"]').getByRole("heading",{level:1}).waitFor();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
