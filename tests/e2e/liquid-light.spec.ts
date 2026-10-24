import {test,expect} from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

for(const width of [390,1440]) test(`light moves autonomously without following pointer or touch at ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:"no-preference"});
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/onboarding");
 const shader=page.getByTestId("setup-backdrop").getByTestId("liquid-light-canvas");
 await shader.locator("canvas").waitFor();
 await expect.poll(()=>shader.evaluate(el=>Boolean((el as HTMLElement&{paperShaderMount?:unknown}).paperShaderMount))).toBe(true);
 const pixels=async()=>sharp(await page.screenshot({clip:{x:0,y:110,width:18,height:400}})).raw().toBuffer();
 const delta=(a:Buffer,b:Buffer)=>a.reduce((count,value,i)=>count+Number(value!==b[i]),0);
 await shader.evaluate(el=>(el as HTMLElement&{paperShaderMount:{setSpeed:(v:number)=>void;setFrame:(v:number)=>void}}).paperShaderMount.setSpeed(0));
 await page.mouse.move(8,220);await page.waitForTimeout(450);const a=await pixels();
 await page.mouse.move(width*.85,700);await page.waitForTimeout(450);const b=await pixels();
 const pointerDelta=delta(a,b);expect(pointerDelta).toBe(0);
 await expect(shader).toHaveCSS("transform","none");
 await expect(shader.locator("canvas")).toHaveCSS("transform","none");
 const size=await shader.locator("canvas").evaluate(el=>({width:(el as HTMLCanvasElement).width,height:(el as HTMLCanvasElement).height}));
 expect(size.width*size.height).toBeLessThanOrEqual((width<1024?240000:650000)*1.01);
 await shader.evaluate(el=>(el as HTMLElement&{paperShaderMount:{setSpeed:(v:number)=>void}}).paperShaderMount.setSpeed(1));
 const c=await pixels();await page.waitForTimeout(650);const d=await pixels();const autonomousDelta=delta(c,d);expect(autonomousDelta).toBeGreaterThan(100);
 await page.emulateMedia({reducedMotion:"reduce"});await expect(shader).toHaveCount(0);
 const e=await pixels();await page.waitForTimeout(500);const f=await pixels();const reducedDelta=delta(e,f);expect(reducedDelta).toBe(0);
 expect(errors).toEqual([]);
 const out=process.env.TAPLO_REVIEW_DIR??info.outputDir;await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,`light-proof-${width}.json`),JSON.stringify({width,pointerDelta,autonomousDelta,reducedDelta,canvas:size,errors},null,2));
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
