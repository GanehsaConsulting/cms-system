"use client";

import { ClientsListCreateButton } from "@/components/cms/clients/clients-list-create-button";
import { ClientsListFilter } from "@/components/cms/clients/clients-list-filter";
import { ClientsListSearch } from "@/components/cms/clients/clients-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type {
  ClientFeaturedFilter,
  ClientListSort,
} from "@/config/client-list";

interface ClientsListToolbarProps {
  search: string;
  featuredFilter: ClientFeaturedFilter;
  sort: ClientListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onSortChange: (sort: ClientListSort) => void;
  onResetFilters: () => void;
}

export function ClientsListToolbar({
  search,
  featuredFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onFeaturedFilterChange,
  onSortChange,
  onResetFilters,
}: ClientsListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <ClientsListFilter
        featuredFilter={featuredFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onFeaturedFilterChange={onFeaturedFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <ClientsListSearch value={search} onChange={onSearchChange} />
      <ClientsListCreateButton />
    </div>
  );
}
