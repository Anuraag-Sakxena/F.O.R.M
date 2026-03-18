import type { DayPhase, MicrocopyIntensity } from "@/types";
import type { RecoveryState } from "@/lib/behavior";

export type RescueLevel = "light" | "reset" | "gentle";

export interface RescuePlan {
  level: RescueLevel;
  title: string;
  message: string;
  actions: string[];
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shouldShowRescue(
  phase: DayPhase,
  flowScore: number,
  recovery: RecoveryState,
  moodLevel: number | null
): RescueLevel | null {
  // Gentle recovery: after missed days or broken streaks
  if (recovery.active) return "gentle";

  // Reset: very low score in afternoon or later
  if ((phase === "afternoon" || phase === "evening") && flowScore < 15) {
    return "reset";
  }

  // Light: slipping day (low mood + low score in afternoon)
  if (phase === "afternoon" && moodLevel === 1 && flowScore < 40) {
    return "light";
  }

  // Evening salvage: below viable in evening
  if (phase === "evening" && flowScore < 30) {
    return "light";
  }

  // Night salvage
  if (phase === "night" && flowScore < 20 && flowScore > 0) {
    return "light";
  }

  return null;
}

export function buildRescuePlan(
  level: RescueLevel,
  intensity: MicrocopyIntensity,
  context: {
    workoutDone: boolean;
    mealsDone: number;
    isWeekend: boolean;
  }
): RescuePlan {
  if (level === "gentle") {
    return {
      level,
      title: "Gentle re-entry",
      message: pick({
        light: ["Just one small win today."],
        normal: [
          "Re-enter with one win: water, food, or a short movement block.",
          "No catching up. Just begin wherever it feels right.",
        ],
        playful: [
          "One checkbox. That's the only goal today.",
          "The bar is on the floor. Just step over it gently.",
        ],
      }[intensity]),
      actions: [
        "Drink water and have a meal",
        "Check one item off the daily goals",
        context.isWeekend
          ? "Keep it light — weekend recovery is valid"
          : "Do the 10-min night routine before bed",
      ],
    };
  }

  if (level === "reset") {
    return {
      level,
      title: "Reset plan",
      message: pick({
        light: ["Simplify today."],
        normal: [
          "Switch to Lazy Mode and keep the structure.",
          "The day can still be saved with basics.",
        ],
        playful: [
          "Lazy Mode exists for days like this. Use it.",
          "Perfection isn't the goal. Showing up is.",
        ],
      }[intensity]),
      actions: [
        "Switch meals to Lazy Mode if cooking feels like too much",
        "Hit your protein target — even with a shake",
        "Do the night routine before bed",
        context.mealsDone < 1 ? "Eat one solid protein-forward meal" : "Keep meals simple",
      ].filter(Boolean),
    };
  }

  // Light rescue
  return {
    level,
    title: "Salvage plan",
    message: pick({
      light: ["A few things can still close the day well."],
      normal: [
        "Hydrate, eat one solid meal, and get your night routine done.",
        "Three things can still make today count.",
      ],
      playful: [
        "The evening rescue is real. Lock in the basics.",
        "Night routine + one meal = day saved.",
      ],
    }[intensity]),
    actions: [
      context.mealsDone < 2 ? "Eat a protein-forward meal" : "Finish your last meal",
      !context.workoutDone ? "Even a 10-min walk counts" : "Workout already done — nice",
      "Do the 10-min night routine",
      "Drink water before bed",
    ],
  };
}
