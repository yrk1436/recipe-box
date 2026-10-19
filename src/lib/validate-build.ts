import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { parse } from "yaml";
import { formatValidationIssues, validateRecipeSet } from "./validate";
import { site } from "../data/site";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const recipesDir = path.join(root, "src/data/recipes");
const imageDirs = [
  path.join(root, "src/assets/images/recipes"),
  path.join(root, "public/images/recipes"),
];

function collectYamlFiles(dir: string, base = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectYamlFiles(full, base));
      continue;
    }
    if (entry.name.startsWith("_")) continue;
    if (!/\.(yml|yaml|json)$/.test(entry.name)) continue;
    out.push(full);
  }
  return out;
}

function imageExists(image: string): boolean {
  const filename = path.basename(image);
  return imageDirs.some((dir) => fs.existsSync(path.join(dir, filename)) || fs.existsSync(path.join(dir, image)));
}

export function loadRecipeFiles() {
  const files = collectYamlFiles(recipesDir);
  return files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const data = file.endsWith(".json") ? JSON.parse(raw) : parse(raw);
    return { file: path.relative(root, file), data };
  });
}

export function validateAllRecipes() {
  const entries = loadRecipeFiles().filter((entry) => {
    const data = entry.data as { demo?: boolean } | null;
    if (!site.includeDemoRecipes && data && typeof data === "object" && data.demo) {
      return false;
    }
    return true;
  });
  return validateRecipeSet(entries, { imageExists });
}

export function validateRecipesIntegration(): AstroIntegration {
  return {
    name: "recipe-box-validate",
    hooks: {
      "astro:build:start": () => {
        const { issues } = validateAllRecipes();
        if (issues.length > 0) {
          throw new Error(`Recipe validation failed:\n${formatValidationIssues(issues)}`);
        }
      },
      "astro:server:setup": () => {
        const { issues } = validateAllRecipes();
        if (issues.length > 0) {
          console.warn(`Recipe validation warnings:\n${formatValidationIssues(issues)}`);
        }
      },
    },
  };
}
