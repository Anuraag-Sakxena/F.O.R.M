import type { DaySummary } from "@/types";
import { calculateFlowScore } from "@/lib/behavior";
import { evaluateMVD } from "./minimum-day";

// Pattern insights derived from local history.
// Gentle, reflective — not analytics.
// Later replaceable with AI-generated insights.

export interface PatternInsight {
  text: string;
  emoji: string;
}

export function deriveInsights(
  summaries: DaySummary[],
  max = 2
): PatternInsight[] {
  if (summaries.length < 5) return [];

  const insights: PatternInsight[] = [];

  // Night routine correlation with good days
  const withNR = summaries.filter(
    (s) => s.nightRoutineTotal > 0 && s.nightRoutineDone >= s.nightRoutineTotal * 0.75
  );
  const withNRScores = withNR.map((s) => calculateFlowScore(s));
  const avgWithNR = withNRScores.length > 0
    ? withNRScores.reduce((a, b) => a + b, 0) / withNRScores.length
    : 0;

  const withoutNR = summaries.filter(
    (s) => s.nightRoutineTotal > 0 && s.nightRoutineDone < s.nightRoutineTotal * 0.5
  );
  const withoutNRScores = withoutNR.map((s) => calculateFlowScore(s));
  const avgWithoutNR = withoutNRScores.length > 0
    ? withoutNRScores.reduce((a, b) => a + b, 0) / withoutNRScores.length
    : 0;

  if (withNR.length >= 3 && avgWithNR > avgWithoutNR + 10) {
    insights.push({
      text: "Days with your night routine tend to score higher.",
      emoji: "🌙",
    });
  }

  // Workout consistency
  const workoutDays = summaries.filter((s) => s.workoutDone).length;
  const workoutRate = workoutDays / summaries.length;
  if (workoutRate >= 0.6) {
    insights.push({
      text: "Movement is your strongest consistency anchor.",
      emoji: "💪",
    });
  } else if (workoutRate < 0.3 && summaries.length >= 7) {
    insights.push({
      text: "Workouts tend to slip. Even short movement blocks help.",
      emoji: "🏃‍♀️",
    });
  }

  // Meal consistency
  const mealsFullDays = summaries.filter((s) => s.mealsDone >= 3).length;
  const mealRate = mealsFullDays / summaries.length;
  if (mealRate < 0.4 && summaries.length >= 5) {
    insights.push({
      text: "Meals slip more often than other habits. Lazy Mode can help.",
      emoji: "🍽️",
    });
  }

  // MVD rate — good enough days
  const heldDays = summaries.filter((s) => {
    const mvd = evaluateMVD(s);
    return mvd.met;
  }).length;
  const heldRate = heldDays / summaries.length;
  if (heldRate >= 0.7 && summaries.length >= 7) {
    insights.push({
      text: "You hold most days together. That's real consistency.",
      emoji: "🫶",
    });
  }

  return insights.slice(0, max);
}
