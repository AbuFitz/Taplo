import Link from "next/link"
import { ArrowUpRight, Check, CalendarDays, MessageCircle, Scissors, UserRound } from "lucide-react"

/** Marketing compositions describe the product without embedding cropped, nested scrolling pages. */
export function FeatureSpotlights() {
  return <section aria-labelledby="feature-spotlights-title" className="marketing-light relative overflow-hidden bg-white py-16 text-black sm:py-28">
    <div className="mono-atmosphere" aria-hidden="true" />
    <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8">
      <h2 id="feature-spotlights-title" className="font-display max-w-2xl text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-.055em]">A little page.<br />A lot of business.</h2>
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
        <Feature href="/product/services" title="Your prices. Clear from the start." detail="Put the service, price and what’s included together. Give people the detail they need to choose.">
          <div className="feature-menu"><span className="feature-icon"><Scissors size={22} aria-hidden="true" /></span><p className="mb-6 text-2xl font-semibold tracking-tight">Cuts & prices</p>{[['Haircut','£22','Cut, wash and finish.'],['Skin fade','£25','A close, carefully blended fade.'],['Cut & beard','£32','Your regular, together.']].map(([name,price,note])=><div className="feature-menu-row" key={name}><div className="flex items-baseline justify-between gap-4"><span className="font-medium">{name}</span><span>{price}</span></div><p className="mt-1 text-xs text-black/55">{note}</p></div>)}</div>
        </Feature>
        <Feature href="/product/booking" title="From “when?” to a time that works." detail="Let customers choose a service and a time. Confirm straight away or approve the request first.">
          <div className="feature-calendar"><div className="mb-7 flex items-center justify-between"><CalendarDays size={22} aria-hidden="true"/><span className="text-xs text-black/65">Appointment request</span></div><p className="text-xl font-semibold tracking-tight">Choose your time.</p><div className="my-6 flex justify-between gap-2">{['Mon','Tue','Wed','Thu','Fri'].map((day,i)=><span key={day} className={i===2?'feature-day active':'feature-day'}><small>{day}</small><strong>{12+i}</strong></span>)}</div><div className="grid grid-cols-3 gap-2">{['10:00','11:30','14:00'].map((time,i)=><span className={i===1?'feature-slot selected':'feature-slot'} key={time}>{time}{i===1?<Check size={13} aria-hidden="true"/>:null}</span>)}</div><div className="mt-6 flex items-center gap-2 text-xs text-black/60"><Check size={14} aria-hidden="true"/>A request, ready for you to review.</div></div>
        </Feature>
        <Feature href="/product/vehicles" title="The right enquiry, about the right car." detail="Photos, specifications, price and availability. Keep the selected vehicle attached to the conversation.">
          <div className="feature-stock"><p className="text-xs text-white/55">HARRIS CARS · CURRENT STOCK</p><p className="mt-7 max-w-xs text-[clamp(1.7rem,3vw,2.2rem)] font-medium leading-tight tracking-tight">Volkswagen Golf<br/><span className="text-white/50">1.5 TSI Style</span></p><div className="my-6 grid grid-cols-3 gap-3 text-xs text-white/60"><span>2020</span><span>28,450 miles</span><span>Manual</span></div><div className="flex items-center justify-between"><strong className="text-2xl font-medium">£17,950</strong><span className="rounded-full bg-white/10 px-3 py-1 text-xs">Available</span></div><div className="mt-7 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-black"><MessageCircle size={17} aria-hidden="true"/>Ask about this car<ArrowUpRight size={17} className="ml-auto" aria-hidden="true"/></div></div>
        </Feature>
        <Feature href="/product/team" title="People book with people." detail="Introduce the team, explain what each person does and let customers choose who they book with.">
          <div className="feature-team"><p className="mb-7 text-2xl font-semibold tracking-tight">Choose your barber.</p>{[['Sam Ellis','Haircuts, fades & beards'],['Lee Morgan','Scissor cuts & restyles'],['Iman Brooks','Haircuts & skin fades']].map(([name,note],i)=><div className="flex items-center gap-4 py-4" key={name}><span className={'feature-person person-'+i}><UserRound size={23} strokeWidth={1.8} aria-hidden="true"/></span><div><p className="font-medium">{name}</p><p className="mt-1 text-xs text-black/55">{note}</p></div><ArrowUpRight className="ml-auto text-black/40" size={17} aria-hidden="true"/></div>)}</div>
        </Feature>
      </div>
    </div>
  </section>
}
function Feature({ href, title, detail, children }: { href: string; title: string; detail: string; children: React.ReactNode }) {
  return <article><div className="feature-illustration" aria-label="Illustrative product preview">{children}</div><h3 className="mt-6 text-xl font-semibold tracking-tight"><Link href={href} className="inline-flex min-h-11 items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4">{title}<ArrowUpRight size={18} aria-hidden="true"/></Link></h3><p className="mt-2 max-w-md text-sm leading-relaxed text-black/60">{detail}</p></article>
}
