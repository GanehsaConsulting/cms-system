"use client";

import { useMemo, useState } from "react";
import {
  BRAND_LIST_DEFAULT_SORT,
  type BrandListSort,
  type BrandStatusFilter,
} from "@/config/brand-list";
import { filterBrands, sortBrands } from "@/lib/brands/list";
import type { Brand } from "@/types/brand";

export function useBrandList(brands: Brand[]) {
  const [statusFilter, setStatusFilter] = useState<BrandStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BrandListSort>(BRAND_LIST_DEFAULT_SORT);

  const filteredBrands = useMemo(
    () => sortBrands(filterBrands(brands, statusFilter, search), sort),
    [brands, search, sort, statusFilter],
  );

  const hasActiveFilters =
    statusFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== BRAND_LIST_DEFAULT_SORT;

  function resetFilters() {
    setStatusFilter("all");
    setSearch("");
    setSort(BRAND_LIST_DEFAULT_SORT);
  }

  return {
    brands: filteredBrands,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    hasActiveFilters,
    resetFilters,
    totalCount: brands.length,
    filteredCount: filteredBrands.length,
  };
}
