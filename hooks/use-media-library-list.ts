"use client";

import { useEffect, useMemo, useState } from "react";
import { MEDIA_LIBRARY_IN_USE_PAGE_SIZE } from "@/config/media-library";
import type { MediaTypeFilter, MediaViewMode } from "@/types/media";
import {
  filterMediaAssetsBySearch,
  filterMediaAssetsByType,
  paginateMediaAssets,
} from "@/lib/media/list";
import {
  readStoredMediaViewMode,
  writeStoredMediaViewMode,
} from "@/lib/media/storage";
import type { MediaAsset } from "@/types/media";

export function useMediaLibraryList(assets: MediaAsset[]) {
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewModeState] = useState<MediaViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(MEDIA_LIBRARY_IN_USE_PAGE_SIZE);

  useEffect(() => {
    setViewModeState(readStoredMediaViewMode());
    setHydrated(true);
  }, []);

  function setViewMode(mode: MediaViewMode) {
    setViewModeState(mode);
    writeStoredMediaViewMode(mode);
  }

  const filteredAssets = useMemo(() => {
    const byType = filterMediaAssetsByType(assets, typeFilter);
    return filterMediaAssetsBySearch(byType, search);
  }, [assets, search, typeFilter]);

  const pagination = useMemo(
    () => paginateMediaAssets(filteredAssets, page, pageSize),
    [filteredAssets, page, pageSize],
  );

  useEffect(() => {
    setPage(1);
  }, [typeFilter, search, pageSize]);

  const hasActiveFilters =
    typeFilter !== "all" || search.trim().length > 0;

  function resetFilters() {
    setTypeFilter("all");
    setSearch("");
    setPage(1);
  }

  return {
    assets: pagination.items,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    viewMode: hydrated ? viewMode : "grid",
    setViewMode,
    page: pagination.page,
    setPage,
    pageSize,
    setPageSize,
    pagination,
    hasActiveFilters,
    resetFilters,
    totalCount: assets.length,
    filteredCount: filteredAssets.length,
  };
}
