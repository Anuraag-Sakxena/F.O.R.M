// Memory Insights — user-facing intelligence derived from the profile.
// Calm, reflective copy. Not analytics.

import type { MicrocopyIntensity } from "@/types";
import type { RecommendationProfile, Confidence } from "@/types/recommendation-profile";
import { getConfidencePrefix, getConfidenceVerb } from "./confidence";

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface MemoryInsight {
  text: string;
  emoji: string;
  type: "anchor" | "pattern" | "recovery" | "trend";
}

export function generateMemoryInsights(
  profile: RecommendationProfile,
  intensity: MicrocopyIntensity,
  max = 2
): MemoryInsight[] {
  if (profile.dataPoints < 5) return [];

  const insights: MemoryInsight[] = [];
  const pref = getConfidencePrefix(profile.overallConfidence);

  // Strongest anchor
  if (profile.strongestAnchor && profile.strongestAnchor.score >= 55) {
    const a = profile.strongestAnchor;
    insights.push({
      text: pick({
        light: [`${a.label} is your strongest anchor.`],
        normal: [
          `${a.label} ${getConfidenceVerb(a.confidence)} as your consistency anchor.`,
          `When ${a.label.toLowerCase()} stays on track, the rest ${pref} follows.`,
        ],
        playful: [
          `${a.label} is your anchor. It holds everything together.`,
          `${a.label} is the thread. Pull it and the day unravels.`,
        ],
      }[intensity]),
      emoji: a.id === "workout" ? "💪" : a.id === "meals" ? "🍽️" : a.id === "night-routine" ? "🌙" : "✅",
      type: "anchor",
    });
  }

  // Workout impact
  if (profile.workoutImpact >= 65) {
    insights.push({
      text: pick({
        light: ["Movement lifts your score."],
        normal: [`Movement ${pref} makes your whole day stronger.`],
        playful: ["Workout days are your best days. The data doesn't lie."],
      }[intensity]),
      emoji: "🏃‍♀️",
      type: "pattern",
    });
  }

  // Night routine as stabilizer
  if (profile.nightRoutineImpact >= 60) {
    insights.push({
      text: pick({
        light: ["Night routine stabilizes your days."],
        normal: [`The night routine ${pref} rescues lower-energy days.`],
        playful: ["Night routine is your secret weapon. Keeps the rhythm alive."],
      }[intensity]),
      emoji: "🌙",
      type: "recovery",
    });
  }

  // Weak point
  if (profile.weakestPoint && profile.weakestPoint.score < 40 && profile.dataPoints >= 7) {
    const w = profile.weakestPoint;
    insights.push({
      text: pick({
        light: [`${w.label} tends to slip.`],
        normal: [`${w.label} is your most fragile point. Small improvements here matter most.`],
        playful: [`${w.label} is where the plan leaks. Worth watching.`],
      }[intensity]),
      emoji: "📌",
      type: "pattern",
    });
  }

  // Recent trend
  if (profile.recentTrend === "improving" && profile.recentTrendConfidence !== "low") {
    insights.push({
      text: pick({
        light: ["Trending upward recently."],
        normal: ["Your recent days are stronger than the week before. The rhythm is building."],
        playful: ["Upward trend. Don't stop now."],
      }[intensity]),
      emoji: "📈",
      type: "trend",
    });
  }

  if (profile.recentTrend === "declining" && profile.recentTrendConfidence !== "low") {
    insights.push({
      text: pick({
        light: ["Recent days have been lighter."],
        normal: ["This week has been lighter than last. That's okay — consistency rebounds."],
        playful: ["Slight dip recently. Nothing a few solid days won't fix."],
      }[intensity]),
      emoji: "🫶",
      type: "trend",
    });
  }

  // Best day-save pattern
  if (profile.bestDaySaveHabit) {
    const saveLabels: Record<string, string> = {
      "night-routine": "night routine",
      meals: "meals",
      checklist: "daily goals",
      workout: "movement",
    };
    const label = saveLabels[profile.bestDaySaveHabit] ?? profile.bestDaySaveHabit;
    insights.push({
      text: pick({
        light: [`${label} ${pref} helps save rough days.`],
        normal: [`On tough days, ${label} is what ${pref} holds the day together.`],
        playful: [`${label} is your rescue move. It works.`],
      }[intensity]),
      emoji: "🛟",
      type: "recovery",
    });
  }

  return insights.slice(0, max);
}

// ─── Memory-Aware Focus Copy ─────────────────────────────────
// Enriches Today's Focus with learned profile insights.

export function getMemoryAwareFocus(
  profile: RecommendationProfile,
  intensity: MicrocopyIntensity
): string | null {
  if (profile.dataPoints < 7 || profile.overallConfidence === "low") return null;

  const pref = getConfidencePrefix(profile.overallConfidence);

  if (profile.strongestAnchor && profile.strongestAnchor.score >= 60) {
    const label = profile.strongestAnchor.label.toLowerCase();
    return pick({
      light: [`Anchor today with ${label}.`],
      normal: [`${label} ${pref} sets the tone. Start there.`],
      playful: [`You know what works — ${label}. Lead with that.`],
    }[intensity]);
  }

  return null;
}
