import { expect, test } from "@playwright/test"
import path from "node:path"

for (const width of [390, 1440]) {
  test(`walkthroughs stay optional, readable and keyboard-operable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const media: string[] = []
    page.on("request", r => { if (r.url().includes("walkthroughs/") && r.url().endsWith(".mp4")) media.push(r.url()) })
    await page.goto("/how-it-works")
    const guide = page.getByTestId("walkthroughs")
    await guide.scrollIntoViewIfNeeded()
    await expect(guide.getByRole("button", { name: "Play Make a page walkthrough" })).toBeVisible()
    expect(media).toHaveLength(0)
    await expect(guide.locator("video")).toHaveCount(0)
    await guide.getByRole("button", { name: /^Book a haircut/ }).click()
    await expect(guide.getByRole("button", { name: /^Book a haircut/ })).toHaveAttribute("aria-pressed", "true")
    await guide.getByText("Read this walkthrough", { exact: true }).focus()
    await page.keyboard.press("Enter")
    await expect(guide.getByText("Check before confirming.", { exact: true })).toBeVisible()
    await expect(guide).toContainText("no payment or notification is sent")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await guide.screenshot({ path: path.join(process.env.TAPLO_REVIEW_DIR ?? "test-results", `walkthroughs-${width}.png`) })
  })
}

for (const [label, file] of [["Make a page", "setup"], ["Book a haircut", "booking"]]) {
  test(`${label} actual recording plays from first frame to the end`, async ({ page }) => {
    test.setTimeout(90000)
    await page.goto("/how-it-works")
    const guide = page.getByTestId("walkthroughs")
    await guide.getByRole("button", { name: new RegExp(`^${label}`) }).click()
    await guide.getByRole("button", { name: `Play ${label} walkthrough`, exact: true }).click()
    const video = guide.getByTestId("walkthrough-video")
    await expect(video).toHaveAttribute("src", `/marketing/walkthroughs/${file}.mp4`)
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(2)
    const metadata = await video.evaluate((v: HTMLVideoElement) => ({ width: v.videoWidth, height: v.videoHeight, duration: v.duration }))
    expect(metadata.width).toBe(780); expect(metadata.height).toBe(1928)
    expect(metadata.duration).toBeGreaterThan(20)
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended), { timeout: 60000 }).toBe(true)
    expect(await video.evaluate((v: HTMLVideoElement) => v.error)).toBeNull()
    await guide.getByRole("button", { name: new RegExp(`^${file === "setup" ? "Book a haircut" : "Make a page"}`) }).click()
    await expect(guide.locator("video")).toHaveCount(0)
  })
}
