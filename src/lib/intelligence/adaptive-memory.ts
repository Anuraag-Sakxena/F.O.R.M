// Adaptive Memory Engine — builds the RecommendationProfile from history.
// This is the "brain" of Step 9. Pure functions, no side effects.
// Later replaceable with AI inference.

import type { DaySummary } from "@/types";
import {
  type RecommendationProfile,
  type AnchorStrength,
  type AnchorId,
  EMPTY_PROFILE,
} from "@/types/recommendation-profile";
import { calculateFlowScore } from "@/lib/behavior";
import { evaluateMVD } from "./minimum-day";
import { applyRecencyWeights, weightedRate, weightedAverage, type WeightedSummary } from "./recency";
import { getConfidence } from "./confidence";

const MIN_DATA = 5;

export function buildRecommendationProfile(
  summaries: DaySummary[]
): RecommendationProfile {
  if (summaries.length < MIN_DATA) {
    return { ...EMPTY_PROFILE, dataPoints: summaries.length };
  }

  const weighted = applyRecencyWeights(summaries);
  const n = summaries.length;

  // ── Anchor analysis ──────────────────────────────────────
  const anchors = analyzeAnchors(weighted, n);
  const sorted = [...anchors].sort((a, b) => b.score - a.score);
  const strongestAnchor = sorted[0] ?? null;
  const weakest = [...anchors].sort((a, b) => a.score - b.score);
  const weakestPoint = weakest[0] ?? null;

  // ── Impact correlations ──────────────────────────────────
  const workoutImpact = correlateWithGoodDays(weighted, (s) => s.workoutDone);
  const nightRoutineImpact = correlateWithGoodDays(
    weighted,
    (s) => s.nightRoutineTotal > 0 && s.nightRoutineDone >= s.nightRoutineTotal * 0.75
  );
  const mealConsistency = weightedRate(weighted, (s) => s.mealsDone >= 3);

  // Lazy mode: we don't have lazy flag in summaries, so approximate via MVD on low-score days
  const lowDays = weighted.filter((w) => calculateFlowScore(w.summary) < 50);
  const lowDaysMVD = lowDays.filter((w) => evaluateMVD(w.summary).met);
  const lazyModeEffectiveness = lowDays.length >= 3
    ? (lowDaysMVD.length / lowDays.length) * 100
    : 50;

  // ── Day start / save patterns ────────────────────────────
  const bestDayStartHabit = detectBestStart(weighted);
  const bestDaySaveHabit = detectBestSave(weighted);

  // ── Recent trend ─────────────────────────────────────────
  const { trend, trendConfidence } = detectTrend(summaries);

  // ── Overall confidence ───────────────────────────────────
  const avgConsistency = anchors.length > 0
    ? anchors.reduce((s, a) => s + a.score, 0) / anchors.length
    : 0;
  const overallConfidence = getConfidence(n, avgConsistency);

  return {
    strongestAnchor,
    weakestPoint,
    consistencyAnchors: sorted.filter((a) => a.score >= 50),
    workoutImpact,
    nightRoutineImpact,
    mealConsistency,
    lazyModeEffectiveness,
    bestDayStartHabit,
    bestDaySaveHabit,
    recentTrend: trend,
    recentTrendConfidence: trendConfidence,
    dataPoints: n,
    overallConfidence,
  };
}

// ─── Helpers ─────────────────────────────────────────────────

function analyzeAnchors(weighted: WeightedSummary[], n: number): AnchorStrength[] {
  const workoutRate = weightedRate(weighted, (s) => s.workoutDone);
  const mealRate = weightedRate(weighted, (s) => s.mealsDone >= 2);
  const checklistRate = weightedRate(weighted, (s) => s.checklistDone >= s.checklistTotal * 0.6);
  const nightRate = weightedRate(
    weighted,
    (s) => s.nightRoutineTotal > 0 && s.nightRoutineDone >= s.nightRoutineTotal * 0.5
  );
  const skincareRate = weightedRate(
    weighted,
    (s) => (s.skincareMorningDone + s.skincareNightDone) >= (s.skincareMorningTotal + s.skincareNightTotal) * 0.5
  );

  return [
    { id: "workout" as AnchorId, label: "Movement", score: Math.round(workoutRate), confidence: getConfidence(n, workoutRate) },
    { id: "meals" as AnchorId, label: "Meals", score: Math.round(mealRate), confidence: getConfidence(n, mealRate) },
    { id: "checklist" as AnchorId, label: "Daily goals", score: Math.round(checklistRate), confidence: getConfidence(n, checklistRate) },
    { id: "night-routine" as AnchorId, label: "Night routine", score: Math.round(nightRate), confidence: getConfidence(n, nightRate) },
    { id: "skincare" as AnchorId, label: "Skincare", score: Math.round(skincareRate), confidence: getConfidence(n, skincareRate) },
  ];
}

