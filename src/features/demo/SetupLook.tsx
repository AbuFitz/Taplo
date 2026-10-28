"use client";
import * as React from "react";
import { Palette, Undo2 } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { getDesign } from "@/features/page/themes/designs";
import { STARTING_LOOKS, applyStartingLook, startingLookOf, getStartingLook, type StartingLook } from "@/features/page/themes/starting-looks";
import { recommendArrangement } from "@/features/page/themes/arrangement";
import { paletteFromAccent, readsWell } from "@/features/page/themes/image-palette";
import { readableOn } from "@/features/page/themes/color";
import { shaderFallbackCss, resolveStyle } from "@/features/page/themes/resolve";
import { FONT_STACKS } from "@/features/page/themes/font-metadata";
import { PROFILE_CHOICES, type StyleOverrides } from "@/features/page/contracts/style";
import type { PageDoc } from "@/features/page/contracts/page";
import { useDemo, initialState, type DemoState } from "./store";
import { SetupMobileLayouts } from "./SetupStyles";

type Colours = NonNullable<StyleOverrides["colors"]>;
type Background = NonNullable<StyleOverrides["background"]>;

const bgCss = (b: Background): string =>
  b.kind === "solid" ? b.color : b.kind === "gradient" ? `linear-gradient(${b.angle}deg,${b.from},${b.to})` : b.kind === "shader" ? shaderFallbackCss(b) : "#ddd";

/** A small, consistent picture of a starting look: its background, a card with the mark and name in the look's own typeface, a block and the main action. */
function LookArt({ look, name }: { look: StartingLook; name: string }) {
  const c = look.colourway.colors;
  const font = FONT_STACKS[(getDesign(look.design)?.overrides.text?.headingFont ?? "inter") as keyof typeof FONT_STACKS];
  const shown = name.trim() || "Your business";
  return (
    <span className="look-art" aria-hidden="true" style={{ background: bgCss(look.colourway.background), backgroundColor: c.background }}>
      <span className="look-art-card" style={{ background: c.surface, color: c.text }}>
        <span className="look-art-avatar" style={{ background: c.accent, color: c.accentText }}>{shown[0]!.toUpperCase()}</span>
        <span className="look-art-copy">
          <b style={{ fontFamily: font }}>{shown}</b>
          <i style={{ background: c.text }} />
        </span>
      </span>
      <span className="look-art-block" style={{ background: c.surface }} />
      <span className="look-art-action" style={{ background: c.accent }} />
    </span>
  );
}

/** Accent swatches that suit most pages; the readable label colour is worked out, never chosen. */
const ACCENTS = ["#2856d8", "#0f766e", "#b4452c", "#7c3aed", "#be185d", "#a16207", "#111111", "#f2f2f2"];

/**
 * One collection of eight complete starting looks. Gradient looks move once chosen and solid looks stay still. Colours the owner has
 * adjusted by hand are kept when the look changes, with an explicit way back to the new look's own colours. Nothing here touches content.
 */
