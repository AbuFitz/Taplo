import { test,expect } from "@playwright/test";
import {openEditorWithSample} from "./helpers";
import AxeBuilder from "@axe-core/playwright";

test("owner desktop preview uses the draft business address",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await openEditorWithSample(page,"Tutor");
  const slug=await page.evaluate(()=>JSON.parse(localStorage.getItem("taplo.demo.v2")!).content.identity.slug);
  await page.getByRole("group",{name:"Preview size",exact:true}).getByRole("button",{name:"Desktop",exact:true}).click();
  await expect(page.locator("[data-preview-stage] [data-browser-chrome]")).toContainText(`mytaplo.com/${slug}`);
  await page.frameLocator('iframe[data-testid="preview-frame"]').getByRole("heading",{level:1}).waitFor();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
