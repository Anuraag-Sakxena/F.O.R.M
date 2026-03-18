import type { DaySummary } from "@/types";
import { calculateFlowScore } from "@/lib/behavior";
import { evaluateMVD } from "./minimum-day";

export type DayQuality =
  | "in-flow"
  | "strong"
  | "held-together"
  | "partial"
  | "reset"
  | "missed";

export interface DayQualityInfo {
  quality: DayQuality;
  label: string;
  color: string;
  bgColor: string;
}

export function assessDayQuality(summary: DaySummary): DayQualityInfo {
  const score = calculateFlowScore(summary);
  const mvd = evaluateMVD(summary);

  if (score >= 90) {
    return { quality: "in-flow", label: "In Flow", color: "text-success", bgColor: "bg-success-soft" };
  }
  if (score >= 65) {
    return { quality: "strong", label: "Strong", color: "text-primary", bgColor: "bg-primary-soft" };
  }
  if (mvd.met) {
    return { quality: "held-together", label: "Held Together", color: "text-accent-sky", bgColor: "bg-accent-sky-soft" };
  }
  if (score > 15) {
    return { quality: "partial", label: "Partial", color: "text-accent-amber", bgColor: "bg-accent-amber-soft" };
  }
  if (score > 0) {
    return { quality: "reset", label: "Reset Day", color: "text-muted-foreground", bgColor: "bg-muted" };
  }
  return { quality: "missed", label: "Rest Day", color: "text-muted-foreground/60", bgColor: "bg-muted/50" };
}
