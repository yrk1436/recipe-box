export function contentHash(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function recipeContentKey(recipe: {
  id: string;
  ingredients: unknown;
  instructions: unknown;
}): string {
  return `${recipe.id}:${contentHash({
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  })}`;
}
