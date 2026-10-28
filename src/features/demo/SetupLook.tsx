"use client";
import * as React from "react";
import { Undo2 } from "lucide-react";
import { suggestedLooks } from "@/features/inspiration/suggest";
import { designsFor, applyDesign, getDesign, type Design } from "@/features/page/themes/designs";
import { COLOURWAYS, applyColourway, getColourway, type Colourway } from "@/features/page/themes/colourways";
import type { PageDoc } from "@/features/page/contracts/page";
import type { StyleOverrides } from "@/features/page/contracts/style";
import { DesignThumb } from "@/features/setup/DesignThumb";
import { useDemo, initialState, type DemoState } from "./store";
import { SetupMobileLayouts } from "./SetupStyles";

type Tab = "looks" | "colours";
type Tile = Pick<Design, "id" | "name" | "overrides" | "recipe">;

/** What a page would look like if this colourway were put on it, without touching anything else. */
const withColours = (base: StyleOverrides, cw: Colourway | undefined, motion: boolean): StyleOverrides =>
  cw ? (applyColourway({ appearance: base } as PageDoc, cw, { motion }).appearance as StyleOverrides) : base;

/**
 * One calm choice instead of five technical ones. Looks set type, arrangement and how sections sit; Colours set colour and background.
 * Colours chosen by the owner stay when the look changes, and the look's own palette is always one explicit tap away. Nothing moves
 * until the owner turns movement on.
 */
