import { describe, expect, it } from "vitest";
import { applyFilters, defaultFilterState } from "../../src/lib/filters";
import { sortRecipes } from "../../src/lib/sort";
import { allFixtures } from "../fixtures/recipes";

describe("combined filters", () => {
  it("ANDs filters across facets", () => {
    const matches = applyFilters(allFixtures, {
      ...defaultFilterState,
      mealTypes: ["dinner"],
      cuisines: ["Indian"],
      dietary: ["vegetarian"],
      methods: ["stovetop"],
      time: ["30"],
    });
    expect(matches.map((item) => item.id)).toEqual(["demo-weeknight-dal"]);
  });

  it("does not match recipes whose time is unknown against a time filter", () => {
    const unknownTime = {
      ...allFixtures[0]!,
      id: "no-time",
      slug: "no-time",
      totalTimeMinutes: undefined,
      cookTimeMinutes: undefined,
      prepTimeMinutes: undefined,
    };
    const matches = applyFilters([unknownTime], { ...defaultFilterState, time: ["60"] });
    expect(matches).toEqual([]);
  });
});

describe("sorting", () => {
  it("sorts A-Z, newest, and cooking time", () => {
    expect(sortRecipes(allFixtures, "az").map((item) => item.title)).toEqual([
      "Banana Cake",
      "DEMO: Mango Lassi",
      "DEMO: Paneer Toast",
      "DEMO: Weeknight Dal",
    ]);
    expect(sortRecipes(allFixtures, "newest")[0]?.id).toBe("demo-weeknight-dal");
    expect(sortRecipes(allFixtures, "time")[0]?.id).toBe("demo-mango-lassi");
    expect(sortRecipes(allFixtures, "time").at(-1)?.id).toBe("banana-cake");
  });
});
