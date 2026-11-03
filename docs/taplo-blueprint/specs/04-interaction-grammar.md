# Sheets, focused tasks and accessible behaviour

Status: recommended UX standard. Depends on: 03.

Use inline expansion for a short FAQ and branded sheets/dialogs for item detail, media, cart and relevant actions. Booking, checkout and quote forms can progress inside the same full-height mobile sheet where appropriate. A focused route remains available for direct links, resilience and payment/device requirements without imposing a conventional website structure. Clear Back/Close, preserved state and one active modal layer matter more than whether a screen visually fills the phone.

Permit one active dialog layer. Progress from the product sheet into cart or checkout in the same coordinated container rather than piling another dialog above it. Preserve the chosen item, variant, quantity and origin. On mobile a sheet may become near-full-screen without changing its underlying route contract.

Dialog requirements: accessible name, initial focus, focus containment, visible Close, Escape where safe, focus restoration and correct screen-reader announcement. Do not dismiss a destructive confirmation by an accidental backdrop tap. Warn about unsaved meaningful form work when navigation would lose it; routine browsing requires no warning.

Keep a primary action visible without covering content or the keyboard. Meet WCAG 2.2 AA as the design target; validate contrast, zoom, reflow, labels, errors, keyboard operation and touch targets with real assistive-technology checks. Do not claim conformance from a component library alone.

Acceptance: opening a product, changing its variant, continuing, returning and closing restores both focus and selection. A payment redirect returns to a pending/confirmed state without creating another order. A slow action has a clear state and retry path. An error names the affected field and preserves other values. Reduced motion is respected.
