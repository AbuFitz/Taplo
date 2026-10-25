import type { BusinessContentInput } from "@/features/businesses/content";
import type { StyleOverrides } from "@/features/page/contracts/style";
import { newWidget } from "./helpers";
import { applySectionTreatment } from "@/features/page/section-treatments";
import type { WidgetType } from "@/features/page/contracts/widgets";

/** Owner-requested pages. Facts and assets were checked against the businesses' own sites on 25 October 2026. */
const fix = "https://www.fixnowmechanics.co.uk";
const learn = "https://www.brightlearntutoring.co.uk";
const image = (src: string, alt: string) => ({src, alt});
const block = (id: string, type: WidgetType, settings: Record<string, unknown>, raised = false) => ({
  ...newWidget(type, settings), id, ...(raised ? {appearance:applySectionTreatment({},"raised")} : {}),
});

export const FIXNOW: BusinessContentInput = {
  identity: {
    name:"FixNow Mechanics", slug:"fixnowmechanics", industryKey:"mechanic", industryLabel:"Mobile mechanic",
    logo:{...image("/businesses/fixnow/wordmark.svg","FixNow Mechanics"),width:640,height:130,ink:"light"},
    tagline:"Diagnostics, servicing and repairs at your home or workplace in Hemel Hempstead and nearby towns.",
    heroImage:{...image("/businesses/fixnow/van.jpg","FixNow Mechanics service van"),width:1344,height:768,focal:{x:50,y:50}},
  },
  location:{mode:"service_area",locality:"Hemel Hempstead & nearby towns",timezone:"Europe/London"},
  contacts:{phone:"07354 915941",whatsapp:"+447354915941",email:"support@fixnowmechanics.co.uk",website:fix,social:[
    {platform:"instagram",url:"https://instagram.com/fixnowmechanics/"},
    {platform:"tiktok",url:"https://tiktok.com/@fixnowmechanics"},
    {platform:"facebook",url:"https://facebook.com/profile.php?id=61578083444630"},
  ]},
  about:"Mobile vehicle diagnostics, servicing and repairs. FixNow comes to your driveway, workplace or roadside. Coverage is approximately 25 miles by road from Hemel Hempstead; enter your postcode on the website to check your location.",
  booking:{mode:"contact",onlineBookingReady:false},
  services:[
    {id:"fn-diagnostics",name:"Mobile diagnostic",priceMode:"fixed",priceMinor:4500,currency:"GBP",description:"Mobile fault diagnosis. Tell us your vehicle details and symptoms when requesting a quote.",delivery:["mobile"],bookingMode:"contact",sortOrder:0,externalUrl:`${fix}/estimate`,externalLabel:"Get a quote"},
    {id:"fn-brakes",name:"Brakes",priceMode:"from",priceMinor:5500,currency:"GBP",description:"Brake repairs at your location. The final quote depends on your vehicle and the work required.",delivery:["mobile"],bookingMode:"contact",sortOrder:1,externalUrl:`${fix}/estimate`,externalLabel:"Get a quote"},
    {id:"fn-servicing",name:"Servicing",priceMode:"from",priceMinor:12900,currency:"GBP",description:"Mobile servicing. Check the available service options and request a quote for your vehicle.",delivery:["mobile"],bookingMode:"contact",sortOrder:2,externalUrl:`${fix}/estimate`,externalLabel:"Get a quote"},
    {id:"fn-repairs",name:"General repairs",priceMode:"quote",currency:"GBP",description:"Tell us what needs repairing so we can assess the job and provide a quote.",delivery:["mobile"],bookingMode:"contact",sortOrder:3,externalUrl:`${fix}/estimate`,externalLabel:"Describe the repair"},
    {id:"fn-electrical",name:"Electrical repairs",priceMode:"from",priceMinor:10000,currency:"GBP",delivery:["mobile"],bookingMode:"contact",sortOrder:4,externalUrl:`${fix}/estimate`,externalLabel:"Get a quote"},
    {id:"fn-suspension",name:"Suspension",priceMode:"quote",currency:"GBP",delivery:["mobile"],bookingMode:"contact",sortOrder:5,externalUrl:`${fix}/estimate`,externalLabel:"Get a quote"},
  ],
  products:[
    {id:"fn-f70",name:"Thinkware F70 Pro 32GB Front Dash Cam",priceMinor:12500,currency:"GBP",image:image("/businesses/fixnow/thinkware-f70-pro.jpg","Thinkware F70 Pro dash cam"),description:"Full HD front dash cam with a 32GB card and hardwire kit.",mode:"link",linkUrl:"https://shop.fixnowmechanics.co.uk/shop/thinkware-f70-pro-32gb-front-dash-cam",facts:[{label:"Camera",value:"Front"}]},
    {id:"fn-q200",name:"Thinkware Q200 Front & Rear Dash Cam",priceMinor:21900,currency:"GBP",image:image("/businesses/fixnow/thinkware-q200.jpg","Thinkware Q200 front and rear dash cam kit"),description:"2K front and rear dash cam kit with a GPS mount.",mode:"link",linkUrl:"https://shop.fixnowmechanics.co.uk/shop/thinkware-q200-2k-front-rear-dash-cam-with-gps-mount",facts:[{label:"Camera",value:"Front & rear"}]},
    {id:"fn-x800",name:"Thinkware X800 Front & Rear Dash Cam",priceMinor:24900,currency:"GBP",image:image("/businesses/fixnow/thinkware-x800.jpg","Thinkware X800 touchscreen dash cam kit"),description:"2K front and rear dash cam with a touchscreen display.",mode:"link",linkUrl:"https://shop.fixnowmechanics.co.uk/shop/thinkware-x800-2k-front-rear-dash-cam-with-touchscreen",facts:[{label:"Display",value:"Touchscreen"}]},
  ],
  gallery:[
    {id:"fn-van",image:image("/businesses/fixnow/van.jpg","FixNow Mechanics service van"),caption:"We come to you"},
    {id:"fn-work",image:image("/businesses/fixnow/mechanic.jpg","Vehicle repair work"),caption:"Mobile repairs"},
    {id:"fn-diagnostic",image:image("/businesses/fixnow/diagnostic.jpg","Vehicle diagnostic equipment"),caption:"Fault diagnosis"},
  ],
  reviewLinks:[{platform:"google",url:"https://share.google/9KkDSrnHkdPoeQLMl"}],
  faqs:[
    {id:"fn-area",question:"Do you cover my area?",answer:"FixNow covers approximately 25 miles by road from Hemel Hempstead. Enter your postcode when getting a quote to check coverage for your location."},
    {id:"fn-quote",question:"How do I get a quote?",answer:"Use the Get a quote link to enter your vehicle details, postcode and the work you need on the FixNow website."},
    {id:"fn-fitting",question:"Can you fit products from the shop?",answer:"Professional mobile fitting is available for eligible products and locations. Check the product page for compatibility, fitting options and availability."},
  ],
};

