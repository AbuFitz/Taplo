"use client"
import * as React from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export type SceneName = "first-run" | "analytics" | "bookings" | "upgrade"

/** Sourced, colourful animations (see docs/asset-licences.md). Product chrome stays monochrome; these carry the colour. */
const FILES: Record<SceneName, string> = {
  "first-run": "/lottie/share.json",
  analytics: "/lottie/analytics.json",
  bookings: "/lottie/bookings.json",
  upgrade: "/lottie/growth.json",
}

const cache = new Map<string, Promise<object>>()
const load = (src: string) => {
  let p = cache.get(src)
  if (!p) cache.set(src, (p = fetch(src).then((r) => r.json())))
  return p
}

export function Scene({ name, className, label }: { name: SceneName; className?: string; label?: string }) {
  const [data, setData] = React.useState<object | null>(null)
  const [still, setStill] = React.useState(false)
  React.useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    let live = true
    load(FILES[name]).then((d) => live && setData(d)).catch(() => {})
    return () => { live = false }
  }, [name])
  return (
    <div className={cn("aspect-[4/3] w-full", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} data-scene={name}>
      {data ? <Lottie animationData={data} loop={!still} autoplay={!still} rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }} className="h-full w-full" /> : null}
    </div>
  )
}
