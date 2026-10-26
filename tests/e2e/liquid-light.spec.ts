import {test,expect} from "@playwright/test";

for(const width of [390,1440]) test(`the setup backdrop is one soft gradient field that stops for reduced motion at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:"no-preference"});
 await page.goto("/onboarding");
 const backdrop=page.getByTestId("setup-backdrop");
 await expect(backdrop.locator("canvas")).toHaveCount(1);
 await expect(backdrop).toHaveAttribute("data-tone",width<1024?"light":"dark");
 await page.emulateMedia({reducedMotion:"reduce"});await expect(backdrop.locator("canvas")).toHaveCount(0);
});

test("homepage field mounts independently and reacts within its section",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:"no-preference"});
 await page.goto("/");const section=page.locator(".home-design-field").first();await section.scrollIntoViewIfNeeded();
 const shader=section.getByTestId("liquid-light-canvas");await shader.locator("canvas").waitFor();
 await expect(section.locator(".liquid-light")).toHaveCSS("position","absolute");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:"reduce"});await expect(shader).toHaveCount(0);
});

test("setup remains usable when WebGL is unavailable",async({page})=>{
 await page.addInitScript(()=>{
   const original=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,kind:string,options?:unknown){return kind==="webgl2"?null:original.call(this,kind,options)} as typeof original;
 });
 await page.setViewportSize({width:390,height:844});await page.goto("/onboarding");
 await page.getByLabel("Business name",{exact:true}).fill("North Street Studio");
 await expect(page.locator(".setup-backdrop canvas")).toHaveCount(0);
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{level:1})).toHaveText("What do you do?");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
});
