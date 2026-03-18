import type { DaySummary, DayPhase, MicrocopyIntensity } from "@/types";

// ─── Flow Score ─────────────────────────────────────────────
// Weighted score that prioritizes high-impact habits.
// Not a flat percentage — gym + meals + protein matter more
// than individual skincare steps.

const WEIGHTS = {
  checklist: 35, // daily habits are the backbone
  workout: 20, // single high-value action
  meals: 20, // 3 meals
  skincare: 15, // morning + night
  nightRoutine: 10, // waist + core
};

export function calculateFlowScore(summary: DaySummary): number {
  const checklist =
    summary.checklistTotal > 0
      ? (summary.checklistDone / summary.checklistTotal) * WEIGHTS.checklist
      : 0;
  const workout = summary.workoutDone ? WEIGHTS.workout : 0;
  const meals =
    summary.mealsTotal > 0
      ? (summary.mealsDone / summary.mealsTotal) * WEIGHTS.meals
      : 0;
  const skincareTotal = summary.skincareMorningTotal + summary.skincareNightTotal;
  const skincareDone = summary.skincareMorningDone + summary.skincareNightDone;
  const skincare =
    skincareTotal > 0 ? (skincareDone / skincareTotal) * WEIGHTS.skincare : 0;
  const nr =
    summary.nightRoutineTotal > 0
      ? (summary.nightRoutineDone / summary.nightRoutineTotal) * WEIGHTS.nightRoutine
      : 0;

  return Math.round(checklist + workout + meals + skincare + nr);
}

// ─── Flow State Labels ──────────────────────────────────────

export type FlowState = "starting" | "building" | "flowing" | "locked" | "complete";

export function getFlowState(score: number): FlowState {
  if (score === 100) return "complete";
  if (score >= 70) return "locked";
  if (score >= 40) return "flowing";
  if (score > 0) return "building";
  return "starting";
}

export function getFlowLabel(state: FlowState): string {
  switch (state) {
    case "complete":
      return "In full flow";
    case "locked":
      return "Locked in";
    case "flowing":
      return "Flowing";
    case "building":
      return "Building up";
    case "starting":
      return "Ready to start";
  }
}

export function getFlowEmoji(state: FlowState): string {
  switch (state) {
    case "complete":
      return "✨";
    case "locked":
      return "🔥";
    case "flowing":
      return "💫";
    case "building":
      return "🌱";
    case "starting":
      return "☀️";
  }
}

// ─── Momentum System ────────────────────────────────────────

export type MomentumLevel =
  | "starting"
  | "building"
  | "momentum"
  | "locked-in"
  | "unstoppable";

export function getMomentumLevel(streakDays: number): MomentumLevel {
  if (streakDays >= 15) return "unstoppable";
  if (streakDays >= 7) return "locked-in";
  if (streakDays >= 4) return "momentum";
  if (streakDays >= 2) return "building";
  return "starting";
}

export function getMomentumLabel(level: MomentumLevel): string {
  switch (level) {
    case "unstoppable":
      return "Unstoppable";
    case "locked-in":
      return "Locked In";
    case "momentum":
      return "Momentum";
    case "building":
      return "Building";
    case "starting":
      return "Starting";
  }
}

export function getMomentumColor(level: MomentumLevel): string {
  switch (level) {
    case "unstoppable":
      return "from-accent-amber to-accent-peach";
    case "locked-in":
      return "from-accent-rose to-accent-pink";
    case "momentum":
      return "from-primary to-accent-lavender";
    case "building":
      return "from-accent-sky to-accent-mint";
    case "starting":
      return "from-muted-foreground/30 to-muted-foreground/20";
  }
}

// ─── Recovery Mode ──────────────────────────────────────────

export interface RecoveryState {
  active: boolean;
  reason: "streak-break" | "low-day" | "return" | null;
}

