export const FAVORITES_KEY = "recipe-box:favorites";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type FavoritesResult = {
  ids: string[];
  error?: string;
  available: boolean;
};

function defaultStorage(): StorageLike | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function readFavorites(storage: StorageLike | null = defaultStorage()): FavoritesResult {
  if (!storage) {
    return { ids: [], available: false, error: "Favorites are unavailable in this browser." };
  }

  try {
    const raw = storage.getItem(FAVORITES_KEY);
    if (!raw) return { ids: [], available: true };
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { ids: [], available: true };
    return {
      ids: parsed.filter((item): item is string => typeof item === "string"),
      available: true,
    };
  } catch {
    return {
      ids: [],
      available: true,
      error: "Favorites could not be read on this device.",
    };
  }
}

export function writeFavorites(
  ids: string[],
  storage: StorageLike | null = defaultStorage(),
): FavoritesResult {
  if (!storage) {
    return { ids, available: false, error: "Favorites are unavailable in this browser." };
  }

  try {
    storage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    return { ids, available: true };
  } catch {
    return {
      ids,
      available: false,
      error: "Favorites could not be saved on this device.",
    };
  }
}

export function isFavorite(id: string, storage: StorageLike | null = defaultStorage()): boolean {
  return readFavorites(storage).ids.includes(id);
}

export function toggleFavorite(
  id: string,
  storage: StorageLike | null = defaultStorage(),
): FavoritesResult {
  const current = readFavorites(storage);
  const ids = current.ids.includes(id)
    ? current.ids.filter((item) => item !== id)
    : [...current.ids, id];
  return writeFavorites(ids, storage);
}
