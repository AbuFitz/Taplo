import type { IndustryId } from "@/features/marketing/ia";
import { EXAMPLES, type Example } from "./examples";

/** Nearby audiences, not a claim about conversion performance. Keep personal/creative work discoverable too. */
const NEARBY: Record<IndustryId, readonly IndustryId[]> = {
  beauty: ["health", "fitness"],
  health: ["fitness", "beauty", "learning"],
  fitness: ["health", "beauty", "learning"],
  learning: ["health", "entrepreneurs", "fitness"],
  motoring: ["trades", "entrepreneurs"],
  trades: ["motoring", "entrepreneurs"],
  food: ["makers", "entrepreneurs"],
  makers: ["food", "portfolios", "entrepreneurs"],
  portfolios: ["entrepreneurs", "makers"],
  entrepreneurs: ["portfolios", "makers", "trades"],
};

/** Relevant alternatives to the design being viewed, with stable catalogue order for equal matches. */
export function relatedExamples(source: Example, limit = 3): Example[] {
  const nearby = NEARBY[source.industry];
  const rank = (candidate: Example) => {
    if (candidate.industry === source.industry) return 100;
    const index = nearby.indexOf(candidate.industry);
    return index < 0 ? 0 : 60 - index * 10;
  };
  return EXAMPLES.filter((candidate) => candidate.slug !== source.slug)
    .map((candidate, order) => ({
      candidate,
      order,
      relevance: rank(candidate),
    }))
    .sort((a, b) => b.relevance - a.relevance || a.order - b.order)
    .slice(0, Math.max(0, limit))
    .map(({ candidate }) => candidate);
}
