import { describe, expect, it } from "vitest";
import { matchesQuery, normalizeSearch, searchRecipes } from "../../src/lib/search";
import { allFixtures, bananaCake, paneerToast } from "../fixtures/recipes";

describe("search", () => {
  it("normalizes case, punctuation, and extra spaces", () => {
    expect(normalizeSearch("  Paneer, Toast! ")).toBe("paneer toast");
  });

  it("finds a recipe by title", () => {
    expect(searchRecipes(allFixtures, "banana cake")).toEqual([bananaCake]);
  });

  it("finds every recipe that lists paneer in the ingredients", () => {
    const matches = searchRecipes(allFixtures, "paneer");
    expect(matches.map((item) => item.id)).toEqual(["demo-paneer-toast"]);
    expect(matchesQuery(paneerToast, "PANEER")).toBe(true);
    expect(matchesQuery(bananaCake, "paneer")).toBe(false);
  });

  it("searches aliases and descriptions", () => {
    expect(searchRecipes(allFixtures, "banana bread")[0]?.id).toBe("banana-cake");
    expect(searchRecipes(allFixtures, "loaf pan")[0]?.id).toBe("banana-cake");
  });
});
