"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Shot } from "../Shot"
const SCENES = [
  { label:"Barber",name:"Jay’s Barbers",slug:"jays-barbers",asset:"station-road-barbers" },
  { label:"Detailer",name:"Detail Dept.",slug:"detail-dept",asset:"parkside-valeting" },
  { label:"Car dealer",name:"Harris Cars",slug:"harris-cars",asset:"brookfield-motors" },
  { label:"Café",name:"No. 6 Coffee",slug:"no-6-coffee",asset:"corner-table-cafe" },
] as const
/** A clear, frameless overview; full interactive examples open deliberately from the gallery. */
export function LiveStage() {
  const [selected, select] = useState(0)
  const scene = SCENES[selected]!
  return <div className="business-stage">
    <div className="business-stage-tabs" role="group" aria-label="Try a business design">{SCENES.map((s,i)=><button type="button" key={s.slug} aria-pressed={i===selected} onClick={()=>select(i)}>{s.label}</button>)}</div>
    <div className="business-stage-scene"><div className="business-stage-copy"><p className="text-xs text-black/65">Built around your business.</p><p className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-.05em]">{scene.name}</p><p className="mt-5 max-w-xs text-sm leading-relaxed text-black/60">One place to see the work, find the details and take the next step.</p><Link href={`/inspiration/${scene.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-3 rounded text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-black">Explore this page<ArrowUpRight size={17} aria-hidden="true"/></Link></div><div className="business-stage-page" key={scene.slug}><Shot id={`ex-${scene.asset}-phone` as never} alt={`${scene.name} business page`} width={390} frame="none" fluid priority /></div></div>
  </div>
}
