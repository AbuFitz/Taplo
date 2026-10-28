import {test} from '@playwright/test'
import {cont} from './helpers'
const SIZES:[number,number][]=[[1280,720],[1366,768],[1536,864],[1920,1080],[2560,1440],[3440,1440],[768,1024],[834,1194],[1024,768],[390,844]]
for (const [w,h] of SIZES) test(`size ${w}x${h}`,async({browser})=>{
  test.setTimeout(200000)
  const mob=w<1024
  const page=await (await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:mob,hasTouch:mob})).newPage()
  await page.goto('/onboarding',{waitUntil:'networkidle'});await page.getByLabel('Business name',{exact:true}).fill('Marlowe & Finch')
  await cont(page,{keepLook:true});await page.waitForTimeout(1200);await page.screenshot({path:`docs/review/zz-sz-${w}x${h}-look.png`})
  await page.getByRole('radio',{name:'Colours',exact:true}).check({force:true});await page.waitForTimeout(900);await page.screenshot({path:`docs/review/zz-sz-${w}x${h}-colours.png`})
})
