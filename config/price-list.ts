import { LIST_DEFAULT_PAGE_SIZE } from "@/config/list-table";

export const PRICE_LIST_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE;

export type PriceStatusFilter = "all" | "active" | "inactive";

export type PriceListSort =
  | "updated-desc"
  | "updated-asc"
  | "package-asc"
  | "package-desc"
  | "service-asc"
  | "service-desc"
  | "price-asc"
  | "price-desc"
  | "status-asc"
  | "status-desc";

export type PriceTableSortColumn =
  | "package"
  | "service"
  | "price"
  | "status"
  | "updated";

export const PRICE_TABLE_SORT_MAP: Record<
  PriceTableSortColumn,
  { asc: PriceListSort; desc: PriceListSort; default: PriceListSort }
> = {
  package: { asc: "package-asc", desc: "package-desc", default: "package-asc" },
  service: { asc: "service-asc", desc: "service-desc", default: "service-asc" },
  price: { asc: "price-asc", desc: "price-desc", default: "price-desc" },
  status: { asc: "status-asc", desc: "status-desc", default: "status-asc" },
  updated: {
    asc: "updated-asc",
    desc: "updated-desc",
    default: "updated-desc",
  },
};

export interface PriceStatusFilterOption {
  id: PriceStatusFilter;
  label: string;
}

export interface PriceListSortOption {
  id: PriceListSort;
  label: string;
}

export const PRICE_STATUS_FILTERS: PriceStatusFilterOption[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export const PRICE_LIST_SORT_OPTIONS: PriceListSortOption[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "package-asc", label: "Package A–Z" },
  { id: "package-desc", label: "Package Z–A" },
  { id: "service-asc", label: "Service A–Z" },
  { id: "service-desc", label: "Service Z–A" },
  { id: "price-asc", label: "Price low–high" },
  { id: "price-desc", label: "Price high–low" },
  { id: "status-asc", label: "Status A–Z" },
  { id: "status-desc", label: "Status Z–A" },
];
