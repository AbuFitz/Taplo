import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import path from "node:path"

test("mobile menu closes cleanly when desktop navigation takes over",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await page.getByRole("button",{name:"Menu",exact:true}).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({width:1024,height:900});
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Product",exact:true})).toBeFocused();
});
