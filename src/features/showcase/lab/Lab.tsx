"use client"

import Link from "next/link"
import { TaploLogo } from "@/components/taplo/brand"
import * as React from "react"
import { Redo2, RotateCcw, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Segment } from "@/features/appearance/controls"
import { useAppearanceModel, type AppearanceHost } from "@/features/appearance/model"
import { AppearancePanel } from "@/features/appearance/sections"
import { useHistory } from "@/features/appearance/useHistory"
import type { StyleOverrides } from "@/features/page/contracts/style"
import "@/features/page/themes/fonts"
import { SCENARIOS, type Scenario } from "../content"
import { initialConfig } from "../lab-state"
import { DesktopFrame, PhoneFrame, useFrames } from "./DeviceFrames"

interface Appearance { themeId: string; overrides: StyleOverrides }

/**
 * The public showcase. It hosts the same appearance panel the owner editor and guided setup
 * host, on the same appearance model; only the surrounding page and the history store differ.
 */
export function Lab() {
  const [scenario, setScenario] = React.useState<Scenario>("barber")
  const start = React.useMemo(() => initialConfig("barber"), [])
  const h = useHistory<Appearance>(() => ({ themeId: start.themeId, overrides: start.overrides }))
  const { themeId, overrides } = h.value
  const register = useFrames(scenario, themeId, overrides)
  const [device, setDevice] = React.useState<"phone" | "desktop">("phone")

  const set = h.set
  const [savedLooks, setSavedLooks] = React.useState<{ id: string; name: string; themeId: string; overrides: StyleOverrides }[]>([])
  const host = React.useMemo<AppearanceHost>(() => ({
    themeId, overrides, canSwitchLook: true,
    saved: {
      items: savedLooks.map((l) => ({ id: l.id, name: l.name })),
      save: (name) => setSavedLooks((s) => [...s.slice(-11), { id: `look-${Date.now().toString(36)}`, name, themeId, overrides: structuredClone(overrides) }]),
      apply: (id) => { const l = savedLooks.find((x) => x.id === id); if (l) set({ themeId: l.themeId, overrides: structuredClone(l.overrides) }) },
      remove: (id) => setSavedLooks((s) => s.filter((l) => l.id !== id)),
    },
    apply: (fn, coalesce) => set((s) => ({ ...s, overrides: fn(s.overrides) }), coalesce),
    setAppearance: (id, o) => set({ themeId: id, overrides: o }),
  }), [themeId, overrides, set, savedLooks])
  const m = useAppearanceModel(host)

  const frameSrc = (s: Scenario) => `/appearance/frame?scenario=${s}&look=${themeId}`
  const url = `taplo.co/${SCENARIOS[scenario].content.identity.slug}`
  const phone = <PhoneFrame register={register} src={frameSrc(scenario)} title="Mobile preview" />
  const desktop = <DesktopFrame register={register} src={frameSrc(scenario)} title="Desktop preview" url={url} />

  return (
    <div className="min-h-dvh bg-background text-foreground antialiased" data-testid="appearance-lab">
      <header className="sticky top-0 z-30 border-b border-black/[0.08] bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Taplo home" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60"><TaploLogo /></Link>
          <span className="hidden text-sm text-neutral-400 sm:inline">/</span>
          <h1 className="hidden text-sm font-medium sm:block">Appearance</h1>
          <div className="order-last w-full sm:order-none sm:ml-6 sm:mr-auto sm:w-52"><Segment label="Business" value={scenario} options={(Object.keys(SCENARIOS) as Scenario[]).map((s) => ({ value: s, label: SCENARIOS[s].label }))} onChange={setScenario} /></div>
          <div className="ml-auto flex items-center gap-1 sm:ml-0" role="toolbar" aria-label="History">
            <Button variant="ghost" size="icon" onClick={h.undo} disabled={!h.canUndo} aria-label="Undo" data-testid="lab-undo"><Undo2 /></Button>
            <Button variant="ghost" size="icon" onClick={h.redo} disabled={!h.canRedo} aria-label="Redo" data-testid="lab-redo"><Redo2 /></Button>
            <Button variant="outline" className="ml-1 rounded-full bg-white/70" onClick={m.resetAll} disabled={m.totalChanges === 0} aria-label={`Reset to ${m.look.name}`} data-testid="lab-reset"><RotateCcw /><span className="hidden sm:inline">Reset to {m.look.name}</span></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[96rem] grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-[4.75rem]">
          <div className="mb-4 flex justify-center 2xl:hidden"><div className="w-56"><Segment label="Preview" value={device} options={[{ value: "phone", label: "Phone" }, { value: "desktop", label: "Desktop" }]} onChange={setDevice} /></div></div>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 2xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className={device === "phone" ? "block" : "hidden 2xl:block"}>{phone}</div>
            <div className={device === "desktop" ? "block" : "hidden 2xl:block"}>{desktop}</div>
          </div>
        </div>

        <aside aria-label="Appearance controls" className="rounded-[1.5rem] bg-white p-4 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(0_0_0/0.25)] lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto" data-testid="lab-controls">
          <AppearancePanel m={m} header />
        </aside>
      </main>
    </div>
  )
}
