export interface HeroScene {
  label: string;
  name: string;
  slug: string;
  scenario: string;
  action: string | null;
  blocks: {
    title: string;
    kind: string;
    variant: string;
    entries: { title: string; detail: string }[];
  }[];
}
