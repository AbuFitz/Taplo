/**
 * The real page in a real iframe at its true width, so every control (booking, team profiles, gallery) works
 * exactly as it does for a visitor. No scaling, no rotation. The page inside is the same renderer the public route uses.
 */
export function LivePhone({ scenario, title }: { scenario: string; title: string }) {
  return (
    <div className="mx-auto w-[min(100%,24.5rem)] rounded-[2.25rem] bg-neutral-900 p-2 shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_40px_70px_-35px_rgb(0_0_0/0.5)]">
      <iframe title={title} src={`/appearance/frame?scenario=${scenario}`} loading="lazy" className="block h-[46rem] max-h-[80dvh] w-full rounded-[1.75rem] bg-white" />
    </div>
  )
}
