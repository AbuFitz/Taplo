import * as React from "react"

/** The one place wall-clock time is read, so event handlers and tests have a single seam. */
export const nowMs = (): number => Date.now()

const noSubscribe = () => () => {}
/** The current time on the client (to the minute) and null while rendering on the server, so nothing time-based is guessed there. */
export function useClientNow(): number | null {
  return React.useSyncExternalStore(noSubscribe, () => Math.floor(nowMs() / 60_000) * 60_000, () => null)
}
