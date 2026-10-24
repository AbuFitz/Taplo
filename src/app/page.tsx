import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans"
import { formatMoney } from "@/features/services/format"
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site"
import { Shot } from "@/features/marketing/Shot"
import { Film } from "@/features/marketing/Film"
import { HomeBooking } from "@/features/marketing/home/HomeBooking"
import { LookSwitcher } from "@/features/marketing/home/LookSwitcher"
import { PlaqueScene } from "@/features/marketing/PlaqueScene"
import { MonoField } from "@/features/marketing/MonoField"
import { LiveStage } from "@/features/marketing/home/LiveStage"
import { taploCodeSvg } from "@/features/qr/taplo-code"

export const dynamic = "force-dynamic"
const action = "inline-flex min-h-11 items-center justify-center gap-5 rounded-md bg-white px-5 text-sm font-semibold text-black outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
export default function Home() {
  const a = primaryAction()
  const qr = taploCodeSvg("https://taplo-lilac.vercel.app/inspiration/no-6-coffee", 320, "Example Taplo QR code")
  return <div className="marketing-shell bg-[#080808] text-white">
    <SiteHeader />
    <main>
      <section aria-labelledby="home-title" className="mx-auto max-w-[88rem] px-5 pt-12 sm:px-8 sm:pt-20">
        <div className="grid gap-7 pb-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-24">
          <h1 id="home-title" className="font-display max-w-4xl text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[1.04] tracking-[-.055em]">Your business.<br />One useful page.</h1>
          <div className="max-w-md"><p className="text-base leading-relaxed text-white/60">Your services, prices, photos and stock on a page customers can use. Take bookings, arrange viewings and answer enquiries from one link.</p><div className="mt-6 flex flex-wrap items-center gap-6"><Link data-brand-action href={a.href} className={action}>{a.label}<ArrowRight aria-hidden="true" className="size-4" /></Link><Link href="/inspiration" className="inline-flex min-h-11 items-center gap-2 rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Explore designs<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div></div>
        </div>
        <LiveStage />
      </section>



      <HomeBooking />


      <MonoField className="home-design-field"><section className="marketing-light home-design-section relative mx-auto max-w-[88rem] px-5 py-16 text-black sm:px-8 sm:py-24" aria-labelledby="looks-h"><h2 id="looks-h" className="font-display mb-9 text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">Start with the design.<br />Keep your own identity.</h2><LookSwitcher /></section></MonoField>


      <section aria-labelledby="setup-h" className="mx-auto grid max-w-[88rem] items-center gap-10 border-t border-white/15 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="min-w-0 overflow-hidden rounded-xl border border-white/15 bg-[#161616] p-3 sm:p-5"><Shot id="setup-3-design" alt="Your first service appears in the live page while you choose its design" width={900} frame="none" fluid className="w-full" /></div>
        <div><h2 id="setup-h" className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium leading-[1.08] tracking-[-.045em]">Add your first service.<br />See your page take shape.</h2><ol className="mt-7 divide-y divide-white/15 text-sm">{["Add your business and contact details.","Create your first service or stock item.","Choose a design with your content in view."].map((s,n)=><li key={s} className="flex gap-4 py-4"><span className="tabular-nums text-white/60">0{n+1}</span><span className="text-white/75">{s}</span></li>)}</ol><Link data-brand-action href={a.href} className={`${action} mt-7`}>Start your page<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      </section>

      <MonoField className="home-design-field"><section aria-labelledby="sharing-h" className="marketing-light home-sharing-section mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 text-black sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div><h2 id="sharing-h" className="font-display max-w-lg text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1.06] tracking-[-.045em]">Your page.<br />Out in the world.</h2><p className="mt-5 max-w-sm text-base leading-relaxed text-black/65">A branded plaque for your counter. A digital business card for Apple Wallet, Google Wallet and Samsung Wallet. One code that opens your business page.</p><p className="mt-4 max-w-sm text-sm leading-relaxed text-black/60">Physical plaques and digital wallet passes are in development.</p></div><PlaqueScene code={qr}/>
      </section></MonoField>



      <section aria-labelledby="film-h" className="mx-auto max-w-[88rem] border-t border-white/15 px-5 py-16 sm:px-8 sm:py-24"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 id="film-h" className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">A page that takes shape.<br />Then gets to work.</h2></div><Film /></section>

      <section className="mx-auto grid max-w-[88rem] gap-10 border-t border-white/15 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.7fr_1.3fr]"><div><h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">Start free.<br />Add more when you need it.</h2><p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">One monthly price. No commission or contract.</p><Link href="/pricing" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Compare plans<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div><ul className="divide-y divide-white/15 border-y border-white/15">{PLAN_IDS.map(id=><li key={id} className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-5"><h3 className="text-lg font-medium">{PLANS[id].name}</h3><p className="text-sm leading-relaxed text-white/55">{PLANS[id].summary}</p><p className="text-sm font-medium tabular-nums">{PLANS[id].priceMinorGbp===0?'£0':`${formatMoney(PLANS[id].priceMinorGbp)} / month`}</p></li>)}</ul></section>
      <p className="mx-auto max-w-[88rem] px-5 pb-4 text-xs leading-relaxed text-white/60 sm:px-8">Try the frontend with your own content. Public publishing, payments, notifications and imported Google reviews need their services connected. <Link href="/product" className="underline underline-offset-4">See feature availability.</Link></p>
    </main>
    <SiteFooter />
  </div>
}
