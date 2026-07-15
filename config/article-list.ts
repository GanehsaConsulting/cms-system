import { LIST_DEFAULT_PAGE_SIZE } from "@/config/list-table";
import type { ArticleStatus } from "@/types/article";

export const ARTICLE_LIST_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE;

export type ArticleStatusFilter = "all" | ArticleStatus;

export type ArticleListSort =
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc"
  | "created-desc"
  | "author-asc"
  | "author-desc"
  | "category-asc"
  | "category-desc"
  | "status-asc"
  | "status-desc";

export type ArticleTableSortColumn =
  | "title"
  | "author"
  | "category"
  | "status"
  | "updated";

export const ARTICLE_TABLE_SORT_MAP: Record<
  ArticleTableSortColumn,
  { asc: ArticleListSort; desc: ArticleListSort; default: ArticleListSort }
> = {
  title: { asc: "title-asc", desc: "title-desc", default: "title-asc" },
  author: { asc: "author-asc", desc: "author-desc", default: "author-asc" },
  category: {
    asc: "category-asc",
    desc: "category-desc",
    default: "category-asc",
  },
  status: { asc: "status-asc", desc: "status-desc", default: "status-asc" },
  updated: {
    asc: "updated-asc",
    desc: "updated-desc",
    default: "updated-desc",
  },
};

export interface ArticleStatusFilterOption {
  id: ArticleStatusFilter;
  label: string;
}

export interface ArticleListSortOption {
  id: ArticleListSort;
  label: string;
}

export const ARTICLE_STATUS_FILTERS: ArticleStatusFilterOption[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "scheduled", label: "Scheduled" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

export const ARTICLE_LIST_SORT_OPTIONS: ArticleListSortOption[] = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "created-desc", label: "Recently created" },
  { id: "title-asc", label: "Title A–Z" },
  { id: "title-desc", label: "Title Z–A" },
  { id: "author-asc", label: "Author A–Z" },
  { id: "author-desc", label: "Author Z–A" },
  { id: "category-asc", label: "Category A–Z" },
  { id: "category-desc", label: "Category Z–A" },
  { id: "status-asc", label: "Status A–Z" },
  { id: "status-desc", label: "Status Z–A" },
];
