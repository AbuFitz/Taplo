"use client"

import { FINISHES, type FinishId } from "@/features/page/themes/designs"

/** A small drawing of each material, so the choice is seen before it is made. */
function Swatch({ id, dark }: { id: FinishId; dark: boolean }) {
  const bg = dark ? "#16181d" : "#f1efea"
  const ink = dark ? "#fff" : "#111"
  return (
    <svg viewBox="0 0 80 52" preserveAspectRatio="xMidYMid slice" className="h-16 w-full" aria-hidden="true">
      <defs><linearGradient id={`fg-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={dark ? "#5b4bb7" : "#f2b8a2"} /><stop offset="1" stopColor={dark ? "#12506b" : "#a9c4f2"} /></linearGradient></defs>
      <rect width="80" height="52" fill={id === "frosted" ? `url(#fg-${id})` : bg} />
      {id === "frosted" ? <><rect x="8" y="9" width="64" height="34" rx="9" fill="#fff" fillOpacity={dark ? 0.12 : 0.62} stroke="#fff" strokeOpacity="0.5" /><rect x="14" y="16" width="30" height="4" rx="2" fill={ink} /><rect x="14" y="25" width="44" height="3" rx="1.5" fill={ink} opacity="0.35" /></> : null}
      {id === "solid" ? <><rect x="9" y="12" width="62" height="34" rx="8" fill="#000" opacity="0.18" /><rect x="8" y="8" width="64" height="34" rx="8" fill={dark ? "#24272f" : "#fff"} /><rect x="14" y="15" width="30" height="4" rx="2" fill={ink} /><rect x="14" y="24" width="44" height="3" rx="1.5" fill={ink} opacity="0.35" /></> : null}
      {id === "flat" ? <><rect x="8" y="10" width="64" height="1" fill={ink} opacity="0.5" /><rect x="8" y="15" width="30" height="4" rx="2" fill={ink} /><rect x="56" y="15" width="16" height="4" rx="2" fill={ink} /><rect x="8" y="28" width="64" height="1" fill={ink} opacity="0.5" /><rect x="8" y="33" width="26" height="4" rx="2" fill={ink} /><rect x="56" y="33" width="16" height="4" rx="2" fill={ink} /></> : null}
      {id === "grid" ? <><rect x="6" y="6" width="34" height="18" rx="2" fill="none" stroke={ink} opacity="0.6" /><rect x="42" y="6" width="32" height="18" rx="2" fill="none" stroke={ink} opacity="0.6" /><rect x="6" y="26" width="68" height="20" rx="2" fill="none" stroke={ink} opacity="0.6" /><text x="12" y="39" fontSize="8" fontFamily="monospace" fill={ink}>£28.00</text></> : null}
    </svg>
  )
}

/** Material: what the sections are made of. Independent of colour and of the profile arrangement. */
export function FinishControl({ value, dark, onChange, columns = 2 }: { value?: FinishId; dark: boolean; onChange: (f: FinishId) => void; columns?: 2 | 4 }) {
  return (
    <div role="radiogroup" aria-label="Material" className={columns === 4 ? "grid grid-cols-4 gap-2" : "grid grid-cols-2 gap-2"}>
      {FINISHES.map((f) => (
        <button key={f.id} type="button" role="radio" aria-checked={value === f.id} onClick={() => onChange(f.id)}
          className={`overflow-hidden rounded-xl border text-left transition ${value === f.id ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"}`}>
          <Swatch id={f.id} dark={dark} />
          <span className="block px-2.5 py-2"><span className="block text-sm font-semibold text-neutral-900">{f.name}</span><span className="block text-xs text-neutral-500">{f.line}</span></span>
        </button>
      ))}
    </div>
  )
}
