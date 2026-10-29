import { cont, openDetails, openSection } from './helpers';
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'node:path'
import sharp from 'sharp'
import { openEditorWithSample, selectPart } from './helpers'

for(const width of [320,390,768,1440])test(`mobile-led setup has eight steps, a live page and reachable actions at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('North Street Barbers')
  const frame=page.frameLocator('[data-testid="setup-live-page"]')
  await expect(frame.getByRole('heading',{level:1})).toHaveText('North Street Barbers')
  await expect(page.getByRole('progressbar',{name:'Setup progress'})).toHaveAttribute('aria-valuemax','8')
  const next=()=>cont(page)
  await cont(page,{keepLook:true})
  await page.getByRole('radio',{name:'Paper'}).check({force:true})
  await expect(frame.locator('[data-taplo-page]')).toHaveAttribute('data-tone','light',{timeout:15000})
  await expect(frame.locator('[data-taplo-page]')).toHaveAttribute('data-motion',/none|subtle/)
  await next();await page.getByRole('button',{name:'Barber',exact:true}).click();await next()
  await page.getByRole('button',{name:'Book an appointment'}).click();await next()
  await page.getByRole('button',{name:'Booking requests',exact:true}).click()
  await openDetails(page);await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await next()
  await page.getByLabel('Service 1 name').fill('Haircut');await page.getByLabel('Service 1 price').fill('25');await page.getByLabel('Service 1 minutes').fill('30');await next()
  await expect(page.getByRole('heading',{level:1})).toHaveText('Room to grow.')
  await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&scrollY===0)).toBe(true)
  await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR??'test-results',`setup-six-${width}.png`)})
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  await page.reload();await expect(page.getByRole('heading',{level:1})).toHaveText('Room to grow.');await next()
  await expect(page.getByTestId('finish-step')).toBeVisible();await expect(page.getByRole('button',{name:/Publish/})).toHaveCount(0)
})
for(const width of [390,1440])test(`uploaded logo colours drive linked gradients, replacement and reload at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:950});await openEditorWithSample(page,'Barber');await selectPart(page,'page')
  await openSection(page,/^Look/)
  await page.getByRole('radiogroup',{name:'Look',exact:true}).locator('label[data-choice="quartz"]').click()
  await openSection(page,/^Fine-tune background/)
  await page.getByRole('radiogroup',{name:'Wallpaper',exact:true}).getByText('Gradient',{exact:true}).click()
  await page.getByLabel('Follow my logo').check()
  await selectPart(page,'header')
  const upload=async(color:string)=>{const buffer=await sharp({create:{width:240,height:120,channels:4,background:color}}).png().toBuffer();await page.locator('input[type="file"]').first().setInputFiles({name:'business-logo.png',mimeType:'image/png',buffer});await page.getByTestId('crop-dialog').getByRole('button',{name:'Use image',exact:true}).click()}
  await upload('#cc3311')
  const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  await expect.poll(async()=>(await read()).content.identity.logo.accent).toBeTruthy()
  const first=await read();expect(first.content.identity.logo.accent).toMatch(/^#[0-9a-f]{6}$/)
  await upload('#168548');await expect.poll(async()=>(await read()).content.identity.logo.accent).not.toBe(first.content.identity.logo.accent)
  await page.goto('/demo/preview');const root=page.locator('[data-taplo-page]');await expect(root).toHaveAttribute('data-motion','drift');const background=await page.locator('.tp-bg-gradient').evaluate(el=>getComputedStyle(el).backgroundImage)
  await page.reload();expect(await page.locator('.tp-bg-gradient').evaluate(el=>getComputedStyle(el).backgroundImage)).toBe(background)
})
test('a reduced visual viewport keeps the current input and continuation above the keyboard',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('North Street')
 await page.evaluate(()=>{Object.defineProperty(window.visualViewport!,'height',{configurable:true,get:()=>440});window.visualViewport!.dispatchEvent(new Event('resize'))})
 await expect(page.locator('.setup-flow')).toHaveAttribute('data-keyboard','true');await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport()
 const box=await page.getByRole('button',{name:'Continue',exact:true}).boundingBox();expect(box!.y+box!.height).toBeLessThanOrEqual(441)
 await expect(page.locator('.setup-canvas')).toBeHidden();await expect(page.getByLabel('Business name',{exact:true})).toHaveValue('North Street')
})
