import { getDesign } from "@/features/page/themes/designs";
import { ChoicePreview } from "@/features/preview/ChoicePreview";

/** Current designs use the real renderer; retained legacy looks use their versioned captures. */
export function LookThumb({ id, className }: { id: string; className?: string }) {
  const design = getDesign(id);
  if (design) {
    return <span className={`block ${className ?? ""}`}><ChoicePreview src={`/appearance/frame?scenario=station&look=${encodeURIComponent(id)}&design=1`} title={`${design.name} starting look preview`} height={540} /></span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/looks/${id}.webp`} alt="" width={390} height={540} loading="lazy" decoding="async" draggable={false} className={`block aspect-[390/540] w-full bg-muted object-cover object-top ${className ?? ""}`} />;
}
