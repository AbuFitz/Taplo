import { expect, test } from "@playwright/test"
import { THEMES } from "../../src/features/page/themes/catalogue"

test("typed enquiry input stays readable in every starting look", async ({ page }) => {
  test.setTimeout(900_000)
  const failures: { look: string; color: string; background: string; ratio: number }[] = []
  for (const theme of THEMES) {
    await page.goto(`/appearance/frame?scenario=detailer&look=${theme.id}`, { waitUntil: "networkidle" })
    await page.locator('[data-widget="enquiry"] button').click()
    const input = page.getByRole("textbox", { name: "Your name", exact: true })
    await input.fill("Example customer")
    const result = await input.evaluate((el) => {
      const css = getComputedStyle(el)
      const ctx = document.createElement("canvas").getContext("2d")!
      const luminance = (color: string) => {
        ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1)
        const rgb = Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3).map((x) => x / 255).map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
        return rgb[0]! * .2126 + rgb[1]! * .7152 + rgb[2]! * .0722
      }
      // The field's own tint is translucent: the reader sees it over whatever sits behind it, so composite the whole stack.
      const stack: string[] = []
      for (let n: Element | null = el; n; n = n.parentElement) stack.unshift(getComputedStyle(n).backgroundColor)
      ctx.clearRect(0, 0, 1, 1)
      for (const c of stack) { ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1) }
      const [r, g, bl] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      const flat = `rgb(${r}, ${g}, ${bl})`
      const a = luminance(css.color), b = luminance(flat)
      return { color: css.color, background: flat, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) }
    })
    if (result.ratio < 4.5) failures.push({ look: theme.id, ...result })
  }
  expect(failures).toEqual([])
})
