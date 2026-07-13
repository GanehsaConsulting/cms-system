"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  BannerListSort,
  BannerStatusFilter,
} from "@/config/banner-list";
import { BANNER_LIST_PAGE_SIZE } from "@/config/banner-list";
import {
  filterBanners,
  paginateBanners,
  sortBanners,
} from "@/lib/banners/list";
import type { Banner } from "@/types/banner";

export function useBannersList(banners: Banner[]) {
  const [statusFilter, setStatusFilter] = useState<BannerStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BannerListSort>("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(BANNER_LIST_PAGE_SIZE);

  const filteredBanners = useMemo(
    () => sortBanners(filterBanners(banners, statusFilter, search), sort),
    [banners, statusFilter, search, sort],
  );

  const pagination = useMemo(
    () => paginateBanners(filteredBanners, page, pageSize),
    [filteredBanners, page, pageSize],
  );

  const hasActiveFilters =
    statusFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, sort, pageSize]);

  function resetFilters() {
    setStatusFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPage(1);
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
    pagination,
    hasActiveFilters,
    resetFilters,
  };
}
