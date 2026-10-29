"use client";
import * as React from "react";
import { Palette, ArrowUpRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { suggestedLooks } from "@/features/inspiration/suggest";
import { useDemo, initialState } from "./store";
import { PROFILE_CHOICES } from "@/features/page/contracts/style";
import { ImageField } from "@/features/page/editor/controls";
import { ChoicePreview } from "@/features/preview/ChoicePreview";
import { FinishControl } from "@/features/appearance/FinishControl";
import { designsFor, applyDesign, applyFinish, getDesign, type Design } from "@/features/page/themes/designs";
import { DesignThumb } from "@/features/setup/DesignThumb";
import { resolveStyle } from "@/features/page/themes/resolve";
/** Three reviewed arrangements. Each preview renders the owner's actual identity. */
export function SetupMobileLayouts() {
 const {state,update}=useDemo();const s=state??initialState();const layout=resolveStyle(s.page.themeId,s.page.appearance).spec.header.layout;
 return <fieldset className="setup-profile-choices" data-testid="setup-profile-choices"><legend className="setup-layout-heading">Arrange your profile</legend><div className="grid grid-cols-3 gap-2">{PROFILE_CHOICES.map(item=><label key={item.id} className="setup-theme-choice"><input type="radio" name="profile-arrangement" aria-label={item.name} disabled={item.needs==="photo"&&!s.content.identity.heroImage} checked={layout===item.id} onChange={()=>update(st=>({...st,page:{...st.page,appearance:{...st.page.appearance,header:{...st.page.appearance.header,layout:item.id,align:item.id==='bento'||item.id==='identity'?'center':'left'}}}}))}/><ChoicePreview src={`/demo/preview?header=${item.id}`} title={`${item.name} profile preview`} height={460}/><span>{item.name}{item.needs==="photo"&&!s.content.identity.heroImage?<small className="setup-arr-needs">Needs a cover photo</small>:null}</span></label>)}</div>{['melt','split','banner'].includes(layout)?<div className="mt-4 grid gap-4"><ImageField purpose="cover" presentation="identity" samples={false} label={s.content.identity.heroImage?'Cover photo':'Add a cover photo'} value={s.content.identity.heroImage??null} cropAspect={16/9} defaultAlt={`${s.content.identity.name} cover`} onChange={image=>update(st=>({...st,content:{...st.content,identity:{...st.content.identity,heroImage:image??undefined}}}))}/></div>:null}</fieldset>
}

/** Material: what the page is made of. Applied on top of the chosen design and arrangement, and shown on the live draft. */
export function SetupMaterial() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const resolved = resolveStyle(s.page.themeId, s.page.appearance);
  const dark = resolved.attrs["data-tone"] === "dark";
  return (
    <fieldset className="setup-profile-choices" data-testid="setup-material">
      <legend className="setup-layout-heading">Material</legend>
      <FinishControl value={resolved.spec.layout.finish} dark={dark} onChange={(f) => update((st) => ({ ...st, page: { ...st.page, appearance: applyFinish(st.page.appearance, f, dark) } }))} />
    </fieldset>
  );
}
