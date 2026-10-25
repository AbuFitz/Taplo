"use client";

import * as React from "react";
import { CalendarDays, Image as ImageIcon, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/features/subscriptions/plans";
import { setupJourney } from "./setup-journey";

const STORIES: Record<PlanId, { title: string; detail: string; action: string }> = {
  free: { title: "A place to start the conversation.", detail: "Your profile, up to three services, and direct call and WhatsApp buttons.", action: "See your free starting point" },
  core: { title: "Let your work do the talking.", detail: "Add a gallery, choose your look and connect your socials. Keep your existing website too.", action: "Preview the Core experience" },
  pro: { title: "From interest to an appointment.", detail: "Give customers a booking route alongside your services, with deposits and confirmations when connected.", action: "Preview the Pro experience" },
  business: { title: "Make room for the whole team.", detail: "Bring people, places and schedules together, with a custom domain and access for your team.", action: "Preview the Business experience" },
};

/** Finite, illustrative motion: communicates the plan benefit without pretending an action completed. */
export function PlanExperience({ plan, industryKey, name, onChoose }: { plan: PlanId; industryKey: string; name: string; onChoose: (id: PlanId) => void }) {
  const [open, setOpen] = React.useState(false);
  const journey = setupJourney(industryKey);
  const story = STORIES[plan];
  return <>
    <section className="plan-experience" aria-label={`${PLANS[plan].name} for your setup`}>
      <div><p className="plan-experience-tier">{PLANS[plan].name} · {journey.category}</p><h2>{story.title}</h2><p>{story.detail}</p>
        <button type="button" className="setup-secondary" onClick={() => setOpen(true)}>{story.action}<span aria-hidden="true"> ↗</span></button>
      </div>
      <PlanScene plan={plan} name={name} subject={journey.example} booking={journey.booking} />
    </section>
    <Overlay open={open} onOpenChange={setOpen} title={`${PLANS[plan].name}, in practice`} footer={<div className="grid gap-3"><Button onClick={() => {onChoose(plan);setOpen(false)}}>Keep {PLANS[plan].name}</Button>{plan === "free" ? <Button variant="outline" onClick={() => {onChoose("core");setOpen(false)}}>Explore Core · £9.99/month</Button> : null}</div>}>
      <div className="plan-experience-expanded"><PlanScene plan={plan} name={name} subject={journey.example} booking={journey.booking} /><h3>{story.title}</h3><p>{story.detail}</p><p className="text-xs text-muted-foreground">Illustration of the plan. Setup saves your preference; no payment is taken or subscription started.</p></div>
    </Overlay>
  </>;
}

function PlanScene({plan,name,subject,booking}:{plan:PlanId;name:string;subject:string;booking:string}) {
  return <div key={plan} className="plan-scene" data-plan={plan} aria-hidden="true">
    <div className="plan-scene-profile"><span className="plan-scene-avatar">{(name || "Your page").split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase()}</span><strong>{name || "Your page"}</strong><span>{plan === "business" ? "Our people. Your choice." : "A little more you."}</span></div>
    {plan === "free" ? <div className="plan-scene-float"><Phone size={16}/><span>Call</span><MessageCircle size={16}/><span>WhatsApp</span></div>
      : plan === "core" ? <div className="plan-scene-float plan-scene-gallery"><span><ImageIcon size={20}/></span><span/><span/></div>
      : plan === "pro" ? <div className="plan-scene-float plan-scene-booking"><CalendarDays size={20}/><strong>{booking}</strong><span>{subject}</span><div><i>10:00</i><i>11:30</i><i>14:00</i></div></div>
      : <div className="plan-scene-float plan-scene-team"><Users size={20}/><strong>Choose your person</strong><div><i>AB</i><i>JL</i><i>MS</i></div><span><MapPin size={13}/> People & places</span></div>}
  </div>;
}
