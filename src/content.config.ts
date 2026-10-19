import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { recipeSchema } from "./types/recipe";

const recipes = defineCollection({
  loader: glob({
    pattern: "**/[!_]*.{yml,yaml,json}",
    base: "./src/data/recipes",
  }),
  schema: recipeSchema,
});

export const collections = { recipes };
