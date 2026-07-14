"use client";

import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { PortfolioListFilter } from "@/components/cms/portfolio/portfolio-list-filter";
import { PortfolioListSearch } from "@/components/cms/portfolio/portfolio-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type {
  PortfolioListSort,
  PortfolioWorkTypeFilter,
} from "@/config/portfolio-list";

interface PortfolioListToolbarProps {
  search: string;
  workTypeFilter: PortfolioWorkTypeFilter;
  sort: PortfolioListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onWorkTypeFilterChange: (filter: PortfolioWorkTypeFilter) => void;
  onSortChange: (sort: PortfolioListSort) => void;
  onResetFilters: () => void;
}

export function PortfolioListToolbar({
  search,
  workTypeFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onWorkTypeFilterChange,
  onSortChange,
  onResetFilters,
}: PortfolioListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <PortfolioListFilter
        workTypeFilter={workTypeFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onWorkTypeFilterChange={onWorkTypeFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <PortfolioListSearch value={search} onChange={onSearchChange} />
      <ClientsWorksNewDataButton />
    </div>
  );
}
