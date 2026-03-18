import type {
  ChecklistItem,
  SkincareRoutine,
} from "@/types";

export { getDefaultGroceries } from "./data/groceries";

export function getDefaultChecklist(): ChecklistItem[] {
  return [
    { id: "gym", label: "Gym / Dance done", emoji: "💪", completed: false },
    { id: "water", label: "Water intake done", emoji: "💧", completed: false },
    { id: "protein", label: "Protein intake done", emoji: "🥩", completed: false },
    { id: "steps", label: "8–10K steps done", emoji: "👟", completed: false },
    { id: "meals", label: "3 meals eaten", emoji: "🍽️", completed: false },
    { id: "night-routine", label: "Night routine done", emoji: "🌙", completed: false },
  ];
}

export function getDefaultSkincare(): SkincareRoutine[] {
  return [
    {
      time: "morning",
      steps: [
        { id: "am1", step: 1, product: "Gentle cleanser", emoji: "🧴", done: false },
        { id: "am2", step: 2, product: "Vitamin C serum", emoji: "✨", done: false },
        { id: "am3", step: 3, product: "Moisturizer", emoji: "💦", done: false },
        { id: "am4", step: 4, product: "SPF 50 sunscreen", emoji: "☀️", done: false },
      ],
    },
    {
      time: "night",
      steps: [
        { id: "pm1", step: 1, product: "Oil cleanser", emoji: "🫧", done: false },
        { id: "pm2", step: 2, product: "Foam cleanser", emoji: "🧴", done: false },
        { id: "pm3", step: 3, product: "Retinol serum", emoji: "💜", done: false },
        { id: "pm4", step: 4, product: "Night cream", emoji: "🌙", done: false },
        { id: "pm5", step: 5, product: "Lip mask", emoji: "👄", done: false },
      ],
    },
  ];
}
