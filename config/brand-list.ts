export type BrandStatusFilter = "all" | "active" | "inactive";

export type BrandListSort =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc";

export const BRAND_STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
] as const satisfies ReadonlyArray<{ id: BrandStatusFilter; label: string }>;

export const BRAND_LIST_SORT_OPTIONS = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
] as const satisfies ReadonlyArray<{ id: BrandListSort; label: string }>;

export const BRAND_LIST_DEFAULT_SORT: BrandListSort = "updated-desc";
