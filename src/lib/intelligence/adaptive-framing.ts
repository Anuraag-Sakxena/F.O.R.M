import type { DayPhase, MicrocopyIntensity } from "@/types";
import type { RecoveryState } from "@/lib/behavior";
import type { DayMode } from "@/lib/day-modes";

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Workout Framing ────────────────────────────────────────

export function getWorkoutFraming(
  intensity: MicrocopyIntensity,
  context: {
    phase: DayPhase;
    workoutDone: boolean;
    recoveryActive: boolean;
    moodLevel: number | null;
    dayMode: DayMode;
    flowScore: number;
  }
): string | null {
  if (context.workoutDone) return null;

  if (context.recoveryActive || context.moodLevel === 1) {
    return pick({
      light: ["Movement can be light today."],
      normal: [
        "Movement can be light today. Consistency matters more than intensity.",
        "Even a short walk preserves the habit.",
      ],
      playful: [
        "Don't need a full session. Just move something.",
        "Low-energy workout is still a workout.",
      ],
    }[intensity]);
  }

  if (context.phase === "evening" && context.flowScore < 30) {
    return pick({
      light: ["Night routine can replace the workout today."],
      normal: [
        "If the full workout feels like too much, keep the night routine.",
        "The 10-minute routine still counts as movement today.",
      ],
      playful: [
        "Skip the gym, keep the night routine. Day still counts.",
      ],
    }[intensity]);
  }

  if (context.dayMode === "strong-start") {
    return pick({
      light: ["Best done early."],
      normal: [
        "Best done earlier today. Morning energy is high.",
        "Get it done early and ride the momentum.",
      ],
      playful: [
        "Morning workout → the rest of the day is gravy.",
      ],
    }[intensity]);
  }

  if (context.phase === "morning") {
    return pick({
      light: ["Good time to move."],
      normal: ["Morning is your window. Get the workout in."],
      playful: ["Move now, think later."],
    }[intensity]);
  }

  if (context.phase === "afternoon") {
    return pick({
      light: ["Still time for your workout."],
      normal: ["Afternoon workout works. Don't let it slide to evening."],
      playful: ["The afternoon warrior. Let's go."],
    }[intensity]);
  }

  return null;
}

// ─── Night Routine Framing ──────────────────────────────────

export function getNightRoutineFraming(
  intensity: MicrocopyIntensity,
  context: {
    phase: DayPhase;
    flowScore: number;
    workoutDone: boolean;
    nightRoutineDone: number;
    nightRoutineTotal: number;
  }
): string | null {
  // Already done
  if (context.nightRoutineDone >= context.nightRoutineTotal) return null;

  // Not evening/night — don't emphasize yet
  if (context.phase !== "evening" && context.phase !== "night") return null;

  // Day was messy — night routine as graceful close
  if (context.flowScore < 30) {
    return pick({
      light: ["Night routine gives the day shape."],
      normal: [
        "If today felt messy, the 10-minute routine still gives it shape.",
        "Close the day well. The night routine is your anchor.",
      ],
      playful: [
        "The night routine redeems any day. Do it.",
        "10 minutes. That's all it takes to close well.",
      ],
    }[intensity]);
  }

  // Workout missed — night routine as substitute movement
  if (!context.workoutDone) {
    return pick({
      light: ["Night routine counts as movement."],
      normal: [
        "No workout today? The night routine still counts as movement.",
        "The night routine keeps the rhythm even without the gym.",
      ],
      playful: [
        "Gym was a no. Night routine is a yes. Balance.",
      ],
    }[intensity]);
  }

  // General evening encouragement
  return pick({
    light: ["Time for your night routine."],
    normal: [
      "Close the day with your night routine.",
      "Night routine time. You're almost done.",
    ],
    playful: [
      "The finisher. 10 minutes to lock in the day.",
    ],
  }[intensity]);
}

// ─── Meal Mode Framing ──────────────────────────────────────

export function getMealModeFraming(
  intensity: MicrocopyIntensity,
  hint: "cook" | "lazy" | null
): string | null {
  if (!hint) return null;

  if (hint === "cook") {
    return pick({
      light: ["Cook Mode fits today."],
      normal: ["Cook Mode is a good fit today. You've got the energy."],
      playful: ["Energy is up. Cook Mode it is."],
    }[intensity]);
  }

  return pick({
    light: ["Lazy Mode works today."],
    normal: ["Lazy Mode will keep the structure intact today."],
    playful: ["Lazy Mode exists for this. Use it guilt-free."],
  }[intensity]);
}
