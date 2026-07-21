"use client";

import { useEffect, useState } from "react";
import { ArticleCategoriesManageDialog } from "@/components/cms/articles/article-categories-manage-dialog";
import { ArticlesListEmptyState } from "@/components/cms/articles/articles-list-empty-state";
import { ArticlesListManageCategoriesButton } from "@/components/cms/articles/articles-list-manage-categories-button";
import { ArticlesListCreateButton } from "@/components/cms/articles/articles-list-create-button";
import { ArticlesListToolbar } from "@/components/cms/articles/articles-list-toolbar";
import { ArticlesListWorkspace } from "@/components/cms/articles/articles-list-workspace";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { useArticlesList } from "@/hooks/use-articles-list";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import type { Article } from "@/types/article";

interface ArticlesListViewProps {
  articles: Article[];
  categories: ArticleCategoryStyle[];
}

export function ArticlesListView({
  articles,
  categories,
}: ArticlesListViewProps) {
  const [availableCategories, setAvailableCategories] =
    useState<ArticleCategoryStyle[]>(categories);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

  const {
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectArticle,
    closePanel,
    pagination,
    selectedArticle,
    hasActiveFilters,
    resetFilters,
  } = useArticlesList(articles);

  if (articles.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mb-4 flex shrink-0 flex-wrap justify-end gap-2">
          <ArticlesListManageCategoriesButton
            onClick={() => setCategoriesOpen(true)}
          />
          <ArticlesListCreateButton />
        </div>
        <ArticlesListEmptyState />
        <ArticleCategoriesManageDialog
          open={categoriesOpen}
          onOpenChange={setCategoriesOpen}
          categories={availableCategories}
          onCategoriesChange={setAvailableCategories}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex shrink-0 justify-end">
        <ArticlesListToolbar
          search={search}
          statusFilter={statusFilter}
          sort={sort}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          onManageCategories={() => setCategoriesOpen(true)}
        />
      </div>

      <ArticlesListWorkspace
        className={CMS_FLEX_CHILD}
        articles={pagination.items}
        selectedArticle={selectedArticle}
        selectedId={selectedId}
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        rangeStart={pagination.rangeStart}
        rangeEnd={pagination.rangeEnd}
        sort={sort}
        onSelect={selectArticle}
        onClosePanel={closePanel}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
      />

      <ArticleCategoriesManageDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        categories={availableCategories}
        onCategoriesChange={setAvailableCategories}
      />
    </div>
  );
}
