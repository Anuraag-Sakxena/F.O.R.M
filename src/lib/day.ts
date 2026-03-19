import type { DayPhase, DaySummary, MicrocopyIntensity } from "@/types";

const DAY_START_HOUR = 7;

export function getTrackerDate(now: Date = new Date()): string {
  const adjusted = new Date(now);
  if (adjusted.getHours() < DAY_START_HOUR) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  // Use local date parts — NOT toISOString() which converts to UTC
  const y = adjusted.getFullYear();
  const m = String(adjusted.getMonth() + 1).padStart(2, "0");
  const d = String(adjusted.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayPhase(now: Date = new Date()): DayPhase {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export function getGreeting(phase: DayPhase): string {
  switch (phase) {
    case "morning":
      return "Good morning";
    case "afternoon":
      return "Good afternoon";
    case "evening":
      return "Good evening";
    case "night":
      return "Hey there";
  }
}

export function getHeroMessage(
  phase: DayPhase,
  percent: number,
  intensity: MicrocopyIntensity = "normal"
): string {
  if (percent === 100) {
    const msgs = {
      light: "All done for today.",
      normal: "You nailed today. Rest well.",
      playful: "Today was all you. Amazing.",
    };
    return msgs[intensity];
  }

  if (phase === "morning") {
    if (percent === 0) {
      const msgs = {
        light: "A fresh day ahead.",
        normal: "Let's make today feel good.",
        playful: "Your day is a blank page. Let's fill it.",
      };
      return msgs[intensity];
    }
    const msgs = {
      light: "Off to a good start.",
      normal: "You're already in motion.",
      playful: "Look at you go this morning.",
    };
    return msgs[intensity];
  }

  if (phase === "afternoon") {
    if (percent < 50) {
      const msgs = {
        light: "Plenty of time left.",
        normal: "A few small wins and today is yours.",
        playful: "The afternoon is your secret weapon.",
      };
      return msgs[intensity];
    }
    const msgs = {
      light: "Making progress.",
      normal: "Keep this momentum going.",
      playful: "You're crushing the second half.",
    };
    return msgs[intensity];
  }

  if (phase === "evening") {
    if (percent < 50) {
      const msgs = {
        light: "Still time to check a few things off.",
        normal: "Finish strong tonight.",
        playful: "Evening energy — let's close some loops.",
      };
      return msgs[intensity];
    }
    const msgs = {
      light: "Almost there.",
      normal: "Just a few more to wrap up the day.",
      playful: "The finish line is right there.",
    };
    return msgs[intensity];
  }

  // night
  const msgs = {
    light: "Winding down.",
    normal: "Time to rest. You did well.",
    playful: "Put the phone down soon. You earned it.",
  };
  return msgs[intensity];
}

export function getFocusMessage(phase: DayPhase, percent: number): string {
  if (percent === 100) return "Enjoy the rest of your day";
  if (phase === "morning" && percent === 0) return "Start with something small";
  if (phase === "morning") return "Build on your morning momentum";
  if (phase === "afternoon" && percent < 50) return "Pick one thing and knock it out";
  if (phase === "afternoon") return "Keep the energy going";
  if (phase === "evening") return "Finish what matters most";
  return "Rest up for tomorrow";
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function calculateStreak(summaries: DaySummary[], threshold = 80): number {
  const sorted = [...summaries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  for (const day of sorted) {
    if (day.completionPercent >= threshold) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateBestStreak(summaries: DaySummary[], threshold = 80): number {
  const sorted = [...summaries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let best = 0;
  let current = 0;
  for (const day of sorted) {
    if (day.completionPercent >= threshold) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

export function getWeekCompletedCount(summaries: DaySummary[], threshold = 80): number {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return summaries.filter(
    (s) =>
      new Date(s.date) >= weekAgo && s.completionPercent >= threshold
  ).length;
}
