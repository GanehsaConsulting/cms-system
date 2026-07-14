import type { ClientFeaturedFilter, ClientListSort } from "@/config/client-list";

export type ClientsWorksAllPortfolioFilter =
  | "all"
  | "with-works"
  | "without-works";

export interface ClientsWorksAllPortfolioFilterOption {
  id: ClientsWorksAllPortfolioFilter;
  label: string;
}

export const CLIENTS_WORKS_ALL_PORTFOLIO_FILTERS: ClientsWorksAllPortfolioFilterOption[] =
  [
    { id: "all", label: "All clients" },
    { id: "with-works", label: "With portfolio" },
    { id: "without-works", label: "Without portfolio" },
  ];

export type ClientsWorksAllListSort =
  | ClientListSort
  | "portfolio-desc"
  | "portfolio-asc";

export type ClientsWorksAllTableSortColumn =
  | "name"
  | "portfolio"
  | "featured"
  | "updated";

export const CLIENTS_WORKS_ALL_TABLE_SORT_MAP: Record<
  ClientsWorksAllTableSortColumn,
  {
    asc: ClientsWorksAllListSort;
    desc: ClientsWorksAllListSort;
    default: ClientsWorksAllListSort;
  }
> = {
  name: { asc: "name-asc", desc: "name-desc", default: "name-asc" },
  portfolio: {
    asc: "portfolio-asc",
    desc: "portfolio-desc",
    default: "portfolio-desc",
  },
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

export interface ClientsWorksAllListSortOption {
  id: ClientsWorksAllListSort;
  label: string;
}

export const CLIENTS_WORKS_ALL_SORT_OPTIONS: ClientsWorksAllListSortOption[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "portfolio-desc", label: "Most works" },
  { id: "portfolio-asc", label: "Fewest works" },
  { id: "featured-desc", label: "Featured first" },
  { id: "featured-asc", label: "Standard first" },
];

export type {
  ClientFeaturedFilter,
  ClientListSort,
} from "@/config/client-list";

export { CLIENT_FEATURED_FILTERS } from "@/config/client-list";
