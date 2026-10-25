import type { Metadata, Viewport } from "next";
import { resolveStyle } from "@/features/page/themes/resolve";
import { REAL_BUSINESS_STYLES } from "@/features/showcase/real-businesses";
import { BusinessPage } from "@/features/showcase/BusinessPage";
export const metadata:Metadata={title:"FixNow Mechanics | Taplo",description:"Mobile diagnostics, servicing and repairs in Hemel Hempstead and nearby towns. Get a quote or browse the FixNow shop.",robots:{index:false,follow:false}};
export const viewport:Viewport={themeColor:resolveStyle("ink",REAL_BUSINESS_STYLES.fixnow).cssVars["--tp-background"]};
export default function Page(){return <BusinessPage scenario="fixnow" />;}
