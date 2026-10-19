import type { Recipe, RecipeCardModel } from "../types/recipe";

export type SearchableRecipe = Pick<
  Recipe,
  | "title"
  | "subtitle"
  | "description"
  | "personalNote"
  | "cuisine"
  | "mealTypes"
  | "dietaryTags"
  | "tags"
  | "aliases"
  | "ingredients"
> | RecipeCardModel;

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearch(query);
  return normalized ? normalized.split(" ") : [];
}

function searchableText(recipe: SearchableRecipe): string {
  const ingredientNames =
    "ingredientNames" in recipe && recipe.ingredientNames
      ? recipe.ingredientNames
      : "ingredients" in recipe && recipe.ingredients
        ? recipe.ingredients.map((item) =>
            [item.quantity, item.unit, item.name, item.prep, item.group].filter(Boolean).join(" "),
          )
        : [];

  return normalizeSearch(
    [
      recipe.title,
      recipe.subtitle,
      recipe.description,
      "personalNote" in recipe ? recipe.personalNote : "",
      recipe.cuisine,
      ...(recipe.mealTypes ?? []),
      ...(recipe.dietaryTags ?? []),
      ...(recipe.tags ?? []),
      ...(recipe.aliases ?? []),
      ...ingredientNames,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesQuery(recipe: SearchableRecipe, query: string): boolean {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return true;
  const haystack = searchableText(recipe);
  return tokens.every((token) => haystack.includes(token));
}

export function searchRecipes<T extends SearchableRecipe>(recipes: T[], query: string): T[] {
  return recipes.filter((recipe) => matchesQuery(recipe, query));
}
