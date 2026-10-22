/**
 * Demo-mode image handling. Files are decoded and downscaled in the browser and kept as a small
 * JPEG data URL so they can live in localStorage. On a connected environment this step uploads
 * to Storage instead; the ImageRef the page stores is the same shape either way.
 */

export const SAMPLE_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ src: `/fixtures/img-${n}.svg`, label: `Sample picture ${n}` }));
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export interface PreparedImage {
  src: string;
  width: number;
  height: number;
  bytes: number;
}

export async function prepareImage(file: File, maxEdge = 1280): Promise<PreparedImage> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Choose a JPG, PNG or WebP picture.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("That picture is over 12 MB. Choose a smaller one.");
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("That picture could not be read.");
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process the picture.");
  ctx.fillStyle = "#ffffff"; // flatten transparency so JPEG stays clean
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  // Aim for a few hundred KB at most so several images fit in browser storage.
  for (const q of [0.82, 0.7, 0.58, 0.46]) {
    const src = canvas.toDataURL("image/jpeg", q);
    if (src.length <= 380_000 || q === 0.46) return { src, width: w, height: h, bytes: src.length };
  }
  throw new Error("That picture could not be compressed enough.");
}
