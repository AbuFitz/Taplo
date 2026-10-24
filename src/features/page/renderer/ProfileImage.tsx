import Image from "next/image"
import type { ImageRef } from "@/features/businesses/content"
import { cn } from "@/lib/utils"

/** Cover-fit image honouring the owner's focal point. Local raster assets get responsive derivatives;
 * uploaded data and arbitrary external references keep their original browser-supported source. */
export function ProfileImage({ image, sizes, className, priority }: { image: ImageRef; sizes: string; className?: string; priority?: boolean }) {
  const f = image.focal
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!/^\/(?!\/)/.test(image.src) || /\.svg(?:$|[?#])/i.test(image.src)}
      draggable={false}
      className={cn("object-cover", className)}
      style={f ? { objectPosition: `${f.x}% ${f.y}%` } : undefined}
    />
  )
}
