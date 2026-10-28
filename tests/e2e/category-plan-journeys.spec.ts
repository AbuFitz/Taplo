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
  const search=page.getByLabel('Business type',{exact:true});await search.fill(category.label);
  await page.getByRole('button',{name:category.label,exact:true}).click();
  if(category.id==='other')await page.getByLabel('Describe your business',{exact:true}).fill('Independent studio');
  await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
  await openDetails(page);await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.getByRole('heading',{level:1}),category.id).toHaveText(setupJourney(category.id).heading);
  if(setupJourney(category.id).kind==='service')await expect(page.getByLabel('Service 1 name')).toHaveAttribute('placeholder',category.suggestedServices[0]?.name??'e.g. Initial consultation');
  await expect(page.getByRole('button',{name:'Skip for now',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),category.id).toBe(true);
 }
});
for (const width of [320,390,1440]) test(`plans are a compact comparison with an honest preference at ${width}`,async({page})=>{
 test.setTimeout(180_000);
 await page.setViewportSize({width,height:900});await page.goto('/onboarding?from=hollin-physio');await page.getByLabel('Business name',{exact:true}).fill('North Clinic');
 await cont(page);await cont(page);await cont(page);
 await openDetails(page);await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Skip for now',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Room to grow.');
 await expect(page.locator('.setup-panel').locator('.plan-experience, .plan-scene-profile, .phone-shell, [data-testid="setup-plans"] svg, [data-testid="setup-plans"] img')).toHaveCount(0);
 await expect(page.getByRole('button',{name:/See how it looks/i})).toHaveCount(0);
 await expect(page.getByTestId('setup-plans')).not.toContainText(/theme/i);
 await expect(page.getByTestId('plan-disclosure')).toContainText('provisional');
 await expect(page.getByTestId('plan-disclosure')).toContainText('no payment is taken');
 for(const plan of PLAN_IDS){
  const name=plan==='free'?'Free':plan==='core'?'Core':plan==='pro'?'Pro':'Business';
  await page.getByRole('radio',{name:`Choose ${name}`,exact:true}).check({force:true});
  await expect(page.getByRole('radio',{name:`Choose ${name}`,exact:true})).toBeChecked();
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.getByRole('radio',{name:`Choose ${name}`,exact:true})).toBeChecked();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!).setupDrafts?.planIntent ?? 'free')).toBe(plan);
 }
 await page.getByRole('radio',{name:'Choose Free',exact:true}).check({force:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);
});
