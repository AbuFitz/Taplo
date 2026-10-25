import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import "./home-booking.css";

/** An illustrative booking moment, with the actual booking journey one click away. */
export function HomeBooking() {
  return (
    <section
      className="home-booking"
      aria-labelledby="home-booking-title"
      data-testid="home-booking"
    >
      <div className="home-booking-inner">
        <div className="home-booking-copy">
          <h2 id="home-booking-title">
            Your next booking
            <br />
            starts here.
          </h2>
          <p>
            Show your services, prices and available times together. Let
            customers book a slot, or send you a request to review.
          </p>
          <Link
            data-brand-action
            href="/product/booking#try-booking"
            className="home-booking-primary"
          >
            Try a booking
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div
          className="home-booking-art booking-illustration"
          role="img"
          aria-label="Illustration of choosing a service and a time"
        >
          <div className="booking-art-calendar">
            <span className="booking-art-label">
              <CalendarDays size={19} aria-hidden="true" />
              Choose a day.
            </span>
            <div className="booking-art-days">
              <span>
                MON<strong>26</strong>
              </span>
              <span data-selected>
                TUE<strong>27</strong>
              </span>
              <span>
                WED<strong>28</strong>
              </span>
            </div>
            <p>Available times</p>
            <div className="booking-art-times">
              <span>09:00</span>
              <span data-selected>11:30</span>
              <span>14:00</span>
            </div>
          </div>
          <div className="booking-art-service">
            <span>
              Hollin Physiotherapy
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
            <strong>
              Initial
              <br />
              assessment.
            </strong>
            <span>
              <Clock3 size={14} aria-hidden="true" />
              45 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
