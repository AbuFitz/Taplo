import { TaploLogo } from "@/components/taplo/brand"

/** Only shown while the real local draft hydrates; never adds an artificial delay. */
export function SetupLoading() {
  return <main className="grid min-h-[80dvh] place-items-center px-6"><div role="status" className="text-center"><TaploLogo className="mx-auto h-12" /><div className="setup-loading-art my-10" aria-hidden="true"><i /><i /><i /></div><p className="font-display text-2xl font-semibold tracking-tight">Opening your workspace</p><p className="mt-2 text-sm text-muted-foreground">Loading your page and editing tools.</p></div></main>
}
