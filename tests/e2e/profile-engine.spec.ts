import { test, expect } from "@playwright/test"
import { openSection } from "./helpers"
import AxeBuilder from "@axe-core/playwright"
import sharp from "sharp"
import path from "node:path"
import { openEditorWithSample, previewFrame, selectPart, insp, openRow } from "./helpers"

const review = process.env.TAPLO_REVIEW_DIR ?? 'test-results'
for (const width of [320, 390, 1440]) for (const layout of ['side', 'centered', 'banner']) for (const look of ['service', 'ink']) test(`${layout} profile is readable with ${look} at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const o = { header: { layout, align: 'left' }, layout: { desktop: 'centered' } }
  await page.goto(`/appearance/frame?scenario=station&look=${look}&o=${encodeURIComponent(JSON.stringify(o))}`)
  await expect(page.locator('.tp-header')).toHaveAttribute('data-layout', layout)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jay’s Barbers')
  await expect(page.getByRole('button', { name: 'Book a haircut', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()
  expect(result.violations.map(v => ({ id:v.id, nodes:v.nodes.map(n=>n.target) }))).toEqual([])
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(review, `${layout}-${look}-${width}.png`), fullPage: true })
})
for (const width of [390, 1440]) for (const treatment of ['inline', 'soft', 'raised', 'spotlight']) for (const look of ['service', 'ink']) test(`${treatment} section adapts to ${look} at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 })
  await page.emulateMedia({ reducedMotion:'reduce' })
  await page.goto(`/appearance/frame?scenario=station&look=${look}&widget=priceMenu&treatment=${treatment}`)
  await expect(page.locator('[data-widget="priceMenu"]')).toContainText('Haircut')
  await expect(page.locator('[data-widget]')).toHaveCount(1)
  const card = page.locator('.tp-card').first()
  if (treatment === 'inline') expect(await card.evaluate(el=>getComputedStyle(el).padding)).toBe('0px')
  if (treatment === 'spotlight') expect(await card.evaluate(el=>getComputedStyle(el).borderTopWidth)).toBe('0px')
  const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  await page.screenshot({ path:path.join(review,`section-${treatment}-${look}-${width}.png`), fullPage:true })
})
for (const width of [390,1440]) test(`transparent wide logo keeps its full composition, works on black, and survives a profile change at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width,height:950 })
  await openEditorWithSample(page,'Barber')
  await selectPart(page,'page')
  await openSection(page,/^Look/)
  await page.getByRole('radiogroup',{name:'Look',exact:true}).locator('label[data-choice="noir"]').click()
  await selectPart(page,'header')
  await insp(page).locator('summary').filter({hasText:/^Logo and cover/}).click()
  const buffer=await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300"><path fill="#111111" d="M20 100h1160v100H20z"/></svg>')).png().toBuffer()
  await page.getByLabel('Logo or profile picture: upload a picture').setInputFiles({name:'wide-mark.png',mimeType:'image/png',buffer})
  await page.getByTestId("crop-dialog").getByRole("button", {name:"Use image",exact:true}).click();
  await expect(page.getByTestId('crop-dialog')).toHaveCount(0)
  const logo=previewFrame(page).locator('.tp-header .tp-logo')
  await expect(logo).toHaveAttribute('data-ink','dark')
  expect(await logo.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)')
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.identity.logo)
  expect(stored).toMatchObject({width:640,height:160,ink:'dark'})
  expect(stored.src).toMatch(/^data:image\/png/)
  const alpha=await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);return ctx.getImageData(0,0,1,1).data[3]},stored.src)
  expect(alpha).toBe(0)
  const coverBuffer=await sharp({create:{width:600,height:900,channels:3,background:'#777777'}}).jpeg().toBuffer()
  await page.getByLabel('Cover picture: upload a picture').setInputFiles({name:'portrait-work.jpg',mimeType:'image/jpeg',buffer:coverBuffer})
  await page.getByTestId("crop-dialog").getByRole("button", {name:"Use image",exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.identity.heroImage?.height)).toBe(900)
  await expect(page.getByTestId('crop-dialog')).toHaveCount(0)
  const cover=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.identity.heroImage)
  expect(cover).toMatchObject({width:600,height:900})
  await page.getByRole('radiogroup',{name:'Header arrangement',exact:true}).locator('label[data-choice="split"]').click()
  await expect(previewFrame(page).locator('.tp-header')).toHaveAttribute('data-layout','split')
  await expect(logo).toHaveAttribute('data-ink','dark')
  await page.getByTestId('undo').click()
  await expect(previewFrame(page).locator('.tp-header')).not.toHaveAttribute('data-layout','centered')
  await page.getByTestId('redo').click()
  await page.reload()
  await expect(previewFrame(page).locator('.tp-header')).toHaveAttribute('data-layout','centered')
  const next=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).content.identity.logo)
  expect(next).toEqual(stored)
})

for (const width of [390,1440]) test(`section recipes update only their panel, undo, and persist at ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:950})
  await page.goto('/dashboard')
  await page.getByRole('button',{name:'Try Jay’s Barbers',exact:true}).click()
  await page.waitForURL('**/dashboard/page')
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  await openRow(page,'priceMenu')
  await insp(page).getByRole('tab',{name:/^Appearance(?: · \d+)?$/}).click()
  await page.getByRole('radiogroup',{name:'Section treatment',exact:true}).locator('label[data-choice="soft"]').click()
  await page.getByRole('radiogroup',{name:'Section treatment',exact:true}).locator('label[data-choice="spotlight"]').click()
  const section=previewFrame(page).locator('[data-widget="priceMenu"]')
  await expect(section).toHaveAttribute('data-featured','true')
  expect(await section.locator('.tp-card').evaluate(el=>getComputedStyle(el).borderTopWidth)).toBe('0px')
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!))
  expect(after.content).toEqual(before.content)
  expect(after.page.widgets.filter((w:{type:string})=>w.type!=='priceMenu')).toEqual(before.page.widgets.filter((w:{type:string})=>w.type!=='priceMenu'))
  await page.getByTestId('undo').click()
  await expect(section).not.toHaveAttribute('data-featured','true')
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).page.widgets.find((w:{type:string})=>w.type==='priceMenu').appearance.surface)).toBe('soft')
  await page.getByTestId('undo').click()
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).page.widgets.find((w:{type:string})=>w.type==='priceMenu').appearance)).toEqual(before.page.widgets.find((w:{type:string})=>w.type==='priceMenu').appearance)
  await page.getByTestId('redo').click()
  await page.getByTestId('redo').click()
  await page.reload()
  await expect(previewFrame(page).locator('[data-widget="priceMenu"]')).toHaveAttribute('data-featured','true')
})

