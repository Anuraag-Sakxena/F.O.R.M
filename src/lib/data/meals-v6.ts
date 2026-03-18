export interface LazyOption {
  place: string;
  order: string;
}

export interface LazyMealCategory {
  meal: string;
  emoji: string;
  options: LazyOption[];
}

export const lazyDayRule =
  "Protein + Veggies + Healthy Fat. No rice (except carb days).";

export const lazyMeals: LazyMealCategory[] = [
  {
    meal: "Breakfast Pickup",
    emoji: "☕",
    options: [
      { place: "Starbucks", order: "Egg white bites OR protein box (skip bread)" },
      { place: "Smoothie King", order: "Gladiator smoothie (low carb)" },
      { place: "Coffee + shake", order: "Coffee + protein shake (carry your own scoop)" },
    ],
  },
  {
    meal: "Lunch Pickup",
    emoji: "🥗",
    options: [
      { place: "CAVA", order: "Greens + chicken + avocado + light tzatziki" },
      { place: "Chipotle", order: "Salad + chicken + fajita veggies + guac" },
      { place: "Sweetgreen", order: "Chicken + greens + avocado" },
      { place: "Mediterranean", order: "Chicken kebab + salad (no rice)" },
    ],
  },
  {
    meal: "Dinner Pickup",
    emoji: "🍽️",
    options: [
      { place: "Sushi", order: "Salmon/tuna sashimi + seaweed salad" },
      { place: "Burger place", order: "Lettuce wrapped burger, no fries" },
      { place: "Halal", order: "Chicken + salad, light sauce" },
      { place: "Any grill", order: "Chicken/fish + vegetables" },
    ],
  },
  {
    meal: "Carb Day Pickup",
    emoji: "🍚",
    options: [
      { place: "Chipotle", order: "Add rice to bowl" },
      { place: "Mediterranean", order: "Small rice portion" },
      { place: "Sushi", order: "1 roll max" },
    ],
  },
];

export const lazyNote = "Stay consistent. Even lazy days should follow structure.";
