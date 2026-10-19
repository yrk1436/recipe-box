import { describe, expect, it } from "vitest";
import { FAVORITES_KEY, readFavorites, toggleFavorite, writeFavorites } from "../../src/lib/favorites";

function memoryStorage(initial?: string): Storage {
  const map = new Map<string, string>();
  if (initial) map.set(FAVORITES_KEY, initial);
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

describe("favorites storage", () => {
  it("toggles ids in working storage", () => {
    const storage = memoryStorage();
    expect(toggleFavorite("banana-cake", storage).ids).toEqual(["banana-cake"]);
    expect(toggleFavorite("banana-cake", storage).ids).toEqual([]);
  });

  it("fails gracefully when storage throws", () => {
    const storage: Storage = {
      length: 0,
      clear() {},
      getItem() {
        return null;
      },
      key() {
        return null;
      },
      removeItem() {},
      setItem() {
        throw new Error("quota");
      },
    };
    const result = writeFavorites(["banana-cake"], storage);
    expect(result.available).toBe(false);
    expect(result.error).toMatch(/could not be saved/i);
  });

  it("works when storage is unavailable", () => {
    const result = readFavorites(null);
    expect(result.ids).toEqual([]);
    expect(result.available).toBe(false);
  });

  it("recovers from malformed stored JSON", () => {
    const result = readFavorites(memoryStorage("{bad"));
    expect(result.ids).toEqual([]);
    expect(result.error).toMatch(/could not be read/i);
  });
});