for (const width of [320,1440]) for (const layout of ['banner','centered']) test(`${layout} has no empty photo space with a long name at ${width}`, async ({page})=>{
  await page.setViewportSize({width,height:844})
  await openEditorWithSample(page,'Barber')
  const name='North Street Barbering and Independent Grooming Studio'
  await page.evaluate(({name,layout})=>{
    const state=JSON.parse(localStorage.getItem('taplo.demo.v2')!)
    state.content.identity.name=name
    delete state.content.identity.heroImage
    delete state.content.identity.logo
    state.page.themeId='service'
    state.page.appearance={header:{layout,avatarShape:'none'}}
    localStorage.setItem('taplo.demo.v2',JSON.stringify(state))
  },{name,layout})
  await page.goto('/demo/preview')
  await expect(page.getByRole('heading',{level:1})).toHaveText(name)
  await expect(page.locator('.tp-profile-photo')).toHaveCount(0)
  expect(await page.locator('.tp-header').evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(500)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

for (const look of ['service','ink']) for (const fill of ['solid','outline','soft']) test(`${fill} buttons stay readable when hovered inside ${look} spotlight panels`,async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.emulateMedia({reducedMotion:'reduce'})
  const overrides=encodeURIComponent(JSON.stringify({buttons:{fill}}))
  await page.goto(`/appearance/frame?scenario=rowan&look=${look}&widget=featuredService&treatment=spotlight&o=${overrides}`)
  const button=page.locator('.tp-card .tp-btn').first()
  await expect(button).toBeVisible()
  await button.hover()
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
})
