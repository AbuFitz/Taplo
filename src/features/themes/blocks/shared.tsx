import * as React from "react"
import Image from "next/image"
import { ArrowRight, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import type { ImageRef } from "@/features/businesses/content"
import type { ProfileAction } from "../renderer/view-model"
import { TaploButton } from "@/components/taplo/taplo-button"
import { cn } from "@/lib/utils"

export interface BlockProps<C> {
  config: C
  vm: import("../renderer/view-model").PublicProfileViewModel
}

export function ProfileImage({ image, sizes, className, priority }: { image: ImageRef; sizes: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={image.src.endsWith(".svg")}
      className={cn("object-cover", className)}
    />
  )
}

const ICON: Record<ProfileAction["kind"], React.ComponentType<{ "aria-hidden"?: boolean; className?: string }>> = {
  book: ArrowRight,
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  directions: MapPin,
  website: Globe,
}

export function ActionButton({
  action,
  tone,
  size,
  className,
}: {
  action: ProfileAction
  tone?: "primary" | "secondary" | "ghost"
  size?: "md" | "lg"
  className?: string
}) {
  const Icon = ICON[action.kind]
  const external = action.kind === "whatsapp" || action.kind === "directions" || action.kind === "website"
  return (
    <TaploButton href={action.href} external={external} tone={tone} size={size} className={className} data-event={action.event}>
      <Icon aria-hidden />
      {action.label}
    </TaploButton>
  )
}

/**
 * Section wrapper: id for in-page anchors, optional heading, consistent
 * vertical rhythm from the --tp-section-y token.
 */
export function Section({
  id,
  eyebrow,
  title,
  children,
  surface,
  className,
  containerClassName,
  headingClassName,
}: {
  id: string
  eyebrow?: string
  title?: string
  children: React.ReactNode
  surface?: boolean
  className?: string
  containerClassName?: string
  headingClassName?: string
}) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn("tp-section", surface && "bg-tp-surface", className)}>
      <div className={cn("tp-container", containerClassName)}>
        {title ? (
          <header className={cn("mb-8 sm:mb-10", headingClassName)}>
            {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-tp-muted">{eyebrow}</p> : null}
            <h2 id={headingId} className="text-3xl font-semibold leading-tight sm:text-4xl">
              {title}
            </h2>
          </header>
        ) : null}
        {children}
      </div>
    </section>
  )
}

export function RatingLine({ vm, className }: { vm: BlockProps<unknown>["vm"]; className?: string }) {
  const r = vm.business.rating
  if (!r) return null
  const label = `${r.value.toFixed(1)} out of 5 from ${r.count} ${r.source[0]!.toUpperCase() + r.source.slice(1)} reviews`
  const body = (
    <>
      <span aria-hidden="true">★</span> {r.value.toFixed(1)} · {r.count} on {r.source[0]!.toUpperCase() + r.source.slice(1)}
    </>
  )
  return r.url ? (
    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={label} className={cn("text-sm underline-offset-4 hover:underline", className)}>
      {body}
    </a>
  ) : (
    <span aria-label={label} className={cn("text-sm", className)}>
      {body}
    </span>
  )
}

export function locationLine(vm: BlockProps<unknown>["vm"]): string | null {
  const l = vm.business.location
  if (l.mode === "online") return l.locality ? `${l.locality}` : "Online"
  if (l.mode === "service_area") return l.locality ? `Covering ${l.locality}` : "Service area"
  return l.locality ?? null
}
