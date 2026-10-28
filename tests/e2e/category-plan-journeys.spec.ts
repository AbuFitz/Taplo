import { cont, openDetails } from './helpers';
import {test,expect} from '@playwright/test';
import {INDUSTRY_PRESETS} from '../../src/features/themes/presets/industries';
import {setupJourney} from '../../src/features/demo/setup-journey';
import {PLAN_IDS} from '../../src/features/subscriptions/plans';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390,1440]) test(`every category reaches its own first content at ${width}`,async({page})=>{
 test.setTimeout(540_000);
 await page.setViewportSize({width,height:900});
 for(const category of INDUSTRY_PRESETS){
  await page.goto('/onboarding');await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});
  await page.getByLabel('Business name',{exact:true}).fill('North Studio');await cont(page);
  const search=page.getByLabel('Search businesses',{exact:true});await search.fill(category.label);
  await page.getByRole('button',{name:category.label,exact:true}).click();
  if(category.id==='other')await page.getByLabel('Describe your business',{exact:true}).fill('Independent studio');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await openDetails(page);await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.getByRole('heading',{level:1}),category.id).toHaveText(setupJourney(category.id).heading);
  if(setupJourney(category.id).kind==='service')await expect(page.getByLabel('Service 1 name')).toHaveAttribute('placeholder',category.suggestedServices[0]?.name??'e.g. Initial consultation');
  await expect(page.getByRole('button',{name:'Skip for now',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),category.id).toBe(true);
 }
});
for (const width of [320,390,1440]) test(`plan illustrations are optional, accessible and preserve every preference at ${width}`,async({page})=>{
 test.setTimeout(180_000);
 await page.setViewportSize({width,height:900});await page.goto('/onboarding?from=hollin-physio');await page.getByLabel('Business name',{exact:true}).fill('North Clinic');
 // Reach the plan through the real setup; existing website remains optional.
 await cont(page);await cont(page);
 await openDetails(page);await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Skip for now',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
 for(const plan of PLAN_IDS){
  await page.getByRole('radio',{name:`Choose ${plan==='free'?'Free':plan==='core'?'Core':plan==='pro'?'Pro':'Business'}`,exact:true}).check();
  await page.locator('.plan-experience button').click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('no payment is taken');await expect(dialog.locator('.plan-scene-profile')).toContainText('North Clinic');
  await dialog.getByRole('button',{name:/^Keep /}).click();await expect(dialog).toBeHidden();
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('.setup-plan-choice[data-selected=true] input')).toBeChecked();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).setupDrafts.planIntent)).toBe(plan);
 }
 await page.getByRole('radio',{name:'Choose Free',exact:true}).check();await page.locator('.plan-experience button').click();await page.getByRole('button',{name:'Explore Core · £9.99/month',exact:true}).click();await expect(page.getByRole('radio',{name:'Choose Core',exact:true})).toBeChecked();
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('.plan-experience .plan-scene-float').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.waitForTimeout(500);const findings=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(findings.violations.filter(v=>v.impact==='serious'||v.impact==='critical').map(v=>v.id+':'+v.nodes.map(n=>n.target.join()).join('|'))).toEqual([]);
 await page.screenshot({path:`work/theme-production-review/contextual-plan-${width}.png`});
});
