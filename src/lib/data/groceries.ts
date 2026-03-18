import type { GroceryCategory } from "@/types";

export function getDefaultGroceries(): GroceryCategory[] {
  return [
    {
      id: "proteins",
      name: "Proteins",
      emoji: "🥩",
      items: [
        { id: "g-p1", name: "Chicken thighs", checked: false },
        { id: "g-p2", name: "Salmon", checked: false },
        { id: "g-p3", name: "Shrimp", checked: false },
        { id: "g-p4", name: "Ground turkey", checked: false },
        { id: "g-p5", name: "Tuna", checked: false },
        { id: "g-p6", name: "Eggs", checked: false },
        { id: "g-p7", name: "Protein powder", checked: false },
      ],
    },
    {
      id: "vegetables",
      name: "Vegetables",
      emoji: "🥬",
      items: [
        { id: "g-v1", name: "Spinach", checked: false },
        { id: "g-v2", name: "Lettuce", checked: false },
        { id: "g-v3", name: "Broccoli", checked: false },
        { id: "g-v4", name: "Zucchini", checked: false },
        { id: "g-v5", name: "Peppers", checked: false },
        { id: "g-v6", name: "Mushrooms", checked: false },
        { id: "g-v7", name: "Cucumbers", checked: false },
      ],
    },
    {
      id: "fats",
      name: "Fats",
      emoji: "🥑",
      items: [
        { id: "g-f1", name: "Avocado", checked: false },
        { id: "g-f2", name: "Olive oil", checked: false },
        { id: "g-f3", name: "Peanut butter", checked: false },
      ],
    },
    {
      id: "pantry",
      name: "Pantry",
      emoji: "🫙",
      items: [
        { id: "g-pa1", name: "Almond milk", checked: false },
        { id: "g-pa2", name: "Berries", checked: false },
        { id: "g-pa3", name: "Bananas", checked: false },
        { id: "g-pa4", name: "Salsa", checked: false },
        { id: "g-pa5", name: "Soy sauce", checked: false },
      ],
    },
  ];
}
