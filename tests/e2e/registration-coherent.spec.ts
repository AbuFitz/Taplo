import {test,expect,type Page} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import path from "node:path";
const read=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('taplo.demo.v2')!));
const next=(page:Page)=>page.getByRole('button',{name:'Continue',exact:true}).click();
async function identity(page:Page){await page.getByLabel('Business name',{exact:true}).fill('North Street Studio');await page.getByLabel('Short description (optional)').fill('Independent studio in St Albans.');await next(page);await page.getByRole('button',{name:'Barber',exact:true}).click();await next(page);}
const shot=async(page:Page,name:string)=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));if(process.env.TAPLO_REVIEW_DIR)await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR,name),fullPage:false});};

for(const width of [320,390,768,1440])test(`registration identity has readable labels and quiet secondary actions at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/onboarding');
 await expect(page.getByTestId('sandbox-badge')).toHaveCount(0);await expect(page.getByRole('button',{name:'View full size'})).toHaveCount(0);
 await expect(page.getByLabel('Short description (optional)')).toHaveAttribute('placeholder',/Independent hair studio/);
 const label=page.locator('label').filter({hasText:/^Business name$/});expect(await label.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
 await expect(page.locator('.setup-avatar-picture')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await shot(page,`identity-${width}.png`);
});

for(const width of [390,1440])test(`complete setup preserves real content, appearance, plan and review edits at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/onboarding');await identity(page);
 await page.getByRole('button',{name:'Booking requests',exact:true}).click();await page.getByLabel('Website or booking link (optional)').fill('studio.example.com/book');await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await next(page);
 await page.getByLabel('Service 1 name').fill('Cut and finish');await page.getByLabel('Service 1 price').fill('35');await page.getByLabel('Service 1 minutes').fill('45');await next(page);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Your page, your style.');await page.getByRole('radio',{name:'Editorial',exact:true}).check();
 await page.getByRole('button',{name:/Background & colours/}).click();const style=page.getByTestId('setup-design-dialog');await style.getByRole('button',{name:'Smoke gradient',exact:true}).click();await style.getByRole('button',{name:'Done',exact:true}).click();
 await page.getByRole('button',{name:/Profile arrangement/}).click();await style.getByRole('button',{name:'Centered',exact:true}).click();await style.getByRole('button',{name:'Done',exact:true}).click();
 await shot(page,`design-${width}.png`);await next(page);await expect(page.getByRole('heading',{level:1})).toHaveText('Room to grow.');
 await expect(page.getByRole('radio',{name:'Choose Free',exact:true})).toBeEnabled();await page.getByRole('radio',{name:'Choose Pro',exact:true}).check();await expect(page.getByRole('radio',{name:'Choose Pro',exact:true})).toBeChecked();await shot(page,`plan-${width}.png`);
 await page.reload();await expect(page.getByRole('radio',{name:'Choose Pro',exact:true})).toBeChecked();await next(page);await expect(page.getByRole('heading',{level:1})).toHaveText('Review your page');
 let state=await read(page);expect(state.content.contacts.website).toBe('https://studio.example.com/book');expect(state.content.services[0]).toMatchObject({name:'Cut and finish',priceMinor:3500,durationMinutes:45});expect(state.page.appearance.layout.rhythm).toBe('editorial');expect(state.page.appearance.header.layout).toBe('centered');expect(state.page.appearance.background).toMatchObject({kind:'gradient',motion:true,source:'logo'});expect(state.setupDrafts.planIntent).toBe('pro');expect(state.plan).toBe('business');
 await page.getByRole('button',{name:/Business name and image/}).click();await page.getByLabel('Business name',{exact:true}).fill('North Street Collective');await page.reload();await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Review your page');
 await page.getByRole('button',{name:'Publish my page',exact:true}).click();state=await read(page);expect(state.published.content.identity.name).toBe('North Street Collective');expect(state.published.content.services[0].name).toBe('Cut and finish');
 const frame=page.frameLocator('iframe[data-testid="setup-live-page"]');await expect(frame.getByRole('heading',{level:1})).toHaveText('North Street Collective');
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);await shot(page,`review-${width}.png`);
});

