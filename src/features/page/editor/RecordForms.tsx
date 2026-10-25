"use client"

import * as React from "react"
import { SOCIAL_PLATFORMS } from "../social-platforms"
import { Plus, Trash2 } from "lucide-react"
import { TaploInput } from "@/components/taplo/taplo-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Segment } from "@/features/appearance/controls"
import { isReservedStaffSlug, normalizeSlug } from "@/features/businesses/slug"
import type { BusinessContentInput, ServiceContent } from "@/features/businesses/content"
import { newId } from "@/features/demo/actions"
import { ProductForm, productErrors } from "@/features/demo/ProductForm"
import { ServiceForm, serviceErrors } from "@/features/demo/ServiceForm"
import { blankProduct } from "@/features/demo/dashboard/Products"
import { UrlField } from "@/features/demo/ui"
import { ImageField } from "./controls"
import type { RecordKind } from "./content-model"

/**
 * One create-form per record kind, used in place by the Add content flow and by "Add your first ..." on a card.
 * A form holds a draft, says whether it is valid, and knows how to put the finished record into the business
 * records. Records live in the business, not on the page, so removing content from the page never deletes them.
 */

export interface RecordDraft<T = unknown> { value: T; errors: Record<string, string>; commit: (c: BusinessContentInput) => BusinessContentInput }

type FormProps<T> = { value: T; onChange: (v: T) => void; showErrors: boolean; content: BusinessContentInput }

const blankService = (): ServiceContent => ({ id: newId("svc"), name: "", priceMode: "fixed", currency: "GBP", durationMinutes: 30, delivery: [], bookingMode: "request", sortOrder: 0, archived: false })
const uniqueSlug = (name: string, taken: string[]) => { let s = normalizeSlug(name) || "person"; let n = 2; const base = s; while (taken.includes(s) || isReservedStaffSlug(s)) s = `${base}-${n++}`; return s }

type Staff = NonNullable<BusinessContentInput["staff"]>[number]
type Testimonial = NonNullable<BusinessContentInput["testimonials"]>[number]
type Faq = NonNullable<BusinessContentInput["faqs"]>[number]
type Offer = NonNullable<BusinessContentInput["offers"]>[number]

export const RECORD_TITLE: Record<RecordKind, string> = {
  service: "Add a service", product: "Add a product", vehicle: "Add a vehicle", review: "Add a review", staff: "Add a team member", faq: "Add a question", photo: "Add photos", social: "Add a social profile",
  credential: "Add a credential", phone: "Your phone number", whatsapp: "Your WhatsApp number", email: "Your email address", directions: "Directions link", offer: "Add an offer",
}

export function blankFor(kind: RecordKind, content: BusinessContentInput): unknown {
  switch (kind) {
    case "service": return blankService()
    case "product": return blankProduct("product")
    case "vehicle": return blankProduct("vehicle")
    case "review": return { id: newId("rev"), quote: "", author: "", source: "owner_supplied", permissionConfirmed: false } satisfies Testimonial
    case "staff": return { id: newId("st"), slug: "", name: "", role: "", bio: "", subjects: [], serviceIds: null, credentials: [], bookable: true } satisfies Staff
    case "faq": return { id: newId("faq"), question: "", answer: "" } satisfies Faq
    case "photo": return { images: [] as { src: string; alt: string; width?: number; height?: number; focal?: { x: number; y: number } }[] }
    case "social": return { platform: "instagram", url: "" }
    case "credential": return { text: "" }
    case "offer": return { id: newId("off"), title: "", description: "", code: "", archived: false } satisfies Offer
    case "phone": return { value: content.contacts?.phone ?? "" }
    case "whatsapp": return { value: content.contacts?.whatsapp ?? "" }
    case "email": return { value: content.contacts?.email ?? "" }
    case "directions": return { value: content.location?.directionsUrl ?? "" }
  }
}

