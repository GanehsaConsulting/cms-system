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
  BRAND_LIST_SORT_OPTIONS,
  BRAND_STATUS_FILTERS,
  type BrandListSort,
  type BrandStatusFilter,
} from "@/config/brand-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface BrandListFilterProps {
  statusFilter: BrandStatusFilter;
  sort: BrandListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: BrandStatusFilter) => void;
  onSortChange: (sort: BrandListSort) => void;
  onReset: () => void;
}

export function BrandListFilter({
  statusFilter,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onSortChange,
  onReset,
}: BrandListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="brand-status-filter">Status</Label>
          <Select
            value={statusFilter}
            items={toSelectItems(BRAND_STATUS_FILTERS)}
            onValueChange={(value) =>
              onStatusFilterChange(value as BrandStatusFilter)
            }
          >
            <SelectTrigger id="brand-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRAND_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="brand-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(BRAND_LIST_SORT_OPTIONS)}
            onValueChange={(value) => onSortChange(value as BrandListSort)}
          >
            <SelectTrigger id="brand-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRAND_LIST_SORT_OPTIONS.map((option) => (
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
