import { LIST_DEFAULT_PAGE_SIZE } from "@/config/list-table";

export const CLIENT_LIST_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE;

export type ClientFeaturedFilter = "all" | "featured" | "standard";

export type ClientListSort =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc"
  | "featured-desc"
  | "featured-asc";

export type ClientTableSortColumn = "name" | "featured" | "updated";

export const CLIENT_TABLE_SORT_MAP: Record<
  ClientTableSortColumn,
  { asc: ClientListSort; desc: ClientListSort; default: ClientListSort }
> = {
  name: { asc: "name-asc", desc: "name-desc", default: "name-asc" },
  featured: {
    asc: "featured-asc",
    desc: "featured-desc",
    default: "featured-desc",
  },
  updated: {
    asc: "updated-asc",
    desc: "updated-desc",
    default: "updated-desc",
  },
};

export interface ClientFeaturedFilterOption {
  id: ClientFeaturedFilter;
  label: string;
}

export interface ClientListSortOption {
  id: ClientListSort;
  label: string;
}

export const CLIENT_FEATURED_FILTERS: ClientFeaturedFilterOption[] = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "standard", label: "Standard" },
];

export const CLIENT_LIST_SORT_OPTIONS: ClientListSortOption[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "featured-desc", label: "Featured first" },
  { id: "featured-asc", label: "Standard first" },
];
