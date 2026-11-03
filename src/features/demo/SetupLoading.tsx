import "./onboarding-mobile.css"
/** Real hydration only. The skeleton shares setup's final geometry, without a timed artificial wait. */
export function SetupLoading() {
  return <div className="setup-scene"><div className="setup-backdrop" aria-hidden="true" /><main className="setup-flow setup-skeleton" data-mobile-layout="focus" data-step="type" aria-busy="true" aria-label="Opening setup">
    <div className="setup-progress"><div className="setup-load-line" role="status" aria-label="Opening your page" /></div>
    <div className="setup-workspace" aria-hidden="true">
      <section><div className="h-9 w-2/3 rounded-xl bg-neutral-100" /><div className="grid content-start gap-5 pt-8"><div className="size-20 rounded-3xl bg-neutral-100" /><div className="h-12 rounded-2xl bg-neutral-100" /><div className="h-12 rounded-2xl bg-neutral-50" /></div><div className="my-4 h-12 rounded-full bg-neutral-100" /></section>
      <aside><div className="setup-canvas-heading" /><div className="setup-canvas"><div className="setup-phone-skeleton" /></div></aside>
    </div>
  </main></div>
}
