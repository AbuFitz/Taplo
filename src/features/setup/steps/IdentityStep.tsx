"use client"
import * as React from "react"
import { TAPLO_DOMAINS } from "@/lib/domains"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { PROFILE_CHOICES } from "@/features/page/contracts/style"
import { resolveStyle } from "@/features/page/themes/resolve"
import { ChoicePreview } from "@/features/preview/ChoicePreview"
import { setName, setSlug, slugProblems } from "@/features/demo/actions"
import { PicturePicker } from "../PicturePicker"
import { useSetup } from "../context"

/** Who you are: logo, name and where your page lives; then how the top of your page is arranged. */
export function IdentityStep() {
  const { s, update, part, showErrors } = useSetup()
  const c = s.content
  const [edit, setEdit] = React.useState(false)
  const problems = slugProblems(c.identity.slug)
  const first = part === undefined || part === 0
  const second = part === undefined || part === 1
  const layout = resolveStyle(s.page.themeId, s.page.appearance).spec.header.layout
  const shape = s.page.appearance.header?.avatarShape
  const setHeader = (patch: Record<string, unknown>) => update((x) => ({ ...x, page: { ...x.page, appearance: { ...x.page.appearance, header: { ...x.page.appearance.header, ...patch } } } }))

  return (
    <>
      <div className="sf-stack" hidden={!first}>
        <PicturePicker kind="logo" label="Add your logo or profile photo" name={c.identity.name} framing={shape === "circle" ? "circle" : shape === "square" ? "square" : "logo"} value={c.identity.logo ?? null}
          onFraming={(shape) => setHeader({ avatarShape: shape })}
          onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, logo: v ?? undefined } } }))} />
        <div className="sf-field">
          <label htmlFor="sf-name">Business name</label>
          <input id="sf-name" className="sf-input" placeholder="e.g. North Street Studio" value={c.identity.name} maxLength={100} autoComplete="organization" onChange={(e) => update((x) => setName(x, e.target.value), { coalesce: "name" })} />
          <div className="sf-slug" data-testid="setup-address">
            {edit || (showErrors && problems.length) ? (
              <label className="sf-slug-edit">
                <span className="sr-only">Web address</span>
                <span aria-hidden="true">{TAPLO_DOMAINS.host}/</span>
                <input aria-label="Web address" value={c.identity.slug} maxLength={40} autoCapitalize="none" autoCorrect="off" autoFocus={edit} aria-invalid={problems.length > 0 || undefined} onChange={(e) => update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} />
                <button type="button" className="sf-link" onClick={() => setEdit(false)}>Done</button>
              </label>
            ) : (
              <>
                <span className="sf-slug-url" aria-live="polite">{TAPLO_DOMAINS.host}/<b>{c.identity.slug || "your-name"}</b></span>
                <button type="button" className="sf-link" onClick={() => setEdit(true)} aria-label="Change your web address">Change</button>
              </>
            )}
          </div>
          {problems.length && c.identity.slug && (edit || showErrors) ? <p className="sf-error" role="alert">{SLUG_PROBLEM_MESSAGE[problems[0]!]}</p> : null}
        </div>
      </div>

      <div className="sf-stack" hidden={!second}>
        <div className="sf-field">
          <label htmlFor="sf-tagline">Short description <small>optional</small></label>
          <input id="sf-tagline" className="sf-input" placeholder="e.g. Independent hair studio in St Albans." value={c.identity.tagline ?? ""} maxLength={160} onChange={(e) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, tagline: e.target.value || undefined } } }), { coalesce: "tag" })} />
        </div>
        <fieldset className="sf-group" data-testid="setup-profile-choices">
          <legend className="sf-label">How should the top of your page look?</legend>
          <div className="sf-arrange" role="radiogroup" aria-label="Profile arrangement">
            {PROFILE_CHOICES.map((item) => (
              <label key={item.id} className="sf-arrange-choice" data-on={layout === item.id}>
                <input type="radio" name="profile-arrangement" aria-label={item.name} checked={layout === item.id} onChange={() => setHeader({ layout: item.id, align: item.id === "cutout" || item.id === "bento" ? "center" : "left" })} />
                <ChoicePreview src={`/demo/preview?header=${item.id}`} title={`${item.name} profile preview`} height={430} />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {layout === "banner" ? (
          <PicturePicker kind="cover" label="Cover photo (optional)" name={c.identity.name} value={c.identity.heroImage ?? null}
            onChange={(v) => update((x) => ({ ...x, content: { ...x.content, identity: { ...x.content.identity, heroImage: v ?? undefined } } }))} />
        ) : null}
      </div>
    </>
  )
}
