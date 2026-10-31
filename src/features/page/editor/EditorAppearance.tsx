"use client";

import * as React from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ContextHelp } from "./ContextHelp";
import "./design-studio.css";
import {
  useAppearanceModel,
  type AppearanceHost,
} from "@/features/appearance/model";
import {
  LookPicker,
  ColourControls,
  WallpaperControls,
  TypeControls,
  ButtonControls,
  SurfaceControls,
  LayoutControls,
  HeaderControls,
  Readability,
} from "@/features/appearance/sections";
import { ChoiceGrid } from "@/features/appearance/controls";
import { applyDesign, getDesign } from "@/features/page/themes/designs";
import { newId } from "@/features/demo/actions";
import { ColourSuggestion } from "./ColourSuggestion";
import { ImageField } from "./controls";
import { ProfileSections } from "./ContentTab";
import type { Editor } from "./useEditor";

/** The owner editor's host for the shared appearance model: values live in the page document, history is the editor's. */
function useEditorAppearance(
  ed: Editor,
  notify: (m: string, undoable?: boolean) => void,
) {
  const { setAppearance, setPage } = ed;
  const page = ed.state.page;
  const host = React.useMemo<AppearanceHost>(
    () => ({
      themeId: page.themeId,
      logoAccent: ed.state.content.identity.logo?.accent,
      overrides: page.appearance,
      canSwitchLook: ed.vm?.ent.themeSwitching ?? true,
      apply: (fn, coalesce) =>
        setAppearance(fn, coalesce ? `ap:${coalesce}` : undefined),
      // Choosing one of the designs brings its whole presentation (section styles included), as the gallery does; undo restores it.
      setAppearance: (themeId, appearance) =>
        setPage((p) => {
          const d = getDesign(themeId);
          return d && Object.keys(appearance).length === 0
            ? applyDesign(p, d)
            : { ...p, themeId, appearance };
        }),
      notify,
      saved: {
        limit: 12,
        items: page.savedLooks.map((l) => ({
          ...l,
          previewSrc: `/demo/preview?savedLook=${encodeURIComponent(l.id)}`,
          active:
            l.themeId === page.themeId &&
            JSON.stringify(l.overrides) === JSON.stringify(page.appearance),
        })),
        save: (name) => {
          setPage((p) => ({
            ...p,
            savedLooks:
              p.savedLooks.length >= 12
                ? p.savedLooks
                : [
                    ...p.savedLooks,
                    {
                      id: newId("look"),
                      name,
                      themeId: p.themeId,
                      overrides: structuredClone(p.appearance),
                    },
                  ],
          }));
          notify("Saved to My looks.");
        },
        apply: (id) => {
          setPage((p) => {
            const l = p.savedLooks.find((x) => x.id === id);
            return l
              ? {
                  ...p,
                  themeId: l.themeId,
                  appearance: structuredClone(l.overrides),
                }
              : p;
          });
          notify("Look applied.", true);
        },
        remove: (id) =>
          setPage((p) => ({
            ...p,
            savedLooks: p.savedLooks.filter((l) => l.id !== id),
          })),
      },
    }),
    [
      ed.state.content.identity.logo?.accent,
      page.themeId,
      page.appearance,
      page.savedLooks,
      ed.vm?.ent.themeSwitching,
      setAppearance,
      setPage,
      notify,
    ],
  );
  return useAppearanceModel(host);
}

type DesignTask =
  | "colours"
  | "look"
  | "wallpaper"
  | "type"
  | "buttons"
  | "cards"
  | "layout"
  | "readability";
const DESIGN_TASKS = [
  {
    id: "colours",
    name: "Colours",
    line: "A palette that works together",
    art: "palette",
  },
  {
    id: "look",
    name: "Starting look",
    line: "Change the whole composition",
    art: "looks",
  },
  {
    id: "wallpaper",
    name: "Background",
    line: "Colour, imagery and atmosphere",
    art: "wallpaper",
  },
  { id: "type", name: "Typography", line: "Find your voice", art: "type" },
  {
    id: "buttons",
    name: "Buttons",
    line: "Shape your calls to action",
    art: "buttons",
  },
  {
    id: "cards",
    name: "Block surfaces",
    line: "Floating, flat or framed",
    art: "cards",
  },
  {
    id: "layout",
    name: "Layout & motion",
    line: "Space, rhythm and movement",
    art: "layout",
  },
  {
    id: "readability",
    name: "Readability",
    line: "Check contrast and comfortable text",
    art: "type",
  },
] as const;

