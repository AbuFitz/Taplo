"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { isReservedStaffSlug, normalizeSlug } from "@/features/businesses/slug"
import { useDraft } from "../hooks"
import { NotBuilt, PageHeader, Panel } from "./Panel"

export function Team() {
  const { c, ent, setContent } = useDraft()
  const [f, setF] = React.useState({ name: "", role: "", bio: "", subjects: "" })
  const [err, setErr] = React.useState<string>()
  if (!c || !ent) return null
  const staff = c.staff ?? []

  const add = () => {
    const slug = normalizeSlug(f.name)
    if (!f.name.trim()) return setErr("Add a name.")
    if (slug.length < 2 || isReservedStaffSlug(slug) || staff.some((s) => s.slug === slug)) return setErr("That name would clash with another page address. Try adding a surname.")
    setErr(undefined)
    setContent((x) => ({ ...x, staff: [...staff, { id: `st-${Math.random().toString(36).slice(2, 8)}`, slug, name: f.name.trim(), role: f.role.trim() || undefined, bio: f.bio.trim() || undefined, subjects: f.subjects.split(",").map((q) => q.trim()).filter(Boolean).slice(0, 12) }] }))
    setF({ name: "", role: "", bio: "", subjects: "" })
  }

  return (
    <>
      <PageHeader title="Team" description="Public team profiles. A team member’s biography never exposes an email address or permissions." />
      <div className="grid max-w-3xl gap-6">
        {!ent.teamPages ? <p role="status" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">Team pages start on the Pro plan. You can prepare profiles now; they stay hidden on your page until your plan includes them.</p> : null}
        <Panel title="People">
          {staff.length === 0 ? <p className="text-sm text-muted-foreground">No team members yet. This section stays hidden on your page.</p> : (
            <ul className="grid gap-3">
              {staff.map((s) => (
                <li key={s.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold">{s.name}{s.role ? <span className="font-normal text-muted-foreground"> · {s.role}</span> : null}</p>
                  {s.bio ? <p className="mt-1">{s.bio}</p> : null}
                  <p className="mt-1 text-xs text-muted-foreground">Page address: /{c.identity.slug || "your-name"}/{s.slug} (individual profile pages arrive with the team phase)</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent((x) => ({ ...x, staff: staff.filter((q) => q.id !== s.id) }))}><Trash2 /> Remove</Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Add a team member">
          <div className="grid gap-3">
            <TaploInput label="Name" value={f.name} maxLength={120} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <TaploInput label="Role (optional)" value={f.role} maxLength={120} onChange={(e) => setF({ ...f, role: e.target.value })} />
            <TaploInput label="Subjects or specialities (optional, comma separated)" value={f.subjects} onChange={(e) => setF({ ...f, subjects: e.target.value })} />
            <div className="grid gap-1.5"><Label htmlFor="bio">Short biography (optional)</Label><Textarea id="bio" rows={3} maxLength={1200} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></div>
            {err ? <p role="alert" className="text-sm text-destructive">{err}</p> : null}
            <Button className="justify-self-start" onClick={add}><Plus /> Add team member</Button>
          </div>
        </Panel>
        <NotBuilt title="Invitations, logins and permissions" phase="Phase 8">
          <p>Inviting people to sign in, role permissions, per-person availability and bookable staff aren’t built yet. Team profiles here are public biographies only.</p>
        </NotBuilt>
      </div>
    </>
  )
}
