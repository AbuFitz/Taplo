import Image from "next/image";
import { ArrowUpRight, CalendarDays, Phone, Users } from "lucide-react";
import { SocialIcon } from "@/features/page/widgets/social-icons";
import type { PlanId } from "@/features/subscriptions/plans";

/** Compact editorial illustrations, not screenshots or pretend account activity. */
export function PlanIllustration({ plan }: { plan: PlanId }) {
  return (
    <div className="plan-art" data-tier={plan} aria-hidden="true">
      {plan === "free" ? (
        <div className="plan-art-profile">
          <span className="plan-art-logo">n.</span>
          <div>
            <strong>North Studio</strong>
            <small>Your work. One link.</small>
          </div>
          <span className="plan-art-contact">
            <Phone />
            <SocialIcon platform="whatsapp" />
          </span>
        </div>
      ) : plan === "core" ? (
        <div className="plan-art-gallery">
          <div className="plan-art-photo">
            <Image
              src="/showcase/originals/pottery-studio.webp"
              alt=""
              fill
              sizes="140px"
            />
          </div>
          <div className="plan-art-photo">
            <Image
              src="/showcase/originals/brand-stilllife.webp"
              alt=""
              fill
              sizes="120px"
            />
          </div>
          <span>
            Your work, on show.
            <ArrowUpRight />
          </span>
        </div>
      ) : plan === "pro" ? (
        <div className="plan-art-calendar">
          <span>
            <CalendarDays />A time that works.
          </span>
          <div className="plan-art-days">
            <span>
              MON<b>26</b>
            </span>
            <span>
              TUE<b>27</b>
            </span>
            <span>
              WED<b>28</b>
            </span>
          </div>
          <div className="plan-art-times">
            <span>10:00</span>
            <span>13:30</span>
            <span>16:00</span>
          </div>
        </div>
      ) : (
        <div className="plan-art-team">
          <span>
            <Users />
            Your team. In sync.
          </span>
          <div className="plan-art-people">
            <span>AM</span>
            <span>JL</span>
            <span>RS</span>
          </div>
          <div className="plan-art-team-label">
            People. Hours. Locations.
            <ArrowUpRight />
          </div>
        </div>
      )}
    </div>
  );
}
