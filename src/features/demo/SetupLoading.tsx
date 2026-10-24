import { TaploLogo } from "@/components/taplo/brand"
/** Actual hydration state, with the same composition as setup; never an artificial wait. */
export function SetupLoading() {
  return <main className="min-h-dvh bg-white p-6"><TaploLogo className="h-8"/><div className="setup-load-line" role="status" aria-label="Opening your page"/><div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-2" aria-hidden="true"><div className="grid content-start gap-5"><div className="h-9 w-3/4 rounded-xl bg-neutral-100"/><div className="h-14 rounded-2xl bg-neutral-100"/><div className="h-14 rounded-2xl bg-neutral-50"/></div><div className="h-80 rounded-3xl bg-neutral-50"/></div></main>
}
