"use client";
import * as React from "react";
import { CalendarDays, MessageSquare, Phone, MessagesSquare, Globe } from "lucide-react";
import { TaploInput } from "@/components/taplo/taplo-input";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { safeUrl, normalizePhone } from "@/lib/validation";
import { useDemo, initialState } from "./store";
import { newWidget } from "@/features/page/starter";

type Draft={email:string;phone:string;whatsapp:string;website:string;instagram:string};
export function SetupConnections({goal,onGoalChange,onValidity}:{goal:"book"|"enquire"|"call"|"message";onGoalChange:(goal:"book"|"enquire"|"call"|"message")=>void;onValidity:(valid:boolean)=>void}){
 const {state,update}=useDemo();const s=state??initialState();
 const [draft,setDraft]=React.useState<Draft>(()=>s.setupDrafts?.connections??{email:s.content.contacts.email??"",phone:s.content.contacts.phone??"",whatsapp:s.content.contacts.whatsapp??"",website:s.content.contacts.website??"",instagram:s.content.contacts.social?.find(x=>x.platform==="instagram")?.url??""});
 const [more,setMore]=React.useState(false);const [touched,setTouched]=React.useState<Record<string,boolean>>({});
 const url=(v:string)=>{const text=v.trim();return text?(/^[a-z][a-z0-9+.-]*:/i.test(text)?text:`https://${text}`):undefined;};
 const instagramUrl=(v:string)=>v.trim().startsWith("@")?`https://instagram.com/${v.trim().slice(1)}`:url(v);
 const validInstagram=(v:string)=>{try{const value=instagramUrl(v);return Boolean(value&&safeUrl.safeParse(value).success&&/^(www\.)?instagram\.com$/i.test(new URL(value).hostname));}catch{return false;}};
 const errors={email:draft.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)?"Enter a valid email address.":"",phone:draft.phone&&!normalizePhone(draft.phone)?"Enter a valid phone number.":"",whatsapp:draft.whatsapp&&!normalizePhone(draft.whatsapp)?"Enter a valid WhatsApp number.":"",website:draft.website&&!safeUrl.safeParse(url(draft.website)).success?"Enter a valid website or booking address.":"",instagram:draft.instagram&&!validInstagram(draft.instagram)?"Enter a full Instagram profile address.":""};
 const any=Object.values(draft).some(v=>v.trim());const valid=any&&!Object.values(errors).some(Boolean)&&(goal!=="call"||Boolean(draft.phone&&normalizePhone(draft.phone)))&&(goal!=="message"||Boolean(draft.email&&!errors.email||draft.whatsapp&&!errors.whatsapp));
 React.useEffect(()=>onValidity(valid),[valid,onValidity]);
 const change=(key:keyof Draft,value:string)=>{
  const next={...draft,[key]:value};setDraft(next);
  update(st=>{
   const website=url(next.website),instagram=instagramUrl(next.instagram);const contacts={...st.content.contacts,
    email:next.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)?next.email.trim():undefined,
    phone:normalizePhone(next.phone)??undefined,whatsapp:normalizePhone(next.whatsapp)??undefined,
    website:website&&safeUrl.safeParse(website).success?website:undefined,
    social:[...(st.content.contacts.social??[]).filter(x=>x.platform!=="instagram"),...(instagram&&validInstagram(next.instagram)?[{platform:"instagram" as const,url:instagram}]:[])]};
   const widgets=[...st.page.widgets];if((contacts.website||contacts.social.length)&&!widgets.some(w=>w.type==="social"))widgets.push(newWidget("social"));
   return {...st,setupDrafts:{...st.setupDrafts,connections:next},content:{...st.content,contacts},page:{...st.page,meta:{...st.page.meta,primaryAction:goal==="message"?(contacts.whatsapp?"whatsapp":"email"):st.page.meta.primaryAction},widgets}};
  },{coalesce:`connection-${key}`});
 };
 const field=(key:keyof Draft,label:string,placeholder:string,type="text")=><TaploInput key={key} label={label} placeholder={placeholder} type={type} inputMode={type==="tel"?"tel":type==="email"?"email":key==="website"||key==="instagram"?"url":undefined} autoCapitalize="none" autoCorrect="off" value={draft[key]} onChange={e=>change(key,e.target.value)} onBlur={()=>setTouched(x=>({...x,[key]:true}))} error={touched[key]?errors[key]:undefined}/>;
 return <div className="setup-connections" data-testid="reach">
  <p className="setup-connection-note">Keep your existing website and links. Add the ways you want people to connect.</p>
  <fieldset><legend className="setup-layout-heading">Your main action</legend><div className="setup-primary-choices">{([{id:"book",label:"Booking requests",Icon:CalendarDays},{id:"enquire",label:"Links & enquiries",Icon:Globe},{id:"call",label:"Phone calls",Icon:Phone},{id:"message",label:"Messages",Icon:MessageSquare}]as const).map(({id,label,Icon})=><button type="button" key={id} aria-pressed={goal===id} onClick={()=>onGoalChange(id)}><Icon aria-hidden="true"/>{label}</button>)}</div></fieldset>
  {field("website","Website or booking link (optional)","yourbusiness.co.uk")}
  {field("email","Email","hello@yourbusiness.co.uk","email")}
  {field("phone","Phone","07700 900123","tel")}
  <Overlay open={more} onOpenChange={setMore} title="More ways to connect" trigger={<button type="button" className="setup-secondary"><MessagesSquare size={18} aria-hidden="true"/>WhatsApp & Instagram</button>} footer={<Button className="w-full min-h-11" onClick={()=>setMore(false)}>Done</Button>}><div className="grid gap-6">{field("whatsapp","WhatsApp","+44 7700 900123","tel")}{field("instagram","Instagram profile","instagram.com/yourbusiness")}</div></Overlay>
 </div>;
}
