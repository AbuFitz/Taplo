import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for(const width of [320,390,768,1440]) {
 test(`product tools have usable tabs and relevant destinations at ${width}`,async({page})=>{
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/product');
  const experience=page.getByTestId('product-experience');
  for(const [tab,scene,href] of [
   ['Show your work','work','/product/gallery-reviews'],
   ['Take bookings','booking','/product/booking'],
   ['List what you sell','stock','/product/vehicles'],
   ['Stay in touch','contact','/product/enquiries'],
  ]) {
   await experience.getByRole('tab',{name:tab,exact:true}).click();
   const panel=experience.getByRole('tabpanel');
   await expect(panel).toHaveAttribute('data-scene',scene);
   await expect(panel).toHaveCSS('opacity','1');
   await expect(experience.getByRole('tab',{name:tab,exact:true})).toHaveAttribute('aria-selected','true');
   await expect(panel.getByRole('link')).toHaveAttribute('href',href);
   expect((await new AxeBuilder({page}).include('main').analyze()).violations).toEqual([]);
  }
  await expect(page.getByRole('navigation',{name:'All product features'})).toHaveCount(0);
  if(width>=1024){
   await expect(page.getByTestId('product-snapshots').getByRole('link')).toHaveCount(3);
   await page.getByTestId('product-snapshots').scrollIntoViewIfNeeded();
   for(const image of await page.getByTestId('product-snapshots').getByRole('img').all())
    await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth===1170)).toBe(true);
  }else await expect(page.getByTestId('product-snapshots')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`work/product-overview-${width}.png`,fullPage:true});
  expect(errors).toEqual([]);
 });
}
test('product tabs support keyboard and hover without changing on a passing pointer',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/product');
 const experience=page.getByTestId('product-experience');
 const first=experience.getByRole('tab',{name:'Show your work',exact:true});
 await first.focus();await page.keyboard.press('ArrowRight');
 await expect(experience.getByRole('tab',{name:'Take bookings',exact:true})).toBeFocused();
 await expect(experience.getByRole('tabpanel')).toHaveAttribute('data-scene','booking');
 await page.keyboard.press('End');await expect(experience.getByRole('tab',{name:'Stay in touch',exact:true})).toBeFocused();
 await page.keyboard.press('Home');await expect(first).toBeFocused();
 await experience.getByRole('tab',{name:'List what you sell',exact:true}).hover();
 await expect(experience.getByRole('tabpanel')).toHaveAttribute('data-scene','stock');
 await experience.getByRole('tabpanel').getByRole('link').click();await expect(page).toHaveURL(/\/product\/vehicles$/);
});
