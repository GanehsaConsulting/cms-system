"use client";

import { CmsListFilterPopover } from "@/components/shared/cms-list-filter-popover";
import { PricesListServiceFilterField } from "@/components/cms/prices/prices-list-service-filter-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRICE_LIST_SORT_OPTIONS,
  PRICE_STATUS_FILTERS,
  type PriceListSort,
  type PriceStatusFilter,
} from "@/config/price-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";

interface PricesListFilterProps {
  statusFilter: PriceStatusFilter;
  serviceFilter: string;
  services: string[];
  sort: PriceListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: PriceStatusFilter) => void;
  onServiceFilterChange: (serviceSlug: string) => void;
  onSortChange: (sort: PriceListSort) => void;
  onReset: () => void;
}

export function PricesListFilter({
  statusFilter,
  serviceFilter,
  services,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onServiceFilterChange,
  onSortChange,
  onReset,
}: PricesListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="price-status-filter">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as PriceStatusFilter)
            }
          >
            <SelectTrigger id="price-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICE_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PricesListServiceFilterField
          value={serviceFilter}
          services={services}
          onChange={onServiceFilterChange}
        />

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="price-sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as PriceListSort)}
          >
            <SelectTrigger id="price-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICE_LIST_SORT_OPTIONS.map((option) => (
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
