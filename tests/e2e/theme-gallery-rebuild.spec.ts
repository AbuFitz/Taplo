import { test, expect } from '@playwright/test';
import { EXAMPLES } from '../../src/features/inspiration/examples';
import path from 'node:path';
const out=process.env.TAPLO_REVIEW_DIR??'test-results';
for(const width of [320,1440]) test(`all curated themed pages render without overflow at ${width}`,async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const item of EXAMPLES){await page.goto(`/appearance/frame?scenario=${item.scenario}`);await expect(page.getByRole('heading',{level:1})).toBeVisible();await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),item.slug).toBe(true);await page.screenshot({path:path.join(out,`theme-${item.slug}-${width}.png`)});}
 expect(errors).toEqual([]);
});
test('the actual sandbox switches content and authored appearance together',async({page})=>{
 await page.goto('/appearance');await page.getByRole('combobox',{name:'Business',exact:true}).selectOption('maya');
 await expect(page.getByRole('radio',{name:'Founder',exact:true})).toBeChecked();await expect(page.frameLocator('[data-testid="lab-frame"]:visible').getByRole('heading',{level:1})).toHaveText('Maya Builds');
 await page.getByRole('combobox',{name:'Business',exact:true}).selectOption('corner');await expect(page.getByRole('radio',{name:'Terracotta',exact:true})).toBeChecked();await expect(page.frameLocator('[data-testid="lab-frame"]:visible').getByRole('heading',{level:1})).toHaveText('No. 6 Coffee');
});
for(const width of [320,390,768,1440])test(`gallery hardware floats without a white backshell at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:950});await page.goto('/inspiration');const card=page.getByTestId('design-card').first();const surface=card.locator('.design-surface');await expect(surface).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(surface).toHaveCSS('overflow','visible');await expect(card.locator('.phone-key-power')).toHaveCount(1);await expect(card.locator('.phone-island')).toHaveCount(1);await expect(card.getByRole('heading')).toHaveText('Atelier');await expect(card).not.toContainText('Still life. Small places. Honest light.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:path.join(out,`library-new-${width}.png`)});
});
test('customer pages own the document colour and keep every profile visibly raised',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 for(const item of EXAMPLES){await page.goto(`/appearance/frame?scenario=${item.scenario}`);await expect(page.locator('.tp-header')).toBeVisible();await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);const colors=await page.evaluate(()=>{const root=document.querySelector<HTMLElement>('[data-taplo-page]')!;const profile=document.querySelector('.tp-floating-intro')??document.querySelector('.tp-header')!;return {base:getComputedStyle(root).getPropertyValue('--tp-background').trim(),meta:document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content,body:getComputedStyle(document.body).backgroundColor,shadow:getComputedStyle(profile).boxShadow,surface:getComputedStyle(profile).backgroundColor}});await expect.poll(()=>page.locator('meta[name="theme-color"]').getAttribute('content'),{message:item.slug}).toBe(colors.base);expect(colors.body,item.slug).not.toBe('rgba(0, 0, 0, 0)');expect(colors.shadow,item.slug).not.toBe('none');expect(colors.surface,item.slug).not.toBe('rgba(0, 0, 0, 0)');}
});
test('phone status area is part of the actual wallpaper, with content below the island',async({page})=>{
 await page.goto('/appearance');const frame=page.frameLocator('[data-testid="lab-frame"]:visible');await expect(frame.locator('html')).toHaveAttribute('data-taplo-phone','true');await expect(frame.locator('[data-taplo-page]')).toHaveCSS('padding-top','36px');await expect(frame.locator('.tp-bg')).toHaveCSS('top','0px');
});
