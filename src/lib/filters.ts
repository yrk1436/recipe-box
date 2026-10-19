import { effectiveTotalTime } from "../data/categories";
import type { CookingMethod, DietaryTag, MealType, Recipe, RecipeCardModel } from "../types/recipe";
import { matchesQuery } from "./search";

export const timeFilters = [
  { id: "15", label: "Under 15 min", max: 15 },
  { id: "30", label: "Under 30 min", max: 30 },
  { id: "60", label: "Under 1 hour", max: 60 },
  { id: "over-60", label: "1 hour or more", max: null },
] as const;

export type TimeFilterId = (typeof timeFilters)[number]["id"];
export type SortId = "az" | "newest" | "time";

export type FilterState = {
  query: string;
  mealTypes: MealType[];
  cuisines: string[];
  dietary: DietaryTag[];
  methods: CookingMethod[];
  time: TimeFilterId[];
  sort: SortId;
};

export const defaultFilterState: FilterState = {
  query: "",
  mealTypes: [],
  cuisines: [],
  dietary: [],
  methods: [],
  time: [],
  sort: "newest",
};

export type FilterableRecipe = Recipe | RecipeCardModel;

function hasAny<T>(selected: T[], value: T | T[] | undefined): boolean {
  if (selected.length === 0) return true;
  if (value == null) return false;
  const values = Array.isArray(value) ? value : [value];
  return selected.some((item) => values.includes(item));
}

function matchesTime(recipe: FilterableRecipe, selected: TimeFilterId[]): boolean {
  if (selected.length === 0) return true;
  const total = effectiveTotalTime(recipe);
  if (total == null) return false;

  return selected.some((id) => {
    if (id === "over-60") return total >= 60;
    const bucket = timeFilters.find((item) => item.id === id);
    return bucket?.max != null ? total <= bucket.max : false;
  });
}

export function matchesFilters(recipe: FilterableRecipe, filters: FilterState): boolean {
  if (!matchesQuery(recipe, filters.query)) return false;
  if (!hasAny(filters.mealTypes, recipe.mealTypes)) return false;
  if (!hasAny(filters.cuisines.map((item) => item.toLowerCase()), recipe.cuisine?.toLowerCase())) {
    return false;
  }
  if (!hasAny(filters.dietary, recipe.dietaryTags)) return false;
  if (!hasAny(filters.methods, recipe.cookingMethod)) return false;
  if (!matchesTime(recipe, filters.time)) return false;
  return true;
}

export function applyFilters<T extends FilterableRecipe>(recipes: T[], filters: FilterState): T[] {
  return recipes.filter((recipe) => matchesFilters(recipe, filters));
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.mealTypes.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.dietary.length > 0 ||
    filters.methods.length > 0 ||
    filters.time.length > 0
  );
}

export function collectFilterOptions(recipes: FilterableRecipe[]) {
  const mealTypes = new Set<MealType>();
  const cuisines = new Set<string>();
  const dietary = new Set<DietaryTag>();
  const methods = new Set<CookingMethod>();

  for (const recipe of recipes) {
    recipe.mealTypes?.forEach((item) => mealTypes.add(item));
    if (recipe.cuisine) cuisines.add(recipe.cuisine);
    recipe.dietaryTags?.forEach((item) => dietary.add(item));
    if (recipe.cookingMethod) methods.add(recipe.cookingMethod);
  }

  return {
    mealTypes: [...mealTypes].sort(),
    cuisines: [...cuisines].sort((a, b) => a.localeCompare(b)),
    dietary: [...dietary].sort(),
    methods: [...methods].sort(),
  };
}