export function SetupLook() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const key = s.content.identity.industryKey;
  const drafts = s.setupDrafts ?? {};
  const pinned = getColourway(drafts.colourway);
  const motion = Boolean(drafts.colourMotion);
  const [tab, setTab] = React.useState<Tab>("looks");
  const [note, setNote] = React.useState("");

  // The shelf keeps its order while the owner chooses, so picking a look never shuffles the others.
  const looks = suggestedLooks(key);
  const fitted = designsFor(key, 8);
  const current = getDesign(s.page.themeId) ?? looks.find((l) => l.id === s.page.themeId);
  const pool = [...new Map([...(current ? [current] : []), ...fitted, ...(fitted.length < 4 ? looks.slice(0, 4) : [])].map((l) => [l.id, l] as const)).values()];
  const [frozen, setFrozen] = React.useState<{ key: string; ids: string[] }>({ key, ids: pool.slice(0, 6).map((l) => l.id) });
  React.useEffect(() => { if (frozen.key !== key) setFrozen({ key, ids: pool.slice(0, 6).map((l) => l.id) }); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const ids = frozen.key === key ? frozen.ids : pool.slice(0, 6).map((l) => l.id);
  const known = new Map([...looks, ...fitted, ...(current ? [current] : [])].map((l) => [l.id, l] as const));
  const tiles: Tile[] = ids.flatMap((id) => { const l = known.get(id); return l ? [{ id: l.id, name: l.name, overrides: l.overrides, recipe: (l as Design).recipe ?? {} }] : []; });

  const remember = (st: DemoState): NonNullable<DemoState["setupDrafts"]>["colourUndo"] => ({ appearance: structuredClone(st.page.appearance), colourway: st.setupDrafts?.colourway, colourMotion: st.setupDrafts?.colourMotion });

  const chooseLook = (tile: Tile) => {
    update((st) => {
      const design = getDesign(tile.id);
      let page: PageDoc = design ? applyDesign(st.page, design, { reorder: true }) : { ...st.page, themeId: tile.id, appearance: structuredClone(tile.overrides) };
      const cw = getColourway(st.setupDrafts?.colourway);
      if (cw) page = applyColourway(page, cw, { motion: Boolean(st.setupDrafts?.colourMotion) });
      return { ...st, page, setupDrafts: { ...st.setupDrafts, colourUndo: remember(st) } };
    });
    setNote(pinned ? `Your ${pinned.name} colours stay on ${tile.name}.` : "");
  };

  const chooseColourway = (cw: Colourway) => {
    update((st) => ({ ...st, page: applyColourway(st.page, cw), setupDrafts: { ...st.setupDrafts, colourway: cw.id, colourMotion: false, colourUndo: remember(st) } }));
    setNote("");
  };

  const ownColours = () => {
    update((st) => {
      const design = getDesign(st.page.themeId);
      const own = design?.overrides ?? (suggestedLooks(key).find((l) => l.id === st.page.themeId)?.overrides);
      const old = st.page.appearance as StyleOverrides;
      const appearance = own ? ({ ...old, colors: structuredClone(own.colors), background: structuredClone(own.background) } as StyleOverrides) : old;
      return { ...st, page: { ...st.page, appearance }, setupDrafts: { ...st.setupDrafts, colourway: undefined, colourMotion: false, colourUndo: remember(st) } };
    });
    setNote("");
  };

  const setMotion = (on: boolean) => {
    if (!pinned) return;
    update((st) => ({ ...st, page: applyColourway(st.page, pinned, { motion: on }), setupDrafts: { ...st.setupDrafts, colourMotion: on, colourUndo: remember(st) } }));
  };

  const undo = () => {
    update((st) => {
      const u = st.setupDrafts?.colourUndo;
      if (!u) return st;
      return { ...st, page: { ...st.page, appearance: structuredClone(u.appearance) as StyleOverrides }, setupDrafts: { ...st.setupDrafts, colourway: u.colourway, colourMotion: u.colourMotion, colourUndo: undefined } };
    });
    setNote("");
  };

  const base = (getDesign(s.page.themeId)?.overrides ?? (s.page.appearance as StyleOverrides));
  const colourTiles: { id: string; name: string; kind: string; cw?: Colourway }[] = [
    { id: "own", name: "This look’s own", kind: "Original palette" },
    ...COLOURWAYS.map((cw) => ({ id: cw.id, name: cw.name, kind: cw.kind, cw })),
  ];
  const selectedColour = pinned ? pinned.id : "own";
  const design = getDesign(s.page.themeId) ?? tiles[0];

  return (
    <div className="setup-look" data-testid="setup-look">
      <div className="setup-look-tabs" role="radiogroup" aria-label="What to change">
        {([["looks", "Looks"], ["colours", "Colours"]] as const).map(([id, label]) => (
          <label key={id} data-selected={tab === id}>
            <input type="radio" name="look-tab" checked={tab === id} onChange={() => setTab(id)} aria-label={label} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {tab === "looks" ? (
        <div className="setup-look-grid" role="radiogroup" aria-label="Looks">
          {tiles.map((tile) => (
            <label className="setup-look-tile" key={tile.id}>
              <input type="radio" name="look" aria-label={tile.name} checked={s.page.themeId === tile.id} onChange={() => chooseLook(tile)} />
              <span className="setup-look-art" aria-hidden="true">
                <DesignThumb design={tile} industryKey={key} own={s.content} height={600} overrides={withColours(tile.overrides, pinned, motion)} />
              </span>
              <span className="setup-look-name">{tile.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="setup-look-grid" role="radiogroup" aria-label="Colours">
            {colourTiles.map((t) => (
              <label className="setup-look-tile" key={t.id}>
                <input type="radio" name="colours" aria-label={t.name} checked={selectedColour === t.id} onChange={() => (t.cw ? chooseColourway(t.cw) : ownColours())} />
                <span className="setup-look-art" aria-hidden="true">
                  {design ? <DesignThumb design={design} industryKey={key} own={s.content} height={600} overrides={t.cw ? withColours(base, t.cw, false) : base} /> : null}
                </span>
                <span className="setup-look-name">{t.name}</span>
                <span className="setup-look-kind">{t.kind}</span>
              </label>
            ))}
          </div>
          {pinned?.moving ? (
            <label className="setup-look-motion">
              <input type="checkbox" checked={motion} onChange={(e) => setMotion(e.target.checked)} />
              <span><b>Subtle background movement</b><small>Off until you choose it. It still looks complete when it is still, and pauses if your visitors prefer less motion.</small></span>
            </label>
          ) : null}
        </div>
      )}

      <p className="setup-look-note" role="status" aria-live="polite">{note}</p>
      {drafts.colourUndo ? (
        <button type="button" className="setup-look-undo" onClick={undo}><Undo2 aria-hidden="true" /> Undo last change</button>
      ) : null}

      <details className="setup-more setup-look-more" data-testid="more-styling">
        <summary className="setup-secondary cursor-pointer list-none">Profile arrangement · Optional</summary>
        <div className="mt-4 grid gap-5"><SetupMobileLayouts /></div>
      </details>
    </div>
  );
}