export function validate(kind: RecordKind, v: any): Record<string, string> {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const e: Record<string, string> = {}
  switch (kind) {
    case "service": Object.assign(e, serviceErrors(v)); break
    case "product": case "vehicle": Object.assign(e, productErrors(v)); break
    case "review": if (!v.quote.trim()) e.quote = "Write what they said."; if (!v.author.trim()) e.author = "Who said it?"; if (!v.permissionConfirmed) e.permission = "Confirm you have permission to share this."; break
    case "staff": if (!v.name.trim()) e.name = "Add a name."; break
    case "faq": if (!v.question.trim()) e.question = "Add the question."; if (!v.answer.trim()) e.answer = "Add the answer."; break
    case "photo": if (!v.images.length) e.images = "Choose at least one photo."; break
    case "social": if (!/^https?:\/\//.test(v.url)) e.url = "Paste the full address, starting with https://"; break
    case "credential": if (!v.text.trim()) e.text = "Write the credential."; break
    case "offer": if (!v.title.trim()) e.title = "Give the offer a title."; break
    case "phone": if (v.value.replace(/\D/g, "").length < 7) e.value = "Enter a phone number."; break
    case "whatsapp": if (v.value.replace(/\D/g, "").length < 7) e.value = "Enter a WhatsApp number with the country code."; break
    case "email": if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.value)) e.value = "Enter a valid email address."; break
    case "directions": if (!/^https?:\/\//.test(v.value)) e.value = "Paste a map link, starting with https://"; break
  }
  return e
}

/** Put the finished record into the business records (never onto the page). */
export function commitRecord(kind: RecordKind, v: any, c: BusinessContentInput): BusinessContentInput {  // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (kind) {
    case "service": return { ...c, services: [...(c.services ?? []), { ...v, name: v.name.trim(), sortOrder: (c.services?.length ?? 0) + 1 }] }
    case "product": case "vehicle": return { ...c, products: [...(c.products ?? []), { ...v, name: v.name.trim(), facts: (v.facts ?? []).filter((f: { label: string; value: string }) => f.label.trim() && f.value.trim()) }] }
    case "review": return { ...c, testimonials: [...(c.testimonials ?? []), { ...v, quote: v.quote.trim(), author: v.author.trim() }] }
    case "staff": return { ...c, staff: [...(c.staff ?? []), { ...v, name: v.name.trim(), slug: uniqueSlug(v.name, (c.staff ?? []).map((s) => s.slug)), role: v.role?.trim() || undefined, bio: v.bio?.trim() || undefined }] }
    case "faq": return { ...c, faqs: [...(c.faqs ?? []), { ...v, question: v.question.trim(), answer: v.answer.trim() }] }
    case "photo": return { ...c, gallery: [...(c.gallery ?? []), ...v.images.map((image: unknown) => ({ id: newId("g"), image }))] }
    case "social": return { ...c, contacts: { ...c.contacts, social: [...(c.contacts?.social ?? []).filter((s) => s.platform !== v.platform), { platform: v.platform, url: v.url }] } }
    case "credential": return { ...c, credentials: [...(c.credentials ?? []), v.text.trim()] }
    case "offer": return { ...c, offers: [...(c.offers ?? []), { ...v, title: v.title.trim(), description: v.description?.trim() || undefined, code: v.code?.trim() || undefined }] }
    case "phone": return { ...c, contacts: { ...c.contacts, phone: v.value.trim() } }
    case "whatsapp": return { ...c, contacts: { ...c.contacts, whatsapp: v.value.trim() } }
    case "email": return { ...c, contacts: { ...c.contacts, email: v.value.trim() } }
    case "directions": return { ...c, location: { ...c.location, directionsUrl: v.value.trim() } as BusinessContentInput["location"] }
  }
}