const tuition = (id:string,name:string,group:string,priceMinor:number,description:string,path:string) => ({
  id,name,group,priceMode:"fixed" as const,priceMinor,currency:"GBP",priceUnit:"month" as const,description,
  image:{...image(`/businesses/brightlearn/${id.includes("ks2") ? "ks2" : id.includes("ks3") ? "ks3" : "gcse"}.webp`,`${name} programme illustration`),fit:"contain" as const},
  delivery:["online" as const],bookingMode:"contact" as const,externalUrl:`${learn}${path}`,externalLabel:"View programme",
});
export const BRIGHTLEARN: BusinessContentInput = {
  identity:{name:"BrightLearn Tutoring",slug:"brightlearn",industryKey:"tutor",industryLabel:"Online maths tuition",tagline:"Maths that finally feels clear. Live online tuition for KS2, KS3 and GCSE.",logo:{...image("/businesses/brightlearn/logo.webp","BrightLearn brand mark"),width:128,height:128,ink:"dark"}},
  location:{mode:"online",locality:"Online across the UK",timezone:"Europe/London"},
  contacts:{whatsapp:"+447577702613",email:"info@brightlearntutoring.co.uk",website:learn,social:[
    {platform:"instagram",url:"https://instagram.com/brightlearn_tutoring/"},
    {platform:"tiktok",url:"https://tiktok.com/@brightlearntutoring"},
    {platform:"facebook",url:"https://facebook.com/p/BrightLearn-Tutoring-61592769766314/"},
    {platform:"linkedin",url:"https://linkedin.com/company/brightlearn-tutoring/"},
    {platform:"youtube",url:"https://youtube.com/channel/UCwLfSed7TDecNnVqY5RjuFQ"},
  ]},
  booking:{mode:"contact",onlineBookingReady:false},
  about:"Live online maths lessons following the English curriculum, with one-to-one support or small groups of five. Programmes include a learning plan and parent reports. Ask about a free introductory session to discuss your child’s needs.",
  services:[
    {id:"bl-intro",name:"Free introductory session",priceMode:"free",currency:"GBP",description:"Discuss the learner’s needs and find out which programme could suit them. Contact BrightLearn to arrange your introduction.",bookingMode:"contact",externalUrl:"https://wa.me/447577702613",externalLabel:"Ask about an introduction",sortOrder:0},
    {...tuition("bl-group-ks2","KS2 maths","Small groups",4000,"Four one-hour lessons per month in a group of five. £10 per lesson. Ages 9–11, including SATs preparation.","/ks2-maths-confidence-sats-preparation"),sortOrder:1},
    {...tuition("bl-group-ks3","KS3 maths","Small groups",9000,"Eight 90-minute lessons per month in a group of five. £11.25 per lesson. Support for Years 7–9.","/year-7-9-maths-support"),sortOrder:2},
    {...tuition("bl-group-gcse","GCSE maths","Small groups",10000,"Eight 90-minute lessons per month in a group of five. £12.50 per lesson. Foundation and Higher support.","/small-group-gcse-maths-revision"),sortOrder:3},
    {...tuition("bl-one-ks2","KS2 maths","One-to-one",6000,"Four one-hour lessons per month. £15 per lesson. Individual support for ages 9–11.","/online-one-to-one-maths-tutoring"),sortOrder:4},
    {...tuition("bl-one-ks3","KS3 maths","One-to-one",12000,"Eight 90-minute lessons per month. £15 per lesson. Individual support for Years 7–9.","/online-one-to-one-maths-tutoring"),sortOrder:5},
    {...tuition("bl-one-gcse","GCSE maths","One-to-one",14000,"Eight 90-minute lessons per month. £17.50 per lesson. Foundation, Higher and resit support.","/online-one-to-one-maths-tutoring"),sortOrder:6},
  ],
  faqs:[
    {id:"bl-online",question:"Where do lessons take place?",answer:"Lessons are live online and available across the UK. BrightLearn is based in North London. In-person tuition is not currently offered."},
    {id:"bl-groups",question:"How large are the groups?",answer:"Small-group programmes have five learners. Contact BrightLearn to discuss a suitable group and current availability."},
    {id:"bl-exams",question:"Which GCSE courses do you support?",answer:"AQA and Pearson Edexcel maths, including Foundation, Higher and resits."},
    {id:"bl-prices",question:"Are these monthly or per-lesson prices?",answer:"The displayed prices are per month. The programme descriptions show the number and length of lessons included, along with the price per lesson."},
  ],
};

