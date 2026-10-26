/**
 * Lifts the subject of a photograph off its background, in the browser. The photograph never leaves the device.
 * U²-Net (small, Apache-2.0) runs through ONNX Runtime Web (MIT); both files are served from this site and only
 * downloaded when someone asks for a cut-out.
 */
const SIZE = 320
const MEAN = [0.485, 0.456, 0.406] as const
const STD = [0.229, 0.224, 0.225] as const
const BUDGET = 380_000

let session: Promise<{ run: (input: Float32Array) => Promise<Float32Array>; ort: typeof import("onnxruntime-web/wasm") }> | undefined

function load() {
  session ??= (async () => {
    const ort = await import("onnxruntime-web/wasm")
    ort.env.wasm.wasmPaths = "/ort/"
    ort.env.wasm.numThreads = 1
    const s = await ort.InferenceSession.create("/models/u2netp.onnx", { executionProviders: ["wasm"] })
    const name = s.inputNames[0]!
    return {
      ort,
      run: async (input: Float32Array) => {
        const out = await s.run({ [name]: new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]) })
        return out[s.outputNames[0]!]!.data as Float32Array
      },
    }
  })()
  session.catch(() => { session = undefined })
  return session
}

async function bitmapOf(src: string): Promise<ImageBitmap> {
  const blob = await (await fetch(src)).blob()
  return createImageBitmap(blob)
}

/** The soft matte (0 to 1 per pixel, SIZE × SIZE) that separates the main subject from the background. */
export async function subjectMatte(bitmap: ImageBitmap): Promise<Float32Array> {
  const { run } = await load()
  const c = document.createElement("canvas")
  c.width = SIZE; c.height = SIZE
  const ctx = c.getContext("2d", { willReadFrequently: true })!
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE)
  const px = ctx.getImageData(0, 0, SIZE, SIZE).data
  const input = new Float32Array(3 * SIZE * SIZE)
  for (let i = 0; i < SIZE * SIZE; i++) for (let k = 0; k < 3; k++) input[k * SIZE * SIZE + i] = (px[i * 4 + k]! / 255 - MEAN[k]!) / STD[k]!
  const raw = await run(input)
  let lo = Infinity, hi = -Infinity
  for (const v of raw) { if (v < lo) lo = v; if (v > hi) hi = v }
  const span = hi - lo || 1
  const matte = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < matte.length; i++) {
    const m = (raw[i]! - lo) / span
    // A little contrast so soft edges stay soft but the background goes fully clear.
    matte[i] = Math.min(1, Math.max(0, (m - 0.18) / 0.64))
  }
  return matte
}

/** The photograph with everything but its subject made transparent, as a PNG small enough to store with the page. */
export async function cutOut(src: string): Promise<{ src: string; width: number; height: number }> {
  const bitmap = await bitmapOf(src)
  try {
    const matte = await subjectMatte(bitmap)
    const mc = document.createElement("canvas")
    mc.width = SIZE; mc.height = SIZE
    const mctx = mc.getContext("2d")!
    const md = mctx.createImageData(SIZE, SIZE)
    for (let i = 0; i < matte.length; i++) { md.data[i * 4 + 3] = Math.round(matte[i]! * 255); md.data[i * 4] = md.data[i * 4 + 1] = md.data[i * 4 + 2] = 255 }
    mctx.putImageData(md, 0, 0)
    for (let edge = Math.min(900, Math.max(bitmap.width, bitmap.height)); edge >= 240; edge = Math.floor(edge * 0.8)) {
      const k = Math.min(1, edge / Math.max(bitmap.width, bitmap.height))
      const w = Math.max(1, Math.round(bitmap.width * k)), h = Math.max(1, Math.round(bitmap.height * k))
      const c = document.createElement("canvas")
      c.width = w; c.height = h
      const ctx = c.getContext("2d")!
      ctx.drawImage(bitmap, 0, 0, w, h)
      ctx.globalCompositeOperation = "destination-in"
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(mc, 0, 0, w, h)
      // WebP keeps the transparency at a fraction of PNG's size; fall back to PNG where it is not encoded.
      for (const [mime, q] of [["image/webp", 0.82], ["image/webp", 0.65], ["image/png", undefined]] as const) {
        const out = c.toDataURL(mime, q)
        if (out.startsWith(`data:${mime}`) && out.length <= BUDGET) return { src: out, width: w, height: h }
      }
    }
    throw new Error("The cut-out was too detailed to store. Try a smaller photograph.")
  } finally {
    bitmap.close?.()
  }
}
