// Training Program — faithfully extracted from TRAINING document.
// Week 1-4: Foundation phase. Week 5-8: Progression phase.
// Week 9+: Reuses Week 5-8 block permanently.

export interface TrainingExercise {
  name: string;
  sets?: string;
  reps?: string;
  weight?: string;
  notes?: string;
  link?: string;
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
// EXACT YouTube links from the training document
// ═══════════════════════════════════════════════════════════════

const L = {
  stomachVacuums: "https://www.youtube.com/watch?v=N9msEniBkbU",
  miniBandSquat: "https://www.youtube.com/watch?v=_VSOnS1hXV0",
  miniBandHipThrust: "https://www.youtube.com/watch?v=MQ62r2V7Lw8",
  dbSumoSquat: "https://www.youtube.com/watch?v=Brw7T7sxIPg",
  dbStiffLegDL: "https://www.youtube.com/watch?v=nm-fxV-bwWg",
  dbGluteBridge: "https://www.youtube.com/watch?v=Q7cPaJZoOng&t=20s",
  singleLegGluteBridge: "https://www.youtube.com/watch?v=1n_2P4OR-0Q",
  seatedHamCurl: "https://www.youtube.com/watch?v=ZK-O_aS3GdY",
  popSquats: "https://www.youtube.com/watch?v=hDc7MLhktsg",
  miniBandPullAparts: "https://www.youtube.com/watch?v=r_fRngyF9p0",
  miniBandRow: "https://www.youtube.com/watch?v=lHuGxZZ09nY",
  deadBugs: "https://www.youtube.com/watch?v=A32WSOB-6Gw",
  rkcPlank: "https://www.youtube.com/watch?v=_izLJ0giePc",
  cableWidePulldown: "https://www.youtube.com/watch?v=6TSP1TRMUzs&t=47s",
  dbShoulderPress: "https://www.youtube.com/watch?v=C6T8ozMcRQc",
  uprightCableRow: "https://www.youtube.com/watch?v=D-3JnFrFUOw",
  dbFrontRaise: "https://www.youtube.com/watch?v=ADoMBWn3D04",
  cableRopeCurl: "https://www.youtube.com/watch?v=fR_yq6V4yxc",
  cableRopeTricep: "https://www.youtube.com/watch?v=uB-fq0HqGK0",
  wallSit: "https://www.youtube.com/watch?v=8WL0m0vLAPo",
  quadExtension: "https://www.youtube.com/watch?v=6rpfubNjoqU&index=8&list=PL5DmUMcwaT2BZUu7PzMBZAYPilKybBGPE",
  dbHexSquat: "https://www.youtube.com/watch?v=4XLEnwUr1d8",
  cablePullThrough: "https://www.youtube.com/watch?v=seUCEgPsBtc",
  dbFrogPumps: "https://www.youtube.com/watch?v=tFob15sLEZ0",
  singleLegHipThrust: "https://www.youtube.com/watch?v=dxLOXT3mtzE",
  birdDogs: "https://www.youtube.com/watch?v=Yd6H1cSfSfM",
  legRaises: "https://www.youtube.com/watch?v=4P_NRmuPgFE",
  cableNarrowPulldown: "https://www.youtube.com/watch?v=XjW00-M98Bs",
  reverseCableRow: "https://www.youtube.com/watch?v=t6SF6BYcsDM",
  dbLateralRaise: "https://www.youtube.com/watch?v=YYWhkctnP2o&t=3s",
  dbBicepCurl: "https://www.youtube.com/watch?v=kDqklk1ZESo",
  dbTricepKickback: "https://youtu.be/OopKTfLiz48?t=28",
  dbSideLunge: "https://www.youtube.com/watch?v=6Z15_WdXmVw",
  pulseSquats: "https://www.youtube.com/watch?v=jy7SSbxcQnw",
  squatHold: "https://www.youtube.com/watch?v=n745BffnR4A",
  cableKickbacks: "https://www.youtube.com/watch?v=om7q9aCVvR0",
  dbHipThrust: "https://www.youtube.com/watch?v=nehAvSrfUOg",
  kbSumoDeadlift: "https://www.youtube.com/watch?v=3Kg2BD1ZlRY",
  miniBandAbduction: "https://www.youtube.com/watch?v=O9j5_BriCW4&list=PLoVy-85EFtK899UosmFY3vviTqy4s47-q&index=9",
  miniBandSumoSquat: "https://www.youtube.com/watch?v=f-vplQqYaJo",
  kbStepUps: "https://www.youtube.com/watch?v=vr8yOR_YwXg",
  kbGobletSquat: "https://www.youtube.com/watch?v=w2VauHHR1to",
  reverseLunges: "https://www.youtube.com/watch?v=hrZqvNp8NDY",
  kbSwings: "https://www.youtube.com/watch?v=nRiJVZDpdL0",
  kbJumpSquats: "https://www.youtube.com/watch?v=mT67_8ox-pk",
  kbStiffLegSumoDL: "https://www.youtube.com/watch?v=Lx97xHUPK5k&t=25s",
  sideLunge: "https://www.youtube.com/watch?v=6TKktamzq4o",
  iyt: "https://www.youtube.com/watch?v=3w4cV80TVv4",
  cableRopeCrunches: "https://www.youtube.com/watch?v=54q250IUEAc",
  plankToeTaps: "https://www.youtube.com/watch?v=FyKI1hBNoEI",
  singleCableRow: "https://www.youtube.com/watch?v=vRQpiTwUeyM",
  reverseGripPulldown: "https://www.youtube.com/watch?v=ktdMS7WBwck",
  singleArmDBPress: "https://www.youtube.com/watch?v=R6_J7LdVCKQ",
  rearDeltCableRow: "https://www.youtube.com/watch?v=3lBtTqtYvbQ",
  straightBarCurl: "https://www.youtube.com/watch?v=tX_0Pas9iNI",
  tricepPushdown: "https://www.youtube.com/watch?v=rXAbcneAr3I",
  miniBandPulseSquat: "https://www.youtube.com/watch?v=cz2iOGtQt80",
  miniBandJumpSquat: "https://www.youtube.com/watch?v=JZQA08SlJnM&t=3s",
  miniBandHipThrustCombo: "https://www.youtube.com/watch?v=scZFlj11eck",
  seatedAbduction: "https://www.youtube.com/watch?v=M4EVr2E5U1g",
  miniBandPopSquat: "https://www.youtube.com/watch?v=8S7P6OrT9TA",
  singleLegHipHinge: "https://www.youtube.com/watch?v=JiQboHyV9aE",
  jumpLunges: "https://www.youtube.com/watch?v=kyyP5l8noSY&t=1s",
  vUps: "https://www.youtube.com/watch?v=YpYG-pTeaeA",
  kneeTuckCrunches: "https://www.youtube.com/watch?v=VIoihl5ZZzM&t=37s",
  scissorKicks: "https://www.youtube.com/watch?v=PY9L1_oUJM4",
  doubleDPRows: "https://www.youtube.com/watch?v=7AtIjR-QqVA",
  arnoldPress: "https://www.youtube.com/watch?v=apzFTbsm7HU",
  dbUprightRow: "https://www.youtube.com/watch?v=y7Iug7eC0dk",
  dbPunches: "https://www.youtube.com/watch?v=pvnR8CDb4BU",
  plankLegRaises: "https://www.youtube.com/watch?v=kiuVA0gs3EI",
  gluteMarch: "https://www.youtube.com/watch?v=jrt1t-skY54",
  standingCableAbduction: "https://www.youtube.com/watch?v=A_xEJwwuX6Y",
  sumoCableSquat: "https://www.youtube.com/watch?v=z7ei5hd5as8&t=1s",
  seatedHamCurlAlt: "https://www.youtube.com/watch?v=dDMvch2Z9yY",
  kbSumoDeadliftAlt: "https://www.youtube.com/watch?v=FUX6Pz8vV0s&t=1s",
  frogPumpsAdv: "https://www.youtube.com/watch?v=u7U2FtcQa5I",
};

// ═══════════════════════════════════════════════════════════════
// WEEK 1-4
// ═══════════════════════════════════════════════════════════════

const WEEK_1_4_DAYS: TrainingDay[] = [
  {
    dayNumber: 1, title: "Lower Body Focused", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Squat", sets: "2", reps: "10", link: L.miniBandSquat },
        { name: "Mini Band Hip Thrust", sets: "2", reps: "10", link: L.miniBandHipThrust },
      ]},
      { title: "Main Workout", type: "main", exercises: [
        { name: "Dumbbell Sumo Squat", sets: "3", reps: "10", weight: "1 x 20-25 lbs", link: L.dbSumoSquat },
        { name: "Dumbbell Stiff Legged Deadlifts", sets: "3", reps: "12", weight: "2 x 20-25 lbs", link: L.dbStiffLegDL },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Dumbbell Glute Bridges", sets: "3", reps: "12", weight: "35-40 lbs", link: L.dbGluteBridge },
        { name: "Single Leg Glute Bridge", sets: "3", reps: "5R/5L/5R/5L", notes: "Bodyweight, immediately after glute bridges", link: L.singleLegGluteBridge },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Seated Hamstring Curl", sets: "3", reps: "12", weight: "60-80 lbs", link: L.seatedHamCurl },
        { name: "Pop Squats", sets: "3", reps: "12", notes: "Bodyweight", link: L.popSquats },
      ]},
    ],
  },
  {
    dayNumber: 2, title: "Upper Body Focused", isRest: false, focus: "upper",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Pull Aparts", sets: "2", reps: "10", link: L.miniBandPullAparts },
        { name: "Mini Band Row", sets: "2", reps: "10", link: L.miniBandRow },
      ]},
      { title: "Core", type: "main", exercises: [
        { name: "Dead Bugs", sets: "3", reps: "12 each side", link: L.deadBugs },
        { name: "Plank (RKC)", sets: "3", reps: "40 seconds", notes: "Increase hold by 5 sec/set each week", link: L.rkcPlank },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Cable Wide Grip Pulldown", sets: "3", reps: "12", weight: "50-70 lbs", link: L.cableWidePulldown },
        { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", weight: "2 x 10-15 lbs", link: L.dbShoulderPress },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Upright Cable Row", sets: "3", reps: "12", weight: "30-50 lbs", link: L.uprightCableRow },
        { name: "Dumbbell Front Raise", sets: "3", reps: "12", weight: "2 x 5-10 lbs", link: L.dbFrontRaise },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Cable Rope Curl", sets: "3", reps: "12", weight: "30-50 lbs", link: L.cableRopeCurl },
        { name: "Cable Rope Tricep Extension", sets: "3", reps: "12", weight: "30-50 lbs", link: L.cableRopeTricep },
      ]},
    ],
  },
  {
    dayNumber: 3, title: "Lower Body Focused", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Squat", sets: "2", reps: "10", link: L.miniBandSquat },
        { name: "Mini Band Hip Thrust", sets: "2", reps: "10", link: L.miniBandHipThrust },
      ]},
      { title: "Main Workout", type: "main", exercises: [
        { name: "Wall Sit", sets: "1", reps: "60 seconds", notes: "Increase by 10 sec each week", link: L.wallSit },
        { name: "Quad Extension", sets: "3", reps: "12", weight: "70-90 lbs", link: L.quadExtension },
        { name: "Dumbbell 'Hex' Squat", sets: "3", reps: "12", weight: "2 x 10-15 lbs", link: L.dbHexSquat },
        { name: "Cable Pull Through", sets: "3", reps: "12", weight: "40-60 lbs", link: L.cablePullThrough },
        { name: "Dumbbell Frog Pumps", sets: "3", reps: "15", weight: "1 x 15-20 lbs", link: L.dbFrogPumps },
        { name: "Single Leg Hip Thrusts", sets: "3", reps: "6R/6L/6R/6L", notes: "Bodyweight", link: L.singleLegHipThrust },
      ]},
    ],
  },
  {
    dayNumber: 4, title: "Rest Day", isRest: true, focus: "rest",
    blocks: [{ title: "Recovery", type: "rest-note", exercises: [
      { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
    ]}],
  },
  {
    dayNumber: 5, title: "Upper Body Focused", isRest: false, focus: "upper",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Pull Aparts", sets: "2", reps: "10", link: L.miniBandPullAparts },
        { name: "Mini Band Row", sets: "2", reps: "10", link: L.miniBandRow },
      ]},
      { title: "Core", type: "main", exercises: [
        { name: "Bird Dogs", sets: "3", reps: "10 each side", link: L.birdDogs },
        { name: "Leg Raises", sets: "3", reps: "12", link: L.legRaises },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Cable Narrow Grip Pulldown", sets: "3", reps: "10", weight: "70-90 lbs", link: L.cableNarrowPulldown },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Standing Reverse Cable Row", sets: "3", reps: "12", weight: "50-70 lbs", link: L.reverseCableRow },
        { name: "Dumbbell Lateral Raises", sets: "3", reps: "12", weight: "2 x 5-10 lbs", link: L.dbLateralRaise },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Dumbbell Bicep Curls", sets: "3", reps: "12", weight: "2 x 10-15 lbs", link: L.dbBicepCurl },
        { name: "Dumbbell Tricep Kickback", sets: "3", reps: "12", weight: "2 x 5-10 lbs", link: L.dbTricepKickback },
      ]},
    ],
  },
  {
    dayNumber: 6, title: "Lower Body Focused", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Squat", sets: "2", reps: "10", link: L.miniBandSquat },
        { name: "Mini Band Hip Thrust", sets: "2", reps: "10", link: L.miniBandHipThrust },
      ]},
      { title: "Main Workout", type: "main", exercises: [
        { name: "Dumbbell Side Lunge", sets: "3", reps: "10 each side", weight: "1 x 10-15 lbs", link: L.dbSideLunge },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Pulse Squats", sets: "3", reps: "10", notes: "Bodyweight", link: L.pulseSquats },
        { name: "Squat Hold", sets: "3", reps: "10 seconds", notes: "Bodyweight", link: L.squatHold },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Cable Kickbacks", sets: "3", reps: "10 each side", weight: "30-50 lbs", link: L.cableKickbacks },
        { name: "Dumbbell Hip Thrust", sets: "3", reps: "12", weight: "1 x 30-35 lbs", link: L.dbHipThrust },
        { name: "Kettlebell Sumo Deadlift", sets: "3", reps: "12", weight: "40-50 lbs", link: L.kbSumoDeadlift },
      ]},
    ],
  },
  {
    dayNumber: 7, title: "Rest Day", isRest: true, focus: "rest",
    blocks: [{ title: "Recovery", type: "rest-note", exercises: [
      { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
    ]}],
  },
];

