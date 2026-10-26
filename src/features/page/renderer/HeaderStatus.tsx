"use client"

import * as React from "react"
import { openingStatus, type HoursDay } from "../widgets/HoursClient"

/** Open or closed right now, from the owner's own hours and timezone. Renders nothing until the hours are known, so it never guesses. */
export function HeaderStatus({ hours, tz }: { hours: HoursDay[]; tz: string }) {
  const [s, setS] = React.useState<ReturnType<typeof openingStatus> | null>(null)
  React.useEffect(() => {
    const tick = () => setS(openingStatus(hours, tz, Date.now()))
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [hours, tz])
  if (!s || !hours.some((h) => h.opens && h.closes)) return null
  return <span className="tp-status" data-open={s.open}><i aria-hidden="true" />{s.text}</span>
}
