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
  type ClientFeaturedFilter,
  type ClientListSort,
} from "@/config/client-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface ClientsListFilterProps {
  featuredFilter: ClientFeaturedFilter;
  sort: ClientListSort;
  hasActiveFilters: boolean;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onSortChange: (sort: ClientListSort) => void;
  onReset: () => void;
}

export function ClientsListFilter({
  featuredFilter,
  sort,
  hasActiveFilters,
  onFeaturedFilterChange,
  onSortChange,
  onReset,
}: ClientsListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="client-featured-filter">Visibility</Label>
          <Select
            value={featuredFilter}
            items={toSelectItems(CLIENT_FEATURED_FILTERS)}
            onValueChange={(value) =>
              onFeaturedFilterChange(value as ClientFeaturedFilter)
            }
          >
            <SelectTrigger id="client-featured-filter" className="w-full">
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
          <Label htmlFor="client-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(CLIENT_LIST_SORT_OPTIONS)}
            onValueChange={(value) => onSortChange(value as ClientListSort)}
          >
            <SelectTrigger id="client-sort" className="w-full">
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
