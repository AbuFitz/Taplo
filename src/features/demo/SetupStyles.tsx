"use client";
import * as React from "react";
import { Palette, ArrowUpRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { suggestedLooks } from "@/features/inspiration/suggest";
import { ThemeSwatch } from "./ThemeSwatch";
import { useDemo, initialState } from "./store";
import { resolveStyle } from "@/features/page/themes/resolve";
export function SetupThemes({ compact = false }: { compact?: boolean }) {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [open, setOpen] = React.useState(false);
  const looks = suggestedLooks(s.content.identity.industryKey);
  const [all, setAll] = React.useState(false);
  const visible = all
    ? looks
    : looks.filter((l, i) => i < 6 || l.id === s.page.themeId);
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
                update((st) => ({
                  ...st,
                  page: {
                    ...st.page,
                    themeId: look.id,
                    appearance: {
                      ...structuredClone(look.overrides),
                      header: {
                        ...look.overrides.header,
                        ...st.page.appearance.header,
                      },
                      layout: {
                        ...look.overrides.layout,
                        ...st.page.appearance.layout,
                      },
                    },
                  },
                }))
              }
            />
            <ThemeSwatch look={look} />
            <span>{look.name}</span>
          </label>
        ))}
      </div>
      {looks.length > 6 ? (
        <button
          type="button"
          className="setup-secondary mt-4"
          onClick={() => setAll((v) => !v)}
        >
          {all ? "Fewer themes" : "More themes"}
        </button>
      ) : null}
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
const COMPOSITIONS = [
  {
    id: "centered",
    name: "Portrait",
    density: "comfortable",
    rhythm: "even",
    align: "center",
  },
  {
    id: "side",
    name: "Compact",
    density: "compact",
    rhythm: "tight",
    align: "left",
  },
  {
    id: "editorial",
    name: "Editorial",
    density: "comfortable",
    rhythm: "editorial",
    align: "left",
  },
] as const;
/** These are real phone profile/rhythm settings, never desktop column diagrams. */
export function SetupMobileLayouts() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const style = resolveStyle(s.page.themeId, s.page.appearance).spec;
  const layout = style.header.layout;
  const patch = (item: (typeof COMPOSITIONS)[number]) =>
    update((st) => ({
      ...st,
      page: {
        ...st.page,
        appearance: {
          ...st.page.appearance,
          header: {
            ...st.page.appearance.header,
            layout: item.id,
            align: item.align,
          },
          text: { ...st.page.appearance.text, align: item.align },
          layout: {
            ...st.page.appearance.layout,
            density: item.density,
            rhythm: item.rhythm,
          },
          cards: {
            ...st.page.appearance.cards,
            padding: item.density === "compact" ? "compact" : "comfortable",
          },
        },
      },
    }));
  return (
    <fieldset>
      <legend className="setup-layout-heading">Mobile composition</legend>
      <div className="setup-mobile-layouts">
        {COMPOSITIONS.map((item) => (
          <label key={item.id} className="setup-mobile-choice">
            <input
              type="radio"
              name="mobile-composition"
              aria-label={item.name}
              checked={layout === item.id}
              onChange={() => patch(item)}
            />
            <span
              className="setup-mobile-diagram"
              data-composition={item.id}
              style={
                {
                  background: style.colors.background,
                  color: style.colors.text,
                  "--composition-surface": style.colors.surface,
                  "--composition-accent": style.colors.accent,
                } as React.CSSProperties
              }
            >
              <span className="setup-mini-identity">
                <i />
                <b>{s.content.identity.name || "Your name"}</b>
              </span>
              <em />
              <span className="setup-mini-widgets">
                <i />
                <i />
                <i />
              </span>
            </span>
            <span>{item.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
