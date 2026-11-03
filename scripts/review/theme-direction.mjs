import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import sharp from 'sharp';
const out='work/theme-direction-review';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
const examples=['physio','brookfield','corner','sora','maya'];
for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:950},deviceScaleFactor:1,reducedMotion:'reduce'});const page=await context.newPage();
 for(const scenario of examples){await page.goto(`${process.env.BASE_URL??'http://localhost:3174'}/appearance/frame?scenario=${scenario}`);await page.evaluate(()=>document.fonts.ready);await page.locator('h1').waitFor();await page.screenshot({path:`${out}/${scenario}-${width}.png`});}
 await context.close();
}
const images=await Promise.all(examples.map(async(name)=>({input:await sharp(`${out}/${name}-390.png`).resize(312,760).toBuffer(),left:examples.indexOf(name)*328+16,top:16})));
await sharp({create:{width:examples.length*328+16,height:792,channels:4,background:'#171717'}}).composite(images).png().toFile(`${out}/homepage-compositions.png`);
await browser.close();
