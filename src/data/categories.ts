import { site } from "./site";
import type { CookingMethod, DietaryTag, MealType, Recipe } from "../types/recipe";

export type CategoryMatch = {
  mealTypes?: MealType[];
  cuisine?: string;
  cuisineNot?: string;
  dietaryTags?: DietaryTag[];
  cookingMethods?: CookingMethod[];
  maxTotalTime?: number;
};

export type CategoryDefinition = {
  id: string;
  label: string;
  description: string;
  match: CategoryMatch;
  alwaysShow?: boolean;
};

export const categories: CategoryDefinition[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    description: "Morning dishes and first meals of the day.",
    match: { mealTypes: ["breakfast"] },
  },
  {
    id: "lunch",
    label: "Lunch",
    description: "Midday plates, bowls, and leftovers worth repeating.",
    match: { mealTypes: ["lunch"] },
  },
  {
    id: "dinner",
    label: "Dinner",
    description: "Evening meals for weeknights and weekends.",
    match: { mealTypes: ["dinner"] },
  },
  {
    id: "snacks",
    label: "Snacks",
    description: "Small bites between meals.",
    match: { mealTypes: ["snack"] },
  },
  {
    id: "desserts",
    label: "Desserts",
    description: "Cakes, sweets, and something after dinner.",
    match: { mealTypes: ["dessert"] },
  },
  {
    id: "drinks",
    label: "Drinks",
    description: "Lassis, teas, and other glasses from the kitchen.",
    match: { mealTypes: ["drink"] },
  },
  {
    id: "indian",
    label: "Indian",
    description: "Home-style Indian cooking.",
    match: { cuisine: "Indian" },
  },
  {
    id: "other-cuisines",
    label: "Other cuisines",
    description: "Everything that is not Indian.",
    match: { cuisineNot: "Indian" },
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    description: "Recipes marked vegetarian.",
    match: { dietaryTags: ["vegetarian"] },
  },
  {
    id: "quick-meals",
    label: "Quick meals",
    description: `Ready in ${site.quickMealMinutes} minutes or less.`,
    match: { maxTotalTime: site.quickMealMinutes },
  },
];

export function recipeMatchesCategory(recipe: Recipe, category: CategoryDefinition): boolean {
  const { match } = category;

  if (match.mealTypes && !recipe.mealTypes?.some((type) => match.mealTypes?.includes(type))) {
    return false;
  }

  if (match.cuisine && recipe.cuisine?.toLowerCase() !== match.cuisine.toLowerCase()) {
    return false;
  }

  if (match.cuisineNot && recipe.cuisine?.toLowerCase() === match.cuisineNot.toLowerCase()) {
    return false;
  }

  if (
    match.dietaryTags &&
    !recipe.dietaryTags?.some((tag) => match.dietaryTags?.includes(tag))
  ) {
    return false;
  }

  if (
    match.cookingMethods &&
    (!recipe.cookingMethod || !match.cookingMethods.includes(recipe.cookingMethod))
  ) {
    return false;
  }

  if (match.maxTotalTime != null) {
    const total = effectiveTotalTime(recipe);
    if (total == null || total > match.maxTotalTime) return false;
  }

  return true;
}

export function effectiveTotalTime(recipe: Pick<Recipe, "totalTimeMinutes" | "prepTimeMinutes" | "cookTimeMinutes">): number | undefined {
  if (recipe.totalTimeMinutes != null) return recipe.totalTimeMinutes;
  if (recipe.prepTimeMinutes != null && recipe.cookTimeMinutes != null) {
    return recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  }
  return recipe.cookTimeMinutes ?? recipe.prepTimeMinutes;
}

export function visibleCategories(recipes: Recipe[]): CategoryDefinition[] {
  return categories.filter((category) => {
    if (category.alwaysShow || site.showEmptyCategories) return true;
    return recipes.some((recipe) => recipeMatchesCategory(recipe, category));
  });
}

export function getCategory(id: string): CategoryDefinition | undefined {
  return categories.find((category) => category.id === id);
}
