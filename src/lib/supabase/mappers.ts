// Maps between Supabase DB rows and domain models.

import type { AppSettings, ChecklistItem, GroceryCategory, MealsDoneMap, NightRoutineItem, SkincareRoutine, SectionId } from "@/types";
import type { DbDailyRecord, DbAppPreferences, DbBehaviorMemory, DbMoodCheckin } from "./types";
import type { FavoriteData } from "@/lib/personalization";
import type { RhythmData } from "@/lib/behavior";
import type { MoodEntry } from "@/lib/personalization";

// ─── Daily Record ────────────────────────────────────────────

export interface DailyRecordDomain {
  date: string;
  checklist: ChecklistItem[];
  mealsDone: MealsDoneMap;
  workoutDone: boolean;
  lazyMode: boolean;
  skincare: SkincareRoutine[];
  nightRoutine: NightRoutineItem[];
  groceries: GroceryCategory[];
  updatedAt: string;
}

export function dbToDailyRecord(row: DbDailyRecord): DailyRecordDomain {
  return {
    date: row.date,
    checklist: row.checklist as ChecklistItem[],
    mealsDone: row.meals_done as MealsDoneMap,
    workoutDone: row.workout_done,
    lazyMode: row.lazy_mode,
    skincare: row.skincare as SkincareRoutine[],
    nightRoutine: row.night_routine as NightRoutineItem[],
    groceries: row.groceries as GroceryCategory[],
    updatedAt: row.updated_at,
  };
}

export function dailyRecordToDb(
  instanceId: string,
  record: DailyRecordDomain
): Omit<DbDailyRecord, "id" | "created_at" | "updated_at"> {
  return {
    instance_id: instanceId,
    date: record.date,
    checklist: record.checklist as unknown,
    meals_done: record.mealsDone as unknown,
    workout_done: record.workoutDone,
    lazy_mode: record.lazyMode,
    skincare: record.skincare as unknown,
    night_routine: record.nightRoutine as unknown,
    groceries: record.groceries as unknown,
  };
}

// ─── Preferences ─────────────────────────────────────────────

export function dbToPreferences(row: DbAppPreferences): AppSettings {
  return {
    animationsEnabled: row.animations_enabled,
    microcopyIntensity: row.microcopy_intensity as AppSettings["microcopyIntensity"],
    showEmojis: row.show_emojis,
    adaptiveEnabled: row.adaptive_enabled,
    checkInEnabled: row.check_in_enabled,
    showPlan: row.show_plan,
    showRescue: row.show_rescue,
    showMVDMessages: row.show_mvd_messages,
    mealSuggestions: row.meal_suggestions,
    plannerStyle: row.planner_style as AppSettings["plannerStyle"],
  };
}

export function preferencesToDb(
  instanceId: string,
  settings: AppSettings
): Omit<DbAppPreferences, "id" | "updated_at"> {
  return {
    instance_id: instanceId,
    animations_enabled: settings.animationsEnabled,
    microcopy_intensity: settings.microcopyIntensity,
    show_emojis: settings.showEmojis,
    adaptive_enabled: settings.adaptiveEnabled,
    check_in_enabled: settings.checkInEnabled,
    show_plan: settings.showPlan,
    show_rescue: settings.showRescue,
    show_mvd_messages: settings.showMVDMessages,
    meal_suggestions: settings.mealSuggestions,
    planner_style: settings.plannerStyle,
  };
}

// ─── Behavior Memory ─────────────────────────────────────────

export interface BehaviorMemoryDomain {
  lastSection: SectionId | null;
  favoriteCounts: FavoriteData;
  rhythmData: RhythmData;
}

export function dbToBehaviorMemory(row: DbBehaviorMemory): BehaviorMemoryDomain {
  return {
    lastSection: row.last_section as SectionId | null,
    favoriteCounts: (row.favorite_counts as FavoriteData) ?? { counts: {} },
    rhythmData: (row.rhythm_data as RhythmData) ?? { taskCompletionCounts: {}, taskSkipCounts: {}, lastOpenPhase: null, totalDaysTracked: 0 },
  };
}

export function behaviorMemoryToDb(
  instanceId: string,
  memory: BehaviorMemoryDomain
): Omit<DbBehaviorMemory, "id" | "updated_at"> {
  return {
    instance_id: instanceId,
    last_section: memory.lastSection,
    favorite_counts: memory.favoriteCounts as unknown,
    rhythm_data: memory.rhythmData as unknown,
  };
}

// ─── Mood ────────────────────────────────────────────────────

export function dbToMood(row: DbMoodCheckin): MoodEntry {
  return { level: row.level as 1 | 2 | 3, timestamp: new Date(row.checked_in_at).getTime() };
}
