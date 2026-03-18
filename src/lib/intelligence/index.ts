export { evaluateMVD, getMVDLabel, getMVDMessage } from "./minimum-day";
export type { MVDResult } from "./minimum-day";

export { assessDayQuality } from "./day-quality";
export type { DayQuality, DayQualityInfo } from "./day-quality";

export { shouldShowRescue, buildRescuePlan } from "./rescue";
export type { RescueLevel, RescuePlan } from "./rescue";

export { getMealStrategy } from "./meal-strategy";
export type { MealSuggestion } from "./meal-strategy";

export { inferPlanVariant, buildDayPlan } from "./planning";
export type { PlanVariant, DayPlan } from "./planning";

export { getSupportConfig, trimPlanSteps, trimRescueActions } from "./support-style";
export type { SupportStyleConfig } from "./support-style";

export { getHomeRecommendation, buildFallbackPath } from "./content-recommendations";
export type { HomeRecommendation, FallbackPath, ContentEmphasis } from "./content-recommendations";

export { getWorkoutFraming, getNightRoutineFraming, getMealModeFraming } from "./adaptive-framing";

export { deriveInsights } from "./pattern-insights";
export type { PatternInsight } from "./pattern-insights";

export { applyRecencyWeights, weightedRate, weightedAverage } from "./recency";
export { getConfidence, getConfidencePrefix, getConfidenceVerb } from "./confidence";
export { buildRecommendationProfile } from "./adaptive-memory";
export { generateMemoryInsights, getMemoryAwareFocus } from "./memory-insights";
export type { MemoryInsight } from "./memory-insights";
