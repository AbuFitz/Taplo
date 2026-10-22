"use client"

import * as React from "react"
import type { StyleOverrides } from "@/features/page/contracts/style"
import type { Scenario } from "../content"
import type { LabMessage } from "../lab-state"

/** Sends the configuration to every preview frame and answers their "ready" handshake. */
export function useFrames(scenario: Scenario, overrides: StyleOverrides) {
  const frames = React.useRef(new Set<HTMLIFrameElement>())
  const latest = React.useRef<LabMessage>({ type: "taplo:lab", scenario, overrides })
  latest.current = { type: "taplo:lab", scenario, overrides }
  const push = React.useCallback(() => frames.current.forEach((f) => f.contentWindow?.postMessage(latest.current, window.location.origin)), [])
  React.useEffect(push, [scenario, overrides, push])
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === "taplo:lab-ready") push() }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [push])
  return React.useCallback((el: HTMLIFrameElement | null) => {
    if (el) frames.current.add(el)
  }, [])
}

function useFit(frameWidth: number) {
  const box = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  React.useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / frameWidth)))
    ro.observe(el)
    setScale(Math.min(1, el.clientWidth / frameWidth))
    return () => ro.disconnect()
  }, [frameWidth])
  return { box, scale }
}

export function PhoneFrame({ register, src, title }: { register: (el: HTMLIFrameElement | null) => void; src: string; title: string }) {
  const W = 390, H = 800, bezel = 10
  const { box, scale } = useFit(W + bezel * 2)
  return (
    <div ref={box} className="w-full overflow-hidden">
      <div className="mx-auto" style={{ width: (W + bezel * 2) * scale, height: (H + bezel * 2) * scale }}>
        <div className="origin-top-left rounded-[3.25rem] bg-[#0b0b0c] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55),0_0_0_1px_rgb(255_255_255/0.08)_inset]" style={{ width: W + bezel * 2, height: H + bezel * 2, padding: bezel, transform: `scale(${scale})` }}>
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
            <iframe ref={register} title={title} src={src} className="block h-full w-full border-0" />
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DesktopFrame({ register, src, title, url }: { register: (el: HTMLIFrameElement | null) => void; src: string; title: string; url: string }) {
  const W = 1280, H = 1180, bar = 44
  const { box, scale } = useFit(W)
  return (
    <div ref={box} className="w-full overflow-hidden">
      <div style={{ width: W * scale, height: (H + bar) * scale }}>
        <div className="origin-top-left overflow-hidden rounded-[1.25rem] bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.4),0_0_0_1px_rgb(0_0_0/0.1)]" style={{ width: W, height: H + bar, transform: `scale(${scale})` }}>
          <div className="flex items-center gap-4 border-b border-black/10 bg-[#f3f2ef] px-5" style={{ height: bar }}>
            <span className="flex gap-2" aria-hidden="true">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <i key={c} className="block size-3 rounded-full" style={{ background: c }} />)}</span>
            <span className="mx-auto w-[28rem] max-w-[60%] truncate rounded-md bg-white px-3 py-1 text-center text-[13px] text-neutral-500 shadow-[0_0_0_1px_rgb(0_0_0/0.07)]">{url}</span>
            <span className="w-12" />
          </div>
          <iframe ref={register} title={title} src={src} className="block w-full border-0" style={{ height: H }} />
        </div>
      </div>
    </div>
  )
}
