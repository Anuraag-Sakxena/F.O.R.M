export interface NightExercise {
  id: string;
  name: string;
  reps: string;
  emoji: string;
}

export const nightRoutine: NightExercise[] = [
  { id: "nr1", name: "Stomach Vacuums", reps: "5–8 reps (10–15 sec hold)", emoji: "🫁" },
  { id: "nr2", name: "Dead Bugs", reps: "10 reps each side", emoji: "🪲" },
  { id: "nr3", name: "Plank", reps: "30–45 sec × 2", emoji: "🧱" },
  { id: "nr4", name: "Glute Bridge Hold", reps: "30 sec × 3", emoji: "🍑" },
];

export const nightRoutineTitle = "10-Min Night Routine";
export const nightRoutineSubtitle = "Waist + Core";
