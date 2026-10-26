"use client";

import * as React from "react";
import {
  CalendarDays,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/features/subscriptions/plans";
import { setupJourney } from "./setup-journey";

const STORIES: Record<
  PlanId,
  { title: string; detail: string; action: string }
> = {
  free: {
    title: "Live in minutes.",
    detail:
      "A clean page with your services and direct call and WhatsApp buttons.",
    action: "See how it looks",
  },
  core: {
    title: "Show your work.",
    detail:
      "A gallery, your choice of look and your socials. Keep your existing website too.",
    action: "See how it looks",
  },
  pro: {
    title: "Let customers book themselves.",
    detail:
      "Times, deposits and confirmations alongside your services, once connected.",
    action: "See how it looks",
  },
  business: {
    title: "Bring the whole team.",
    detail: "People, places and schedules in one page, with a custom domain.",
    action: "See how it looks",
  },
};

/** Finite, illustrative motion: communicates the plan benefit without pretending an action completed. */
export function PlanExperience({
  plan,
  industryKey,
  name,
  onChoose,
}: {
  plan: PlanId;
  industryKey: string;
  name: string;
  onChoose: (id: PlanId) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const journey = setupJourney(industryKey);
  const story = STORIES[plan];
  return (
    <>
      <section
        className="plan-experience"
        aria-label={`${PLANS[plan].name} for your setup`}
      >
        <div>
          <p className="plan-experience-tier">
            {PLANS[plan].name} · {journey.category}
          </p>
          <h2>{story.title}</h2>
          <p>{story.detail}</p>
          <ul className="plan-experience-list">
            {PLANS[plan].highlights.slice(0, 4).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <button
            type="button"
            className="setup-secondary"
            onClick={() => setOpen(true)}
          >
            {story.action}
            <span aria-hidden="true"> ↗</span>
          </button>
        </div>
        <PlanScene
          plan={plan}
          name={name}
          subject={journey.example}
          booking={journey.booking}
        />
      </section>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title={`${PLANS[plan].name}, in practice`}
        footer={
          <div className="grid gap-3">
            <Button
              onClick={() => {
                onChoose(plan);
                setOpen(false);
              }}
            >
              Keep {PLANS[plan].name}
            </Button>
            {plan === "free" ? (
              <Button
                variant="outline"
                onClick={() => {
                  onChoose("core");
                  setOpen(false);
                }}
              >
                Explore Core · £9.99/month
              </Button>
            ) : null}
          </div>
        }
      >
        <div className="plan-experience-expanded">
          <PlanScene
            plan={plan}
            name={name}
            subject={journey.example}
            booking={journey.booking}
          />
          <h3>{story.title}</h3>
          <p>{story.detail}</p>
          <p className="text-xs text-muted-foreground">
            Illustration of the plan. Setup saves your preference; no payment is
            taken or subscription started.
          </p>
        </div>
      </Overlay>
    </>
  );
}

function PlanScene({
  plan,
  name,
  subject,
  booking,
}: {
  plan: PlanId;
  name: string;
  subject: string;
  booking: string;
}) {
  const initials = (name || "Your page")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div key={plan} className="plan-scene" data-plan={plan} aria-hidden="true">
      <div className="plan-scene-halo" />
      <div className="plan-scene-phone">
        <div className="plan-scene-profile">
          <span className="plan-scene-avatar">{initials}</span>
          <div>
            <strong>{name || "Your page"}</strong>
            <span>{subject}</span>
          </div>
        </div>
        {plan === "free" ? (
          <>
            <div className="plan-scene-float plan-scene-actions">
              <span>
                <Phone size={14} />
                Call
              </span>
              <span>
                <MessageCircle size={14} />
                WhatsApp
              </span>
            </div>
            <div className="plan-scene-float plan-scene-rows">
              <i />
              <i />
              <i />
            </div>
          </>
        ) : plan === "core" ? (
          <>
            <div className="plan-scene-float plan-scene-gallery">
              <span>
                <ImageIcon size={16} />
              </span>
              <span />
              <span />
            </div>
            <div className="plan-scene-float plan-scene-swatches">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="plan-scene-float plan-scene-rows">
              <i />
              <i />
            </div>
          </>
        ) : plan === "pro" ? (
          <>
            <div className="plan-scene-float plan-scene-days">
              <i>Mon</i>
              <i data-on>Tue</i>
              <i>Wed</i>
            </div>
            <div className="plan-scene-float plan-scene-times">
              <i>10:00</i>
              <i data-on>11:30</i>
              <i>14:00</i>
              <i>15:30</i>
            </div>
            <div className="plan-scene-float plan-scene-cta">
              <CalendarDays size={14} />
              {booking}
            </div>
          </>
        ) : (
          <>
            <div className="plan-scene-float plan-scene-team">
              <i>AB</i>
              <i>JL</i>
              <i>MS</i>
              <i>+2</i>
            </div>
            <div className="plan-scene-float plan-scene-places">
              <span>
                <MapPin size={12} />
                High Street
              </span>
              <span>
                <MapPin size={12} />
                Station Road
              </span>
            </div>
            <div className="plan-scene-float plan-scene-cta">
              <Users size={14} />
              Choose your person
            </div>
          </>
        )}
      </div>
    </div>
  );
}
