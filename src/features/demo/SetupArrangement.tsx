"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { PROFILE_CHOICES } from "@/features/page/contracts/style";
import { recommendArrangement } from "@/features/page/themes/arrangement";
import { resolveStyle } from "@/features/page/themes/resolve";
import { ChoicePreview } from "@/features/preview/ChoicePreview";
import { useDemo, initialState } from "./store";

type Id = (typeof PROFILE_CHOICES)[number]["id"];

const INK = "#1b1c1f", LINE = "#8a8d96", PHOTO = "#cdd2da", ACCENT = "#2856d8";

/** A small drawing of each arrangement: where the photo, the mark and the words sit. Same tile proportions as the looks. */
function Drawing({ id }: { id: Id }) {
  const mark = (x: number, y: number, r = 8, round = false) => <rect x={x} y={y} width={r * 2} height={r * 2} rx={round ? r : 6} fill={INK} />;
  const lines = (x: number, y: number, w = 86, centre = false) => {
    const x1 = centre ? x - w / 2 : x, x2 = centre ? x - w * 0.3 : x;
    return <><rect x={x1} y={y} width={w} height="5" rx="2.5" fill={INK} /><rect x={x2} y={y + 11} width={w * 0.6} height="4" rx="2" fill={LINE} /></>;
  };
  const pill = (x: number, y: number, w: number) => <rect x={x} y={y} width={w} height="9" rx="4.5" fill={ACCENT} />;
  let art: React.ReactNode;
  switch (id) {
    case "framed": art = <><rect x="18" y="16" width="209" height="64" rx="14" fill={PHOTO} />{mark(32, 62, 14)}{lines(32, 100, 100)}{pill(32, 136, 70)}</>; break;
    case "melt": art = <><defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PHOTO} /><stop offset="1" stopColor={PHOTO} stopOpacity="0" /></linearGradient></defs><rect x="0" y="0" width="245" height="96" fill="url(#m)" />{mark(26, 54, 14)}{lines(26, 100, 100)}{pill(26, 136, 70)}</>; break;
    case "identity": art = <><rect x="18" y="16" width="209" height="56" rx="14" fill={PHOTO} /><circle cx="122.5" cy="76" r="18" fill={INK} stroke="#fff" strokeWidth="4" />{lines(122.5, 108, 96, true)}{pill(87, 140, 71)}</>; break;
    case "masthead": art = <>{lines(26, 22, 150)}<rect x="26" y="48" width="104" height="9" rx="4.5" fill={INK} /><rect x="26" y="70" width="193" height="62" rx="12" fill={PHOTO} />{pill(26, 142, 70)}</>; break;
    case "duo": art = <>{mark(26, 28, 14)}{lines(26, 74, 80)}{pill(26, 112, 60)}<rect x="130" y="24" width="89" height="116" rx="14" fill={PHOTO} /></>; break;
    case "lifted": art = <><rect x="18" y="16" width="209" height="136" rx="16" fill={PHOTO} /><rect x="34" y="78" width="177" height="58" rx="12" fill="#fff" stroke="#e1e2e6" />{mark(46, 90, 11)}<rect x="76" y="92" width="80" height="5" rx="2.5" fill={INK} /><rect x="76" y="104" width="50" height="4" rx="2" fill={LINE} /></>; break;
    case "split": art = <><rect x="0" y="0" width="245" height="76" fill={PHOTO} /><rect x="26" y="60" width="32" height="32" rx="9" fill={INK} stroke="#fff" strokeWidth="4" />{lines(26, 108, 100)}{pill(26, 142, 70)}</>; break;
    case "bento": art = <><rect x="34" y="20" width="177" height="128" rx="18" fill="#fff" stroke="#e1e2e6" /><circle cx="122.5" cy="52" r="15" fill={INK} />{lines(122.5, 78, 90, true)}{pill(85, 118, 75)}</>; break;
    default: art = <>{lines(26, 26, 170)}<rect x="26" y="52" width="150" height="12" rx="6" fill={INK} /><rect x="26" y="74" width="110" height="12" rx="6" fill={INK} />{lines(26, 104, 90)}{pill(26, 138, 70)}</>; break;
  }
  return <svg viewBox="0 0 245 168" aria-hidden="true" className="arr-drawing">{art}</svg>;
}

/** Profile arrangement as its own task: a large demonstration of the choice on the owner's own page, and a clear set of options under it. */
export function SetupArrangement() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [open, setOpen] = React.useState(false);
  const layout = resolveStyle(s.page.themeId, s.page.appearance).spec.header.layout;
  const suggestion = recommendArrangement(s.content.identity);
  const current = PROFILE_CHOICES.find((c) => c.id === layout);
  const pick = (id: Id) => update((st) => ({ ...st, page: { ...st.page, appearance: { ...st.page.appearance, header: { ...st.page.appearance.header, layout: id, align: id === "bento" || id === "identity" ? "center" : "left" } } as typeof st.page.appearance } }));
  return (
    <>
      <button type="button" className="arr-trigger" data-testid="more-styling" onClick={() => setOpen(true)}>
        <span><b>Profile arrangement</b><small>{current?.name ?? "Choose how your profile is laid out"}</small></span>
        <ChevronRight aria-hidden="true" />
      </button>
      <Overlay open={open} onOpenChange={setOpen} title="Profile arrangement" footer={<Button className="min-h-11 w-full" onClick={() => setOpen(false)}>Done</Button>} testId="arrangement-dialog">
        <div className="arr-body">
          <div className="arr-demo-wrap">
            <div className="arr-demo" data-testid="arrangement-demo" data-layout={layout}>
              <ChoicePreview src={`/demo/preview?header=${layout}`} title={`${current?.name ?? "Profile"} on your page`} height={520} />
            </div>
          </div>
          <fieldset className="arr-grid" data-testid="setup-profile-choices">
            <legend className="sr-only">Profile arrangement</legend>
            {PROFILE_CHOICES.map((item) => (
              <label key={item.id} className="arr-tile">
                <input type="radio" name="profile-arrangement" aria-label={item.name} checked={layout === item.id} onChange={() => pick(item.id)} />
                <span className="arr-art"><Drawing id={item.id} />{item.id === suggestion.id ? <em data-testid="arrangement-suggestion">Suggested</em> : null}</span>
                <span className="arr-name">{item.name}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </Overlay>
    </>
  );
}
