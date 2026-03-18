import type { DayPhase, MicrocopyIntensity } from "@/types";

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Focus Card Copy ────────────────────────────────────────

export function getFocusCopy(
  phase: DayPhase,
  intensity: MicrocopyIntensity,
  context: {
    recoveryActive: boolean;
    workoutDone: boolean;
    mealsLow: boolean;
    proteinSkipped: boolean;
    moodLow: boolean;
  }
): string {
  if (context.recoveryActive) {
    return pick([
      "One small win today. That's enough.",
      "A calm reset day is still progress.",
      "Just do what feels right today.",
    ]);
  }

  if (context.moodLow) {
    return pick([
      "Go gentle today. Show up in whatever way you can.",
      "Low energy days still count. Pick one thing.",
      "Take it slow. You don't need to be perfect.",
    ]);
  }

  if (phase === "morning") {
    if (!context.workoutDone) {
      return pick({
        light: ["Move early today."],
        normal: [
          "Move early and the rest gets easier.",
          "Start with movement. Everything flows from there.",
        ],
        playful: [
          "Get the workout in before your brain talks you out of it.",
          "Morning movement sets the whole tone.",
        ],
      }[intensity]);
    }
    if (context.mealsLow) {
      return pick({
        light: ["Protein first today."],
        normal: ["Protein first today. Build from there.", "Focus on meals today."],
        playful: ["Feed the machine. Protein is your friend today."],
      }[intensity]);
    }
    return pick({
      light: ["Stay consistent today."],
      normal: ["Build on yesterday. Small wins add up.", "Keep your rhythm today."],
      playful: ["Today's a good day to lock in.", "Make today count."],
    }[intensity]);
  }

  if (phase === "afternoon") {
    if (context.mealsLow) {
      return pick({
        light: ["Don't skip your meals."],
        normal: ["Stay on track with meals today.", "Your body needs fuel to finish strong."],
        playful: ["Lunch isn't optional. Go eat."],
      }[intensity]);
    }
    return pick({
      light: ["Keep going."],
      normal: ["The afternoon is where discipline lives.", "Finish what you started this morning."],
      playful: ["Second half energy. Let's go."],
    }[intensity]);
  }

  if (phase === "evening") {
    return pick({
      light: ["Keep tonight light and consistent."],
      normal: [
        "Keep tonight light and consistent.",
        "Wind down with intention tonight.",
        "Close today with your night routine.",
      ],
      playful: [
        "The night routine is the secret weapon. Don't skip it.",
        "Evening is your time. Lock in the routine.",
      ],
    }[intensity]);
  }

  // night
  return pick({
    light: ["Rest well."],
    normal: ["Tomorrow is a new flow. Rest well tonight.", "Let today go. You did enough."],
    playful: ["Put the phone down. You earned your rest."],
  }[intensity]);
}

// ─── Hero Messages (expanded) ───────────────────────────────

export function getExpandedHero(
  phase: DayPhase,
  score: number,
  intensity: MicrocopyIntensity,
  moodLow: boolean
): string {
  if (moodLow) {
    return pick([
      "Gentle day. That's okay.",
      "Low-key is still progress.",
      "Take what you need today.",
    ]);
  }

  if (score === 100) {
    return pick({
      light: ["All done for today."],
      normal: [
        "You nailed today. Rest well.",
        "Today was all you. Beautiful.",
        "Complete flow. Nothing left undone.",
      ],
      playful: [
        "Absolutely crushed it.",
        "That's what a perfect flow looks like.",
        "Take a bow. Seriously.",
      ],
    }[intensity]);
  }

  if (phase === "morning") {
    if (score === 0) {
      return pick({
        light: ["A fresh day ahead."],
        normal: [
          "Let's make today feel good.",
          "New day, clean slate.",
          "Today is yours to shape.",
        ],
        playful: [
          "Your day is a blank page. Fill it well.",
          "Rise and flow.",
        ],
      }[intensity]);
    }
    return pick({
      light: ["Good start."],
      normal: [
        "You're already in motion.",
        "Morning momentum building.",
        "Off to a strong start.",
      ],
      playful: [
        "Look at you go this morning.",
        "The morning is yours already.",
      ],
    }[intensity]);
  }

  if (phase === "afternoon") {
    if (score < 40) {
      return pick({
        light: ["Plenty of time left."],
        normal: [
          "A few small wins and today is yours.",
          "The afternoon can still save the day.",
        ],
        playful: ["The afternoon is your secret weapon."],
      }[intensity]);
    }
    return pick({
      light: ["Making progress."],
      normal: [
        "Keep this momentum going.",
        "Strong second half.",
        "You're cruising now.",
      ],
      playful: ["Halfway home and looking good.", "Don't stop now."],
    }[intensity]);
  }

  if (phase === "evening") {
    if (score < 40) {
      return pick({
        light: ["Still time."],
        normal: [
          "Finish strong tonight.",
          "A few things left. You've got this.",
        ],
        playful: ["Evening energy — close some loops."],
      }[intensity]);
    }
    return pick({
      light: ["Almost there."],
      normal: [
        "Just a few more to wrap up.",
        "The finish line is close.",
        "Wrap up with intention.",
      ],
      playful: ["So close. Don't leave anything on the table."],
    }[intensity]);
  }

  // night
  return pick({
    light: ["Winding down."],
    normal: [
      "Time to rest. You did well.",
      "Let today settle. Tomorrow is fresh.",
    ],
    playful: ["Sleep well. You earned it."],
  }[intensity]);
}

