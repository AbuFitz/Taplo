import type { QrLogo } from "./render"

/** Load a logo as a data URI with its proportions, so an exported SVG is self-contained. Returns null if it cannot be used. */
export async function loadQrLogo(src: string | undefined | null): Promise<QrLogo | null> {
  if (!src) return null
  try {
    let href = src
    if (!src.startsWith("data:")) {
      const res = await fetch(src, { credentials: "same-origin" })
      if (!res.ok) return null
      const blob = await res.blob()
      href = await new Promise<string>((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => no(r.error); r.readAsDataURL(blob) })
    }
    const img = await new Promise<HTMLImageElement>((ok, no) => { const i = new window.Image(); i.onload = () => ok(i); i.onerror = () => no(new Error("logo")); i.src = href })
    if (!img.naturalWidth || !img.naturalHeight) return null
    return { href, aspect: img.naturalWidth / img.naturalHeight }
  } catch { return null }
}

/** Rasterise an SVG string to a PNG at an exact pixel size. */
export async function svgToPng(svg: string, px: number): Promise<Blob | null> {
  const img = await new Promise<HTMLImageElement | null>((ok) => { const i = new window.Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` })
  if (!img) return null
  const c = document.createElement("canvas"); c.width = c.height = px
  const ctx = c.getContext("2d"); if (!ctx) return null
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, 0, 0, px, px)
  return new Promise((res) => c.toBlob((b) => res(b), "image/png"))
}
