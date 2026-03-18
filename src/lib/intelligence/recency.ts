import type { DaySummary } from "@/types";

// Recency weighting: recent days matter more than old ones.
// Last 7 days get full weight, days 8-21 get 50%, older gets 25%.

export interface WeightedSummary {
  summary: DaySummary;
  weight: number;
}

export function applyRecencyWeights(summaries: DaySummary[]): WeightedSummary[] {
  const now = new Date();
  return summaries.map((s) => {
    const age = Math.floor(
      (now.getTime() - new Date(s.date + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24)
    );
    let weight: number;
    if (age <= 7) weight = 1.0;
    else if (age <= 21) weight = 0.5;
    else weight = 0.25;
    return { summary: s, weight };
  });
}

export function weightedAverage(values: { value: number; weight: number }[]): number {
  if (values.length === 0) return 0;
  const totalWeight = values.reduce((s, v) => s + v.weight, 0);
  if (totalWeight === 0) return 0;
  return values.reduce((s, v) => s + v.value * v.weight, 0) / totalWeight;
}

export function weightedRate(
  items: WeightedSummary[],
  predicate: (s: DaySummary) => boolean
): number {
  if (items.length === 0) return 0;
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const hitWeight = items
    .filter((i) => predicate(i.summary))
    .reduce((s, i) => s + i.weight, 0);
  return totalWeight > 0 ? (hitWeight / totalWeight) * 100 : 0;
}
