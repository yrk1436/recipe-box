import { z } from 'zod';

export const IngredientSectionSchema = z.object({
  section: z.string().nullable().optional(),
  items: z.array(z.string().min(1)),
});

export const TagsSchema = z.object({
  meal: z.array(z.string()).default([]),
  cuisine: z.array(z.string()).default([]),
  diet: z.array(z.string()).default([]),
  main_ingredient: z.array(z.string()).default([]),
  time: z.array(z.string()).default([]),
  occasion: z.array(z.string()).default([]),
});

export const RecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  source_url: z.string().url().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  prep_time: z.string().optional().default(''),
  cook_time: z.string().optional().default(''),
  total_time: z.string().optional().default(''),
  servings: z.string().optional().default(''),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine: z.string().optional().default(''),
  date_added: z.string().optional(),
  is_favorite: z.boolean().optional().default(false),
  tags: TagsSchema.default({ meal: [], cuisine: [], diet: [], main_ingredient: [], time: [], occasion: [] }),
  ingredients: z.array(IngredientSectionSchema).optional().default([]),
  steps: z.array(z.string().min(1)).optional().default([]),
  tips: z.array(z.string()).optional().default([]),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type IngredientSection = z.infer<typeof IngredientSectionSchema>;
export type Tags = z.infer<typeof TagsSchema>;

export const TAG_CATEGORIES = [
  { id: 'meal', name: 'Meal', icon: '🍽️' },
  { id: 'cuisine', name: 'Cuisine', icon: '🌍' },
  { id: 'diet', name: 'Diet', icon: '🥗' },
  { id: 'main_ingredient', name: 'Main Ingredient', icon: '🥘' },
  { id: 'time', name: 'Time', icon: '⏱️' },
  { id: 'occasion', name: 'Occasion', icon: '🎉' },
] as const;

export type TagCategory = typeof TAG_CATEGORIES[number]['id'];
