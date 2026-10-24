"use client";
import * as React from "react";
import {
  Palette,
  LayoutTemplate,
  CircleUserRound,
  ArrowRight,
} from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { ColorField, ImageField } from "@/features/page/editor/controls";
import { resolveStyle } from "@/features/page/themes/resolve";
import { LOOKS, PALETTES } from "@/features/page/themes/looks";
import { useDemo, initialState } from "./store";
import type { StyleOverrides } from "@/features/page/contracts/style";

/** Appearance edits use the same stored schema and renderer as the full editor. */
export function SetupDesign({ compact = false }: { compact?: boolean }) {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [panel, setPanel] = React.useState<"background" | "profile" | null>(
    null,
  );
  const look = LOOKS.find((l) => l.id === s.page.themeId);
  const background = s.page.appearance.background ?? look?.overrides.background;
  const header =
    s.page.appearance.header?.layout ??
    look?.overrides.header?.layout ??
    "minimal";
  const patch = (changes: StyleOverrides) =>
    update((st) => ({
      ...st,
      setupDrafts: {
        ...st.setupDrafts,
        ...(changes.background || changes.colors || changes.decoration
          ? { backgroundEdited: true }
          : {}),
      },
      page: { ...st.page, appearance: { ...st.page.appearance, ...changes } },
    }));
  const choose = (dark: boolean, gradient: boolean) =>
    patch({
      colors: {
        ...s.page.appearance.colors,
        background: dark ? "#000000" : "#ffffff",
        text: dark ? "#ffffff" : "#111111",
        muted: dark ? "#b0b0b0" : "#555555",
        surface: dark ? "#151515" : "#f5f5f5",
        accent: dark ? "#ffffff" : "#111111",
        accentText: dark ? "#000000" : "#ffffff",
        border: dark ? "#303030" : "#dedede",
      },
      background: gradient
        ? {
            kind: "gradient",
            from: dark ? "#000000" : "#ffffff",
            to: dark ? "#303030" : "#dddddd",
            angle: 135,
            motion: true,
            source: "logo",
          }
        : { kind: "solid", color: dark ? "#000000" : "#ffffff" },
      decoration: gradient ? "grain" : "none",
    });
  const resolved=resolveStyle(s.page.themeId,s.page.appearance,s.content.identity.logo?.accent).spec;
  const previewBackground=resolved.background.kind === "gradient" ? `linear-gradient(${resolved.background.angle}deg,${resolved.background.from},${resolved.background.to})` : resolved.colors.background;
  return (
    <div
      className={
        compact ? "setup-design-compact grid grid-cols-2 gap-2" : "grid gap-2"
      }
      data-testid="setup-design-controls"
    >
      <button
        className="setup-edit-row"
        type="button"
        onClick={() => setPanel("background")}
      >
        <Palette aria-hidden="true" className="size-4" />
        <span>
          Background & colours
          <span className="block text-xs font-normal text-muted-foreground">
            {background?.kind === "gradient"
              ? "Moving gradient"
              : background?.kind === "solid"
                ? "Plain colour"
                : "Use your logo colours or a neutral finish"}
          </span>
        </span>
        <ArrowRight aria-hidden="true" className="ml-auto size-4" />
      </button>
      <button
        className="setup-edit-row"
        type="button"
        onClick={() => setPanel("profile")}
      >
        <CircleUserRound aria-hidden="true" className="size-4" />
        <span>
          Profile arrangement
          <span className="block text-xs font-normal text-muted-foreground">
            {{minimal:"Compact",centered:"Centered",side:"Side by side",cover:"Photo cover",banner:"Photo fade",poster:"Editorial",editorial:"Editorial",feature:"Photo cover"}[header] ?? "Custom profile"}
          </span>
        </span>
        <LayoutTemplate aria-hidden="true" className="ml-auto size-4" />
      </button>
      <Overlay
        open={panel !== null}
        onOpenChange={(o) => !o && setPanel(null)}
        title={
          panel === "background"
            ? "Make the background yours"
            : "Arrange your profile"
        }
        testId="setup-design-dialog"
        footer={
          <Button className="min-h-11 w-full" onClick={() => setPanel(null)}>
            Done
          </Button>
        }
      >
        {panel === "background" ? (
          <div className="grid gap-5">
            <div className="setup-colour-preview" aria-hidden="true" style={{background:previewBackground,color:resolved.colors.text}}><span>{s.content.identity.name||"Your page"}</span><i style={{background:resolved.colors.surface,boxShadow:"0 8px 24px #0001"}}/><b style={{background:resolved.colors.accent,color:resolved.colors.accentText}}>Your next customer</b></div>
            <div className="setup-colour-palettes" role="group" aria-label="Colour palettes">{PALETTES.slice(0,6).map(p=><button type="button" key={p.id} aria-label={`${p.name} palette`} onClick={()=>patch({colors:p.colors,background:{kind:"solid",color:p.colors.background??"#ffffff"}})}><span style={{background:p.colors.background}}><i style={{background:p.colors.surface}}/><i style={{background:p.colors.accent}}/></span><b>{p.name}</b></button>)}</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "White", dark: false, gradient: false },
                { name: "Ink", dark: true, gradient: false },
                { name: "Silver gradient", dark: false, gradient: true },
                { name: "Smoke gradient", dark: true, gradient: true },
              ].map((p) => (
                <button
                  type="button"
                  key={p.name}
                  className="overflow-hidden rounded-2xl bg-neutral-50 p-2 text-left text-sm font-semibold"
                  onClick={() => choose(p.dark, p.gradient)}
                >
                  <span
                    className="mb-2 block h-20 rounded-xl"
                    style={{
                      background: p.gradient
                        ? `linear-gradient(135deg,${p.dark ? "#000,#555" : "#fff,#bcbcbc"})`
                        : p.dark
                          ? "#000"
                          : "#fff",
                    }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
            {background?.kind === "gradient" ? (
              <>
                <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
                  Follow my logo colours
                  <input
                    type="checkbox"
                    className="size-5 accent-black"
                    checked={background.source === "logo"}
                    onChange={(e) =>
                      patch({
                        background: {
                          ...background,
                          source: e.target.checked ? "logo" : "manual",
                        },
                      })
                    }
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  {s.content.identity.logo?.accent
                    ? "Your uploaded logo supplies the colour."
                    : "Without a coloured logo, your gradient stays black and white."}
                </p>
                <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
                  Gentle movement
                  <input
                    type="checkbox"
                    className="size-5 accent-black"
                    checked={background.motion}
                    onChange={(e) =>
                      patch({
                        background: { ...background, motion: e.target.checked },
                      })
                    }
                  />
                </label>
                <ColorField
                  label="Gradient start"
                  value={background.from}
                  onChange={(v) =>
                    patch({
                      background: { ...background, from: v, source: "manual" },
                    })
                  }
                />
                <ColorField
                  label="Gradient end"
                  value={background.to}
                  onChange={(v) =>
                    patch({
                      background: { ...background, to: v, source: "manual" },
                    })
                  }
                />
              </>
            ) : (
              <ColorField
                label="Background colour"
                value={
                  background?.kind === "solid" ? background.color : "#ffffff"
                }
                onChange={(v) =>
                  patch({
                    background: { kind: "solid", color: v },
                    colors: { ...s.page.appearance.colors, background: v },
                  })
                }
              />
            )}
            <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
              Fine grain texture
              <input
                type="checkbox"
                className="size-5 accent-black"
                checked={s.page.appearance.decoration === "grain"}
                onChange={(e) =>
                  patch({ decoration: e.target.checked ? "grain" : "none" })
                }
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Movement pauses for visitors who prefer reduced motion. Text
              contrast is checked by the page engine.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "minimal", name: "Compact" },
                  { id: "centered", name: "Centered" },
                  { id: "side", name: "Side by side" },
                  { id: "cover", name: "Photo cover" },
                  { id: "banner", name: "Photo fade" },
                  { id: "poster", name: "Editorial" },
                ] as const
              ).map((x) => (
                <button
                  type="button"
                  key={x.id}
                  aria-pressed={header === x.id}
                  disabled={
                    ["cover", "banner", "poster"].includes(x.id) &&
                    !s.content.identity.heroImage
                  }
                  className="setup-profile-choice"
                  onClick={() =>
                    patch({
                      header: { ...s.page.appearance.header, layout: x.id },
                    })
                  }
                >
                  <span aria-hidden="true" className="setup-profile-diagram" data-kind={x.id}><i/><b/><em/></span><span>{x.name}</span>
                </button>
              ))}
            </div>
            {!s.content.identity.heroImage ? (
              <ImageField purpose="cover" samples={false} label="Add a cover photo for photo layouts" cropAspect={16/9} defaultAlt={`${s.content.identity.name} cover`} value={s.content.identity.heroImage} onChange={image=>update(st=>({...st,content:{...st.content,identity:{...st.content.identity,heroImage:image??undefined}}}))}/>
            ) : null}
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Image shape</legend>
              <div className="flex gap-2">
                {(["logo", "circle", "square"] as const).map((shape) => (
                  <Button
                    key={shape}
                    type="button"
                    variant="outline"
                    aria-pressed={
                      (s.page.appearance.header?.avatarShape ?? "logo") ===
                      shape
                    }
                    onClick={() =>
                      patch({
                        header: {
                          ...s.page.appearance.header,
                          avatarShape: shape,
                        },
                      })
                    }
                  >
                    {shape === "logo"
                      ? "Whole logo"
                      : shape === "circle"
                        ? "Round"
                        : "Square"}
                  </Button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </Overlay>
    </div>
  );
}
