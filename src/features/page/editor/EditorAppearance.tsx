"use client"

import * as React from "react"
import { Disclosure } from "@/features/appearance/controls"
import { useAppearanceModel, type AppearanceHost } from "@/features/appearance/model"
import { AppearancePanel, HeaderControls } from "@/features/appearance/sections"
import { ChoiceGrid } from "@/features/appearance/controls"
import { ImageField } from "./controls"
import { ProfileSections } from "./ContentTab"
import type { Editor } from "./useEditor"

/** The owner editor's host for the shared appearance model: values live in the page document, history is the editor's. */
function useEditorAppearance(ed: Editor, notify: (m: string, undoable?: boolean) => void) {
  const { setAppearance, setPage } = ed
  const page = ed.state.page
  const host = React.useMemo<AppearanceHost>(() => ({
    themeId: page.themeId,
    overrides: page.appearance,
    canSwitchLook: ed.vm?.ent.themeSwitching ?? true,
    apply: (fn, coalesce) => setAppearance(fn, coalesce ? `ap:${coalesce}` : undefined),
    setAppearance: (themeId, appearance) => setPage((p) => ({ ...p, themeId, appearance })),
    notify,
  }), [page.themeId, page.appearance, ed.vm?.ent.themeSwitching, setAppearance, setPage, notify])
  return useAppearanceModel(host)
}

/** Whole-page style: the shared panel. */
export function PageStylePanel({ ed, notify }: { ed: Editor; notify: (m: string, undoable?: boolean) => void }) {
  const m = useEditorAppearance(ed, notify)
  return <AppearancePanel m={m} />
}

/** Which channel is the page's main action. Separate from widget order: choosing it never moves anything. */
export function MainActionControl({ ed }: { ed: Editor }) {
  const page = ed.state.page
  const c = ed.state.content
  const has = {
    book: page.widgets.some((w) => w.type === "booking" && !w.hidden) || Boolean(ed.vm?.onlineBooking),
    call: Boolean(c.contacts.phone), whatsapp: Boolean(c.contacts.whatsapp), email: Boolean(c.contacts.email),
  }
  const options = [
    { value: "auto", label: "Automatic" },
    { value: "book", label: "Booking", disabled: !has.book },
    { value: "call", label: "Call", disabled: !has.call },
    { value: "whatsapp", label: "WhatsApp", disabled: !has.whatsapp },
    { value: "email", label: "Email", disabled: !has.email },
    { value: "none", label: "None" },
  ] as const
  const current = ed.vm?.primary?.kind
  return (
    <div className="grid gap-3" data-testid="main-action">
      <ChoiceGrid label="Main action" value={page.meta.primaryAction} columns={3} onChange={(v) => ed.setPage((p) => ({ ...p, meta: { ...p.meta, primaryAction: v } }))} options={options.map((o) => ({ ...o }))} />
      <p className="text-xs text-neutral-500">{current ? `Right now your main action is ${ed.vm!.primary!.label}.` : "No main action yet: add a phone number, email or booking."} It sits at the top of your page. Your widgets stay in the order you set.</p>
    </div>
  )
}

/** Name, logo, cover and header composition: identity fields from the business record, composition from the shared model. */
export function HeaderPanel({ ed, notify }: { ed: Editor; notify: (m: string, undoable?: boolean) => void }) {
  const m = useEditorAppearance(ed, notify)
  const c = ed.state.content
  return (
    <div className="grid gap-2.5" data-testid="header-panel">
      <ProfileSections ed={ed} only="identity" />
      <Disclosure title="Logo and cover" defaultOpen id="header-images">
        <div className="grid gap-5">
          <ImageField label="Logo or profile picture" cropAspect={1} cropRound={m.spec.header.avatarShape === "circle"} value={c.identity.logo ?? null} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640}
            onChange={(v) => ed.setContent((x) => ({ ...x, identity: { ...x.identity, logo: v ?? undefined } }))} focalHint="Choose the part that should stay in view when the picture is cropped to a circle or arch." />
          {m.spec.header.avatarShape === "none" && c.identity.logo ? <p role="note" className="rounded-xl bg-black/[0.04] px-3 py-2 text-xs text-neutral-600">Your picture is saved, but this look shows no picture. Choose a picture shape below to show it.</p> : null}
          <ImageField label="Cover picture" cropAspect={16 / 7} value={c.identity.heroImage ?? null} defaultAlt={`${c.identity.name || "Business"} cover photo`} maxEdge={1400}
            onChange={(v) => ed.setContent((x) => ({ ...x, identity: { ...x.identity, heroImage: v ?? undefined } }))} focalHint="Used by Cover and Poster headers. Choose the part that must always stay visible." />
        </div>
      </Disclosure>
      <Disclosure title="Main action" defaultOpen id="main-action"><MainActionControl ed={ed} /></Disclosure>
      <Disclosure title="Header layout" defaultOpen id="header" count={m.count("header")} onReset={() => m.resetGroup("header")}><HeaderControls m={m} /></Disclosure>
    </div>
  )
}
