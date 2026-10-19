import { effectiveTotalTime } from "../data/categories";
import type { Recipe } from "../types/recipe";

export function formatMinutes(minutes?: number): string | undefined {
  if (minutes == null) return undefined;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? "1 hr" : `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

export function formatMealType(value: string): string {
  if (value === "snack") return "Snack";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatMethod(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function recipeTimeLabel(recipe: Pick<Recipe, "totalTimeMinutes" | "prepTimeMinutes" | "cookTimeMinutes">): string | undefined {
  return formatMinutes(effectiveTotalTime(recipe));
}

export function groupIngredients<T extends { group?: string }>(ingredients: T[]): { name?: string; items: T[] }[] {
  const groups: { name?: string; items: T[] }[] = [];
  for (const ingredient of ingredients) {
    const name = ingredient.group;
    const last = groups[groups.length - 1];
    if (last && last.name === name) {
      last.items.push(ingredient);
    } else {
      groups.push({ name, items: [ingredient] });
    }
  }
  return groups;
}
