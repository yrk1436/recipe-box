import { describe, expect, it } from "vitest";
import { formatIngredientLine, scaleFactorFromServings, scaleIngredient, scaleIngredients } from "../../src/lib/scale";

describe("ingredient scaling", () => {
  it("scales supported quantities and formats fractions", () => {
    const scaled = scaleIngredient({ quantity: "1 1/4", unit: "cups", name: "sugar" }, 2);
    expect(scaled.displayQuantity).toBe("2 1/2");
    expect(scaled.scaled).toBe(true);
    expect(formatIngredientLine(scaled)).toContain("2 1/2 cups sugar");
  });

  it("preserves non-scalable ingredients and labels them", () => {
    const scaled = scaleIngredient(
      { quantity: "1", unit: "teaspoon", name: "salt", scalable: false },
      2,
    );
    expect(scaled.displayQuantity).toBe("1");
    expect(scaled.scaled).toBe(false);
  });

  it("does not invent a quantity for unnamed amounts", () => {
    const scaled = scaleIngredient({ name: "salt", prep: "to taste" }, 4);
    expect(scaled.displayQuantity).toBe("");
    expect(formatIngredientLine(scaled)).toBe("salt, to taste");
  });

  it("recalculates from original servings rather than compounding", () => {
    const ingredients = [{ quantity: "1", unit: "cup", name: "dal" }];
    const factor = scaleFactorFromServings(4, 8);
    expect(scaleIngredients(ingredients, factor)[0]?.displayQuantity).toBe("2");
    const back = scaleFactorFromServings(4, 4);
    expect(scaleIngredients(ingredients, back)[0]?.displayQuantity).toBe("1");
  });
});
