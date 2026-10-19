import { recipeSchema, type Recipe } from "../types/recipe";

export type ValidationIssue = {
  file?: string;
  id?: string;
  slug?: string;
  message: string;
};

export type ValidationResult = {
  recipes: Recipe[];
  issues: ValidationIssue[];
};

export type ImageChecker = (image: string) => boolean;

export function parseRecipe(input: unknown, file?: string): { recipe?: Recipe; issues: ValidationIssue[] } {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((issue) => ({
        file,
        message: `${issue.path.join(".") || "recipe"}: ${issue.message}`,
      })),
    };
  }
  return { recipe: parsed.data, issues: [] };
}

export function validateRecipeSet(
  entries: Array<{ file?: string; data: unknown }>,
  options: { imageExists?: ImageChecker } = {},
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const recipes: Recipe[] = [];
  const ids = new Map<string, string | undefined>();
  const slugs = new Map<string, string | undefined>();

  for (const entry of entries) {
    const parsed = parseRecipe(entry.data, entry.file);
    issues.push(...parsed.issues);
    if (!parsed.recipe) continue;

    const recipe = parsed.recipe;
    const previousId = ids.get(recipe.id);
    if (previousId !== undefined) {
      issues.push({
        file: entry.file,
        id: recipe.id,
        message: `Duplicate recipe id "${recipe.id}" (also in ${previousId ?? "another file"})`,
      });
    } else {
      ids.set(recipe.id, entry.file);
    }

    const previousSlug = slugs.get(recipe.slug);
    if (previousSlug !== undefined) {
      issues.push({
        file: entry.file,
        slug: recipe.slug,
        message: `Duplicate recipe slug "${recipe.slug}" (also in ${previousSlug ?? "another file"})`,
      });
    } else {
      slugs.set(recipe.slug, entry.file);
    }

    if (recipe.image && options.imageExists && !options.imageExists(recipe.image)) {
      issues.push({
        file: entry.file,
        id: recipe.id,
        slug: recipe.slug,
        message: `Missing local image "${recipe.image}" for recipe "${recipe.slug}"`,
      });
    }

    for (const [index, ingredient] of recipe.ingredients.entries()) {
      if (!ingredient.name?.trim()) {
        issues.push({
          file: entry.file,
          slug: recipe.slug,
          message: `Ingredient ${index + 1} is missing a name`,
        });
      }
    }

    recipes.push(recipe);
  }

  return { recipes, issues };
}

export function formatValidationIssues(issues: ValidationIssue[]): string {
  return issues
    .map((issue) => {
      const where = issue.file ? `${issue.file}: ` : "";
      return `${where}${issue.message}`;
    })
    .join("\n");
}
