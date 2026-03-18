import type { PlannerStyle } from "@/types";
import type { DayPlan } from "./planning";
import type { RescuePlan } from "./rescue";

// The Support Style Engine controls HOW MUCH guidance is shown,
// not WHAT guidance is shown. It shapes density and warmth.

export interface SupportStyleConfig {
  maxPlanSteps: number;
  showFocusCard: boolean;
  showMVDBadge: boolean;
  rescueWarmth: "brief" | "warm" | "full";
  homeCardDensity: "sparse" | "balanced" | "rich";
  copyLength: "short" | "medium" | "full";
}

export function getSupportConfig(style: PlannerStyle): SupportStyleConfig {
  switch (style) {
    case "minimal":
      return {
        maxPlanSteps: 2,
        showFocusCard: false,
        showMVDBadge: false,
        rescueWarmth: "brief",
        homeCardDensity: "sparse",
        copyLength: "short",
      };
    case "supportive":
      return {
        maxPlanSteps: 5,
        showFocusCard: true,
        showMVDBadge: true,
        rescueWarmth: "full",
        homeCardDensity: "rich",
        copyLength: "full",
      };
    default: // balanced
      return {
        maxPlanSteps: 4,
        showFocusCard: true,
        showMVDBadge: true,
        rescueWarmth: "warm",
        homeCardDensity: "balanced",
        copyLength: "medium",
      };
  }
}

export function trimPlanSteps(plan: DayPlan, config: SupportStyleConfig): DayPlan {
  return {
    ...plan,
    steps: plan.steps.slice(0, config.maxPlanSteps),
  };
}

export function trimRescueActions(plan: RescuePlan, config: SupportStyleConfig): RescuePlan {
  const max = config.rescueWarmth === "brief" ? 2 : config.rescueWarmth === "warm" ? 3 : plan.actions.length;
  return {
    ...plan,
    actions: plan.actions.slice(0, max),
  };
}
