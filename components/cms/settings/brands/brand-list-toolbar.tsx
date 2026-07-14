"use client";

import { BrandListCreateButton } from "@/components/cms/settings/brands/brand-list-create-button";
import { BrandListFilter } from "@/components/cms/settings/brands/brand-list-filter";
import { BrandListSearch } from "@/components/cms/settings/brands/brand-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type { BrandListSort, BrandStatusFilter } from "@/config/brand-list";

interface BrandListToolbarProps {
  search: string;
  statusFilter: BrandStatusFilter;
  sort: BrandListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: BrandStatusFilter) => void;
  onSortChange: (sort: BrandListSort) => void;
  onResetFilters: () => void;
  onCreate: () => void;
}

export function BrandListToolbar({
  search,
  statusFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onResetFilters,
  onCreate,
}: BrandListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <BrandListFilter
        statusFilter={statusFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <BrandListSearch value={search} onChange={onSearchChange} />
      <BrandListCreateButton onClick={onCreate} />
    </div>
  );
}
