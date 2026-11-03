"use client";

import * as React from "react";
import { TaploLogo } from "@/components/taplo/brand";
import { PortalContainerProvider } from "@/components/ui/portal-container";
import tokens from "../../../docs/taplo-blueprint/release-3.0/design/tokens.json";
import "@fontsource-variable/manrope/wght.css";
import "./operational.css";

type Mode = "light" | "dark" | "system";
const KEY = "taplo.operational-appearance.v1";
const CHANGE = "taplo:operational-appearance";
let memory: Mode = "system";
function mode(): Mode {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
    return "system";
  } catch { /* Preference still works for this session. */ }
  return memory;
}
function snapshot() {
  const selected = mode();
  return `${selected}:${selected === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : selected}`;
}
function subscribe(notify: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const storage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) notify(); };
  window.addEventListener(CHANGE, notify);
  window.addEventListener("storage", storage);
  media.addEventListener("change", notify);
  return () => { window.removeEventListener(CHANGE, notify); window.removeEventListener("storage", storage); media.removeEventListener("change", notify); };
}
function setMode(value: Mode) {
  memory = value;
  try { localStorage.setItem(KEY, value); } catch { /* Session preference is retained. */ }
  window.dispatchEvent(new Event(CHANGE));
}
const ThemeContext = React.createContext<{ mode: Mode; scheme: "light" | "dark" }>({ mode: "system", scheme: "light" });

/** Operational appearance never writes merchant-page theme tokens. Portals inherit their nearest surface. */
export function OperationalRoot({ children, section, route }: { children: React.ReactNode; section: string; route: string }) {
  const state = React.useSyncExternalStore(subscribe, snapshot, () => "system:light");
  const [selected, resolved] = state.split(":") as [Mode, "light" | "dark"];
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const context = React.useMemo(() => ({ mode: selected, scheme: resolved }), [selected, resolved]);
  const palette = tokens[resolved];
  const vars = Object.fromEntries(Object.entries(palette).map(([key, value]) => [`--op-${key.replaceAll("_", "-")}`, value])) as React.CSSProperties;
  return (
    <ThemeContext.Provider value={context}>
      <PortalContainerProvider value={element}>
        <div ref={setElement} className={`workspace-v2 portal-workspace operational-root${resolved === "dark" ? " dark" : ""}`} data-operational="" data-colour-mode={selected} data-colour-scheme={resolved} data-workspace-section={section} data-route={route} style={vars}>
          {children}
        </div>
      </PortalContainerProvider>
    </ThemeContext.Provider>
  );
}
export function AppearanceSelect() {
  const { mode: value } = React.useContext(ThemeContext);
  return <label className="studio-appearance"><span className="sr-only">Colour mode</span><select aria-label="Colour mode" value={value} onChange={(event) => setMode(event.target.value as Mode)}><option value="system">Device theme</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}

export function OperationalLogo() {
  const { scheme } = React.useContext(ThemeContext);
  return <TaploLogo className="h-6" tone={scheme === "dark" ? "light" : "dark"} />;
}
