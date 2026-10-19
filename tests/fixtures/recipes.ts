import type { Recipe } from "../../src/types/recipe";

export const bananaCake: Recipe = {
  id: "banana-cake",
  slug: "banana-cake",
  title: "Banana Cake",
  description: "Her first and best banana cake, baked in a loaf pan with wheat flour, butter, and walnuts.",
  cuisine: "American",
  mealTypes: ["dessert"],
  dietaryTags: ["vegetarian"],
  tags: ["banana", "loaf"],
  aliases: ["banana bread"],
  ingredients: [
    { quantity: "1 1/4", unit: "cups", name: "sugar" },
    { quantity: "1", unit: "stick", name: "butter", prep: "softened" },
    { quantity: "2", name: "eggs" },
    { quantity: "1/4", unit: "teaspoon", name: "baking powder" },
    { quantity: "2", name: "large very ripe bananas", prep: "mashed" },
  ],
  instructions: [
    "Preheat the oven to 375°F. Grease a loaf pan.",
    "Pour into the greased loaf pan. Bake at 375°F for 45 minutes.",
  ],
  cookTimeMinutes: 45,
  totalTimeMinutes: 60,
  difficulty: "easy",
  cookingMethod: "bake",
  dateAdded: "2026-10-07",
  featured: true,
  scalable: true,
};

export const paneerToast: Recipe = {
  id: "demo-paneer-toast",
  slug: "demo-paneer-toast",
  title: "DEMO: Paneer Toast",
  description: "A labelled demo snack.",
  cuisine: "Indian",
  mealTypes: ["breakfast", "snack"],
  dietaryTags: ["vegetarian"],
  tags: ["paneer"],
  ingredients: [
    { quantity: "2", name: "bread slices" },
    { quantity: "1/2", unit: "cup", name: "paneer", prep: "crumbled" },
    { quantity: "1", name: "green chili", prep: "optional, chopped", scalable: false },
  ],
  instructions: ["Toast on a pan until the bread is golden."],
  prepTimeMinutes: 5,
  cookTimeMinutes: 8,
  totalTimeMinutes: 13,
  servings: 1,
  cookingMethod: "stovetop",
  demo: true,
  dateAdded: "2026-10-16",
};

export const dal: Recipe = {
  id: "demo-weeknight-dal",
  slug: "demo-weeknight-dal",
  title: "DEMO: Weeknight Dal",
  cuisine: "Indian",
  mealTypes: ["dinner"],
  dietaryTags: ["vegetarian"],
  ingredients: [
    { quantity: "1", unit: "cup", name: "masoor dal" },
    { quantity: "3", unit: "cups", name: "water", scalable: false },
    { quantity: "1", unit: "teaspoon", name: "salt", prep: "or to taste", scalable: false },
  ],
  instructions: ["Simmer until the lentils are soft."],
  totalTimeMinutes: 25,
  servings: 4,
  cookingMethod: "stovetop",
  demo: true,
  dateAdded: "2026-10-18",
};

export const lassi: Recipe = {
  id: "demo-mango-lassi",
  slug: "demo-mango-lassi",
  title: "DEMO: Mango Lassi",
  cuisine: "Indian",
  mealTypes: ["drink"],
  dietaryTags: ["vegetarian"],
  ingredients: [{ quantity: "1", unit: "cup", name: "ripe mango" }],
  instructions: ["Blend until smooth."],
  totalTimeMinutes: 10,
  servings: 2,
  cookingMethod: "no-cook",
  demo: true,
  dateAdded: "2026-10-17",
};

export const allFixtures = [bananaCake, paneerToast, dal, lassi];
