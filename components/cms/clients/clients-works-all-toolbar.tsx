"use client";

import { ClientsWorksAllFilter } from "@/components/cms/clients/clients-works-all-filter";
import { ClientsWorksAllSearch } from "@/components/cms/clients/clients-works-all-search";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type {
  ClientFeaturedFilter,
  ClientListSort,
  ClientsWorksAllPortfolioFilter,
} from "@/config/clients-works-all";

interface ClientsWorksAllToolbarProps {
  search: string;
  featuredFilter: ClientFeaturedFilter;
  portfolioFilter: ClientsWorksAllPortfolioFilter;
  sort: ClientListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onPortfolioFilterChange: (filter: ClientsWorksAllPortfolioFilter) => void;
  onSortChange: (sort: ClientListSort) => void;
  onResetFilters: () => void;
}

export function ClientsWorksAllToolbar({
  search,
  featuredFilter,
  portfolioFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onFeaturedFilterChange,
  onPortfolioFilterChange,
  onSortChange,
  onResetFilters,
}: ClientsWorksAllToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <ClientsWorksAllFilter
        featuredFilter={featuredFilter}
        portfolioFilter={portfolioFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onFeaturedFilterChange={onFeaturedFilterChange}
        onPortfolioFilterChange={onPortfolioFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <ClientsWorksAllSearch value={search} onChange={onSearchChange} />
      <ClientsWorksNewDataButton />
    </div>
  );
}
