"use client"

import * as React from "react"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { PHONE } from "@/features/preview/PhoneChrome"
import { PagePreview } from "@/features/preview/PagePreview"
import type { Scenario } from "../content"
import type { LabMessage } from "../lab-state"

/** Sends the configuration to every preview frame and answers their "ready" handshake. */
export function useFrames(scenario: Scenario, themeId: string, overrides: StyleOverrides) {
  const frames = React.useRef(new Set<HTMLIFrameElement>())
  const latest = React.useRef<LabMessage>({ type: "taplo:lab", scenario, themeId, overrides })
  const push = React.useCallback(() => frames.current.forEach((f) => f.contentWindow?.postMessage(latest.current, window.location.origin)), [])
  React.useEffect(() => {
    latest.current = { type: "taplo:lab", scenario, themeId, overrides }
    push()
  }, [scenario, themeId, overrides, push])
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === "taplo:lab-ready") push() }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [push])
  return React.useCallback((el: HTMLIFrameElement | null) => {
    if (el) frames.current.add(el)
  }, [])
}

/** The showcase's phone and desktop previews are the shared PagePreview controller, so the lab shows pages exactly as the owner editor does. */
export function PhoneFrame({ register, src, title }: { register: (el: HTMLIFrameElement | null) => void; src: string; title: string }) {
  return (
    <div className="mx-auto w-full max-w-[410px]" style={{ aspectRatio: `${PHONE.width + PHONE.bezel*2} / ${PHONE.height + PHONE.bezel*2}` }}>
      <PagePreview mode="device" chrome src={src} title={title} frameRef={register} testId="lab-frame" />
    </div>
  )
}

export function DesktopFrame({ register, src, title, url }: { register: (el: HTMLIFrameElement | null) => void; src: string; title: string; url: string }) {
  return (
    <div className="w-full" style={{ height: "clamp(32rem, 82dvh, 58rem)" }}>
      <PagePreview mode="desktop" chrome url={url} src={src} title={title} frameRef={register} testId="lab-frame" />
    </div>
  )
}
