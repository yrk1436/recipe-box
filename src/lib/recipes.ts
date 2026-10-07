import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';
import { RecipeSchema, Recipe, TagCategory } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const RECIPES_DIR = path.join(CONTENT_DIR, 'recipes');
const TAGS_FILE = path.join(CONTENT_DIR, 'tags.yml');

export type TagVocabulary = Record<string, string[]>;

let cachedRecipes: Recipe[] | null = null;
let cachedTagVocabulary: TagVocabulary | null = null;

export function getTagVocabulary(): TagVocabulary {
  if (cachedTagVocabulary) return cachedTagVocabulary;
  
  const content = fs.readFileSync(TAGS_FILE, 'utf-8');
  cachedTagVocabulary = yaml.load(content) as TagVocabulary;
  return cachedTagVocabulary;
}

export function validateTags(recipe: Recipe, vocabulary: TagVocabulary): string[] {
  const errors: string[] = [];
  const tags = recipe.tags || {};
  
  for (const [category, tagList] of Object.entries(tags)) {
    const allowedTags = vocabulary[category] || [];
    for (const tag of tagList) {
      if (!allowedTags.includes(tag)) {
        errors.push(`Unknown tag "${tag}" in category "${category}" for recipe "${recipe.slug}". Add it to content/tags.yml first.`);
      }
    }
  }
  
  return errors;
}

export function getAllRecipes(): Recipe[] {
  if (cachedRecipes) return cachedRecipes;
  
  const vocabulary = getTagVocabulary();
  const recipes: Recipe[] = [];
  const allErrors: string[] = [];
  
  if (!fs.existsSync(RECIPES_DIR)) {
    return [];
  }
  
  const files = fs.readdirSync(RECIPES_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .filter(f => !f.startsWith('_')); // Skip template files
  
  for (const file of files) {
    const filePath = path.join(RECIPES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    // Validate with Zod
    const result = RecipeSchema.safeParse(data);
    
    if (!result.success) {
      const issues = result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
      allErrors.push(`\n❌ ${file}:\n${issues}`);
      continue;
    }
    
    const recipe = result.data;
    
    // Validate tags against vocabulary
    const tagErrors = validateTags(recipe, vocabulary);
    if (tagErrors.length > 0) {
      allErrors.push(`\n❌ ${file}:\n${tagErrors.map(e => `  - ${e}`).join('\n')}`);
      continue;
    }
    
    recipes.push(recipe);
  }
  
  if (allErrors.length > 0) {
    throw new Error(`Recipe validation failed:\n${allErrors.join('\n')}`);
  }
  
  // Sort by date_added (newest first), then by title
  recipes.sort((a, b) => {
    if (a.date_added && b.date_added) {
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    }
    if (a.date_added) return -1;
    if (b.date_added) return 1;
    return a.title.localeCompare(b.title);
  });
  
  cachedRecipes = recipes;
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  const recipes = getAllRecipes();
  return recipes.find(r => r.slug === slug);
}

export function getAllTags(): { category: TagCategory; tags: Array<{ slug: string; name: string; count: number }> }[] {
  const recipes = getAllRecipes();
  const vocabulary = getTagVocabulary();
  
  const tagCounts: Record<string, Record<string, number>> = {};
  
  for (const recipe of recipes) {
    const tags = recipe.tags || {};
    for (const [category, tagList] of Object.entries(tags)) {
      if (!tagCounts[category]) tagCounts[category] = {};
      for (const tag of tagList) {
        tagCounts[category][tag] = (tagCounts[category][tag] || 0) + 1;
      }
    }
  }
  
  const result: { category: TagCategory; tags: Array<{ slug: string; name: string; count: number }> }[] = [];
  
  for (const category of ['meal', 'cuisine', 'diet', 'main_ingredient', 'time', 'occasion'] as TagCategory[]) {
    const counts = tagCounts[category] || {};
    const tags = Object.entries(counts)
      .map(([slug, count]) => ({
        slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count,
      }))
      .sort((a, b) => b.count - a.count);
    
    if (tags.length > 0) {
      result.push({ category, tags });
    }
  }
  
  return result;
}

// Generate search index for client-side search
export function generateSearchIndex(): object[] {
  const recipes = getAllRecipes();
  
  return recipes.map(recipe => {
    const allTags = Object.values(recipe.tags || {}).flat();
    const allIngredients = (recipe.ingredients || [])
      .flatMap(section => section.items)
      .join(' ');
    
    return {
      slug: recipe.slug,
      title: recipe.title,
      description: recipe.description,
      cuisine: recipe.cuisine,
      ingredients: allIngredients,
      tags: allTags.join(' '),
      difficulty: recipe.difficulty,
      is_favorite: recipe.is_favorite,
    };
  });
}

// Get all unique tags used in recipes, grouped by category
export function getUsedTags(): Record<TagCategory, string[]> {
  const recipes = getAllRecipes();
  const used: Record<TagCategory, Set<string>> = {
    meal: new Set(),
    cuisine: new Set(),
    diet: new Set(),
    main_ingredient: new Set(),
    time: new Set(),
    occasion: new Set(),
  };
  
  for (const recipe of recipes) {
    const tags = recipe.tags || {};
    for (const [category, tagList] of Object.entries(tags)) {
      if (used[category as TagCategory]) {
        for (const tag of tagList) {
          used[category as TagCategory].add(tag);
        }
      }
    }
  }
  
  return {
    meal: Array.from(used.meal),
    cuisine: Array.from(used.cuisine),
    diet: Array.from(used.diet),
    main_ingredient: Array.from(used.main_ingredient),
    time: Array.from(used.time),
    occasion: Array.from(used.occasion),
  };
}
