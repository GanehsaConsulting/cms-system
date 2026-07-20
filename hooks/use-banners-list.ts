"use client";

import { useMemo, useState } from "react";
import type {
  BannerListSort,
  BannerStatusFilter,
} from "@/config/banner-list";
import { filterBanners, sortBanners } from "@/lib/banners/list";
import type { Banner } from "@/types/banner";

export function useBannersList(banners: Banner[]) {
  const [statusFilter, setStatusFilter] = useState<BannerStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BannerListSort>("updated-desc");

  const filteredBanners = useMemo(
    () => sortBanners(filterBanners(banners, statusFilter, search), sort),
    [banners, statusFilter, search, sort],
  );

  const hasActiveFilters =
    statusFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  function resetFilters() {
    setStatusFilter("all");
    setSearch("");
    setSort("updated-desc");
  }

  return {
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    filteredBanners,
    hasActiveFilters,
    resetFilters,
  };
}
