import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [320,390,768,1440]) for(const slug of ['fixnowmechanics','brightlearn']) {
 test(`${slug} uses functional source content and lifted blocks at ${width}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width,height:1000});await page.goto(`/${slug}`);
  await expect(page.locator('[data-taplo-ready=true]')).toHaveCount(1);
  await expect(page.getByRole('heading',{level:1})).toHaveText(slug==='brightlearn'?'BrightLearn Tutoring':'FixNow Mechanics');
  await expect(page.locator('.tp-header')).toHaveCSS('box-shadow',/rgba|rgb/);
  if(slug==='brightlearn'){
   await expect(page.getByRole('link',{name:'Ask about an introduction',exact:true})).toHaveAttribute('href','https://wa.me/447577702613');
   const services=page.getByTestId('service-open');await expect(services).toHaveCount(6);
   await expect(services.first()).toContainText('£40 per month');
   await services.first().click();
   const detail=page.getByTestId('service-detail');await expect(detail).toContainText('£40 per month');
   await expect(detail.getByRole('img',{name:'KS2 maths programme illustration'})).toHaveCSS('object-fit','contain');
   await expect.poll(()=>detail.getByRole('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
   await expect(detail.getByRole('link',{name:'View programme'})).toHaveAttribute('href','https://www.brightlearntutoring.co.uk/ks2-maths-confidence-sats-preparation');
   await expect(detail.getByRole('textbox')).toHaveCount(0);
   await page.keyboard.press('Escape');await expect(services.first()).toBeFocused();
  }else{
   await expect(page.getByRole('link',{name:/^Get a quote/}).first()).toHaveAttribute('href','https://www.fixnowmechanics.co.uk/estimate');
   await page.getByTestId('service-open').first().click();
   const detail=page.getByTestId('service-detail');await expect(detail).toContainText('£45');
   await expect(detail.getByRole('link',{name:'Get a quote',exact:true})).toHaveAttribute('href','https://www.fixnowmechanics.co.uk/estimate');
   await expect(detail.getByRole('textbox')).toHaveCount(0);await page.keyboard.press('Escape');
   await expect(page.getByRole('link',{name:/^View in shop: Thinkware F70/})).toHaveAttribute('href',/shop.fixnowmechanics.co.uk\/shop\/thinkware-f70/);
   await expect(page.getByRole('link',{name:'FixNow on Google',exact:true})).toHaveAttribute('href','https://share.google/9KkDSrnHkdPoeQLMl');
  }
  await page.getByRole('button',{name:'Share page',exact:true}).click();
  await expect(page.getByLabel('Page link',{exact:true})).toHaveValue(new RegExp(`/${slug}$`));
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('share-panel')).toBeHidden();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content',await page.locator('[data-taplo-page]').evaluate(el=>getComputedStyle(el).getPropertyValue('--tp-background').trim()));
  expect(errors).toEqual([]);
 });
}
