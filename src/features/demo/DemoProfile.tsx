"use client"

import { useMemo } from "react"
import Link from "next/link"
import { EditBridge } from "@/features/page/editor/EditBridge"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { parseContent, useDemo } from "./store"

/**
 * Renders the draft ("preview") or the frozen published copy through the SAME
 * PageRenderer/view-model the real public route and fixture routes use.
 */
export function DemoProfile({ mode, slug, editing = false }: { mode: "draft" | "published"; slug?: string; editing?: boolean }) {
  const { ready, state } = useDemo()
  const source = useMemo(() => {
    if (!state) return null
    if (mode === "draft") return { content: state.content, page: state.page, plan: state.plan }
    const p = state.published
    return p && p.content.identity.slug === slug ? { content: p.content, page: p.page, plan: p.plan } : null
  }, [state, mode, slug])

  const vm = useMemo(() => {
    if (!source) return null
    // A draft in progress may not have every required field yet; the preview fills gaps with neutral placeholders (publishing still requires the real values).
    const id = source.content.identity
    const content = mode === "draft" ? { ...source.content, identity: { ...id, name: id.name || "Your business name", industryKey: id.industryKey || "other", industryLabel: id.industryLabel || "Your business", slug: id.slug || "your-page" } } : source.content
    const parsed = parseContent(content)
    if (!parsed.success || !parsed.data.identity.name) return null
    return buildPageViewModel(parsed.data, source.page, { plan: source.plan })
  }, [source])

  if (!ready) return <Message title="Loading…" />
  if (!vm) {
    return mode === "draft" ? (
      <Message title="Your page appears here" body="Add a business name and it will start taking shape." />
    ) : (
      <Message
        title="Nothing published at this address"
        body="Pages you publish in demo mode live only in the browser that created them. For an example anyone can open, see the sample profiles."
        action={<span className="flex gap-4"><Link className="underline" href="/dashboard/page">My page</Link><Link className="underline" href="/demo/profiles">Sample profiles</Link></span>}
      />
    )
  }
  return (
    <>
      {mode === "published" ? (
        <div role="note" className="relative z-10 bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Preview of your published page. It opens in this browser only; a public address needs publishing, which is not connected yet.
        </div>
      ) : null}
      <PageRenderer vm={vm} />
      {editing ? <EditBridge /> : null}
    </>
  )
}

function Message({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      {body ? <p className="mt-2 text-sm text-neutral-600">{body}</p> : null}
      {action ? <div className="mt-4 text-sm">{action}</div> : null}
    </main>
  )
}