export function detectRecovery(
  summaries: DaySummary[],
  currentStreak: number
): RecoveryState {
  if (summaries.length === 0) {
    return { active: false, reason: null };
  }

  // If streak just broke (was >= 2, now 0)
  if (currentStreak === 0 && summaries.length >= 2) {
    const recent = summaries[0];
    if (recent && recent.completionPercent < 40) {
      return { active: true, reason: "streak-break" };
    }
  }

  // If yesterday was very low
  if (summaries.length >= 1) {
    const yesterday = summaries[0];
    if (yesterday && yesterday.completionPercent < 25) {
      return { active: true, reason: "low-day" };
    }
  }

  // If there's a gap (no data for yesterday implies a missed day)
  if (summaries.length >= 1) {
    const latest = summaries[0];
    const today = new Date();
    const latestDate = new Date(latest.date + "T12:00:00");
    const diffDays = Math.floor(
      (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 2) {
      return { active: true, reason: "return" };
    }
  }

  return { active: false, reason: null };
}

export function getRecoveryGreeting(reason: RecoveryState["reason"]): string {
  switch (reason) {
    case "streak-break":
      return "Let's restart gently today.";
    case "low-day":
      return "One small win is enough.";
    case "return":
      return "Welcome back. Pick up where it feels right.";
    default:
      return "";
  }
}

// ─── Micro Rewards ──────────────────────────────────────────

export type RewardTier = "first" | "halfway" | "strong" | "complete" | "closure";

export function getRewardMessage(
  tier: RewardTier,
  intensity: MicrocopyIntensity = "normal"
): string {
  const messages: Record<RewardTier, Record<MicrocopyIntensity, string[]>> = {
    first: {
      light: ["Started."],
      normal: ["Nice start.", "First one down.", "You showed up."],
      playful: ["And so it begins.", "The hardest part is done.", "There she goes."],
    },
    halfway: {
      light: ["Halfway there."],
      normal: ["Building momentum.", "You're in flow now.", "Halfway and strong."],
      playful: [
        "Look at this momentum.",
        "Cruising now.",
        "The second half is always easier.",
      ],
    },
    strong: {
      light: ["Almost done."],
      normal: ["Strong finish incoming.", "Just a few more.", "You're so close."],
      playful: ["Finish line energy.", "Can't stop now.", "The final push."],
    },
    complete: {
      light: ["Done."],
      normal: [
        "That's a real win.",
        "Today moved you forward.",
        "You gave today your attention.",
      ],
      playful: [
        "Absolutely nailed it.",
        "That's what flow looks like.",
        "Chef's kiss kind of day.",
      ],
    },
    closure: {
      light: ["Rest well."],
      normal: [
        "Progress over perfection.",
        "You did what mattered today.",
        "Tomorrow is another chance.",
      ],
      playful: [
        "Not every day is 100%. That's okay.",
        "Showing up counts more than finishing.",
        "Sleep well — you moved forward.",
      ],
    },
  };

  const options = messages[tier][intensity];
  return options[Math.floor(Math.random() * options.length)];
}

export function getRewardTier(
  prevScore: number,
  currentScore: number,
  _total: number
): RewardTier | null {
  // First task completed
  if (prevScore === 0 && currentScore > 0) return "first";
  // Crossed halfway
  if (prevScore < 50 && currentScore >= 50) return "halfway";
  // Crossed 80%
  if (prevScore < 80 && currentScore >= 80) return "strong";
  // Hit 100
  if (prevScore < 100 && currentScore === 100) return "complete";
  return null;
}

// ─── Smart Nudges ───────────────────────────────────────────

export interface SmartNudge {
  label: string;
  href: string;
  emoji: string;
  reason?: string;
}

export interface RhythmData {
  taskCompletionCounts: Record<string, number>;
  taskSkipCounts: Record<string, number>;
  lastOpenPhase: DayPhase | null;
  totalDaysTracked: number;
}

const RHYTHM_KEY = "pixie-rhythm";

export function loadRhythm(): RhythmData {
  if (typeof window === "undefined") {
    return {
      taskCompletionCounts: {},
      taskSkipCounts: {},
      lastOpenPhase: null,
      totalDaysTracked: 0,
    };
  }
  try {
    const raw = localStorage.getItem(RHYTHM_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    taskCompletionCounts: {},
    taskSkipCounts: {},
    lastOpenPhase: null,
    totalDaysTracked: 0,
  };
}

export function saveRhythm(data: RhythmData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RHYTHM_KEY, JSON.stringify(data));
  } catch {}
}

export function recordTaskCompletion(rhythm: RhythmData, taskId: string): RhythmData {
  return {
    ...rhythm,
    taskCompletionCounts: {
      ...rhythm.taskCompletionCounts,
      [taskId]: (rhythm.taskCompletionCounts[taskId] ?? 0) + 1,
    },
  };
}

export function recordTaskSkip(rhythm: RhythmData, taskId: string): RhythmData {
  return {
    ...rhythm,
    taskSkipCounts: {
      ...rhythm.taskSkipCounts,
      [taskId]: (rhythm.taskSkipCounts[taskId] ?? 0) + 1,
    },
  };
}

export function getMostSkippedTask(rhythm: RhythmData): string | null {
  const entries = Object.entries(rhythm.taskSkipCounts);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// ─── Weekly Reflection ──────────────────────────────────────

export function getWeeklyReflection(
  summaries: DaySummary[],
  threshold = 60
): { showUpDays: number; total: number; message: string } | null {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday

  // Only show on Sunday or if we have exactly 7 days
  if (dayOfWeek !== 0 && summaries.length < 7) return null;

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const thisWeek = summaries.filter((s) => {
    const d = new Date(s.date + "T12:00:00");
    return d >= weekAgo;
  });

  if (thisWeek.length < 3) return null;

  const showUpDays = thisWeek.filter(
    (s) => s.completionPercent >= threshold
  ).length;

  const messages = [
    `You showed up ${showUpDays} out of ${thisWeek.length} days this week.`,
  ];

  if (showUpDays >= 6) {
    messages.push("That's incredible consistency.");
  } else if (showUpDays >= 4) {
    messages.push("That's consistency.");
  } else if (showUpDays >= 2) {
    messages.push("Every day you show up matters.");
  } else {
    messages.push("This week is a fresh start.");
  }

  return {
    showUpDays,
    total: thisWeek.length,
    message: messages.join(" "),
  };
}

// ─── End-of-Day Closure ─────────────────────────────────────

export function getClosureMessage(
  phase: DayPhase,
  score: number,
  intensity: MicrocopyIntensity
): string | null {
  // Only trigger in evening/night when not fully complete
  if (phase !== "evening" && phase !== "night") return null;
  if (score >= 100) return null;
  if (score < 15) return null; // they barely started, don't add pressure

  return getRewardMessage("closure", intensity);
}
