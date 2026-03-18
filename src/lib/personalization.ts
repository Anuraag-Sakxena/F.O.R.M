import type { DayPhase, SectionId } from "@/types";
import type { RhythmData } from "./behavior";

// ─── Adaptive Tile Ordering ─────────────────────────────────
// Slightly reorders quick-action tiles based on time and rhythm.
// Stable enough not to confuse — elevates 1-2 most relevant items.

interface TileDef {
  id: SectionId;
  label: string;
  emoji: string;
  href: string;
  bgClass: string;
}

const BASE_TILES: TileDef[] = [
  { id: "checklist", label: "Checklist", emoji: "✅", href: "/checklist", bgClass: "bg-accent-mint-soft" },
  { id: "meals", label: "Meals", emoji: "🍽️", href: "/meals", bgClass: "bg-accent-peach-soft" },
  { id: "workout", label: "Workout", emoji: "💪", href: "/workout", bgClass: "bg-accent-sky-soft" },
  { id: "skincare", label: "Skincare", emoji: "✨", href: "/skincare", bgClass: "bg-accent-lavender-soft" },
  { id: "groceries", label: "Groceries", emoji: "🛒", href: "/groceries", bgClass: "bg-accent-rose-soft" },
  { id: "recipes", label: "Recipes", emoji: "📖", href: "/recipes", bgClass: "bg-accent-amber-soft" },
];

export function getAdaptiveTiles(
  phase: DayPhase,
  workoutDone: boolean,
  mealsDone: number,
  adaptiveEnabled: boolean
): TileDef[] {
  if (!adaptiveEnabled) return BASE_TILES;

  const tiles = [...BASE_TILES];

  // Morning: elevate workout if not done
  if (phase === "morning" && !workoutDone) {
    const idx = tiles.findIndex((t) => t.id === "workout");
    if (idx > 0) {
      const [item] = tiles.splice(idx, 1);
      tiles.splice(0, 0, item);
    }
  }

  // Afternoon: elevate meals if behind
  if (phase === "afternoon" && mealsDone < 2) {
    const idx = tiles.findIndex((t) => t.id === "meals");
    if (idx > 1) {
      const [item] = tiles.splice(idx, 1);
      tiles.splice(1, 0, item);
    }
  }

  // Evening: elevate skincare
  if (phase === "evening" || phase === "night") {
    const idx = tiles.findIndex((t) => t.id === "skincare");
    if (idx > 1) {
      const [item] = tiles.splice(idx, 1);
      tiles.splice(1, 0, item);
    }
  }

  return tiles;
}

// ─── Favorite Actions ───────────────────────────────────────
// Tracks which sections are opened most and surfaces top 3.

const FAVORITES_KEY = "pixie-favorites";

export interface FavoriteData {
  counts: Record<string, number>;
}

export function loadFavorites(): FavoriteData {
  if (typeof window === "undefined") return { counts: {} };
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { counts: {} };
}

export function saveFavorites(data: FavoriteData) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(data)); } catch {}
}

export function recordSectionVisit(data: FavoriteData, id: SectionId): FavoriteData {
  return {
    counts: {
      ...data.counts,
      [id]: (data.counts[id] ?? 0) + 1,
    },
  };
}

export function getTopFavorites(data: FavoriteData, max = 3): SectionId[] {
  return Object.entries(data.counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([id]) => id as SectionId);
}

// ─── Mood Check-in ──────────────────────────────────────────

export type MoodLevel = 1 | 2 | 3;

export interface MoodEntry {
  level: MoodLevel;
  timestamp: number;
}

const MOOD_KEY = "pixie-mood";

export function loadMood(date: string): MoodEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${MOOD_KEY}-${date}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveMood(date: string, entry: MoodEntry) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(`${MOOD_KEY}-${date}`, JSON.stringify(entry)); } catch {}
}

export const moodOptions: { level: MoodLevel; label: string; emoji: string }[] = [
  { level: 1, label: "Low", emoji: "😮‍💨" },
  { level: 2, label: "Okay", emoji: "🙂" },
  { level: 3, label: "Good", emoji: "💪" },
];
