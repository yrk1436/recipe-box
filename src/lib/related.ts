import type { Recipe } from "../types/recipe";
import { normalizeSearch } from "./search";

function ingredientTokens(recipe: Recipe): Set<string> {
  return new Set(recipe.ingredients.map((item) => normalizeSearch(item.name)).filter(Boolean));
}

export function relatedRecipes(recipe: Recipe, all: Recipe[], limit = 3): Recipe[] {
  const selfIngredients = ingredientTokens(recipe);
  const scored = all
    .filter((candidate) => candidate.id !== recipe.id)
    .map((candidate) => {
      let score = 0;
      if (recipe.cuisine && candidate.cuisine === recipe.cuisine) score += 3;
      score += (recipe.mealTypes ?? []).filter((type) => candidate.mealTypes?.includes(type)).length * 2;
      score += (recipe.dietaryTags ?? []).filter((tag) => candidate.dietaryTags?.includes(tag)).length;
      score += (recipe.tags ?? []).filter((tag) => candidate.tags?.includes(tag)).length;
      const overlap = [...ingredientTokens(candidate)].filter((name) => selfIngredients.has(name)).length;
      score += overlap * 2;
      return { candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title));

  return scored.slice(0, limit).map((item) => item.candidate);
}
