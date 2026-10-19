import {
  defaultFilterState,
  timeFilters,
  type FilterState,
  type SortId,
  type TimeFilterId,
} from "./filters";
import { cookingMethods, dietaryTags, mealTypes, type CookingMethod, type DietaryTag, type MealType } from "../types/recipe";

const SORTS: SortId[] = ["az", "newest", "time"];
const TIME_IDS = timeFilters.map((item) => item.id);

function csv(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function keep<T extends string>(values: string[], allowed: readonly T[]): T[] {
  return values.filter((value): value is T => (allowed as readonly string[]).includes(value));
}

export function parseRecipeQuery(search: string): FilterState {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const sortParam = params.get("sort");

  return {
    query: params.get("q")?.trim() ?? "",
    mealTypes: keep(csv(params, "meal"), mealTypes),
    cuisines: csv(params, "cuisine"),
    dietary: keep(csv(params, "diet"), dietaryTags),
    methods: keep(csv(params, "method"), cookingMethods),
    time: keep(csv(params, "time"), TIME_IDS) as TimeFilterId[],
    sort: SORTS.includes(sortParam as SortId) ? (sortParam as SortId) : defaultFilterState.sort,
  };
}

export function serializeRecipeQuery(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.mealTypes.length) params.set("meal", state.mealTypes.join(","));
  if (state.cuisines.length) params.set("cuisine", state.cuisines.join(","));
  if (state.dietary.length) params.set("diet", state.dietary.join(","));
  if (state.methods.length) params.set("method", state.methods.join(","));
  if (state.time.length) params.set("time", state.time.join(","));
  if (state.sort !== defaultFilterState.sort) params.set("sort", state.sort);
  return params.toString();
}

export function toggleListValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export type { MealType, DietaryTag, CookingMethod };
