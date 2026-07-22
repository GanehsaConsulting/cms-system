"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ContentActivitiesListSort,
  ContentActivityKindFilter,
  ContentActivityShowTitleFilter,
  ContentActivityStatusFilter,
} from "@/config/content-activities-list";
import { CONTENT_ACTIVITIES_LIST_PAGE_SIZE } from "@/config/content-activities-list";
import {
  countContentActivitiesByKind,
  filterContentActivities,
  paginateContentActivities,
  sortContentActivities,
} from "@/lib/content-activities/list";
import type { ContentActivity } from "@/types/content-activity";

export function useContentActivitiesList(items: ContentActivity[]) {
  const [kindFilter, setKindFilter] =
    useState<ContentActivityKindFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<ContentActivityStatusFilter>("all");
  const [showTitleFilter, setShowTitleFilter] =
    useState<ContentActivityShowTitleFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ContentActivitiesListSort>("display-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CONTENT_ACTIVITIES_LIST_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const kindCounts = useMemo(() => countContentActivitiesByKind(items), [items]);

  const filteredItems = useMemo(
    () =>
      sortContentActivities(
        filterContentActivities(
          items,
          kindFilter,
          statusFilter,
          showTitleFilter,
          search,
        ),
        sort,
      ),
    [items, kindFilter, statusFilter, search, showTitleFilter, sort],
  );

  const pagination = useMemo(
    () => paginateContentActivities(filteredItems, page, pageSize),
    [filteredItems, page, pageSize],
  );

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? null;

  const hasActiveFilters =
    statusFilter !== "all" ||
    showTitleFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "display-desc";

  useEffect(() => {
    setPage(1);
    setPanelDismissed(false);
  }, [kindFilter, statusFilter, showTitleFilter, search, sort, pageSize]);

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
    setKindFilter("all");
    setStatusFilter("all");
    setShowTitleFilter("all");
    setSearch("");
    setSort("display-desc");
    setPage(1);
  }

  return {
    kindFilter,
    setKindFilter,
    kindCounts,
    statusFilter,
    setStatusFilter,
    showTitleFilter,
    setShowTitleFilter,
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
