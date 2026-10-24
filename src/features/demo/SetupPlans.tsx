"use client";
import * as React from "react";
import { ArrowLeft,ArrowRight,Check } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PLANS,PLAN_IDS } from "@/features/subscriptions/plans";
import { useDemo,initialState } from "./store";
import "./setup-plans.css";

/** A preference, never a paid activation. Definitions and prices stay in the locked plan model. */
export function SetupPlans({inline=false}:{inline?:boolean}){
 const {state,update}=useDemo();const s=state??initialState();const [open,setOpen]=React.useState(false);const rail=React.useRef<HTMLDivElement>(null);
 const selected=s.setupDrafts?.planIntent??"free";const suggested=(s.content.staff?.length??0)>1?"business":s.content.booking?.mode!=="contact"?"pro":"core";
 React.useLayoutEffect(()=>{const el=rail.current;if(!el)return;const card=el.querySelector<HTMLElement>('[data-selected="true"]');if(card)el.scrollLeft=Math.max(0,card.offsetLeft-(el.clientWidth-card.clientWidth)/2)},[selected]);
 const revealSuggested=()=>{const el=rail.current;if(!el)return;const input=el.querySelector<HTMLInputElement>(`input[aria-label="Choose ${PLANS[suggested].name}"]`);const card=input?.closest<HTMLElement>('label');if(card)el.scrollTo({left:Math.max(0,card.offsetLeft-(el.clientWidth-card.clientWidth)/2),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};
 const move=(direction:number)=>rail.current?.scrollBy({left:direction*(rail.current.clientWidth*.85),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 const content=<div className="setup-plans-content" data-testid="setup-plans">
  <div className="setup-plan-intro"><p>Start free, or choose more room.<button className="setup-plan-recommend" type="button" onClick={revealSuggested}>{suggested === "pro" ? "Taking bookings? Explore Pro" : suggested === "business" ? "Working as a team? Explore Business" : "Make it your own with Core"}</button></p><div><button type="button" onClick={()=>move(-1)} aria-label="Previous plan"><ArrowLeft size={18} aria-hidden="true"/></button><button type="button" onClick={()=>move(1)} aria-label="Next plan"><ArrowRight size={18} aria-hidden="true"/></button></div></div>
  <fieldset><legend className="sr-only">Choose a plan preference</legend><div className="setup-plan-rail" ref={rail}>{PLAN_IDS.map(id=><label key={id} className="setup-plan-choice" data-selected={selected===id}>
   <input type="radio" name="setup-plan" aria-label={`Choose ${PLANS[id].name}`} checked={selected===id} onChange={()=>update(st=>({...st,setupDrafts:{...st.setupDrafts,planIntent:id}}))}/>
   <span className="setup-plan-context">{id===suggested?'Fits your setup':id==='free'?'A simple start':id==='core'?'Make it your own':id==='pro'?'Make booking easier':'Bring the team together'}</span>
   <span className="setup-plan-name">{PLANS[id].name}{selected===id?<Check size={21} aria-hidden="true"/>:null}</span>
   <span className="setup-plan-price">£{(PLANS[id].priceMinorGbp/100).toFixed(id==='free'?0:2)}<small>/month</small></span>
   <span className="setup-plan-summary">{PLANS[id].summary}</span>
   <span className="setup-plan-features">{PLANS[id].highlights.slice(0,5).map(feature=><span key={feature}><Check size={15} aria-hidden="true"/>{feature}</span>)}</span>
   <span className="setup-plan-select">{selected===id?'Selected':`Choose ${PLANS[id].name}`}</span>
  </label>)}</div></fieldset>
  <p className="setup-plan-disclosure">Your choice is saved as a preference. No payment or subscription is started.</p>
 </div>;
 return inline?content:<><button className="setup-edit-row" type="button" onClick={()=>setOpen(true)}>{PLANS[selected].name} plan<ArrowRight size={18} className="ml-auto" aria-hidden="true"/></button><Overlay open={open} onOpenChange={setOpen} title="Choose your plan" footer={<Button className="w-full" onClick={()=>setOpen(false)}>Continue with {PLANS[selected].name}</Button>}>{content}</Overlay></>;
}
