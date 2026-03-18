import type { DayPhase, MicrocopyIntensity } from "@/types";
import type { RecoveryState, MomentumLevel } from "@/lib/behavior";
import type { DayMode } from "@/lib/day-modes";
import type { PlanVariant } from "./planning";

// Content Recommendations decide WHAT to emphasize on each screen.
// Pure functions — later replaceable with AI.

export type ContentEmphasis =
  | "workout"
  | "meals"
  | "night-routine"
  | "checklist"
  | "skincare"
  | "rest";

export interface HomeRecommendation {
  primaryEmphasis: ContentEmphasis;
  showRescueOverFocus: boolean;
  elevateNightRoutine: boolean;
  showFallbackPath: boolean;
  mealModeHint: "cook" | "lazy" | null;
}

export function getHomeRecommendation(context: {
  phase: DayPhase;
  flowScore: number;
  recovery: RecoveryState;
  momentumLevel: MomentumLevel;
  moodLevel: number | null;
  workoutDone: boolean;
  mealsDone: number;
  planVariant: PlanVariant;
  dayMode: DayMode;
  isWeekend: boolean;
}): HomeRecommendation {
  const { phase, flowScore, recovery, moodLevel, workoutDone, mealsDone, planVariant, dayMode } = context;

  // Recovery → rescue over focus, gentle defaults
  if (recovery.active || planVariant === "recovery") {
    return {
      primaryEmphasis: "checklist",
      showRescueOverFocus: true,
      elevateNightRoutine: phase === "evening" || phase === "night",
      showFallbackPath: true,
      mealModeHint: "lazy",
    };
  }

  // Evening/night salvage
  if ((phase === "evening" || phase === "night") && flowScore < 40) {
    return {
      primaryEmphasis: "night-routine",
      showRescueOverFocus: flowScore < 20,
      elevateNightRoutine: true,
      showFallbackPath: true,
      mealModeHint: mealsDone < 2 ? "lazy" : null,
    };
  }

  // Low mood
  if (moodLevel === 1) {
    return {
      primaryEmphasis: mealsDone < 2 ? "meals" : "checklist",
      showRescueOverFocus: false,
      elevateNightRoutine: phase !== "morning",
      showFallbackPath: true,
      mealModeHint: "lazy",
    };
  }

  // Morning — workout focus
  if (phase === "morning" && !workoutDone) {
    return {
      primaryEmphasis: "workout",
      showRescueOverFocus: false,
      elevateNightRoutine: false,
      showFallbackPath: false,
      mealModeHint: null,
    };
  }

  // Afternoon — meals focus if behind
  if (phase === "afternoon" && mealsDone < 2) {
    return {
      primaryEmphasis: "meals",
      showRescueOverFocus: false,
      elevateNightRoutine: false,
      showFallbackPath: false,
      mealModeHint: flowScore < 30 ? "lazy" : "cook",
    };
  }

  // Strong day
  if (dayMode === "strong-start" || planVariant === "strong") {
    return {
      primaryEmphasis: workoutDone ? "meals" : "workout",
      showRescueOverFocus: false,
      elevateNightRoutine: false,
      showFallbackPath: false,
      mealModeHint: "cook",
    };
  }

  // Default balanced
  return {
    primaryEmphasis: "checklist",
    showRescueOverFocus: false,
    elevateNightRoutine: phase === "evening" || phase === "night",
    showFallbackPath: false,
    mealModeHint: null,
  };
}

// ─── Fallback Path ──────────────────────────────────────────

export interface FallbackPath {
  keep: string[];
  drop: string[];
  message: string;
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildFallbackPath(
  intensity: MicrocopyIntensity,
  context: {
    workoutDone: boolean;
    mealsDone: number;
    phase: DayPhase;
    lazyMode: boolean;
  }
): FallbackPath {
  const keep: string[] = [];
  const drop: string[] = [];

  // Always keep: protein/meals (simplified), night routine
  if (context.mealsDone < 2) {
    keep.push(context.lazyMode ? "One pickup meal with protein" : "Switch to Lazy Mode for meals");
  }
  keep.push("Night routine before bed");
  keep.push("Water");

  // What can be dropped
  if (!context.workoutDone && (context.phase === "evening" || context.phase === "night")) {
    drop.push("Full workout — steps or walk count instead");
  }
  if (!context.lazyMode) {
    drop.push("Cooking from scratch — Lazy Mode covers it");
  }
  drop.push("Perfection — consistency wins");

  const message = pick({
    light: ["Here's the simpler version."],
    normal: [
      "Here's the lower-friction version that still works.",
      "Scaled down. Still counts.",
    ],
    playful: [
      "The easy version. Still a win.",
      "Minimum effort, maximum rhythm.",
    ],
  }[intensity]);

  return { keep, drop, message };
}
