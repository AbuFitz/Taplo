import type { BusinessContentInput } from "@/features/businesses/content";
import type { PageDoc } from "@/features/page/contracts/page";
import type { WidgetType } from "@/features/page/contracts/widgets";
import { applySectionTreatment, type SectionTreatmentId } from "@/features/page/section-treatments";
import { newWidget, hours } from "./helpers";
import { COLLECTION_BRIEFS, type CollectionScenario } from "./collection-data";
export { COLLECTION_BRIEFS } from "./collection-data";
export type { CollectionScenario } from "./collection-data";
const original = (name: string, alt: string) => ({src:`/showcase/originals/${name}.webp`,alt,width:1440,height:name==='pottery-studio'?1080:['film-studio','audio-studio','running-trail','repair-studio'].includes(name)?810:960});
const project = (id:string,n:number, name:string) => ({src:`/showcase/projects/${id}-${n}.svg`,alt:`${name}, original concept ${n}`,width:1440,height:1080});
type ScenarioRecord = {label:string;content:BusinessContentInput;widgets:()=>PageDoc['widgets']};
/** Compositions use the same per-block surface controls as the editor. */
const COLLECTION_SURFACES: Partial<Record<CollectionScenario, Partial<Record<WidgetType, SectionTreatmentId>>>> = {
 sora:{text:'raised',serviceList:'raised'}, ellis:{text:'raised',serviceList:'raised'},
 form:{text:'raised',serviceList:'raised',faq:'raised'},liv:{text:'raised',serviceList:'raised',faq:'raised'},
 petal:{text:'raised',serviceList:'raised',faq:'raised'},maya:{text:'raised',serviceList:'raised'},
 nami:{text:'raised',serviceList:'raised',faq:'raised'},pace:{text:'raised',serviceList:'raised'},
 good:{text:'spotlight',serviceList:'raised',faq:'raised'},lune:{text:'raised',serviceList:'raised',faq:'raised'},
 hours:{text:'raised',priceMenu:'raised',faq:'raised'},slate:{text:'raised',serviceList:'raised'},
 edit:{text:'raised',serviceList:'raised'},twelve:{text:'raised',serviceList:'raised'},
 arlo:{text:'raised',serviceList:'raised',faq:'raised'},field:{text:'raised',serviceList:'raised'},
 north:{text:'raised',serviceList:'raised',faq:'raised'},current:{serviceList:'raised',faq:'raised'},
 alba:{text:'raised',serviceList:'raised',faq:'raised'},slow:{text:'raised',serviceList:'raised',faq:'raised'},
 eden:{text:'raised',serviceList:'raised'},after:{text:'raised',serviceList:'raised'},
 dune:{text:'raised',serviceList:'raised'},leon:{text:'raised',serviceList:'raised'},
};
function build(b:(typeof COLLECTION_BRIEFS)[number]):ScenarioRecord {
 const creative=['portfolios','entrepreneurs'].includes(b.sector), food=b.id==='hours';
 const scene=(b as {heroScene?:string}).heroScene;
 const art=scene?{src:`/showcase/scenes/${scene}.svg`,alt:`${b.label}: original illustration`,width:1440,height:960}:b.hero?original(b.hero,`${b.label}: original illustrative portfolio scene`):undefined;
 const concept=['maya','twelve','good','field','ellis','slate','eden','leon'].includes(b.id);
 const images=b.id==='field'?[original('illustration-studio','Original gouache still-life illustration'),project('field',2,b.name)]:b.id==='ellis'&&art?[art,project(b.id,1,b.name),project(b.id,2,b.name)]:b.id==='sora'?[original('interior-studio','Interior study in natural light'),original('pottery-studio','Handmade vessels, still-life study'),original('florist-studio','Seasonal flowers, still-life study')]:concept?[project(b.id,1,b.name),project(b.id,2,b.name),...(art?[art]:[])]:art?[art]:[];
 const services=b.services.map((name,i)=>({id:`${b.id}-s${i}`,name,description:b.descriptions[i],group:food?'This weekend':undefined,priceMode:b.prices[i]===null?'quote' as const:b.prices[i]===0?'free' as const:food?'fixed' as const:'from' as const,...(b.prices[i]?{priceMinor:Math.round(b.prices[i]!*100)}:{}),currency:'GBP',bookingMode:'contact' as const,sortOrder:i}));
 const content:BusinessContentInput={identity:{name:b.name,slug:b.slug,industryKey:b.key,industryLabel:b.label,tagline:b.line,logo:{src:`/showcase/marks/${b.id}.svg`,alt:`${b.name} original mark`,width:360,height:128,ink:'mono' as const},heroImage:art},location:{mode:creative?'online':'service_area',locality:b.town,timezone:'Europe/London'},contacts:{email:`hello@${b.slug}.example`,social:[]},about:b.bio,credentials:[],hours:creative?[]:hours(food?['fri','sat','sun']:['tue','wed','thu','fri','sat'],food?'08:30':'09:30',food?'13:00':'17:30'),services,staff:[],gallery:images.map((image,i)=>({id:`${b.id}-g${i}`,image,caption:concept?`Concept ${i+1}`:b.id==='sora'?['Rooms in morning light','Still life, handmade vessels','Seasonal colour study'][i]:b.id==='nami'?'Materials, light and everyday living':b.id==='pace'?'Behind the work':b.id==='form'?'From the workbench':b.id==='hours'?'From the morning bake':b.id==='edit'?'The current edit':b.id==='north'?'Out on the trail':'From the studio'})),testimonials:[],reviewLinks:[],faqs:[{id:'begin',question:food?'How do I order?':'How do we begin?',answer:food?'Send an enquiry with what you would like and the collection day. We will reply to confirm availability.':`Send a short note about what you have in mind. ${b.name} will reply to agree the scope, price and next step.`},{id:'where',question:creative?'Can we work remotely?':'Where do you work?',answer:creative?`Yes. Based in ${b.town}, with projects discussed by email or a call.`:`Based in ${b.town}. Please enquire before travelling; visits and collections are arranged directly.`}],products:[],offers:[],booking:{mode:'contact',onlineBookingReady:false}};
 const statement:Record<string,string>={maya:'Small ideas. Made real.',field:'Pictures with a human touch.',good:'Less noise. A useful next step.',twelve:'Your business, in your own voice.'};
 const text: [WidgetType,Record<string,unknown>]=['text',{body:statement[b.id]??b.bio,variant:['maya','field','good','twelve'].includes(b.id)?'statement':'note',collapsible:true}];
 const gallery: [WidgetType,Record<string,unknown>]=['gallery',{title:creative?'Selected work':b.id==='north'?'Outside is the point.':'A closer look',variant:["form","petal","lune"].includes(b.id)?"mosaic":b.gallery,fit:concept?'contain':'cover'}];
 const list: [WidgetType,Record<string,unknown>]=[food?'priceMenu':'serviceList',{title:food?'This weekend':creative?'Work with me':b.id==='current'?'Repair options':'Ways to begin',variant:food?'panels':['pace','current','alba','liv'].includes(b.id)?'spotlight':['ellis','good','field','nami','sora','leon'].includes(b.id)?'compact':['arlo','slow','eden','after'].includes(b.id)?'list':'cards',showDuration:false,showDescriptions:true}];
 const enquiry: [WidgetType,Record<string,unknown>]=['enquiry',{title:creative?'Let’s make something.':food?'Ask about an order':'Have something in mind?',buttonLabel:creative?'Talk about a project':food?'Ask about collection':'Send an enquiry',intro:creative?'An idea, a brief or a first question. Start here.':'Tell us a little about what you have in mind.',variant:['form','maya','pace','petal','current'].includes(b.id)?'card':'button'}];
 const faq:[WidgetType,Record<string,unknown>]=['faq',{title:'A couple of useful things',variant:['liv','lune','slow','current'].includes(b.id)?'cards':'list'}];
 const blocks: [WidgetType,Record<string,unknown>][] = b.id==='maya'?[text,enquiry,gallery,list]:b.id==='sora'||b.id==='field'||b.id==='ellis'||b.id==='eden'||b.id==='leon'?[gallery,text,list,enquiry]:b.id==='good'?[text,list,faq,enquiry]:food?[list,gallery,['hours',{variant:'status'}],enquiry,faq]:b.id==='pace'?[gallery,list,enquiry,text]:b.id==='edit'?[gallery,text,enquiry,list]:b.id==='current'?[list,enquiry,faq,['hours',{variant:'compact'}]]:b.id==='form'||b.id==='petal'?[gallery,enquiry,list,text,faq]:[list,gallery,text,enquiry,faq];
 if (b.id==='form'||b.id==='edit') {
  content.identity.heroImage=undefined;
  content.products=[{id:`${b.id}-collection`,kind:'product',name:b.id==='form'?'The studio collection':'The current rail',description:b.id==='form'?'Handmade vessels in chalk, speckle and terracotta. Ask about the pieces available or a made-to-order set.':'A changing selection of pre-owned outerwear. Ask about sizes, condition and the pieces currently available.',image:art,images:[],facts:[],currency:'GBP',availability:'available',mode:'enquire'}];
  blocks.splice(0,1,['products',{title:b.id==='form'?'Made slowly. Used every day.':'Found once. Worn again.',variant:'catalogue'}]);
 }
 return {label:b.label,content,widgets:()=>[...blocks,...(statement[b.id]?[['text',{title:'A little about me',body:b.bio,variant:'note'}] as [WidgetType,Record<string,unknown>]]:[])].map(([type,settings],i)=>{
  const block=newWidget(type,settings);
  const treatment=COLLECTION_SURFACES[b.id]?.[type];
  return {...block,id:`collection-${b.id}-${i}`,...(treatment?{appearance:applySectionTreatment(block.appearance,treatment)}:{})};
 })};
}
export const COLLECTION_SCENARIOS=Object.fromEntries(COLLECTION_BRIEFS.map(b=>[b.id,build(b)])) as Record<CollectionScenario,ScenarioRecord>;
