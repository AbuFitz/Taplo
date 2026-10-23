import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import sharp from "sharp"
import jsQR from "jsqr"
import { contrast, qrFilename, qrSvg, safeColours, type QrLogo, type QrStyle } from "./render"

// A small, plain logo as a data URI: a navy square with a white "M" block, 2:1 and 1:1 variants.
const svgLogo = (w: number, h: number): QrLogo => ({
  href: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#14213d"/><rect x="${w * 0.25}" y="${h * 0.25}" width="${w * 0.5}" height="${h * 0.5}" fill="#fca311"/></svg>`).toString("base64")}`,
  aspect: w / h,
})

const URL_SHORT = "https://taplo.example/marlowe-and-finch"
const URL_LOCAL = "http://localhost:3200/demo/p/marlowe-and-finch"
const URL_LONG = `https://taplo.example/marlowe-and-finch/book?service=signature-cut&staff=jonah-marlowe&utm_source=window-sticker&utm_medium=qr&utm_campaign=${"spring-opening-offer-".repeat(6)}`

// The code every business gets: the real Taplo mark in the middle, Taplo ink on white.
const TAPLO_MARK: QrLogo = { href: `data:image/svg+xml;base64,${readFileSync("public/logo/taplo-symbol-black-tight.svg").toString("base64")}`, aspect: 577 / 526 }

const styles: Record<string, QrStyle> = {
  "the Taplo code: Taplo mark, soft modules, rounded corners": { dots: "rounded", corners: "rounded", fg: "#12141a", bg: "#ffffff", logo: TAPLO_MARK },
  "square, no logo": { dots: "square", corners: "square", fg: "#000000", bg: "#ffffff" },
  "rounded dots, rounded corners, brand colour": { dots: "rounded", corners: "rounded", fg: "#14213d", bg: "#ffffff" },
  "round dots, round corners, logo": { dots: "dots", corners: "round", fg: "#0b3d2e", bg: "#ffffff", logo: svgLogo(200, 200) },
  "rounded with wide logo": { dots: "rounded", corners: "rounded", fg: "#3a1c71", bg: "#ffffff", logo: svgLogo(300, 150) },
  "a light brand colour is darkened to scan": { dots: "square", corners: "rounded", fg: "#c6f432", bg: "#ffffff" },
  "a dark page background falls back to white": { dots: "rounded", corners: "square", fg: "#c6f432", bg: "#0d0e11", logo: svgLogo(200, 200) },
}

async function decode(svg: string, px: number) {
  // Rasterise at the real output size, then bring very large files down to what a phone camera pipeline works with.
  const full = await sharp(Buffer.from(svg), { density: 96 }).resize(px, px).flatten({ background: "#ffffff" }).png().toBuffer()
  const { data, info } = await sharp(full).resize(Math.min(px, 1200), Math.min(px, 1200)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data
}

describe("business QR codes", () => {
  for (const [name, style] of Object.entries(styles)) {
    for (const [label, url] of [["short URL", URL_SHORT], ["local URL", URL_LOCAL], ["long URL", URL_LONG]] as const) {
      for (const px of [256, 512, 1024, 3000]) {
        // The smallest size is checked for the short URL only: a long URL has more modules than 256 px can carry.
        if (px === 256 && label === "long URL") continue
        it(`${name}: ${label} decodes at ${px}px`, async () => {
          expect(await decode(qrSvg(url, style, px), px)).toBe(url)
        })
      }
    }
  }

  it("never draws dark modules that are not at least 7:1 against the background", () => {
    for (const [fg, bg] of [["#c6f432", "#ffffff"], ["#ffffff", "#ffffff"], ["#888888", "#f5f5f5"], ["#14213d", "#0d0e11"], ["nonsense", "nonsense"]]) {
      const c = safeColours(fg!, bg!)
      expect(contrast(c.fg, c.bg)).toBeGreaterThanOrEqual(7)
    }
  })

  it("uses error correction M without a logo and Q with one, and keeps the logo to 4% of the area or less", async () => {
    const { qrModel } = await import("./render")
    expect(qrModel(URL_SHORT, false).ecc).toBe("M")
    const m = qrModel(URL_SHORT, true)
    expect(m.ecc).toBe("Q")
    expect((m.logoModules / m.n) ** 2).toBeLessThanOrEqual(0.04 + 1e-9)
    expect(m.logoModules % 2).toBe(1)
  })

  it("leaves the logo out when it is too wide to read, instead of squeezing it", () => {
    const wide = svgLogo(600, 100)
    expect(qrSvg(URL_SHORT, { ...styles["square, no logo"]!, logo: wide }, 256)).not.toContain("<image")
  })

  it("keeps the logo inside the SVG as a data URI, so the file is self-contained", () => {
    const svg = qrSvg(URL_SHORT, styles["round dots, round corners, logo"]!, 512)
    expect(svg).toContain('href="data:image/svg+xml;base64,')
    expect(svg).not.toMatch(/href="https?:/)
  })

  it("names files by what they are", () => {
    expect(qrFilename("marlowe-and-finch", "qr", "png", { px: 3000 })).toBe("marlowe-and-finch-qr-3000px.png")
    expect(qrFilename("marlowe-and-finch", "qr", "svg", { preview: true })).toBe("marlowe-and-finch-preview-qr.svg")
    expect(qrFilename("marlowe-and-finch", "share", "png")).toBe("marlowe-and-finch-share.png")
  })
})
