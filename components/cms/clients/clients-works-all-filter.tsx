"use client";

import { CmsListFilterPopover } from "@/components/shared/cms-list-filter-popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLIENT_FEATURED_FILTERS,
  CLIENT_LIST_SORT_OPTIONS,
  CLIENTS_WORKS_ALL_PORTFOLIO_FILTERS,
  type ClientFeaturedFilter,
  type ClientListSort,
  type ClientsWorksAllPortfolioFilter,
} from "@/config/clients-works-all";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";

interface ClientsWorksAllFilterProps {
  featuredFilter: ClientFeaturedFilter;
  portfolioFilter: ClientsWorksAllPortfolioFilter;
  sort: ClientListSort;
  hasActiveFilters: boolean;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onPortfolioFilterChange: (filter: ClientsWorksAllPortfolioFilter) => void;
  onSortChange: (sort: ClientListSort) => void;
  onReset: () => void;
}

export function ClientsWorksAllFilter({
  featuredFilter,
  portfolioFilter,
  sort,
  hasActiveFilters,
  onFeaturedFilterChange,
  onPortfolioFilterChange,
  onSortChange,
  onReset,
}: ClientsWorksAllFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-featured-filter">Visibility</Label>
          <Select
            value={featuredFilter}
            onValueChange={(value) =>
              onFeaturedFilterChange(value as ClientFeaturedFilter)
            }
          >
            <SelectTrigger id="all-featured-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_FEATURED_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-portfolio-filter">Portfolio</Label>
          <Select
            value={portfolioFilter}
            onValueChange={(value) =>
              onPortfolioFilterChange(value as ClientsWorksAllPortfolioFilter)
            }
          >
            <SelectTrigger id="all-portfolio-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS_WORKS_ALL_PORTFOLIO_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as ClientListSort)}
          >
            <SelectTrigger id="all-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_LIST_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CmsListFilterPopover>
  );
}
