"use client";

import { PricesListFilter } from "@/components/cms/prices/prices-list-filter";
import { PricesListCreateButton } from "@/components/cms/prices/prices-list-create-button";
import { PricesListManageCategoriesButton } from "@/components/cms/prices/prices-list-manage-categories-button";
import { PricesListSearch } from "@/components/cms/prices/prices-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type { PriceListSort, PriceStatusFilter } from "@/config/price-list";
import type { PriceCategory } from "@/types/price-category";

interface PricesListToolbarProps {
  search: string;
  statusFilter: PriceStatusFilter;
  serviceFilter: string;
  services: string[];
  categories: PriceCategory[];
  sort: PriceListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: PriceStatusFilter) => void;
  onServiceFilterChange: (serviceSlug: string) => void;
  onSortChange: (sort: PriceListSort) => void;
  onResetFilters: () => void;
  onManageCategories: () => void;
}

export function PricesListToolbar({
  search,
  statusFilter,
  serviceFilter,
  services,
  categories,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onServiceFilterChange,
  onSortChange,
  onResetFilters,
  onManageCategories,
}: PricesListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <PricesListFilter
        statusFilter={statusFilter}
        serviceFilter={serviceFilter}
        services={services}
        categories={categories}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onServiceFilterChange={onServiceFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <PricesListSearch value={search} onChange={onSearchChange} />
      <PricesListManageCategoriesButton onClick={onManageCategories} />
      <PricesListCreateButton />
    </div>
  );
}
