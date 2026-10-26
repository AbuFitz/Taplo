"use client"
import * as React from "react"
import { CalendarDays, Check, ChevronDown, Globe, MessageSquare, MessagesSquare, Phone, X } from "lucide-react"
import { normalizePhone, safeUrl } from "@/lib/validation"
import { newWidget } from "@/features/page/starter"
import { SOCIAL_PLATFORMS, socialUrl } from "@/features/page/social-platforms"
import { SocialIcon } from "@/features/page/widgets/social-icons"
import { Field } from "../Field"
import { useSetup } from "../context"
import { applyGoal, goalOf, type Goal } from "../goal"
import { actionAdvice } from "../recommend"

type Draft = { email: string; phone: string; whatsapp: string; website: string; instagram: string; socials: Record<string, string> }
const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const websiteUrl = (v: string) => { const t = v.trim(); return t ? (/^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`) : undefined }
const ICONS: Record<Goal, typeof Phone> = { book: CalendarDays, call: Phone, message: MessageSquare, enquire: Globe }

/** Step 3. What customers should do first (recommended for this kind of business), then the details that make it work. */
export function ReachStep() {
  const { s, update, part, setValid } = useSetup()
  const goal = goalOf(s)
  const advice = actionAdvice(s.content.identity.industryKey)
  const recommended = advice.find((a) => a.recommended)!
  const showChoice = part === undefined || part === 0
  const showDetails = part === undefined || part === 1

  const [draft, setDraft] = React.useState<Draft>(() => {
    const saved = s.setupDrafts?.connections
    return {
      email: saved?.email ?? s.content.contacts.email ?? "",
      phone: saved?.phone ?? s.content.contacts.phone ?? "",
      whatsapp: saved?.whatsapp ?? s.content.contacts.whatsapp ?? "",
      website: saved?.website ?? s.content.contacts.website ?? "",
      instagram: "",
      socials: saved?.socials ?? { ...Object.fromEntries((s.content.contacts.social ?? []).map((p) => [p.platform, p.url])), ...(saved?.instagram ? { instagram: saved.instagram } : {}) },
    }
  })
  const [more, setMore] = React.useState(false)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const errors: Record<string, string> = {
    email: draft.email && !emailValid(draft.email) ? "Enter a valid email address." : "",
    phone: draft.phone && !normalizePhone(draft.phone) ? "Enter a valid phone number." : "",
    whatsapp: draft.whatsapp && !normalizePhone(draft.whatsapp) ? "Include a valid number with the country code." : "",
    website: draft.website && !safeUrl.safeParse(websiteUrl(draft.website)).success ? "Enter a valid website or booking address." : "",
    ...Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.id, draft.socials[p.id] && !socialUrl(p.id, draft.socials[p.id]) ? `Use your ${p.label} profile address or username.` : ""])),
  }
  const valid = !Object.values(errors).some(Boolean)
  React.useEffect(() => setValid(valid), [valid, setValid])

  const commit = (next: Draft, key: string) => {
    setDraft(next)
    update((st) => {
      const website = websiteUrl(next.website)
      const social = SOCIAL_PLATFORMS.flatMap((p) => { const url = socialUrl(p.id, next.socials[p.id] ?? ""); return url ? [{ platform: p.id, url }] : [] })
      const contacts = { ...st.content.contacts, email: emailValid(next.email) ? next.email.trim() : undefined, phone: normalizePhone(next.phone) ?? undefined, whatsapp: normalizePhone(next.whatsapp) ?? undefined, website: website && safeUrl.safeParse(website).success ? website : undefined, social }
      const widgets = [...st.page.widgets]
      if ((contacts.website || social.length) && !widgets.some((w) => w.type === "social")) widgets.push(newWidget("social"))
      const primary = goalOf(st) === "message" ? (contacts.whatsapp ? "whatsapp" : "email") : st.page.meta.primaryAction
      return { ...st, setupDrafts: { ...st.setupDrafts, connections: next }, content: { ...st.content, contacts }, page: { ...st.page, meta: { ...st.page.meta, primaryAction: primary }, widgets } }
    }, { coalesce: `connection-${key}` })
  }
  const change = (key: "email" | "phone" | "whatsapp" | "website", value: string) => commit({ ...draft, [key]: value }, key)
  const remove = (id: string) => {
    setEditing(null)
    if (id === "whatsapp") change("whatsapp", "")
    else { const socials = { ...draft.socials }; delete socials[id]; commit({ ...draft, socials }, id) }
  }
  const field = (key: "email" | "phone" | "whatsapp" | "website", label: string, placeholder: string, type = "text", optional = false) => (
    <Field label={label} optional={optional} placeholder={placeholder} type={type} inputMode={type === "tel" ? "tel" : type === "email" ? "email" : key === "website" ? "url" : undefined} autoCapitalize="none" autoCorrect="off" value={draft[key]} onChange={(e) => change(key, e.target.value)} onBlur={() => setTouched((t) => ({ ...t, [key]: true }))} error={touched[key] ? errors[key] : undefined} />
  )
  const platforms = [{ id: "whatsapp", label: "WhatsApp" }, ...SOCIAL_PLATFORMS].slice(0, more ? undefined : 7)
  const platform = editing && editing !== "whatsapp" ? SOCIAL_PLATFORMS.find((p) => p.id === editing) : undefined

  return (
    <div className="sf-stack" data-testid="reach">
      <fieldset className="sf-group" hidden={!showChoice}>
        <legend className="sf-label">Main button</legend>
        <div className="sf-choices" role="group" aria-label="Main button">
          {advice.map((a) => {
            const Icon = ICONS[a.id]
            const label = { book: "Booking requests", enquire: "Links & enquiries", call: "Phone calls", message: "Messages" }[a.id]
            return (
              <button key={a.id} type="button" className="sf-tile sf-choice" aria-pressed={goal === a.id} aria-label={label} onClick={() => update((x) => applyGoal(x, a.id))}>
                <Icon aria-hidden="true" />
                <span><span className="sf-choice-label">{a.label}</span><small>{a.detail}</small></span>
                {a.recommended ? <span className="sf-tag">Recommended</span> : null}
              </button>
            )
          })}
        </div>
        <p className="sf-hint" data-testid="action-why">{goal === recommended.id ? `${recommended.why}.` : `${recommended.why}. You can change this any time.`}</p>
      </fieldset>

      <div className="sf-stack" hidden={!showDetails}>
        <div className="sf-group">
          <p className="sf-label">Contact details</p>
          {field("phone", "Phone", "07700 900123", "tel")}
          {field("email", "Email", "hello@yourbusiness.co.uk", "email")}
          {field("website", "Website or booking link", "yourbusiness.co.uk", "text", true)}
        </div>
        <fieldset className="sf-group" data-testid="social-links">
          <legend className="sf-label">Social profiles <small>optional</small></legend>
          <div className="sf-social-grid" role="group" aria-label="Social platforms">
            {platforms.map((p) => {
              const filled = p.id === "whatsapp" ? Boolean(draft.whatsapp) : Boolean(draft.socials[p.id])
              return (
                <button key={p.id} type="button" className="sf-social" aria-pressed={editing === p.id} data-filled={filled || undefined} onClick={() => setEditing(editing === p.id ? null : p.id)}>
                  <SocialIcon platform={p.id} className="size-6" />
                  <span>{p.label}</span>
                  {filled ? <Check aria-hidden="true" className="sf-social-check" /> : null}
                </button>
              )
            })}
            <button type="button" className="sf-social sf-social-more" aria-expanded={more} onClick={() => setMore((v) => !v)}>
              {more ? <ChevronDown aria-hidden="true" className="rotate-180" /> : <MessagesSquare aria-hidden="true" />}<span>{more ? "Fewer" : "More"}</span>
            </button>
          </div>
          {editing ? (
            <div className="sf-social-field" key={editing}>
              <div className="min-w-0 flex-1">
                {editing === "whatsapp" ? field("whatsapp", "WhatsApp number", "+44 7700 900123", "tel") : (
                  <Field label={`${platform!.label} profile`} placeholder={`${platform!.host}/${platform!.prefix}yourbusiness`} autoCapitalize="none" autoCorrect="off" autoFocus value={draft.socials[editing] ?? ""} onChange={(e) => commit({ ...draft, socials: { ...draft.socials, [editing]: e.target.value } }, editing)} onBlur={() => setTouched((t) => ({ ...t, [editing]: true }))} error={touched[editing] ? errors[editing] : undefined} />
                )}
              </div>
              <button type="button" className="sf-icon-btn" aria-label={`Remove ${editing === "whatsapp" ? "WhatsApp" : platform!.label}`} onClick={() => remove(editing)}><X aria-hidden="true" /></button>
            </div>
          ) : null}
        </fieldset>
      </div>
    </div>
  )
}
