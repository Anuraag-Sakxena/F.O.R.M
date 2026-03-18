import type { DayPhase, MicrocopyIntensity } from "@/types";

export type MealSuggestion = {
  text: string;
  suggestLazy: boolean;
  suggestCarb: boolean;
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getMealStrategy(
  phase: DayPhase,
  intensity: MicrocopyIntensity,
  context: {
    moodLevel: number | null;
    mealsDone: number;
    lazyMode: boolean;
    isWeekend: boolean;
    dayName: string;
    flowScore: number;
    recoveryActive: boolean;
  }
): MealSuggestion | null {
  const isSaturdayCarb = context.dayName === "Saturday";

  // Recovery or low mood → suggest lazy
  if (context.recoveryActive || context.moodLevel === 1) {
    if (!context.lazyMode) {
      return {
        text: pick({
          light: ["Consider Lazy Mode today."],
          normal: ["Low energy? Lazy Mode keeps the structure without the cooking."],
          playful: ["Lazy Mode was made for days like this. Switch over."],
        }[intensity]),
        suggestLazy: true,
        suggestCarb: false,
      };
    }
    return null;
  }

  // Carb day awareness
  if (isSaturdayCarb) {
    return {
      text: pick({
        light: ["Carb day — rice is allowed."],
        normal: ["Carb day is part of the plan. Enjoy your rice portion."],
        playful: ["It's carb day. Add the rice. You earned it."],
      }[intensity]),
      suggestLazy: false,
      suggestCarb: true,
    };
  }

  // Good momentum + morning → encourage cooking
  if (phase === "morning" && context.flowScore > 0 && !context.lazyMode) {
    return {
      text: pick({
        light: ["Cook today if you can."],
        normal: ["Morning energy is high — Cook Mode keeps your nutrition tight."],
        playful: ["You've got momentum. Keep cooking today."],
      }[intensity]),
      suggestLazy: false,
      suggestCarb: false,
    };
  }

  // Late day + missed meals → suggest simplification
  if ((phase === "evening" || phase === "night") && context.mealsDone < 2 && !context.lazyMode) {
    return {
      text: pick({
        light: ["Lazy Mode can help finish the day."],
        normal: ["Behind on meals? Switch to Lazy Mode for quick options tonight."],
        playful: ["Lazy Mode to the rescue. Pick up something protein-forward."],
      }[intensity]),
      suggestLazy: true,
      suggestCarb: false,
    };
  }

  // Weekend general
  if (context.isWeekend && !context.lazyMode) {
    return {
      text: pick({
        light: ["Keep structure, loosen pressure."],
        normal: ["Weekend rhythm still counts. Stay on protein."],
        playful: ["Weekends are for balance, not chaos. Stay close to the plan."],
      }[intensity]),
      suggestLazy: false,
      suggestCarb: false,
    };
  }

  return null;
}
