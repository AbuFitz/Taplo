"use client"

import * as React from "react"

/**
 * Radix portals render into document.body by default, which sits outside any
 * scoped theme root. A themed surface (e.g. a business profile) provides its
 * root element here and every owned overlay primitive portals into it, so
 * dialogs, selects and menus inherit the profile's tokens instead of the
 * dashboard's. Outside a themed surface the value is null (default behaviour).
 */
const PortalContainerContext = React.createContext<HTMLElement | null>(null)

export const PortalContainerProvider = PortalContainerContext.Provider

export function usePortalContainer(): HTMLElement | undefined {
  return React.useContext(PortalContainerContext) ?? undefined
}
