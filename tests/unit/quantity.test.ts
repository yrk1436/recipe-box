import { describe, expect, it } from "vitest";
import { formatQuantity, parseQuantity, scaleQuantity } from "../../src/lib/quantity";

describe("parseQuantity", () => {
  it("parses mixed fractions", () => {
    expect(parseQuantity("1 1/4")).toEqual({ type: "number", value: 1.25 });
  });

  it("parses simple fractions and unicode fractions", () => {
    expect(parseQuantity("1/2")).toEqual({ type: "number", value: 0.5 });
    expect(parseQuantity("½")).toEqual({ type: "number", value: 0.5 });
  });

  it("parses ranges without inventing values", () => {
    expect(parseQuantity("2-3")).toEqual({ type: "range", min: 2, max: 3 });
    expect(parseQuantity("1/2 to 1")).toEqual({ type: "range", min: 0.5, max: 1 });
  });

  it("keeps informal measures as text", () => {
    expect(parseQuantity("to taste")).toEqual({ type: "text", value: "to taste" });
    expect(parseQuantity("a pinch")).toEqual({ type: "text", value: "a pinch" });
  });

  it("treats missing quantities as none", () => {
    expect(parseQuantity("")).toEqual({ type: "none" });
    expect(parseQuantity(null)).toEqual({ type: "none" });
    expect(parseQuantity(undefined)).toEqual({ type: "none" });
  });
});

describe("formatQuantity", () => {
  it("formats culinary fractions", () => {
    expect(formatQuantity({ type: "number", value: 0.5 })).toBe("1/2");
    expect(formatQuantity({ type: "number", value: 1.25 })).toBe("1 1/4");
    expect(formatQuantity({ type: "number", value: 2.5 })).toBe("2 1/2");
    expect(formatQuantity({ type: "number", value: 0.75 })).toBe("3/4");
  });

  it("formats ranges with an en dash", () => {
    expect(formatQuantity({ type: "range", min: 2, max: 3 })).toBe("2–3");
  });
});

describe("scaleQuantity", () => {
  it("scales numbers and ranges from the original values", () => {
    expect(scaleQuantity({ type: "number", value: 1.25 }, 2)).toEqual({ type: "number", value: 2.5 });
    expect(scaleQuantity({ type: "range", min: 2, max: 3 }, 2)).toEqual({ type: "range", min: 4, max: 6 });
  });

  it("does not scale text or empty quantities", () => {
    expect(scaleQuantity({ type: "text", value: "to taste" }, 3)).toEqual({ type: "text", value: "to taste" });
    expect(scaleQuantity({ type: "none" }, 3)).toEqual({ type: "none" });
  });
});
