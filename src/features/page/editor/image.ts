/**
 * Demo-mode image handling. Files are decoded and downscaled in the browser and kept as a small
 * JPEG data URL so they can live in localStorage. On a connected environment this step uploads
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
}

export async function prepareImage(
  file: File,
  maxEdge = 1280,
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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      for (const quality of [0.82, 0.7, 0.58, 0.46]) {
        const src = canvas.toDataURL("image/jpeg", quality);
        if (src.startsWith("data:image/jpeg;") && src.length <= 380_000)
          return { src, width, height, bytes: src.length };
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
