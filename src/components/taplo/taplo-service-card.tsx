import * as React from "react"
import Image from "next/image"
import type { ServiceContent } from "@/features/businesses/content"
import { formatDuration, formatPrice } from "@/features/services/format"
import { cn } from "@/lib/utils"
import { TaploCard } from "./taplo-card"

/** Self-contained service summary. Layout blocks may also render rows without this card. */
export function TaploServiceCard({ service, showImage = false, action, className }: { service: ServiceContent; showImage?: boolean; action?: React.ReactNode; className?: string }) {
  const duration = formatDuration(service.durationMinutes)
  return (
    <TaploCard className={cn("flex h-full flex-col overflow-hidden", className)}>
      {showImage && service.image ? (
        <div className="relative aspect-[4/3] w-full">
          <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" unoptimized={service.image.src.endsWith(".svg")} className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold leading-snug">{service.name}</h3>
        {service.description ? <p className="text-sm text-tp-muted">{service.description}</p> : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-sm">
          <span className="font-semibold">{formatPrice(service)}</span>
          {duration ? <span className="text-tp-muted">{duration}</span> : null}
        </div>
        {action}
      </div>
    </TaploCard>
  )
}
