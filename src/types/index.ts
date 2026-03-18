export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  completed: boolean;
}

export interface MealEntry {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  description: string;
  calories?: number;
  emoji: string;
  done?: boolean;
}

export interface WorkoutSection {
  title: string;
  exercises: string[];
}

export interface Workout {
  id: string;
  title: string;
  duration: string;
  intensity: "Low" | "Medium" | "High";
  emoji: string;
  sections: WorkoutSection[];
  completed?: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface GroceryCategory {
  id: string;
  name: string;
  emoji: string;
  items: GroceryItem[];
}

export interface SkincareStep {
  id: string;
  step: number;
  product: string;
  emoji: string;
  done: boolean;
}

export interface SkincareRoutine {
  time: "morning" | "night";
  steps: SkincareStep[];
}

export interface NightRoutineItem {
  id: string;
  done: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  prepTime: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
}

export interface MealsDoneMap {
  [dayKey: string]: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
}

export interface DayRecord {
  date: string;
  checklist: ChecklistItem[];
  mealsDone: MealsDoneMap;
  workout: Workout;
  groceries: GroceryCategory[];
  skincare: SkincareRoutine[];
  nightRoutine: NightRoutineItem[];
  lazyMode: boolean;
}

export type DayPhase = "morning" | "afternoon" | "evening" | "night";

export type MicrocopyIntensity = "light" | "normal" | "playful";

export type PlannerStyle = "minimal" | "balanced" | "supportive";

export interface AppSettings {
  animationsEnabled: boolean;
  microcopyIntensity: MicrocopyIntensity;
  showEmojis: boolean;
  adaptiveEnabled: boolean;
  checkInEnabled: boolean;
  showPlan: boolean;
  showRescue: boolean;
  showMVDMessages: boolean;
  mealSuggestions: boolean;
  plannerStyle: PlannerStyle;
}

export interface DaySummary {
  date: string;
  checklistDone: number;
  checklistTotal: number;
  workoutDone: boolean;
  mealsDone: number;
  mealsTotal: number;
  skincareMorningDone: number;
  skincareMorningTotal: number;
  skincareNightDone: number;
  skincareNightTotal: number;
  nightRoutineDone: number;
  nightRoutineTotal: number;
  completionPercent: number;
}

export type SectionId =
  | "checklist"
  | "meals"
  | "workout"
  | "groceries"
  | "skincare"
  | "recipes";
