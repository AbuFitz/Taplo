import { test, expect } from "@playwright/test"
import { openEditorWithSample, openRow } from "./helpers"

test("undo survives a reload of the tab and the original value comes back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await openEditorWithSample(page)
  await openRow(page, "social")
  const form = page.getByTestId("social-links-editor")
  const original = await form.getByLabel("Instagram", { exact: true }).inputValue()
  await form.getByLabel("Instagram", { exact: true }).fill("https://instagram.com/reloadtest")
  await expect(page.getByTestId("undo")).toBeEnabled()
  await page.waitForTimeout(300)
  await page.reload({ waitUntil: "networkidle" })
  await expect(page.getByTestId("undo")).toBeEnabled()
  await page.getByTestId("undo").click()
  await openRow(page, "social")
  await expect(page.getByTestId("social-links-editor").getByLabel("Instagram", { exact: true })).toHaveValue(original)
})
