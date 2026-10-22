"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/**
 * Thin, accessible wrapper over the shared Dialog. Focus trap, escape handling
 * and aria wiring come from Radix; theming comes from the portal container
 * published by ThemeRoot.
 */
export function TaploModal({
  trigger,
  title,
  description,
  children,
}: {
  trigger: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border border-tp-border bg-tp-bg text-tp-fg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-tp-heading text-xl">{title}</DialogTitle>
          {description ? <DialogDescription className="text-tp-muted">{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