export function RecordForm({ kind, value, onChange, showErrors, content, setup = false }: FormProps<any> & { kind: RecordKind; setup?:boolean }) {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const err = showErrors ? validate(kind, value) : {}
  switch (kind) {
    case "service": return <ServiceForm service={value} onChange={onChange} showErrors={showErrors} />
    case "product": case "vehicle": return <ProductForm setup={setup} product={value} onChange={onChange} showErrors={showErrors} />
    case "review": return <p className="rounded-xl bg-muted p-4 text-sm">Reviews come from Google. Add a Google reviews section to connect your business link.</p>

    case "staff": {
      const services = content.services ?? []
      const all = value.serviceIds === null
      return (
        <div className="grid gap-4">
          <TaploInput label="Name" value={value.name} error={err.name} maxLength={120} onChange={(e) => onChange({ ...value, name: e.target.value })} />
          <TaploInput label="Role or speciality (optional)" value={value.role ?? ""} maxLength={120} onChange={(e) => onChange({ ...value, role: e.target.value })} />
          <div className="grid gap-1.5"><Label htmlFor="st-bio">About them (optional)</Label><Textarea id="st-bio" rows={3} maxLength={1200} value={value.bio ?? ""} onChange={(e) => onChange({ ...value, bio: e.target.value })} /><p className="text-xs text-muted-foreground">The first sentence is the short summary on their card.</p></div>
          <ImageField label="Portrait (optional)" value={value.photo ?? null} defaultAlt={value.name ? `Portrait of ${value.name}` : "Portrait"} maxEdge={800} cropAspect={4 / 5} onChange={(v) => onChange({ ...value, photo: v ?? undefined })} />
          {services.length ? (
            <fieldset className="grid gap-2 rounded-2xl bg-black/[0.035] p-4">
              <legend className="sr-only">Services they provide</legend>
              <span className="text-sm font-medium">Services they provide</span>
              <Segment label="Services they provide" value={all ? "all" : "some"} options={[{ value: "all", label: "Every service" }, { value: "some", label: "Only some" }]} onChange={(v) => onChange({ ...value, serviceIds: v === "all" ? null : services.map((s) => s.id).slice(0, 1) })} />
              {!all ? <ul className="grid gap-1">{services.map((s) => <li key={s.id}><label className="flex min-h-11 items-center gap-3 text-sm"><Checkbox checked={value.serviceIds.includes(s.id)} onCheckedChange={(c) => onChange({ ...value, serviceIds: c ? [...value.serviceIds, s.id] : value.serviceIds.filter((x: string) => x !== s.id) })} />{s.name}</label></li>)}</ul> : null}
              <p className="text-xs text-muted-foreground">Customers can only book this person for these services.</p>
            </fieldset>
          ) : null}
          <label className="flex items-center gap-3 text-sm"><Checkbox checked={value.bookable} onCheckedChange={(c) => onChange({ ...value, bookable: c === true })} />Customers can book this person (Pro or Business)</label>
          <div className="grid gap-2"><span className="text-sm font-medium">Experience or qualifications (optional)</span>
            {value.credentials.map((c: string, i: number) => <div key={i} className="flex gap-2"><input aria-label={`Qualification ${i + 1}`} className="min-h-11 min-w-0 flex-1 rounded-xl border bg-transparent px-3 text-sm" value={c} maxLength={160} onChange={(e) => onChange({ ...value, credentials: value.credentials.map((x: string, n: number) => (n === i ? e.target.value : x)) })} /><Button type="button" variant="ghost" size="icon" className="size-11" aria-label="Remove" onClick={() => onChange({ ...value, credentials: value.credentials.filter((_: string, n: number) => n !== i) })}><Trash2 /></Button></div>)}
            {value.credentials.length < 8 ? <Button type="button" variant="outline" className="justify-self-start" onClick={() => onChange({ ...value, credentials: [...value.credentials, ""] })}><Plus /> Add one</Button> : null}
            <p className="text-xs text-muted-foreground">Only what is true and you can show. Taplo never adds credentials for you.</p></div>
        </div>
      )
    }
    case "faq": return (
      <div className="grid gap-4">
        <TaploInput label="Question" value={value.question} error={err.question} maxLength={240} onChange={(e) => onChange({ ...value, question: e.target.value })} />
        <div className="grid gap-1.5"><Label htmlFor="fq-a">Answer</Label><Textarea id="fq-a" rows={4} maxLength={2000} value={value.answer} aria-invalid={Boolean(err.answer)} onChange={(e) => onChange({ ...value, answer: e.target.value })} />{err.answer ? <p role="alert" className="text-sm text-destructive">{err.answer}</p> : null}</div>
      </div>
    )
    case "photo": if (value.id) return <div className="grid gap-4">
      <ImageField purpose="photo" samples={false} label="Photo" value={value.images[0]??null} defaultAlt="Gallery photo" maxEdge={1400} onChange={im=>onChange({...value,images:im?[im]:[]})}/>
      <TaploInput label="Caption (optional)" value={value.caption??""} maxLength={240} onChange={e=>onChange({...value,caption:e.target.value})}/>
      <details><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Before and after pair</summary><ImageField purpose="photo" samples={false} label="Before photo (optional)" value={value.before??null} defaultAlt="Before" maxEdge={1400} onChange={before=>onChange({...value,before:before??undefined})}/></details>
      {err.images?<p role="alert" className="text-sm text-destructive">{err.images}</p>:null}
    </div>;
    return (
      <div className="grid gap-3">
        {value.images.map((im: { src: string; alt: string }, i: number) => <ImageField key={i} samples={!setup} label={`Photo ${i + 1}`} value={im} defaultAlt="Photo" maxEdge={1400} onChange={(v) => onChange({ ...value, images: v ? value.images.map((x: unknown, n: number) => (n === i ? v : x)) : value.images.filter((_: unknown, n: number) => n !== i) })} />)}
        <ImageField key={`add-${value.images.length}`} samples={!setup} label={value.images.length ? "Add another photo" : "Choose a photo"} value={null} defaultAlt="Photo" maxEdge={1400} onChange={(v) => v && onChange({ ...value, images: [...value.images, v] })} />
        {err.images ? <p role="alert" className="text-sm text-destructive">{err.images}</p> : null}
      </div>
    )
    case "social": return (
      <div className="grid gap-4">
        <Segment label="Which platform" value={value.platform} options={SOCIAL_PLATFORMS.map(p=>({value:p.id,label:p.label}))} onChange={(v) => onChange({ ...value, platform: v })} />
        <UrlField label="Profile address" value={value.url} onCommit={(v) => onChange({ ...value, url: v ?? "" })} help={err.url} />
      </div>
    )
    case "credential": return <TaploInput label="Credential or fact" value={value.text} error={err.text} maxLength={160} hint="For example “Fully insured”. Only what is true." onChange={(e) => onChange({ ...value, text: e.target.value })} />
    case "offer": return (
      <div className="grid gap-4">
        <TaploInput label="Title" value={value.title} error={err.title} maxLength={120} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        <div className="grid gap-1.5"><Label htmlFor="of-d">Details (optional)</Label><Textarea id="of-d" rows={3} maxLength={600} value={value.description ?? ""} onChange={(e) => onChange({ ...value, description: e.target.value })} /></div>
        <TaploInput label="Code to mention (optional)" value={value.code ?? ""} maxLength={40} hint="Shown as text. Taplo does not check or redeem codes." onChange={(e) => onChange({ ...value, code: e.target.value })} />
        <TaploInput label="Ends on (optional)" type="date" value={value.endsAt ?? ""} onChange={(e) => onChange({ ...value, endsAt: e.target.value || undefined })} />
      </div>
    )
    case "phone": case "whatsapp": case "email": case "directions": {
      const label = { phone: "Phone number", whatsapp: "WhatsApp number", email: "Email address", directions: "Map link" }[kind]
      return <TaploInput label={label} value={value.value} error={err.value} type={kind === "email" ? "email" : kind === "directions" ? "url" : "tel"} inputMode={kind === "email" ? "email" : kind === "directions" ? "url" : "tel"} hint={kind === "whatsapp" ? "Include the country code, like +44." : kind === "directions" ? "Open your place in a map app, then paste the share link." : undefined} onChange={(e) => onChange({ ...value, value: e.target.value })} />
    }
  }
}
