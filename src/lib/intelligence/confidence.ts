import type { Confidence } from "@/types/recommendation-profile";

// Confidence is based on data availability and pattern consistency.

export function getConfidence(dataPoints: number, consistency: number): Confidence {
  // consistency is 0-100, representing how stable the pattern is
  if (dataPoints < 5) return "low";
  if (dataPoints < 10 || consistency < 40) return "low";
  if (dataPoints < 20 && consistency < 60) return "medium";
  if (consistency >= 65) return "high";
  return "medium";
}

export function getConfidencePrefix(c: Confidence): string {
  switch (c) {
    case "high":
      return "usually";
    case "medium":
      return "often";
    case "low":
      return "might";
  }
}

export function getConfidenceVerb(c: Confidence): string {
  switch (c) {
    case "high":
      return "works well for you";
    case "medium":
      return "tends to help";
    case "low":
      return "can be a good option";
  }
}
