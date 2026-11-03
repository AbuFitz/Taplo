/** Shared handset geometry for live pages and captured previews. Sizes are in screen CSS pixels. */
export const PHONE = { width: 390, height: 844, bezel: 6, top: 36, bottom: 16 } as const

/** Purely decorative hardware. It never covers or intercepts the usable page viewport. */
export function PhoneChrome() {
  return <span className="phone-hardware" aria-hidden="true">
    <span className="phone-island"><i /></span>
    <span className="phone-home" />
    <span className="phone-key phone-key-silent" />
    <span className="phone-key phone-key-up" />
    <span className="phone-key phone-key-down" />
    <span className="phone-key phone-key-power" />
  </span>
}
