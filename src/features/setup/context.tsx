"use client"
import * as React from "react"
import type { DemoState } from "@/features/demo/store"
import { useDemo } from "@/features/demo/store"

export interface SetupCtxValue {
  s: DemoState
  update: ReturnType<typeof useDemo>["update"]
  /** On a phone, a long step is two screens; this is the one showing. Undefined when the step is one screen. */
  part: number | undefined
  mobile: boolean
  showErrors: boolean
  /** A step reports whether it can continue. */
  setValid: (valid: boolean) => void
}
export const SetupCtx = React.createContext<SetupCtxValue | null>(null)
export function useSetup(): SetupCtxValue {
  const v = React.useContext(SetupCtx)
  if (!v) throw new Error("useSetup outside SetupFlow")
  return v
}
