export interface MealPlan {
  name: string;
  emoji: string;
  ingredients: string[];
  recipe: string[];
  protein?: string;
  calories?: string;
}

export interface DayMealPlan {
  day: string;
  short: string;
  breakfast: MealPlan;
  lunch: MealPlan;
  dinner: MealPlan;
}

export const weeklyMealPlan: DayMealPlan[] = [
  {
    day: "Monday",
    short: "Mon",
    breakfast: {
      name: "Protein Smoothie Bowl",
      emoji: "🥣",
      protein: "35g",
      calories: "380",
      ingredients: [
        "1 scoop protein powder",
        "1/2 banana",
        "1/2 cup berries",
        "1 cup almond milk",
        "1 tbsp peanut butter",
      ],
      recipe: [
        "Blend protein powder, banana, berries, and almond milk until thick",
        "Pour into a bowl",
        "Top with peanut butter drizzle",
      ],
    },
    lunch: {
      name: "Chicken Lettuce Wraps",
      emoji: "🥬",
      protein: "40g",
      calories: "420",
      ingredients: [
        "6 oz chicken thighs, cooked and shredded",
        "Large lettuce leaves",
        "1/2 avocado, sliced",
        "Salsa",
        "Peppers, diced",
      ],
      recipe: [
        "Season and cook chicken thighs in a pan until done",
        "Shred chicken with two forks",
        "Lay out lettuce leaves as wraps",
        "Fill with chicken, avocado, peppers, and salsa",
      ],
    },
    dinner: {
      name: "Salmon with Broccoli",
      emoji: "🐟",
      protein: "38g",
      calories: "450",
      ingredients: [
        "6 oz salmon fillet",
        "2 cups broccoli florets",
        "1 tbsp olive oil",
        "Soy sauce",
        "Salt, pepper, garlic",
      ],
      recipe: [
        "Preheat oven to 400°F",
        "Season salmon with salt, pepper, garlic",
        "Toss broccoli with olive oil on a baking sheet",
        "Bake salmon and broccoli for 18–20 minutes",
        "Drizzle soy sauce before serving",
      ],
    },
  },
  {
    day: "Tuesday",
    short: "Tue",
    breakfast: {
      name: "Egg & Spinach Scramble",
      emoji: "🍳",
      protein: "30g",
      calories: "350",
      ingredients: [
        "3 eggs",
        "1 cup spinach",
        "1/4 cup mushrooms, sliced",
        "1 tbsp olive oil",
        "Salt, pepper",
      ],
      recipe: [
        "Heat olive oil in a pan over medium heat",
        "Sauté mushrooms until soft, about 3 minutes",
        "Add spinach and cook until wilted",
        "Pour in beaten eggs, scramble until set",
        "Season with salt and pepper",
      ],
    },
    lunch: {
      name: "Turkey & Zucchini Stir-Fry",
      emoji: "🍳",
      protein: "38g",
      calories: "400",
      ingredients: [
        "6 oz ground turkey",
        "1 zucchini, sliced",
        "1/2 pepper, diced",
        "1 tbsp soy sauce",
        "1 tbsp olive oil",
      ],
      recipe: [
        "Heat olive oil in a large pan",
        "Brown ground turkey, breaking it apart",
        "Add zucchini and peppers, sauté 4–5 minutes",
        "Add soy sauce and toss to combine",
        "Serve hot",
      ],
    },
    dinner: {
      name: "Shrimp & Mushroom Sauté",
      emoji: "🦐",
      protein: "35g",
      calories: "380",
      ingredients: [
        "6 oz shrimp, peeled",
        "1 cup mushrooms, sliced",
        "1 cup spinach",
        "1 tbsp olive oil",
        "Garlic, salt, pepper",
      ],
      recipe: [
        "Heat olive oil and sauté garlic 30 seconds",
        "Add shrimp, cook 2–3 minutes per side",
        "Add mushrooms, cook until browned",
        "Toss in spinach until wilted",
        "Season and serve",
      ],
    },
  },
  {
    day: "Wednesday",
    short: "Wed",
    breakfast: {
      name: "Protein Shake + Banana",
      emoji: "🥤",
      protein: "35g",
      calories: "340",
      ingredients: [
        "1 scoop protein powder",
        "1 cup almond milk",
        "1 banana",
        "Ice cubes",
      ],
      recipe: [
        "Add all ingredients to a blender",
        "Blend until smooth",
        "Pour and enjoy with banana on the side",
      ],
    },
    lunch: {
      name: "Tuna Salad Plate",
      emoji: "🥗",
      protein: "40g",
      calories: "380",
      ingredients: [
        "1 can tuna, drained",
        "2 cups lettuce",
        "1/2 cucumber, sliced",
        "1/2 avocado",
        "1 tbsp olive oil + lemon",
      ],
      recipe: [
        "Arrange lettuce on a plate",
        "Top with flaked tuna",
        "Add cucumber slices and avocado",
        "Drizzle olive oil and lemon juice",
      ],
    },
    dinner: {
      name: "Chicken Thighs & Peppers",
      emoji: "🍗",
      protein: "40g",
      calories: "460",
      ingredients: [
        "6 oz chicken thighs",
        "1 pepper, sliced",
        "1/2 zucchini, sliced",
        "1 tbsp olive oil",
        "Salt, pepper, paprika",
      ],
      recipe: [
        "Season chicken thighs with salt, pepper, paprika",
        "Heat olive oil and pan-sear chicken 5–6 min per side",
        "Remove chicken, add peppers and zucchini to the pan",
        "Cook veggies 4–5 minutes",
        "Serve together",
      ],
    },
  },
  {
    day: "Thursday",
    short: "Thu",
    breakfast: {
      name: "Egg & Avocado Plate",
      emoji: "🥑",
      protein: "28g",
      calories: "370",
      ingredients: [
        "3 eggs",
        "1/2 avocado",
        "1 cup spinach",
        "Salt, pepper, everything seasoning",
      ],
      recipe: [
        "Fry or scramble eggs to your liking",
        "Slice avocado and arrange on plate",
        "Add fresh spinach on the side",
        "Season with everything seasoning",
      ],
    },
    lunch: {
      name: "Ground Turkey Bowl",
      emoji: "🥘",
      protein: "40g",
      calories: "430",
      ingredients: [
        "6 oz ground turkey",
        "1 cup peppers and mushrooms",
        "Salsa",
        "1/2 avocado",
        "Lettuce base",
      ],
      recipe: [
        "Brown ground turkey with seasonings",
        "Sauté peppers and mushrooms",
        "Build bowl: lettuce base, turkey, veggies",
        "Top with salsa and avocado slices",
      ],
    },
    dinner: {
      name: "Salmon & Spinach",
      emoji: "🐟",
      protein: "38g",
      calories: "440",
      ingredients: [
        "6 oz salmon fillet",
        "2 cups spinach",
        "1 tbsp olive oil",
        "Lemon, garlic, salt, pepper",
      ],
      recipe: [
        "Season salmon with lemon, garlic, salt, pepper",
        "Pan-sear salmon in olive oil, 4 min per side",
        "Wilt spinach in the same pan",
        "Plate salmon over spinach",
      ],
    },
  },
  {
    day: "Friday",
    short: "Fri",
    breakfast: {
      name: "Protein Smoothie Bowl",
      emoji: "🥣",
      protein: "35g",
      calories: "380",
      ingredients: [
        "1 scoop protein powder",
        "1/2 banana",
        "1/2 cup berries",
        "1 cup almond milk",
        "1 tbsp peanut butter",
      ],
      recipe: [
        "Blend protein powder, banana, berries, and almond milk until thick",
        "Pour into a bowl",
        "Top with peanut butter drizzle",
      ],
    },
    lunch: {
      name: "Chicken & Cucumber Salad",
      emoji: "🥗",
      protein: "40g",
      calories: "390",
      ingredients: [
        "6 oz grilled chicken",
        "1 cucumber, diced",
        "1 cup lettuce",
        "1 tbsp olive oil + lemon",
        "Salt, pepper",
      ],
      recipe: [
        "Grill or pan-cook chicken, let rest, then slice",
        "Chop cucumber and lettuce",
        "Toss everything together",
        "Dress with olive oil and lemon",
      ],
    },
    dinner: {
      name: "Shrimp Stir-Fry",
      emoji: "🦐",
      protein: "35g",
      calories: "400",
      ingredients: [
        "6 oz shrimp",
        "1 cup broccoli",
        "1/2 pepper, sliced",
        "1 tbsp soy sauce",
        "1 tbsp olive oil",
      ],
      recipe: [
        "Heat olive oil in a wok or large pan",
        "Cook shrimp 2–3 min per side, set aside",
        "Stir-fry broccoli and peppers 4–5 min",
        "Return shrimp, add soy sauce, toss",
      ],
    },
  },
  {
    day: "Saturday",
    short: "Sat",
    breakfast: {
      name: "Egg & Spinach Scramble",
      emoji: "🍳",
      protein: "30g",
      calories: "350",
      ingredients: [
        "3 eggs",
        "1 cup spinach",
        "1/4 cup mushrooms, sliced",
        "1 tbsp olive oil",
        "Salt, pepper",
      ],
      recipe: [
        "Heat olive oil in a pan over medium heat",
        "Sauté mushrooms until soft",
        "Add spinach and cook until wilted",
        "Pour in beaten eggs, scramble until set",
        "Season with salt and pepper",
      ],
    },
    lunch: {
      name: "Turkey Lettuce Wraps",
      emoji: "🥬",
      protein: "38g",
      calories: "400",
      ingredients: [
        "6 oz ground turkey",
        "Large lettuce leaves",
        "1/2 avocado",
        "Salsa",
        "Soy sauce",
      ],
      recipe: [
        "Brown ground turkey with a splash of soy sauce",
        "Lay out large lettuce leaves",
        "Fill with turkey, avocado slices, and salsa",
        "Wrap and enjoy",
      ],
    },
    dinner: {
      name: "Chicken & Broccoli",
      emoji: "🍗",
      protein: "40g",
      calories: "440",
      ingredients: [
        "6 oz chicken thighs",
        "2 cups broccoli florets",
        "1 tbsp olive oil",
        "Garlic, soy sauce, salt, pepper",
      ],
      recipe: [
        "Season and cook chicken thighs in a pan",
        "Steam or sauté broccoli with garlic",
        "Drizzle soy sauce over the chicken",
        "Plate together and serve",
      ],
    },
  },
  {
    day: "Sunday",
    short: "Sun",
    breakfast: {
      name: "Protein Shake + Banana",
      emoji: "🥤",
      protein: "35g",
      calories: "340",
      ingredients: [
        "1 scoop protein powder",
        "1 cup almond milk",
        "1 banana",
        "Ice cubes",
      ],
      recipe: [
        "Blend all ingredients until smooth",
        "Pour and enjoy",
      ],
    },
    lunch: {
      name: "Tuna & Avocado Plate",
      emoji: "🥗",
      protein: "38g",
      calories: "390",
      ingredients: [
        "1 can tuna, drained",
        "1/2 avocado",
        "1 cup lettuce",
        "Cucumber slices",
        "Olive oil + lemon",
      ],
      recipe: [
        "Arrange lettuce on a plate",
        "Add flaked tuna and avocado",
        "Garnish with cucumber",
        "Drizzle olive oil and lemon",
      ],
    },
    dinner: {
      name: "Salmon & Zucchini",
      emoji: "🐟",
      protein: "38g",
      calories: "450",
      ingredients: [
        "6 oz salmon fillet",
        "1 zucchini, sliced",
        "1 tbsp olive oil",
        "Lemon, garlic, salt, pepper",
      ],
      recipe: [
        "Season salmon with lemon, garlic, salt, pepper",
        "Pan-sear or bake salmon at 400°F for 18 min",
        "Sauté zucchini slices in olive oil",
        "Plate together and serve",
      ],
    },
  },
];