function correlateWithGoodDays(
  weighted: WeightedSummary[],
  predicate: (s: DaySummary) => boolean
): number {
  const withHabit = weighted.filter((w) => predicate(w.summary));
  const withoutHabit = weighted.filter((w) => !predicate(w.summary));

  if (withHabit.length < 2 || withoutHabit.length < 2) return 50;

  const avgWith = weightedAverage(
    withHabit.map((w) => ({ value: calculateFlowScore(w.summary), weight: w.weight }))
  );
  const avgWithout = weightedAverage(
    withoutHabit.map((w) => ({ value: calculateFlowScore(w.summary), weight: w.weight }))
  );

  // Normalize to 0-100 where 50 = no correlation, 100 = strong positive
  const diff = avgWith - avgWithout;
  return Math.min(100, Math.max(0, 50 + diff));
}

function detectBestStart(weighted: WeightedSummary[]): AnchorId | null {
  // High-score days: what was done? Approximate by checking what's most commonly done on best days.
  const goodDays = weighted.filter((w) => calculateFlowScore(w.summary) >= 65);
  if (goodDays.length < 3) return null;

  const rates: { id: AnchorId; rate: number }[] = [
    { id: "workout", rate: goodDays.filter((w) => w.summary.workoutDone).length / goodDays.length },
    { id: "meals", rate: goodDays.filter((w) => w.summary.mealsDone >= 2).length / goodDays.length },
    { id: "checklist", rate: goodDays.filter((w) => w.summary.checklistDone >= 3).length / goodDays.length },
  ];

  rates.sort((a, b) => b.rate - a.rate);
  return rates[0].rate >= 0.6 ? rates[0].id : null;
}

function detectBestSave(weighted: WeightedSummary[]): AnchorId | null {
  // Low-flow days that still hit MVD: what was done?
  const rescuedDays = weighted.filter((w) => {
    const score = calculateFlowScore(w.summary);
    return score < 60 && score > 15 && evaluateMVD(w.summary).met;
  });
  if (rescuedDays.length < 2) return null;

  const rates: { id: AnchorId; rate: number }[] = [
    { id: "night-routine", rate: rescuedDays.filter((w) => w.summary.nightRoutineDone >= 2).length / rescuedDays.length },
    { id: "meals", rate: rescuedDays.filter((w) => w.summary.mealsDone >= 2).length / rescuedDays.length },
    { id: "checklist", rate: rescuedDays.filter((w) => w.summary.checklistDone >= 3).length / rescuedDays.length },
  ];

  rates.sort((a, b) => b.rate - a.rate);
  return rates[0].rate >= 0.5 ? rates[0].id : null;
}

function detectTrend(summaries: DaySummary[]): { trend: RecommendationProfile["recentTrend"]; trendConfidence: RecommendationProfile["recentTrendConfidence"] } {
  if (summaries.length < 10) return { trend: "insufficient", trendConfidence: "low" };

  const recent7 = summaries.slice(0, 7);
  const prev7 = summaries.slice(7, 14);
  if (prev7.length < 5) return { trend: "insufficient", trendConfidence: "low" };

  const recentAvg = recent7.reduce((s, d) => s + calculateFlowScore(d), 0) / recent7.length;
  const prevAvg = prev7.reduce((s, d) => s + calculateFlowScore(d), 0) / prev7.length;

  const diff = recentAvg - prevAvg;
  const confidence = getConfidence(summaries.length, Math.abs(diff) * 2);

  if (diff > 8) return { trend: "improving", trendConfidence: confidence };
  if (diff < -8) return { trend: "declining", trendConfidence: confidence };
  return { trend: "stable", trendConfidence: confidence };
}
