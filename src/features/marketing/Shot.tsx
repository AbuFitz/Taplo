import manifest from "./manifest.json"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { PhoneChrome } from "@/features/preview/PhoneChrome"
import { BrowserChrome } from "@/features/preview/BrowserChrome"
import type { CSSProperties } from "react"

type Id = keyof typeof manifest

/** Real renderer captures. Phone hardware shares the live preview's exact geometry. */
export function Shot({ id, alt, width, className, priority = false, frame, cropTo, fluid = false, sizes, url }: { id: Id; alt: string; width: number; className?: string; priority?: boolean; frame?: "phone" | "none" | "browser"; cropTo?: number; fluid?: boolean; sizes?: string; url?: string }) {
  const m = manifest[id]
  const presentation = frame ?? (id.startsWith("ex-") && id.endsWith("-phone") ? "phone" : "none")
  const phone = presentation === "phone"
  const browser = presentation === "browser"
  const radius = browser ? "" : "rounded-2xl"
  return (
    <figure data-phone-static={phone ? "true" : undefined} className={cn("relative shrink-0", phone ? "phone-shell" : "overflow-hidden", browser && "browser-shell", !phone && radius, className)} style={{ ...(fluid ? { maxWidth: width, ...(phone ? {width:"calc(100% - 8px)"}: {}) } : { width, maxWidth: phone ? "calc(100% - 8px)" : "100%" }), ...(phone ? {marginInline:4}: {}), ...(phone ? { "--phone-surface": (m as typeof m & { surface?: string }).surface ?? "#ffffff" } : {}) } as CSSProperties}>
      {browser ? <BrowserChrome url={url} /> : null}
      <div className={cn("overflow-hidden", phone ? "phone-screen" : radius)} style={!phone && cropTo ? (fluid ? { aspectRatio: `${width} / ${cropTo}` } : { height: cropTo }) : undefined}>
        <Image src={`${m.file}?v=${m.sha256}`} alt={alt} width={m.width} height={m.height} sizes={sizes ?? `(max-width: ${width}px) 90vw, ${width}px`} loading={priority ? "eager" : "lazy"} className={cn("block w-full select-none", !phone && cropTo && fluid && "h-full object-cover object-top")} style={!phone && cropTo && fluid ? undefined : { aspectRatio: `${m.width} / ${m.height}`, height: "auto" }} draggable={false} />
      </div>
      {phone ? <PhoneChrome /> : null}
    </figure>
  )
}
