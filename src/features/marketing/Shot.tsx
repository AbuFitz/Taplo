import manifest from "./manifest.json"
import { cn } from "@/lib/utils"
import Image from "next/image"

type Id = keyof typeof manifest

/**
 * A capture of the real renderer (see marketing/README.md), with responsive derivatives from its retained
 * high-resolution original. `width` controls its CSS size; `sizes` describes smaller responsive placements.
 * No rotation, CSS scaling of live frames or scrollbars.
 */
export function Shot({ id, alt, width, className, priority = false, frame = "phone", cropTo, fluid = false, sizes }: { id: Id; alt: string; width: number; className?: string; priority?: boolean; frame?: "phone" | "none" | "browser"; cropTo?: number; /** Shrink with the space available instead of holding `width`; `width` becomes the maximum. */ fluid?: boolean; sizes?: string }) {
  const m = manifest[id]
  const radius = frame === "phone" ? "rounded-[1.75rem]" : frame === "browser" ? "rounded-xl" : "rounded-2xl"
  return (
    <figure className={cn("relative shrink-0 overflow-hidden bg-neutral-900 shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_30px_50px_-30px_rgb(0_0_0/0.45)]", radius, frame === "phone" && "p-[5px]", className)} style={fluid ? { maxWidth: width } : { width, maxWidth: "100%" }}>
      <div className={cn("overflow-hidden", frame === "phone" ? "rounded-[1.4rem]" : radius)} style={cropTo ? (fluid ? { aspectRatio: `${width} / ${cropTo}` } : { height: cropTo }) : undefined}>
        <Image src={m.file} alt={alt} width={m.width} height={m.height} sizes={sizes ?? `(max-width: ${width}px) 90vw, ${width}px`} loading={priority ? "eager" : "lazy"} className={cn("block w-full select-none", cropTo && fluid && "h-full object-cover object-top")} style={cropTo && fluid ? undefined : { aspectRatio: `${m.width} / ${m.height}`, height: "auto" }} draggable={false} />
      </div>
    </figure>
  )
}