// ─── Recovery Messages (expanded) ───────────────────────────

export function getRecoveryCopy(
  reason: "streak-break" | "low-day" | "return" | null,
  intensity: MicrocopyIntensity
): string {
  if (reason === "streak-break") {
    return pick({
      light: ["Fresh start today."],
      normal: [
        "Let's restart gently today.",
        "Streaks reset. You don't.",
        "One day at a time. Start here.",
      ],
      playful: [
        "Streaks are numbers. You're a person. Start fresh.",
        "The streak broke. Your consistency didn't. Begin again.",
      ],
    }[intensity]);
  }
  if (reason === "low-day") {
    return pick({
      light: ["One small win is enough."],
      normal: [
        "One small win is enough today.",
        "Yesterday was light. Today can be different.",
        "Show up for just one thing.",
      ],
      playful: [
        "Even one checkbox counts. Let's go.",
        "The bar is on the floor today. Just step over it.",
      ],
    }[intensity]);
  }
  if (reason === "return") {
    return pick({
      light: ["Welcome back."],
      normal: [
        "Welcome back. Pick up where it feels right.",
        "No catching up needed. Just start.",
        "You're here now. That's what matters.",
      ],
      playful: [
        "She's back. Let's ease in.",
        "Missed you. No pressure today.",
      ],
    }[intensity]);
  }
  return "A new day.";
}

// ─── Reward Messages (expanded) ─────────────────────────────

export function getRewardCopy(
  tier: "first" | "halfway" | "strong" | "complete" | "closure",
  intensity: MicrocopyIntensity
): string {
  const msgs: Record<typeof tier, Record<MicrocopyIntensity, string[]>> = {
    first: {
      light: ["Started."],
      normal: ["Nice start.", "First one done.", "You showed up.", "That's a beginning."],
      playful: ["And so it begins.", "Hardest part? Done.", "There she goes.", "First blood."],
    },
    halfway: {
      light: ["Halfway."],
      normal: ["Building momentum.", "You're in flow.", "Halfway and strong.", "Keep building."],
      playful: ["Cruising now.", "Look at this momentum.", "The second half is easy."],
    },
    strong: {
      light: ["Almost done."],
      normal: ["Strong finish incoming.", "Just a few more.", "You're so close.", "Finish strong."],
      playful: ["Finish line energy.", "Can't stop now.", "Almost there.", "The final push."],
    },
    complete: {
      light: ["Done."],
      normal: [
        "That's a real win.",
        "Today moved you forward.",
        "Complete flow.",
        "Everything done. Nothing left.",
      ],
      playful: [
        "Absolutely nailed it.",
        "That's what flow looks like.",
        "Chef's kiss kind of day.",
        "Perfection.",
      ],
    },
    closure: {
      light: ["Rest well."],
      normal: [
        "Progress over perfection.",
        "You did what mattered.",
        "Tomorrow is another chance.",
        "Good enough is good.",
      ],
      playful: [
        "Not 100%. Still a win.",
        "Showing up is the hardest part.",
        "Sleep well — you moved forward.",
      ],
    },
  };

  return pick(msgs[tier][intensity]);
}

// ─── Weekly Reflection (expanded) ────────────────────────────

export function getReflectionCopy(showUpDays: number, total: number): string {
  const ratio = showUpDays / total;
  const base = `You showed up ${showUpDays} out of ${total} days this week.`;

  if (ratio >= 0.85) {
    return `${base} ${pick(["That's incredible consistency.", "Nearly perfect week.", "Outstanding rhythm."])}`;
  }
  if (ratio >= 0.6) {
    return `${base} ${pick(["That's consistency.", "Solid week.", "Real progress."])}`;
  }
  if (ratio >= 0.3) {
    return `${base} ${pick(["Every day you show up matters.", "Building a habit.", "More than zero."])}`;
  }
  return `${base} ${pick(["This week is a fresh start.", "New week, new rhythm.", "One day at a time."])}`;
}
