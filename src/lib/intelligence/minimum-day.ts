import type { DaySummary } from "@/types";

// A "Minimum Viable Day" = the day was held together.
// Not perfect. But rhythm was maintained.
// Core pillars: protein/meals, hydration, some movement OR night routine.

export interface MVDResult {
  met: boolean;
  pillars: { label: string; met: boolean }[];
}

export function evaluateMVD(summary: DaySummary): MVDResult {
  const mealsOk = summary.mealsDone >= 2;
  const checklistCore = summary.checklistDone >= 3;
  const movementOrRoutine =
    summary.workoutDone ||
    summary.nightRoutineDone >= 2;

  const pillars = [
    { label: "Meals on track", met: mealsOk },
    { label: "Core habits", met: checklistCore },
    { label: "Movement or routine", met: movementOrRoutine },
  ];

  return {
    met: pillars.filter((p) => p.met).length >= 2,
    pillars,
  };
}

export function getMVDLabel(met: boolean): string {
  return met ? "Held together" : "Partial";
}

export function getMVDMessage(met: boolean): string {
  if (met) {
    const msgs = [
      "Good enough still counts.",
      "You kept the day together.",
      "That was enough for today.",
      "The basics were covered. That matters.",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  return "Tomorrow is a fresh start.";
}
