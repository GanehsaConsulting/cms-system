"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ClientFeaturedFilter,
  ClientsWorksAllListSort,
  ClientsWorksAllPortfolioFilter,
} from "@/config/clients-works-all";
import {
  groupClientsWithWorks,
} from "@/lib/clients/group-with-works";
import {
  filterClientsWorksAllGroups,
  sortClientsWorksAllGroups,
} from "@/lib/clients/works-all-list";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

export function useClientsWorksAllList(
  clients: Client[],
  portfolio: Portfolio[],
) {
  const [featuredFilter, setFeaturedFilter] =
    useState<ClientFeaturedFilter>("all");
  const [portfolioFilter, setPortfolioFilter] =
    useState<ClientsWorksAllPortfolioFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ClientsWorksAllListSort>("updated-desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);

  const allGroups = useMemo(
    () => groupClientsWithWorks(clients, portfolio),
    [clients, portfolio],
  );

  const groups = useMemo(
    () =>
      sortClientsWorksAllGroups(
        filterClientsWorksAllGroups(
          allGroups,
          featuredFilter,
          portfolioFilter,
          search,
        ),
        sort,
      ),
    [allGroups, featuredFilter, portfolioFilter, search, sort],
  );

  const selectedGroup =
    groups.find((group) => group.client.id === selectedId) ?? null;

  const hasActiveFilters =
    featuredFilter !== "all" ||
    portfolioFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== "updated-desc";

  const withWorksCount = groups.filter((group) => group.works.length > 0).length;
  const portfolioCount = groups.reduce(
    (total, group) => total + group.works.length,
    0,
  );

  useEffect(() => {
    setPanelDismissed(false);
  }, [featuredFilter, portfolioFilter, search, sort]);

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedId(null);
      return;
    }

    const stillVisible = groups.some((group) => group.client.id === selectedId);
    if (stillVisible) {
      return;
    }

    if (!panelDismissed) {
      setSelectedId(groups[0]?.client.id ?? null);
    }
  }, [groups, panelDismissed, selectedId]);

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
    setPortfolioFilter("all");
    setSearch("");
    setSort("updated-desc");
    setPanelDismissed(false);
  }

  return {
    allGroups,
    groups,
    featuredFilter,
    setFeaturedFilter,
    portfolioFilter,
    setPortfolioFilter,
    search,
    setSearch,
    sort,
    setSort,
    selectedId,
    selectedGroup,
    selectClient,
    closePanel,
    hasActiveFilters,
    resetFilters,
    clientCount: groups.length,
    withWorksCount,
    portfolioCount,
  };
}
