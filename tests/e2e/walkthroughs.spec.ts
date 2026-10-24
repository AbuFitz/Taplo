import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for(const width of[390,1440])test(`walkthroughs respond to motion preferences and keyboard selection at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/how-it-works');const guide=page.getByTestId('walkthroughs');await guide.scrollIntoViewIfNeeded();await expect(guide.locator('video')).toHaveCount(0)
 await guide.getByRole('button',{name:/Book a haircut/}).focus();await page.keyboard.press('Enter');await expect(guide.getByRole('button',{name:/Book a haircut/})).toHaveAttribute('aria-pressed','true')
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>v.id)).toEqual([])
 await page.emulateMedia({reducedMotion:'no-preference'});const video=guide.getByTestId('walkthrough-video');await expect(video).toHaveCount(1);await expect(video.locator('source')).toHaveAttribute('src','/marketing/walkthroughs/booking.mp4');expect(await video.evaluate((v:HTMLVideoElement)=>({muted:v.muted,controls:v.controls,loop:v.loop}))).toEqual({muted:true,controls:false,loop:true})
})