// ═══════════════════════════════════════════════════════════════
// WEEK 5-8
// ═══════════════════════════════════════════════════════════════

const WEEK_5_8_DAYS: TrainingDay[] = [
  {
    dayNumber: 1, title: "Lower Body Focused (Circuit)", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L", link: L.miniBandAbduction },
        { name: "Mini Band Sumo Squat", sets: "2", reps: "10", link: L.miniBandSumoSquat },
      ]},
      { title: "Circuit", type: "circuit",
        circuitNote: "Do A-I with zero breaks (except E), then 90 sec rest. Wk 5-6: 3 rounds. Wk 7-8: 4 rounds.",
        exercises: [
          { name: "Kettlebell Step Ups", reps: "5 each side (10 total)", weight: "20-30 lbs", link: L.kbStepUps },
          { name: "Kettlebell Goblet Squat", reps: "10", weight: "20-30 lbs", link: L.kbGobletSquat },
          { name: "Reverse Lunges", reps: "5 each side (10 total)", notes: "Bodyweight", link: L.reverseLunges },
          { name: "Kettlebell Swings", reps: "10", weight: "20-30 lbs", link: L.kbSwings },
          { name: "REST", notes: "30 seconds" },
          { name: "Kettlebell Jump Squats", reps: "10", weight: "20-30 lbs", link: L.kbJumpSquats },
          { name: "Kettlebell Stiff Leg Sumo Deadlift", reps: "10", weight: "20-30 lbs", link: L.kbStiffLegSumoDL },
          { name: "Side Lunge", reps: "5 each side (10 total)", notes: "Bodyweight", link: L.sideLunge },
          { name: "Kettlebell Swings", reps: "10", weight: "20-30 lbs", link: L.kbSwings },
        ],
      },
    ],
  },
  {
    dayNumber: 2, title: "Upper Body Focused", isRest: false, focus: "upper",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
        { name: "I, Y, T's", sets: "2", reps: "10 each position", notes: "Very light dumbbells, squeeze shoulder blades", link: L.iyt },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Cable Rope Crunches", sets: "3", reps: "12", weight: "60-80 lbs", link: L.cableRopeCrunches },
        { name: "Plank Toe Taps", sets: "3", reps: "12 each side", link: L.plankToeTaps },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Standing Single Cable Row", sets: "3", reps: "10 each side", weight: "30-50 lbs", link: L.singleCableRow },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Cable Reverse Grip PullDown", sets: "3", reps: "12", weight: "60-80 lbs", link: L.reverseGripPulldown },
        { name: "Single Arm Dumbbell Press", sets: "3", reps: "12 each side", weight: "1 x 10-15 lbs", link: L.singleArmDBPress },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Rear Delt Cable Rope High Row", sets: "3", reps: "12", weight: "20-40 lbs", link: L.rearDeltCableRow },
        { name: "Dumbbell Lateral Raises", sets: "3", reps: "12", weight: "2 x 10-15 lbs", link: L.dbLateralRaise },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Cable Straight Bar Curls", sets: "3", reps: "12", weight: "30-50 lbs", link: L.straightBarCurl },
        { name: "Cable Straight Bar Tricep Pushdowns", sets: "3", reps: "12", weight: "30-50 lbs", link: L.tricepPushdown },
      ]},
    ],
  },
  {
    dayNumber: 3, title: "Lower Body Focused", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L", link: L.miniBandAbduction },
        { name: "Mini Band Sumo Squat", sets: "2", reps: "10", link: L.miniBandSumoSquat },
      ]},
      { title: "Tripleset", type: "tripleset", exercises: [
        { name: "Mini Band Squat / Dumbbell 'Hex' Squat", sets: "3", reps: "10", weight: "2 x 20-25 lbs", notes: "Band around legs + dumbbells in hands", link: L.miniBandPulseSquat },
        { name: "Mini Band Pulse Squat", sets: "3", reps: "10", link: L.miniBandPulseSquat },
        { name: "Mini Band Jump Squats", sets: "3", reps: "10", link: L.miniBandJumpSquat },
      ]},
      { title: "Tripleset", type: "tripleset", exercises: [
        { name: "Mini Band Hip Thrust / Dumbbell Hip Thrust", sets: "3", reps: "10", weight: "1 x 35-40 lbs", notes: "Band around legs + dumbbell on hips", link: L.miniBandHipThrustCombo },
        { name: "Mini Band Seated Abduction", sets: "3", reps: "10", link: L.seatedAbduction },
        { name: "Mini Band Pop Squat", sets: "3", reps: "10", link: L.miniBandPopSquat },
      ]},
      { title: "Tripleset", type: "tripleset", exercises: [
        { name: "Dumbbell Stiff Legged Deadlifts", sets: "3", reps: "10", weight: "2 x 25-30 lbs", link: L.dbStiffLegDL },
        { name: "Single Leg Hip Hinge", sets: "3", reps: "5 each side", notes: "Bodyweight, touch wall to rebalance if needed", link: L.singleLegHipHinge },
        { name: "Jump Lunges", sets: "3", reps: "5 each side", notes: "Bodyweight", link: L.jumpLunges },
      ]},
    ],
  },
  {
    dayNumber: 4, title: "Rest Day", isRest: true, focus: "rest",
    blocks: [{ title: "Recovery", type: "rest-note", exercises: [
      { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
    ]}],
  },
  {
    dayNumber: 5, title: "Upper Body Focused (Circuit)", isRest: false, focus: "upper",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
        { name: "I, Y, T's", sets: "2", reps: "10 each position", notes: "Very light dumbbells, squeeze shoulder blades", link: L.iyt },
      ]},
      { title: "Tripleset", type: "tripleset", exercises: [
        { name: "V-Ups", sets: "3", reps: "10", link: L.vUps },
        { name: "Knee Tuck Crunches", sets: "3", reps: "10", link: L.kneeTuckCrunches },
        { name: "Scissor Kicks", sets: "3", reps: "10 each side", link: L.scissorKicks },
      ]},
      { title: "Circuit", type: "circuit",
        circuitNote: "Do A-I with zero breaks (except E), then 90 sec rest. Wk 5-6: 3 rounds. Wk 7-8: 4 rounds.",
        exercises: [
          { name: "Double Dumbbell Rows", reps: "10", weight: "2 x 15-20 lbs", link: L.doubleDPRows },
          { name: "Arnold Presses", reps: "10", weight: "2 x 15-20 lbs", link: L.arnoldPress },
          { name: "Dumbbell Upright Row", reps: "10", weight: "2 x 10-15 lbs", link: L.dbUprightRow },
          { name: "Dumbbell Punches", reps: "15 each side (30 total)", weight: "2 x 5 lbs", link: L.dbPunches },
          { name: "REST", notes: "30 seconds" },
          { name: "Dumbbell Front Raise", reps: "10", weight: "2 x 10-15 lbs", link: L.dbFrontRaise },
          { name: "Dumbbell Bicep Curls", reps: "10", weight: "2 x 10-15 lbs", link: L.dbBicepCurl },
          { name: "Dumbbell Tricep Kickback", reps: "10", weight: "2 x 10-15 lbs", link: L.dbTricepKickback },
          { name: "Dumbbell Punches", reps: "15 each side (30 total)", weight: "2 x 5 lbs", link: L.dbPunches },
        ],
      },
    ],
  },
  {
    dayNumber: 6, title: "Lower Body Focused", isRest: false, focus: "lower",
    blocks: [
      { title: "Warm up", type: "warmup", exercises: [
        { name: "Stationary bike or elliptical", notes: "3-5 min, light-medium resistance" },
        { name: "Stomach vacuums", sets: "5", reps: "hold 10 sec each", link: L.stomachVacuums },
      ]},
      { title: "Activation Superset", type: "superset", exercises: [
        { name: "Mini Band Standing Abduction", sets: "2", reps: "5R/5L/5R/5L", link: L.miniBandAbduction },
        { name: "Mini Band Sumo Squat", sets: "2", reps: "10", link: L.miniBandSumoSquat },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Plank Leg Raises", sets: "3", reps: "10 alternating each side", notes: "Squeeze glute at top of each rep", link: L.plankLegRaises },
        { name: "Glute March", sets: "3", reps: "10 alternating each side", notes: "Bodyweight", link: L.gluteMarch },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Standing Cable Abduction", sets: "3", reps: "12 each side", weight: "20-40 lbs", link: L.standingCableAbduction },
        { name: "Sumo Cable Squat", sets: "3", reps: "Pyramid: 15/15/10", weight: "60-80/70-90/80-100 lbs", notes: "Increase weight each set as reps reduce", link: L.sumoCableSquat },
      ]},
      { title: "Superset", type: "superset", exercises: [
        { name: "Seated Hamstring Curl", sets: "3", reps: "10", weight: "70-90 lbs", link: L.seatedHamCurlAlt },
        { name: "Kettlebell Sumo Deadlift", sets: "3", reps: "10", weight: "50-60 lbs", link: L.kbSumoDeadliftAlt },
      ]},
      { title: "", type: "main", exercises: [
        { name: "Dumbbell Frog Pumps", sets: "3", reps: "15/rest 15s/10/rest 15s/5 (1 set)", weight: "1 x 20-25 lbs", notes: "That's 1 set — do 3 total", link: L.frogPumpsAdv },
      ]},
    ],
  },
  {
    dayNumber: 7, title: "Rest Day", isRest: true, focus: "rest",
    blocks: [{ title: "Recovery", type: "rest-note", exercises: [
      { name: "Full rest", notes: "Get plenty of water, sleep, and rest" },
    ]}],
  },
];

