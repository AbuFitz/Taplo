import {expect,test} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'node:path'
import {openEditorWithSample} from './helpers'

for(const width of [320,390,768,1440])test(`paired gallery images fit the viewport, compare, zoom and return focus at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'})
  await openEditorWithSample(page)
  await page.evaluate(()=>{
    const s=JSON.parse(localStorage.getItem('taplo.demo.v2')!)
    const gallery=s.content.gallery
    gallery[0].beforeImage={...gallery[1].image,alt:'Before comparison photograph'}
    gallery[0].image.alt='After comparison photograph'
    s.page.widgets.find((w:{type:string})=>w.type==='gallery').settings.variant='beforeAfter'
    localStorage.setItem('taplo.demo.v2',JSON.stringify(s))
  })
  await page.goto('/demo/preview')
  const before=page.getByTestId('gallery-open').filter({has:page.locator('img[src]')}).first()
  await before.click();const box=page.getByTestId('lightbox');await expect(box).toBeVisible()
  await expect(box.getByRole('button',{name:'Before',exact:true})).toHaveAttribute('aria-pressed','true')
  const image=box.getByRole('img',{name:'Before comparison photograph'})
  await expect(image).toBeInViewport({ratio:1})
  await expect(box.getByRole('button',{name:'Zoom to full size'})).toBeInViewport({ ratio: 0.99 })
  await box.getByRole('button',{name:'After',exact:true}).click()
  await expect(box.getByRole('img',{name:'After comparison photograph'})).toBeInViewport({ratio:1})
  await box.getByRole('button',{name:'Zoom to full size'}).click()
  await expect(box.getByRole('button',{name:'Fit to screen'})).toBeInViewport({ ratio: 0.99 })
  await box.getByRole('button',{name:'Fit to screen'}).click()
  await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR??'test-results',`gallery-compare-${width}.png`)})
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  await page.keyboard.press('ArrowRight');await expect(box).toContainText('2 of 3');await expect(box.getByRole('button',{name:'Before',exact:true})).toHaveCount(0)
  await page.keyboard.press('Escape');await expect(before).toBeFocused()
})

test('collections measure actual gaps and visible items, support Home/End, and hide redundant controls',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/appearance/frame?scenario=barber&look=night&widget=gallery&variant=carousel')
  const collection=page.locator('.tp-collection').first();const track=collection.locator('.tp-collection-track')
  await expect(collection).toBeVisible();await track.evaluate(el=>{el.style.gap='37px'})
  await expect(collection).toHaveAttribute('data-overflow','true')
  await collection.getByRole('button',{name:/Next in/}).click()
  await expect.poll(()=>track.evaluate(el=>{const b=el.getBoundingClientRect();const pad=parseFloat(getComputedStyle(el).scrollPaddingInlineStart);const child=el.children[1].getBoundingClientRect();return Math.abs(child.left-b.left-pad)})).toBeLessThan(3)
  await track.focus();await page.keyboard.press('End');await expect(collection).toHaveAttribute('data-end','true')
  await page.keyboard.press('Home');await expect(collection).toHaveAttribute('data-start','true')
  const counter=await collection.locator('.tp-collection-count').innerText();expect(counter).toMatch(/^1(?: to 2)? of 3$/)
  await page.setViewportSize({width:1440,height:900})
  // Owner-sized cards that fit should not advertise scrolling controls.
  await track.evaluate(el=>{Array.from(el.children).forEach(child=>(child as HTMLElement).style.flex='1 1 0')})
  await expect(collection).not.toHaveAttribute('data-overflow','true');await expect(collection.locator('.tp-collection-bar')).toBeHidden()
})

for(const width of[390,1440])test(`team profile keeps its booking action reachable and hands over one overlay at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:700});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/appearance/frame?scenario=station',{waitUntil:'networkidle'})
  await page.getByTestId('team-card').first().getByRole('button',{name:/View profile/}).click()
  const profile=page.getByTestId('team-profile');const book=profile.getByRole('button',{name:/Book with/})
  await expect(book).toBeInViewport({ratio:1})
  await profile.locator('[data-overlay-body]').evaluate(el=>el.scrollTop=el.scrollHeight)
  await expect(book).toBeInViewport({ratio:1})
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR??'test-results',`team-detail-${width}.png`)})
  await book.click();await expect(profile).toBeHidden();await expect(page.getByTestId('booking-flow')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(1)
})
