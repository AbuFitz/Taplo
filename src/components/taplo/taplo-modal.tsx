"use client"

import * as React from "react"
import { Overlay } from "./overlay"

/**
 * The public page's dialog. A thin themed wrapper over the shared Overlay: a centred card from 640px up and
 * a bottom sheet below it; `wide` turns it into a detail view (full screen on phones).
 */
export function TaploModal({ trigger, title, description, wide = false, children }: { trigger: React.ReactNode; title: string; description?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <Overlay tone="page" kind={wide ? "detail" : "dialog"} trigger={trigger} title={title} description={description}>
      {children}
    </Overlay>
  )
}
