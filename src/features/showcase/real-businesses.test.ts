import { expect, it } from "vitest";
import { initialConfig, toContent, toPage } from "./lab-state";
import { buildPageViewModel } from "@/features/page/renderer/view-model";
import { buildContext, isOnlineBookable, priceWording } from "@/features/booking/model";
import { serviceErrors } from "@/features/demo/ServiceForm";

it("BrightLearn retains its monthly programme prices through the content, renderer and booking models",()=>{
 const cfg=initialConfig("brightlearn"), content=toContent(cfg);
 const vm=buildPageViewModel(content,toPage(cfg),{plan:"business"});
 expect(vm.onlineBooking).toBe(false);
 expect(vm.notes).toEqual([]);
 expect(vm.visible.filter(w=>w.type==="priceMenu")).toHaveLength(2);
 const ctx=buildContext(content);
 expect(ctx.services.filter(s=>s.priceUnit==="month").map(priceWording)).toEqual(["£40 per month","£90 per month","£100 per month","£60 per month","£120 per month","£140 per month"]);
 expect(ctx.services.every(s=>s.externalUrl && !isOnlineBookable(s))).toBe(true);
 expect(content.staff).toHaveLength(0);
 expect(content.testimonials).toHaveLength(0);
});
it("FixNow uses the source quote and shop destinations without fabricated availability or reviews",()=>{
 const cfg=initialConfig("fixnow"), content=toContent(cfg);
 const vm=buildPageViewModel(content,toPage(cfg),{plan:"business"});
 expect(vm.onlineBooking).toBe(false);
 expect(vm.notes).toEqual([]);
 expect(content.services).toHaveLength(6);
 expect(content.services.every(s=>s.externalUrl==="https://www.fixnowmechanics.co.uk/estimate" && !s.durationMinutes)).toBe(true);
 expect(content.products.every(p=>p.mode==="link" && p.linkUrl?.startsWith("https://shop.fixnowmechanics.co.uk/shop/"))).toBe(true);
 expect(content.rating).toBeUndefined();
 expect(content.testimonials).toHaveLength(0);
});
it("existing-site service actions validate links and do not require a Taplo appointment duration",()=>{
 const service={...toContent(initialConfig("fixnow")).services[0],bookingMode:"instant" as const};
 expect(serviceErrors(service)).toEqual({});
 expect(isOnlineBookable(service)).toBe(false);
 expect(serviceErrors({...service,externalUrl:"javascript:alert(1)"})).toHaveProperty("link");
 expect(serviceErrors({...service,externalUrl:undefined})).toHaveProperty("duration");
});
