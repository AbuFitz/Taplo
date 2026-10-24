import manifest from "./manifest.json"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { PhoneChrome } from "@/features/preview/PhoneChrome"
import type { CSSProperties } from "react"

type Id = keyof typeof manifest

/** Real renderer captures. Phone hardware shares the live preview's exact geometry. */
export function Shot({ id, alt, width, className, priority = false, frame, cropTo, fluid = false, sizes }: { id: Id; alt: string; width: number; className?: string; priority?: boolean; frame?: "phone" | "none" | "browser"; cropTo?: number; fluid?: boolean; sizes?: string }) {
  const m = manifest[id]
  const presentation = frame ?? (id.startsWith("ex-") && id.endsWith("-phone") ? "phone" : "none")
  const phone = presentation === "phone"
  const radius = presentation === "browser" ? "rounded-xl" : "rounded-2xl"
  return (
    <figure data-phone-static={phone ? "true" : undefined} className={cn("relative shrink-0", phone ? "phone-shell" : "overflow-hidden", presentation === "browser" && "bg-neutral-900 shadow-[0_30px_50px_-30px_rgb(0_0_0/0.45)]", !phone && radius, className)} style={{ ...(fluid ? { maxWidth: width } : { width, maxWidth: "100%" }), ...(phone ? { "--phone-surface": (m as typeof m & { surface?: string }).surface ?? "#ffffff" } : {}) } as CSSProperties}>
      <div className={cn("overflow-hidden", phone ? "phone-screen" : radius)} style={!phone && cropTo ? (fluid ? { aspectRatio: `${width} / ${cropTo}` } : { height: cropTo }) : undefined}>
        <Image src={`${m.file}?v=${m.sha256}`} alt={alt} width={m.width} height={m.height} sizes={sizes ?? `(max-width: ${width}px) 90vw, ${width}px`} loading={priority ? "eager" : "lazy"} className={cn("block w-full select-none", !phone && cropTo && fluid && "h-full object-cover object-top")} style={!phone && cropTo && fluid ? undefined : { aspectRatio: `${m.width} / ${m.height}`, height: "auto" }} draggable={false} />
      </div>
      {phone ? <PhoneChrome /> : null}
    </figure>
  )
}