/** One design decision at a time, using the same document/history model as the public renderer. */
export function PageStylePanel({
  ed,
  notify,
}: {
  ed: Editor;
  notify: (m: string, undoable?: boolean) => void;
}) {
  const m = useEditorAppearance(ed, notify);
  const [task, setTask] = React.useState<DesignTask | null>(null);
  const chosen = DESIGN_TASKS.find((t) => t.id === task);
  return (
    <div className="design-studio" data-testid="appearance-panel">
      {chosen ? (
        <>
          <div className="design-task-heading">
            <button
              type="button"
              onClick={() => setTask(null)}
              aria-label="Back to design"
            >
              <ArrowLeft />
            </button>
            <div>
              <h2>{chosen.name}</h2>
              <p>{chosen.line}</p>
            </div>
          </div>
          <div key={task} className="design-task-controls">
            {task === "colours" ? (
              <ColourControls m={m} guided />
            ) : task === "look" ? (
              <LookPicker m={m} />
            ) : task === "wallpaper" ? (
              <WallpaperControls m={m} />
            ) : task === "type" ? (
              <TypeControls m={m} />
            ) : task === "buttons" ? (
              <ButtonControls m={m} />
            ) : task === "cards" ? (
              <SurfaceControls m={m} />
            ) : task === "readability" ? (
              <Readability m={m} />
            ) : (
              <LayoutControls m={m} />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="design-studio-heading">
            <h2>Make it yours.</h2>
            <p>Start with one detail. Everything works together.</p>
          </div>
          <div className="design-task-list">
            {DESIGN_TASKS.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTask(t.id)}
                data-design-task={t.id}
              >
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.line}</small>
                </span>
                <span
                  className="design-task-art"
                  data-art={t.art}
                  aria-hidden="true"
                >
                  {t.art === "type" ? (
                    <b>Aa</b>
                  ) : t.art === "palette" ? (
                    <>
                      <i style={{ background: m.spec.colors.background }} />
                      <i style={{ background: m.spec.colors.accent }} />
                      <i style={{ background: m.spec.colors.text }} />
                    </>
                  ) : t.art === "buttons" ? (
                    <>
                      <i />
                      <i />
                    </>
                  ) : (
                    <>
                      <i />
                      <i />
                      <i />
                    </>
                  )}
                </span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <ContextHelp topic="design" />
          <button
            type="button"
            className="design-reset"
            disabled={m.totalChanges === 0}
            onClick={m.resetAll}
          >
            Reset style changes
          </button>
        </>
      )}
    </div>
  );
}

/** Which channel is the page's main action. Separate from widget order: choosing it never moves anything. */
export function MainActionControl({ ed }: { ed: Editor }) {
  const page = ed.state.page;
  const c = ed.state.content;
  const has = {
    book:
      page.widgets.some((w) => w.type === "booking" && !w.hidden) ||
      Boolean(ed.vm?.onlineBooking),
    call: Boolean(c.contacts.phone),
    whatsapp: Boolean(c.contacts.whatsapp),
    email: Boolean(c.contacts.email),
  };
  const options = [
    { value: "auto", label: "Automatic" },
    { value: "book", label: "Booking", disabled: !has.book },
    { value: "call", label: "Call", disabled: !has.call },
    { value: "whatsapp", label: "WhatsApp", disabled: !has.whatsapp },
    { value: "email", label: "Email", disabled: !has.email },
    { value: "none", label: "None" },
  ] as const;
  const current = ed.vm?.primary?.kind;
  return (
    <div className="grid gap-3" data-testid="main-action">
      <ChoiceGrid
        label="Main action"
        value={page.meta.primaryAction}
        columns={3}
        onChange={(v) =>
          ed.setPage((p) => ({ ...p, meta: { ...p.meta, primaryAction: v } }))
        }
        options={options.map((o) => ({ ...o }))}
      />
      <p className="text-xs text-neutral-500">
        {current
          ? `Right now your main action is ${ed.vm!.primary!.label}.`
          : "No main action yet: add a phone number, email or booking."}{" "}
        It sits at the top of your page. Your blocks stay in the order you set.
      </p>
    </div>
  );
}

/** Name, logo, cover and header composition: identity fields from the business record, composition from the shared model. */
export function HeaderPanel({
  ed,
  notify,
}: {
  ed: Editor;
  notify: (m: string, undoable?: boolean) => void;
}) {
  const m = useEditorAppearance(ed, notify);
  const c = ed.state.content;
  const [area, setArea] = React.useState<string | null>(null);
  const areas = [
    {
      id: "identity",
      name: "Your identity",
      line: "Name, introduction and business details",
      art: "type",
    },
    {
      id: "layout",
      name: "Profile layout",
      line: "Choose how your page opens",
      art: "looks",
    },
    {
      id: "images",
      name: "Logo & cover",
      line: "Frame your business beautifully",
      art: "wallpaper",
    },
    {
      id: "action",
      name: "Main action",
      line: "Make the next step obvious",
      art: "buttons",
    },
  ];
  const current = areas.find((a) => a.id === area);
  return (
    <div className="design-studio" data-testid="header-panel">
      {current ? (
        <>
          <div className="design-task-heading">
            <button
              type="button"
              onClick={() => setArea(null)}
              aria-label="Back to profile"
            >
              <ArrowLeft />
            </button>
            <div>
              <h2>{current.name}</h2>
              <p>{current.line}</p>
            </div>
          </div>
          {area === "identity" ? (
            <ProfileSections ed={ed} only="identity" identityOpen />
          ) : null}
          {area === "layout" ? (
            <HeaderControls m={m} identity={c.identity} livePreviews />
          ) : null}
          {area === "action" ? <MainActionControl ed={ed} /> : null}
          {area === "images" ? (
            <div className="grid gap-6">
              <ImageField
                presentation="identity"
                purpose="identity"
                label="Logo or profile picture"
                samples={false}
                cropAspect={1}
                cropRound={m.spec.header.avatarShape === "circle"}
                value={c.identity.logo ?? null}
                defaultAlt={`${c.identity.name || "Business"} logo`}
                maxEdge={640}
                onChange={(v) =>
                  ed.setContent((x) => ({
                    ...x,
                    identity: { ...x.identity, logo: v ?? undefined },
                  }))
                }
                focalHint="Keep your face or mark in view. Wide logos are always shown whole."
              />
              {m.spec.header.avatarShape === "none" && c.identity.logo ? (
                <p className="text-xs text-neutral-600">
                  Your picture is saved. Choose a picture shape in Profile
                  layout to show it.
                </p>
              ) : null}
              <ImageField
                presentation="cover"
                purpose="cover"
                label="Cover photo"
                samples={false}
                cropAspect={16 / 7}
                value={c.identity.heroImage ?? null}
                defaultAlt={`${c.identity.name || "Business"} cover photo`}
                maxEdge={1400}
                onChange={(v) =>
                  ed.setContent((x) => ({
                    ...x,
                    identity: { ...x.identity, heroImage: v ?? undefined },
                  }))
                }
                focalHint="Choose the part that should stay in view on phones and computers."
              />
              <ColourSuggestion
                ed={ed}
                image={c.identity.heroImage ?? c.identity.logo}
                notify={notify}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="design-studio-heading">
            <h2>A proper introduction.</h2>
            <p>Show who you are, then give people a clear next step.</p>
          </div>
          <div className="design-task-list">
            {areas.map((a) => (
              <button type="button" key={a.id} onClick={() => setArea(a.id)}>
                <span>
                  <strong>{a.name}</strong>
                  <small>{a.line}</small>
                </span>
                <span
                  className="design-task-art"
                  data-art={a.art}
                  aria-hidden="true"
                >
                  {a.art === "type" ? (
                    <b>{(c.identity.name || "Aa").slice(0, 1)}</b>
                  ) : (
                    <>
                      <i />
                      <i />
                      <i />
                    </>
                  )}
                </span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
