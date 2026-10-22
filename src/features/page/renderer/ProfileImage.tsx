import Image from "next/image"
import type { ImageRef } from "@/features/businesses/content"
import { cn } from "@/lib/utils"

/** Cover-fit image honouring the owner's focal point (object-position). */
export function ProfileImage({ image, sizes, className, priority }: { image: ImageRef; sizes: string; className?: string; priority?: boolean }) {
  const f = image.focal
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={image.src.endsWith(".svg") || image.src.startsWith("data:")}
      className={cn("object-cover", className)}
      style={f ? { objectPosition: `${f.x}% ${f.y}%` } : undefined}
    />
  )
}
