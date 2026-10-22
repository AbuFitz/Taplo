import Image from "next/image"
import { initialsOf } from "@/lib/validation"
import { cn } from "@/lib/utils"
import type { ImageRef } from "@/features/businesses/content"

type Size = "sm" | "md" | "lg" | "xl"
const SIZE: Record<Size, string> = { sm: "size-10 text-sm", md: "size-14 text-base", lg: "size-24 text-2xl", xl: "size-40 text-4xl" }

/** Photo when available, otherwise initials. Used for logos and staff. */
export function TaploAvatar({ name, image, size = "md", className }: { name: string; image?: ImageRef; size?: Size; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-tp-border bg-tp-surface font-tp-heading font-semibold text-tp-fg",
        SIZE[size],
        className,
      )}
    >
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes="160px" unoptimized={image.src.endsWith(".svg")} className="object-cover" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
      {!image && <span className="sr-only">{name}</span>}
    </span>
  )
}
