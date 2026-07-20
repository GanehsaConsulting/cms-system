export type BannerStatusFilter = "all" | "active" | "inactive";

export type BannerListSort =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc"
  | "key-asc"
  | "key-desc"
  | "status-desc"
  | "status-asc";

export type BannerTableSortColumn = "name" | "key" | "status" | "updated";

export const BANNER_TABLE_SORT_MAP: Record<
  BannerTableSortColumn,
  { asc: BannerListSort; desc: BannerListSort; default: BannerListSort }
> = {
  name: { asc: "name-asc", desc: "name-desc", default: "name-asc" },
  key: { asc: "key-asc", desc: "key-desc", default: "key-asc" },
  status: {
    asc: "status-asc",
    desc: "status-desc",
    default: "status-desc",
  },
  updated: {
    asc: "updated-asc",
    desc: "updated-desc",
    default: "updated-desc",
  },
};

export interface BannerStatusFilterOption {
  id: BannerStatusFilter;
  label: string;
}

export interface BannerListSortOption {
  id: BannerListSort;
  label: string;
}

export const BANNER_STATUS_FILTERS: BannerStatusFilterOption[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export const BANNER_LIST_SORT_OPTIONS: BannerListSortOption[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "key-asc", label: "Key A–Z" },
  { id: "key-desc", label: "Key Z–A" },
  { id: "status-desc", label: "Active first" },
  { id: "status-asc", label: "Inactive first" },
];
