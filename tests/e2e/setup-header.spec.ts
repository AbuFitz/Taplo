import {expect,test} from '@playwright/test'
import path from 'node:path'
for(const width of [320,390,768,1440])test(`setup gives the phone canvas back to the business at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/onboarding')
  const brand=page.getByRole('link',{name:'Taplo home',exact:true})
  await expect(brand).toHaveCount(0)
  await expect(page.getByRole('progressbar',{name:'Setup progress'})).toHaveAttribute('aria-valuenow','1');await expect(page.getByRole('navigation',{name:'Progress'})).not.toContainText('Step 1 of 6')
  const canvas=page.locator('.setup-workspace > aside')
  if(width<1024)expect((await canvas.boundingBox())!.y).toBeLessThan(70)
  await page.getByTestId('sandbox-badge').click()
  await expect(page.getByText('Not connected yet',{exact:true})).toBeVisible();await page.keyboard.press('Escape')
  await page.getByLabel('Business name',{exact:true}).fill('North Street Barbers')
  await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('button',{name:'Barber',exact:true})).toBeInViewport()
  await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport()
  await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR??'test-results',`compact-setup-header-${width}.png`)})
})

for(const width of[390,1440])test(`starting-design and plan context never displace the current question at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/onboarding?from=jays-barbers&plan=pro')
  await page.getByLabel('Business name',{exact:true}).fill('North Street Barbers');await page.getByRole('button',{name:'Continue',exact:true}).click()
  await page.getByRole('button',{name:'Barber',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
  await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click()
  await page.getByLabel('Service 1 name').fill('Haircut');await page.getByLabel('Service 1 price').fill('25');await page.getByLabel('Service 1 minutes').fill('30');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
  const title=page.getByRole('heading',{name:'Review your page',exact:true});await expect(title).toBeInViewport({ratio:1})
  const titleBox=(await title.boundingBox())!,bodyBox=(await page.locator('.setup-step-body').boundingBox())!;expect(bodyBox.y).toBeGreaterThanOrEqual(titleBox.y+titleBox.height)
  await page.getByRole('button',{name:'Customise my page',exact:true}).click();await expect(page.getByTestId('my-page')).toBeVisible()
})

test('the form scrolls without shrinking fields or moving Continue, and the top stays minimal',async({page})=>{
  await page.setViewportSize({width:390,height:650});await page.goto('/onboarding');
  await expect(page.getByRole('navigation',{name:'Progress'})).not.toContainText('Your business');
  await page.getByLabel('Business name',{exact:true}).fill('The Corner Studio');
  const form=page.locator('.setup-step-body');
  expect(await form.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
  const input=page.getByLabel('Business name',{exact:true});expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  await form.hover();await page.mouse.wheel(0,200);await expect.poll(()=>form.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>scrollY)).toBe(0);await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport();
  await expect(page.locator('.setup-canvas [data-preview-mode="device"]')).toHaveCount(1);
  await page.getByRole('button',{name:'View full size',exact:true}).click();
  const full=page.getByTestId('setup-full-preview');await expect(full.frameLocator('iframe').getByRole('heading',{level:1})).toHaveText('The Corner Studio');
  await full.getByRole('button',{name:'Close',exact:true}).click();await expect(input).toHaveValue('The Corner Studio');
});