export function SetupLook() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const drafts = s.setupDrafts ?? {};
  const current = getStartingLook(drafts.colourway) ?? startingLookOf(s.page);
  const kept = drafts.keptColours as Partial<Colours> | undefined;
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  const remember = (st: DemoState) => ({ appearance: structuredClone(st.page.appearance), colourway: st.setupDrafts?.colourway, keptColours: st.setupDrafts?.keptColours });
  const withKept = (page: PageDoc, k: Partial<Colours> | undefined): PageDoc =>
    k && Object.keys(k).length ? { ...page, appearance: { ...page.appearance, colors: { ...(page.appearance.colors ?? {}), ...k } as Colours } as StyleOverrides } : page;

  const choose = (look: StartingLook) => {
    update((st) => {
      const k = st.setupDrafts?.keptColours as Partial<Colours> | undefined;
      const page = withKept(applyStartingLook(st.page, look, { reorder: true }), k);
      return { ...st, page, setupDrafts: { ...st.setupDrafts, colourway: look.id, colourUndo: remember(st) } };
    });
    setNote(kept && Object.keys(kept).length ? "Your adjusted colours stay on this look." : "");
  };

  const patchColours = (colors: Partial<Colours>) =>
    update((st) => {
      const keptNext = { ...(st.setupDrafts?.keptColours as Partial<Colours> | undefined), ...colors };
      const page = withKept(st.page, colors);
      return { ...st, page, setupDrafts: { ...st.setupDrafts, keptColours: keptNext, colourUndo: remember(st) } };
    });

  const useAccent = (hex: string) => patchColours({ accent: hex, accentText: readableOn(hex) });

  const logoAccent = s.content.identity.logo?.accent;
  const logoPalette = React.useMemo(() => {
    if (!logoAccent) return null;
    const dark = resolveStyle(s.page.themeId, s.page.appearance).attrs["data-tone"] === "dark";
    const p = paletteFromAccent(logoAccent, dark);
    return readsWell(p) ? p : null;
  }, [logoAccent, s.page.themeId, s.page.appearance]);

  const originalColours = () => {
    update((st) => {
      const look = getStartingLook(st.setupDrafts?.colourway) ?? current;
      const page = look ? applyStartingLook(st.page, look) : st.page;
      return { ...st, page, setupDrafts: { ...st.setupDrafts, keptColours: undefined, colourUndo: remember(st) } };
    });
    setNote("");
  };

  const undo = () => {
    update((st) => {
      const u = st.setupDrafts?.colourUndo;
      if (!u) return st;
      return { ...st, page: { ...st.page, appearance: structuredClone(u.appearance) as StyleOverrides }, setupDrafts: { ...st.setupDrafts, colourway: u.colourway, keptColours: u.keptColours, colourUndo: undefined } };
    });
    setNote("");
  };

  const suggestion = recommendArrangement(s.content.identity);
  const currentLayout = resolveStyle(s.page.themeId, s.page.appearance).spec.header.layout;
  const useSuggestion = () => update((st) => ({ ...st, page: { ...st.page, appearance: { ...st.page.appearance, header: { ...st.page.appearance.header, layout: suggestion.id, align: suggestion.id === "bento" || suggestion.id === "identity" ? "center" : "left" } } as StyleOverrides } }));
  const hasKept = Boolean(kept && Object.keys(kept).length);

  return (
    <div className="setup-look" data-testid="setup-look">
      <div className="setup-look-grid" role="radiogroup" aria-label="Looks">
        {STARTING_LOOKS.map((look) => (
          <label className="setup-look-tile" key={look.id}>
            <input type="radio" name="look" aria-label={look.name} checked={current?.id === look.id} onChange={() => choose(look)} />
            <span className="setup-look-art"><LookArt look={look} name={s.content.identity.name} /></span>
            <span className="setup-look-name">{look.name}</span>
            <span className="setup-look-kind">{look.animated ? "Moving gradient" : look.kind}</span>
          </label>
        ))}
      </div>

      <p className="setup-look-note" role="status" aria-live="polite">{note}</p>
      <div className="setup-look-actions">
        <button type="button" className="setup-look-adjust" onClick={() => setOpen(true)} data-testid="adjust-colours"><Palette aria-hidden="true" /> Adjust colours</button>
        {drafts.colourUndo ? <button type="button" className="setup-look-undo" onClick={undo}><Undo2 aria-hidden="true" /> Undo last change</button> : null}
      </div>

      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Adjust colours"
        footer={<Button className="min-h-11 w-full" onClick={() => setOpen(false)}>Done</Button>}
      >
        <div className="grid gap-6" data-testid="adjust-colours-panel">
          <section className="grid gap-3" aria-labelledby="adj-accent">
            <h3 id="adj-accent" className="text-sm font-semibold">Accent colour</h3>
            <p className="text-sm text-muted-foreground">Changes buttons and highlights. Text on top is chosen so it stays readable.</p>
            <div className="setup-adjust-swatches" role="radiogroup" aria-label="Accent colour">
              {ACCENTS.map((hex) => (
                <label key={hex} className="setup-adjust-swatch" style={{ background: hex }}>
                  <input type="radio" name="accent" aria-label={`Accent ${hex}`} checked={s.page.appearance.colors?.accent === hex} onChange={() => useAccent(hex)} />
                </label>
              ))}
            </div>
          </section>
          {logoAccent ? (
            <section className="grid gap-3" aria-labelledby="adj-logo" data-testid="logo-colours">
              <h3 id="adj-logo" className="text-sm font-semibold">From your logo</h3>
              {logoPalette ? (
                <>
                  <p className="text-sm text-muted-foreground">Suggested colours from your logo. Nothing changes until you choose them.</p>
                  <Button variant="outline" className="min-h-11 justify-self-start" onClick={() => patchColours(logoPalette)}>Use these colours</Button>
                </>
              ) : <p className="text-sm text-muted-foreground">Your logo’s colours don’t suit a page background, so none are suggested.</p>}
            </section>
          ) : null}
          <section className="grid gap-3" aria-labelledby="adj-orig">
            <h3 id="adj-orig" className="text-sm font-semibold">This look’s own colours</h3>
            <p className="text-sm text-muted-foreground">{hasKept ? "You have adjusted colours. They stay when you change looks." : "You have not adjusted any colours."}</p>
            <Button variant="outline" className="min-h-11 justify-self-start" disabled={!hasKept} onClick={originalColours}>Use this look’s original colours</Button>
          </section>
        </div>
      </Overlay>

      <details className="setup-more setup-look-more" data-testid="more-styling">
        <summary className="setup-secondary cursor-pointer list-none">Profile arrangement · Optional</summary>
        <div className="mt-4 grid gap-5">
          <div className="setup-look-suggest" data-testid="arrangement-suggestion">
            <p><b>Suggested: {PROFILE_CHOICES.find((c) => c.id === suggestion.id)?.name}</b><small>{suggestion.why}</small></p>
            {currentLayout !== suggestion.id ? <button type="button" className="setup-look-use" onClick={useSuggestion}>Use this</button> : <small>Already in use</small>}
          </div>
          <SetupMobileLayouts />
        </div>
      </details>
    </div>
  );
}
