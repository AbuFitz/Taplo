"use client"

import * as React from "react"
import { ArrowUpRight, MessageSquare } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { EnquiryForm } from "@/features/booking/ui/EnquiryForm"

/** The contact form as a button that opens it in the shared overlay. */
export function EnquiryButton({ variant = "button", label, subtitle, title, slug, businessName, services }: { variant?: "button" | "card"; label: string; subtitle?: string; title: string; slug: string; businessName: string; services: { id: string; name: string }[] }) {
  return (
    <Overlay tone="page" kind="dialog" title={title} description={`${businessName} will reply using the details you give.`} testId="enquiry-dialog"
      trigger={<button type="button" className={variant === "card" ? "tp-tile tp-link-tile" : "tp-btn"} data-variant={variant}><MessageSquare aria-hidden="true" className="size-5" /><span className="tp-btn-main"><span className="tp-btn-label">{label}</span>{subtitle ? <span className="tp-btn-sub">{subtitle}</span> : null}</span>{variant === "card" ? <ArrowUpRight aria-hidden="true" /> : null}</button>}>
      <EnquiryForm slug={slug} businessName={businessName} services={services} />
    </Overlay>
  )
}
