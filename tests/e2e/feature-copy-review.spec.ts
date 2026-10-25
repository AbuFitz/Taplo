import { expect, test } from '@playwright/test';
for (const width of [390, 1440]) {
  test(`product models keep their photo, price and shop destination together at ${width}`, async ({ page }) => {
    await page.setViewportSize({width, height:1000});
    await page.goto('/product/products');
    const demo=page.getByTestId('feature-demo-products');
    for(const [model,price,slug] of [
      ['F70 Pro','£125','thinkware-f70-pro-32gb-front-dash-cam'],
      ['Q200','£219','thinkware-q200-2k-front-rear-dash-cam-with-gps-mount'],
      ['X800','£249','thinkware-x800-2k-front-rear-dash-cam-with-touchscreen'],
    ]) {
      await demo.getByRole('radio',{name:model,exact:true}).check();
      await expect(demo.getByRole('heading',{name:`Thinkware ${model}`,exact:true})).toBeVisible();
      await expect(demo.getByText(price,{exact:true})).toBeVisible();
      await expect(demo.getByRole('link',{name:'View in shop'})).toHaveAttribute('href',`https://shop.fixnowmechanics.co.uk/shop/${slug}`);
      const img=demo.getByRole('img');
      await expect(img).toHaveAttribute('alt',new RegExp(model));
      await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
    }
    await expect(page.getByRole('navigation',{name:'Breadcrumb'})).toHaveCount(0);
  });
  test(`message illustrations stay coherent when switching states at ${width}`,async ({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.goto('/product/messages');
    const demo=page.getByTestId('feature-demo-messages');
    for (const [option,heading,text] of [
      ['Confirm','Booking confirmed.','Thursday at 11:30'],
      ['Remind','See you tomorrow.','tomorrow at 11:30'],
      ['Update','Booking updated.','Friday at 14:00'],
    ]) {
      await demo.getByRole('radio',{name:option,exact:true}).check();
      await expect(demo.getByRole('heading',{name:heading,exact:true})).toBeVisible();
      await expect(demo.locator('.feature-message-bubble')).toContainText(text);
      await expect(demo.locator('.feature-message-bubble')).toContainText('pottery workshop');
    }
    await expect(demo).not.toContainText(/Example message|Illustration|no message sent|connected delivery service/);
    await expect(page.getByRole('navigation',{name:'Breadcrumb'})).toHaveCount(0);
  });
}
