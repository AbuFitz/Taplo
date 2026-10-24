"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { LOCATION_MODES } from "@/features/businesses/content"
import { newId } from "@/features/demo/actions"
import { EmailField, PhoneField, UrlField } from "@/features/demo/ui"
import { Segmented } from "./controls"
import { prepareImage } from "./image"
import type { Editor } from "./useEditor"
import { SocialLinksEditor } from "./SocialLinksEditor"

const LOCATION_LABEL = { premises: "A place customers visit", service_area: "I travel to customers", online: "Online only" } as const
const DAYS = [["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"]] as const

function Section({ id, title, children, defaultOpen }: { id?: string; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details id={id} open={defaultOpen} className="group rounded-xl border bg-card">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}<span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-90">›</span>
      </summary>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 border-t p-4">{children}</div>
    </details>
  )
}

export function ProfileSections({ ed, only, identityOpen = true }: { ed: Editor; only?: "identity" | "rest"; identityOpen?: boolean }) {
  const c = ed.state.content
  const set = ed.setContent
  const [galleryError, setGalleryError] = React.useState<string>()
  const faqs = c.faqs ?? []
  const credentials = c.credentials ?? []
  const gallery = c.gallery ?? []
  const hours = c.hours ?? []

  const setHours = (day: string, patch: { open?: boolean; opens?: string; closes?: string }) =>
    set((x) => {
      const list = [...(x.hours ?? [])]
      const i = list.findIndex((h) => h.day === day)
      if (patch.open === false) return { ...x, hours: list.filter((h) => h.day !== day) }
      const cur = i >= 0 ? list[i]! : { day: day as "mon", opens: "09:00", closes: "17:00" }
      const next = { ...cur, opens: patch.opens ?? cur.opens ?? "09:00", closes: patch.closes ?? cur.closes ?? "17:00" }
      if (i >= 0) list[i] = next
      else list.push(next)
      return { ...x, hours: list }
    }, `hours:${day}`)

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return
    setGalleryError(undefined)
    try {
      const added: NonNullable<typeof c.gallery> = []
      for (const f of Array.from(files).slice(0, 8)) {
        const p = await prepareImage(f, 1100)
        added.push({ id: newId("photo"), image: { src: p.src, alt: f.name.replace(/\.[^.]+$/, "") || "Photo", width: p.width, height: p.height, focal: { x: 50, y: 50 } } })
      }
      set((x) => ({ ...x, gallery: [...(x.gallery ?? []), ...added] }))
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : "Those pictures could not be added.")
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2" id="profile">
      {only !== "rest" ? <Section title="Your name and description" defaultOpen={identityOpen}>
        <TaploInput label="Business name" value={c.identity.name} maxLength={100} onChange={(e) => ed.update((s) => ({ ...s, content: { ...s.content, identity: { ...s.content.identity, name: e.target.value, slug: s.slugEdited ? s.content.identity.slug : normalizeForSlug(e.target.value) } } }), { coalesce: "name" })} />
        <div className="grid gap-1.5">
          <Label htmlFor="bio" className="text-sm font-medium">Short description</Label>
          <Textarea id="bio" rows={2} maxLength={160} value={c.identity.tagline ?? ""} onChange={(e) => set((x) => ({ ...x, identity: { ...x.identity, tagline: e.target.value || undefined } }), "tagline")} />
          <p className="text-xs text-muted-foreground">Shown under your name. {160 - (c.identity.tagline?.length ?? 0)} characters left.</p>
        </div>
        <TaploInput label="What you’re called (e.g. Barber, Dog groomer)" value={c.identity.industryLabel} maxLength={80} onChange={(e) => set((x) => ({ ...x, identity: { ...x.identity, industryLabel: e.target.value } }), "label")} />
        </Section> : null}
      {only === "identity" ? null : <>

      <Section title="Contact details">
        <PhoneField label="Phone" value={c.contacts.phone} onCommit={(v) => set((x) => ({ ...x, contacts: { ...x.contacts, phone: v } }), "phone")} />
        <PhoneField label="WhatsApp" value={c.contacts.whatsapp} hint="Include the country code, e.g. +44." onCommit={(v) => set((x) => ({ ...x, contacts: { ...x.contacts, whatsapp: v } }), "wa")} />
        <EmailField value={c.contacts.email} onCommit={(v) => set((x) => ({ ...x, contacts: { ...x.contacts, email: v } }), "email")} />
        <UrlField label="Website (optional)" value={c.contacts.website} onCommit={(v) => set((x) => ({ ...x, contacts: { ...x.contacts, website: v } }), "web")} />
        <SocialLinksEditor ed={ed} />
      </Section>

      <Section title="Location and opening hours">
        <Segmented label="Where do you work?" value={c.location.mode} options={LOCATION_MODES.map((m) => ({ value: m, label: LOCATION_LABEL[m] }))} columns={1} onChange={(m) => set((x) => ({ ...x, location: { ...x.location, mode: m } }))} hint="A travelling or online business never has its private address published." />
        <TaploInput label={c.location.mode === "service_area" ? "Areas you cover (comma separated)" : "Town or area"} value={c.location.locality ?? ""} maxLength={120} onChange={(e) => set((x) => ({ ...x, location: { ...x.location, locality: e.target.value || undefined } }), "loc")} />
        {c.location.mode === "premises" ? <TaploInput label="Street address (optional)" value={c.location.addressLine ?? ""} maxLength={240} onChange={(e) => set((x) => ({ ...x, location: { ...x.location, addressLine: e.target.value || undefined } }), "addr")} /> : null}
        <UrlField label="Directions link (optional)" value={c.location.directionsUrl} onCommit={(v) => set((x) => ({ ...x, location: { ...x.location, directionsUrl: v } }), "dir")} />
        <fieldset className="grid gap-1.5">
          <legend className="mb-1 text-sm font-medium">Opening hours</legend>
          {DAYS.map(([d, name]) => {
            const h = hours.find((x) => x.day === d)
            return (
              <div key={d} className="grid min-h-11 grid-cols-[6.5rem_1fr] items-center gap-2 sm:grid-cols-[7rem_1fr_1fr_auto]">
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={Boolean(h)} onCheckedChange={(v) => setHours(d, { open: v === true })} aria-label={`${name} open`} />{name}</label>
                {h ? (
                  <>
                    <input type="time" aria-label={`${name} opens`} value={h.opens ?? "09:00"} onChange={(e) => setHours(d, { opens: e.target.value })} className="h-10 rounded-lg border bg-transparent px-2 text-sm" />
                    <input type="time" aria-label={`${name} closes`} value={h.closes ?? "17:00"} onChange={(e) => setHours(d, { closes: e.target.value })} className="h-10 rounded-lg border bg-transparent px-2 text-sm" />
                  </>
                ) : <span className="text-sm text-muted-foreground sm:col-span-3">Closed</span>}
              </div>
            )
          })}
        </fieldset>
      </Section>

      <Section title="Credentials and questions">
        <div>
          <p className="mb-1 text-sm font-medium">Credentials (optional)</p>
          <p className="mb-2 text-xs text-muted-foreground">Only facts you can stand behind. Taplo never adds badges for you.</p>
          <ul className="grid gap-2">
            {credentials.map((cr, i) => (
              <li key={i} className="flex items-end gap-2">
                <TaploInput className="flex-1" label={`Credential ${i + 1}`} value={cr} maxLength={160} onChange={(e) => set((x) => ({ ...x, credentials: credentials.map((q, j) => (j === i ? e.target.value : q)) }), `cred:${i}`)} />
                <Button type="button" variant="outline" size="icon" className="size-11" aria-label={`Remove credential ${i + 1}`} onClick={() => set((x) => ({ ...x, credentials: credentials.filter((_, j) => j !== i) }))}><Trash2 /></Button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => set((x) => ({ ...x, credentials: [...credentials, ""] }))}><Plus /> Add credential</Button>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Questions customers ask</p>
          <ul className="grid gap-3">
            {faqs.map((f, i) => (
              <li key={f.id} className="grid gap-2 rounded-lg border p-3">
                <TaploInput label={`Question ${i + 1}`} value={f.question} maxLength={240} onChange={(e) => set((x) => ({ ...x, faqs: faqs.map((q) => (q.id === f.id ? { ...q, question: e.target.value } : q)) }), `fq:${f.id}`)} />
                <div className="grid gap-1.5"><Label htmlFor={`a-${f.id}`} className="text-sm font-medium">Answer</Label><Textarea id={`a-${f.id}`} rows={2} maxLength={2000} value={f.answer} onChange={(e) => set((x) => ({ ...x, faqs: faqs.map((q) => (q.id === f.id ? { ...q, answer: e.target.value } : q)) }), `fa:${f.id}`)} /></div>
                <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => set((x) => ({ ...x, faqs: faqs.filter((q) => q.id !== f.id) }))}><Trash2 /> Remove question {i + 1}</Button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => set((x) => ({ ...x, faqs: [...faqs, { id: newId("faq"), question: "", answer: "" }] }))}><Plus /> Add question</Button>
          <p className="mt-1 text-xs text-muted-foreground">Questions with no text are hidden from visitors automatically.</p>
        </div>
      </Section>

      <Section title={`Photos (${gallery.length})`}>
        <p className="text-xs text-muted-foreground">Photos you add here can appear in any Gallery widget. {ed.vm?.ent.gallery ? "" : "Galleries are shown from the Core plan; your photos are kept."}</p>
        <ul className="grid gap-2">
          {gallery.map((g) => (
            <li key={g.id} className="flex items-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image.src} alt="" className="size-14 shrink-0 rounded-md border object-cover" />
              <TaploInput className="flex-1" label="Caption / description" value={g.caption ?? ""} maxLength={240} onChange={(e) => set((x) => ({ ...x, gallery: gallery.map((q) => (q.id === g.id ? { ...q, caption: e.target.value || undefined, image: { ...q.image, alt: e.target.value || q.image.alt } } : q)) }), `cap:${g.id}`)} />
              <Button type="button" variant="outline" size="icon" className="size-11" aria-label="Remove photo" onClick={() => set((x) => ({ ...x, gallery: gallery.filter((q) => q.id !== g.id) }))}><Trash2 /></Button>
            </li>
          ))}
        </ul>
        <div>
          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("add-photos")?.click()}><Plus /> Add photos</Button>
          <input id="add-photos" type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Add photos" onChange={(e) => { void addPhotos(e.target.files); e.target.value = "" }} />
          {galleryError ? <p role="alert" className="mt-2 text-sm text-destructive">{galleryError}</p> : null}
        </div>
      </Section>
      </>}
    </div>
  )
}

function normalizeForSlug(name: string) {
  return name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/g, "")
}
