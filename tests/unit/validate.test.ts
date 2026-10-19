import { describe, expect, it } from "vitest";
import { parseRecipe, validateRecipeSet } from "../../src/lib/validate";
import { bananaCake } from "../fixtures/recipes";

describe("recipe validation", () => {
  it("accepts a complete recipe", () => {
    const parsed = parseRecipe(bananaCake);
    expect(parsed.issues).toEqual([]);
    expect(parsed.recipe?.slug).toBe("banana-cake");
  });

  it("rejects a missing slug and reports the field", () => {
    const { slug: _slug, ...rest } = bananaCake;
    const parsed = parseRecipe(rest);
    expect(parsed.issues.some((issue) => issue.message.toLowerCase().includes("slug"))).toBe(true);
  });

  it("rejects duplicate ids and slugs", () => {
    const result = validateRecipeSet([
      { file: "a.yml", data: bananaCake },
      { file: "b.yml", data: { ...bananaCake, title: "Copy" } },
    ]);
    expect(result.issues.some((issue) => issue.message.includes("Duplicate recipe id"))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes("Duplicate recipe slug"))).toBe(true);
  });

  it("rejects a bad ingredient without a name", () => {
    const parsed = parseRecipe({
      ...bananaCake,
      ingredients: [{ quantity: "1", unit: "cup" }],
    });
    expect(parsed.issues.some((issue) => issue.message.toLowerCase().includes("name"))).toBe(true);
  });

  it("rejects a broken local image path", () => {
    const result = validateRecipeSet(
      [{ file: "cake.yml", data: { ...bananaCake, image: "missing.jpg" } }],
      { imageExists: () => false },
    );
    expect(result.issues.some((issue) => issue.message.includes("Missing local image"))).toBe(true);
  });

  it("allows missing optional fields without filling them in", () => {
    const { servings, prepTimeMinutes, source, tips, ...rest } = bananaCake;
    const parsed = parseRecipe(rest);
    expect(parsed.issues).toEqual([]);
    expect(parsed.recipe?.servings).toBeUndefined();
    expect(parsed.recipe?.prepTimeMinutes).toBeUndefined();
    expect(parsed.recipe?.tips).toBeUndefined();
    void servings;
    void prepTimeMinutes;
    void source;
    void tips;
  });

  it("treats an unknown slug as missing from a set", () => {
    const result = validateRecipeSet([{ data: bananaCake }]);
    expect(result.recipes.find((recipe) => recipe.slug === "does-not-exist")).toBeUndefined();
  });
});
