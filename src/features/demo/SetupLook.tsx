"use client";
import * as React from "react";
import { Undo2 } from "lucide-react";
import { SETUP_LOOKS, applyStartingLook, getStartingLook, startingLookOf, type StartingLook } from "@/features/page/themes/starting-looks";
import { PALETTES, applyPalette, getPalette, logoPalette, lookStillBackground, originalPalette, palettesFor, type Palette } from "@/features/page/themes/palettes";
import { readsWell } from "@/features/page/themes/image-palette";
import { recommendArrangement } from "@/features/page/themes/arrangement";
import { shaderFallbackCss, resolveStyle } from "@/features/page/themes/resolve";
import { PROFILE_CHOICES, type StyleOverrides } from "@/features/page/contracts/style";
import { pageDocSchema } from "@/features/page/contracts/page";
import type { PageDoc } from "@/features/page/contracts/page";
import { useDemo, initialState, type DemoState } from "./store";
import { SetupMobileLayouts } from "./SetupStyles";

type Tab = "looks" | "colours";
type Background = NonNullable<StyleOverrides["background"]>;

const bgCss = (b: Background): string =>
  b.kind === "solid" ? b.color : b.kind === "gradient" ? `linear-gradient(${b.angle}deg,${b.from},${b.to})` : b.kind === "shader" ? shaderFallbackCss(b) : "#ddd";

/**
 * The look picture: a small abstract drawing of the result. The look's own background effect built from the palette, a card with a
 * mark tile and two lines, a block and the main action. No name, no logo, no letters.
 */
function LookArt({ look, palette }: { look: StartingLook; palette: Palette }) {
  return (
    <span className="look-art" aria-hidden="true" style={{ background: bgCss(lookStillBackground(look, palette.id === "original" ? undefined : palette)), backgroundColor: palette.base, boxShadow: `inset 0 0 0 1px ${palette.tone === "dark" ? "#ffffff1c" : "#0000001a"}` }}>
      <span className="look-art-card" style={{ background: palette.surface, boxShadow: `0 0 0 1px ${palette.border}` }}>
        <i className="look-art-mark" style={{ background: palette.accent }} />
        <span className="look-art-lines"><i style={{ background: palette.text, opacity: 0.78 }} /><i style={{ background: palette.muted }} /></span>
      </span>
      <span className="look-art-block" style={{ background: palette.surface, boxShadow: `0 0 0 1px ${palette.border}` }} />
      <span className="look-art-action" style={{ background: palette.accent }} />
    </span>
  );
}

/** The colour picture: the palette's ground, with its card surface and its action colour as two overlapping discs. */
function ColourArt({ palette }: { palette: Palette }) {
  return (
    <span className="setup-palette-swatch" aria-hidden="true" style={{ background: palette.base, borderColor: palette.border }}>
      <i className="setup-palette-heading" style={{ background: palette.text }} />
      <i className="setup-palette-card" style={{ background: palette.surface, borderColor: palette.border }}><i style={{ background: palette.muted }} /></i>
      <i className="setup-palette-action" style={{ background: palette.accent }} />
    </span>
  );
}

/**
 * Choose a look: *Looks* are the eight starting designs; *Colours* are a few coordinated palettes for the chosen look. A palette
 * recolours backgrounds, surfaces, text, borders and the action together and never changes the look's type, arrangement or effect.
 * A palette chosen on purpose stays when the look changes, with an explicit way back to the look's own colours, and Undo throughout.
 */
