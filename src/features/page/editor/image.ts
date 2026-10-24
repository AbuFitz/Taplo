/**
 * Demo-mode image handling. Files are decoded and downscaled in the browser and kept as a small
 * data URL so they can live in localStorage. On a connected environment this step uploads
 * to Storage instead; the ImageRef the page stores is the same shape either way.
 */

export const SAMPLE_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  src: `/fixtures/img-${n}.svg`,
  label: `Sample picture ${n}`,
}));
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export interface PreparedImage {
  src: string;
  width: number;
  height: number;
  bytes: number;
  ink?: "dark" | "light" | "mixed";
}

export async function prepareImage(
  file: File,
  maxEdge = 1280,
  options: { preserveAlpha?: boolean } = {},
): Promise<PreparedImage> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type))
    throw new Error("Choose a JPG, PNG or WebP picture.");
  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("That picture is over 12 MB. Choose a smaller one.");
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("That picture could not be read.");
  try {
    // Reduce dimensions as well as quality. Busy photographs can exceed the storage budget even
    // at low JPEG quality; never return an oversized image and fail silently on the next save.
    for (
      let edge = Math.max(1, Math.min(maxEdge, 1280));
      ;
      edge = Math.max(160, Math.floor(edge * 0.75))
    ) {
      const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not process the picture.");
      if (!options.preserveAlpha) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(bitmap, 0, 0, width, height);
      let ink: PreparedImage["ink"];
      if (options.preserveAlpha) {
        const sample = document.createElement("canvas");
        sample.width = 64; sample.height = 64;
        const sampleContext = sample.getContext("2d");
        if (sampleContext) {
          sampleContext.drawImage(canvas, 0, 0, 64, 64);
          ink = transparentLogoInk(sampleContext.getImageData(0, 0, 64, 64).data);
        }
      }
      const mime = options.preserveAlpha && file.type !== "image/jpeg" ? "image/png" : "image/jpeg";
      for (const quality of mime === "image/png" ? [undefined] : [0.82, 0.7, 0.58, 0.46]) {
        const src = canvas.toDataURL(mime, quality);
        if (src.startsWith(`data:${mime};`) && src.length <= 380_000)
          return { src, width, height, bytes: src.length, ...(ink ? { ink } : {}) };
      }
      if (edge <= 160) break;
    }
  } finally {
    bitmap.close?.();
  }
  throw new Error("That picture could not be compressed enough.");
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Render the chosen crop region of a file into a new image file (demo: client-side; connected: server derivative). */
export async function cropFile(file: File, area: CropArea): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("That picture could not be read.");
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process the picture.");
  ctx.drawImage(
    bitmap,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, "image/jpeg", 0.92),
  );
  if (!blob) throw new Error("The crop could not be saved.");
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
}

/** Position the contained original inside its preview; pointer/focal coordinates exclude letterboxing. */
export function containedImageRect(box: { width: number; height: number }, image: { width?: number; height?: number }) {
  if (!image.width || !image.height) return { x: 0, y: 0, width: box.width, height: box.height };
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale, height = image.height * scale;
  return { x: (box.width - width) / 2, y: (box.height - height) / 2, width, height };
}

/** Alpha-weighted brightness of a transparent mark; opaque photographs have no inferred ink treatment. */
export function transparentLogoInk(pixels: ArrayLike<number>): PreparedImage["ink"] {
  let transparent = false, weight = 0, luminance = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3]! / 255;
    if (alpha < 0.98) transparent = true;
    if (alpha < 0.1) continue;
    luminance += (pixels[i]! * 0.2126 + pixels[i + 1]! * 0.7152 + pixels[i + 2]! * 0.0722) / 255 * alpha;
    weight += alpha;
  }
  if (!transparent || !weight) return undefined;
  const brightness = luminance / weight;
  return brightness < 0.35 ? "dark" : brightness > 0.7 ? "light" : "mixed";
}
