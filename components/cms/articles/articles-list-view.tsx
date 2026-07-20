"use client";

import { useEffect, useState } from "react";
import { ArticleCategoriesManageDialog } from "@/components/cms/articles/article-categories-manage-dialog";
import { ArticlesListEmptyState } from "@/components/cms/articles/articles-list-empty-state";
import { ArticlesListHeader } from "@/components/cms/articles/articles-list-header";
import { ArticlesListManageCategoriesButton } from "@/components/cms/articles/articles-list-manage-categories-button";
import { ArticlesListCreateButton } from "@/components/cms/articles/articles-list-create-button";
import { ArticlesListToolbar } from "@/components/cms/articles/articles-list-toolbar";
import { ArticlesListWorkspace } from "@/components/cms/articles/articles-list-workspace";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { useArticlesList } from "@/hooks/use-articles-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

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
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <header className="mb-4 shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <ArticlesListHeader />
            <div className="flex flex-wrap items-center gap-2">
              <ArticlesListManageCategoriesButton
                onClick={() => setCategoriesOpen(true)}
              />
              <ArticlesListCreateButton />
            </div>
          </div>
        </header>
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
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <header className="mb-4 shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ArticlesListHeader />
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
      </header>

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
