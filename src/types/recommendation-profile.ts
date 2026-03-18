// The learned recommendation profile — the core output of adaptive memory.
// Built from historical analysis. Consumed by planners, copy, and UI.
// Later replaceable with AI-generated profiles.

export type Confidence = "low" | "medium" | "high";

export type AnchorId =
  | "workout"
  | "meals"
  | "checklist"
  | "night-routine"
  | "skincare"
  | "lazy-mode";

export interface AnchorStrength {
  id: AnchorId;
  label: string;
  score: number; // 0-100
  confidence: Confidence;
}

export interface RecommendationProfile {
  strongestAnchor: AnchorStrength | null;
  weakestPoint: AnchorStrength | null;
  consistencyAnchors: AnchorStrength[];

  workoutImpact: number; // 0-100, how much workout correlates with good days
  nightRoutineImpact: number;
  mealConsistency: number;
  lazyModeEffectiveness: number; // does lazy mode help preserve MVD?

  bestDayStartHabit: AnchorId | null;
  bestDaySaveHabit: AnchorId | null;

  recentTrend: "improving" | "stable" | "declining" | "insufficient";
  recentTrendConfidence: Confidence;

  dataPoints: number; // how many days of history were analyzed
  overallConfidence: Confidence;
}

export const EMPTY_PROFILE: RecommendationProfile = {
  strongestAnchor: null,
  weakestPoint: null,
  consistencyAnchors: [],
  workoutImpact: 50,
  nightRoutineImpact: 50,
  mealConsistency: 50,
  lazyModeEffectiveness: 50,
  bestDayStartHabit: null,
  bestDaySaveHabit: null,
  recentTrend: "insufficient",
  recentTrendConfidence: "low",
  dataPoints: 0,
  overallConfidence: "low",
};
