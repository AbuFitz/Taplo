import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

for (const width of [320,390,768,1440]) test(`flat booking section and desktop navigation at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  const section=page.getByTestId("home-booking");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveCSS("background-color","rgb(255, 255, 255)");
  await expect(section.locator("canvas,.liquid-light,[data-testid=mono-field]")).toHaveCount(0);
  await expect(section.getByRole("heading")).toContainText("Less back and forth.");
  await expect(section.getByRole("link",{name:"Try a booking"})).toHaveAttribute("href","/product/booking#try-booking");
  await expect(section.getByRole("link",{name:"Open demo"})).toHaveAttribute("href","/inspiration/hollin-physio");
  await expect(section.getByRole("img")).toHaveAttribute("src",/booking-clinic-time/);
  const header=page.getByRole("banner");
  if(width>=768){
    await expect(header.getByRole("button",{name:"Menu",exact:true})).toBeHidden();
    const nav=page.getByRole("navigation",{name:"Primary"});
    await expect(nav.getByRole("link",{name:"How it works",exact:true})).toBeVisible();
    await nav.getByRole("button",{name:"Designs",exact:true}).focus();
    await page.keyboard.press("Enter");
    await expect(nav.getByRole("link",{name:"Car dealers and garages",exact:true})).toHaveAttribute("href","/inspiration?industry=motoring");
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("button",{name:"Designs",exact:true})).toBeFocused();
  }else{
    await header.getByRole("button",{name:"Menu",exact:true}).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(header.getByRole("button",{name:"Menu",exact:true})).toBeFocused();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).include("[data-testid=home-booking]").analyze();
  expect(result.violations).toEqual([]);
  await page.mouse.move(width-5,895);
  await page.evaluate(()=>{const section=document.querySelector('[data-testid=home-booking]')!;window.scrollTo(0,section.getBoundingClientRect().top+scrollY-90)});
  await page.screenshot({path:path.join(process.env.TAPLO_REVIEW_DIR??"test-results",`home-booking-${width}.png`),fullPage:false});
});

for (const width of [390, 1440]) test(`continuous product reveal respects reduced motion at ${width}`, async ({ page }) => {
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/')
  const story=page.getByTestId('cinematic-film');await story.scrollIntoViewIfNeeded();await expect(story.locator('video')).toHaveCount(0)
  await expect(story).toHaveAttribute('data-running','false');await expect(story.getByRole('link',{name:'Explore Taplo after the product animation'})).toHaveAttribute('href','/product')
  await expect(page.getByText('Read the film',{exact:true})).toHaveCount(0)
})

test("mobile menu closes cleanly when desktop navigation takes over",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await page.getByRole("button",{name:"Menu",exact:true}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({width:1024,height:900});
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Product",exact:true})).toBeFocused();
});
