import { expect, test } from "@playwright/test"

test("the authored 4:5 advertisement decodes and plays to the end without audio or errors", async ({ page }) => {
  await page.goto("/marketing/film/taplo-feed.mp4")
  const video = page.locator("video")
  await expect(video).toBeVisible()
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(2)
  const metadata = await video.evaluate((v: HTMLVideoElement) => ({ width: v.videoWidth, height: v.videoHeight, duration: v.duration }))
  expect(metadata).toEqual({ width: 1080, height: 1350, duration: 20 })
  await video.evaluate(async (v: HTMLVideoElement) => { v.muted = true; await v.play() })
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended), { timeout: 30000 }).toBe(true)
  expect(await video.evaluate((v: HTMLVideoElement) => v.error)).toBeNull()
  expect((await page.request.get("/marketing/film/taplo-feed-poster.webp")).ok()).toBe(true)
})
