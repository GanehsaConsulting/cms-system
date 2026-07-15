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
  CLIENTS_WORKS_ALL_PORTFOLIO_FILTERS,
  CLIENTS_WORKS_ALL_SORT_OPTIONS,
  type ClientFeaturedFilter,
  type ClientsWorksAllListSort,
  type ClientsWorksAllPortfolioFilter,
} from "@/config/clients-works-all";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface ClientsWorksAllFilterProps {
  featuredFilter: ClientFeaturedFilter;
  portfolioFilter: ClientsWorksAllPortfolioFilter;
  sort: ClientsWorksAllListSort;
  hasActiveFilters: boolean;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onPortfolioFilterChange: (filter: ClientsWorksAllPortfolioFilter) => void;
  onSortChange: (sort: ClientsWorksAllListSort) => void;
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
            items={toSelectItems(CLIENT_FEATURED_FILTERS)}
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
            items={toSelectItems(CLIENTS_WORKS_ALL_PORTFOLIO_FILTERS)}
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
            items={toSelectItems(CLIENTS_WORKS_ALL_SORT_OPTIONS)}
            onValueChange={(value) =>
              onSortChange(value as ClientsWorksAllListSort)
            }
          >
            <SelectTrigger id="all-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS_WORKS_ALL_SORT_OPTIONS.map((option) => (
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
