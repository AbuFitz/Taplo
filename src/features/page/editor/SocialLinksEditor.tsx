"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { UrlField } from "@/features/demo/ui"
import { SocialIcon } from "../widgets/social-icons"
import type { BusinessContent } from "@/features/businesses/content"
import { SOCIAL_PLATFORMS } from "../social-platforms"
import type { Editor } from "./useEditor"

type Platform = BusinessContent["contacts"]["social"][number]["platform"]

const PROFILES = SOCIAL_PLATFORMS

/** Edits the shared contact records in place; selection/layout remains a widget setting. */
export function SocialLinksEditor({ ed }: { ed: Editor }) {
  const links = ed.state.content.contacts.social ?? []
  const [editing, setEditing] = React.useState<Platform | null>(null)
  const missing = PROFILES.filter((p) => !links.some((l) => l.platform === p.id) && editing !== p.id)
  const update = (platform: Platform, url?: string) => ed.setContent((content) => ({
    ...content, contacts: { ...content.contacts, social: [
      ...(content.contacts.social ?? []).filter((link) => link.platform !== platform),
      ...(url ? [{ platform, url }] : []),
    ] },
  }), `social:${platform}`)

  return <div className="grid gap-4" data-testid="social-links-editor">
    <div className="grid divide-y divide-black/[0.08]">
      {PROFILES.filter((p) => editing === p.id || links.some((link) => link.platform === p.id)).map((p) =>
        <div key={p.id} className="flex min-w-0 items-start gap-3 py-3 first:pt-0" onFocusCapture={() => setEditing(p.id)}>
          <span className={`mt-7 grid size-10 shrink-0 place-items-center rounded-xl bg-transparent text-current`}><SocialIcon platform={p.id} /></span>
          <div className="min-w-0 flex-1"><UrlField label={p.label} value={links.find((link) => link.platform === p.id)?.url} autoFocus={editing === p.id && !links.some((link) => link.platform === p.id)} onCommit={(url) => update(p.id, url)} /></div>
          <button type="button" className="mt-7 grid size-10 shrink-0 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2" aria-label={`Remove ${p.label} profile`} onClick={() => { update(p.id); setEditing(null) }}><X className="size-4" /></button>
        </div>
      )}
    </div>
    {missing.length ? <div className="grid gap-2">
      <p className="text-sm font-medium">Add a profile</p>
      <div className="grid grid-cols-3 gap-2">
        {missing.map((p) => <button key={p.id} type="button" onClick={() => setEditing(p.id)} aria-label={`Add ${p.label} profile`} className="flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-neutral-200 text-xs hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2"><span className={`grid size-10 place-items-center rounded-xl bg-transparent text-current`}><SocialIcon platform={p.id} className="size-6" /></span><span className="inline-flex items-center gap-1"><Plus className="size-3" aria-hidden="true" />{p.label}</span></button>)}
      </div>
    </div> : null}
    {!ed.vm?.ent.socialLinks ? <p className="text-xs text-muted-foreground">Your profiles are saved. They appear on your page from the Core plan.</p> : null}
  </div>
}