// ═══════════════════════════════════════════════════════════════
// CARDIO SCHEDULE
// ═══════════════════════════════════════════════════════════════

const CARDIO: Record<string, CardioSchedule> = {
  "1-2": { upperBodyDays: "25 min Steady State", lowerBodyDays: "25 min Steady State" },
  "3-4": { upperBodyDays: "20 min Steady State + 5 min HIIT", lowerBodyDays: "25 min Steady State" },
  "5-6": { upperBodyDays: "20 min Steady State + 10 min HIIT", lowerBodyDays: "30 min Steady State" },
  "7-8": { upperBodyDays: "20 min Steady State + 15 min HIIT", lowerBodyDays: "35 min Steady State" },
};

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

const MORNING_NOTE = "Start every morning (empty stomach) with 5 stomach vacuums — hold 10 sec each.";

export function getTrainingWeek(weekNumber: number): TrainingWeekData {
  const days = weekNumber >= 5 ? WEEK_5_8_DAYS : WEEK_1_4_DAYS;
  let cardioKey: string;
  if (weekNumber <= 2) cardioKey = "1-2";
  else if (weekNumber <= 4) cardioKey = "3-4";
  else if (weekNumber <= 6) cardioKey = "5-6";
  else cardioKey = "7-8";
  const effectiveWeek = weekNumber > 8 ? ((weekNumber - 5) % 4) + 5 : weekNumber;
  const effectiveCardioKey = effectiveWeek <= 6 ? "5-6" : "7-8";
  const cardio = weekNumber <= 8 ? CARDIO[cardioKey] : CARDIO[effectiveCardioKey];
  return { days, cardio, generalNote: weekNumber <= 8 ? MORNING_NOTE : "" };
}

export function getCardioForDay(weekNumber: number, dayFocus: "lower" | "upper" | "rest"): string {
  const week = getTrainingWeek(weekNumber);
  if (dayFocus === "rest") return "Rest — no cardio";
  return dayFocus === "upper" ? week.cardio.upperBodyDays : week.cardio.lowerBodyDays;
}

export const TOTAL_PROGRAM_WEEKS = 8;
