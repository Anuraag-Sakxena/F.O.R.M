// Training Program — faithfully extracted from TRAINING document.
// Week 1-4: Foundation phase. Week 5-8: Progression phase.
// Week 9+: Reuses Week 5-8 block permanently.

export interface TrainingExercise {
  name: string;
  sets?: string;
  reps?: string;
  weight?: string;
  notes?: string;
  link?: string; // tutorial video URL
}

export interface TrainingBlock {
  title: string;
  type: "warmup" | "main" | "superset" | "tripleset" | "circuit" | "cardio" | "rest-note";
  exercises: TrainingExercise[];
  circuitNote?: string;
}

export interface TrainingDay {
  dayNumber: number;
  title: string;
  isRest: boolean;
  focus: "lower" | "upper" | "rest";
  blocks: TrainingBlock[];
}

export interface CardioSchedule {
  upperBodyDays: string;
  lowerBodyDays: string;
}

export interface TrainingWeekData {
  days: TrainingDay[];
  cardio: CardioSchedule;
  generalNote: string;
}

// ═══════════════════════════════════════════════════════════════
// WEEK 1-4
// ═══════════════════════════════════════════════════════════════

const WEEK_1_4_DAYS: TrainingDay[] = [
  // ── Day 1: Lower Body ────────────────────────────────────
  {
    dayNumber: 1,
    title: "Lower Body Focused",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Squat", sets: "2", reps: "10" },
          { name: "Mini Band Hip Thrust", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Main Workout",
        type: "main",
        exercises: [
          { name: "Dumbbell Sumo Squat", sets: "3", reps: "10", weight: "1 x 20-25 lbs" },
          { name: "Dumbbell Stiff Legged Deadlifts", sets: "3", reps: "12", weight: "2 x 20-25 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Dumbbell Glute Bridges", sets: "3", reps: "12", weight: "35-40 lbs" },
          { name: "Single Leg Glute Bridge", sets: "3", reps: "5R/5L/5R/5L", notes: "Bodyweight, immediately after glute bridges" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Seated Hamstring Curl", sets: "3", reps: "12", weight: "60-80 lbs" },
          { name: "Pop Squats", sets: "3", reps: "12", notes: "Bodyweight" },
        ],
      },
    ],
  },

  // ── Day 2: Upper Body ────────────────────────────────────
  {
    dayNumber: 2,
    title: "Upper Body Focused",
    isRest: false,
    focus: "upper",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Pull Aparts", sets: "2", reps: "10" },
          { name: "Mini Band Row", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Core",
        type: "main",
        exercises: [
          { name: "Dead Bugs", sets: "3", reps: "12 each side" },
          { name: "Plank (RKC)", sets: "3", reps: "40 seconds", notes: "Increase hold by 5 sec/set each week" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Cable Wide Grip Pulldown", sets: "3", reps: "12", weight: "50-70 lbs" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", weight: "2 x 10-15 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Upright Cable Row", sets: "3", reps: "12", weight: "30-50 lbs" },
          { name: "Dumbbell Front Raise", sets: "3", reps: "12", weight: "2 x 5-10 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Cable Rope Curl", sets: "3", reps: "12", weight: "30-50 lbs" },
          { name: "Cable Rope Tricep Extension", sets: "3", reps: "12", weight: "30-50 lbs" },
        ],
      },
    ],
  },

  // ── Day 3: Lower Body ────────────────────────────────────
  {
    dayNumber: 3,
    title: "Lower Body Focused",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Squat", sets: "2", reps: "10" },
          { name: "Mini Band Hip Thrust", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Main Workout",
        type: "main",
        exercises: [
          { name: "Wall Sit", sets: "1", reps: "60 seconds", notes: "Increase by 10 sec each week" },
          { name: "Quad Extension", sets: "3", reps: "12", weight: "70-90 lbs" },
          { name: "Dumbbell 'Hex' Squat", sets: "3", reps: "12", weight: "2 x 10-15 lbs" },
          { name: "Cable Pull Through", sets: "3", reps: "12", weight: "40-60 lbs" },
          { name: "Dumbbell Frog Pumps", sets: "3", reps: "15", weight: "1 x 15-20 lbs" },
          { name: "Single Leg Hip Thrusts", sets: "3", reps: "6R/6L/6R/6L", notes: "Bodyweight" },
        ],
      },
    ],
  },

  // ── Day 4: REST ──────────────────────────────────────────
  {
    dayNumber: 4,
    title: "Rest Day",
    isRest: true,
    focus: "rest",
    blocks: [
      {
        title: "Recovery",
        type: "rest-note",
        exercises: [
          { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
        ],
      },
    ],
  },

  // ── Day 5: Upper Body ────────────────────────────────────
  {
    dayNumber: 5,
    title: "Upper Body Focused",
    isRest: false,
    focus: "upper",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Pull Aparts", sets: "2", reps: "10" },
          { name: "Mini Band Row", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Core",
        type: "main",
        exercises: [
          { name: "Bird Dogs", sets: "3", reps: "10 each side" },
          { name: "Leg Raises", sets: "3", reps: "12" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Cable Narrow Grip Pulldown", sets: "3", reps: "10", weight: "70-90 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Standing Reverse Cable Row", sets: "3", reps: "12", weight: "50-70 lbs" },
          { name: "Dumbbell Lateral Raises", sets: "3", reps: "12", weight: "2 x 5-10 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Dumbbell Bicep Curls", sets: "3", reps: "12", weight: "2 x 10-15 lbs" },
          { name: "Dumbbell Tricep Kickback", sets: "3", reps: "12", weight: "2 x 5-10 lbs" },
        ],
      },
    ],
  },

  // ── Day 6: Lower Body ────────────────────────────────────
  {
    dayNumber: 6,
    title: "Lower Body Focused",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Squat", sets: "2", reps: "10" },
          { name: "Mini Band Hip Thrust", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Main Workout",
        type: "main",
        exercises: [
          { name: "Dumbbell Side Lunge", sets: "3", reps: "10 each side", weight: "1 x 10-15 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Pulse Squats", sets: "3", reps: "10", notes: "Bodyweight" },
          { name: "Squat Hold", sets: "3", reps: "10 seconds", notes: "Bodyweight" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Cable Kickbacks", sets: "3", reps: "10 each side", weight: "30-50 lbs" },
          { name: "Dumbbell Hip Thrust", sets: "3", reps: "12", weight: "1 x 30-35 lbs" },
          { name: "Kettlebell Sumo Deadlift", sets: "3", reps: "12", weight: "40-50 lbs" },
        ],
      },
    ],
  },

  // ── Day 7: REST ──────────────────────────────────────────
  {
    dayNumber: 7,
    title: "Rest Day",
    isRest: true,
    focus: "rest",
    blocks: [
      {
        title: "Recovery",
        type: "rest-note",
        exercises: [
          { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// WEEK 5-8
// ═══════════════════════════════════════════════════════════════

const WEEK_5_8_DAYS: TrainingDay[] = [
  // ── Day 1: Lower Body (Circuit) ──────────────────────────
  {
    dayNumber: 1,
    title: "Lower Body Focused (Circuit)",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L" },
          { name: "Mini Band Sumo Squat", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Circuit",
        type: "circuit",
        circuitNote: "Do A-I with zero breaks (except E), then 90 sec rest. Wk 5-6: 3 rounds. Wk 7-8: 4 rounds.",
        exercises: [
          { name: "Kettlebell Step Ups", reps: "5 each side (10 total)", weight: "20-30 lbs" },
          { name: "Kettlebell Goblet Squat", reps: "10", weight: "20-30 lbs" },
          { name: "Reverse Lunges", reps: "5 each side (10 total)", notes: "Bodyweight" },
          { name: "Kettlebell Swings", reps: "10", weight: "20-30 lbs" },
          { name: "REST", notes: "30 seconds" },
          { name: "Kettlebell Jump Squats", reps: "10", weight: "20-30 lbs" },
          { name: "Kettlebell Stiff Leg Sumo Deadlift", reps: "10", weight: "20-30 lbs" },
          { name: "Side Lunge", reps: "5 each side (10 total)", notes: "Bodyweight" },
          { name: "Kettlebell Swings", reps: "10", weight: "20-30 lbs" },
        ],
      },
    ],
  },

  // ── Day 2: Upper Body ────────────────────────────────────
  {
    dayNumber: 2,
    title: "Upper Body Focused",
    isRest: false,
    focus: "upper",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
          { name: "I, Y, T's", sets: "2", reps: "10 each position", notes: "Very light dumbbells, squeeze shoulder blades" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Cable Rope Crunches", sets: "3", reps: "12", weight: "60-80 lbs" },
          { name: "Plank Toe Taps", sets: "3", reps: "12 each side" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Standing Single Cable Row", sets: "3", reps: "10 each side", weight: "30-50 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Cable Reverse Grip PullDown", sets: "3", reps: "12", weight: "60-80 lbs" },
          { name: "Single Arm Dumbbell Press", sets: "3", reps: "12 each side", weight: "1 x 10-15 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Rear Delt Cable Rope High Row", sets: "3", reps: "12", weight: "20-40 lbs" },
          { name: "Dumbbell Lateral Raises", sets: "3", reps: "12", weight: "2 x 10-15 lbs" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Cable Straight Bar Curls", sets: "3", reps: "12", weight: "30-50 lbs" },
          { name: "Cable Straight Bar Tricep Pushdowns", sets: "3", reps: "12", weight: "30-50 lbs" },
        ],
      },
    ],
  },

  // ── Day 3: Lower Body ────────────────────────────────────
  {
    dayNumber: 3,
    title: "Lower Body Focused",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L" },
          { name: "Mini Band Sumo Squat", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Tripleset",
        type: "tripleset",
        exercises: [
          { name: "Mini Band Squat / Dumbbell 'Hex' Squat", sets: "3", reps: "10", weight: "2 x 20-25 lbs", notes: "Band around legs + dumbbells in hands" },
          { name: "Mini Band Pulse Squat", sets: "3", reps: "10" },
          { name: "Mini Band Jump Squats", sets: "3", reps: "10" },
        ],
      },
      {
        title: "Tripleset",
        type: "tripleset",
        exercises: [
          { name: "Mini Band Hip Thrust / Dumbbell Hip Thrust", sets: "3", reps: "10", weight: "1 x 35-40 lbs", notes: "Band around legs + dumbbell on hips" },
          { name: "Mini Band Seated Abduction", sets: "3", reps: "10" },
          { name: "Mini Band Pop Squat", sets: "3", reps: "10" },
        ],
      },
      {
        title: "Tripleset",
        type: "tripleset",
        exercises: [
          { name: "Dumbbell Stiff Legged Deadlifts", sets: "3", reps: "10", weight: "2 x 25-30 lbs" },
          { name: "Single Leg Hip Hinge", sets: "3", reps: "5 each side", notes: "Bodyweight, touch wall to rebalance if needed" },
          { name: "Jump Lunges", sets: "3", reps: "5 each side", notes: "Bodyweight" },
        ],
      },
    ],
  },

  // ── Day 4: REST ──────────────────────────────────────────
  {
    dayNumber: 4,
    title: "Rest Day",
    isRest: true,
    focus: "rest",
    blocks: [
      {
        title: "Recovery",
        type: "rest-note",
        exercises: [
          { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
        ],
      },
    ],
  },

  // ── Day 5: Upper Body (Circuit) ──────────────────────────
  {
    dayNumber: 5,
    title: "Upper Body Focused (Circuit)",
    isRest: false,
    focus: "upper",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
          { name: "I, Y, T's", sets: "2", reps: "10 each position", notes: "Very light dumbbells, squeeze shoulder blades" },
        ],
      },
      {
        title: "Tripleset",
        type: "tripleset",
        exercises: [
          { name: "V-Ups", sets: "3", reps: "10" },
          { name: "Knee Tuck Crunches", sets: "3", reps: "10" },
          { name: "Scissor Kicks", sets: "3", reps: "10 each side" },
        ],
      },
      {
        title: "Circuit",
        type: "circuit",
        circuitNote: "Do A-I with zero breaks (except E), then 90 sec rest. Wk 5-6: 3 rounds. Wk 7-8: 4 rounds.",
        exercises: [
          { name: "Double Dumbbell Rows", reps: "10", weight: "2 x 15-20 lbs" },
          { name: "Arnold Presses", reps: "10", weight: "2 x 15-20 lbs" },
          { name: "Dumbbell Upright Row", reps: "10", weight: "2 x 10-15 lbs" },
          { name: "Dumbbell Punches", reps: "15 each side (30 total)", weight: "2 x 5 lbs" },
          { name: "REST", notes: "30 seconds" },
          { name: "Dumbbell Front Raise", reps: "10", weight: "2 x 10-15 lbs" },
          { name: "Dumbbell Bicep Curls", reps: "10", weight: "2 x 10-15 lbs" },
          { name: "Dumbbell Tricep Kickback", reps: "10", weight: "2 x 10-15 lbs" },
          { name: "Dumbbell Punches", reps: "15 each side (30 total)", weight: "2 x 5 lbs" },
        ],
      },
    ],
  },

  // ── Day 6: Lower Body ────────────────────────────────────
  {
    dayNumber: 6,
    title: "Lower Body Focused",
    isRest: false,
    focus: "lower",
    blocks: [
      {
        title: "Warm up",
        type: "warmup",
        exercises: [
          { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
          { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each" },
        ],
      },
      {
        title: "Activation Superset",
        type: "superset",
        exercises: [
          { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L" },
          { name: "Mini Band Sumo Squat", sets: "2", reps: "10" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Plank Leg Raises", sets: "3", reps: "10 alternating each side", notes: "Squeeze glute at top of each rep" },
          { name: "Glute March", sets: "3", reps: "10 alternating each side", notes: "Bodyweight" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Standing Cable Abduction", sets: "3", reps: "12 each side", weight: "20-40 lbs" },
          { name: "Sumo Cable Squat", sets: "3", reps: "Pyramid: 15/15/10", weight: "60-80/70-90/80-100 lbs", notes: "Increase weight each set as reps reduce" },
        ],
      },
      {
        title: "Superset",
        type: "superset",
        exercises: [
          { name: "Seated Hamstring Curl", sets: "3", reps: "10", weight: "70-90 lbs" },
          { name: "Kettlebell Sumo Deadlift", sets: "3", reps: "10", weight: "50-60 lbs" },
        ],
      },
      {
        title: "",
        type: "main",
        exercises: [
          { name: "Dumbbell Frog Pumps", sets: "3", reps: "15/rest 15s/10/rest 15s/5 (1 set)", weight: "1 x 20-25 lbs", notes: "That's 1 set — do 3 total" },
        ],
      },
    ],
  },

  // ── Day 7: REST ──────────────────────────────────────────
  {
    dayNumber: 7,
    title: "Rest Day",
    isRest: true,
    focus: "rest",
    blocks: [
      {
        title: "Recovery",
        type: "rest-note",
        exercises: [
          { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// CARDIO SCHEDULE
// ═══════════════════════════════════════════════════════════════

const CARDIO: Record<string, CardioSchedule> = {
  "1-2": {
    upperBodyDays: "25 min Steady State",
    lowerBodyDays: "25 min Steady State",
  },
  "3-4": {
    upperBodyDays: "20 min Steady State + 5 min HIIT",
    lowerBodyDays: "25 min Steady State",
  },
  "5-6": {
    upperBodyDays: "20 min Steady State + 10 min HIIT",
    lowerBodyDays: "30 min Steady State",
  },
  "7-8": {
    upperBodyDays: "20 min Steady State + 15 min HIIT",
    lowerBodyDays: "35 min Steady State",
  },
};

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

const MORNING_NOTE = "Start every morning (empty stomach) with 5 stomach vacuums — hold 10 sec each.";

export function getTrainingWeek(weekNumber: number): TrainingWeekData {
  const isPhase2 = weekNumber >= 5;
  const days = isPhase2 ? WEEK_5_8_DAYS : WEEK_1_4_DAYS;

  let cardioKey: string;
  if (weekNumber <= 2) cardioKey = "1-2";
  else if (weekNumber <= 4) cardioKey = "3-4";
  else if (weekNumber <= 6) cardioKey = "5-6";
  else cardioKey = "7-8";

  // Week 9+ cycles through week 5-8 structure
  const effectiveWeek = weekNumber > 8 ? ((weekNumber - 5) % 4) + 5 : weekNumber;
  const effectiveCardioKey = effectiveWeek <= 6 ? "5-6" : "7-8";
  const cardio = weekNumber <= 8 ? CARDIO[cardioKey] : CARDIO[effectiveCardioKey];

  return {
    days,
    cardio,
    generalNote: weekNumber <= 8 ? MORNING_NOTE : "",
  };
}

export function getCardioForDay(weekNumber: number, dayFocus: "lower" | "upper" | "rest"): string {
  const week = getTrainingWeek(weekNumber);
  if (dayFocus === "rest") return "Rest — no cardio";
  return dayFocus === "upper" ? week.cardio.upperBodyDays : week.cardio.lowerBodyDays;
}

export const TOTAL_PROGRAM_WEEKS = 8;
