"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ClientFeaturedFilter,
  ClientListSort,
} from "@/config/client-list";
import { CLIENT_LIST_PAGE_SIZE } from "@/config/client-list";
import {
  filterClients,
  paginateClients,
  sortClients,
} from "@/lib/clients/list";
import type { Client } from "@/types/client";

export function useClientsList(clients: Client[]) {
  const [featuredFilter, setFeaturedFilter] =
    useState<ClientFeaturedFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ClientListSort>("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CLIENT_LIST_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const filteredClients = useMemo(
    () =>
      sortClients(filterClients(clients, featuredFilter, search), sort),
    [clients, featuredFilter, search, sort],
  );

  const pagination = useMemo(
    () => paginateClients(filteredClients, page, pageSize),
    [filteredClients, page, pageSize],
  );

  const selectedClient =
    clients.find((client) => client.id === selectedId) ?? null;

  const hasActiveFilters =
    featuredFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  useEffect(() => {
    setPage(1);
    setPanelDismissed(false);
  }, [featuredFilter, search, sort, pageSize]);

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
      pagination.items.some((client) => client.id === selectedId);

    if (selectedStillVisible) {
      return;
    }

    if (!panelDismissed) {
      setSelectedId(pagination.items[0]?.id ?? null);
    }
  }, [pagination.items, panelDismissed, selectedId]);

  function selectClient(id: string) {
    setSelectedId(id);
    setPanelDismissed(false);
  }

  function closePanel() {
    setSelectedId(null);
    setPanelDismissed(true);
  }

  function resetFilters() {
    setFeaturedFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPage(1);
    setPanelDismissed(false);
  }

  return {
    featuredFilter,
    setFeaturedFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectClient,
    closePanel,
    pagination,
    selectedClient,
    hasActiveFilters,
    resetFilters,
  };
}