export function SetupLook() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const drafts = s.setupDrafts ?? {};
  const look = getStartingLook(drafts.colourway) ?? startingLookOf(s.page) ?? SETUP_LOOKS[0]!;
  const [tab, setTab] = React.useState<Tab>("colours");
  const [note, setNote] = React.useState("");

  const logoAccent = s.content.identity.logo?.accent;
  const logoOffer = React.useMemo(() => {
    if (!logoAccent) return null;
    const p = logoPalette(logoAccent, look);
    return p && readsWell({ background: p.base, text: p.text, muted: p.muted, surface: p.surface, accent: p.accent, accentText: p.accentText, border: p.border }) ? p : null;
  }, [logoAccent, look]);

  const paletteOf = (id: string | undefined, forLook: StartingLook): Palette | undefined => (id === "logo" ? (logoAccent ? logoPalette(logoAccent, forLook) ?? undefined : undefined) : getPalette(id, forLook));
  const remember = (st: DemoState) => ({ page: structuredClone(st.page), appearance: structuredClone(st.page.appearance), colourway: st.setupDrafts?.colourway, palette: st.setupDrafts?.palette });

  const chooseLook = (next: StartingLook) => {
    let message = "";
    update((st) => {
      let page: PageDoc = applyStartingLook(st.page, next, { reorder: true });
      const wanted = st.setupDrafts?.palette;
      const keep = paletteOf(wanted, next);
      if (wanted && keep) { page = applyPalette(page, next, keep); message = `Your ${keep.name} colours stay on this look.`; }
      else if (wanted) message = "That palette suits a different tone, so this look is using its own colours.";
      return { ...st, page, setupDrafts: { ...st.setupDrafts, colourway: next.id, palette: wanted && keep ? wanted : undefined, colourUndo: remember(st) } };
    });
    setNote(message);
  };

  const choosePalette = (p: Palette | undefined) => {
    update((st) => ({ ...st, page: applyPalette(st.page, look, p), setupDrafts: { ...st.setupDrafts, colourway: look.id, palette: p?.id, colourUndo: remember(st) } }));
    setNote("");
  };

  const undo = () => {
    update((st) => {
      const u = st.setupDrafts?.colourUndo;
      if (!u) return st;
      const previous = pageDocSchema.safeParse(u.page);
      return { ...st, page: previous.success ? previous.data : { ...st.page, appearance: structuredClone(u.appearance) as StyleOverrides }, setupDrafts: { ...st.setupDrafts, colourway: u.colourway, palette: u.palette, colourUndo: undefined } };
    });
    setNote("");
  };

  const suggestion = recommendArrangement(s.content.identity);
  const currentLayout = resolveStyle(s.page.themeId, s.page.appearance).spec.header.layout;
  const useSuggestion = () => update((st) => ({ ...st, page: { ...st.page, appearance: { ...st.page.appearance, header: { ...st.page.appearance.header, layout: suggestion.id, align: suggestion.id === "bento" || suggestion.id === "identity" ? "center" : "left" } } as StyleOverrides } }));

  const original = originalPalette(look);
  const palettes: Palette[] = [original, ...palettesFor(look), ...(logoOffer ? [logoOffer] : [])];
  const chosen = drafts.palette ?? "original";
  const shownLooks = SETUP_LOOKS;

  return (
    <div className="setup-look" data-testid="setup-look">
      <div className="setup-look-tabs" role="radiogroup" aria-label="What to change">
        {([["colours", "Colours"], ["looks", "Looks"]] as const).map(([id, label]) => (
          <label key={id} data-selected={tab === id}>
            <input type="radio" name="look-tab" checked={tab === id} onChange={() => setTab(id)} aria-label={label} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {tab === "looks" ? (
        <div className="setup-look-grid" role="radiogroup" aria-label="Looks">
          {shownLooks.map((l) => (
            <label className="setup-look-tile" key={l.id}>
              <input type="radio" name="look" aria-label={l.name} checked={look.id === l.id} onChange={() => chooseLook(l)} />
              <span className="setup-look-art"><LookArt look={l} palette={originalPalette(l)} /></span>
              <span className="setup-look-name">{l.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="setup-look-grid setup-colour-grid" role="radiogroup" aria-label="Colours">
            {palettes.map((p) => (
              <label className="setup-look-tile" key={p.id}>
                <input type="radio" name="palette" aria-label={p.id === "original" ? "Original colours" : p.name} checked={chosen === p.id} onChange={() => choosePalette(p.id === "original" ? undefined : p)} />
                <span className="setup-colour-art"><ColourArt palette={p} /></span>
                <span className="setup-look-name setup-colour-name">{p.id === "original" ? "Original" : p.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <p className="setup-look-note" role="status" aria-live="polite">{note}</p>
      {s.plan === "free" ? <p className="sf-help">You can try every look here. Free publishes with Signature; other looks need Core or above.</p> : null}
      {drafts.colourUndo ? <button type="button" className="setup-look-undo" onClick={undo}><Undo2 aria-hidden="true" /> Undo last change</button> : null}

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

export { PALETTES };
