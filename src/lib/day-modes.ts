import type { DayPhase } from "@/types";
import type { RecoveryState, MomentumLevel } from "./behavior";

export type DayMode =
  | "strong-start"
  | "catch-up"
  | "recovery"
  | "wind-down"
  | "balanced"
  | "fresh";

export interface DayModeInfo {
  mode: DayMode;
  label: string;
  emoji: string;
  toneShift: "energetic" | "gentle" | "neutral" | "calm";
}

export function inferDayMode(
  phase: DayPhase,
  flowScore: number,
  recovery: RecoveryState,
  momentumLevel: MomentumLevel,
  moodLevel: number | null
): DayModeInfo {
  // Recovery always overrides
  if (recovery.active) {
    return {
      mode: "recovery",
      label: "Recovery Day",
      emoji: "🌿",
      toneShift: "gentle",
    };
  }

  // Low mood overrides to gentle
  if (moodLevel !== null && moodLevel <= 1) {
    return {
      mode: "recovery",
      label: "Gentle Day",
      emoji: "🫶",
      toneShift: "gentle",
    };
  }

  // Wind-down in evening/night
  if ((phase === "evening" || phase === "night") && flowScore >= 60) {
    return {
      mode: "wind-down",
      label: "Wind-Down",
      emoji: "🌅",
      toneShift: "calm",
    };
  }

  // Strong start: morning with good momentum and score building
  if (phase === "morning" && flowScore > 0 && flowScore < 60 && momentumLevel !== "starting") {
    return {
      mode: "strong-start",
      label: "Strong Start",
      emoji: "⚡",
      toneShift: "energetic",
    };
  }

  // Catch-up: afternoon with low score
  if (phase === "afternoon" && flowScore < 30) {
    return {
      mode: "catch-up",
      label: "Catch-Up",
      emoji: "🏃‍♀️",
      toneShift: "energetic",
    };
  }

  // Fresh: morning with no progress yet
  if (phase === "morning" && flowScore === 0) {
    return {
      mode: "fresh",
      label: "Fresh Day",
      emoji: "✨",
      toneShift: "neutral",
    };
  }

  // Default balanced
  return {
    mode: "balanced",
    label: "Balanced",
    emoji: "💫",
    toneShift: "neutral",
  };
}

export function getDayModeAccent(mode: DayMode): string {
  switch (mode) {
    case "strong-start":
      return "from-accent-peach-soft/40 to-accent-amber-soft/30";
    case "catch-up":
      return "from-accent-sky-soft/40 to-accent-mint-soft/30";
    case "recovery":
      return "from-accent-lavender-soft/30 to-muted/20";
    case "wind-down":
      return "from-accent-rose-soft/30 to-accent-lavender-soft/20";
    case "fresh":
      return "from-accent-mint-soft/30 to-accent-sky-soft/20";
    case "balanced":
      return "from-primary-soft/20 to-accent-lavender-soft/15";
  }
}
