"use client";

import { ClientsWorksAllFilter } from "@/components/cms/clients/clients-works-all-filter";
import { ClientsWorksAllSearch } from "@/components/cms/clients/clients-works-all-search";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import type {
  ClientFeaturedFilter,
  ClientsWorksAllContentFilter,
  ClientsWorksAllListSort,
} from "@/config/clients-works-all";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";

interface ClientsWorksAllToolbarProps {
  search: string;
  featuredFilter: ClientFeaturedFilter;
  contentFilter: ClientsWorksAllContentFilter;
  sort: ClientsWorksAllListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onContentFilterChange: (filter: ClientsWorksAllContentFilter) => void;
  onSortChange: (sort: ClientsWorksAllListSort) => void;
  onResetFilters: () => void;
}

export function ClientsWorksAllToolbar({
  search,
  featuredFilter,
  contentFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onFeaturedFilterChange,
  onContentFilterChange,
  onSortChange,
  onResetFilters,
}: ClientsWorksAllToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <ClientsWorksAllFilter
        featuredFilter={featuredFilter}
        contentFilter={contentFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onFeaturedFilterChange={onFeaturedFilterChange}
        onContentFilterChange={onContentFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <ClientsWorksAllSearch value={search} onChange={onSearchChange} />
      <ClientsWorksNewDataButton />
    </div>
  );
}