export const REAL_BUSINESS_STYLES: Record<"fixnow"|"brightlearn",StyleOverrides> = {
  fixnow:{
    colors:{background:"#101114",surface:"#24262b",text:"#ffffff",muted:"#bec1c9",accent:"#f2b602",accentText:"#16140b",border:"#42454e"},
    background:{kind:"gradient",from:"#101114",to:"#272924",angle:145,motion:true,pace:"slow"},
    header:{layout:"banner",align:"left",avatarShape:"logo",actions:"icons",showLocation:true,scrim:"soft"},
    text:{headingFont:"geist",bodyFont:"inter",size:"md",headingWeight:"bold",headingCase:"normal",align:"left"},
    cards:{surface:"solid",opacity:100,radius:"lg",border:"none",shadow:"soft",padding:"comfortable"},
    buttons:{shape:"rounded",fill:"solid",shadow:"soft",showIcons:true},
    layout:{desktop:"split",width:"wide",density:"comfortable",rhythm:"editorial"},motion:"subtle",decoration:"none",
  },
  brightlearn:{
    colors:{background:"#e8edf4",surface:"#ffffff",text:"#1b293d",muted:"#506077",accent:"#243d68",accentText:"#ffffff",border:"#c4cdda"},
    background:{kind:"gradient",from:"#dfe8f4",to:"#f1ece2",angle:135,motion:true,pace:"slow"},
    header:{layout:"centered",align:"center",avatarShape:"logo",avatarSize:"md",actions:"icons",showLocation:true},
    text:{headingFont:"manrope",bodyFont:"inter",size:"md",headingWeight:"bold",headingCase:"normal",align:"left"},
    cards:{surface:"solid",opacity:100,radius:"xl",border:"none",shadow:"soft",padding:"comfortable"},
    buttons:{shape:"pill",fill:"solid",shadow:"soft",showIcons:true},
    layout:{desktop:"centered",width:"regular",density:"comfortable",rhythm:"editorial"},motion:"subtle",decoration:"none",
  },
};
export const REAL_BUSINESSES = {
  fixnow:{label:"FixNow Mechanics",content:FIXNOW,widgets:()=>[
    block("fn-quote","link",{label:"Get a quote",subtitle:"Check your postcode and tell us about your vehicle",url:`${fix}/estimate`,variant:"button"}),
    block("fn-services","serviceList",{title:"Mobile servicing and repairs",variant:"cards",showDuration:false},true),
    block("fn-shop","products",{title:"From the FixNow shop",variant:"swipe"}),
    block("fn-all-products","link",{label:"Browse the full shop",url:"https://shop.fixnowmechanics.co.uk/shop",variant:"compact"}),
    block("fn-coverage","text",{title:"We come to you",body:FIXNOW.about,variant:"note"},true),
    block("fn-gallery","gallery",{title:"On the road",variant:"filmstrip"}),
    block("fn-faq","faq",{title:"Before you book",variant:"cards"},true),
    block("fn-track","link",{label:"Track your job",url:`${fix}/track`,variant:"card"}),
    block("fn-reviews","link",{label:"FixNow on Google",url:"https://share.google/9KkDSrnHkdPoeQLMl",variant:"compact"}),
    block("fn-social","social",{variant:"icons"}),
    block("fn-website","link",{label:"FixNow website",url:fix,variant:"compact"}),
  ]},
  brightlearn:{label:"BrightLearn Tutoring",content:BRIGHTLEARN,widgets:()=>[
    block("bl-intro","featuredService",{serviceId:"bl-intro",headline:"New to BrightLearn?"},true),
    block("bl-about","text",{title:"Support that suits your child",body:BRIGHTLEARN.about,variant:"body"},true),
    block("bl-groups","priceMenu",{title:"Small-group programmes",serviceIds:["bl-group-ks2","bl-group-ks3","bl-group-gcse"],variant:"panels",showDescriptions:true},true),
    block("bl-one","priceMenu",{title:"One-to-one programmes",serviceIds:["bl-one-ks2","bl-one-ks3","bl-one-gcse"],variant:"panels",showDescriptions:true},true),
    block("bl-faq","faq",{title:"Questions from parents",variant:"cards"},true),
    block("bl-guides","link",{label:"Maths guides for parents",url:`${learn}/guides`,variant:"card"}),
    block("bl-social","social",{variant:"icons"}),
    block("bl-website","link",{label:"BrightLearn website",url:learn,variant:"compact"}),
  ]},
};
