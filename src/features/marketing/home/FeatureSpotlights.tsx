"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { PagePreview } from "@/features/preview/PagePreview"

const FEATURES = [
  { name: 'Show your services and prices.', detail: 'The service, the price and what’s included. Ready for a closer look.', url: '/product/services', frame: '/appearance/frame?scenario=station&widget=priceMenu', colour: '#151515', label: 'Services and prices' },
  { name: 'Let customers book or request a visit.', detail: 'Book a slot, request a visit or start a conversation. You choose how it works.', url: '/product/booking', frame: '/appearance/frame?scenario=detailer&widget=featuredService', colour: '#151515', label: 'Booking and requests' },
  { name: 'Turn stock browsing into enquiries.', detail: 'Big photos, the useful facts and enquiries about the right item.', url: '/product/vehicles', frame: '/appearance/frame?scenario=brookfield&widget=products&variant=catalogue', colour: '#151515', label: 'Vehicle stock' },
  { name: 'Help customers choose their person.', detail: 'Introduce your people and the work they do. Make choosing someone personal.', url: '/product/team', frame: '/appearance/frame?scenario=station&widget=team&variant=grid', colour: '#151515', label: 'Team profiles' },
] as const
function FeatureScene({ item }: { item: typeof FEATURES[number] }) {
  const host=useRef<HTMLDivElement>(null), [visible,setVisible]=useState(false)
  useEffect(()=>{const el=host.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{rootMargin:'200px'});observer.observe(el);return()=>observer.disconnect()},[])
  return <div ref={host} className="feature-spotlight-scene" style={{background:item.colour}}><div className="feature-spotlight-ui">{visible?<PagePreview src={item.frame} title={`${item.label}, actual Taplo section`} mode="device" device={{w:390,h:440}} interactive={false}/>:null}</div></div>
}
/** Each feature gets its own isolated, actual engine composition. Only nearby scenes load. */
export function FeatureSpotlights() {
  const reel=useRef<HTMLUListElement>(null)
  const move=(direction:number)=>reel.current?.scrollBy({left:direction*360,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})
  return <section aria-labelledby="feature-spotlights-title" className="overflow-hidden bg-[#080808] py-20 text-white sm:py-28">
    <div className="mx-auto max-w-[88rem] px-5 sm:px-8"><div className="mt-4 flex items-end justify-between gap-5"><h2 id="feature-spotlights-title" className="font-display max-w-3xl text-[clamp(1.8rem,3.2vw,3rem)] font-medium leading-[1.03] tracking-[-0.055em]">Show the details<br/>people ask for.</h2><Link href="/product" className="hidden min-h-11 items-center gap-2 text-sm font-semibold sm:inline-flex">Explore every feature<ArrowUpRight aria-hidden="true" className="size-4"/></Link></div></div>
    <ul ref={reel} className="mx-auto mt-12 flex max-w-[88rem] snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8" aria-label="Taplo feature highlights">{FEATURES.map(item=><li key={item.url} className="w-[min(84vw,23rem)] shrink-0 snap-start"><FeatureScene item={item}/><p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">{item.label}</p><h3 className="mt-2 text-xl font-semibold tracking-tight"><Link href={item.url} className="inline-flex min-h-11 items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff]">{item.name}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0"/></Link></h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">{item.detail}</p></li>)}</ul>
    <div className="mx-auto mt-3 flex max-w-[88rem] justify-end gap-2 px-5 sm:px-8"><button type="button" onClick={()=>move(-1)} aria-label="Previous feature" className="grid size-11 place-items-center rounded-full border border-white/25 outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft aria-hidden="true" className="size-5"/></button><button type="button" onClick={()=>move(1)} aria-label="Next feature" className="grid size-11 place-items-center rounded-full border border-white/25 outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"><ArrowRight aria-hidden="true" className="size-5"/></button></div>
  </section>
}
