import {test} from '@playwright/test'
import {cont} from './helpers'
test('shot',async({browser})=>{
  const page=await (await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})).newPage()
  await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('Marlowe & Finch')
  await cont(page,{keepLook:true});await page.waitForTimeout(1500)
  await page.screenshot({path:'docs/review/zz-f2-looks.png'})
  await page.getByRole('radio',{name:'Colours',exact:true}).check({force:true});await page.waitForTimeout(1500)
  await page.getByRole('radio',{name:'Black / ember'}).check({force:true});await page.waitForTimeout(1200)
  await page.screenshot({path:'docs/review/zz-f2-colours.png'})
})
