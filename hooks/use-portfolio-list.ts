"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  PortfolioListSort,
  PortfolioWorkTypeFilter,
} from "@/config/portfolio-list";
import { PORTFOLIO_LIST_PAGE_SIZE } from "@/config/portfolio-list";
import {
  filterPortfolioItems,
  paginatePortfolioItems,
  sortPortfolioItems,
} from "@/lib/portfolio/list";
import type { Portfolio } from "@/types/portfolio";

export function usePortfolioList(
  items: Portfolio[],
  clientNameById: Map<string, string>,
) {
  const [workTypeFilter, setWorkTypeFilter] =
    useState<PortfolioWorkTypeFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<PortfolioListSort>("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PORTFOLIO_LIST_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const filteredItems = useMemo(
    () =>
      sortPortfolioItems(
        filterPortfolioItems(items, workTypeFilter, search, clientNameById),
        sort,
      ),
    [clientNameById, items, search, sort, workTypeFilter],
  );

  const pagination = useMemo(
    () => paginatePortfolioItems(filteredItems, page, pageSize),
    [filteredItems, page, pageSize],
  );

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? null;

  const hasActiveFilters =
    workTypeFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  useEffect(() => {
    setPage(1);
    setPanelDismissed(false);
  }, [workTypeFilter, search, sort, pageSize]);

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
      pagination.items.some((item) => item.id === selectedId);

    if (selectedStillVisible) {
      return;
    }

    if (!panelDismissed) {
      setSelectedId(pagination.items[0]?.id ?? null);
    }
  }, [pagination.items, panelDismissed, selectedId]);

  function selectItem(id: string) {
    setSelectedId(id);
    setPanelDismissed(false);
  }

  function closePanel() {
    setSelectedId(null);
    setPanelDismissed(true);
  }

  function resetFilters() {
    setWorkTypeFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPage(1);
  }

  return {
    workTypeFilter,
    setWorkTypeFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectItem,
    closePanel,
    pagination,
    selectedItem,
    hasActiveFilters,
    resetFilters,
  };
}
