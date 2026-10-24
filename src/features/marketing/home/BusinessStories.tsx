import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Shot } from "../Shot"

const BUSINESSES = [
  { name:"Jay’s Barbers", kind:"Appointments & prices", slug:"jays-barbers", shot:"ex-station-road-barbers-phone" },
  { name:"Detail Dept.", kind:"Packages & requests", slug:"detail-dept", shot:"ex-parkside-valeting-phone" },
  { name:"Harris Cars", kind:"Stock & viewings", slug:"harris-cars", shot:"ex-brookfield-motors-phone" },
  { name:"No. 6 Coffee", kind:"Menu & opening times", slug:"no-6-coffee", shot:"ex-corner-table-cafe-phone" },
] as const
export function BusinessStories() {
  return <section aria-labelledby="businesses-h" className="mx-auto max-w-[88rem] border-t border-white/15 px-5 py-16 sm:px-8 sm:py-24">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><h2 id="businesses-h" className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">Barbers. Cars. Coffee.</h2><Link href="/inspiration" className="inline-flex min-h-11 items-center gap-3 rounded text-sm text-white/70 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">All six designs<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
    <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 sm:grid sm:grid-cols-2 lg:grid-cols-4" aria-label="Business design examples">{BUSINESSES.map(b=><li key={b.slug} className="w-[78vw] shrink-0 snap-start sm:w-auto"><Link href={`/inspiration/${b.slug}`} className="group block rounded outline-none focus-visible:ring-2 focus-visible:ring-white"><div className="overflow-hidden rounded-lg border border-white/15 bg-[#151515] p-2"><Shot id={b.shot} alt={`${b.name} business page`} width={320} cropTo={440} fluid frame="none" className="w-full transition-transform group-hover:-translate-y-1 motion-reduce:transition-none" /></div><h3 className="mt-4 flex items-center justify-between gap-3 text-base font-medium">{b.name}<ArrowUpRight aria-hidden="true" className="size-4 text-white/60" /></h3><p className="mt-1 text-xs text-white/60">{b.kind}</p></Link></li>)}</ul>
  </section>
}
