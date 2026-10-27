"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Overlay } from "@/components/taplo/overlay"
import { useDemo } from "@/features/demo/store"
import { applyDesignKeeping, describeChange, withArrangement, type Design } from "@/features/page/themes/designs"
import { DesignThumb } from "@/features/setup/DesignThumb"
import { cn } from "@/lib/utils"
import "@/features/setup/setup.css"
import "./design-gallery.css"

/**
 * Putting a design on a page, in the two situations that need different care. Someone starting out begins setup with the
 * design chosen, and every later step builds on it. Someone with a page sees exactly what will change and what will not
 * before anything does, and can keep their own colours or typeface.
 */
export function ApplyDesign({ design, industry, arrangement, className, children }: { design: Design; industry?: string; arrangement?: string; className?: string; children?: React.ReactNode }) {
  const { state, ready } = useDemo()
  const owner = ready && state?.onboarded ? state : null
  const [open, setOpen] = React.useState(false)
  const label = children ?? "Use this design"
  if (!owner) return <Link data-brand-action href={`/onboarding?design=${design.id}${arrangement ? `&arr=${arrangement}` : ""}`} className={cn("sf-use", className)} aria-label={`Start with the ${design.name} design`} data-testid="start-design">{label}</Link>
  const applied = owner.page.themeId === design.id
  return (
    <>
      <button type="button" className={cn("sf-use", className)} onClick={() => setOpen(true)} aria-label={applied ? `${design.name} is on your page` : `Use the ${design.name} design`}>{applied ? <><Check aria-hidden="true" />On your page</> : label}</button>
      {open ? <ApplyDialog design={design} industry={industry} arrangement={arrangement} onClose={() => setOpen(false)} /> : null}
    </>
  )
}

function ApplyDialog({ design, industry, arrangement, onClose }: { design: Design; industry?: string; arrangement?: string; onClose: () => void }) {
  const { state, update } = useDemo()
  const router = useRouter()
  const s = state!
  const [keepColours, setKeepColours] = React.useState(false)
  const [keepType, setKeepType] = React.useState(false)
  const key = industry ?? s.content.identity.industryKey
  const withArr = React.useCallback((page: typeof s.page) => withArrangement(applyDesignKeeping(page, design, { colours: keepColours, type: keepType }), arrangement), [design, keepColours, keepType, arrangement]) // eslint-disable-line react-hooks/exhaustive-deps
  const after = React.useMemo(() => withArr(s.page), [s.page, withArr])
  const apply = () => { update((x) => { const page = withArr(x.page); return { ...x, page: { ...page, meta: { ...page.meta, appliedFrom: { designId: design.id, ...(arrangement ? { arrangement } : {}), at: new Date().toISOString() } } } } }); onClose(); router.push("/dashboard/page") }
  return (
    <Overlay open onOpenChange={(o) => !o && onClose()} kind="detail" title={`Use ${design.name} on your page`} description="Here is exactly what will change." testId="apply-design"
      footer={<div className="flex gap-2"><button type="button" className="sf-btn" data-kind="ghost" onClick={onClose}>Cancel</button><button type="button" className="sf-btn flex-1" data-kind="primary" onClick={apply}>Apply this design</button></div>}>
      <div className="sf-apply sf-ui">
        <div className="sf-apply-pair">
          <figure><DesignThumb design={{ id: s.page.themeId, recipe: {}, overrides: s.page.appearance }} industryKey={key} own={s.content} real={{ widgets: s.page.widgets }} height={520} /><figcaption>Now</figcaption></figure>
          <figure data-after><DesignThumb design={{ id: design.id, recipe: design.recipe, overrides: after.appearance }} industryKey={key} own={s.content} real={{ widgets: s.page.widgets }} height={520} /><figcaption>With {design.name}</figcaption></figure>
        </div>
        <div className="sf-apply-lists">
          <section aria-label="What changes"><h3>What changes</h3><ul>{describeChange(design).map((t) => <li key={t}>{t}</li>)}</ul></section>
          <section aria-label="What stays"><h3>What stays exactly as it is</h3><ul><li>Your name, logo and description</li><li>Services, prices, photos and links</li><li>The order of your sections</li></ul></section>
        </div>
        <div className="sf-apply-keep" role="group" aria-label="Keep some of your own choices">
          <label><input type="checkbox" checked={keepColours} onChange={(e) => setKeepColours(e.target.checked)} /><span>Keep my colours</span></label>
          <label><input type="checkbox" checked={keepType} onChange={(e) => setKeepType(e.target.checked)} /><span>Keep my typeface</span></label>
        </div>
        <p className="sf-hint">You can undo this from the editor, and change anything afterwards.</p>
      </div>
    </Overlay>
  )
}
