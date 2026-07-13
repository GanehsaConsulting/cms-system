"use client";

import { PricesListFilter } from "@/components/cms/prices/prices-list-filter";
import { PricesListCreateButton } from "@/components/cms/prices/prices-list-create-button";
import { PricesListSearch } from "@/components/cms/prices/prices-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type { PriceListSort, PriceStatusFilter } from "@/config/price-list";

interface PricesListToolbarProps {
  search: string;
  statusFilter: PriceStatusFilter;
  serviceFilter: string;
  services: string[];
  sort: PriceListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: PriceStatusFilter) => void;
  onServiceFilterChange: (serviceSlug: string) => void;
  onSortChange: (sort: PriceListSort) => void;
  onResetFilters: () => void;
}

export function PricesListToolbar({
  search,
  statusFilter,
  serviceFilter,
  services,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onServiceFilterChange,
  onSortChange,
  onResetFilters,
}: PricesListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <PricesListFilter
        statusFilter={statusFilter}
        serviceFilter={serviceFilter}
        services={services}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onServiceFilterChange={onServiceFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <PricesListSearch value={search} onChange={onSearchChange} />
      <PricesListCreateButton />
    </div>
  );
}
