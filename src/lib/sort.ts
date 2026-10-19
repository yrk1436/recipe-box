import { effectiveTotalTime } from "../data/categories";
import type { FilterableRecipe } from "./filters";
import type { SortId } from "./filters";

export function sortRecipes<T extends FilterableRecipe>(recipes: T[], sort: SortId): T[] {
  const copy = [...recipes];

  copy.sort((a, b) => {
    if (sort === "az") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "time") {
      const timeA = effectiveTotalTime(a);
      const timeB = effectiveTotalTime(b);
      if (timeA == null && timeB == null) return a.title.localeCompare(b.title);
      if (timeA == null) return 1;
      if (timeB == null) return -1;
      if (timeA !== timeB) return timeA - timeB;
      return a.title.localeCompare(b.title);
    }

    const dateA = a.dateAdded ?? "";
    const dateB = b.dateAdded ?? "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.title.localeCompare(b.title);
  });

  return copy;
}
