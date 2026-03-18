export type DayType = "gym" | "dance" | "rest" | "gym+dance";

export interface WeekDay {
  day: string;
  short: string;
  type: DayType;
  label: string;
}

export const weeklyStructure: WeekDay[] = [
  { day: "Monday", short: "Mon", type: "gym", label: "Gym" },
  { day: "Tuesday", short: "Tue", type: "gym+dance", label: "Gym + Dance" },
  { day: "Wednesday", short: "Wed", type: "gym", label: "Gym" },
  { day: "Thursday", short: "Thu", type: "gym+dance", label: "Gym + Dance" },
  { day: "Friday", short: "Fri", type: "gym", label: "Gym" },
  { day: "Saturday", short: "Sat", type: "dance", label: "Dance" },
  { day: "Sunday", short: "Sun", type: "rest", label: "Rest" },
];

export const weekSummary = {
  gym: "5 days",
  dance: "2–3 days",
  rest: "1–2 days",
};
