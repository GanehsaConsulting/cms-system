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

export type {
  ClientFeaturedFilter,
  ClientListSort,
} from "@/config/client-list";

export {
  CLIENT_FEATURED_FILTERS,
  CLIENT_LIST_SORT_OPTIONS,
} from "@/config/client-list";
