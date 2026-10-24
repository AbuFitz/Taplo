import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Shot } from "../Shot";
import "./home-booking.css";

/** A single product moment, with real destinations instead of a staged success. */
export function HomeBooking() {
  return <section className="home-booking" aria-labelledby="home-booking-title" data-testid="home-booking">
    <div className="home-booking-inner">
      <div className="home-booking-copy">
        <h2 id="home-booking-title">Less back and forth.<br />More booked in.</h2>
        <p>A service. A time. A clear next step.<br />Let customers start the booking on your page.</p>
        <Link data-brand-action href="/product/booking#try-booking" className="home-booking-primary">Try a booking<ArrowRight size={18} aria-hidden="true" /></Link>
        <ul className="home-booking-routes"><li><Check size={16} aria-hidden="true" />Confirm straight away</li><li><Check size={16} aria-hidden="true" />Or approve requests first</li></ul>
      </div>
      <div className="home-booking-art">
        <div className="home-booking-phone-crop"><Shot id="booking-clinic-time" alt="The actual clinic appointment picker, with a choice of dates and available times" width={390} fluid frame="phone" className="home-booking-phone" /></div>
        <div className="home-booking-example"><span>Hollin Physiotherapy<span>Example business</span></span><Link href="/inspiration/hollin-physio">Open demo<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </div>
      <Link href="/product/booking" className="home-booking-more">Explore booking<ArrowUpRight size={17} aria-hidden="true" /></Link>
    </div>
  </section>;
}
