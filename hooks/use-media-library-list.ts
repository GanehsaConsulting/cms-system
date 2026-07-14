"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaTypeFilter, MediaViewMode } from "@/types/media";
import {
  filterMediaAssetsBySearch,
  filterMediaAssetsByType,
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

  const hasActiveFilters =
    typeFilter !== "all" || search.trim().length > 0;

  function resetFilters() {
    setTypeFilter("all");
    setSearch("");
  }

  return {
    assets: filteredAssets,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    viewMode: hydrated ? viewMode : "grid",
    setViewMode,
    hasActiveFilters,
    resetFilters,
    totalCount: assets.length,
    filteredCount: filteredAssets.length,
  };
}
