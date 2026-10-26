"use client";
import * as React from "react";
import { Palette, ArrowUpRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { suggestedLooks } from "@/features/inspiration/suggest";
import { ThemeSwatch } from "./ThemeSwatch";
import { useDemo, initialState } from "./store";
import { PROFILE_CHOICES } from "@/features/page/contracts/style";
import { ImageField } from "@/features/page/editor/controls";
import { ChoicePreview } from "@/features/preview/ChoicePreview";
import { designsFor, applyDesign, getDesign, type Design } from "@/features/page/themes/designs";
import { DesignThumb } from "@/features/setup/DesignThumb";
import { resolveStyle } from "@/features/page/themes/resolve";
export function SetupThemes({ compact = false }: { compact?: boolean }) {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [open, setOpen] = React.useState(false);
  const looks = suggestedLooks(s.content.identity.industryKey);
  const key = s.content.identity.industryKey;
  const fitted = designsFor(key, 8);
  const current = getDesign(s.page.themeId) ?? looks.find((l) => l.id === s.page.themeId);
  const visible: Pick<Design, "id" | "name" | "overrides" | "recipe">[] = [...new Map([...(current ? [current] : []), ...fitted, ...(fitted.length < 4 ? looks.slice(0, 4) : [])].map((l) => [l.id, l] as const)).values()]
    .slice(0, 6).map((l) => ({ id: l.id, name: l.name, overrides: l.overrides, recipe: (l as Design).recipe ?? {} }));
  const grid = (
    <>
      <div
        className="setup-theme-grid"
        role="radiogroup"
        aria-label="Starting theme"
      >
        {visible.map((look) => (
          <label className="setup-theme-choice" key={look.id}>
            <input
              type="radio"
              name="starting-theme"
              aria-label={look.name}
              checked={s.page.themeId === look.id}
              onChange={() =>
                update((st) => {
                  const design = getDesign(look.id);
                  if (design) return { ...st, page: applyDesign(st.page, design) };
                  return { ...st, page: { ...st.page, themeId: look.id, appearance: structuredClone(look.overrides) } };
                })
              }
            />
            <span className="setup-theme-snap" aria-hidden="true"><DesignThumb design={look} industryKey={key} own={s.content} height={640} /></span>
            <span>{look.name}</span>
          </label>
        ))}
      </div>
    </>
  );
  return compact ? (
    <>
      <button
        type="button"
        className="setup-edit-row"
        onClick={() => setOpen(true)}
      >
        <Palette aria-hidden="true" />
        <span>Choose a starting theme</span>
        <ArrowUpRight aria-hidden="true" className="ml-auto" />
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Choose a starting theme"
        footer={
          <Button className="w-full" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        {grid}
      </Overlay>
    </>
  ) : (
    <fieldset>
      <legend className="setup-layout-heading">Starting theme</legend>
      {grid}
    </fieldset>
  );
}
/** Three reviewed arrangements. Each preview renders the owner's actual identity. */
export function SetupMobileLayouts() {
 const {state,update}=useDemo();const s=state??initialState();const layout=resolveStyle(s.page.themeId,s.page.appearance).spec.header.layout;
 return <fieldset className="setup-profile-choices" data-testid="setup-profile-choices"><legend className="setup-layout-heading">Arrange your profile</legend><div className="grid grid-cols-3 gap-2">{PROFILE_CHOICES.map(item=><label key={item.id} className="setup-theme-choice"><input type="radio" name="profile-arrangement" aria-label={item.name} checked={layout===item.id} onChange={()=>update(st=>({...st,page:{...st.page,appearance:{...st.page.appearance,header:{...st.page.appearance.header,layout:item.id,align:item.id==='centered'?'center':'left'}}}}))}/><ChoicePreview src={`/demo/preview?header=${item.id}`} title={`${item.name} profile preview`} height={460}/><span>{item.name}</span></label>)}</div>{layout==='banner'?<div className="mt-4"><ImageField purpose="cover" presentation="identity" samples={false} label={s.content.identity.heroImage?'Cover photo':'Add a cover photo'} value={s.content.identity.heroImage??null} cropAspect={16/9} defaultAlt={`${s.content.identity.name} cover`} onChange={image=>update(st=>({...st,content:{...st.content,identity:{...st.content.identity,heroImage:image??undefined}}}))}/></div>:null}</fieldset>
}
