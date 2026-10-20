import { z } from "zod";

export const mealTypes = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "drink",
] as const;

export const dietaryTags = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-free",
  "eggless",
] as const;

export const cookingMethods = [
  "bake",
  "stovetop",
  "no-cook",
  "roast",
  "grill",
  "steam",
  "pressure-cook",
  "slow-cook",
  "fry",
  "other",
] as const;

export const difficulties = ["easy", "medium", "hard"] as const;

export type MealType = (typeof mealTypes)[number];
export type DietaryTag = (typeof dietaryTags)[number];
export type CookingMethod = (typeof cookingMethods)[number];
export type Difficulty = (typeof difficulties)[number];

export const quantityInputSchema = z.union([
  z.string(),
  z.number(),
  z.null(),
]);

export const ingredientSchema = z.object({
  quantity: quantityInputSchema.optional(),
  unit: z.string().min(1).optional(),
  name: z.string().min(1, "Ingredient name is required"),
  prep: z.string().min(1).optional(),
  group: z.string().min(1).optional(),
  scalable: z.boolean().optional(),
});

export const sourceSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url("Source URL must be a valid URL").optional(),
  note: z.string().min(1).optional(),
  imageCredit: z.string().min(1).optional(),
});

export const recipeSchema = z.object({
  id: z
    .string()
    .min(1, "id is required")
    .regex(/^[a-z0-9-]+$/, "id must be lowercase letters, numbers, and hyphens"),
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "title is required"),
  subtitle: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  personalNote: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  imageAlt: z.string().min(1).optional(),
  cuisine: z.string().min(1).optional(),
  mealTypes: z.array(z.enum(mealTypes)).min(1).optional(),
  dietaryTags: z.array(z.enum(dietaryTags)).optional(),
  tags: z.array(z.string().min(1)).optional(),
  aliases: z.array(z.string().min(1)).optional(),
  ingredients: z.array(ingredientSchema).min(1, "at least one ingredient is required"),
  instructions: z.array(z.string().min(1)).min(1, "at least one instruction is required"),
  prepTimeMinutes: z.number().int().nonnegative().optional(),
  cookTimeMinutes: z.number().int().nonnegative().optional(),
  totalTimeMinutes: z.number().int().nonnegative().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(difficulties).optional(),
  tips: z.array(z.string().min(1)).optional(),
  substitutions: z.array(z.string().min(1)).optional(),
  variations: z.array(z.string().min(1)).optional(),
  storageNotes: z.string().min(1).optional(),
  source: sourceSchema.optional(),
  dateAdded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateAdded must be YYYY-MM-DD"),
  featured: z.boolean().optional(),
  scalable: z.boolean().optional(),
  cookingMethod: z.enum(cookingMethods).optional(),
  demo: z.boolean().optional(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type RecipeSource = z.infer<typeof sourceSchema>;
export type Recipe = z.infer<typeof recipeSchema>;

export type RecipeCardModel = Pick<
  Recipe,
  | "id"
  | "slug"
  | "title"
  | "subtitle"
  | "description"
  | "image"
  | "imageAlt"
  | "cuisine"
  | "mealTypes"
  | "dietaryTags"
  | "tags"
  | "aliases"
  | "prepTimeMinutes"
  | "cookTimeMinutes"
  | "totalTimeMinutes"
  | "servings"
  | "difficulty"
  | "dateAdded"
  | "featured"
  | "cookingMethod"
  | "demo"
> & {
  ingredientNames: string[];
};

export function toCardModel(recipe: Recipe): RecipeCardModel {
  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    subtitle: recipe.subtitle,
    description: recipe.description,
    image: recipe.image,
    imageAlt: recipe.imageAlt,
    cuisine: recipe.cuisine,
    mealTypes: recipe.mealTypes,
    dietaryTags: recipe.dietaryTags,
    tags: recipe.tags,
    aliases: recipe.aliases,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    totalTimeMinutes: recipe.totalTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    dateAdded: recipe.dateAdded,
    featured: recipe.featured,
    cookingMethod: recipe.cookingMethod,
    demo: recipe.demo,
    ingredientNames: recipe.ingredients.map((item) =>
      [item.name, item.prep].filter(Boolean).join(" "),
    ),
  };
}
