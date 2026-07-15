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
  PORTFOLIO_LIST_SORT_OPTIONS,
  PORTFOLIO_WORK_TYPE_FILTERS,
  type PortfolioListSort,
  type PortfolioWorkTypeFilter,
} from "@/config/portfolio-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface PortfolioListFilterProps {
  workTypeFilter: PortfolioWorkTypeFilter;
  sort: PortfolioListSort;
  hasActiveFilters: boolean;
  onWorkTypeFilterChange: (filter: PortfolioWorkTypeFilter) => void;
  onSortChange: (sort: PortfolioListSort) => void;
  onReset: () => void;
}

export function PortfolioListFilter({
  workTypeFilter,
  sort,
  hasActiveFilters,
  onWorkTypeFilterChange,
  onSortChange,
  onReset,
}: PortfolioListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="portfolio-type-filter">Work type</Label>
          <Select
            value={workTypeFilter}
            items={toSelectItems(PORTFOLIO_WORK_TYPE_FILTERS)}
            onValueChange={(value) =>
              onWorkTypeFilterChange(value as PortfolioWorkTypeFilter)
            }
          >
            <SelectTrigger id="portfolio-type-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PORTFOLIO_WORK_TYPE_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="portfolio-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(PORTFOLIO_LIST_SORT_OPTIONS)}
            onValueChange={(value) => onSortChange(value as PortfolioListSort)}
          >
            <SelectTrigger id="portfolio-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PORTFOLIO_LIST_SORT_OPTIONS.map((option) => (
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
