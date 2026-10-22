"use client"

import * as React from "react"
import { Lock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { LOCATION_MODES } from "@/features/businesses/content"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { FONT_KEYS } from "@/features/themes/contracts/tokens"
import { LAYOUT_PRESETS } from "@/features/themes/presets/layouts"
import { buildPublicProfileViewModel } from "@/features/themes/renderer"
import { resolveTokens } from "@/features/themes/tokens/resolve"
import { cn } from "@/lib/utils"
import { setLayout, setName, setSlug, slugProblems } from "../actions"
import { useDraft } from "../hooks"
import { parseContent } from "../store"
import { EmailField, PhoneField, PreviewFrame, UrlField } from "../ui"
import { PageHeader, Panel } from "./Panel"

const LOCATION_LABEL = { premises: "A place customers visit", service_area: "I travel to customers", online: "Online only" } as const
const SOCIALS = ["instagram", "facebook", "tiktok", "linkedin", "youtube", "x"] as const
const FONT_LABEL: Record<(typeof FONT_KEYS)[number], string> = {
  inter: "Inter", barlowCondensed: "Barlow Condensed", fraunces: "Fraunces", sourceSerif: "Source Serif", manrope: "Manrope", lexend: "Lexend",
}
const BLOCK_LABEL: Record<string, string> = { hero: "Hero", services: "Services", reviews: "Reviews", gallery: "Gallery", team: "Team", booking: "Booking", contact: "Contact", about: "About", faq: "FAQ", caseStudies: "Case studies" }

function Locked({ children }: { children: React.ReactNode }) {
  return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-3.5" aria-hidden="true" />{children}</p>
}

export function Profile() {
  const { state: s, c, ent, setContent, patch } = useDraft()
  const [slugTouched, setSlugTouched] = React.useState(false)
  if (!s || !c || !ent) return null
  const slugErrs = slugProblems(c.identity.slug)
  const parsed = parseContent(c)

  const switchPreview = (layoutId: string) => {
    if (!parsed.success) return null
    const l = LAYOUT_PRESETS.find((x) => x.id === layoutId)!
    const vm = buildPublicProfileViewModel(parsed.data, { config: { layoutId, layoutVersion: l.version, tokenPresetId: l.tokenPresetId, overrides: {} }, plan: s.plan })
    return { visible: vm.blocks.map((b) => b.config.type), unplaced: vm.unplacedContent }
  }
  const tokenWarnings = resolveTokens(s.config.tokenPresetId, s.config.overrides).warnings
  const setOverride = (key: string, value?: string) =>
    patch((x) => {
      const o = { ...x.config.overrides }
      if (value) o[key] = value
      else delete o[key]
      return { ...x, config: { ...x.config, overrides: o } }
    })
  const faqs = c.faqs ?? []
  const credentials = c.credentials ?? []

  return (
    <>
      <PageHeader title="Profile" description="Your business details, content and look. Changes appear in the preview straight away and go live when you publish." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tabs defaultValue="details" className="min-w-0">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">About &amp; FAQ</TabsTrigger>
            <TabsTrigger value="look">Layout &amp; style</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 grid gap-6">
            <Panel title="Business">
              <div className="grid gap-4">
                <TaploInput label="Business name" value={c.identity.name} maxLength={100} onChange={(e) => patch((x) => setName(x, e.target.value))} />
                <TaploInput label="Tagline (optional)" value={c.identity.tagline ?? ""} maxLength={160} onChange={(e) => setContent((x) => ({ ...x, identity: { ...x.identity, tagline: e.target.value || undefined } }))} />
                <TaploInput label="Type of business (shown on your page)" value={c.identity.industryLabel} maxLength={80} onChange={(e) => setContent((x) => ({ ...x, identity: { ...x.identity, industryLabel: e.target.value } }))} />
                <div>
                  <TaploInput label="Web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" onBlur={() => setSlugTouched(true)} onChange={(e) => patch((x) => setSlug(x, e.target.value))} error={slugTouched && slugErrs.length ? SLUG_PROBLEM_MESSAGE[slugErrs[0]!] : undefined} />
                  <p className="mt-1.5 text-sm text-muted-foreground">taplo.co/<strong>{c.identity.slug || "…"}</strong>{s.published && s.published.content.identity.slug !== c.identity.slug ? " — on a connected environment the old address keeps redirecting here." : ""}</p>
                </div>
              </div>
            </Panel>
            <Panel title="Location" description="A travelling or online business never has its private address published.">
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="loc-mode">Where do you work?</Label>
                  <Select value={c.location.mode} onValueChange={(v) => setContent((x) => ({ ...x, location: { ...x.location, mode: v as (typeof LOCATION_MODES)[number] } }))}>
                    <SelectTrigger id="loc-mode" className="min-h-11 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent position="popper">{LOCATION_MODES.map((m) => <SelectItem key={m} value={m}>{LOCATION_LABEL[m]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <TaploInput label={c.location.mode === "service_area" ? "Areas you cover" : "Town or area"} value={c.location.locality ?? ""} maxLength={120} onChange={(e) => setContent((x) => ({ ...x, location: { ...x.location, locality: e.target.value || undefined } }))} />
                {c.location.mode === "premises" ? <TaploInput label="Street address (optional)" value={c.location.addressLine ?? ""} maxLength={240} onChange={(e) => setContent((x) => ({ ...x, location: { ...x.location, addressLine: e.target.value || undefined } }))} /> : null}
                <UrlField label="Directions link (optional)" value={c.location.directionsUrl} onCommit={(v) => setContent((x) => ({ ...x, location: { ...x.location, directionsUrl: v } }))} />
              </div>
            </Panel>
            <Panel title="Contact" description="Only channels you fill in appear on your page. Call and WhatsApp are on every plan.">
              <div className="grid gap-4 sm:grid-cols-2">
                <PhoneField label="Phone" value={c.contacts.phone} onCommit={(v) => setContent((x) => ({ ...x, contacts: { ...x.contacts, phone: v } }))} />
                <PhoneField label="WhatsApp" value={c.contacts.whatsapp} onCommit={(v) => setContent((x) => ({ ...x, contacts: { ...x.contacts, whatsapp: v } }))} />
                <EmailField value={c.contacts.email} onCommit={(v) => setContent((x) => ({ ...x, contacts: { ...x.contacts, email: v } }))} />
                <UrlField label="Website (optional)" value={c.contacts.website} onCommit={(v) => setContent((x) => ({ ...x, contacts: { ...x.contacts, website: v } }))} />
              </div>
            </Panel>
            <Panel title="Social links">
              {ent.socialLinks ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {SOCIALS.map((p) => (
                    <UrlField key={p} label={p === "x" ? "X" : p[0]!.toUpperCase() + p.slice(1)} value={(c.contacts.social ?? []).find((x) => x.platform === p)?.url}
                      onCommit={(v) => setContent((x) => ({ ...x, contacts: { ...x.contacts, social: [...(x.contacts.social ?? []).filter((q) => q.platform !== p), ...(v ? [{ platform: p, url: v }] : [])] } }))} />
                  ))}
                </div>
              ) : <Locked>Social links start on the Core plan. Your entries are kept if you add them later.</Locked>}
            </Panel>
          </TabsContent>

          <TabsContent value="content" className="mt-4 grid gap-6">
            <Panel title="About" description="Say what you do and why customers can trust you. Only include facts you can stand behind.">
              <div className="grid gap-1.5">
                <Label htmlFor="about">About</Label>
                <Textarea id="about" rows={6} maxLength={4000} value={c.about ?? ""} onChange={(e) => setContent((x) => ({ ...x, about: e.target.value || undefined }))} />
              </div>
              <div className="mt-5">
                <p className="mb-1 text-sm font-medium">Credentials and facts (optional)</p>
                <p className="mb-2 text-sm text-muted-foreground">Shown only if you add them. Taplo never adds badges or verification for you.</p>
                <ul className="grid gap-2">
                  {credentials.map((cr, i) => (
                    <li key={i} className="flex gap-2">
                      <TaploInput className="flex-1" label={`Credential ${i + 1}`} value={cr} maxLength={160} onChange={(e) => setContent((x) => ({ ...x, credentials: credentials.map((q, j) => (j === i ? e.target.value : q)) }))} />
                      <Button type="button" variant="outline" size="icon" className="mt-6 size-11" aria-label={`Remove credential ${i + 1}`} onClick={() => setContent((x) => ({ ...x, credentials: credentials.filter((_, j) => j !== i) }))}><Trash2 /></Button>
                    </li>
                  ))}
                </ul>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setContent((x) => ({ ...x, credentials: [...credentials, ""] }))}><Plus /> Add credential</Button>
              </div>
            </Panel>
            <Panel title="Questions customers ask">
              <ul className="grid gap-4">
                {faqs.map((f, i) => (
                  <li key={f.id} className="grid gap-2 rounded-lg border p-3">
                    <TaploInput label="Question" value={f.question} maxLength={240} onChange={(e) => setContent((x) => ({ ...x, faqs: faqs.map((q) => (q.id === f.id ? { ...q, question: e.target.value } : q)) }))} />
                    <div className="grid gap-1.5"><Label htmlFor={`a-${f.id}`}>Answer</Label><Textarea id={`a-${f.id}`} rows={3} maxLength={2000} value={f.answer} onChange={(e) => setContent((x) => ({ ...x, faqs: faqs.map((q) => (q.id === f.id ? { ...q, answer: e.target.value } : q)) }))} /></div>
                    <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => setContent((x) => ({ ...x, faqs: faqs.filter((q) => q.id !== f.id) }))}><Trash2 /> Remove question {i + 1}</Button>
                  </li>
                ))}
              </ul>
              {faqs.length === 0 ? <p className="mb-3 text-sm text-muted-foreground">No questions yet. This section stays hidden on your page until you add one.</p> : null}
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setContent((x) => ({ ...x, faqs: [...faqs, { id: `faq-${Math.random().toString(36).slice(2, 8)}`, question: "", answer: "" }] }))}><Plus /> Add question</Button>
              <p className="mt-3 text-xs text-muted-foreground">Empty questions are hidden from your page automatically.</p>
            </Panel>
          </TabsContent>

          <TabsContent value="look" className="mt-4 grid gap-6">
            <Panel title="Layout" description="Your type of business picked the starting layout. Switching changes composition, never your content.">
              {!ent.themeSwitching ? <Locked>Choosing a different layout starts on the Core plan. Your industry layout is used on Free.</Locked> : null}
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {LAYOUT_PRESETS.map((l) => {
                  const active = s.config.layoutId === l.id
                  const sw = switchPreview(l.id)
                  const disabled = !ent.themeSwitching && !active
                  return (
                    <li key={l.id}>
                      <button type="button" disabled={disabled} aria-pressed={active} onClick={() => patch((x) => setLayout(x, l.id))}
                        className={cn("w-full rounded-xl border p-4 text-left transition-colors enabled:hover:bg-muted disabled:opacity-60", active && "border-primary ring-2 ring-primary/30")}>
                        <span className="flex items-center justify-between font-semibold">{l.label}{active ? <span className="text-xs font-medium text-muted-foreground">Current</span> : null}</span>
                        {sw ? (
                          <>
                            <span className="mt-2 block text-xs text-muted-foreground">Shows: {sw.visible.map((b) => BLOCK_LABEL[b]).join(" → ")}</span>
                            {sw.unplaced.length ? <span className="mt-1 block text-xs text-amber-800">Kept but not shown: {sw.unplaced.map((b) => BLOCK_LABEL[b]).join(", ")}</span> : null}
                          </>
                        ) : <span className="mt-2 block text-xs text-muted-foreground">Add a name to see what this layout would show.</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Panel>
            <Panel title="Colour and fonts" description="Accessible by design: colours that make text hard to read are rejected.">
              {ent.themeSwitching ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="accent">Accent colour</Label>
                    <div className="flex items-center gap-2">
                      <input id="accent" type="color" className="h-11 w-16 cursor-pointer rounded border" value={s.config.overrides.accent ?? resolveTokens(s.config.tokenPresetId, {}).tokens.accent} onChange={(e) => setOverride("accent", e.target.value)} />
                      <Button type="button" variant="outline" size="sm" onClick={() => setOverride("accent")}>Reset</Button>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="hfont">Heading font</Label>
                    <Select value={s.config.overrides.headingFont ?? "preset"} onValueChange={(v) => setOverride("headingFont", v === "preset" ? undefined : v)}>
                      <SelectTrigger id="hfont" className="min-h-11 w-full"><SelectValue /></SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="preset">Layout default</SelectItem>
                        {FONT_KEYS.map((f) => <SelectItem key={f} value={f}>{FONT_LABEL[f]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {tokenWarnings.map((w) => <p key={w.code} role="alert" className="text-sm text-amber-800 sm:col-span-2">{w.message}</p>)}
                </div>
              ) : <Locked>Colour and font choices start on the Core plan.</Locked>}
            </Panel>
          </TabsContent>
        </Tabs>
        <div className="min-w-0 xl:sticky xl:top-4 xl:self-start"><h2 className="mb-2 text-sm font-semibold">Live preview</h2><PreviewFrame height={620} /></div>
      </div>
    </>
  )
}
