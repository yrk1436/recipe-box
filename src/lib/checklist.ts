import { recipeContentKey } from "./hash";

const PREFIX = "recipe-box:checklist:";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStorage(): StorageLike | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function checklistKey(recipe: {
  id: string;
  ingredients: unknown;
  instructions: unknown;
}): string {
  return `${PREFIX}${recipeContentKey(recipe)}`;
}

export function readChecklist(
  key: string,
  storage: StorageLike | null = defaultStorage(),
): number[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is number => typeof item === "number");
  } catch {
    return [];
  }
}

export function writeChecklist(
  key: string,
  checked: number[],
  storage: StorageLike | null = defaultStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(checked));
    return true;
  } catch {
    return false;
  }
}

export function clearChecklist(key: string, storage: StorageLike | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Site remains usable if storage is blocked.
  }
}
