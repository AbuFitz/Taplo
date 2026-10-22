"use client"

import { PhoneFrame } from "./lab/DeviceFrames"

const noop = () => {}

/** Two real pages, rendered by the same engine visitors get, side by side. */
export function HeroPhones() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" aria-label="Two example business pages">
      <div className="absolute -inset-x-6 -top-8 bottom-0 -z-10 rounded-[3rem] bg-[radial-gradient(60%_50%_at_30%_20%,oklch(0.93_0.06_50),transparent),radial-gradient(50%_50%_at_80%_70%,oklch(0.93_0.04_160),transparent)] opacity-80" aria-hidden="true" />
      <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
        <div className="pointer-events-none translate-y-8 -rotate-2"><PhoneFrame register={noop} src="/appearance/frame?scenario=dealer&look=showroom" title="Used car dealer example" /></div>
        <div className="pointer-events-none -translate-y-2 rotate-1"><PhoneFrame register={noop} src="/appearance/frame?scenario=barber&look=noir" title="Barber example" /></div>
      </div>
    </div>
  )
}
