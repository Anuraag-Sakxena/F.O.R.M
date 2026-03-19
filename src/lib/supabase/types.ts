// Database row types matching the Supabase schema.
// These are the wire shapes — mappers convert to/from domain models.

export interface DbAppInstance {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface DbDailyRecord {
  id: string;
  instance_id: string;
  date: string;
  checklist: unknown; // JSONB
  meals_done: unknown;
  workout_done: boolean;
  lazy_mode: boolean;
  skincare: unknown;
  night_routine: unknown;
  groceries: unknown;
  water_intake: unknown; // JSONB { amount, target }
  lazy_selections: unknown; // JSONB { [category]: index | null }
  created_at: string;
  updated_at: string;
}

export interface DbMoodCheckin {
  id: string;
  instance_id: string;
  date: string;
  level: number;
  checked_in_at: string;
}

export interface DbAppPreferences {
  id: string;
  instance_id: string;
  animations_enabled: boolean;
  microcopy_intensity: string;
  show_emojis: boolean;
  adaptive_enabled: boolean;
  check_in_enabled: boolean;
  show_plan: boolean;
  show_rescue: boolean;
  show_mvd_messages: boolean;
  meal_suggestions: boolean;
  planner_style: string;
  updated_at: string;
}

export interface DbBehaviorMemory {
  id: string;
  instance_id: string;
  last_section: string | null;
  favorite_counts: unknown;
  rhythm_data: unknown;
  updated_at: string;
}
