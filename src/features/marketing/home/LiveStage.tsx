"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Rotate3D, Smartphone, Monitor } from "lucide-react"
import { Shot } from "../Shot"
import { PagePreview } from "@/features/preview/PagePreview"
import { cn } from "@/lib/utils"
const SCENES = [
  { scenario: "station", label: "Barber", name: "Jay’s Barbers", slug: "jays-barbers", asset: "station-road-barbers" },
  { scenario: "detailer", label: "Detailer", name: "Detail Dept.", slug: "detail-dept", asset: "parkside-valeting" },
  { scenario: "brookfield", label: "Car dealer", name: "Harris Cars", slug: "harris-cars", asset: "brookfield-motors" },
  { scenario: "corner", label: "Café", name: "No. 6 Coffee", slug: "no-6-coffee", asset: "corner-table-cafe" },
] as const
/** Live engine, real responsive viewports, user-controlled camera. */
export function LiveStage() {
  const [selected, select] = useState(0)
  const [angle, setAngle] = useState(true)
  const [desktop, setDesktop] = useState(false)
  const scene = SCENES[selected]!
  return <div className="live-stage">
    <div className="live-stage-controls" role="group" aria-label="Try a business design">{SCENES.map((s, i) => <button key={s.scenario} type="button" aria-pressed={i === selected} onClick={() => select(i)} className={cn("min-h-11 rounded-lg px-3 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white", selected === i ? "bg-white text-black" : "text-white/75 hover:bg-white/10")}>{s.label}</button>)}</div>
    <div className="live-stage-space" data-angle={angle} data-desktop={desktop}>
      <div className="live-stage-desktop" aria-hidden="true" inert><Shot id={`ex-${scene.asset}-desk` as never} alt="" width={750} fluid frame="browser" className="w-full" /></div>
      <div className="live-stage-device" key={scene.scenario}><div className="live-stage-camera" aria-hidden="true" /><PagePreview src={`/appearance/frame?scenario=${scene.scenario}`} poster={`/marketing/ex-${scene.asset}-${desktop ? "desk" : "phone"}.webp`} title={`${scene.name}, interactive example`} mode={desktop ? "desktop" : "device"} device={{w:390,h:844}} chrome={desktop} interactive testId="home-live-page" /></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 py-3"><div className="flex gap-1" role="group" aria-label="Scene view">
      <button type="button" aria-pressed={!desktop} onClick={() => setDesktop(false)} aria-label="Phone view" className="stage-tool"><Smartphone aria-hidden="true" className="size-4" /></button>
      <button type="button" aria-pressed={desktop} onClick={() => setDesktop(true)} aria-label="Desktop view" className="stage-tool"><Monitor aria-hidden="true" className="size-4" /></button>
      <button type="button" aria-pressed={angle} onClick={() => setAngle(v => !v)} aria-label="Angled view" className="stage-tool"><Rotate3D aria-hidden="true" className="size-4" /></button>
    </div><Link href={`/inspiration/${scene.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white">Explore this design<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
  </div>
}
