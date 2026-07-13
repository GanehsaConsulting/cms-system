"use client";

import { BannersListCreateButton } from "@/components/cms/banners/banners-list-create-button";
import { BannersListFilter } from "@/components/cms/banners/banners-list-filter";
import { BannersListSearch } from "@/components/cms/banners/banners-list-search";
import type {
  BannerListSort,
  BannerStatusFilter,
} from "@/config/banner-list";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";

interface BannersListToolbarProps {
  search: string;
  statusFilter: BannerStatusFilter;
  sort: BannerListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: BannerStatusFilter) => void;
  onSortChange: (sort: BannerListSort) => void;
  onResetFilters: () => void;
  onCreate: () => void;
}

export function BannersListToolbar({
  search,
  statusFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onResetFilters,
  onCreate,
}: BannersListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <BannersListFilter
        statusFilter={statusFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <BannersListSearch value={search} onChange={onSearchChange} />
      <BannersListCreateButton onClick={onCreate} />
    </div>
  );
}