for(const width of [390,1440])test(`logo is confirmed first, keeps alpha, and reopens directly in frameless crop at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/onboarding');
 const buffer=await sharp({create:{width:1000,height:300,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:Buffer.from('<svg width="1000" height="300"><rect x="200" y="60" width="600" height="180" fill="#222"/></svg>')}]).png().toBuffer();
 const input=page.getByLabel('Add your logo or profile photo: upload a picture');await input.setInputFiles({name:'logo.png',mimeType:'image/png',buffer});const crop=page.getByTestId('crop-dialog');await expect(crop).toBeVisible();expect((await read(page))?.content.identity.logo).toBeUndefined();await crop.getByRole('button',{name:'Cancel',exact:true}).click();expect((await read(page))?.content.identity.logo).toBeUndefined();
 await input.setInputFiles({name:'logo.png',mimeType:'image/png',buffer});await expect(crop.getByTestId('crop-apply')).toBeEnabled();await shot(page,`logo-popup-${width}.png`);await crop.getByRole('button',{name:'Use image',exact:true}).click();await expect.poll(async()=>(await read(page))?.content.identity.logo?.width).toBe(640);
 const logo=(await read(page)).content.identity.logo;const pixels=await sharp(Buffer.from(logo.src.split(',')[1],'base64')).ensureAlpha().raw().toBuffer();expect(pixels[3]).toBe(0);expect(logo.height).toBe(192);
 await page.getByRole('button',{name:'Edit image: Add your logo or profile photo',exact:true}).click();await expect(crop).toBeVisible();await expect(page.getByTestId('image-edit-dialog')).toHaveCount(0);await crop.getByRole('button',{name:'Crop photo',exact:true}).click();await crop.getByRole('slider',{name:'Zoom',exact:true}).fill('1.5');await crop.getByRole('button',{name:'Round preview',exact:true}).click();await crop.getByRole('button',{name:'Use this crop',exact:true}).click();await expect.poll(async()=>(await read(page)).page.appearance.header.avatarShape).toBe('circle');
});

test('website-only setup is valid, unsafe links and invalid contact drafts stay blocked across reload',async({page})=>{
 await page.goto('/onboarding');await identity(page);await page.getByRole('button',{name:'Links & enquiries',exact:true}).click();const web=page.getByLabel('Website or booking link (optional)');await web.fill('javascript:alert(1)');await next(page);await expect(page.getByRole('heading',{level:1})).toHaveText('Connect your business.');await page.reload();await expect(web).toHaveValue('javascript:alert(1)');await web.fill('brightlearn.co.uk');await next(page);await expect(page.getByTestId('first-services')).toBeVisible();expect((await read(page)).content.contacts.website).toBe('https://brightlearn.co.uk');
});

test('a short keyboard viewport scrolls fields without a scrollbar or moving the action',async({page})=>{
 await page.setViewportSize({width:390,height:900});await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('Corner Studio');await page.setViewportSize({width:390,height:480});await expect(page.locator('.setup-flow')).toHaveAttribute('data-keyboard','true');
 const body=page.locator('.setup-step-body');await expect(body).toHaveCSS('scrollbar-width','none');await page.getByLabel('Short description (optional)').fill('Independent studio.');await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeInViewport();expect(await page.evaluate(()=>scrollY)).toBe(0);
});

test('message and call choices remain selected before details exist and reject mismatched channels',async({page})=>{
 await page.goto('/onboarding');await identity(page);await page.getByRole('button',{name:'Messages',exact:true}).click();await expect(page.getByRole('button',{name:'Messages',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByLabel('Website or booking link (optional)').fill('studio.example.com');await next(page);await expect(page.locator('#why-disabled')).toContainText('email or WhatsApp');
 await page.getByLabel('Email',{exact:true}).fill('owner@example.com');await next(page);await expect(page.getByTestId('first-services')).toBeVisible();await page.getByRole('button',{name:'Back',exact:true}).click();await expect(page.getByLabel('Website or booking link (optional)')).toHaveValue('https://studio.example.com');
});

test('corrupt images cannot be applied and cancellation leaves the page unchanged',async({page})=>{
 await page.goto('/onboarding');await page.getByLabel('Business name',{exact:true}).fill('Image Test Studio');await page.getByLabel('Add your logo or profile photo: upload a picture').setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not a decoded image')});const crop=page.getByTestId('crop-dialog');await expect(crop.getByRole('alert')).toContainText('could not be opened');await expect(crop.getByTestId('crop-apply')).toBeDisabled();await crop.getByRole('button',{name:'Cancel',exact:true}).click();expect((await read(page)).content.identity.logo).toBeUndefined();
});
