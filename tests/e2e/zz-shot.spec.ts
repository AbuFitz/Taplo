import {test} from '@playwright/test'
import {cont} from './helpers'
test('shot',async({browser})=>{
  test.setTimeout(200000)
  const page=await (await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})).newPage()
  const snap=async(n:string)=>{await page.waitForTimeout(1500);await page.screenshot({path:`docs/review/zz-${n}.png`})}
  await page.goto('/onboarding',{waitUntil:'networkidle'});await page.getByLabel('Business name',{exact:true}).fill('Marlowe & Finch')
  await cont(page,{keepLook:true});await snap('looks')
  await page.getByRole('radio',{name:'Black / ember'}).check({force:true});await page.waitForTimeout(1500)
  await page.getByRole('radio',{name:'Colours',exact:true}).check({force:true});await snap('colours-top')
  await page.getByRole('radio',{name:'Wine'}).check({force:true});await snap('colours-wine')
  await cont(page);await cont(page);await cont(page);await page.getByRole('button',{name:'Skip for now'}).click();await page.getByRole('button',{name:'Skip for now'}).click();await snap('plan')
  await page.getByRole('radio',{name:'Choose Pro'}).check({force:true});await snap('plan-pro')
  await cont(page);await snap('review')
})
