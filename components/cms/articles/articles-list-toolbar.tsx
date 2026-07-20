"use client";

import { ArticlesListFilter } from "@/components/cms/articles/articles-list-filter";
import { ArticlesListManageCategoriesButton } from "@/components/cms/articles/articles-list-manage-categories-button";
import { ArticlesListOptionsMenu } from "@/components/cms/articles/articles-list-options-menu";
import { ArticlesListSearch } from "@/components/cms/articles/articles-list-search";
import { ArticlesListCreateButton } from "@/components/cms/articles/articles-list-create-button";
import type { ArticleListSort, ArticleStatusFilter } from "@/config/article-list";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";

interface ArticlesListToolbarProps {
  search: string;
  statusFilter: ArticleStatusFilter;
  sort: ArticleListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: ArticleStatusFilter) => void;
  onSortChange: (sort: ArticleListSort) => void;
  onResetFilters: () => void;
  onManageCategories: () => void;
}

export function ArticlesListToolbar({
  search,
  statusFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onResetFilters,
  onManageCategories,
}: ArticlesListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <ArticlesListFilter
        statusFilter={statusFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <ArticlesListSearch value={search} onChange={onSearchChange} />
      <ArticlesListOptionsMenu />
      <ArticlesListManageCategoriesButton onClick={onManageCategories} />
      <ArticlesListCreateButton />
    </div>
  );
}
