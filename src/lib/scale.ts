import {
  formatQuantity,
  isScalableQuantity,
  parseQuantity,
  scaleQuantity,
  type Quantity,
} from "./quantity";
import type { Ingredient, Recipe } from "../types/recipe";

export type ScaledIngredient = Ingredient & {
  parsedQuantity: Quantity;
  displayQuantity: string;
  scaled: boolean;
};

export function recipeIsScalable(recipe: Pick<Recipe, "scalable" | "ingredients">): boolean {
  if (recipe.scalable === false) return false;
  return recipe.ingredients.some((ingredient) => ingredientCanScale(ingredient));
}

export function ingredientCanScale(ingredient: Ingredient): boolean {
  if (ingredient.scalable === false) return false;
  return isScalableQuantity(parseQuantity(ingredient.quantity));
}

export function scaleFactorFromServings(original: number, current: number): number {
  if (!Number.isFinite(original) || original <= 0) return 1;
  if (!Number.isFinite(current) || current <= 0) return 1;
  return current / original;
}

export function scaleIngredients(ingredients: Ingredient[], factor: number): ScaledIngredient[] {
  return ingredients.map((ingredient) => scaleIngredient(ingredient, factor));
}

export function scaleIngredient(ingredient: Ingredient, factor: number): ScaledIngredient {
  const parsedQuantity = parseQuantity(ingredient.quantity);
  const canScale = ingredient.scalable !== false && isScalableQuantity(parsedQuantity);
  const next = canScale ? scaleQuantity(parsedQuantity, factor) : parsedQuantity;

  return {
    ...ingredient,
    parsedQuantity,
    displayQuantity: formatQuantity(next),
    scaled: canScale && factor !== 1,
  };
}

export function formatIngredientLine(ingredient: ScaledIngredient | Ingredient, factor = 1): string {
  const scaled = "displayQuantity" in ingredient ? ingredient : scaleIngredient(ingredient, factor);
  const parts = [
    scaled.displayQuantity,
    scaled.unit,
    scaled.name,
    scaled.prep ? `, ${scaled.prep}` : "",
  ].filter((part) => part != null && String(part).trim() !== "");

  return parts.join(" ").replace(" ,", ",");
}
