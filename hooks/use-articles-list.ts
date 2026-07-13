"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArticleListSort, ArticleStatusFilter } from "@/config/article-list";
import { ARTICLE_LIST_PAGE_SIZE } from "@/config/article-list";
import {
  countArticlesByStatus,
  filterArticles,
  paginateArticles,
  sortArticles,
} from "@/lib/articles/list";
import type { Article } from "@/types/article";

export function useArticlesList(articles: Article[]) {
  const [statusFilter, setStatusFilter] = useState<ArticleStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ArticleListSort>("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ARTICLE_LIST_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const counts = useMemo(() => countArticlesByStatus(articles), [articles]);

  const filteredArticles = useMemo(
    () => sortArticles(filterArticles(articles, statusFilter, search), sort),
    [articles, statusFilter, search, sort],
  );

  const pagination = useMemo(
    () => paginateArticles(filteredArticles, page, pageSize),
    [filteredArticles, page, pageSize],
  );

  const selectedArticle =
    articles.find((article) => article.id === selectedId) ?? null;

  const hasActiveFilters =
    statusFilter !== "all" || search.trim().length > 0 || sort !== "updated-desc";

  useEffect(() => {
    setPage(1);
    setPanelDismissed(false);
  }, [statusFilter, search, sort, pageSize]);

  useEffect(() => {
    setPanelDismissed(false);
  }, [page]);

  useEffect(() => {
    if (pagination.items.length === 0) {
      setSelectedId(null);
      return;
    }

    const selectedStillVisible =
      selectedId !== null &&
      pagination.items.some((article) => article.id === selectedId);

    if (selectedStillVisible) {
      return;
    }

    if (!panelDismissed) {
      setSelectedId(pagination.items[0]?.id ?? null);
    }
  }, [pagination.items, panelDismissed, selectedId]);

  function selectArticle(id: string) {
    setSelectedId(id);
    setPanelDismissed(false);
  }

  function closePanel() {
    setSelectedId(null);
    setPanelDismissed(true);
  }

  function resetFilters() {
    setStatusFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPage(1);
    setPanelDismissed(false);
  }

  return {
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
    setSelectedId,
    selectArticle,
    closePanel,
    counts,
    filteredArticles,
    pagination,
    selectedArticle,
    hasActiveFilters,
    resetFilters,
  };
}
