"use client";

import { useEffect, useMemo, useState } from "react";
import type { PriceListSort, PriceStatusFilter } from "@/config/price-list";
import { PRICE_LIST_PAGE_SIZE } from "@/config/price-list";
import {
  filterPrices,
  getUniqueServiceSlugs,
  paginatePrices,
  sortPrices,
} from "@/lib/prices/list";
import type { Price } from "@/types/price";

export function usePricesList(prices: Price[]) {
  const [statusFilter, setStatusFilter] = useState<PriceStatusFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<PriceListSort>("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PRICE_LIST_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const services = useMemo(() => getUniqueServiceSlugs(prices), [prices]);

  const filteredPrices = useMemo(
    () =>
      sortPrices(
        filterPrices(prices, statusFilter, search, serviceFilter),
        sort,
      ),
    [prices, statusFilter, search, serviceFilter, sort],
  );

  const pagination = useMemo(
    () => paginatePrices(filteredPrices, page, pageSize),
    [filteredPrices, page, pageSize],
  );

  const selectedPrice =
    prices.find((price) => price.id === selectedId) ?? null;

  const hasActiveFilters =
    statusFilter !== "all" ||
    serviceFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  useEffect(() => {
    setPage(1);
    setPanelDismissed(false);
  }, [statusFilter, serviceFilter, search, sort, pageSize]);

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
      pagination.items.some((price) => price.id === selectedId);

    if (selectedStillVisible) {
      return;
    }

    if (!panelDismissed) {
      setSelectedId(pagination.items[0]?.id ?? null);
    }
  }, [pagination.items, panelDismissed, selectedId]);

  function selectPrice(id: string) {
    setSelectedId(id);
    setPanelDismissed(false);
  }

  function closePanel() {
    setSelectedId(null);
    setPanelDismissed(true);
  }

  function resetFilters() {
    setStatusFilter("all");
    setServiceFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPage(1);
    setPanelDismissed(false);
  }

  return {
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectPrice,
    closePanel,
    services,
    pagination,
    selectedPrice,
    hasActiveFilters,
    resetFilters,
  };
}
