import { describe, expect, it } from "vitest";
import { defaultFilterState } from "../../src/lib/filters";
import { parseRecipeQuery, serializeRecipeQuery } from "../../src/lib/url-state";

describe("URL query state", () => {
  it("round-trips search, filters, and sort", () => {
    const state = {
      ...defaultFilterState,
      query: "paneer",
      mealTypes: ["snack" as const],
      cuisines: ["Indian"],
      dietary: ["vegetarian" as const],
      methods: ["stovetop" as const],
      time: ["30" as const],
      sort: "az" as const,
    };
    const query = serializeRecipeQuery(state);
    expect(query).toContain("q=paneer");
    expect(parseRecipeQuery(`?${query}`)).toEqual(state);
  });

  it("ignores unknown filter values and missing params", () => {
    expect(parseRecipeQuery("?meal=brunch&sort=popular")).toEqual(defaultFilterState);
    expect(parseRecipeQuery("")).toEqual(defaultFilterState);
  });
});
