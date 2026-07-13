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
  BANNER_LIST_SORT_OPTIONS,
  BANNER_STATUS_FILTERS,
  type BannerListSort,
  type BannerStatusFilter,
} from "@/config/banner-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";

interface BannersListFilterProps {
  statusFilter: BannerStatusFilter;
  sort: BannerListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: BannerStatusFilter) => void;
  onSortChange: (sort: BannerListSort) => void;
  onReset: () => void;
}

export function BannersListFilter({
  statusFilter,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onSortChange,
  onReset,
}: BannersListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="banner-status-filter">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as BannerStatusFilter)
            }
          >
            <SelectTrigger id="banner-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BANNER_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="banner-sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as BannerListSort)}
          >
            <SelectTrigger id="banner-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BANNER_LIST_SORT_OPTIONS.map((option) => (
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
