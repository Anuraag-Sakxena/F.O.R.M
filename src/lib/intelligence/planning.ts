import type { DayPhase, MicrocopyIntensity } from "@/types";
import type { RecoveryState, MomentumLevel } from "@/lib/behavior";
import type { DayMode } from "@/lib/day-modes";

export type PlanVariant =
  | "full"
  | "simplified"
  | "lazy"
  | "recovery"
  | "evening-salvage"
  | "strong";

export interface DayPlan {
  variant: PlanVariant;
  title: string;
  guidance: string;
  steps: string[];
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function inferPlanVariant(
  phase: DayPhase,
  flowScore: number,
  recovery: RecoveryState,
  momentumLevel: MomentumLevel,
  moodLevel: number | null,
  isWeekend: boolean,
  dayMode: DayMode
): PlanVariant {
  if (recovery.active) return "recovery";
  if (moodLevel === 1) return "simplified";
  if ((phase === "evening" || phase === "night") && flowScore < 30) return "evening-salvage";
  if (momentumLevel === "locked-in" || momentumLevel === "unstoppable") return "strong";
  if (isWeekend && moodLevel !== 3) return "simplified";
  if (dayMode === "catch-up") return "simplified";
  return "full";
}

export function buildDayPlan(
  variant: PlanVariant,
  intensity: MicrocopyIntensity,
  context: {
    phase: DayPhase;
    workoutDone: boolean;
    mealsDone: number;
    lazyMode: boolean;
    isWeekend: boolean;
  }
): DayPlan {
  switch (variant) {
    case "recovery":
      return {
        variant,
        title: "Recovery Plan",
        guidance: pick({
          light: ["Take it easy."],
          normal: ["Just re-enter gently. One thing at a time."],
          playful: ["Easy day. No pressure. Just show up."],
        }[intensity]),
        steps: [
          "Start with water and a meal",
          "Check off one daily goal",
          "Night routine before bed",
        ],
      };

    case "simplified":
      return {
        variant,
        title: "Simplified Day",
        guidance: pick({
          light: ["Keep it simple today."],
          normal: ["Today can be lighter. Stay on protein and movement."],
          playful: ["Minimum effort, maximum structure. Keep the rhythm."],
        }[intensity]),
        steps: [
          context.lazyMode
            ? "Lazy Mode meals — keep protein high"
            : "Cook or switch to Lazy Mode if needed",
          !context.workoutDone ? "Move — even a walk counts" : "Workout done",
          "Hit water and protein targets",
          "Night routine before bed",
        ],
      };

    case "evening-salvage":
      return {
        variant,
        title: "Evening Plan",
        guidance: pick({
          light: ["Salvage the evening."],
          normal: ["A few things can still close this day well."],
          playful: ["The evening rescue. Let's lock in the basics."],
        }[intensity]),
        steps: [
          context.mealsDone < 2
            ? "Eat one protein-forward meal"
            : "Finish dinner",
          "Do the 10-minute night routine",
          "Night skincare before bed",
          "Let tomorrow be fresh",
        ],
      };

    case "strong":
      return {
        variant,
        title: "Strong Day",
        guidance: pick({
          light: ["Keep the streak alive."],
          normal: ["You're in a rhythm. Full send today."],
          playful: ["Momentum is real. Don't waste it."],
        }[intensity]),
        steps: [
          !context.workoutDone ? "Workout first" : "Workout done — keep going",
          "Cook Mode — hit all 3 meals",
          "Complete the full checklist",
          "Skincare + night routine",
        ],
      };

    default: // full
      return {
        variant,
        title: "Today's Plan",
        guidance: (() => {
          if (context.phase === "morning") {
            return pick({
              light: ["Start with breakfast and movement."],
              normal: ["Start with breakfast, then aim for movement before noon."],
              playful: ["Breakfast, workout, then ride the momentum all day."],
            }[intensity]);
          }
          if (context.phase === "afternoon") {
            return pick({
              light: ["Stay on track this afternoon."],
              normal: ["Keep meals on schedule and stay hydrated."],
              playful: ["Afternoon is the consistency zone. Hold the line."],
            }[intensity]);
          }
          return pick({
            light: ["Wind down with intention."],
            normal: ["Close the day with your evening routine."],
            playful: ["Evening mode. Routine and rest."],
          }[intensity]);
        })(),
        steps: [
          !context.workoutDone ? "Complete your workout" : "Workout done",
          `${3 - context.mealsDone} meal${3 - context.mealsDone === 1 ? "" : "s"} remaining`,
          "Stay on protein and water",
          "Night routine + skincare",
        ].filter((s) => !s.startsWith("0 ")),
      };
  }
}
