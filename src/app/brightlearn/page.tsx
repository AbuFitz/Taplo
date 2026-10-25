import type { Metadata, Viewport } from "next";
import { resolveStyle } from "@/features/page/themes/resolve";
import { REAL_BUSINESS_STYLES } from "@/features/showcase/real-businesses";
import { BusinessPage } from "@/features/showcase/BusinessPage";
export const metadata:Metadata={title:"BrightLearn Tutoring | Taplo",description:"Live online maths tuition for KS2, KS3 and GCSE. Explore small-group and one-to-one programmes and ask about a free introduction.",robots:{index:false,follow:false}};
export const viewport:Viewport={themeColor:resolveStyle("open",REAL_BUSINESS_STYLES.brightlearn).cssVars["--tp-background"]};
export default function Page(){return <BusinessPage scenario="brightlearn" />;}
