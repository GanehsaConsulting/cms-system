import { LIST_DEFAULT_PAGE_SIZE } from "@/config/list-table";
import type { PortfolioWorkType } from "@/types/portfolio";

export const PORTFOLIO_LIST_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE;

export type PortfolioWorkTypeFilter = "all" | PortfolioWorkType;

export type PortfolioListSort =
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc"
  | "featured-desc"
  | "featured-asc";

export type PortfolioTableSortColumn = "title" | "featured" | "updated";

export const PORTFOLIO_TABLE_SORT_MAP: Record<
  PortfolioTableSortColumn,
  {
    asc: PortfolioListSort;
    desc: PortfolioListSort;
    default: PortfolioListSort;
  }
> = {
  title: { asc: "title-asc", desc: "title-desc", default: "title-asc" },
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

export const PORTFOLIO_WORK_TYPE_FILTERS: {
  id: PortfolioWorkTypeFilter;
  label: string;
}[] = [
  { id: "all", label: "All types" },
  { id: "social-media", label: "Social media" },
  { id: "website", label: "Website" },
];

export const PORTFOLIO_LIST_SORT_OPTIONS: {
  id: PortfolioListSort;
  label: string;
}[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "title-asc", label: "Title A–Z" },
  { id: "title-desc", label: "Title Z–A" },
  { id: "featured-desc", label: "Featured first" },
  { id: "featured-asc", label: "Standard first" },
];
