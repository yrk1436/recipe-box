import { getCollection } from "astro:content";
import { site } from "../data/site";
import { getCategory, recipeMatchesCategory, visibleCategories } from "../data/categories";
import { toCardModel, type Recipe, type RecipeCardModel } from "../types/recipe";
import { effectiveTotalTime } from "../data/categories";

export async function getAllRecipes(): Promise<Recipe[]> {
  const entries = await getCollection("recipes");
  return entries
    .map((entry) => entry.data)
    .filter((recipe) => site.includeDemoRecipes || !recipe.demo)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded) || a.title.localeCompare(b.title));
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  const recipes = await getAllRecipes();
  return recipes.find((recipe) => recipe.slug === slug);
}

export async function getCardModels(): Promise<RecipeCardModel[]> {
  return (await getAllRecipes()).map(toCardModel);
}

export function getFeaturedRecipe(recipes: Recipe[]): Recipe | undefined {
  return recipes.find((recipe) => recipe.featured) ?? recipes[0];
}

export function getRecentRecipes(recipes: Recipe[], limit = 4, excludeId?: string): Recipe[] {
  return recipes.filter((recipe) => recipe.id !== excludeId).slice(0, limit);
}

export function getQuickRecipes(recipes: Recipe[], excludeId?: string): Recipe[] {
  return recipes.filter((recipe) => {
    if (recipe.id === excludeId) return false;
    const total = effectiveTotalTime(recipe);
    return total != null && total <= site.quickMealMinutes;
  });
}

export function recipesForCategory(recipes: Recipe[], categoryId: string): Recipe[] {
  const category = getCategory(categoryId);
  if (!category) return [];
  return recipes.filter((recipe) => recipeMatchesCategory(recipe, category));
}

export function getVisibleCategories(recipes: Recipe[]) {
  return visibleCategories(recipes).map((category) => ({
    ...category,
    count: recipes.filter((recipe) => recipeMatchesCategory(recipe, category)).length,
  }));
}

export { toCardModel };
